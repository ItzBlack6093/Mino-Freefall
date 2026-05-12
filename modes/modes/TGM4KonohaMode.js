class TGM4KonohaMode extends BaseMode {
    constructor(variant = 'easy') {
        super();
        this.variant = variant;
        this.modeName = variant === 'hard' ? 'Konoha Hard' : 'Konoha Easy';
        this.modeId = `tgm4_konoha_${variant}`;
        this.bravoCount = 0;
        this.config = this.getModeConfig();
    }

    getModeConfig() {
        const hard = this.variant === 'hard';
        return {
            gravity: { type: 'static', value: 256 },
            das: 12/60,
            arr: 1/60,
            are: 12/60,
            lineAre: 12/60,
            lockDelay: 30/60,
            lineClearDelay: 6/60,
            nextPieces: 6,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'lines',
            lineClearBonus: 1,
            gravityLevelCap: hard ? 9999 : 110,
            specialMechanics: {
                bigMode: true,
                allClearChallenge: true,
                fivePieceSet: !hard,
                sevenPieceSet: hard,
                timeLimit: hard ? 250 : 120,
                maxTime: 300,
                konohaMasterBravoes: 110
            }
        };
    }

    onAllClear(gameScene) {
        this.bravoCount += 1;
        if (gameScene) gameScene.bravoCount = this.bravoCount;
        return this.bravoCount;
    }

    getDisplayedGrade() {
        if (this.variant === 'hard' && this.bravoCount >= 110) return 'Km';
        return `${this.bravoCount} Bravoes`;
    }
}

class TGM4KonohaEasyMode extends TGM4KonohaMode { constructor() { super('easy'); } }
class TGM4KonohaHardMode extends TGM4KonohaMode { constructor() { super('hard'); } }

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM4KonohaMode, TGM4KonohaEasyMode, TGM4KonohaHardMode };
}
if (typeof window !== 'undefined') {
    window.TGM4KonohaMode = TGM4KonohaMode;
    window.TGM4KonohaEasyMode = TGM4KonohaEasyMode;
    window.TGM4KonohaHardMode = TGM4KonohaHardMode;
}
