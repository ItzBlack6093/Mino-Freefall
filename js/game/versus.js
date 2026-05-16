// ---------------------------------------------------------------------------
// MR (Mino Rating) — global helper for client-side computation
// Asymptotically clamps from 0 to 40: MR = 40 * (1 - e^(-r / 1500))
// ---------------------------------------------------------------------------
function computeMRClient(glickoRating) {
  const r = Math.max(0, glickoRating);
  const mr = 40 * (1 - Math.exp(-r / 1500));
  return Math.round(mr * 100) / 100;
}

// ---------------------------------------------------------------------------
// MatchmakingScene — Queue UI, rating display, opponent info
// ---------------------------------------------------------------------------
class MatchmakingScene extends Phaser.Scene {
  constructor() {
    super({ key: "MatchmakingScene" });
    this.networkManager = null;
    this.queueType = null;
    this.searchingText = null;
    this.waitTimer = 0;
    this.dots = 0;
  }

  init(data) {
    this.queueType = data.queueType || "guideline";
    this.serverUrl = data.serverUrl || "ws://localhost:8080";
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.cameras.main.setBackgroundColor("#000000");

    // Title
    this.add
      .text(centerX, 60, "VERSUS — MATCHMAKING", {
        fontSize: "32px",
        fill: "#ffcc00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Initialize NetworkManager
    if (!window.__minoNetworkManager) {
      window.__minoNetworkManager = new NetworkManager();
    }
    this.networkManager = window.__minoNetworkManager;

    // Player ID (persisted in localStorage)
    let playerId = localStorage.getItem("mino_player_id");
    if (!playerId) {
      playerId = "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem("mino_player_id", playerId);
    }
    let playerName = localStorage.getItem("mino_player_name") || "Player";

    // Rating display
    this.ratingText = this.add
      .text(centerX, 120, "Rating: ...", {
        fontSize: "20px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.statsText = this.add
      .text(centerX, 150, "", {
        fontSize: "16px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Queue type label
    const queueLabel = this.queueType === "tgm" ? "TGM Versus" : "Guideline Versus";
    this.add
      .text(centerX, 200, `Queue: ${queueLabel}`, {
        fontSize: "22px",
        fill: "#00ffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Searching text
    this.searchingText = this.add
      .text(centerX, centerY, "Searching for opponent...", {
        fontSize: "24px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.waitTimeText = this.add
      .text(centerX, centerY + 40, "0s", {
        fontSize: "16px",
        fill: "#666666",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Cancel button
    const cancelBtn = this.add
      .text(centerX, centerY + 100, "[ CANCEL ]", {
        fontSize: "20px",
        fill: "#ff4444",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    cancelBtn.on("pointerdown", () => {
      this.networkManager.cancelQueue();
      this.networkManager.disconnect();
      this.scene.start("MenuScene");
    });
    cancelBtn.on("pointerover", () => cancelBtn.setStyle({ fill: "#ff8888" }));
    cancelBtn.on("pointerout", () => cancelBtn.setStyle({ fill: "#ff4444" }));

    // Keyboard cancel
    this.input.keyboard.on("keydown-ESC", () => {
      this.networkManager.cancelQueue();
      this.networkManager.disconnect();
      this.scene.start("MenuScene");
    });

    // MR display
    this.mrText = this.add
      .text(centerX, 90, "", {
        fontSize: "28px",
        fill: "#ffcc00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Network event handlers
    this.networkManager.on("identified", (data) => {
      const mr = computeMRClient(data.rating);
      this.ratingText.setText(
        data.provisional
          ? "Rating: ? (provisional)"
          : `Rating: ${data.rating}  |  Glicko: ${data.rating}  |  RD: ${data.rd}`
      );
      this.mrText.setText(
        data.provisional
          ? "MR: ?.??"
          : `MR: ${(data.mr != null ? data.mr : mr).toFixed(2)}`
      );
      this.statsText.setText(`W: ${data.wins}  L: ${data.losses}  Games: ${data.gamesPlayed}`);
      // Join queue after identification
      this.networkManager.joinQueue(this.queueType);
    });

    this.networkManager.on("queued", () => {
      this.searchingText.setText("Searching for opponent...");
    });

    this.networkManager.on("match_found", (data) => {
      this.searchingText.setText(`Opponent found: ${data.opponent.name}`);
      // Transition to game after brief delay
      this.time.delayedCall(500, () => {
        const modeId = this.queueType === "tgm" ? "versus_tgm" : "versus_guideline";
        const modeManager = getModeManager();
        const mode = modeManager.getMode(modeId);

        // Store match data for GameScene
        window.__versusMatchData = {
          seed: data.seed,
          startTimestamp: data.startTimestamp,
          opponent: data.opponent,
          queueType: data.queueType,
          roomId: data.roomId,
        };

        const startLevelCap = typeof getStartingLevelCapForMode === "function"
          ? getStartingLevelCapForMode(mode)
          : 999;
        this.scene.start("AssetLoaderScene", {
          mode: modeId,
          gameMode: mode,
          startingLevel: 0,
        });
      });
    });

    this.networkManager.on("reconnect_failed", () => {
      this.searchingText.setText("Connection failed. Press ESC to return.");
      this.searchingText.setStyle({ fill: "#ff0000" });
    });

    // Connect and identify
    this.networkManager.connect(this.serverUrl);
    this.networkManager.identify(playerId, playerName);
  }

  update(time, delta) {
    this.waitTimer += delta / 1000;
    const secs = Math.floor(this.waitTimer);
    if (this.waitTimeText) {
      this.waitTimeText.setText(`${secs}s`);
    }
    // Animate dots
    this.dots = (this.dots + 1) % 120;
    const dotCount = Math.floor(this.dots / 30) + 1;
    if (this.searchingText && this.searchingText.text.startsWith("Searching")) {
      this.searchingText.setText("Searching for opponent" + ".".repeat(dotCount));
    }
  }
}

// ---------------------------------------------------------------------------
// VersusHUD — Opponent field preview, garbage queue, timer, connection status
// Drawn as an overlay on top of GameScene when in versus mode.
// ---------------------------------------------------------------------------
class VersusHUD {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.opponentGrid = [];
    this.garbageQueue = 0;
    this.garbageBar = null;
    this.latencyText = null;
    this.timerText = null;
    this.opponentNameText = null;
    this.connectionDot = null;
  }

  create() {
    const scene = this.scene;
    const cam = scene.cameras.main;
    const x = cam.width - 180;
    const y = 40;

    this.container = scene.add.container(x, y);

    // Opponent name
    const matchData = window.__versusMatchData;
    const oppName = matchData?.opponent?.name || "Opponent";
    this.opponentNameText = scene.add
      .text(0, 0, oppName, {
        fontSize: "14px",
        fill: "#ffcc00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0);
    this.container.add(this.opponentNameText);

    // Mini playfield (10x20 grid, each cell 6px)
    const cellSize = 6;
    const gridX = 0;
    const gridY = 20;
    this.miniGraphics = scene.add.graphics();
    this.container.add(this.miniGraphics);
    this.miniGridX = gridX;
    this.miniGridY = gridY;
    this.miniCellSize = cellSize;

    // Draw empty grid border
    this.miniGraphics.lineStyle(1, 0x444444);
    this.miniGraphics.strokeRect(gridX, gridY, cellSize * 10, cellSize * 20);

    // Garbage bar (right of mini field)
    this.garbageGraphics = scene.add.graphics();
    this.container.add(this.garbageGraphics);
    this.garbageBarX = gridX + cellSize * 10 + 4;
    this.garbageBarY = gridY;
    this.garbageBarHeight = cellSize * 20;

    // Connection latency
    this.latencyText = scene.add
      .text(0, gridY + cellSize * 20 + 8, "-- ms", {
        fontSize: "11px",
        fill: "#666666",
        fontFamily: "Courier New",
      })
      .setOrigin(0);
    this.container.add(this.latencyText);

    // Connection dot
    this.connectionDot = scene.add.graphics();
    this.container.add(this.connectionDot);
    this.updateConnectionDot(true);

    // Timer (for TGM mode)
    this.timerText = scene.add
      .text(0, gridY + cellSize * 20 + 24, "", {
        fontSize: "14px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0);
    this.container.add(this.timerText);

    // Opponent rating
    const oppRating = matchData?.opponent?.provisional
      ? "?"
      : (matchData?.opponent?.rating || "?");
    this.oppRatingText = scene.add
      .text(80, 0, `[${oppRating}]`, {
        fontSize: "12px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0);
    this.container.add(this.oppRatingText);

    this.container.setDepth(1000);
  }

  updateOpponentBoard(boardData) {
    if (!this.miniGraphics || !boardData) return;
    this.miniGraphics.clear();

    const cs = this.miniCellSize;
    const ox = this.miniGridX;
    const oy = this.miniGridY;

    // Draw border
    this.miniGraphics.lineStyle(1, 0x444444);
    this.miniGraphics.strokeRect(ox, oy, cs * 10, cs * 20);

    // Draw filled cells
    for (let r = 0; r < 20 && r < boardData.length; r++) {
      const row = boardData[r];
      if (!row) continue;
      for (let c = 0; c < 10 && c < row.length; c++) {
        if (row[c] !== 0) {
          this.miniGraphics.fillStyle(0xaaaaaa, 0.8);
          this.miniGraphics.fillRect(ox + c * cs, oy + r * cs, cs - 1, cs - 1);
        }
      }
    }
  }

  updateGarbageQueue(count) {
    this.garbageQueue = count;
    if (!this.garbageGraphics) return;
    this.garbageGraphics.clear();

    const maxRows = 20;
    const barWidth = 6;
    const filledRows = Math.min(count, maxRows);
    const cs = this.miniCellSize;

    // Draw bar background
    this.garbageGraphics.fillStyle(0x222222, 1);
    this.garbageGraphics.fillRect(
      this.garbageBarX, this.garbageBarY, barWidth, this.garbageBarHeight
    );

    // Draw filled portion (from bottom)
    if (filledRows > 0) {
      const fillHeight = filledRows * cs;
      this.garbageGraphics.fillStyle(0xff0000, 0.8);
      this.garbageGraphics.fillRect(
        this.garbageBarX,
        this.garbageBarY + this.garbageBarHeight - fillHeight,
        barWidth,
        fillHeight
      );
    }
  }

  updateLatency(ms) {
    if (!this.latencyText) return;
    const color = ms < 50 ? "#00ff00" : ms < 100 ? "#ffff00" : "#ff0000";
    this.latencyText.setText(`${ms}ms`);
    this.latencyText.setStyle({ fill: color, fontSize: "11px", fontFamily: "Courier New" });
  }

  updateTimer(remainingSeconds) {
    if (!this.timerText) return;
    if (remainingSeconds <= 0) {
      this.timerText.setText("TIME!");
      this.timerText.setStyle({ fill: "#ff0000", fontSize: "14px", fontFamily: "Courier New", fontStyle: "bold" });
    } else {
      const min = Math.floor(remainingSeconds / 60);
      const sec = Math.floor(remainingSeconds % 60);
      this.timerText.setText(`${min}:${sec.toString().padStart(2, "0")}`);
      const color = remainingSeconds <= 30 ? "#ff4444" : "#ffffff";
      this.timerText.setStyle({ fill: color, fontSize: "14px", fontFamily: "Courier New", fontStyle: "bold" });
    }
  }

  updateConnectionDot(connected) {
    if (!this.connectionDot) return;
    this.connectionDot.clear();
    this.connectionDot.fillStyle(connected ? 0x00ff00 : 0xff0000, 1);
    this.connectionDot.fillCircle(150, 6, 4);
  }

  destroy() {
    if (this.container) {
      this.container.destroy(true);
      this.container = null;
    }
  }
}

// ---------------------------------------------------------------------------
// Versus integration helpers for GameScene
// ---------------------------------------------------------------------------
function initVersusMode(gameScene) {
  const matchData = window.__versusMatchData;
  if (!matchData) return;

  const nm = window.__minoNetworkManager;
  if (!nm) return;

  gameScene.networkManager = nm;
  gameScene.versusActive = true;
  gameScene.versusGarbageQueue = 0;
  gameScene.versusSeed = matchData.seed;

  // Create VersusHUD
  gameScene.versusHUD = new VersusHUD(gameScene);
  gameScene.versusHUD.create();

  // Board update interval (send compressed board to opponent every 500ms)
  gameScene.versusBoardTimer = 0;

  // Network event listeners for GameScene
  nm.on("garbage_incoming", (data) => {
    gameScene.versusGarbageQueue += data.rows;
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateGarbageQueue(gameScene.versusGarbageQueue);
    }
  });

  nm.on("opponent_board_update", (board) => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateOpponentBoard(board);
    }
  });

  nm.on("latency", (ms) => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateLatency(ms);
    }
  });

  nm.on("opponent_disconnected", () => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateConnectionDot(false);
    }
  });

  nm.on("opponent_reconnected", () => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateConnectionDot(true);
    }
  });

  nm.on("request_checksum", () => {
    if (gameScene.board && gameScene.board.grid) {
      const checksum = computeBoardChecksum(gameScene.board.grid);
      nm.sendBoardChecksum(checksum);
    }
  });

  nm.on("match_end", (data) => {
    gameScene.versusMatchResult = data;
    showVersusResult(gameScene, data);
  });

  // Clear match data so it doesn't persist
  window.__versusMatchData = null;
}

function updateVersusMode(gameScene, deltaTime) {
  if (!gameScene.versusActive || !gameScene.networkManager) return;

  // Apply queued garbage
  if (gameScene.versusGarbageQueue > 0 && !gameScene.lineClearDelayActive) {
    const rows = gameScene.versusGarbageQueue;
    gameScene.versusGarbageQueue = 0;
    if (gameScene.board) {
      gameScene.board.addCheeseRows(rows, 50);
    }
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateGarbageQueue(0);
    }
  }

  // Periodic board updates to opponent
  gameScene.versusBoardTimer = (gameScene.versusBoardTimer || 0) + deltaTime;
  if (gameScene.versusBoardTimer >= 0.5) {
    gameScene.versusBoardTimer = 0;
    if (gameScene.board && gameScene.board.grid) {
      // Send bottom 20 rows
      const grid = gameScene.board.grid;
      const visible = grid.slice(Math.max(0, grid.length - 20));
      const compressed = visible.map((row) => row.map((c) => (c !== 0 ? 1 : 0)));
      gameScene.networkManager.sendBoardUpdate(compressed);
    }
  }

  // Update TGM timer display
  if (
    gameScene.versusHUD &&
    gameScene.gameMode &&
    typeof gameScene.gameMode.getRemainingTime === "function"
  ) {
    gameScene.versusHUD.updateTimer(gameScene.gameMode.getRemainingTime());
  }
}

function computeBoardChecksum(grid) {
  let hash = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      hash = ((hash << 5) - hash + (grid[r][c] !== 0 ? 1 : 0)) | 0;
    }
  }
  return hash;
}

function showVersusResult(gameScene, data) {
  const centerX = gameScene.cameras.main.width / 2;
  const centerY = gameScene.cameras.main.height / 2;

  const won = data.winnerId === gameScene.networkManager?.playerId;
  const resultText = won ? "YOU WIN!" : "YOU LOSE";
  const resultColor = won ? "#00ff88" : "#ff4444";

  // Overlay background
  const overlay = gameScene.add.graphics();
  overlay.fillStyle(0x000000, 0.7);
  overlay.fillRect(0, 0, gameScene.cameras.main.width, gameScene.cameras.main.height);
  overlay.setDepth(2000);

  gameScene.add
    .text(centerX, centerY - 60, resultText, {
      fontSize: "48px",
      fill: resultColor,
      fontFamily: "Courier New",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setDepth(2001);

  const deltaStr = data.ratingDelta >= 0 ? `+${data.ratingDelta}` : `${data.ratingDelta}`;

  // MR display (prominent)
  const newMR = data.newMR != null ? data.newMR : computeMRClient(data.newRating || 1500);
  const mrLine = data.provisional
    ? "MR: ?.??"
    : `MR: ${newMR.toFixed(2)}`;

  gameScene.add
    .text(centerX, centerY - 10, mrLine, {
      fontSize: "28px",
      fill: "#ffcc00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  // Rating / Glicko / RD line
  const ratingLine = data.provisional
    ? `Rating: ? (provisional) (${deltaStr})`
    : `Rating: ${data.newRating} (${deltaStr})  |  RD: ${data.newRd}`;

  gameScene.add
    .text(centerX, centerY + 20, ratingLine, {
      fontSize: "16px",
      fill: "#ffffff",
      fontFamily: "Courier New",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  const reasonMap = { topout: "Top Out", disconnect: "Disconnect", time_expired: "Time Up" };
  gameScene.add
    .text(centerX, centerY + 50, `Reason: ${reasonMap[data.reason] || data.reason}`, {
      fontSize: "14px",
      fill: "#888888",
      fontFamily: "Courier New",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  // Return to menu button
  const menuBtn = gameScene.add
    .text(centerX, centerY + 100, "[ RETURN TO MENU ]", {
      fontSize: "20px",
      fill: "#00ffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(2001);

  menuBtn.on("pointerdown", () => {
    gameScene.scene.start("MenuScene");
  });
  menuBtn.on("pointerover", () => menuBtn.setStyle({ fill: "#ffffff" }));
  menuBtn.on("pointerout", () => menuBtn.setStyle({ fill: "#00ffff" }));

  // Keyboard: Enter to return
  gameScene.input.keyboard.once("keydown-ENTER", () => {
    gameScene.scene.start("MenuScene");
  });
}

// Initialize game after all classes are defined
