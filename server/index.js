#!/usr/bin/env node
// Mino Freefall — Online 1v1 WebSocket Server
// Handles matchmaking, room lifecycle, Glicko-2 ratings, and game-event relay.

const { WebSocketServer } = require("ws");
const path = require("path");
const Database = require("better-sqlite3");
const {
  updateRating,
  createNewPlayer,
  isProvisional,
} = require("./glicko2");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PORT = parseInt(process.env.PORT, 10) || 8080;
const MATCHMAKING_INTERVAL_MS = 1000;
const MATCHMAKING_INITIAL_WINDOW = 50;
const MATCHMAKING_MAX_WINDOW = 200;
const MATCHMAKING_WIDEN_INTERVAL_S = 10; // widen every N seconds
const CHECKSUM_INTERVAL_MS = 5000;
const DISCONNECT_FORFEIT_MS = 10000;

// ---------------------------------------------------------------------------
// Database (SQLite)
// ---------------------------------------------------------------------------
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "db.sqlite");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Anon',
    rating INTEGER NOT NULL DEFAULT 1500,
    rd REAL NOT NULL DEFAULT 350,
    volatility REAL NOT NULL DEFAULT 0.06,
    games_played INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT NOT NULL,
    queue_type TEXT NOT NULL,
    player1_id TEXT NOT NULL,
    player2_id TEXT NOT NULL,
    winner_id TEXT,
    reason TEXT,
    seed INTEGER NOT NULL,
    duration_ms INTEGER,
    p1_rating_before INTEGER,
    p1_rating_after INTEGER,
    p2_rating_before INTEGER,
    p2_rating_after INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const stmts = {
  getPlayer: db.prepare("SELECT * FROM players WHERE id = ?"),
  upsertPlayer: db.prepare(`
    INSERT INTO players (id, name, rating, rd, volatility, games_played, wins, losses, updated_at)
    VALUES (@id, @name, @rating, @rd, @volatility, @gamesPlayed, @wins, @losses, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      name = @name, rating = @rating, rd = @rd, volatility = @volatility,
      games_played = @gamesPlayed, wins = @wins, losses = @losses,
      updated_at = datetime('now')
  `),
  insertMatch: db.prepare(`
    INSERT INTO matches (room_id, queue_type, player1_id, player2_id, winner_id, reason, seed, duration_ms,
      p1_rating_before, p1_rating_after, p2_rating_before, p2_rating_after)
    VALUES (@roomId, @queueType, @p1Id, @p2Id, @winnerId, @reason, @seed, @durationMs,
      @p1RatingBefore, @p1RatingAfter, @p2RatingBefore, @p2RatingAfter)
  `),
};

function getOrCreatePlayer(id, name) {
  let row = stmts.getPlayer.get(id);
  if (!row) {
    const p = createNewPlayer();
    stmts.upsertPlayer.run({
      id,
      name: name || "Anon",
      rating: p.rating,
      rd: p.rd,
      volatility: p.volatility,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
    });
    row = stmts.getPlayer.get(id);
  }
  return row;
}

function dbPlayerToGlicko(row) {
  return {
    rating: row.rating,
    rd: row.rd,
    volatility: row.volatility,
    gamesPlayed: row.games_played,
  };
}

/**
 * Compute MR (Mino Rating) from Glicko rating.
 * Asymptotically clamps from 0 to 40: MR = 40 * (1 - e^(-r / 1500))
 */
function computeMR(glickoRating) {
  const r = Math.max(0, glickoRating);
  const mr = 40 * (1 - Math.exp(-r / 1500));
  return Math.round(mr * 100) / 100;
}

// ---------------------------------------------------------------------------
// In-memory state
// ---------------------------------------------------------------------------
const clients = new Map(); // ws -> { id, name, rating, rd, gamesPlayed }
const queues = { guideline: [], tgm: [] }; // arrays of ws
const rooms = new Map(); // roomId -> Room

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function generateSeed() {
  return (Math.random() * 0xffffffff) >>> 0;
}

// ---------------------------------------------------------------------------
// Room
// ---------------------------------------------------------------------------
class Room {
  constructor(id, queueType, ws1, ws2, seed) {
    this.id = id;
    this.queueType = queueType;
    this.players = [ws1, ws2];
    this.seed = seed;
    this.startTime = Date.now();
    this.ended = false;
    this.disconnectTimers = new Map();
    this.checksumTimer = null;
    this.boards = new Map(); // ws -> last checksum
    this.levels = new Map(); // ws -> level (for TGM tiebreaker)

    // Store pre-match ratings
    const c1 = clients.get(ws1);
    const c2 = clients.get(ws2);
    this.p1RatingBefore = c1 ? c1.rating : 1500;
    this.p2RatingBefore = c2 ? c2.rating : 1500;
  }

