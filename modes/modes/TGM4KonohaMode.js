class TGM4KonohaMode extends BaseMode {
    constructor(variant = 'easy') {
        super();
        this.variant = variant;
        this.modeName = variant === 'hard' ? 'Konoha Hard' : 'Konoha Easy';
        this.modeId = `tgm4_konoha_${variant}`;
        this.bravoCount = 0;
        this.config = this.getModeConfig();
        this.bigMode = null;
    }

    getModeConfig() {
        const hard = this.variant === 'hard';
        return {
            gravity: hard ? { type: 'custom', curve: level => this.getKonohaGravity(level) } : { type: 'static', value: 4 },
            das: 18/60,
            arr: 1/60,
            are: 27/60,
            lineAre: 27/60,
            lockDelay: 60/60,
            lineClearDelay: 25/60,
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
                timeLimitStandard: 120,
                timeLimitTGM: 250,
                maxTime: 300,
                konohaMasterBravoes: 110
            }
        };
    }

    getKonohaGravity(level) {
        if (level < 8) return 4;
        if (level < 19) return 5;
        if (level < 35) return 6;
        if (level < 40) return 8;
        if (level < 50) return 10;
        if (level < 60) return 12;
        if (level < 70) return 16;
        if (level < 80) return 32;
        if (level < 90) return 48;
        if (level < 101) return 64;
        if (level < 112) return 16;
        if (level < 121) return 48;
        if (level < 132) return 80;
        if (level < 144) return 128;
        if (level < 156) return 112;
        if (level < 167) return 144;
        if (level < 177) return 176;
        if (level < 200) return 192;
        return 5376;
    }

    initializeForGameScene(gameScene) {
        if (super.initializeForGameScene) super.initializeForGameScene(gameScene);

        if (!gameScene) return;

        // Initialize big mode for Konoha with shared module instance.
        if (!this.bigMode && typeof getBigModeInstance === 'function') {
            this.bigMode = getBigModeInstance();
        } else if (!this.bigMode && typeof BigMode !== 'undefined') {
            this.bigMode = BigMode.getSharedInstance
                ? BigMode.getSharedInstance()
                : new BigMode();
        }

        if (this.bigMode) {
            this.bigMode.initializeBigMode(gameScene);
        } else {
            // Fallback if BigMode script is unavailable.
            gameScene.bigModeActive = true;
            gameScene.bigBlocksActive = true;
        }
    }

    getTimeLimit(rotationSystem) {
        const isTGM = rotationSystem === 'ARS' || rotationSystem === 'TGM' || rotationSystem === 'classic';
        return isTGM
            ? this.config.specialMechanics.timeLimitTGM
            : this.config.specialMechanics.timeLimitStandard;
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
