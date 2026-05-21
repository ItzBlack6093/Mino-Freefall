(function (global) {
  const CHARACTER_IDS = [
    "ame",
    "ao",
    "aqua",
    "azki",
    "bae",
    "bijou",
    "calli",
    "ceci",
    "chihaya",
    "fauna",
    "flare",
    "fubuki",
    "fuwawa",
    "gigi",
    "gura",
    "hajime",
    "ina",
    "irys",
    "kanade",
    "kanata",
    "kiara",
    "korone",
    "kronii",
    "liz",
    "luna",
    "marine",
    "miko",
    "mio",
    "mococo",
    "mumei",
    "nerissa",
    "niko",
    "noel",
    "okayu",
    "pekora",
    "raden",
    "raora",
    "riona",
    "ririka",
    "roboco",
    "sana",
    "shion",
    "shiori",
    "sora",
    "su",
    "subaru",
    "suisei",
    "towa",
    "vivi",
    "watame",
  ];

  const TOTAL_ILLUSTRATIONS = CHARACTER_IDS.length;
  const STATES = {
    locked: "locked",
    partial: "partial",
    unlocked: "unlocked",
  };
  const STEPS_PER_ILLUSTRATION = 3;
  const MAX_PROGRESS_STEPS = TOTAL_ILLUSTRATIONS * STEPS_PER_ILLUSTRATION - 1;
  const GRADIENT_ASSETS = {
    locked: {
      egm: {
        key: "konoha_illustration_egm_grad2",
        url: "characters/grad/egm_grad2.png",
      },
      icon: {
        key: "konoha_illustration_icon_grad2",
        url: "characters/grad/icon_grad2.png",
      },
    },
    partial: {
      egm: {
        key: "konoha_illustration_egm_grad1",
        url: "characters/grad/egm_grad1.png",
      },
      icon: {
        key: "konoha_illustration_icon_grad1",
        url: "characters/grad/icon_grad1.png",
      },
    },
  };
  const DOM_IMAGE_CACHE = new Map();

  function clampSlotIndex(slotIndex) {
    const numeric = Number(slotIndex);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(TOTAL_ILLUSTRATIONS - 1, Math.floor(numeric)));
  }

  function clampProgressSteps(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(MAX_PROGRESS_STEPS, Math.floor(numeric)));
  }

  function getCharacterId(slotIndex) {
    return CHARACTER_IDS[clampSlotIndex(slotIndex)] || CHARACTER_IDS[0];
  }

  function getBaseAssetDescriptor(slotIndex, kind) {
    const characterId = getCharacterId(slotIndex);
    const isIcon = kind === "icon";
    return {
      slotIndex: clampSlotIndex(slotIndex),
      characterId,
      kind,
      key: `konoha_${isIcon ? "icon" : "egm"}_${characterId}`,
      url: `characters/chars/${characterId}/${isIcon ? "thumb.png" : "egm.png"}`,
    };
  }

  function getGradientAssetDescriptor(state, kind) {
    if (state === STATES.locked) {
      return { ...GRADIENT_ASSETS.locked[kind], kind };
    }
    if (state === STATES.partial) {
      return { ...GRADIENT_ASSETS.partial[kind], kind };
    }
    return null;
  }

  function getAssetDescriptor(state, kind) {
    return getGradientAssetDescriptor(state, kind);
  }

  function getCompositeTextureKey(slotIndex, kind, state) {
    const characterId = getCharacterId(slotIndex);
    return `konoha_${kind}_${characterId}_${state}`;
  }

  function getStateLabel(state) {
    if (state === STATES.unlocked) return "OPEN";
    if (state === STATES.partial) return "GRAD1";
    return "GRAD2";
  }

  function getSharedImageAssets() {
    return [
      [GRADIENT_ASSETS.locked.egm.key, GRADIENT_ASSETS.locked.egm.url],
      [GRADIENT_ASSETS.locked.icon.key, GRADIENT_ASSETS.locked.icon.url],
      [GRADIENT_ASSETS.partial.egm.key, GRADIENT_ASSETS.partial.egm.url],
      [GRADIENT_ASSETS.partial.icon.key, GRADIENT_ASSETS.partial.icon.url],
    ];
  }

  function getSlotState(index, steps) {
    const offset = clampProgressSteps(steps) - clampSlotIndex(index) * STEPS_PER_ILLUSTRATION;
    if (offset >= 2) return STATES.unlocked;
    if (offset >= 1) return STATES.partial;
    return STATES.locked;
  }

  function buildProgressFromSteps(rawSteps) {
    const steps = clampProgressSteps(rawSteps);
    const slots = Array.from({ length: TOTAL_ILLUSTRATIONS }, (_, index) => ({
      index,
      number: index + 1,
      characterId: getCharacterId(index),
      state: getSlotState(index, steps),
    }));
    const unlocked = Math.min(TOTAL_ILLUSTRATIONS, Math.floor((steps + 1) / STEPS_PER_ILLUSTRATION));
    const partialUnlocked = steps % STEPS_PER_ILLUSTRATION === 1 ? 1 : 0;
    const activeSlotIndex = Math.min(TOTAL_ILLUSTRATIONS - 1, Math.floor(steps / STEPS_PER_ILLUSTRATION));

    return {
      total: TOTAL_ILLUSTRATIONS,
      steps,
      maxSteps: MAX_PROGRESS_STEPS,
      unlocked,
      partialUnlocked,
      lockedCount: Math.max(0, TOTAL_ILLUSTRATIONS - unlocked - partialUnlocked),
      activeSlotIndex,
      slots,
    };
  }

  function readLeaderboard(modeId) {
    const stored = localStorage.getItem(`leaderboard_${modeId}`);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function getBestAllClears(modeId) {
    return Math.max(
      0,
      readLeaderboard(modeId).reduce((best, entry) => {
        const value = Math.floor(Number(entry?.allClears) || 0);
        return value > best ? value : best;
      }, 0),
    );
  }

  function getStoredProgress() {
    return buildProgressFromSteps(
      getBestAllClears("konoha_easy") + getBestAllClears("konoha_hard"),
    );
  }

  function isKonohaModeId(modeId) {
    return typeof modeId === "string" && (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"));
  }

  function getModeIdFromScene(scene) {
    return scene?.gameMode && typeof scene.gameMode.getModeId === "function"
      ? scene.gameMode.getModeId()
      : scene?.selectedMode || "";
  }

  function getProgressForScene(scene) {
    return buildProgressFromSteps(scene?.gameMode?.bravoCount ?? scene?.bravoCount ?? 0);
  }

  function getSceneDisplay(progress) {
    const slotIndex = clampSlotIndex(progress?.activeSlotIndex ?? 0);
    const slot = progress?.slots?.[slotIndex] || {
      index: slotIndex,
      number: slotIndex + 1,
      characterId: getCharacterId(slotIndex),
      state: STATES.locked,
    };
    return {
      slot,
      slotIndex,
      state: slot.state,
      characterId: slot.characterId,
    };
  }

  function ensureRuntime(scene) {
    if (!scene) return null;
    if (!scene.konohaIllustrationRuntime) {
      scene.konohaIllustrationRuntime = {
        lastPopAt: 0,
        revealFullDuringAre: false,
        loadingKeys: new Set(),
        loaderHooked: false,
        trackedBaseTextures: new Map(),
        trackedCompositeTextures: new Map(),
      };
    }
    return scene.konohaIllustrationRuntime;
  }

  function attachLoaderHooks(scene, runtime) {
    if (!scene?.load || !runtime || runtime.loaderHooked) return;
    runtime.loaderHooked = true;
    scene.load.on("complete", () => {
      runtime.loadingKeys.clear();
    });
    scene.load.on("loaderror", (file) => {
      if (file?.key) runtime.loadingKeys.delete(file.key);
    });
  }

  function queueTextureLoad(scene, descriptor, trackedMap, trackedValue) {
    if (!scene || !descriptor) return false;
    if (scene.textures?.exists(descriptor.key)) {
      if (trackedMap) trackedMap.set(descriptor.key, trackedValue);
      return true;
    }

    const runtime = ensureRuntime(scene);
    attachLoaderHooks(scene, runtime);
    if (trackedMap) trackedMap.set(descriptor.key, trackedValue);
    if (runtime?.loadingKeys?.has(descriptor.key)) return false;

    runtime?.loadingKeys?.add(descriptor.key);
    scene.load.image(descriptor.key, descriptor.url);
    try {
      scene.load.start();
    } catch {}
    return false;
  }

  function getRetainedSlots(activeSlotIndex) {
    const active = clampSlotIndex(activeSlotIndex);
    const retained = new Set([active]);
    if (active > 0) retained.add(active - 1);
    if (active < TOTAL_ILLUSTRATIONS - 1) retained.add(active + 1);
    return retained;
  }

  function pruneTextureCache(scene, activeSlotIndex) {
    const runtime = ensureRuntime(scene);
    if (!runtime || !scene?.textures) return;
    const retainedSlots = getRetainedSlots(activeSlotIndex);

    for (const [key, slotIndex] of [...runtime.trackedBaseTextures.entries()]) {
      if (retainedSlots.has(slotIndex)) continue;
      if (scene.textures.exists(key)) {
        scene.textures.remove(key);
      }
      runtime.trackedBaseTextures.delete(key);
    }

    for (const [key, meta] of [...runtime.trackedCompositeTextures.entries()]) {
      if (retainedSlots.has(meta.slotIndex)) continue;
      if (scene.textures.exists(key)) {
        scene.textures.remove(key);
      }
      runtime.trackedCompositeTextures.delete(key);
    }
  }

  function getTextureSourceImage(scene, key) {
    const texture = scene?.textures?.get(key);
    return texture?.source?.[0]?.image || null;
  }

  function buildCompositeCanvas(scene, baseKey, gradientKey) {
    const baseImage = getTextureSourceImage(scene, baseKey);
    const gradientImage = getTextureSourceImage(scene, gradientKey);
    if (!baseImage || !gradientImage) return null;

    const width = baseImage.naturalWidth || baseImage.width;
    const height = baseImage.naturalHeight || baseImage.height;
    if (!width || !height) return null;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";
    context.drawImage(baseImage, 0, 0, width, height);
    context.globalCompositeOperation = "source-atop";
    context.drawImage(gradientImage, 0, 0, width, height);
    context.globalCompositeOperation = "source-over";
    return canvas;
  }

  function ensureDisplayTexture(scene, slotIndex, kind, state) {
    const runtime = ensureRuntime(scene);
    const clampedSlotIndex = clampSlotIndex(slotIndex);
    const baseDescriptor = getBaseAssetDescriptor(clampedSlotIndex, kind);
    if (!queueTextureLoad(scene, baseDescriptor, runtime?.trackedBaseTextures, clampedSlotIndex)) {
      return null;
    }

    if (state === STATES.unlocked) {
      return baseDescriptor.key;
    }

    const gradientDescriptor = getGradientAssetDescriptor(state, kind);
    if (!gradientDescriptor) {
      return baseDescriptor.key;
    }
    if (!queueTextureLoad(scene, gradientDescriptor, null, null)) {
      return null;
    }

    const compositeKey = getCompositeTextureKey(clampedSlotIndex, kind, state);
    runtime?.trackedCompositeTextures.set(compositeKey, {
      slotIndex: clampedSlotIndex,
      kind,
      state,
    });
    if (scene.textures?.exists(compositeKey)) {
      return compositeKey;
    }
    const compositeCanvas = buildCompositeCanvas(scene, baseDescriptor.key, gradientDescriptor.key);
    if (!compositeCanvas) {
      return null;
    }
    scene.textures.addCanvas(compositeKey, compositeCanvas);
    return scene.textures?.exists(compositeKey) ? compositeKey : null;
  }

  function prefetchSceneAssets(scene) {
    if (!scene) return;
    const progress = getProgressForScene(scene);
    const activeSlotIndex = clampSlotIndex(progress.activeSlotIndex);
    pruneTextureCache(scene, activeSlotIndex);

    const currentState = progress.slots?.[activeSlotIndex]?.state || STATES.locked;
    ensureDisplayTexture(scene, activeSlotIndex, "egm", currentState);
    ensureDisplayTexture(scene, activeSlotIndex, "icon", currentState);

    const nextSlotIndex = Math.min(TOTAL_ILLUSTRATIONS - 1, activeSlotIndex + 1);
    if (nextSlotIndex !== activeSlotIndex) {
      ensureDisplayTexture(scene, nextSlotIndex, "egm", STATES.locked);
      ensureDisplayTexture(scene, nextSlotIndex, "icon", STATES.locked);
    }
  }

  function resetScene(scene) {
    const runtime = ensureRuntime(scene);
    if (!runtime) return;
    runtime.lastPopAt = 0;
    runtime.revealFullDuringAre = false;
    prefetchSceneAssets(scene);
  }

  function onBravo(scene) {
    const runtime = ensureRuntime(scene);
    if (!runtime) return;
    runtime.lastPopAt = scene?.time?.now || Date.now();
    runtime.revealFullDuringAre = true;
    prefetchSceneAssets(scene);
  }

  function onPieceSpawn(scene) {
    const runtime = ensureRuntime(scene);
    if (!runtime) return;
    runtime.revealFullDuringAre = false;
    prefetchSceneAssets(scene);
  }

  function applyCropToBounds(sprite, bounds) {
    if (!sprite || !bounds) return;
    const source = sprite.texture?.source?.[0]?.image;
    if (!source?.width || !source?.height) return;

    const displayWidth = sprite.displayWidth;
    const displayHeight = sprite.displayHeight;
    const spriteLeft = sprite.x - displayWidth / 2;
    const spriteTop = sprite.y - displayHeight / 2;
    const cropLeft = Math.max(0, bounds.left - spriteLeft);
    const cropTop = Math.max(0, bounds.top - spriteTop);
    const cropRight = Math.max(0, spriteLeft + displayWidth - bounds.right);
    const cropBottom = Math.max(0, spriteTop + displayHeight - bounds.bottom);
    const visibleWidth = Math.max(0, displayWidth - cropLeft - cropRight);
    const visibleHeight = Math.max(0, displayHeight - cropTop - cropBottom);

    if (visibleWidth <= 0 || visibleHeight <= 0) {
      sprite.setVisible(false);
      return;
    }

    sprite.setCrop(
      (cropLeft / displayWidth) * source.width,
      (cropTop / displayHeight) * source.height,
      (visibleWidth / displayWidth) * source.width,
      (visibleHeight / displayHeight) * source.height,
    );
  }

  function drawTexture(scene, textureKey, x, y, displayWidth, displayHeight, cropBounds = null) {
    if (!textureKey || !scene?.textures?.exists(textureKey)) return;
    const sprite = scene.add
      .image(x, y, textureKey)
      .setDisplaySize(displayWidth, displayHeight);
    if (cropBounds) {
      applyCropToBounds(sprite, cropBounds);
    }
    scene.gameGroup?.add(sprite);
  }

  function drawMatrixIllustration(scene) {
    const modeId = getModeIdFromScene(scene);
    if (!isKonohaModeId(modeId)) return;

    const runtime = ensureRuntime(scene);
    const progress = getProgressForScene(scene);
    const display = getSceneDisplay(progress);
    const baseDescriptor = getBaseAssetDescriptor(display.slotIndex, "egm");
    if (!queueTextureLoad(scene, baseDescriptor, runtime?.trackedBaseTextures, display.slotIndex)) {
      return;
    }

    const source = getTextureSourceImage(scene, baseDescriptor.key);
    if (!source?.width || !source?.height) {
      return;
    }

    const textureKey = ensureDisplayTexture(scene, display.slotIndex, "egm", display.state);
    if (!textureKey) return;

    const now = scene?.time?.now || Date.now();
    const popProgress = runtime.lastPopAt ? Math.min(1, (now - runtime.lastPopAt) / 320) : 1;
    const popScale = 1 + Math.sin(popProgress * Math.PI) * 0.06;
    const popYOffset = (1 - popProgress) * scene.cellSize * 0.8;
    const displayHeight = (scene.playfieldHeight / 0.7) * popScale;
    const displayWidth = displayHeight * (source.width / source.height);
    const cropBounds =
      runtime.revealFullDuringAre && scene.areActive
        ? null
        : {
            left: scene.borderOffsetX,
            top: scene.borderOffsetY,
            right: scene.borderOffsetX + scene.playfieldWidth,
            bottom: scene.borderOffsetY + scene.playfieldHeight,
          };

    drawTexture(
      scene,
      textureKey,
      scene.borderOffsetX + scene.playfieldWidth / 2,
      scene.borderOffsetY + displayHeight / 2 + popYOffset,
      displayWidth,
      displayHeight,
      cropBounds,
    );
  }

  function drawPlayerInfoIcon(scene, { centerX = 0, topY = 0, textWidth = 0, fontSize = 16 } = {}) {
    const modeId = getModeIdFromScene(scene);
    if (!isKonohaModeId(modeId)) return;

    const progress = getProgressForScene(scene);
    const display = getSceneDisplay(progress);
    const textureKey = ensureDisplayTexture(scene, display.slotIndex, "icon", display.state);
    if (!textureKey) return;

    const iconSize = Math.max(26, Math.floor(scene.cellSize * 1.4));
    drawTexture(
      scene,
      textureKey,
      centerX - textWidth / 2 - iconSize / 2 - 10,
      topY + fontSize * 0.55,
      iconSize,
      iconSize,
    );
  }

  function getDomImageEntry(url) {
    if (DOM_IMAGE_CACHE.has(url)) {
      return DOM_IMAGE_CACHE.get(url);
    }
    const image = new Image();
    image.decoding = "async";
    const entry = {
      image,
      loaded: false,
      failed: false,
      listeners: [],
    };
    image.onload = () => {
      entry.loaded = true;
      const listeners = entry.listeners.slice();
      entry.listeners.length = 0;
      listeners.forEach((listener) => listener(image));
    };
    image.onerror = () => {
      entry.failed = true;
      entry.listeners.length = 0;
    };
    image.src = url;
    DOM_IMAGE_CACHE.set(url, entry);
    return entry;
  }

  function whenDomImageReady(url, callback) {
    const entry = getDomImageEntry(url);
    if (entry.loaded) {
      callback(entry.image);
      return;
    }
    if (entry.failed) return;
    entry.listeners.push(callback);
  }

  function redrawProfileCanvas(canvas, slotIndex, state) {
    if (!canvas) return;
    const baseDescriptor = getBaseAssetDescriptor(slotIndex, "icon");
    const gradientDescriptor = getGradientAssetDescriptor(state, "icon");

    const draw = () => {
      const baseEntry = getDomImageEntry(baseDescriptor.url);
      if (!baseEntry.loaded) return;

      const context = canvas.getContext("2d");
      if (!context) return;
      const width = baseEntry.image.naturalWidth || baseEntry.image.width || 340;
      const height = baseEntry.image.naturalHeight || baseEntry.image.height || 340;

      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      context.drawImage(baseEntry.image, 0, 0, width, height);

      if (gradientDescriptor) {
        const gradientEntry = getDomImageEntry(gradientDescriptor.url);
        if (!gradientEntry.loaded) return;
        context.globalCompositeOperation = "source-atop";
        context.drawImage(gradientEntry.image, 0, 0, width, height);
      }
      context.globalCompositeOperation = "source-over";
    };

    whenDomImageReady(baseDescriptor.url, draw);
    if (gradientDescriptor) {
      whenDomImageReady(gradientDescriptor.url, draw);
    }
    draw();
  }

  function createProfileIllustrationNode(slot, { size = 44 } = {}) {
    const slotIndex = clampSlotIndex(slot?.index ?? 0);
    const state = slot?.state || STATES.locked;
    const canvas = document.createElement("canvas");
    canvas.width = 340;
    canvas.height = 340;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.style.display = "block";
    canvas.style.imageRendering = "pixelated";
    redrawProfileCanvas(canvas, slotIndex, state);
    return canvas;
  }

  const api = {
    CHARACTER_IDS,
    TOTAL_ILLUSTRATIONS,
    STATES,
    STEPS_PER_ILLUSTRATION,
    MAX_PROGRESS_STEPS,
    getSharedImageAssets,
    getAssetDescriptor,
    getBaseAssetDescriptor,
    getGradientAssetDescriptor,
    getStateLabel,
    getStoredProgress,
    getProgress: buildProgressFromSteps,
    getProgressForScene,
    getSceneDisplay,
    isKonohaModeId,
    resetScene,
    onBravo,
    onPieceSpawn,
    drawMatrixIllustration,
    drawPlayerInfoIcon,
    createProfileIllustrationNode,
  };

  global.KonohaIllustrationSystem = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
