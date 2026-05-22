# Desktop App

Mino Freefall can now run as a packaged desktop app on Windows and Linux through Electron.

## Requirements

- Node.js 20+
- npm 11+

## Install dependencies

```bash
npm install
```

## Run the desktop app in development

```bash
npm run desktop:dev
```

The Electron shell starts a tiny local static server so the Phaser loader can fetch assets over `http://127.0.0.1:*` instead of `file://`.

## Build distributables

Build on the target OS you care about:

- Linux packages:

  ```bash
  npm run desktop:dist:linux
  ```

- Windows packages:

  ```bash
  npm run desktop:dist:win
  ```

Artifacts are written to `release/`.

## Online versus server

The desktop client still expects a WebSocket server for versus matchmaking.

- Default server URL: `ws://127.0.0.1:8080`
- Production server URL behind the included Caddy setup: `wss://your-server.example/ws`
- Override at launch time:

  ```bash
  MINO_VERSUS_SERVER_URL=wss://your-server.example/ws npm run desktop:dev
  ```

- Run the repo's server locally:

  ```bash
  npm run server:install
  npm run server:start
  ```

- Full free-hosting deployment steps: `ONLINE_PVP_DEPLOYMENT.md`

## Desktop controls

- `F11` toggles fullscreen
- `Alt+Enter` toggles fullscreen
