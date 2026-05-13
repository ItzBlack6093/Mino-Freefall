class TGM4TwoOneMode extends TADeathMode {
    constructor() {
        super();
        this.modeName = 'TGM4 2.1';
        this.modeId = 'tgm4_2_1';
        this.config = this.getModeConfig();
        // Override timing phases: slower ARE pre-500, faster DAS and Line clear ARE
        this.timingPhases = [
            { minLevel: 0,   maxLevel: 99,  are: 18/60, lineAre: 14/60, das: 10/60, arr: 1/60, lock: 30/60, lineClear: 12/60 },
            { minLevel: 100, maxLevel: 199, are: 14/60, lineAre: 8/60,  das: 10/60, arr: 1/60, lock: 26/60, lineClear: 6/60 },
            { minLevel: 200, maxLevel: 299, are: 14/60, lineAre: 8/60,  das: 9/60,  arr: 1/60, lock: 22/60, lineClear: 6/60 },
            { minLevel: 300, maxLevel: 399, are: 12/60, lineAre: 8/60,  das: 8/60,  arr: 1/60, lock: 20/60, lineClear: 6/60 },
            { minLevel: 400, maxLevel: 499, are: 10/60, lineAre: 6/60,  das: 6/60,  arr: 1/60, lock: 18/60, lineClear: 5/60 },
            { minLevel: 500, maxLevel: 999, are: 6/60,  lineAre: 5/60,  das: 6/60,  arr: 1/60, lock: 15/60, lineClear: 4/60 }
        ];
        this.torikanLimit = 200.0;
    }

    getModeConfig() {
        return {
            ...super.getModeConfig(),
            nextPieces: 6,
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