  opponent(ws) {
    return this.players[0] === ws ? this.players[1] : this.players[0];
  }

  broadcast(msg, exclude) {
    const data = JSON.stringify(msg);
    for (const ws of this.players) {
      if (ws !== exclude && ws.readyState === 1) {
        ws.send(data);
      }
    }
  }

  send(ws, msg) {
    if (ws.readyState === 1) ws.send(JSON.stringify(msg));
  }

  startChecksums() {
    this.checksumTimer = setInterval(() => {
      this.broadcast({ type: "request_checksum" });
    }, CHECKSUM_INTERVAL_MS);
  }

  stopChecksums() {
    if (this.checksumTimer) {
      clearInterval(this.checksumTimer);
      this.checksumTimer = null;
    }
  }

  handleDisconnect(ws) {
    if (this.ended) return;
    const timer = setTimeout(() => {
      if (!this.ended) {
        this.endMatch(this.opponent(ws), "disconnect");
      }
    }, DISCONNECT_FORFEIT_MS);
    this.disconnectTimers.set(ws, timer);
    this.broadcast({ type: "opponent_disconnected" }, ws);
  }

  handleReconnect(ws) {
    const timer = this.disconnectTimers.get(ws);
    if (timer) {
      clearTimeout(timer);
      this.disconnectTimers.delete(ws);
    }
    this.broadcast({ type: "opponent_reconnected" }, ws);
  }

  endMatch(winner, reason) {
    if (this.ended) return;
    this.ended = true;
    this.stopChecksums();

    for (const [, timer] of this.disconnectTimers) clearTimeout(timer);
    this.disconnectTimers.clear();

    const loser = this.opponent(winner);
    const c1 = clients.get(this.players[0]);
    const c2 = clients.get(this.players[1]);
    if (!c1 || !c2) return;

    const winnerId = clients.get(winner)?.id;
    const loserId = clients.get(loser)?.id;
    if (!winnerId || !loserId) return;

    const winRow = getOrCreatePlayer(winnerId);
    const loseRow = getOrCreatePlayer(loserId);
    const winG = dbPlayerToGlicko(winRow);
    const loseG = dbPlayerToGlicko(loseRow);

    const newWin = updateRating(winG, loseG, 1);
    const newLose = updateRating(loseG, winG, 0);

    stmts.upsertPlayer.run({
      id: winnerId,
      name: winRow.name,
      rating: newWin.rating,
      rd: newWin.rd,
      volatility: newWin.volatility,
      gamesPlayed: newWin.gamesPlayed,
      wins: winRow.wins + 1,
      losses: winRow.losses,
    });
    stmts.upsertPlayer.run({
      id: loserId,
      name: loseRow.name,
      rating: newLose.rating,
      rd: newLose.rd,
      volatility: newLose.volatility,
      gamesPlayed: newLose.gamesPlayed,
      wins: loseRow.wins,
      losses: loseRow.losses + 1,
    });

    const durationMs = Date.now() - this.startTime;
    stmts.insertMatch.run({
      roomId: this.id,
      queueType: this.queueType,
      p1Id: c1.id,
      p2Id: c2.id,
      winnerId,
      reason,
      seed: this.seed,
      durationMs,
      p1RatingBefore: this.p1RatingBefore,
      p1RatingAfter: this.players[0] === winner ? newWin.rating : newLose.rating,
      p2RatingBefore: this.p2RatingBefore,
      p2RatingAfter: this.players[1] === winner ? newWin.rating : newLose.rating,
    });

    // Update in-memory client state
    const wc = clients.get(winner);
    if (wc) { wc.rating = newWin.rating; wc.rd = newWin.rd; wc.gamesPlayed = newWin.gamesPlayed; }
    const lc = clients.get(loser);
    if (lc) { lc.rating = newLose.rating; lc.rd = newLose.rd; lc.gamesPlayed = newLose.gamesPlayed; }

    const matchResult = {
      type: "match_end",
      winnerId,
      loserId,
      reason,
      durationMs,
    };

    this.send(winner, {
      ...matchResult,
      ratingDelta: newWin.rating - winRow.rating,
      newRating: newWin.rating,
      newRd: newWin.rd,
      newMR: computeMR(newWin.rating),
      provisional: isProvisional(newWin),
    });

    this.send(loser, {
      ...matchResult,
      ratingDelta: newLose.rating - loseRow.rating,
      newRating: newLose.rating,
      newRd: newLose.rd,
      newMR: computeMR(newLose.rating),
      provisional: isProvisional(newLose),
    });

    // Remove room reference from players
    for (const ws of this.players) {
      const c = clients.get(ws);
      if (c) c.room = null;
    }

    rooms.delete(this.id);
  }
}

