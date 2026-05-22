(function attachDefaultKeybinds(global) {
  function buildDefaultKeybinds() {
    const { KeyCodes } = Phaser.Input.Keyboard;

    return {
      // Match the common modern Guideline-style keyboard layout.
      moveLeft: KeyCodes.LEFT,
      moveRight: KeyCodes.RIGHT,
      softDrop: KeyCodes.DOWN,
      hardDrop: KeyCodes.SPACE,
      rotateCW: KeyCodes.X,
      rotateCW2: KeyCodes.UP,
      rotateCCW: KeyCodes.Z,
      rotateCCW2: KeyCodes.CTRL,
      rotate180: KeyCodes.A,
      hold: KeyCodes.C,
      backstep: KeyCodes.BACKSPACE,
      pause: KeyCodes.ESC,
      menu: KeyCodes.M,
      start: KeyCodes.ENTER,
      restart: KeyCodes.R,
    };
  }

  function getDefaultKeybinds() {
    return buildDefaultKeybinds();
  }

  function getMergedKeybinds(storage) {
    const defaultKeybinds = buildDefaultKeybinds();
    const stored = storage?.getItem?.("keybinds");

    if (!stored) {
      return defaultKeybinds;
    }

    try {
      const parsed = JSON.parse(stored);
      return { ...defaultKeybinds, ...parsed };
    } catch (error) {
      console.error("Failed to parse stored keybinds:", error);
      return defaultKeybinds;
    }
  }

  global.MinoKeybinds = {
    getDefaultKeybinds,
    getMergedKeybinds,
  };
})(window);
