const { contextBridge, ipcRenderer } = require("electron");

const DEFAULT_VERSUS_SERVER_URL =
  process.env.MINO_VERSUS_SERVER_URL || "ws://127.0.0.1:8080";

contextBridge.exposeInMainWorld("minoDesktop", {
  isDesktop: true,
  platform: process.platform,
  runtime: "electron",
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
  },
  versusServerUrl: DEFAULT_VERSUS_SERVER_URL,
  toggleFullscreen: () => ipcRenderer.invoke("mino-desktop:toggle-fullscreen"),
  getConfig: () => ipcRenderer.invoke("mino-desktop:get-config"),
});
