class TGM4AsukaMode extends BaseMode {
    constructor(variant = 'normal') {
        super();
        this.variant = variant;
        this.modeName = variant === 'easy' ? 'Asuka Easy' : variant === 'hard' ? 'Asuka Hard' : 'Asuka';
        this.modeId = `tgm4_asuka_${variant}`;
        this.config = this.getModeConfig();
        this.currentTiming = this.getTimingForLevel(0);
        this.kitas = 0;
        this.totalKitas = 0;
        this.sectionKitas = 0;
        this.easySectionBonus = 0;
        this.backsteps = 0;
        this.sectionsPassed = 0;
        this.maxLevelReached = 0;
        this.completed = false;
    }

    getModeConfig() {
        const easy = this.variant === 'easy';
        const hard = this.variant === 'hard';
        return {
            gravity: easy ? { type: 'custom', curve: level => this.getAsukaEasyGravity(level) } : { type: 'static', value: 5120 },
            das: easy ? 14/60 : 10/60,
            arr: 1/60,
            are: easy ? 20/60 : 12/60,
            lineAre: easy ? 16/60 : 8/60,
            lockDelay: 30/60,
            lineClearDelay: easy ? 12/60 : 6/60,
            nextPieces: 6,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: easy ? 1000 : 1300,
            lowestGrade: easy ? 'Ae 1' : hard ? 'Am Grade 0' : '',
            hasGrading: true,
            specialMechanics: {
                kitaRequired: true,
                rewind: true,
                infinity: true,
                vanishAfter1000: !easy,
                invisibleAfter1200: !easy,
                carriedKitas: hard,
                timeLimit: easy ? 1800 : hard ? 270 : 420
            }
        };
    }

    getAsukaEasyGravity(level) {
        // TGM1 gravity curve offset by +300 levels
        return this.getTGM1GravitySpeed(Math.max(0, level - 300));
    }

    getTimingForLevel(level) {
        const frame = n => n / 60;
        if (this.variant === 'easy') return { are: frame(20), lineAre: frame(16), das: frame(14), lock: frame(30), lineClear: frame(12) };
        if (level < 500) return { are: frame(12), lineAre: frame(8), das: frame(10), lock: frame(30), lineClear: frame(6) };
        if (level < 1000) return { are: frame(10), lineAre: frame(7), das: frame(8), lock: frame(25), lineClear: frame(5) };
        return { are: frame(8), lineAre: frame(6), das: frame(8), lock: frame(20), lineClear: frame(4) };
    }

    onLineClear(gameScene, linesCleared) {
        let gainedKitas = 0;
        const isTetris = linesCleared >= 4;
        const isTSpinTriple = linesCleared === 3 && gameScene?.lastSpinInfo?.isTSpin;
        const isBravo = gameScene?.bravoActive || gameScene?.lastClearType === 'bravo' || (gameScene?.lastClearType && gameScene.lastClearType.includes('all clear'));

        if (isTetris || isTSpinTriple) {
            gainedKitas += 1;
        }
        if (isBravo) {
            gainedKitas += (this.variant === 'hard' ? 1 : 2);
        }

        this.kitas += gainedKitas;
        this.totalKitas += gainedKitas;
        this.sectionKitas += gainedKitas;
        if (gameScene) gameScene.kitas = this.kitas;
    }

    handleLineClear(gameScene, linesCleared) {
        this.onLineClear(gameScene, linesCleared);
    }

    onLevelUpdate(level, oldLevel, updateType = 'piece', amount = 1) {
        const max = this.config.gravityLevelCap;
        let nextLevel = updateType === 'lines' ? level + Math.max(amount || 0, 0) : level + 1;
        const nextSection = Math.floor(nextLevel / 100);
        const currentSection = Math.floor(level / 100);

        if (nextSection > currentSection && this.kitas <= 0) nextLevel = currentSection * 100 + 99;
        if (nextSection > currentSection && this.kitas > 0) {
            this.sectionsPassed = Math.max(this.sectionsPassed, nextSection);
            if (this.variant === 'hard') this.kitas = Math.max(0, this.kitas - 1);
            else this.kitas = 0;
        }

        this.maxLevelReached = Math.max(this.maxLevelReached, Math.min(nextLevel, max));
        this.completed = this.maxLevelReached >= max;
        this.currentTiming = this.getTimingForLevel(nextLevel);
        return Math.min(nextLevel, max);
    }

    onSectionComplete(gameScene, sectionIndex) {
        this.sectionsPassed = Math.max(this.sectionsPassed, sectionIndex + 1);
        if (this.variant === 'easy') {
            this.easySectionBonus += 3 * Math.floor(this.sectionKitas / 3);
        }
        this.sectionKitas = 0;
    }

    onGameOver(gameScene) {
        if (gameScene) {
            this.maxLevelReached = Math.max(this.maxLevelReached, gameScene.level || 0);
            this.completed = this.completed || this.maxLevelReached >= this.config.gravityLevelCap;
        }
    }

    getAsukaEasyGradeValue() {
        let grade = Math.floor(this.maxLevelReached / 70) * 6;
        if (this.maxLevelReached >= 1000) grade += 7;
        grade += this.easySectionBonus;
        grade += Math.ceil((this.totalKitas - this.backsteps) / 2.5);
        return grade;
    }

    getDisplayedGrade() {
        if (this.variant === 'normal') return this.completed ? 'Am' : '';
        if (this.variant === 'hard') return this.completed ? 'ASUKA Gm' : `Am Grade ${this.sectionsPassed}`;
        const grade = this.getAsukaEasyGradeValue();
        return grade > 0 ? `Ae ${grade}` : '';
    }

    getGradePoints() {
        if (this.variant === 'easy') return this.getAsukaEasyGradeValue();
        return this.kitas;
    }

    getARE() { return this.currentTiming?.are ?? this.config.are; }
    getLineARE() { return this.currentTiming?.lineAre ?? this.config.lineAre; }
    getDAS() { return this.currentTiming?.das ?? this.config.das; }
    getLockDelay() { return this.currentTiming?.lock ?? this.config.lockDelay; }
    getLineClearDelay() { return this.currentTiming?.lineClear ?? this.config.lineClearDelay; }
}

class TGM4AsukaEasyMode extends TGM4AsukaMode { constructor() { super('easy'); } }
class TGM4AsukaNormalMode extends TGM4AsukaMode { constructor() { super('normal'); } }
class TGM4AsukaHardMode extends TGM4AsukaMode { constructor() { super('hard'); } }

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM4AsukaMode, TGM4AsukaEasyMode, TGM4AsukaNormalMode, TGM4AsukaHardMode };
}
if (typeof window !== 'undefined') {
    window.TGM4AsukaMode = TGM4AsukaMode;
    window.TGM4AsukaEasyMode = TGM4AsukaEasyMode;
    window.TGM4AsukaNormalMode = TGM4AsukaNormalMode;
    window.TGM4AsukaHardMode = TGM4AsukaHardMode;
}
