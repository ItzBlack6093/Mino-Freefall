// TGM3Mode - Core Master-style mode for TGM3 (Ti)
// Notes:
// - Uses 3 next previews and Hold
// - Approximate timing/phases inspired by Ti Master (simplified)
// - Gravity curve reuses Ti-styled early ramp and 20G after 500

class TGM3Mode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM3 Master';
        this.modeId = 'tgm3_master';

        this.config = this.getModeConfig();

        // Grading system (TGM3/Ti style)
        this.tgm3Grading = typeof TGM3GradingSystem !== 'undefined' ? new TGM3GradingSystem() : null;

        // Internal timing phase pointer
        this.currentTimingPhase = 1;
        this.coolBonus = 0; // +100 per section COOL
        this.displayLevel = 0;
        this.internalLevel = 0;
        this.bgmStopLevel = 0;
        this.sectionTimes = [];
        this.sectionPerformance = [];
        this.fadingRollActive = false;
        this.mRollStarted = false;
        this.coolTimes = [52, 52, 49, 45, 45, 42, 42, 38, 38]; // secs to *70 baseline
        this.regretTimes = [90, 75, 75, 68, 60, 60, 50, 50, 50]; // section time caps
        this.timingPhases = [
            // Simplified Ti-like phases (frames @60fps)
            { minLevel: 0, maxLevel: 499, are: 27/60, lineAre: 27/60, das: 16/60, arr: 1/60, lock: 30/60, lineClear: 40/60 },
            { minLevel: 500, maxLevel: 599, are: 27/60, lineAre: 27/60, das: 10/60, arr: 1/60, lock: 30/60, lineClear: 25/60 },
            { minLevel: 600, maxLevel: 699, are: 27/60, lineAre: 18/60, das: 10/60, arr: 1/60, lock: 30/60, lineClear: 16/60 },
            { minLevel: 700, maxLevel: 799, are: 18/60, lineAre: 14/60, das: 10/60, arr: 1/60, lock: 30/60, lineClear: 12/60 },
            { minLevel: 800, maxLevel: 899, are: 14/60, lineAre: 8/60,  das: 10/60, arr: 1/60, lock: 30/60, lineClear: 6/60 },
            { minLevel: 900, maxLevel: 999, are: 14/60, lineAre: 8/60,  das: 8/60,  arr: 1/60, lock: 17/60, lineClear: 6/60 },
            { minLevel: 1000, maxLevel: 1099, are: 8/60, lineAre: 8/60,  das: 8/60,  arr: 1/60, lock: 17/60, lineClear: 6/60 },
            { minLevel: 1100, maxLevel: 1199, are: 7/60, lineAre: 7/60,  das: 8/60,  arr: 1/60, lock: 15/60, lineClear: 6/60 },
            { minLevel: 1200, maxLevel: 1899, are: 6/60, lineAre: 6/60,  das: 8/60,  arr: 1/60, lock: 15/60, lineClear: 6/60 },
        ];
    }

    getModeConfig() {
        return {
            gravity: { type: 'custom', curve: level => this.getGravitySpeed(level) },
            das: 16/60,
            arr: 1/60,
            are: 27/60,
            lowestGrade: '9',
            lineAre: 27/60,
            lockDelay: 30/60,
            lineClearDelay: 40/60,
            nextPieces: 3,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 1500,
            hasGrading: true,
            specialMechanics: {
                coolRegret: true,
                staffRoll: true,
                torikan: true,
                torikanTimes: {
                    classic: { level500: 420 }, // 7:00
                    world: { level500: 420 }
                }
            }
        };
    }

    getDisplayLevelCap() {
        return 999;
    }

    getConfig() {
        return {
            ...this.getDefaultConfig(),
            ...this.getModeConfig()
        };
    }

    getName() {
        return this.modeName;
    }

    getModeId() {
        return this.modeId;
    }

    getDisplayedGrade() {
        if (this.tgm3Grading) return this.tgm3Grading.getDisplayedGrade();
        return null;
    }

    getInternalGrade() {
        if (this.tgm3Grading) return this.tgm3Grading.getInternalGrade();
        return 0;
    }

    getGradePoints() {
        if (this.tgm3Grading) return this.tgm3Grading.getGradePoints();
        return 0;
    }

    getStaffRollBonus() {
        if (this.tgm3Grading) return this.tgm3Grading.staffRollBonus || 0;
        return 0;
    }

    // Gravity curve derived from Ti table (values divided by 256 to map to existing engine units)
    getGravitySpeed(level) {
        let internal;
        if (level < 30) internal = 1024/256;       // 4
        else if (level < 35) internal = 1536/256;  // 6
        else if (level < 40) internal = 2048/256;  // 8
        else if (level < 50) internal = 2560/256;  // 10
        else if (level < 60) internal = 3072/256;  // 12
        else if (level < 70) internal = 4096/256;  // 16
        else if (level < 80) internal = 8192/256;  // 32
        else if (level < 90) internal = 12288/256; // 48
        else if (level < 100) internal = 16384/256; // 64
        else if (level < 120) internal = 20480/256; // 80
        else if (level < 140) internal = 24576/256; // 96
        else if (level < 160) internal = 28672/256; // 112
        else if (level < 170) internal = 32768/256; // 128
        else if (level < 200) internal = 36864/256; // 144
        else if (level < 220) internal = 1024/256;  // 4 (speed reset)
        else if (level < 230) internal = 8192/256;  // 32
        else if (level < 233) internal = 16384/256; // 64
        else if (level < 236) internal = 24576/256; // 96
        else if (level < 239) internal = 32768/256; // 128
        else if (level < 243) internal = 40960/256; // 160
        else if (level < 247) internal = 49152/256; // 192
        else if (level < 251) internal = 57344/256; // 224
        else if (level < 300) internal = 65536/256; // 256 (1G)
        else if (level < 330) internal = 131072/256; // 512 (2G)
        else if (level < 360) internal = 196608/256; // 768 (3G)
        else if (level < 400) internal = 262144/256; // 1024 (4G)
        else if (level < 420) internal = 327680/256; // 1280 (5G)
        else if (level < 450) internal = 262144/256; // 1024
        else if (level < 500) internal = 196608/256; // 768
        else internal = 5120; // Force 20G
        return internal;
    }

    getDAS() { return this.getCurrentTiming().das; }
    getARR() { return this.getCurrentTiming().arr; }
    getARE() { return this.getCurrentTiming().are; }
    getLineARE() { return this.getCurrentTiming().lineAre; }
    getLockDelay() { return this.getCurrentTiming().lock; }
    getLineClearDelay() { return this.getCurrentTiming().lineClear; }

    getCurrentTiming() {
        return this.timingPhases[this.currentTimingPhase - 1] || this.timingPhases[0];
    }

    updateTimingPhase(level) {
        const old = this.currentTimingPhase;
        for (let i = this.timingPhases.length - 1; i >= 0; i--) {
            const phase = this.timingPhases[i];
            if (level >= phase.minLevel && level <= phase.maxLevel) {
                this.currentTimingPhase = i + 1;
                break;
            }
        }
        if (old !== this.currentTimingPhase) {
            console.log(`TGM3: timing phase ${old} -> ${this.currentTimingPhase}`);
        }
    }

    onLevelUpdate(level, oldLevel, updateType, amount) {
        let nextLevel = level;
        const gravityCap = this.config.gravityLevelCap;
        const displayCap = this.getDisplayLevelCap();
        const currentDisplayLevel = Math.min(level, displayCap);
        // Ti stop rule at 998 applies to displayed/base level only:
        // internal progression remains (display/base + COOL bonuses).
        if (updateType === 'piece' && currentDisplayLevel >= 998) {
            nextLevel = 998;
        } else if (updateType === 'piece') {
            const atStopLevel = level % 100 === 99;
            nextLevel = atStopLevel ? level : Math.min(level + 1, gravityCap);
        } else if (updateType === 'lines') {
            const inc = Math.min(Math.max(amount || 0, 0), 4);
            const bonus = inc === 3 ? 1 : inc === 4 ? 2 : 0;
            nextLevel = Math.min(level + inc + bonus, gravityCap);
        }
        this.displayLevel = Math.min(nextLevel, displayCap);
        // Internal level drives gravity/BGM segment progression.
        // Keep it anchored to displayed/base level plus COOL bonus only.
        this.internalLevel = this.displayLevel + this.coolBonus;
        // BGM stop level can jump immediately on COOL
        this.bgmStopLevel = this.internalLevel;
        this.updateTimingPhase(this.internalLevel);
        return this.displayLevel;
    }

    // Section COOL/REGRET hooks (timing thresholds to be provided by game scene)
    onSectionCool() {
        this.coolBonus += 100;
        // Apply COOL bonus immediately for BGM stop-window decisions.
        this.internalLevel += 100;
        this.bgmStopLevel = this.internalLevel;
        if (this.tgm3Grading) {
            this.tgm3Grading.applySectionCool();
        }
        this.sectionPerformance.push('COOL');
    }

    onSectionRegret() {
        if (this.tgm3Grading) {
            this.tgm3Grading.applySectionRegret();
        }
        this.sectionPerformance.push('REGRET');
    }

    evaluateSectionPerformance(sectionIndex, sectionTimeSec, coolTimeSec = null) {
        // Treat inputs as 1-based section indices, but keep 0-based thresholds (0-8)
        const lookupIndex = Math.max(0, sectionIndex - 1);
        if (lookupIndex > 8) return null; // only 9 sections evaluated
        const coolThreshold = this.coolTimes[lookupIndex] ?? null;
        const regretThreshold = this.regretTimes[lookupIndex] ?? null;
        // COOL also requires within +2s of previous section time if available
        const prevTime = lookupIndex > 0 ? this.sectionTimes?.[lookupIndex - 1] : null;
        const prevCool = lookupIndex > 0 ? this.sectionCoolTimes?.[lookupIndex - 1] : null;
        const coolTime = coolTimeSec != null ? coolTimeSec : sectionTimeSec;
        const baselineForDelta =
            coolThreshold != null && prevCool != null
                ? Math.min(coolThreshold, prevCool)
                : coolThreshold != null
                    ? coolThreshold
                    : prevCool;
        const withinPrevious =
            baselineForDelta == null ? true : coolTime <= baselineForDelta + 2;
        if (coolThreshold !== null && coolTime <= coolThreshold && withinPrevious) {
            return 'cool';
        }
        if (regretThreshold !== null && sectionTimeSec > regretThreshold) {
            return 'regret';
        }
        return null;
    }

    handleLineClear(gameScene, linesCleared, pieceType = null) {
        if (!this.tgm3Grading || !gameScene) return;
        // During Ti staff roll, internal grade points are frozen; only roll bonus applies.
        if (gameScene.creditsActive) return;
        // Debug: confirm handleLineClear fired and grading exists
        const comboSize = Math.max(1, (gameScene.comboCount ?? -1) + 1);
        const isTetris = linesCleared === 4;
        this.tgm3Grading.awardPoints(linesCleared, comboSize, gameScene.level, isTetris);
    }

    initializeForGameScene(gameScene) {
        if (super.initializeForGameScene) super.initializeForGameScene(gameScene);
        if (this.tgm3Grading && typeof this.tgm3Grading.reset === 'function') {
            this.tgm3Grading.reset();
        }
    }

    update(gameScene, deltaTime) {
        if (super.update) super.update(gameScene, deltaTime);
        if (this.tgm3Grading && typeof this.tgm3Grading.update === 'function' && !gameScene.creditsActive) {
            this.tgm3Grading.update(deltaTime);
        }
    }

    onCreditsStart(gameScene) {
        // Decide roll type: invisible roll (m-roll) if all COOLs and internal grade high enough
        const allCool = this.sectionPerformance.slice(0, 9).every(v => v === 'COOL');
        const internalGrade = this.getInternalGrade();
        // Ti requirement: all COOLs + internal grade >= m9 (~27 in TAP terms)
        const forceMRoll = (() => {
            try {
                return (localStorage.getItem('forceMRoll') || 'false') === 'true';
            } catch (_e) {
                return false;
            }
        })();
        const mRollEligible = forceMRoll || (allCool && internalGrade >= 27);
        if (mRollEligible) {
            this.mRollStarted = true;
            this.fadingRollActive = false;
        } else {
            this.fadingRollActive = true;
            this.mRollStarted = false;
        }
        if (gameScene) {
            gameScene.mRollStarted = this.mRollStarted;
            gameScene.fadingRollActive = this.fadingRollActive;
            gameScene.invisibleStackActive = this.mRollStarted;
        }
    }

    addStaffRollBonus(amount) {
        if (this.tgm3Grading && typeof this.tgm3Grading.addStaffRollBonus === 'function') {
            this.tgm3Grading.addStaffRollBonus(amount);
        }
    }

    addStaffRollLines(lines, rollType = 'fading') {
        if (this.tgm3Grading && typeof this.tgm3Grading.addStaffRollLines === 'function') {
            this.tgm3Grading.addStaffRollLines(lines, rollType);
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM3Mode };
}
if (typeof window !== 'undefined') {
    window.TGM3Mode = TGM3Mode;
}
