const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");

const APP_ROOT = path.resolve(__dirname, "..");
const DEFAULT_VERSUS_SERVER_URL =
  process.env.MINO_VERSUS_SERVER_URL || "ws://127.0.0.1:8080";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".wav": "audio/wav",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

let staticServer = null;
let staticOrigin = null;
let mainWindow = null;

app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("enable-gpu-rasterization");

function getDesktopConfig() {
  return {
    isDesktop: true,
    runtime: "electron",
    platform: process.platform,
    versions: {
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      node: process.versions.node,
    },
    versusServerUrl: DEFAULT_VERSUS_SERVER_URL,
  };
}

function resolveRequestPath(urlPath) {
  const pathname = new URL(urlPath || "/", "http://127.0.0.1").pathname;
  const trimmedPath = pathname === "/" ? "/index.html" : pathname;
  const resolvedPath = path.resolve(APP_ROOT, `.${trimmedPath}`);
  const relativePath = path.relative(APP_ROOT, resolvedPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return resolvedPath;
}

async function readStaticAsset(urlPath) {
  const candidatePath = resolveRequestPath(urlPath);
  if (!candidatePath) {
    return null;
  }

  let stat;
  try {
    stat = await fs.stat(candidatePath);
  } catch {
    return null;
  }

  const filePath = stat.isDirectory()
    ? path.join(candidatePath, "index.html")
    : candidatePath;

  try {
    const contents = await fs.readFile(filePath);
    return { contents, filePath };
  } catch {
    return null;
  }
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const asset = await readStaticAsset(req.url || "/");
      if (!asset) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      const extension = path.extname(asset.filePath).toLowerCase();
      res.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type":
          MIME_TYPES[extension] || "application/octet-stream",
      });
      res.end(asset.contents);
    });

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Failed to determine desktop server port."));
        return;
      }

      resolve({
        server,
        origin: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

function createMainWindow() {
  const iconPath = path.join(APP_ROOT, "img", "mino.png");

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 960,
    minHeight: 720,
    autoHideMenuBar: true,
    backgroundColor: "#000000",
    show: false,
    icon: iconPath,
    webPreferences: {
      backgroundThrottling: false,
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadURL(`${staticOrigin}/index.html`);
}

ipcMain.handle("mino-desktop:get-config", () => getDesktopConfig());
ipcMain.handle("mino-desktop:toggle-fullscreen", () => {
  if (!mainWindow) {
    return false;
  }

  const nextState = !mainWindow.isFullScreen();
  mainWindow.setFullScreen(nextState);
  return nextState;
});

app.whenReady()
  .then(async () => {
    const serverInfo = await startStaticServer();
    staticServer = serverInfo.server;
    staticOrigin = serverInfo.origin;

    createMainWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  })
  .catch((error) => {
    console.error("Failed to start the Electron shell.", error);
    app.quit();
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (staticServer) {
    staticServer.close();
    staticServer = null;
  }
});
