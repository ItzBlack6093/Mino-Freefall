// TGM3ShiraseMode - Shirase (Ti) approximation
// Fixed 20G, 3 previews, Hold enabled. Simplified timings and torikan notes left as TODO hooks.

class TGM3ShiraseMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'Shirase';
        this.modeId = 'tgm3_shirase';
        this.config = this.getModeConfig();
        this.sectionTimes = {};
        this.sectionGrades = {};
        this.rollReached = false;

        // Progressive timing phases (seconds) — matches Ti Shirase table
        this.timingPhases = [
            { minLevel: 0,    maxLevel: 99,   are: 12/60, lineAre: 8/60,  das: 10/60, arr: 1/60, lock: 18/60, lineClear: 6/60 },
            { minLevel: 100,  maxLevel: 199,  are: 12/60, lineAre: 7/60,  das: 8/60,  arr: 1/60, lock: 18/60, lineClear: 5/60 },
            { minLevel: 200,  maxLevel: 299,  are: 12/60, lineAre: 6/60,  das: 8/60,  arr: 1/60, lock: 17/60, lineClear: 4/60 },
            { minLevel: 300,  maxLevel: 499,  are: 6/60,  lineAre: 6/60,  das: 8/60,  arr: 1/60, lock: 15/60, lineClear: 4/60 },
            { minLevel: 500,  maxLevel: 599,  are: 6/60,  lineAre: 5/60,  das: 6/60,  arr: 1/60, lock: 13/60, lineClear: 3/60 },
            { minLevel: 600,  maxLevel: 1099, are: 6/60,  lineAre: 5/60,  das: 6/60,  arr: 1/60, lock: 12/60, lineClear: 3/60 },
            { minLevel: 1100, maxLevel: 1199, are: 6/60,  lineAre: 5/60,  das: 6/60,  arr: 1/60, lock: 10/60, lineClear: 3/60 },
            { minLevel: 1200, maxLevel: 1299, are: 6/60,  lineAre: 5/60,  das: 6/60,  arr: 1/60, lock: 8/60,  lineClear: 3/60 },
            { minLevel: 1300, maxLevel: 1399, are: 6/60,  lineAre: 6/60,  das: 6/60,  arr: 1/60, lock: 15/60, lineClear: 6/60 }
        ];
        this.currentTimingPhase = 1;
        this.currentTiming = this.getTimingForLevel(0);
        this.bigMode = null;
    }

    getModeConfig() {
        return {
            gravity: { type: 'static', value: 5120 }, // 20G
            das: 12/60,
            arr: 1/60,
            are: 12/60,
            lineAre: 8/60,
            lockDelay: 18/60,
            lineClearDelay: 6/60,
            nextPieces: 3,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            lowestGrade: '',
            gravityLevelCap: 1300,
            hasGrading: true,
            specialMechanics: {
                torikan: true,
                torikanTimes: {
                    classic: { level500: 148, level1000: 296 }, // 2:28, 4:56
                    world: { level500: 183, level1000: 366 },   // 3:03, 6:06
                },
                monochromeAfter1000: true,
                garbageAfter500: true,
                bigRollAfter1300: true
            }
        };
    }

    getTimingForLevel(level) {
        for (let i = this.timingPhases.length - 1; i >= 0; i--) {
            const phase = this.timingPhases[i];
            if (level >= phase.minLevel && level <= phase.maxLevel) {
                this.currentTimingPhase = i + 1;
                return phase;
            }
        }
        return this.timingPhases[0];
    }

    updateTiming(level) {
        this.currentTiming = this.getTimingForLevel(level);
    }

    getName() { return this.modeName; }
    getModeId() { return this.modeId; }

    getBgmConfig() {
        return {
            progressSource: 'level',
            stopSource: 'level',
            useStopBuffer: false,
            transitionStopOffset: 9,
            segments: [
                { end: 499, key: 'mf2_4' },
                { end: 699, key: 'mf3_4' },
                { end: 999, key: 'mf1_2' },
                { end: 1299, key: 'mf3_6' }
            ],
            credits: {
                key: 'mf2_endroll',
                reuseCurrentTrack: false
            }
        };
    }

    onLineClear(gameScene, linesCleared) {
        if (linesCleared > 0) {
            gameScene.garbageCountdown = 0; // reset garbage timer on clear
        }
    }

    onLevelUpdate(level, oldLevel, updateType = 'piece', amount = 1) {
        const max = this.config.gravityLevelCap || 1300;
        let nextLevel = level;

        if (updateType === 'piece') {
            nextLevel = Math.min(level + 1, max);
        } else if (updateType === 'lines') {
            const inc = Math.max(amount || 0, 0);
            const bonus = inc === 3 ? 1 : inc === 4 ? 2 : 0;
            nextLevel = Math.min(level + inc + bonus, max);
        }

        if (nextLevel >= max) {
            this.rollReached = true;
        }

        // Refresh timings based on next level
        this.updateTiming(nextLevel);

        return nextLevel;
    }

    onSectionComplete(gameScene, sectionIndex, sectionTimeSec) {
        // S-grade per section: S1..S13
        this.sectionTimes[sectionIndex] = sectionTimeSec;
        // S-grade per section: S1..S13
        this.sectionGrades[sectionIndex] = "S" + (sectionIndex + 1);
        // REGRET if slower than thresholds (Ti): ≤60s early, 50s later
        const regretTimes = [
            60, 60, 60, 60, 60, 60, 50, 50, 50, 50, 50, 50, 50,
        ];
        if (sectionIndex < regretTimes.length && sectionTimeSec > regretTimes[sectionIndex]) {
            this.sectionGrades[sectionIndex] = "REGRET";
        }
        // Only show REGRET in section tracker, not S1, S2, etc.
        if (gameScene) {
            gameScene.sectionPerformance = gameScene.sectionPerformance || [];
            gameScene.sectionPerformance[sectionIndex] = this.sectionGrades[sectionIndex] === "REGRET" ? "REGRET" : "";
        }
    }

    getARE() { return this.currentTiming?.are ?? this.config.are; }
    getLineARE() { return this.currentTiming?.lineAre ?? this.config.lineAre; }
    getDAS() { return this.currentTiming?.das ?? this.config.das; }
    getARR() { return this.config.arr; }
    getLockDelay() { return this.currentTiming?.lock ?? this.config.lockDelay; }
    getLineClearDelay() { return this.currentTiming?.lineClear ?? this.config.lineClearDelay; }

    getDisplayedGrade() {
        // Return the most recent completed section grade for the main grade display
        const sectionKeys = Object.keys(this.sectionGrades).map(Number).sort((a, b) => b - a);
        if (sectionKeys.length > 0) {
            return this.sectionGrades[sectionKeys[0]];
        }
        // Default to empty string before any sections are completed
        return '';
    }

    initializeBigRoll(gameScene) {
        if (!gameScene) return;

        if (typeof getBigModeInstance === 'function') {
            this.bigMode = getBigModeInstance();
            this.bigMode.initializeBigMode(gameScene, {
                boardDimensions: true,
                visualScale: false
            });
            return;
        }

        if (typeof BigMode !== 'undefined') {
            this.bigMode = BigMode.getSharedInstance
                ? BigMode.getSharedInstance()
                : new BigMode();
            this.bigMode.initializeBigMode(gameScene, {
                boardDimensions: true,
                visualScale: false
            });
            return;
        }

        gameScene.bigModeActive = true;
        gameScene.bigBlocksActive = false;
        if (typeof gameScene.applyBigModeBoardDimensions === 'function') {
            gameScene.applyBigModeBoardDimensions({ cols: 5, rows: 12, visibleRows: 10 });
        }
    }

    onCreditsStart(gameScene) {
        this.initializeBigRoll(gameScene);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM3ShiraseMode };
}
if (typeof window !== 'undefined') {
    window.TGM3ShiraseMode = TGM3ShiraseMode;
}
