class TGM4KonohaMode extends BaseMode {
    constructor(variant = 'easy') {
        super();
        this.variant = variant;
        this.modeName = variant === 'hard' ? 'Konoha Hard' : 'Konoha Easy';
        this.modeId = `tgm4_konoha_${variant}`;
        this.bravoCount = 0;
        this.config = this.getModeConfig();
        this.bigMode = null;
        this.currentRotationSystem = 'SRS';
        this.timeRemaining = 0;
        this.timerStarted = false;
        this.timeExpired = false;
        this.lastTimerTime = null;
        this.randomizerHistory = ['Z', 'Z', 'S', 'S'];
        this.randomizerFirstPiece = true;
        this.minosa = null;
        this.minosaStatus = 'possible';
        this.minosaHint = null;
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
            gravityLevelCap: 9999,
            specialMechanics: {
                bigMode: true,
                allClearChallenge: true,
                fivePieceSet: !hard,
                sevenPieceSet: hard,
                timeLimitStandard: 120,
                timeLimitTGM: 250,
                maxTime: 300,
                konohaEasyGoalBravoes: 110,
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

        this.currentRotationSystem = gameScene.rotationSystem || 'SRS';
        this.timeRemaining = this.getTimeLimit(this.currentRotationSystem);
        this.timerStarted = false;
        this.timeExpired = false;
        this.lastTimerTime = null;
        this.bravoCount = 0;
        this.randomizerHistory = ['Z', 'Z', 'S', 'S'];
        this.randomizerFirstPiece = true;
        this.minosaStatus = 'possible';
        this.minosaHint = null;
        gameScene.bravoCount = 0;
        gameScene.minosaStatus = this.minosaStatus;
        gameScene.minosaPath = [];
        gameScene.minosaHint = null;

        if (!this.minosa && typeof getMinosaModuleInstance === 'function') {
            this.minosa = getMinosaModuleInstance();
        } else if (!this.minosa && typeof MinosaModule !== 'undefined') {
            this.minosa = MinosaModule.getSharedInstance
                ? MinosaModule.getSharedInstance()
                : new MinosaModule();
        }

        // Initialize big mode for Konoha with shared module instance.
        if (!this.bigMode && typeof getBigModeInstance === 'function') {
            this.bigMode = getBigModeInstance();
        } else if (!this.bigMode && typeof BigMode !== 'undefined') {
            this.bigMode = BigMode.getSharedInstance
                ? BigMode.getSharedInstance()
                : new BigMode();
        }

        if (this.bigMode) {
            this.bigMode.initializeBigMode(gameScene, {
                boardDimensions: true,
                visualScale: false
            });
        } else {
            gameScene.bigModeActive = true;
            gameScene.bigBlocksActive = false;
            if (typeof gameScene.applyBigModeBoardDimensions === 'function') {
                gameScene.applyBigModeBoardDimensions({ cols: 5, rows: 12, visibleRows: 10 });
            }
        }
    }

    getTimeLimit(rotationSystem) {
        const isTGM = rotationSystem === 'ARS' || rotationSystem === 'TGM' || rotationSystem === 'classic';
        return isTGM
            ? this.config.specialMechanics.timeLimitTGM
            : this.config.specialMechanics.timeLimitStandard;
    }

    getTimeBonusFrames(linesCleared, isBravo, level) {
        if (linesCleared <= 0) return 0;
        const post1000 = level >= 1000;
        if (post1000) {
            return linesCleared >= 4 ? 60 : 0;
        }
        if (isBravo) {
            if (linesCleared >= 4) return 900;
            if (linesCleared === 3) return 660;
            if (linesCleared === 2) return 480;
            return 300;
        }
        if (linesCleared >= 4) return 11;
        if (linesCleared === 3) return 5;
        if (linesCleared === 2) return 2;
        return 1;
    }

    addTimeBonus(frames) {
        if (!frames) return;
        const seconds = frames / 60;
        this.timeRemaining = Math.min(this.config.specialMechanics.maxTime, this.timeRemaining + seconds);
    }

    getAllowedPieces() {
        return this.variant === 'hard'
            ? ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
            : ['I', 'J', 'L', 'O', 'T'];
    }

    generateNextPiece() {
        const allowedPieces = this.getAllowedPieces();
        const firstPiecePool = allowedPieces.filter(piece => !['S', 'Z', 'O'].includes(piece));

        let piece = allowedPieces[0];
        if (this.randomizerFirstPiece) {
            const pool = firstPiecePool.length > 0 ? firstPiecePool : allowedPieces;
            piece = pool[Math.floor(Math.random() * pool.length)];
            this.randomizerFirstPiece = false;
        } else {
            let attempts = 0;
            do {
                piece = allowedPieces[Math.floor(Math.random() * allowedPieces.length)];
                attempts += 1;
            } while (attempts < 6 && this.randomizerHistory.includes(piece));
        }

        this.randomizerHistory.shift();
        this.randomizerHistory.push(piece);
        return piece;
    }

    onLevelUpdate(level, oldLevel, updateType, amount) {
        if (updateType !== 'lines') return level;
        const lineGain = {
            1: 2,
            2: 4,
            3: 6,
            4: 12
        };
        const nextLevel = oldLevel + (lineGain[amount] || 0);
        return Math.min(nextLevel, this.config.gravityLevelCap);
    }

    handleLineClear(gameScene, linesCleared) {
        const isBravo = gameScene?.bravoActive ||
            gameScene?.lastClearType === 'bravo' ||
            (typeof gameScene?.lastClearType === 'string' && gameScene.lastClearType.includes('all clear'));

        if (isBravo) {
            this.bravoCount += 1;
            if (gameScene) {
                gameScene.bravoCount = this.bravoCount;
            }
        }

        this.addTimeBonus(this.getTimeBonusFrames(linesCleared, isBravo, gameScene?.level || 0));

        if (
            this.variant === 'easy' &&
            this.bravoCount >= this.config.specialMechanics.konohaEasyGoalBravoes &&
            gameScene &&
            !gameScene.gameOver
        ) {
            gameScene.showGameOverScreen();
        }
    }

    getDisplayedTime() {
        return this.timeRemaining;
    }

    getDisplayedGrade() {
        if (this.variant === 'hard' && this.bravoCount >= 110) return 'Km';
        return `${this.bravoCount} Bravoes`;
    }

    updateMinosaStatus(gameScene) {
        if (!gameScene) return this.minosaStatus;
        if (!this.minosa && typeof getMinosaModuleInstance === 'function') {
            this.minosa = getMinosaModuleInstance();
        }
        const result = this.minosa && typeof this.minosa.evaluateGameScene === 'function'
            ? this.minosa.evaluateGameScene(gameScene)
            : { status: 'impossible' };
        this.minosaStatus = result.status || 'impossible';
        const path = Array.isArray(result.path) ? result.path : [];
        this.minosaHint = path.length > 0 ? path[0] : null;
        gameScene.minosaStatus = this.minosaStatus;
        gameScene.minosaPath = path;
        gameScene.minosaHint = this.minosaHint;
        return this.minosaStatus;
    }

    update(gameScene) {
        if (!gameScene || gameScene.gameOver) return;
        this.updateMinosaStatus(gameScene);
        if (!this.timerStarted && gameScene.currentPiece) {
            this.timerStarted = true;
            this.lastTimerTime = gameScene.currentTime || 0;
        }
        if (!this.timerStarted || this.timeExpired) return;

        const now = gameScene.currentTime || 0;
        const delta = this.lastTimerTime === null ? 0 : Math.max(0, now - this.lastTimerTime);
        this.lastTimerTime = now;
        this.timeRemaining = Math.max(0, this.timeRemaining - delta);
        if (this.timeRemaining <= 0) {
            this.timeExpired = true;
            gameScene.showGameOverScreen();
        }
    }

    onGameOver(gameScene) {
        if (!gameScene || typeof gameScene.saveLeaderboardEntry !== 'function') return;
        const time = `${Math.floor(gameScene.currentTime / 60)}:${Math.floor(gameScene.currentTime % 60).toString().padStart(2, '0')}.${Math.floor((gameScene.currentTime % 1) * 100).toString().padStart(2, '0')}`;
        gameScene.saveLeaderboardEntry(gameScene.selectedMode, {
            allClears: this.bravoCount,
            level: gameScene.level,
            grade: this.getDisplayedGrade(),
            time,
            pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined
        });
        gameScene.leaderboardSaved = true;
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
