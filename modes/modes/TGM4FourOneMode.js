class TGM4FourOneMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM4 4.1';
        this.modeId = 'tgm4_4_1';
        this.config = this.getModeConfig();
        this.sectionsPassed = 0;
        this.maxLevelReached = 0;
        this.rollCleared = false;
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
            hasGrading: true,
            specialMechanics: {
                fixedSpeed: true,
                invisibleRoll: true,
                risingGarbageRoll: true,
                garbageQuota: 8,
                gmCubedOnRollClear: true
            }
        };
    }

    onLevelUpdate(level, oldLevel, updateType = 'piece', amount = 1) {
        const max = this.config.gravityLevelCap;
        let nextLevel = level;

        if (updateType === 'piece') {
            nextLevel = Math.min(level + 1, max);
        } else if (updateType === 'lines') {
            nextLevel = Math.min(level + Math.max(amount || 0, 0), max);
        }

        this.maxLevelReached = Math.max(this.maxLevelReached, nextLevel);
        return nextLevel;
    }

    onSectionComplete(gameScene, sectionIndex) {
        this.sectionsPassed = Math.max(this.sectionsPassed, sectionIndex + 1);
    }

    onCreditsEnd(gameScene) {
        this.rollCleared = true;
    }

    getDisplayedGrade() {
        if (this.rollCleared) return 'GM\u00B3';
        if (this.sectionsPassed > 0) return `M${this.sectionsPassed}`;
        return 'M0';
    }

    getGradePoints() {
        return this.maxLevelReached;
    }

    getARE() { return this.config.are; }
    getLineARE() { return this.config.lineAre; }
    getDAS() { return this.config.das; }
    getARR() { return this.config.arr; }
    getLockDelay() { return this.config.lockDelay; }
    getLineClearDelay() { return this.config.lineClearDelay; }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4FourOneMode;
}
if (typeof window !== 'undefined') {
    window.TGM4FourOneMode = TGM4FourOneMode;
}
