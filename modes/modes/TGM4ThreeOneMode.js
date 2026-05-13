class TGM4ThreeOneMode extends TGM3ShiraseMode {
    constructor() {
        super();
        this.modeName = 'TGM4 3.1';
        this.modeId = 'tgm4_3_1';
        this.config = this.getModeConfig();
        this.currentTiming = this.getTimingForLevel(0);
        this.garbageCounter = 0;
    }

    getModeConfig() {
        return {
            ...super.getModeConfig(),
            nextPieces: 6,
            holdEnabled: true,
            gravityLevelCap: 2000,
            specialMechanics: {
                ...super.getModeConfig().specialMechanics,
                torikan: true,
                torikanTimes: { classic: { level1000: 241, level1300: 270, level2000: 406 } },
                garbageRanges: [[500, 1000], [1400, 2000]],
                monochromeAfter1000: true,
                bigRollAfter2000: true,
                bigRollLength: 55,
                noRegrets: true
            }
        };
    }

    getTimingForLevel(level) {
        // Same as TGM3 Shirase but DAS is 2 frames shorter across the whole mode
        const frame = n => n / 60;
        if (level < 100) return { are: frame(12), lineAre: frame(8), das: frame(8),  lock: frame(18), lineClear: frame(6) };
        if (level < 200) return { are: frame(12), lineAre: frame(7), das: frame(6),  lock: frame(18), lineClear: frame(5) };
        if (level < 300) return { are: frame(12), lineAre: frame(6), das: frame(6),  lock: frame(17), lineClear: frame(4) };
        if (level < 500) return { are: frame(6),  lineAre: frame(6), das: frame(6),  lock: frame(15), lineClear: frame(4) };
        if (level < 600) return { are: frame(6),  lineAre: frame(5), das: frame(4),  lock: frame(13), lineClear: frame(3) };
        if (level < 1100) return { are: frame(6), lineAre: frame(5), das: frame(4),  lock: frame(12), lineClear: frame(3) };
        if (level < 1200) return { are: frame(6), lineAre: frame(5), das: frame(4),  lock: frame(10), lineClear: frame(3) };
        if (level < 2000) return { are: frame(6), lineAre: frame(5), das: frame(4),  lock: frame(8),  lineClear: frame(3) };
        return { are: frame(12), lineAre: frame(6), das: frame(6), lock: frame(17), lineClear: frame(4) };
    }

    onSectionComplete(gameScene, sectionIndex, sectionTimeSec) {
        // SX grading with no REGRETs (unlike TGM3 Shirase)
        this.sectionTimes[sectionIndex] = sectionTimeSec;
        this.sectionGrades[sectionIndex] = 'S' + (sectionIndex + 1);
        if (gameScene) {
            gameScene.sectionPerformance = gameScene.sectionPerformance || [];
            gameScene.sectionPerformance[sectionIndex] = '';
        }
    }

    getDisplayedGrade() {
        const sectionKeys = Object.keys(this.sectionGrades).map(Number).sort((a, b) => b - a);
        if (sectionKeys.length > 0) {
            return this.sectionGrades[sectionKeys[0]];
        }
        return '';
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4ThreeOneMode;
}
if (typeof window !== 'undefined') {
    window.TGM4ThreeOneMode = TGM4ThreeOneMode;
}
