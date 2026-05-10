class TGM4OneOneMode extends TGM4NormalMode {
    constructor() {
        super();
        this.modeName = 'TGM4 1.1';
        this.modeId = 'tgm4_1_1';
        this.config.specialMechanics.scoreGrade = true;
        this.config.specialMechanics.creditRollTetrisRequirement = 6;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4OneOneMode;
}
if (typeof window !== 'undefined') {
    window.TGM4OneOneMode = TGM4OneOneMode;
}