// ---------------------------------------------------------------------------
// Matchmaking
// ---------------------------------------------------------------------------
function tryMatch(queueName) {
  const queue = queues[queueName];
  if (queue.length < 2) return;

  // Sort by rating
  queue.sort((a, b) => {
    const ca = clients.get(a);
    const cb = clients.get(b);
    return (ca?.rating || 1500) - (cb?.rating || 1500);
  });

  const now = Date.now();
  for (let i = 0; i < queue.length - 1; i++) {
    const ws1 = queue[i];
    const ws2 = queue[i + 1];
    const c1 = clients.get(ws1);
    const c2 = clients.get(ws2);
    if (!c1 || !c2) continue;

    const elapsed1 = (now - (c1.queueTime || now)) / 1000;
    const elapsed2 = (now - (c2.queueTime || now)) / 1000;
    const maxElapsed = Math.max(elapsed1, elapsed2);
    const window = Math.min(
      MATCHMAKING_MAX_WINDOW,
      MATCHMAKING_INITIAL_WINDOW + Math.floor(maxElapsed / MATCHMAKING_WIDEN_INTERVAL_S) * 50
    );

    if (Math.abs(c1.rating - c2.rating) <= window) {
      // Match found
      queue.splice(i, 2);
      createRoom(queueName, ws1, ws2);
      return;
    }
  }
}

function createRoom(queueType, ws1, ws2) {
  const roomId = generateId();
  const seed = generateSeed();
  const room = new Room(roomId, queueType, ws1, ws2, seed);
  rooms.set(roomId, room);

  const c1 = clients.get(ws1);
  const c2 = clients.get(ws2);
  if (c1) c1.room = roomId;
  if (c2) c2.room = roomId;

  const startTimestamp = Date.now() + 3000; // 3s countdown

  room.send(ws1, {
    type: "match_found",
    roomId,
    seed,
    startTimestamp,
    queueType,
    opponent: {
      id: c2.id,
      name: c2.name,
      rating: c2.rating,
      provisional: isProvisional({ gamesPlayed: c2.gamesPlayed }),
    },
  });

  room.send(ws2, {
    type: "match_found",
    roomId,
    seed,
    startTimestamp,
    queueType,
    opponent: {
      id: c1.id,
      name: c1.name,
      rating: c1.rating,
      provisional: isProvisional({ gamesPlayed: c1.gamesPlayed }),
    },
  });

  room.startChecksums();
}

// Run matchmaker on interval
setInterval(() => {
  tryMatch("guideline");
  tryMatch("tgm");
}, MATCHMAKING_INTERVAL_MS);

// ---------------------------------------------------------------------------
// WebSocket Server
// ---------------------------------------------------------------------------
const wss = new WebSocketServer({ port: PORT });

