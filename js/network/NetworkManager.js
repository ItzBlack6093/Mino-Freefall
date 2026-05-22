// NetworkManager — thin wrapper around WebSocket for the 1v1 versus system.
// Handles connect, auto-reconnect, send queue, ping/pong latency tracking.

class NetworkManager {
  constructor() {
    this.ws = null;
    this.serverUrl = null;
    this.playerId = null;
    this.playerName = null;
    this.connected = false;
    this.identified = false;

    // Player state from server
    this.rating = 1500;
    this.rd = 350;
    this.gamesPlayed = 0;
    this.provisional = true;
    this.wins = 0;
    this.losses = 0;

    // Match state
    this.roomId = null;
    this.seed = null;
    this.queueType = null;
    this.opponent = null;
    this.inMatch = false;
    this.matchStartTimestamp = null;

    // Latency tracking
    this.latency = 0;
    this._pingInterval = null;
    this._pingTs = 0;

    // Reconnection
    this._reconnectTimer = null;
    this._reconnectAttempts = 0;
    this._maxReconnectAttempts = 10;
    this._reconnectBaseDelay = 1000;

    // Event listeners
    this._listeners = {};

    // Send queue (for messages while disconnected)
    this._sendQueue = [];
  }

  // -----------------------------------------------------------------------
  // Event system
  // -----------------------------------------------------------------------
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter((cb) => cb !== callback);
  }

  _emit(event, data) {
    if (!this._listeners[event]) return;
    for (const cb of this._listeners[event]) {
      try { cb(data); } catch (e) { console.error("[Network] listener error", event, e); }
    }
  }

  // -----------------------------------------------------------------------
  // Connection
  // -----------------------------------------------------------------------
  connect(url) {
    const desktopUrl =
      typeof window !== "undefined" ? window.minoDesktop?.versusServerUrl : null;
    this.serverUrl = url || desktopUrl || "ws://localhost:8080";
    this._doConnect();
  }

  _doConnect() {
    if (this.ws) {
      try { this.ws.close(); } catch {}
    }
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onopen = () => {
      this.connected = true;
      this._reconnectAttempts = 0;
      this._flushQueue();
      this._startPing();
      this._emit("connected");

      // Auto-identify
      if (this.playerId) {
        this.send({ type: "identify", playerId: this.playerId, name: this.playerName });
      }
    };

    this.ws.onmessage = (evt) => {
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }
      this._handleMessage(msg);
    };

    this.ws.onclose = () => {
      this.connected = false;
      this._stopPing();
      this._emit("disconnected");
      this._scheduleReconnect();
    };

    this.ws.onerror = () => {
      // onclose will fire after this
    };
  }

  disconnect() {
    this._stopPing();
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
    if (this.ws) {
      try { this.ws.close(); } catch {}
      this.ws = null;
    }
    this.connected = false;
    this.identified = false;
    this.inMatch = false;
    this.roomId = null;
  }

  _scheduleReconnect() {
    if (this._reconnectAttempts >= this._maxReconnectAttempts) {
      this._emit("reconnect_failed");
      return;
    }
    const delay = this._reconnectBaseDelay * Math.pow(1.5, this._reconnectAttempts);
    this._reconnectAttempts++;
    this._reconnectTimer = setTimeout(() => {
      this._doConnect();
    }, delay);
  }

  // -----------------------------------------------------------------------
  // Send
  // -----------------------------------------------------------------------
  send(msg) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      this._sendQueue.push(msg);
    }
  }

  _flushQueue() {
    while (this._sendQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(this._sendQueue.shift()));
    }
  }

  // -----------------------------------------------------------------------
  // Ping/Pong
  // -----------------------------------------------------------------------
  _startPing() {
    this._stopPing();
    this._pingInterval = setInterval(() => {
      this._pingTs = Date.now();
      this.send({ type: "ping", ts: this._pingTs });
    }, 3000);
  }

  _stopPing() {
    if (this._pingInterval) {
      clearInterval(this._pingInterval);
      this._pingInterval = null;
    }
  }

  // -----------------------------------------------------------------------
  // Message handling
  // -----------------------------------------------------------------------
  _handleMessage(msg) {
    switch (msg.type) {
      case "identified":
        this.identified = true;
        this.playerId = msg.playerId;
        this.playerName = msg.name;
        this.rating = msg.rating;
        this.rd = msg.rd;
        this.gamesPlayed = msg.gamesPlayed;
        this.provisional = msg.provisional;
        this.wins = msg.wins;
        this.losses = msg.losses;
        this._emit("identified", msg);
        break;

      case "queued":
        this.queueType = msg.queueType;
        this._emit("queued", msg);
        break;

      case "queue_cancelled":
        this.queueType = null;
        this._emit("queue_cancelled", msg);
        break;

      case "match_found":
        this.roomId = msg.roomId;
        this.seed = msg.seed;
        this.matchStartTimestamp = msg.startTimestamp;
        this.opponent = msg.opponent;
        this.inMatch = true;
        this._emit("match_found", msg);
        break;

      case "opponent_piece_placed":
        this._emit("opponent_piece_placed", msg.data);
        break;

      case "opponent_lines_cleared":
        this._emit("opponent_lines_cleared", msg);
        break;

      case "opponent_board_update":
        this._emit("opponent_board_update", msg.payload || msg.board);
        break;

      case "opponent_level_update":
        this._emit("opponent_level_update", msg);
        break;

      case "garbage_incoming":
        this._emit("garbage_incoming", msg);
        break;

      case "request_checksum":
        this._emit("request_checksum");
        break;

      case "desync_warning":
        this._emit("desync_warning");
        break;

      case "opponent_disconnected":
        this._emit("opponent_disconnected");
        break;

      case "opponent_reconnected":
        this._emit("opponent_reconnected");
        break;

      case "match_end":
        this.inMatch = false;
        this.roomId = null;
        this.rating = msg.newRating;
        this.rd = msg.newRd;
        this.provisional = msg.provisional;
        if (msg.winnerId === this.playerId) {
          this.wins++;
        } else {
          this.losses++;
        }
        this.gamesPlayed++;
        this._emit("match_end", msg);
        break;

      case "pong":
        this.latency = Date.now() - (msg.ts || this._pingTs);
        this._emit("latency", this.latency);
        break;

      default:
        this._emit(msg.type, msg);
        break;
    }
  }

  // -----------------------------------------------------------------------
  // High-level actions
  // -----------------------------------------------------------------------
  identify(playerId, name) {
    this.playerId = playerId;
    this.playerName = name;
    this.send({ type: "identify", playerId, name });
  }

  joinQueue(queueType) {
    this.send({ type: "queue", queueType });
  }

  cancelQueue() {
    this.send({ type: "cancel_queue" });
  }

  sendPiecePlaced(data) {
    this.send({ type: "piece_placed", data });
  }

  sendLinesCleared(count, attack = null, chunks = null) {
    const payload = {
      type: "lines_cleared",
      count,
      attack,
    };
    if (Array.isArray(chunks) && chunks.length > 0) {
      payload.chunks = chunks;
    }
    this.send(payload);
  }

  sendBoardUpdate(payload) {
    this.send({ type: "board_update", payload });
  }

  sendBoardChecksum(checksum) {
    this.send({ type: "board_checksum", checksum });
  }

  sendLevelUpdate(level) {
    this.send({ type: "level_update", level });
  }

  sendTopout() {
    this.send({ type: "topout" });
  }

  sendTimeExpired() {
    this.send({ type: "time_expired" });
  }
}

// Export for both browser and Node
if (typeof module !== "undefined" && module.exports) {
  module.exports = NetworkManager;
}
if (typeof window !== "undefined") {
  window.NetworkManager = NetworkManager;
}
