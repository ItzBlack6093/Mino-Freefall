(function (global) {
  const GameSceneBgm = {
    initializeBGM() {
      try {
        const addTrack = (key, opts = {}) => {
          const base = 0.5;
          const vol = base * this.getMasterVolumeSetting() * this.getBGMVolumeSetting();
          return this.sound.add(key, { loop: false, volume: vol, ...opts });
        };
        this.bgmTracks = {
          mf1_1: addTrack("mf1_1", { loop: true }),
          mf1_2: addTrack("mf1_2", { loop: true }),
          mf1_endroll: addTrack("mf1_endroll", { loop: true }),
          mf2_3: addTrack("mf2_3", { loop: true }),
          mf2_4: addTrack("mf2_4", { loop: true }),
          mf2_endroll: addTrack("mf2_endroll", { loop: true }),
          mf3_4: addTrack("mf3_4", { loop: true }),
          mf3_6: addTrack("mf3_6", { loop: true }),
          mf4_endgame: addTrack("mf4_endgame", { loop: true }),
          mf_zen: addTrack("mf_zen", { loop: true }),
          mf_std_1: addTrack("mf_std_1", { loop: true }),
          mf_std_2: addTrack("mf_std_2", { loop: true }),
          mf_std_3: addTrack("mf_std_3", { loop: true }),
        };
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

    getBgmSchedule(modeId) {
      const sharedTGM1 = [
        { end: 499, key: "mf1_1" },
        { end: 999, key: "mf1_2" },
      ];
      const sharedTADeath = [
        { end: 299, key: "mf1_2" },
        { end: 499, key: "mf2_3" },
        { end: 999, key: "mf2_4" },
      ];
      const sharedShirase = [
        { end: 499, key: "mf2_4" },
        { end: 699, key: "mf3_4" },
        { end: 999, key: "mf1_2" },
        { end: 1299, key: "mf3_6" },
      ];
      const sharedAsuka = [
        { end: 999, key: "mf2_4" },
        { end: 1300, key: "mf3_4" },
      ];
      const schedules = {
        normal: { segments: [{ end: 299, key: "mf1_1" }, { end: 999, key: "mf1_2" }], credits: "mf2_endroll" },
        easy_normal: { segments: [{ end: 199, key: "mf1_1" }, { end: 999, key: "mf1_endroll" }], credits: "mf2_endroll" },
        easy_easy: { segments: [{ end: 199, key: "mf1_1" }, { end: 999, key: "mf1_endroll" }], credits: "mf1_endroll" },
        marathon: { segments: [{ end: 49, key: "mf_std_1" }, { end: 99, key: "mf_std_2" }, { end: 999, key: "mf_std_3" }], credits: "mf2_endroll" },
        sprint_40: { segments: [{ end: 999, key: "mf1_1" }] },
        sprint_100: { segments: [{ end: 999, key: "mf1_1" }] },
        ultra: { segments: [{ end: 999, key: "mf1_1" }] },
        zen: { segments: [{ end: 999, key: "mf_zen" }] },
        tgm1: { segments: sharedTGM1, credits: "mf2_endroll" },
        tgm_plus: { segments: sharedTGM1, credits: "mf2_endroll" },
        master_20g: { segments: sharedTGM1, credits: "mf2_endroll" },
        tgm2: {
          segments: [
            { end: 499, key: "mf1_1" },
            { end: 699, key: "mf1_2" },
            { end: 899, key: "mf2_3" },
            { end: 999, key: "mf2_4" },
          ],
          credits: "mf2_endroll",
        },
        tgm3: {
          segments: [
            { end: 499, key: "mf1_1" },
            { end: 799, key: "mf1_2" },
            { end: 1899, key: "mf2_4" },
          ],
          credits: "mf2_endroll",
        },
        tgm4: {
          segments: [
            { end: 299, key: "mf1_1" },
            { end: 499, key: "mf1_2" },
            { end: 999, key: "mf2_3" },
          ],
          credits: "mf2_endroll",
        },
        tadeath: { segments: sharedTADeath, credits: "mf1_endroll" },
        shirase: { segments: sharedShirase, credits: "mf2_endroll" },
        tgm4_rounds: {
          segments: [
            { end: 299, key: "mf1_2" },
            { end: 699, key: "mf3_4" },
            { end: 999, key: "mf3_6" },
            { end: 1299, key: "mf2_3" },
            { end: 2600, key: "mf2_4" },
          ],
          credits: "mf2_endroll",
          endgame: "mf4_endgame",
        },
        tgm4_1_1: { segments: sharedTGM1, credits: "mf2_endroll" },
        tgm4_2_1: { segments: sharedTADeath, credits: "mf2_endroll" },
        tgm4_3_1: {
          segments: [
            { end: 499, key: "mf2_4" },
            { end: 999, key: "mf3_4" },
            { end: 1299, key: "mf1_2" },
            { end: 2000, key: "mf3_6" },
          ],
          credits: "mf2_endroll",
        },
        tgm4_4_1: { segments: [{ end: 999, key: "mf3_6" }], credits: "mf2_endroll" },
        asuka_easy: { segments: sharedAsuka },
        asuka_normal: { segments: sharedAsuka },
        asuka_hard: { segments: sharedAsuka },
        tgm3_sakura: { segments: [{ end: 999, key: "mf1_1" }] },
      };
      return schedules[modeId] || { segments: sharedTGM1, credits: "mf2_endroll" };
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

    updateModeBGM() {
      const modeId =
        (this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode) || "tgm1";

      // Custom BGM flow for Marathon: use line count with stop windows
      if (
        modeId === "marathon" &&
        this.gameMode &&
        typeof this.gameMode.linesCleared === "number"
      ) {
        const lines = this.gameMode.linesCleared;

        // Stop all music once the goal is hit
        if (lines >= 150) {
          this.stopCurrentBGM();
          return;
        }

        // Determine which track should be active, with intentional silent gaps
        let desiredKey = null;
        if (lines < 55) {
          desiredKey = "mf_std_1"; // lines 0-54
        } else if (lines < 60) {
          // Silent gap between 55-59
          this.stopCurrentBGM();
          return;
        } else if (lines < 115) {
          desiredKey = "mf_std_2"; // lines 60-114
        } else if (lines < 120) {
          // Silent gap between 115-119
          this.stopCurrentBGM();
          return;
        } else {
          desiredKey = "mf_std_3"; // lines 120-149
        }

        if (desiredKey && this.currentBgmKey !== desiredKey) {
          this.playBgmByKey(desiredKey);
        }
        return;
      }

      const schedule = this.getBgmSchedule(modeId);
      if (!schedule || !schedule.segments || !schedule.segments.length) return;

      if (modeId === "tgm4_rounds" && this.gameMode?.endGameActive && schedule.endgame) {
        if (this.currentBgmKey !== schedule.endgame) {
          this.playBgmByKey(schedule.endgame);
        }
        return;
      }

      const maxSegment = schedule.segments[schedule.segments.length - 1];
      const internalLevel =
        this.gameMode && typeof this.gameMode.internalLevel === "number"
          ? this.gameMode.internalLevel
          : this.level;
      const bgmStopLevel =
        this.gameMode && typeof this.gameMode.bgmStopLevel === "number"
          ? this.gameMode.bgmStopLevel
          : internalLevel;
      const stopLevel = Math.max(
        bgmStopLevel,
        typeof this.bgmInternalLevelBuffer === "number" ? this.bgmInternalLevelBuffer : 0,
      );
      let segment = schedule.segments.find((s) => internalLevel <= s.end);
      if (!segment) segment = maxSegment;
      const isLast = segment === maxSegment;

      // Stop 10 levels early unless in final segment
      if (!isLast && stopLevel >= segment.end - 9) {
        this.stopCurrentBGM();
        return;
      }

      if (this.currentBgmKey !== segment.key) {
        this.playBgmByKey(segment.key);
      }
    },

    // Legacy loop-point manager kept for compatibility; no-op with unified BGM
    manageBGMLoopMode() {},

    getCreditsBgmKey() {
      if (this.selectedMode === "tgm2_normal") return "mf1_2";
      if (this.selectedMode === "tgm3_easy" || this.selectedMode === "tadeath") {
        return "mf1_endroll";
      }
      return "mf2_endroll";
    },

    createCreditsBGM() {
      try {
        const creditsBGMKey = this.getCreditsBgmKey();
        this.creditsBGM = this.sound.add(creditsBGMKey, {
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
