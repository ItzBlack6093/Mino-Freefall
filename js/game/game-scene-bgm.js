(function (global) {
  const GameSceneBgm = {
    getBgmStyleSetting() {
      return localStorage.getItem("bgmStyle") === "legacy" ? "legacy" : "modern";
    },

    resolveBgmAssetKey(logicalKey) {
      const fallbackKey = logicalKey;
      if (this.getBgmStyleSetting() !== "legacy") {
        return fallbackKey;
      }

      const legacyMap = {
        mf1_1: "legacy_mf1_1",
        mf1_2: "legacy_mf1_2",
        mf1_endroll: "legacy_mf1_endroll",
        mf2_3: "legacy_mf2_3",
        mf2_4: "legacy_mf2_4",
        mf3_4: "legacy_mf3_4",
        mf3_6: "legacy_mf3_6",
        mf_std_1: "legacy_mf_std_1",
        mf_std_2: "legacy_mf_std_2",
        mf_std_3: "legacy_mf_std_3",
      };
      const legacyKey = legacyMap[logicalKey];
      if (!legacyKey) {
        return fallbackKey;
      }

      return this.cache?.audio?.exists(legacyKey) ? legacyKey : fallbackKey;
    },

    initializeBGM() {
      try {
        const addTrack = (logicalKey, opts = {}) => {
          const base = 0.5;
          const vol = base * this.getMasterVolumeSetting() * this.getBGMVolumeSetting();
          const assetKey = this.resolveBgmAssetKey(logicalKey);
          return this.sound.add(assetKey, { loop: false, volume: vol, ...opts });
        };
        const trackKeys = [
          "mf1_1",
          "mf1_2",
          "mf1_endroll",
          "mf2_3",
          "mf2_4",
          "mf2_endroll",
          "mf3_4",
          "mf3_6",
          "mf4_endgame",
          "mf_zen",
          "mf_std_1",
          "mf_std_2",
          "mf_std_3",
        ];
        this.bgmTracks = trackKeys.reduce((tracks, key) => {
          tracks[key] = addTrack(key, { loop: true });
          return tracks;
        }, {});
        this.stage1BGM = this.bgmTracks.mf1_1;
        this.stage2BGM = this.bgmTracks.mf1_2;
        this.currentBgmKey = null;
        this.bgmStarted = false;
      } catch (error) {
        console.error(
          "Failed to initialize BGM audio objects. BGM functionality may be limited.",
          error,
        );
      }
    },

    startInitialBGM() {
      if (!this.bgmEnabled) return;
      this.bgmStarted = true;
      this.updateBGM();
    },

    updateBGM() {
      if (!this.bgmEnabled || !this.bgmStarted) return;
      this.updateModeBGM();
    },

    applyEffectiveVolumesScene() {
      const master = this.getMasterVolumeSetting();
      const bgm = this.getBGMVolumeSetting();
      const sfx = this.getSFXVolumeSetting();

      if (this.sound && typeof this.sound.setVolume === "function") {
        // Manager volume applies master only; per-sound uses sfx/base
        this.sound.setVolume(master);
      }

      if (this.bgmTracks) {
        Object.entries(this.bgmTracks).forEach(([key, track]) => {
          if (track && track.setVolume) {
            const base = 0.5; // consistent base
            track.setVolume(base * master * bgm);
          }
        });
      }

      if (this.currentBGM && this.currentBGM.setVolume) {
        const base = 0.5;
        this.currentBGM.setVolume(base * master * bgm);
      }
    },

    getModeBgmConfig() {
      if (this.gameMode && typeof this.gameMode.getBgmConfig === "function") {
        return this.gameMode.getBgmConfig(this);
      }
      return null;
    },

    shouldSuppressModeBgm() {
      return (
        !!this.suppressGameplayBgmForImmediateCreditsStart &&
        (this.creditsPending || this.creditsActive)
      );
    },

    getBgmStateValue(source, fallbackValue = 0) {
      switch (source) {
        case "level":
          return typeof this.level === "number" ? this.level : fallbackValue;
        case "internalLevel":
          return typeof this.gameMode?.internalLevel === "number"
            ? this.gameMode.internalLevel
            : fallbackValue;
        case "internalLevelOrLevel":
          return typeof this.gameMode?.internalLevel === "number"
            ? this.gameMode.internalLevel
            : typeof this.level === "number"
              ? this.level
              : fallbackValue;
        case "displayLevel":
          return typeof this.gameMode?.displayLevel === "number"
            ? this.gameMode.displayLevel
            : fallbackValue;
        case "bgmStopLevel":
          return typeof this.gameMode?.bgmStopLevel === "number"
            ? this.gameMode.bgmStopLevel
            : fallbackValue;
        case "bgmStopLevelOrProgress":
          return typeof this.gameMode?.bgmStopLevel === "number"
            ? this.gameMode.bgmStopLevel
            : fallbackValue;
        case "linesCleared":
          return typeof this.gameMode?.linesCleared === "number"
            ? this.gameMode.linesCleared
            : fallbackValue;
        default:
          return fallbackValue;
      }
    },

    getBgmSegmentForProgress(bgmConfig, progressValue) {
      const segments = Array.isArray(bgmConfig?.segments) ? bgmConfig.segments : [];
      if (!segments.length) return null;

      const rangedSegment = segments.find((segment) => {
        const hasStart = typeof segment.start === "number";
        const hasEnd = typeof segment.end === "number";
        if (hasStart && hasEnd) {
          return progressValue >= segment.start && progressValue <= segment.end;
        }
        if (hasStart) {
          return progressValue >= segment.start;
        }
        if (hasEnd) {
          return progressValue <= segment.end;
        }
        return false;
      });

      return rangedSegment || segments[segments.length - 1];
    },

    hasBgmSegmentChange(bgmConfig, fromProgressValue, toProgressValue) {
      const fromSegment = this.getBgmSegmentForProgress(bgmConfig, fromProgressValue);
      const toSegment = this.getBgmSegmentForProgress(bgmConfig, toProgressValue);
      return !!fromSegment && !!toSegment && fromSegment.key !== toSegment.key;
    },

    isInConfiguredBgmSilentRange(bgmConfig, progressValue) {
      const silentRanges = Array.isArray(bgmConfig?.silentRanges) ? bgmConfig.silentRanges : [];
      return silentRanges.some((range) => {
        const start = typeof range.start === "number" ? range.start : Number.NEGATIVE_INFINITY;
        const end = typeof range.end === "number" ? range.end : Number.POSITIVE_INFINITY;
        return progressValue >= start && progressValue <= end;
      });
    },

    getCreditsBgmConfig() {
      const bgmConfig = this.getModeBgmConfig();
      if (!bgmConfig || !bgmConfig.credits) {
        return null;
      }
      if (typeof bgmConfig.credits === "string") {
        return { key: bgmConfig.credits, reuseCurrentTrack: false };
      }
      return bgmConfig.credits;
    },

    getBgmSchedule() {
      return this.getModeBgmConfig();
    },

    playBgmByKey(key) {
      if (!key || !this.bgmTracks || !this.bgmTracks[key]) return;
      const audio = this.bgmTracks[key];
      if (this.currentBGM && this.currentBGM !== audio) {
        this.currentBGM.stop();
      }
      audio.play({ loop: true });
      this.currentBGM = audio;
      this.currentBgmKey = key;
    },

    stopCurrentBGM() {
      if (this.currentBGM) {
        this.currentBGM.stop();
        this.currentBGM = null;
        this.currentBgmKey = null;
      }
    },

    stopAllBGMs() {
      const activeTracks = new Set();
      const registerTrack = (track) => {
        if (track && typeof track.stop === "function") {
          activeTracks.add(track);
        }
      };

      registerTrack(this.currentBGM);
      registerTrack(this.creditsBGM);

      if (this.bgmTracks && typeof this.bgmTracks === "object") {
        Object.values(this.bgmTracks).forEach(registerTrack);
      }

      [
        this.stage1BGM,
        this.stage2BGM,
        this.tgm2_stage1,
        this.tgm2_stage2,
        this.tgm2_stage3,
        this.tgm2_stage4,
      ].forEach(registerTrack);

      activeTracks.forEach((track) => {
        try {
          track.stop();
        } catch {}
      });

      this.currentBGM = null;
      this.currentBgmKey = null;
      this.creditsBGM = null;
      this.creditsBgmStarted = false;
    },

    updateModeBGM() {
      const bgmConfig = this.getModeBgmConfig();
      if (!bgmConfig || !Array.isArray(bgmConfig.segments) || !bgmConfig.segments.length) return;

      if (this.shouldSuppressModeBgm()) {
        this.stopCurrentBGM();
        return;
      }

      const overrideTrack = bgmConfig.overrideTrack || null;
      if (
        overrideTrack &&
        overrideTrack.flag &&
        overrideTrack.key &&
        this.gameMode?.[overrideTrack.flag]
      ) {
        if (this.currentBgmKey !== overrideTrack.key) {
          this.playBgmByKey(overrideTrack.key);
        }
        return;
      }

      const progressValue = this.getBgmStateValue(
        bgmConfig.progressSource || "internalLevelOrLevel",
        typeof this.level === "number" ? this.level : 0,
      );
      if (typeof bgmConfig.stopAt === "number" && progressValue >= bgmConfig.stopAt) {
        this.stopCurrentBGM();
        return;
      }

      if (this.isInConfiguredBgmSilentRange(bgmConfig, progressValue)) {
        this.stopCurrentBGM();
        return;
      }

      const segment = this.getBgmSegmentForProgress(bgmConfig, progressValue);
      if (!segment || !segment.key) {
        this.stopCurrentBGM();
        return;
      }

      const segments = bgmConfig.segments;
      const maxSegment = segments[segments.length - 1];
      const rawStopValue = this.getBgmStateValue(
        bgmConfig.stopSource || "bgmStopLevelOrProgress",
        progressValue,
      );
      const stopBufferValue =
        bgmConfig.useStopBuffer === false
          ? 0
          : typeof this.bgmInternalLevelBuffer === "number"
            ? this.bgmInternalLevelBuffer
            : 0;
      const stopLevel = Math.max(
        rawStopValue,
        stopBufferValue,
      );
      const isLast = segment === maxSegment;
      const transitionStopOffset = Math.max(0, bgmConfig.transitionStopOffset || 0);

      if (
        !isLast &&
        transitionStopOffset > 0 &&
        typeof segment.end === "number" &&
        stopLevel >= segment.end - transitionStopOffset
      ) {
        this.stopCurrentBGM();
        return;
      }

      if (this.currentBgmKey !== segment.key) {
        this.playBgmByKey(segment.key);
      }
    },

    // Legacy loop-point manager kept for compatibility; no-op with unified BGM
    manageBGMLoopMode() {},

    shouldPersistCurrentBgmIntoCredits() {
      const creditsConfig = this.getCreditsBgmConfig();
      const bgmConfig = this.getModeBgmConfig();
      if (
        !creditsConfig?.reuseCurrentTrack ||
        !bgmConfig ||
        !this.currentBGM ||
        !this.currentBgmKey
      ) {
        return false;
      }
      const segments = Array.isArray(bgmConfig.segments) ? bgmConfig.segments : [];
      const finalSegment = segments[segments.length - 1];
      return !!finalSegment && this.currentBgmKey === finalSegment.key;
    },

    getCreditsBgmKey() {
      return this.getCreditsBgmConfig()?.key || null;
    },

    createCreditsBGM() {
      try {
        if (this.shouldPersistCurrentBgmIntoCredits()) {
          return;
        }
        const creditsBGMKey = this.getCreditsBgmKey();
        if (!creditsBGMKey) {
          return;
        }
        this.creditsBGM = this.sound.add(this.resolveBgmAssetKey(creditsBGMKey), {
          loop: true,
          volume: 0.3,
        });
        // Start playback on first spawned credits piece.
      } catch (error) {
        console.warn("Credits BGM could not be loaded:", error);
      }
    },
  };

  global.GameSceneBgm = GameSceneBgm;

  if (typeof GameScene !== "undefined") {
    Object.assign(GameScene.prototype, GameSceneBgm);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = GameSceneBgm;
  }
})(typeof window !== "undefined" ? window : globalThis);
