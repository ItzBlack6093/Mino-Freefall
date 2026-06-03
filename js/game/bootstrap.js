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
    BgmRoomScene,
    MatchmakingScene,
    AssetLoaderScene,
    LoadingScreenScene,
    GameScene,
    ResultsScene,
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
window.__minoViewportSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Limit frame rate to 60fps
game.loop.maxFps = 60;

// Handle window resize
if (window.__minoResizeHandler) {
  window.removeEventListener("resize", window.__minoResizeHandler);
}

if (window.__minoResizeFrame) {
  cancelAnimationFrame(window.__minoResizeFrame);
  window.__minoResizeFrame = null;
}

window.__minoResizeHandler = () => {
  const activeGame = window.__minoGame;
  if (!activeGame || !activeGame.scale) return;

  const gameContainer = document.getElementById("game-container");
  const nextWidth = Math.max(1, Math.floor(gameContainer?.clientWidth || window.innerWidth));
  const nextHeight = Math.max(1, Math.floor(gameContainer?.clientHeight || window.innerHeight));
  const previousViewport = window.__minoViewportSize || {};

  if (
    previousViewport.width === nextWidth &&
    previousViewport.height === nextHeight
  ) {
    return;
  }

  window.__minoViewportSize = { width: nextWidth, height: nextHeight };

  if (window.__minoResizeFrame) {
    cancelAnimationFrame(window.__minoResizeFrame);
  }

  window.__minoResizeFrame = window.requestAnimationFrame(() => {
    window.__minoResizeFrame = null;

    activeGame.scale.resize(nextWidth, nextHeight);
    if (activeGame.scene.scenes.length <= 0) return;

    const viewport = {
      width: nextWidth,
      height: nextHeight,
      previousWidth: previousViewport.width || nextWidth,
      previousHeight: previousViewport.height || nextHeight,
    };

    activeGame.scene.scenes.forEach((scene) => {
      const isSceneActive = !!scene?.sys?.settings?.active;
      if (!isSceneActive) {
        return;
      }

      const camera = scene?.cameras?.main;
      if (camera) {
        if (typeof camera.setSize === "function") {
          camera.setSize(nextWidth, nextHeight);
        }
        if (typeof camera.setViewport === "function") {
          camera.setViewport(0, 0, nextWidth, nextHeight);
        }
      }

      if (typeof scene.handleViewportResize === "function") {
        scene.handleViewportResize(viewport);
        return;
      }

      if (typeof scene.calculateLayout === "function") {
        scene.calculateLayout(viewport);
      }
    });
  });
};
window.addEventListener("resize", window.__minoResizeHandler);
