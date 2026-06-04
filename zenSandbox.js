// Zen Sandbox helper utilities (shared across scenes)
// Exposes global `ZenSandboxHelper`
(function (global) {
  const STORAGE_KEY = "zen_sandbox_config";

  const defaults = {
    bagType: "7bag", // options: 7bag, 14bag, 7plus1, history, random, pairs, classic
    attackTableType: "guideline", // options: guideline, multiplier
    cheeseMode: "off", // options: off, fixed_rows, fixed_timing
    cheesePercent: 0, // 0-100
    cheeseRows: 1, // rows to add per trigger
    cheeseInterval: 2, // seconds between injections for fixed_timing
    movementResetsInfinite: false, // allow infinite lock delay resets
    spinType: "standard", // options: standard, t_only, all
    gravityMode: "none", // none, low, slow, medium, fast, static
    gravityRowsPerFrame: 0, // used when gravityMode === "static"
    minosaGuideMode: "off", // off, survival, tetris, tspin
    minosaGuideLookahead: 3, // 1-5
    minosaGuideCandidateLimit: 8, // 1-16
    bagChanged: false, // UI notice flag
    displayMode: "versus", // none, versus, speed, efficiency
  };

  function loadConfig() {
    if (typeof localStorage === "undefined") return { ...defaults };
    const raw = localStorage.getItem(STORAGE_KEY);
    let parsed = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = null;
    }
    const cfg = { ...defaults, ...(parsed || {}) };
    // Backward compatibility: rename old "default" attack table to "multiplier"
    if (cfg.attackTableType === "default") {
      cfg.attackTableType = "multiplier";
    }
    return cfg;
  }

  function saveConfig(updates) {
    const merged = { ...loadConfig(), ...(updates || {}) };
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {}
    }
    return merged;
  }

  const PIECES = ["I", "J", "L", "O", "S", "T", "Z"];
  const DEFAULT_MINOSA_GUIDE_MODES = ["survival", "tetris", "tspin"];

  function clampInteger(value, min, max, fallback) {
    const numericValue = Math.round(Number(value));
    if (!Number.isFinite(numericValue)) return fallback;
    return Math.max(min, Math.min(max, numericValue));
  }

  function getMinosaGuideModeOptions() {
    const exposedModes = Array.isArray(global.Minosa?.GUIDE_MODES)
      ? global.Minosa.GUIDE_MODES
      : DEFAULT_MINOSA_GUIDE_MODES;
    const uniqueModes = [...new Set(exposedModes.filter((mode) => typeof mode === "string" && mode.trim()))];
    const labels = {
      survival: "Survival",
      tetris: "Tetris",
      tspin: "T-Spin",
    };
    return [
      { label: "off", value: "off" },
      ...uniqueModes.map((mode) => ({
        label: labels[mode] || mode,
        value: mode,
      })),
    ];
  }

  function getBagTypeOptions() {
    if (typeof global.BagRandomizers !== "undefined") {
      return global.BagRandomizers.list()
        .filter((system) => system.id !== "tgm3")
        .map((system) => ({ label: system.label, value: system.id }));
    }
    return [
      { label: "7-Bag", value: "7bag" },
      { label: "7+1", value: "7plus1" },
      { label: "14-Bag", value: "14bag" },
      { label: "History", value: "history" },
      { label: "Classic (no dupes)", value: "classic" },
      { label: "Pairs", value: "pairs" },
      { label: "Pure Random", value: "random" },
    ];
  }

  function createShuffledBag() {
    if (typeof global.BagRandomizers !== "undefined") {
      return global.BagRandomizers.createShuffledBag();
    }
    const bag = [...PIECES];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
  }

  function refillBagQueue(runtime, bagType) {
    if (typeof global.BagRandomizers !== "undefined") {
      const activeBagType = global.BagRandomizers.normalize(bagType);
      runtime.bagType = activeBagType;
      if (activeBagType === "random" || activeBagType === "history") return;
      if (runtime.bagQueue?.length > 0) return;
      const piece = global.BagRandomizers.next(runtime, activeBagType);
      if (piece) runtime.bagQueue.unshift(piece);
      return;
    }
    runtime.bagQueue = runtime.bagQueue || [];
    if (runtime.bagQueue.length > 0) return;

    switch (bagType) {
      case "14bag": {
        const first = createShuffledBag();
        const second = createShuffledBag();
        runtime.bagQueue.push(...first, ...second);
        break;
      }
      case "pairs": {
        const bag = createShuffledBag();
        for (let i = 0; i < bag.length; i += 2) {
          const a = bag[i];
          const b = bag[(i + 1) % bag.length];
          runtime.bagQueue.push(a, b, b, a); // alternate within each randomized pair
        }
        break;
      }
      case "classic": {
        // Classic random with no immediate repeats
        const last = runtime.lastClassicPiece || null;
        const pool = PIECES.filter((p) => p !== last);
        const pick = pool[Math.floor(Math.random() * pool.length)];
        runtime.bagQueue.push(pick);
        runtime.lastClassicPiece = pick;
        break;
      }
      case "7plus1": {
        const base = createShuffledBag();
        const extra = PIECES[Math.floor(Math.random() * PIECES.length)];
        runtime.bagQueue.push(...base, extra);
        break;
      }
      case "random": {
        // Pure random, no bag queue needed
        break;
      }
      case "history": {
        // Use TGM1-style history via existing generator if available
        break;
      }
      case "7bag":
      default: {
        runtime.bagQueue.push(...createShuffledBag());
        break;
      }
    }
  }

  function nextPieceFromBag(scene) {
    if (!scene || !scene.zenSandboxConfig) {
      return PIECES[Math.floor(Math.random() * (scene ? scene.PIECES?.length || PIECES.length : PIECES.length))];
    }
    const configuredBagType = scene.zenSandboxConfig.bagType || "7bag";
    const runtime = scene.zenSandboxRuntime || { bagQueue: [], bagType: configuredBagType };
    scene.zenSandboxRuntime = runtime;
    if (!runtime.bagType) {
      runtime.bagType = configuredBagType;
    }
    const activeBagType = runtime.bagType || configuredBagType;

    if (typeof global.BagRandomizers !== "undefined") {
      const normalized = global.BagRandomizers.normalize(activeBagType);
      runtime.bagType = normalized;
      if (normalized === "history" && typeof scene.generateTGM1Piece === "function") {
        return scene.generateTGM1Piece();
      }
      return global.BagRandomizers.next(runtime, normalized);
    }

    // History/random paths bypass bag queue
    if (activeBagType === "random") {
      const pick = PIECES[Math.floor(Math.random() * PIECES.length)];
      return pick;
    }
    if (activeBagType === "history" && typeof scene.generateTGM1Piece === "function") {
      const pick = scene.generateTGM1Piece();
      return pick;
    }

    refillBagQueue(runtime, activeBagType);

    if (runtime.bagQueue.length === 0) {
      // safety fallback
      refillBagQueue(runtime, "7bag");
    }

    const piece = runtime.bagQueue.shift();
    return piece;
  }

  function createRadioRow(scene, group, x, y, label, options, currentValue, onSelect, refreshFn) {
    const labelText = scene.add.text(0, y, `${label}:`, {
      fontSize: "16px",
      fill: "#ffff00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    });
    group.add(labelText);
    const rowSpacing = 20;
    options.forEach((opt, idx) => {
      const optY = y + rowSpacing * (idx + 1);
      const isSelected = String(opt.value) === String(currentValue);
      const radio = scene.add.text(20, optY, isSelected ? "(●)" : "( )", {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      });
      const text = scene.add.text(48, optY, opt.label, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      });
      radio.setInteractive();
      text.setInteractive();
      const handler = () => {
        onSelect(opt.value);
        if (typeof refreshFn === "function") {
          refreshFn();
        }
      };
      radio.on("pointerdown", handler);
      text.on("pointerdown", handler);
      group.add(radio);
      group.add(text);
    });
  }

  function createUpdatedBadge(scene, group, x, y) {
    const badge = scene.add.text(x, y, "updated", {
      fontSize: "12px",
      fill: "#00ff88",
      fontFamily: "Courier New",
      fontStyle: "bold",
    });
    badge.setVisible(false);
    group.add(badge);
    return badge;
  }

  function flashUpdated(badge) {
    if (!badge) return;
    badge.setVisible(true);
    if (badge._timer) {
      badge._timer.remove(false);
    }
    const scene = badge.scene;
    badge._timer = scene.time.delayedCall(1200, () => {
      badge.setVisible(false);
    });
  }

  function createNumericInputRow(scene, group, x, y, label, valueText, onSubmit) {
    const labelText = scene.add.text(x, y, `${label}:`, {
      fontSize: "16px",
      fill: "#ffff00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    });
    group.add(labelText);

    const inputBg = scene.add.rectangle(x + 30, y + 32, 60, 26, 0x222222, 0.9);
    inputBg.setStrokeStyle(1, 0xffffff);
    inputBg.setInteractive();
    group.add(inputBg);

    const inputText = scene.add
      .text(x + 30, y + 32, `${valueText}`, {
        fontSize: "14px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);
    group.add(inputText);

    const badge = createUpdatedBadge(scene, group, x + 80, y + 28);

    const state = {
      editing: false,
      value: String(valueText),
      lastApplied: String(valueText),
      keyHandler: null,
    };

    const stopEditing = () => {
      state.editing = false;
      inputBg.setStrokeStyle(1, 0xffffff);
      if (state.keyHandler) {
        scene.input.keyboard.off("keydown", state.keyHandler);
        state.keyHandler = null;
      }
    };

    const submitValue = () => {
      const changed = onSubmit(state.value);
      if (changed !== null && changed !== undefined) {
        state.value = String(changed);
        state.lastApplied = state.value;
        inputText.setText(state.value);
        flashUpdated(badge);
      } else {
        state.value = state.lastApplied;
        inputText.setText(state.value);
      }
      stopEditing();
    };

    const handleKey = (event) => {
      const key = event.key;
      if (key === "Enter") {
        submitValue();
        event.stopPropagation();
        return;
      }
      if (key === "Escape") {
        state.value = state.lastApplied;
        inputText.setText(state.value);
        stopEditing();
        event.stopPropagation();
        return;
      }
      if (key === "Backspace") {
        state.value = state.value.slice(0, -1);
        inputText.setText(state.value);
        event.stopPropagation();
        return;
      }
      if (/[\d\.\-]/.test(key)) {
        state.value += key;
        inputText.setText(state.value);
        event.stopPropagation();
      }
    };

    const startEditing = () => {
      if (state.editing) return;
      state.editing = true;
      inputBg.setStrokeStyle(2, 0x00ff88);
      state.keyHandler = handleKey;
      scene.input.keyboard.on("keydown", handleKey);
    };

    inputBg.on("pointerdown", startEditing);
    inputText.setInteractive();
    inputText.on("pointerdown", startEditing);

    return { labelText, inputBg, inputText, badge, stopEditing };
  }

  function buildPanel(scene, config, opts) {
    if (!scene || !scene.add) return null;
    const cfg = config || loadConfig();
    const x = opts?.x ?? 0;
    const y = opts?.y ?? 0;
    const lineHeight = Math.max(18, Math.floor((opts?.cellSize ?? 16) * 0.7));
    const viewportWidth = opts?.width ?? 250;
    const cameraHeight = scene.cameras?.main?.height || scene.game?.config?.height || 720;
    const viewportHeight = Math.max(240, cameraHeight - y - 24);
    const group = scene.add.container(x, y);
    const content = scene.add.container(0, 0);
    group.add(content);
    group.zenViewportWidth = viewportWidth;
    group.zenViewportHeight = viewportHeight;

    const title = scene.add
      .text(viewportWidth * 0.38, 0, "Zen Sandbox", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5, 0);
    content.add(title);

    let rowY = lineHeight * 1.5;

    const refreshPanel = () => {
      if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.renderPanel) {
        const latest = scene.getZenSandboxConfig ? scene.getZenSandboxConfig() : loadConfig();
        const newPanel = ZenSandboxHelper.renderPanel(scene, latest, opts);
        if (newPanel && typeof newPanel.setDepth === "function") newPanel.setDepth(10000);
        return newPanel;
      }
      return null;
    };

    let currentBagType = cfg.bagType;
    const bagNoticeY = rowY - lineHeight * 0.8;
    const bagNotice = scene.add.text(0, bagNoticeY, "Restart Zen mode to apply bag changes.", {
      fontSize: "12px",
      fill: "#ffcc00",
      fontFamily: "Courier New",
    });
    bagNotice.setVisible(!!cfg.bagChanged);
    content.add(bagNotice);

    createRadioRow(
      scene,
      content,
      0,
      rowY,
      "Bag",
      getBagTypeOptions(),
      cfg.bagType,
      (val) => {
        if (val === currentBagType) return;
        currentBagType = val;
        scene.setZenSandboxConfig && scene.setZenSandboxConfig({ bagType: val, bagChanged: true });
        bagNotice.setVisible(true);
        bagNotice.setPosition(0, bagNoticeY);
      },
      refreshPanel,
    );
    rowY += lineHeight * (1 + 0.9 * 7 + 1.2);

    createRadioRow(
      scene,
      content,
      0,
      rowY,
      "Attack",
      [
        { label: "guideline", value: "guideline" },
        { label: "multiplier", value: "multiplier" },
      ],
      cfg.attackTableType,
      (val) => scene.setZenSandboxConfig && scene.setZenSandboxConfig({ attackTableType: val }),
      refreshPanel,
    );
    rowY += lineHeight * (1 + 0.9 * 2);

    createRadioRow(
      scene,
      content,
      0,
      rowY,
      "Cheese",
      [
        { label: "off", value: "off" },
        { label: "fixed rows", value: "fixed_rows" },
        { label: "fixed timing", value: "fixed_timing" },
      ],
      cfg.cheeseMode,
      (val) => scene.setZenSandboxConfig && scene.setZenSandboxConfig({ cheeseMode: val }),
      refreshPanel,
    );
    rowY += lineHeight * (1 + 0.9 * 3);

    createNumericInputRow(
      scene,
      content,
      0,
      rowY,
      "Cheese %",
      `${Math.round(cfg.cheesePercent)}`,
      (val) => {
        const num = Math.max(0, Math.min(100, Number(val)));
        if (Number.isFinite(num)) {
          scene.setZenSandboxConfig && scene.setZenSandboxConfig({ cheesePercent: num });
          return Math.round(num);
        }
        return null;
      },
    );
    rowY += lineHeight * 1.6;

    createNumericInputRow(scene, content, 0, rowY, "Cheese rows", `${cfg.cheeseRows}`, (val) => {
      const num = Math.max(1, Math.min(20, Math.round(Number(val))));
      if (Number.isFinite(num)) {
        scene.setZenSandboxConfig && scene.setZenSandboxConfig({ cheeseRows: num });
        return num;
      }
      return null;
    });
    rowY += lineHeight * 1.6;

    createNumericInputRow(
      scene,
      content,
      0,
      rowY,
      "Cheese interval (s)",
      `${Number(cfg.cheeseInterval || 0).toFixed(1)}`,
      (val) => {
        const num = Math.max(0.1, Math.min(20, Number(val)));
        if (Number.isFinite(num)) {
          scene.setZenSandboxConfig && scene.setZenSandboxConfig({ cheeseInterval: num });
          return num.toFixed(1);
        }
        return null;
      },
    );
    rowY += lineHeight * 2.0;

    createRadioRow(
      scene,
      content,
      0,
      rowY,
      "Spin",
      [
        { label: "standard", value: "standard" },
        { label: "t-only", value: "t_only" },
        { label: "all", value: "all" },
      ],
      cfg.spinType,
      (val) => scene.setZenSandboxConfig && scene.setZenSandboxConfig({ spinType: val }),
      refreshPanel,
    );
    rowY += lineHeight * (1 + 0.9 * 3);

    createRadioRow(
      scene,
      content,
      0,
      rowY,
      "Infinite resets",
      [
        { label: "on", value: true },
        { label: "off", value: false },
      ],
      !!cfg.movementResetsInfinite,
      (val) => scene.setZenSandboxConfig && scene.setZenSandboxConfig({ movementResetsInfinite: val }),
      refreshPanel,
    );
    rowY += lineHeight * (1 + 0.9 * 2);

    // Gravity presets
    createRadioRow(
      scene,
      content,
      0,
      rowY,
      "Gravity",
      [
        { label: "none", value: "none" },
        { label: "minimal", value: "minimal" },
        { label: "slow", value: "slow" },
        { label: "medium", value: "medium" },
        { label: "fast", value: "fast" },
        { label: "static", value: "static" },
      ],
      cfg.gravityMode || "none",
      (val) => scene.setZenSandboxConfig && scene.setZenSandboxConfig({ gravityMode: val }),
      refreshPanel,
    );
    rowY += lineHeight * (1 + 0.9 * 6);

    if (cfg.gravityMode === "static") {
      createNumericInputRow(
        scene,
        content,
        0,
        rowY,
        "Static rows/frame",
        `${Number(cfg.gravityRowsPerFrame || 0).toFixed(2)}`,
        (val) => {
          const num = Math.max(0, Math.min(4, Number(val)));
          if (Number.isFinite(num)) {
            scene.setZenSandboxConfig &&
              scene.setZenSandboxConfig({ gravityRowsPerFrame: num, gravityMode: "static" });
            return num.toFixed(2);
          }
          return null;
        },
      );
      rowY += lineHeight * 1.6;
    }

    createRadioRow(
      scene,
      content,
      0,
      rowY,
      "Display",
      [
        { label: "none", value: "none" },
        { label: "versus", value: "versus" },
        { label: "speed", value: "speed" },
        { label: "efficiency", value: "efficiency" },
      ],
      cfg.displayMode || "versus",
      (val) => scene.setZenSandboxConfig && scene.setZenSandboxConfig({ displayMode: val }),
      refreshPanel,
    );
    rowY += lineHeight * (1 + 0.9 * 2);

    const minosaGuideOptions = getMinosaGuideModeOptions();
    createRadioRow(
      scene,
      content,
      0,
      rowY,
      "Minosa",
      minosaGuideOptions,
      cfg.minosaGuideMode || "off",
      (val) => scene.setZenSandboxConfig && scene.setZenSandboxConfig({ minosaGuideMode: val }),
      refreshPanel,
    );
    rowY += lineHeight * (1 + 0.9 * minosaGuideOptions.length);

    if ((cfg.minosaGuideMode || "off") !== "off") {
      createNumericInputRow(
        scene,
        content,
        0,
        rowY,
        "Lookahead",
        `${clampInteger(cfg.minosaGuideLookahead, 1, 5, 3)}`,
        (val) => {
          const num = clampInteger(val, 1, 5, 3);
          scene.setZenSandboxConfig && scene.setZenSandboxConfig({ minosaGuideLookahead: num });
          return num;
        },
      );
      rowY += lineHeight * 1.6;

      createNumericInputRow(
        scene,
        content,
        0,
        rowY,
        "Candidates",
        `${clampInteger(cfg.minosaGuideCandidateLimit, 1, 16, 8)}`,
        (val) => {
          const num = clampInteger(val, 1, 16, 8);
          scene.setZenSandboxConfig && scene.setZenSandboxConfig({ minosaGuideCandidateLimit: num });
          return num;
        },
      );
      rowY += lineHeight * 1.6;
    }

    const maskPadding = 12;
    const contentHeight = Math.max(viewportHeight, rowY + lineHeight);
    const maxScroll = Math.max(0, contentHeight - viewportHeight);
    const maskGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRect(x - maskPadding, y - maskPadding, viewportWidth, viewportHeight + maskPadding * 2);
    content.setMask(maskGraphics.createGeometryMask());

    const setScroll = (nextScroll) => {
      const clampedScroll = Math.max(0, Math.min(maxScroll, Number(nextScroll) || 0));
      scene.zenSandboxPanelScrollY = clampedScroll;
      content.y = -clampedScroll;
    };
    setScroll(scene.zenSandboxPanelScrollY || 0);

    const wheelHandler = (_pointer, _gameObjects, _deltaX, deltaY) => {
      if (!scene.zenSandboxPanelVisible || maxScroll <= 0) return;
      const pointer = scene.input?.activePointer;
      if (!pointer) return;
      const withinBounds =
        pointer.worldX >= x - maskPadding &&
        pointer.worldX <= x - maskPadding + viewportWidth &&
        pointer.worldY >= y - maskPadding &&
        pointer.worldY <= y - maskPadding + viewportHeight + maskPadding * 2;
      if (!withinBounds) return;
      setScroll((scene.zenSandboxPanelScrollY || 0) + deltaY * 0.7);
    };
    scene.input?.on("wheel", wheelHandler);
    group.once("destroy", () => {
      scene.input?.off("wheel", wheelHandler);
      if (content.clearMask) {
        content.clearMask(true);
      }
      maskGraphics.destroy();
    });

    return group;
  }

  global.ZenSandboxHelper = {
    defaults,
    loadConfig,
    saveConfig,
    nextPieceFromBag,
    buildPanel,
    buildSettingsToggles(scene, opts = {}) {
      if (!scene || !scene.add) return;
      const cfg = scene.getZenSandboxConfig ? scene.getZenSandboxConfig() : loadConfig();
      const x = opts.x ?? 0;
      const startY = opts.y ?? 0;
      const lineHeight = opts.spacing ?? 26;
      let y = startY;

      // Destroy previous settings group if present to allow rebuild/redraw
      if (scene.zenSandboxSettingsGroup) {
        scene.zenSandboxSettingsGroup.destroy(true);
        scene.zenSandboxSettingsGroup = null;
      }
      const group = scene.add.container(x - 140, 0);
      scene.zenSandboxSettingsGroup = group;

      const rebuild = () => {
        group.destroy(true);
        scene.zenSandboxSettingsGroup = null;
        ZenSandboxHelper.buildSettingsToggles(scene, opts);
      };

      const addLabel = (text, offset = -30) =>
        scene.add
          .text(x, y + offset, text, {
            fontSize: "20px",
            fill: "#ffff00",
            fontFamily: "Courier New",
          })
          .setOrigin(0.5);

      const radioRow = (label, options, currentValue, onSelect) => {
        const labelText = scene.add.text(0, y, `${label}:`, {
          fontSize: "16px",
          fill: "#ffff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        group.add(labelText);
        const rowSpacing = 20;
        options.forEach((opt) => {
          const idx = options.indexOf(opt);
          const optY = y + rowSpacing * (idx + 1);
          const isSelected = String(opt.value) === String(currentValue);
          const radio = scene.add.text(20, optY, isSelected ? "(●)" : "( )", {
            fontSize: "16px",
            fill: "#ffffff",
            fontFamily: "Courier New",
          });
          const text = scene.add.text(48, optY, opt.label, {
            fontSize: "16px",
            fill: "#ffffff",
            fontFamily: "Courier New",
          });
          radio.setInteractive();
          text.setInteractive();
          const handler = () => {
            onSelect(opt.value);
            if (scene.updateZenSandboxDisplay) scene.updateZenSandboxDisplay();
            rebuild();
          };
          radio.on("pointerdown", handler);
          text.on("pointerdown", handler);
          group.add(radio);
          group.add(text);
        });
        y += lineHeight * (1 + 0.9 * options.length);
        return group;
      };

      const numericRow = (label, valueText, onClick) => {
        const input = createNumericInputRow(
          scene,
          group,
          x - 140,
          y,
          label,
          valueText,
          (val) => {
            const changed = onClick(val);
            if (changed !== null && changed !== undefined) {
              if (scene.updateZenSandboxDisplay) scene.updateZenSandboxDisplay();
              rebuild();
            }
            return changed;
          },
        );
        y += lineHeight * 1.4;
        return input;
      };

      addLabel("Zen Sandbox", -30);

      let currentBagType = cfg.bagType;
      const bagNotice = scene.add
        .text(x - 140, y + lineHeight * 1.0, "Restart Zen mode to apply bag changes.", {
          fontSize: "12px",
          fill: "#ffcc00",
          fontFamily: "Courier New",
        })
        .setOrigin(0, 0);
      bagNotice.setVisible(false);

      radioRow(
        "Bag",
        getBagTypeOptions(),
        cfg.bagType,
        (val) => {
          if (val === currentBagType) return;
          currentBagType = val;
          scene.setZenSandboxConfig && scene.setZenSandboxConfig({ bagType: val });
          bagNotice.setVisible(true);
          bagNotice.setPosition(x - 140, y + lineHeight * (1 + 0.9 * 5));
        },
      );
      y += lineHeight * (1 + 0.9 * 5 + 1.2);

      // All Zen sandbox toggles are now exclusive to the Zen panel, not the Settings screen.
    },
    resetRuntime(scene, cfg) {
      if (!scene) return;
      const bagType = (cfg || {}).bagType;
      scene.zenSandboxRuntime = {
        bagQueue: [],
        bagType,
        lastClassicPiece: null,
        pendingBagType: undefined,
      };
      scene.zenCheeseTimer = 0;
      scene.zenTopoutCooldown = false;
      if (typeof scene.zenGravityTime === "number") scene.zenGravityTime = 0;
      // Ensure the new bag system applies immediately on restart
      if (Array.isArray(scene.nextPieces)) scene.nextPieces.length = 0;
      scene.bagQueue = [];
      scene.bagDrawCount = 0;
      scene.firstPiece = true;
      // Re-apply fixed_rows baseline immediately if configured and board exists
      if (scene.board && cfg && cfg.cheeseMode === "fixed_rows") {
        if (typeof scene.ensureZenCheeseBaseline === "function") {
          scene.ensureZenCheeseBaseline(0);
        } else if (scene.board && typeof scene.board.addCheeseRows === "function") {
          const rows = Math.max(1, Math.floor(Number(cfg.cheeseRows) || 1));
          const percent = Math.max(0, Math.min(100, Number(cfg.cheesePercent) || 0));
          scene.board.addCheeseRows(rows, percent);
        }
      }
    },
    ensureScene(scene) {
      if (!scene) return;
      const helper = this;
      if (typeof scene.loadZenSandboxConfig !== "function") {
        scene.loadZenSandboxConfig = function () {
          const cfg = helper.loadConfig();
          this.zenSandboxConfig = cfg;
          helper.resetRuntime(this, cfg);
        };
      }
      if (typeof scene.setZenSandboxConfig !== "function") {
        scene.setZenSandboxConfig = function (updates) {
          const prevCfg = this.zenSandboxConfig || helper.loadConfig();
          const bagTypeChanged =
            updates && updates.bagType !== undefined && updates.bagType !== prevCfg.bagType;

          // Persist config but do not reset runtime/bag queue on change; defer bag swap to reset
          const cfg = helper.saveConfig({
            ...updates,
            ...(bagTypeChanged ? { bagChanged: true } : {}),
          });
          this.zenSandboxConfig = cfg;

          // If bagType changed, mark pending but preserve current queue
          if (bagTypeChanged && this.zenSandboxRuntime) {
            this.zenSandboxRuntime.pendingBagType = cfg.bagType;
          }

          if (typeof this.updateZenSandboxDisplay === "function") {
            this.updateZenSandboxDisplay();
          }

          if (updates) {
            const cheeseChanged =
              updates.cheeseMode !== undefined ||
              updates.cheeseRows !== undefined ||
              updates.cheesePercent !== undefined ||
              updates.cheeseInterval !== undefined;
            if (cheeseChanged) {
              const rows = Math.max(1, Math.floor(Number(cfg.cheeseRows) || 1));
              const percent = Math.max(0, Math.min(100, Number(cfg.cheesePercent) || 0));
              const interval = Math.max(0.1, Number(cfg.cheeseInterval) || 0.1);
              try {
                console.log("[CheeseConfig] applied", {
                  mode: cfg.cheeseMode,
                  rows,
                  percent,
                  interval,
                });
                // Immediate preview: apply one batch when turning on cheese to make it visible
                if (this.isZenSandboxActive && this.isZenSandboxActive() && this.board) {
                  if (cfg.cheeseMode === "fixed_rows") {
                    // Force baseline immediately
                    const before = this.countCheeseRows?.() || 0;
                    console.log("[CheeseConfig] baseline call (preview) before ensure", { before, rows, percent });
                    if (typeof this.board.addCheeseRows === "function") {
                      const missing = Math.max(0, rows - before);
                      if (missing > 0) this.board.addCheeseRows(missing, percent);
                    }
                    if (typeof this.ensureZenCheeseBaseline === "function") {
                      this.ensureZenCheeseBaseline(0);
                    }
                    const after = this.countCheeseRows?.() || 0;
                    console.log("[CheeseConfig] preview fixed_rows", {
                      rows,
                      percent,
                      before,
                      after,
                    });
                    // Persist the baseline immediately
                    if (typeof this.ensureZenCheeseBaseline === "function") {
                      this.ensureZenCheeseBaseline(0);
                      console.log("[CheeseConfig] baseline call (preview) after ensure", {
                        rows,
                        percent,
                        current: this.countCheeseRows?.() || 0,
                      });
                    }
                  } else if (cfg.cheeseMode === "fixed_timing") {
                    this.board.addCheeseRows(rows, percent);
                    this.zenCheeseTimer = 0;
                    console.log("[CheeseConfig] preview fixed_timing", {
                      rows,
                      percent,
                      interval,
                    });
                  }
                }
              } catch {}
            }
            if (updates.gravityMode !== undefined || updates.gravityRowsPerFrame !== undefined) {
              console.log(
                "[ZenGravity] setZenSandboxConfig",
                "mode=" + cfg.gravityMode,
                "rowsPerFrame=" + cfg.gravityRowsPerFrame,
              );
            }
          }
          return cfg;
        };
      }
      if (typeof scene.getZenSandboxConfig !== "function") {
        scene.getZenSandboxConfig = function () {
          return this.zenSandboxConfig || helper.loadConfig();
        };
      }
      // Provide a fallback display updater for non-GameScene scenes that don't own the in-game UI
      const sceneKey = scene.scene && scene.scene.key;
      if (sceneKey && sceneKey !== "GameScene" && typeof scene.updateZenSandboxDisplay !== "function") {
        scene.updateZenSandboxDisplay = function () {
          if (this._zenDisplayForwarding) return;
          try {
            const mgr = this.game?.scene;
            const gameScene = mgr?.getScene && mgr.getScene("GameScene");
            const canForward =
              gameScene &&
              typeof gameScene.updateZenSandboxDisplay === "function" &&
              gameScene !== this &&
              gameScene.updateZenSandboxDisplay !== this.updateZenSandboxDisplay;
            if (canForward && !gameScene._zenDisplayForwarding) {
              gameScene._zenDisplayForwarding = true;
              gameScene.updateZenSandboxDisplay();
              gameScene._zenDisplayForwarding = false;
            }
          } catch (err) {
            console.warn("[ZenSandbox][Config] fallback updater failed", err);
          }
        };
      }
    },
    renderPanel(scene, config, opts) {
      if (!scene || !scene.add) return null;
      if (scene.zenSandboxPanelGroup) {
        scene.zenSandboxPanelGroup.destroy(true);
        scene.zenSandboxPanelGroup = null;
      }
      if (scene.zenSandboxChevron) {
        scene.zenSandboxChevron.destroy(true);
        scene.zenSandboxChevron = null;
      }
      const prevVisible =
        typeof scene.zenSandboxPanelVisible === "boolean" ? scene.zenSandboxPanelVisible : true;
      const cfg = config || loadConfig();
      const panel = buildPanel(scene, cfg, opts);
      scene.zenSandboxPanelGroup = panel;

      // Chevron toggle (triangle shape instead of text)
      const baseX = opts?.x ?? 0;
      const baseY = opts?.y ?? 0;
      const chevronY = scene.cameras?.main
        ? scene.cameras.main.height / 2
        : (scene.game.config.height || 0) / 2;
      const expandedX = baseX + (panel?.zenViewportWidth || 220) + 20;
      const collapsedX = 10;
      const chevron = scene.add
        .triangle(expandedX, chevronY, -8, -12, -8, 12, 10, 0, 0xffff00, 1)
        .setInteractive(new Phaser.Geom.Rectangle(-14, -18, 28, 36), Phaser.Geom.Rectangle.Contains);
      chevron.setDepth(10001);
      scene.zenSandboxChevron = chevron;
      scene.zenSandboxPanelVisible = prevVisible;

      const applyVisibility = (visible) => {
        scene.zenSandboxPanelVisible = visible;
        if (panel && panel.setVisible) panel.setVisible(visible);
        if (chevron) {
          chevron.setScale(visible ? -1 : 1, 1);
          chevron.setPosition(visible ? expandedX : collapsedX, chevronY);
        }
      };

      chevron.on("pointerdown", () => {
        applyVisibility(!scene.zenSandboxPanelVisible);
      });

      applyVisibility(prevVisible);

      return panel;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
