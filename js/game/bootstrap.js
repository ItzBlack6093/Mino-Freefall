const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  // Improve text sharpness on high-DPI displays
  resolution: window.devicePixelRatio || 1,
  scene: [
    BootScene,
    MenuScene,
    SettingsScene,
    MatchmakingScene,
    AssetLoaderScene,
    LoadingScreenScene,
    GameScene,
  ],
  backgroundColor: "#000000",
  fps: 60,
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
    desynchronized: false,
    powerPreference: "high-performance",
    clearBeforeRender: true,
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const existingGame = window.__minoGame;
if (existingGame && typeof existingGame.destroy === "function") {
  try {
    existingGame.destroy(true);
  } catch (e) {
  }
  window.__minoGame = null;
}

const gameContainer = document.getElementById("game-container");
if (gameContainer) {
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
}

const game = new Phaser.Game(config);
window.__minoGame = game;

// Limit frame rate to 60fps
game.loop.maxFps = 60;

// Handle window resize
if (window.__minoResizeHandler) {
  window.removeEventListener("resize", window.__minoResizeHandler);
}

window.__minoResizeHandler = () => {
  const activeGame = window.__minoGame;
  if (!activeGame || !activeGame.scale) return;

  activeGame.scale.resize(window.innerWidth, window.innerHeight);
  if (activeGame.scene.scenes.length > 0) {
    activeGame.scene.scenes.forEach(scene => {
      if (scene && scene.calculateLayout) {
        scene.calculateLayout();
      }
    });
  }
};
window.addEventListener("resize", window.__minoResizeHandler);
