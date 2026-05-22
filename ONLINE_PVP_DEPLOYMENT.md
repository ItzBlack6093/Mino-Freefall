# Online PvP Deployment

This repo is now set up for a free-hosted online PvP server using a Google Cloud Compute Engine free-tier VM.

Why this target:

- It supports long-running Node processes.
- It supports WebSockets without a platform sleep timeout.
- It gives you persistent disk space for the SQLite rating database.
- It works well with a simple reverse proxy and automatic HTTPS.
- It can fit in the free tier with an `e2-micro` VM in an eligible US region.

## What was added

- `server/Dockerfile` builds the WebSocket matchmaking server.
- `docker-compose.yml` runs the Node server and Caddy together.
- `Caddyfile` terminates HTTPS and exposes the WebSocket endpoint at `/ws`.
- `.env.example` contains the domain-based settings to fill in before deploy.

## Server behavior

- Health check: `https://your-domain.example/health`
- WebSocket endpoint: `wss://your-domain.example/ws`
- SQLite data path in the container: `/data/db.sqlite`
- Allowed browser origins come from `ALLOWED_ORIGINS`
- Desktop and Electron clients still work because requests without an `Origin` header are allowed

## 1. Create the free VM

Create an Ubuntu VM in Google Cloud Compute Engine, then point your DNS `A` record at the VM's public IP.

Recommended settings:

- Machine type: `e2-micro`
- Region: one of the Compute Engine free-tier eligible US regions
- Boot disk: Ubuntu LTS

Open these ports in the Google Cloud VPC firewall and on the VM firewall:

- `80/tcp`
- `443/tcp`
- `22/tcp`

If you use `ufw` on the VM:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 2. Install Docker on the VM

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker
docker --version
docker compose version
```

## 3. Copy the project to the VM

Clone the repo or copy the directory over, then fill in the deployment env file:

```bash
cp .env.example .env
```

Set:

- `DOMAIN` to the hostname you pointed at the VM
- `ALLOWED_ORIGINS` to the browser origins allowed to open matchmaking sockets

Example:

```bash
DOMAIN=play.example.com
ALLOWED_ORIGINS=https://play.example.com,https://www.play.example.com
```

## 4. Start the online server

```bash
docker compose up -d --build
```

Check the containers:

```bash
docker compose ps
docker compose logs -f mino-server
docker compose logs -f caddy
```

## 5. Connect the game client

### Browser build on the same domain

If you later serve the browser client from the same host as the PvP server, it now defaults to:

```text
wss://your-domain.example/ws
```

No extra change is needed as long as the page itself is loaded from the same domain.

### Browser build on a different domain

Set a global override before `js/network/NetworkManager.js` loads in `index.html`:

```html
<script>
  window.MINO_VERSUS_SERVER_URL = "wss://play.example.com/ws";
</script>
```

### Desktop build

Launch the Electron app with:

```bash
MINO_VERSUS_SERVER_URL=wss://play.example.com/ws npm run desktop:dev
```

## 6. Verify the deployment

From your own machine:

```bash
curl https://play.example.com/health
```

You should get JSON with `status`, `clients`, `rooms`, and queue counts.

## Notes

- Ratings and match history persist in the Docker volume `mino_server_data`.
- The Node server accepts both `ws://host:8080` for local development and `wss://domain/ws` behind Caddy.
- If you want tighter browser security, keep `ALLOWED_ORIGINS` limited to the exact site origins that should be able to connect.
- If your VM IP changes, update your DNS record before testing the public `wss://` endpoint.
