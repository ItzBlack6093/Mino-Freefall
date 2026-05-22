// VersusGuidelineMode — Online 1v1 with SRS rotation, standard garbage, no time limit.
// Gravity increases every 30 seconds up to 20G. Win by surviving (opponent tops out).

class VersusGuidelineMode extends BaseMode {
  constructor() {
    super();
    this.modeName = "Versus Guideline";
    this.description = "Online 1v1 — SRS, garbage sends, last player standing wins.";
    this.matchElapsed = 0; // seconds since match start
    this.linesCleared = 0;
  }

  getModeConfig() {
    return {
      gravity: {
        type: "custom",
        value: 4,
        curve: (level) => this.getTimedGravity(),
      },
      das: 10 / 60,
      arr: 2 / 60,
      are: 0,
      lineAre: 0,
      lockDelay: 0.5,
      lineClearDelay: 0,
      nextPieces: 5,
      holdEnabled: true,
      ghostEnabled: true,
      levelUpType: "lines",
      lineClearBonus: 1,
      gravityLevelCap: 999,
      specialMechanics: {
        versus: true,
        versusType: "guideline",
        rotationLock: "SRS",
        garbageSend: true,
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

  getTimedGravity() {
    // Gravity increases every 30 seconds, capped at 20G (5120)
    const step = Math.floor(this.matchElapsed / 30);
    const table = [4, 16, 32, 64, 128, 256, 512, 1024, 2048, 5120];
    return table[Math.min(step, table.length - 1)];
  }

  getGravitySpeed(level) {
    return this.getTimedGravity();
  }

  initializeForGameScene(gameScene) {
    this.matchElapsed = 0;
    this.linesCleared = 0;
  }

  update(gameScene, deltaTime) {
    if (!gameScene.gameOver && !gameScene.isPaused) {
      this.matchElapsed += deltaTime;
    }
  }

  handleLineClear(gameScene, count, pieceType) {
    this.linesCleared += count;
    // Notify network of line clears for garbage
    if (gameScene.networkManager && gameScene.networkManager.inMatch) {
      gameScene.networkManager.sendLinesCleared(
        count,
        Math.max(0, Number(gameScene.lastVersusAttackSent) || 0),
      );
    }
  }

  onPieceLock(piece, game) {
    // Send piece placement to opponent
    if (game.networkManager && game.networkManager.inMatch) {
      game.networkManager.sendPiecePlaced({
        piece: piece.type || piece,
        x: game.currentPieceCol,
        y: game.currentPieceRow,
        rotation: game.currentRotation,
      });
    }
    return true;
  }

  onGameOver(gameScene) {
    // Notify server of topout
    if (gameScene.networkManager && gameScene.networkManager.inMatch) {
      gameScene.networkManager.sendTopout();
    }
  }

  reset() {
    this.matchElapsed = 0;
    this.linesCleared = 0;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = VersusGuidelineMode;
}
if (typeof window !== "undefined") {
  window.VersusGuidelineMode = VersusGuidelineMode;
}
