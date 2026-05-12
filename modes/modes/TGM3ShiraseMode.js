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
        this.currentTiming = this.getTimingForLevel(0);
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
        // Table from tgm3modes.md (frames at 60fps)
        const frame = (n) => n / 60;
        if (level < 100) return { are: frame(12), lineAre: frame(8), das: frame(10), lock: frame(18), lineClear: frame(6) };
        if (level < 200) return { are: frame(12), lineAre: frame(7), das: frame(8), lock: frame(18), lineClear: frame(5) };
        if (level < 300) return { are: frame(12), lineAre: frame(6), das: frame(8), lock: frame(17), lineClear: frame(4) };
        if (level < 500) return { are: frame(6), lineAre: frame(6), das: frame(8), lock: frame(15), lineClear: frame(4) };
        if (level < 600) return { are: frame(6), lineAre: frame(5), das: frame(6), lock: frame(13), lineClear: frame(3) };
        if (level < 1100) return { are: frame(6), lineAre: frame(5), das: frame(6), lock: frame(12), lineClear: frame(3) };
        if (level < 1200) return { are: frame(6), lineAre: frame(5), das: frame(6), lock: frame(10), lineClear: frame(3) };
        if (level < 1300) return { are: frame(6), lineAre: frame(5), das: frame(6), lock: frame(8), lineClear: frame(3) };
        // 1300 roll
        return { are: frame(6), lineAre: frame(6), das: frame(6), lock: frame(15), lineClear: frame(6) };
    }

    updateTiming(level) {
        this.currentTiming = this.getTimingForLevel(level);
    }

    getName() { return this.modeName; }
    getModeId() { return this.modeId; }

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
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM3ShiraseMode };
}
if (typeof window !== 'undefined') {
    window.TGM3ShiraseMode = TGM3ShiraseMode;
}
