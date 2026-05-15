class TGM4NormalMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM4 Normal';
        this.modeId = 'tgm4_normal';
        this.config = this.getModeConfig();
        this.currentTiming = this.getTimingForLevel(0);
        this.aValue = 0;
        this.bValue = 0;
        this.rollCompleted = false;

        // A grading is evaluated over 9 "grading sections":
        // - 000-199 counts as a single section
        // - 200-299, 300-399, ... , 900-999 are individual sections
        this.sectionState = Array.from({ length: 9 }, () => ({
            score: 0,
            tetrises: 0,
            perfectClearAwarded: false,
            evaluated: false
        }));
        this.overallSectionScore = 0;
        this.overallBonusAwarded = false;
        this.anySectionQualified = false;
        this.currentGradingSectionIndex = 0;
    }

    getModeConfig() {
        return {
            gravity: { type: 'custom', curve: level => this.getGravitySpeed(level) },
            das: 18/60,
            arr: 1/60,
            are: 32/60,
            lineAre: 32/60,
            lockDelay: 30/60,
            lineClearDelay: 40/60,
            nextPieces: 6,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 999,
            lowestGrade: 'Zero of Zero',
            hasGrading: true,
            specialMechanics: {
                tgm4NormalGrading: true,
                sectionScoreRequirements: true,
                progressGrade: true
            }
        };
    }

    getGravitySpeed(level) {
        const g = this.getTGM1GravitySpeed(level);
        return g >= 5120 ? 5376 : g;
    }

    getTimingForLevel(level) {
        const frame = n => n / 60;
        return { are: frame(32), lineAre: frame(32), das: frame(18), lock: frame(30), lineClear: frame(40) };
    }

    updateTiming(level) {
        this.currentTiming = this.getTimingForLevel(level);
    }

    onLevelUpdate(level, oldLevel, updateType = 'piece', amount = 1) {
        const max = this.config.gravityLevelCap;
        let nextLevel = level;
        const atStopLevel = (level % 100 === 99) || level === max - 1 || level === max;

        if (updateType === 'piece') {
            nextLevel = atStopLevel ? level : Math.min(level + 1, max);
        } else if (updateType === 'lines') {
            nextLevel = Math.min(level + Math.max(amount || 0, 0), max);
        }

        // B is based on current progress (what you'd get if you topped out now).
        this.bValue = this.computeBValue(nextLevel);
        this.updateTiming(nextLevel);
        return nextLevel;
    }

    computeBValue(level, creditsActive = false) {
        if (creditsActive) return 9;
        if (this.rollCompleted) return 10;
        // B thresholds per Tetris Wiki (Normal mode grading).
        if (level <= 110) return 0;
        if (level <= 221) return 1;
        if (level <= 332) return 2;
        if (level <= 443) return 3;
        if (level <= 554) return 4;
        if (level <= 665) return 5;
        if (level <= 776) return 6;
        if (level <= 887) return 7;
        if (level <= 998) return 8;
        // Reaching 999 starts credits; B=9/10 depends on roll result.
        return 8;
    }

    getGradingSectionIndexFromGameSection(sectionIndex) {
        // Game sections are 0-99, 100-199, 200-299, ... (100 levels each).
        // Grading sections treat 0-199 as one section.
        if (sectionIndex <= 1) return 0;
        return Math.max(0, Math.min(8, sectionIndex - 1));
    }

    getGradingSectionIndexFromGameScene(gameScene) {
        const rawSection =
            typeof gameScene?.currentSection === 'number'
                ? gameScene.currentSection
                : Math.floor((gameScene?.level || 0) / 100);
        return this.getGradingSectionIndexFromGameSection(rawSection);
    }

    handleLineClear(gameScene, linesCleared) {
        if (!gameScene || linesCleared <= 0) return;
        const gs = this.getGradingSectionIndexFromGameScene(gameScene);
        this.currentGradingSectionIndex = gs;
        const state = this.sectionState[gs];
        if (!state) return;

        // Section scoring (pre-v1.7.0 rules):
        // - Tetris: 175 points
        // - Perfect Clear (bravo): 350 points, only once per grading section
        if (linesCleared === 4) {
            state.tetrises += 1;
            state.score += 175;
        }
        if (gameScene.lastClearType === 'bravo' && !state.perfectClearAwarded) {
            state.perfectClearAwarded = true;
            state.score += 350;
        }
    }

    getGradePoints() {
        // Match the TGM3-style "internal points" display by showing the current grading section score.
        // (v1.7.0+ section score is based on tetrises and one perfect clear per section.)
        const state = this.sectionState[this.currentGradingSectionIndex];
        return state ? state.score : 0;
    }

    onSectionComplete(gameScene, sectionIndex, sectionTimeSec = null) {
        // A can only be increased during the main game. Do not evaluate during credits.
        if (!gameScene || gameScene.creditsActive) return;

        // Ignore 000-099 completion; 000-199 is evaluated together when 100-199 completes.
        if (sectionIndex === 0) return;

        const gs = this.getGradingSectionIndexFromGameSection(sectionIndex);
        const state = this.sectionState[gs];
        if (!state || state.evaluated) return;

        if (state.score >= 1000) {
            this.aValue = Math.min(10, this.aValue + 1);
            this.anySectionQualified = true;
        }
        this.overallSectionScore += state.score;
        state.evaluated = true;

        // Overall A bonus (v1.7.0+): overall section score >= 11000, and at least one qualifying section.
        if (!this.overallBonusAwarded && this.anySectionQualified && this.overallSectionScore >= 11000) {
            this.aValue = Math.min(10, this.aValue + 1);
            this.overallBonusAwarded = true;
        }

        // Optional: expose per-game-section performance string.
        gameScene.sectionPerformance = gameScene.sectionPerformance || [];
        gameScene.sectionPerformance[sectionIndex] = `${this.getNumberWord(this.aValue)} of ${this.getNumberWord(this.bValue)}`;
    }

    onCreditsEnd(gameScene) {
        // Completed the roll if credits ended without topping out during roll.
        if (gameScene && !gameScene.rollFailedDuringRoll) {
            this.rollCompleted = true;
        }
    }

    onGameOver(gameScene) {
        // If topped out during credits roll, lock B to Nine.
        if (gameScene && gameScene.creditsActive) {
            this.rollCompleted = false;
            this.bValue = 9;
            return;
        }
        if (gameScene) {
            this.bValue = this.computeBValue(gameScene.level || 0, false);
        }
    }

    update(gameScene) {
        if (!gameScene) return;
        this.currentGradingSectionIndex = this.getGradingSectionIndexFromGameScene(gameScene);
        this.bValue = this.computeBValue(gameScene.level || 0, !!gameScene.creditsActive);
    }

    getNumberWord(n) {
        const words = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'];
        return words[Math.max(0, Math.min(10, Math.floor(n || 0)))] || 'Zero';
    }

    getDisplayedGrade() { return `${this.getNumberWord(this.aValue)} of ${this.getNumberWord(this.bValue)}`; }
    getARE() { return this.currentTiming?.are ?? this.config.are; }
    getLineARE() { return this.currentTiming?.lineAre ?? this.config.lineAre; }
    getDAS() { return this.currentTiming?.das ?? this.config.das; }
    getARR() { return this.config.arr; }
    getLockDelay() { return this.currentTiming?.lock ?? this.config.lockDelay; }
    getLineClearDelay() { return this.currentTiming?.lineClear ?? this.config.lineClearDelay; }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4NormalMode;
}
if (typeof window !== 'undefined') {
    window.TGM4NormalMode = TGM4NormalMode;
}
