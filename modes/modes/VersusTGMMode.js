// VersusTGMMode — Online 1v1 with player-chosen rotation system.
// 3-minute default timer. Win by opponent top-out or higher level when time expires.

class VersusTGMMode extends BaseMode {
  constructor() {
    super();
    this.modeName = "Versus TGM";
    this.description = "Online 1v1 — TGM rules, 3-min timer, level tiebreaker.";
    this.matchElapsed = 0;
    this.timeLimit = 180; // 3 minutes default (configurable in lobby)
    this.linesCleared = 0;
    this.timerExpired = false;
  }

  getModeConfig() {
    return {
      gravity: {
        type: "tgm1",
        value: 0,
        curve: null,
      },
      das: 16 / 60,
      arr: 1 / 60,
      are: 30 / 60,
      lineAre: 30 / 60,
      lockDelay: 0.5,
      lineClearDelay: 41 / 60,
      nextPieces: 1,
      holdEnabled: false,
      ghostEnabled: false,
      levelUpType: "piece",
      lineClearBonus: 1,
      gravityLevelCap: 999,
      specialMechanics: {
        versus: true,
        versusType: "tgm",
        garbageSend: true,
        timeLimit: this.timeLimit,
      },
    };
  }

  getBgmConfig(gameScene) {
    return {
      progressSource: "level",
      stopSource: "level",
      useStopBuffer: false,
      transitionStopOffset: 0,
      segments: [{ key: "mf_konohaez" }],
    };
  }

  initializeForGameScene(gameScene) {
    this.matchElapsed = 0;
    this.linesCleared = 0;
    this.timerExpired = false;
  }

  update(gameScene, deltaTime) {
    if (gameScene.gameOver || gameScene.isPaused) return;

    this.matchElapsed += deltaTime;

    // Check time limit
    if (!this.timerExpired && this.matchElapsed >= this.timeLimit) {
      this.timerExpired = true;
      // Notify server — server determines winner by level comparison
      if (gameScene.networkManager && gameScene.networkManager.inMatch) {
        gameScene.networkManager.sendTimeExpired();
      }
    }

    // Send periodic level updates for tiebreaker
    if (gameScene.networkManager && gameScene.networkManager.inMatch) {
      if (Math.floor(this.matchElapsed * 2) % 2 === 0) {
        gameScene.networkManager.sendLevelUpdate(gameScene.level || 0);
      }
    }
  }

  getRemainingTime() {
    return Math.max(0, this.timeLimit - this.matchElapsed);
  }

  handleLineClear(gameScene, count, pieceType) {
    this.linesCleared += count;
    if (gameScene.networkManager && gameScene.networkManager.inMatch) {
      gameScene.networkManager.sendLinesCleared(
        count,
        Math.max(0, Number(gameScene.lastVersusAttackSent) || 0),
      );
    }
  }

  onPieceLock(piece, game) {
    if (game.networkManager && game.networkManager.inMatch) {
      game.networkManager.sendPiecePlaced({
        piece: piece.type || piece,
        x: game.currentPieceCol,
        y: game.currentPieceRow,
        rotation: game.currentRotation,
      });
      game.networkManager.sendLevelUpdate(game.level || 0);
    }
    return true;
  }

  onGameOver(gameScene) {
    if (gameScene.networkManager && gameScene.networkManager.inMatch) {
      gameScene.networkManager.sendTopout();
    }
  }

  reset() {
    this.matchElapsed = 0;
    this.linesCleared = 0;
    this.timerExpired = false;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = VersusTGMMode;
}
if (typeof window !== "undefined") {
  window.VersusTGMMode = VersusTGMMode;
}
