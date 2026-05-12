class TGM4FourOneMode extends TGM4MasterMode {
    constructor() {
        super();
        this.modeName = 'TGM4 4.1';
        this.modeId = 'tgm4_4_1';
        this.config = this.getModeConfig();
    }

    getModeConfig() {
        return {
            gravity: { type: 'static', value: 5120 },
            das: 6/60,
            arr: 1/60,
            are: 6/60,
            lineAre: 6/60,
            lockDelay: 8/60,
            lineClearDelay: 6/60,
            nextPieces: 6,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 999,
            lowestGrade: 'M0',
            specialMechanics: {
                fixedSpeed: true,
                invisibleRoll: true,
                risingGarbageRoll: true,
                garbageQuota: 8,
                gmCubedOnRollClear: true
            }
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4FourOneMode;
}
if (typeof window !== 'undefined') {
    window.TGM4FourOneMode = TGM4FourOneMode;
}
