class TGM4OneOneMode extends TGM4NormalMode {
    constructor() {
        super();
        this.modeName = 'TGM4 1.1';
        this.modeId = 'tgm4_1_1';
        this.config.das = 14/60;
        this.config.are = 27/60;
        this.config.lineAre = 27/60;
        this.config.lineClearDelay = 40/60;
        this.config.specialMechanics.scoreGrade = true;
        this.config.specialMechanics.creditRollTetrisRequirement = 6;
        this.currentTiming = this.getTimingForLevel(0);
    }

    getTimingForLevel(level) {
        const frame = n => n / 60;
        return { are: frame(27), lineAre: frame(27), das: frame(14), lock: frame(30), lineClear: frame(40) };
    }

    getBgmConfig() {
        return BaseMode.prototype.getBgmConfig.call(this);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4OneOneMode;
}
if (typeof window !== 'undefined') {
    window.TGM4OneOneMode = TGM4OneOneMode;
}
