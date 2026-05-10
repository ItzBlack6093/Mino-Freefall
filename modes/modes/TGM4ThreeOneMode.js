class TGM4ThreeOneMode extends TGM3ShiraseMode {
    constructor() {
        super();
        this.modeName = 'TGM4 3.1';
        this.modeId = 'tgm4_3_1';
        this.config = this.getModeConfig();
    }

    getModeConfig() {
        return {
            ...super.getModeConfig(),
            das: 4/60,
            gravityLevelCap: 2000,
            specialMechanics: {
                ...super.getModeConfig().specialMechanics,
                torikanTimes: { classic: { level1000: 241, level1300: 270, level2000: 406 } },
                garbageRanges: [[500, 1000], [1400, 2000]],
                monochromeAfter1000: true,
                bigRollAfter2000: true,
                noRegrets: true
            }
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4ThreeOneMode;
}
if (typeof window !== 'undefined') {
    window.TGM4ThreeOneMode = TGM4ThreeOneMode;
}
