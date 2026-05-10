class TGM4TwoOneMode extends TADeathMode {
    constructor() {
        super();
        this.modeName = 'TGM4 2.1';
        this.modeId = 'tgm4_2_1';
        this.config = this.getModeConfig();
    }

    getModeConfig() {
        return {
            ...super.getModeConfig(),
            nextPieces: 3,
            holdEnabled: true,
            gravityLevelCap: 999,
            lowestGrade: 'M',
            specialMechanics: {
                ...super.getModeConfig().specialMechanics,
                torikan: true,
                torikanTimes: { classic: { level500: 200 } },
                creditRollTetrisRequirement: 8,
                onlyMasterAndGmGrades: true
            }
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4TwoOneMode;
}
if (typeof window !== 'undefined') {
    window.TGM4TwoOneMode = TGM4TwoOneMode;
}