console.log(`[Server] Listening on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    switch (msg.type) {
      case "identify": {
        const id = msg.playerId || generateId();
        const name = (msg.name || "Anon").slice(0, 20);
        const row = getOrCreatePlayer(id, name);
        clients.set(ws, {
          id,
          name: row.name,
          rating: row.rating,
          rd: row.rd,
          gamesPlayed: row.games_played,
          room: null,
        });
        ws.send(JSON.stringify({
          type: "identified",
          playerId: id,
          name: row.name,
          rating: row.rating,
          rd: row.rd,
          mr: computeMR(row.rating),
          gamesPlayed: row.games_played,
          provisional: isProvisional(dbPlayerToGlicko(row)),
          wins: row.wins,
          losses: row.losses,
        }));
        break;
      }

      case "queue": {
        const c = clients.get(ws);
        if (!c) return;
        const queueType = msg.queueType === "tgm" ? "tgm" : "guideline";
        // Remove from any existing queue
        for (const q of Object.values(queues)) {
          const idx = q.indexOf(ws);
          if (idx !== -1) q.splice(idx, 1);
        }
        c.queueTime = Date.now();
        queues[queueType].push(ws);
        ws.send(JSON.stringify({ type: "queued", queueType, position: queues[queueType].length }));
        break;
      }

      case "cancel_queue": {
        for (const q of Object.values(queues)) {
          const idx = q.indexOf(ws);
          if (idx !== -1) q.splice(idx, 1);
        }
        ws.send(JSON.stringify({ type: "queue_cancelled" }));
        break;
      }

      case "piece_placed": {
        const c = clients.get(ws);
        if (!c || !c.room) return;
        const room = rooms.get(c.room);
        if (!room || room.ended) return;
        // Relay to opponent
        room.broadcast({ type: "opponent_piece_placed", data: msg.data }, ws);
        break;
      }

      case "lines_cleared": {
        const c = clients.get(ws);
        if (!c || !c.room) return;
        const room = rooms.get(c.room);
        if (!room || room.ended) return;
        const count = Math.min(4, Math.max(0, parseInt(msg.count, 10) || 0));
        // Standard garbage: single=0, double=1, triple=2, tetris=4
        const garbageTable = { 0: 0, 1: 0, 2: 1, 3: 2, 4: 4 };
        const garbage = garbageTable[count] || 0;
        if (garbage > 0) {
          const opp = room.opponent(ws);
          const holeCol = Math.floor(Math.random() * 10);
          room.send(opp, {
            type: "garbage_incoming",
            rows: garbage,
            holeCol,
          });
        }
        // Relay line clear info
        room.broadcast({
          type: "opponent_lines_cleared",
          count,
          playerId: c.id,
        }, ws);
        break;
      }

      case "board_update": {
        const c = clients.get(ws);
        if (!c || !c.room) return;
        const room = rooms.get(c.room);
        if (!room || room.ended) return;
        // Relay compressed board snapshot to opponent for mini preview
        room.broadcast({ type: "opponent_board_update", board: msg.board }, ws);
        break;
      }

      case "board_checksum": {
        const c = clients.get(ws);
        if (!c || !c.room) return;
        const room = rooms.get(c.room);
        if (!room || room.ended) return;
        room.boards.set(ws, msg.checksum);
        // Check if both checksums are in — desync detection (informational)
        if (room.boards.size === 2) {
          const vals = [...room.boards.values()];
          if (vals[0] !== vals[1]) {
            room.broadcast({ type: "desync_warning" });
          }
          room.boards.clear();
        }
        break;
      }

      case "level_update": {
        const c = clients.get(ws);
        if (!c || !c.room) return;
        const room = rooms.get(c.room);
        if (!room || room.ended) return;
        room.levels.set(ws, parseInt(msg.level, 10) || 0);
        room.broadcast({ type: "opponent_level_update", level: msg.level, playerId: c.id }, ws);
        break;
      }

      case "topout": {
        const c = clients.get(ws);
        if (!c || !c.room) return;
        const room = rooms.get(c.room);
        if (!room || room.ended) return;
        room.endMatch(room.opponent(ws), "topout");
        break;
      }

      case "time_expired": {
        const c = clients.get(ws);
        if (!c || !c.room) return;
        const room = rooms.get(c.room);
        if (!room || room.ended) return;
        // TGM tiebreaker: higher level wins
        const ws1 = room.players[0];
        const ws2 = room.players[1];
        const l1 = room.levels.get(ws1) || 0;
        const l2 = room.levels.get(ws2) || 0;
        const winner = l1 >= l2 ? ws1 : ws2;
        room.endMatch(winner, "time_expired");
        break;
      }

      case "rematch_request": {
        const c = clients.get(ws);
        if (!c) return;
        // Re-queue the player in same queue type
        // The opponent can also re-queue; they'll be matched again if close
        break;
      }

      case "ping": {
        ws.send(JSON.stringify({ type: "pong", ts: msg.ts }));
        break;
      }

      default:
        break;
    }
  });

  ws.on("close", () => {
    // Remove from queues
    for (const q of Object.values(queues)) {
      const idx = q.indexOf(ws);
      if (idx !== -1) q.splice(idx, 1);
    }
    // Handle room disconnect
    const c = clients.get(ws);
    if (c && c.room) {
      const room = rooms.get(c.room);
      if (room) room.handleDisconnect(ws);
    }
    clients.delete(ws);
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("[Server] Shutting down...");
  wss.close(() => {
    db.close();
    process.exit(0);
  });
});
