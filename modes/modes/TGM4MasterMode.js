class TGM4MasterMode extends TGM3ShiraseMode {
    constructor() {
        super();
        this.modeName = 'TGM4 Master';
        this.modeId = 'tgm4_master';
        this.config = this.getModeConfig();
        this.currentTiming = this.getTimingForLevel(0);
    }

    getModeConfig() {
        return {
            gravity: { type: 'static', value: 5120 },
            das: 8/60,
            arr: 1/60,
            are: 6/60,
            lineAre: 5/60,
            lockDelay: 18/60,
            lineClearDelay: 3/60,
            nextPieces: 3,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 2600,
            lowestGrade: '',
            specialMechanics: {
                pikii: true,
                pikiiSections: [[300, 399], [500, 599], [700, 999]],
                cycloneAfter1000: true,
                masterPikiiAfter1300: true,
                tetrisDeletesBottomRowAfter1300: true,
                endGameRewind: true,
                torikan: true,
                torikanTimes: { master: { level2600: 435 } }
            }
        };
    }

    getTimingForLevel(level) {
        const frame = n => n / 60;
        if (level < 300) return { are: frame(8), lineAre: frame(6), das: frame(8), lock: frame(18), lineClear: frame(4) };
        if (level < 1000) return { are: frame(6), lineAre: frame(5), das: frame(8), lock: frame(15), lineClear: frame(3) };
        if (level < 1300) return { are: frame(6), lineAre: frame(5), das: frame(6), lock: frame(13), lineClear: frame(3) };
        return { are: frame(6), lineAre: frame(5), das: frame(6), lock: frame(10), lineClear: frame(3) };
    }

    onSectionComplete(gameScene, sectionIndex) {
        if (gameScene) {
            gameScene.sectionPerformance = gameScene.sectionPerformance || [];
            gameScene.sectionPerformance[sectionIndex] = sectionIndex >= 25 ? 'Gm ROUNDS' : sectionIndex >= 10 ? 'MASTER!' : `M${sectionIndex + 1}`;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4MasterMode;
}
if (typeof window !== 'undefined') {
    window.TGM4MasterMode = TGM4MasterMode;
    window.MasterTGM4Mode = TGM4MasterMode;
}
