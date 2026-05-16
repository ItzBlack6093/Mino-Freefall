class TGM4MasterMode extends TGM3ShiraseMode {
    constructor() {
        super();
        this.modeName = 'TGM4 Master';
        this.modeId = 'tgm4_rounds';
        this.config = this.getModeConfig();
        this.currentRotationSystem = 'SRS';
        this.currentTiming = this.getTimingForLevel(0, this.currentRotationSystem);
        this.displayedGrade = '';
        this.maxLevelReached = 0;
        this.endGameActive = false;
        this.endGameCleared = false;
        this.endGameRewindLevel = null;
        this.endGameStartTime = null;
        this.endGameTimeRemaining = this.config.specialMechanics.endGameRewindSeconds;
        this.medals = { bravo: 0, tetris: 0, tspin: 0, pikii: 0 };
        this.pikiiActive = false;
        this.pikii2Active = false;
        this.masterPikiiActive = false;
        this.cycloneActive = false;
        this.masterPikiiFreezeTime = 2 / 60;
        this.lastPikiiSection = null;
    }

    getModeConfig() {
        return {
            gravity: { type: 'static', value: 5120 },
            das: 10 / 60,
            arr: 1 / 60,
            are: 12 / 60,
            lineAre: 8 / 60,
            lockDelay: 20 / 60,
            lineClearDelay: 6 / 60,
            nextPieces: 6,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 2600,
            lowestGrade: '',
            hasGrading: true,
            specialMechanics: {
                pikii: true,
                pikiiSections: [[300, 399], [500, 599], [700, 999]],
                pikii2Sections: [[700, 999]],
                cycloneAfter1000: true,
                masterPikiiAfter1300: true,
                tetrisDeletesBottomRowAfter1300: true,
                endGameRewind: true,
                endGameRewindSeconds: 65,
                backstepSnapshots: true,
                torikan: true,
                torikanTimes: { master: { level2600: 435 } }
            }
        };
    }

    initializeForGameScene(gameScene) {
        this.currentRotationSystem = gameScene?.rotationSystem || 'SRS';
        this.currentTiming = this.getTimingForLevel(gameScene?.level || 0, this.currentRotationSystem);
        this.endGameTimeRemaining = this.config.specialMechanics.endGameRewindSeconds;
    }

    isTgmRule() {
        return this.currentRotationSystem === 'ARS' ||
            this.currentRotationSystem === 'TGM' ||
            this.currentRotationSystem === 'classic';
    }

    getTimingForLevel(level, rotationSystem = this.currentRotationSystem) {
        const frame = n => n / 60;
        const useTgmDas =
            rotationSystem === 'ARS' ||
            rotationSystem === 'TGM' ||
            rotationSystem === 'classic';
        const das = standardValue => (useTgmDas ? Math.min(standardValue, this.getTgmDasValue(level)) : standardValue);

        if (level < 99) return { are: frame(12), lineAre: frame(8), das: frame(das(12)), lock: frame(20), lineClear: frame(6) };
        if (level < 100) return { are: frame(12), lineAre: frame(8), das: frame(das(12)), lock: frame(20), lineClear: frame(5) };
        if (level < 199) return { are: frame(12), lineAre: frame(7), das: frame(das(12)), lock: frame(20), lineClear: frame(5) };
        if (level < 200) return { are: frame(12), lineAre: frame(7), das: frame(das(12)), lock: frame(20), lineClear: frame(4) };
        if (level < 300) return { are: frame(12), lineAre: frame(6), das: frame(das(12)), lock: frame(20), lineClear: frame(4) };
        if (level < 400) return { are: frame(10), lineAre: frame(6), das: frame(das(12)), lock: frame(20), lineClear: frame(4) };
        if (level < 499) return { are: frame(9), lineAre: frame(6), das: frame(das(12)), lock: frame(19), lineClear: frame(4) };
        if (level < 501) return { are: frame(9), lineAre: frame(6), das: frame(das(12)), lock: frame(19), lineClear: frame(3) };
        if (level < 600) return { are: frame(8), lineAre: frame(5), das: frame(das(10)), lock: frame(19), lineClear: frame(3) };
        if (level < 700) return { are: frame(7), lineAre: frame(5), das: frame(das(10)), lock: frame(16), lineClear: frame(3) };
        if (level < 800) return { are: frame(7), lineAre: frame(5), das: frame(das(10)), lock: frame(14), lineClear: frame(3) };
        if (level < 801) return { are: frame(7), lineAre: frame(5), das: frame(das(10)), lock: frame(12), lineClear: frame(3) };
        if (level < 900) return { are: frame(7), lineAre: frame(5), das: frame(das(8)), lock: frame(12), lineClear: frame(3) };
        if (level < 1000) return { are: frame(6), lineAre: frame(5), das: frame(das(8)), lock: frame(10), lineClear: frame(3) };
        if (level < 1800) return { are: frame(12), lineAre: frame(10), das: frame(das(8)), lock: frame(16), lineClear: frame(3) };
        if (level < 1900) return { are: frame(12), lineAre: frame(10), das: frame(das(8)), lock: frame(14), lineClear: frame(3) };
        if (level < 2000) return { are: frame(12), lineAre: frame(10), das: frame(das(8)), lock: frame(12), lineClear: frame(3) };
        if (level <= 2300) return { are: frame(12), lineAre: frame(10), das: frame(das(8)), lock: frame(10), lineClear: frame(3) };
        return { are: frame(12), lineAre: frame(10), das: frame(das(4)), lock: frame(10), lineClear: frame(3) };
    }

    getTgmDasValue(level) {
        if (level < 300) return 10;
        if (level < 801) return 8;
        if (level <= 2300) return 8;
        return 4;
    }

    onSectionComplete(gameScene, sectionIndex) {
        this.updateLevelState((sectionIndex + 1) * 100);
        this.releasePikiiFrozenRows(gameScene, sectionIndex);
        if (gameScene) {
            gameScene.sectionPerformance = gameScene.sectionPerformance || [];
            gameScene.sectionPerformance[sectionIndex] = this.getDisplayedGrade();
        }
    }

    shouldBypassLevelStop() {
        return this.endGameActive;
    }

    isInRange(level, ranges) {
        return ranges.some(([start, end]) => level >= start && level <= end);
    }

    getTotalLevelBonus() {
        return Math.floor((this.medals.bravo || 0) / 6) +
            Math.floor((this.medals.tetris || 0) / 10) +
            Math.floor((this.medals.tspin || 0) / 16) +
            Math.floor((this.medals.pikii || 0) / 28);
    }

    getMasterPikiiFreezeTime() {
        const frames = 2 +
            Math.floor((this.medals.bravo || 0) * 2.5) +
            (this.medals.tetris || 0) +
            (this.medals.tspin || 0) +
            (this.medals.pikii || 0) * 3;
        return frames / 60;
    }

    updateLevelState(level) {
        const safeLevel = Math.max(0, level || 0);
        this.maxLevelReached = Math.max(this.maxLevelReached, safeLevel);
        if (this.endGameActive) {
            this.pikiiActive = false;
            this.pikii2Active = false;
            this.cycloneActive = true;
            this.masterPikiiActive = true;
        } else {
            this.pikiiActive = this.isInRange(safeLevel, [[300, 399], [500, 599], [700, 999]]);
            this.pikii2Active = this.isInRange(safeLevel, [[700, 999]]);
            this.cycloneActive = safeLevel >= 1000;
            this.masterPikiiActive = safeLevel >= 1300;
        }
        this.masterPikiiFreezeTime = this.getMasterPikiiFreezeTime();
        this.displayedGrade = this.getDisplayedGrade();
    }

    handleLineClear(gameScene, linesCleared) {
        const lastClearType = gameScene?.lastClearType || '';
        const isBravo = typeof lastClearType === 'string' && lastClearType.toLowerCase().includes('bravo');
        const isTSpinReward = !!gameScene?.lastSpinInfo?.isTSpin && linesCleared >= 2;
        const startFrozenRow = gameScene?.board ? Math.floor(gameScene.board.rows / 2) : 11;
        const clearedFrozenRow =
            (this.pikiiActive || this.pikii2Active) &&
            Array.isArray(gameScene?.clearedLines) &&
            gameScene.clearedLines.some(row => row >= startFrozenRow);

        if (isBravo) this.medals.bravo += 1;
        if (linesCleared === 4) {
            this.medals.tetris += 1;
            if (this.masterPikiiActive && gameScene) {
                gameScene.deleteBottomRowRequested = true;
            }
        }
        if (isTSpinReward) this.medals.tspin += 1;
        if (clearedFrozenRow) this.medals.pikii += 1;
        this.masterPikiiFreezeTime = this.getMasterPikiiFreezeTime();
    }

    getEffectiveLineClearCount(gameScene, linesToClear, allCompletedLines) {
        const baseCount =
            (this.pikiiActive || this.masterPikiiActive)
                ? allCompletedLines.length
                : linesToClear.length;
        if (baseCount <= 0) return 0;
        return baseCount + this.getTotalLevelBonus();
    }

    releasePikiiFrozenRows(gameScene, sectionIndex) {
        if (!gameScene?.board?.clearFrozenRows || this.endGameActive) return;
        const level = (sectionIndex + 1) * 100;
        if (!this.isInRange(level - 1, [[300, 399], [500, 599], [700, 999]])) return;
        const startRow = Math.floor(gameScene.board.rows / 2);
        gameScene.board.clearFrozenRows(startRow, gameScene.board.rows - 1);
        if (level >= 800 && level < 1000 && gameScene.board.setFrozenRows) {
            gameScene.board.setFrozenRows(startRow, gameScene.board.rows - 1, true, true);
        }
    }

    applyPikiiState(gameScene) {
        if (!gameScene?.board?.setFrozenRows) return;
        const startRow = Math.floor(gameScene.board.rows / 2);
        if (this.endGameActive) {
            gameScene.board.clearFrozenRows(startRow, gameScene.board.rows - 1);
            this.lastPikiiSection = null;
            return;
        }

        const level = gameScene.level || this.maxLevelReached;
        const section = Math.floor(level / 100);
        if (this.pikiiActive) {
            gameScene.board.setFrozenRows(startRow, gameScene.board.rows - 1, true, true);
            this.lastPikiiSection = section;
        } else if (this.lastPikiiSection !== null) {
            gameScene.board.clearFrozenRows(startRow, gameScene.board.rows - 1);
            this.lastPikiiSection = null;
        }
    }

    applyCycloneRotation(piece, gameScene) {
        if (!this.cycloneActive || !piece) return;
        const arsRotations = typeof SEGA_ROTATIONS !== 'undefined' ? SEGA_ROTATIONS : null;
        const srsRotations = typeof TETROMINOES !== 'undefined' ? TETROMINOES : null;
        const rotations = gameScene?.rotationSystem === 'ARS'
            ? arsRotations?.[piece.type]?.rotations
            : srsRotations?.[piece.type]?.rotations;
        if (!rotations?.length) return;
        const rotation = Math.floor(Math.random() * rotations.length);
        piece.tgm4Cyclone = true;
        piece.rotation = rotation;
        piece.shape = rotations[rotation].map(row => [...row]);
    }

    onPieceSpawn(piece, gameScene) {
        this.currentRotationSystem = gameScene?.rotationSystem || this.currentRotationSystem;
        this.currentTiming = this.getTimingForLevel(gameScene?.level || this.maxLevelReached, this.currentRotationSystem);
        this.updateLevelState(gameScene?.level || this.maxLevelReached);
        this.applyPikiiState(gameScene);
        this.applyCycloneRotation(piece, gameScene);
        if (this.masterPikiiActive && piece) {
            piece.tgm4MasterPikii = true;
            piece.freezeAfter = this.masterPikiiFreezeTime;
            piece.freezeAt = (gameScene?.currentTime || 0) + this.masterPikiiFreezeTime;
        }
        return piece;
    }

    rerollUpcomingPieces(gameScene) {
        if (!gameScene) return;
        gameScene.bagQueue = [];
        gameScene.bagDrawCount = 0;
        gameScene.nextPieces = gameScene.generateNextPieces(this.config.nextPieces);
    }

    getEndGameResultGrade() {
        if (!this.endGameCleared) return 'GM';
        const rewindLevel = this.endGameRewindLevel ?? 1960;
        if (rewindLevel < 1300) return 'GM-King of Rounds';
        if (rewindLevel < 1370) return 'GM-Rounds-Sir Lancelot';
        if (rewindLevel < 1480) return 'GM-Rounds-Sir Gawain';
        if (rewindLevel < 1550) return 'GM-Rounds-Sir Tristan';
        if (rewindLevel < 1600) return 'GM-Rounds-Ten';
        if (rewindLevel < 1650) return 'GM-Rounds-Nine';
        if (rewindLevel < 1700) return 'GM-Rounds-Eight';
        if (rewindLevel < 1750) return 'GM-Rounds-Seven';
        if (rewindLevel < 1800) return 'GM-Rounds-Six';
        if (rewindLevel < 1850) return 'GM-Rounds-Five';
        if (rewindLevel < 1900) return 'GM-Rounds-Four';
        if (rewindLevel < 1920) return 'GM-Rounds-Three';
        if (rewindLevel < 1940) return 'GM-Rounds-Two';
        if (rewindLevel < 1960) return 'GM-Rounds-One';
        return 'GM-Rounds';
    }

    startEndGame(gameScene) {
        const rewindSeconds = this.config.specialMechanics.endGameRewindSeconds;
        const currentTime = gameScene?.currentTime || 0;
        const targetSnapshot = gameScene?.findBackstepSnapshotForAbsoluteTime
            ? gameScene.findBackstepSnapshotForAbsoluteTime(Math.max(0, currentTime - rewindSeconds))
            : null;
        if (!targetSnapshot) return false;

        const preservedMedals = { ...this.medals };
        const targetLevel = targetSnapshot.level || 0;

        // END GAME rewind is an immediate state jump: no piece rewind animation.
        gameScene.restoreBackstepSnapshot(targetSnapshot, { deferCurrentPiece: false });
        this.medals = preservedMedals;
        this.maxLevelReached = 2600;
        this.endGameActive = true;
        this.endGameCleared = false;
        this.endGameRewindLevel = targetLevel;
        this.endGameStartTime = targetSnapshot.currentTime || 0;
        this.endGameTimeRemaining = rewindSeconds;
        gameScene.level999Reached = false;
        gameScene.levelMaxSoundPlayed = false;
        gameScene.creditsPending = false;
        gameScene.creditsActive = false;
        gameScene.creditsTimer = 0;
        gameScene.grade = 'GM';
        if (gameScene.board?.clearFrozenRows) {
            gameScene.board.clearFrozenRows(0, gameScene.board.rows - 1);
        }
        gameScene.backstepHistory = [gameScene.captureBackstepSnapshot('endgame-start')].filter(Boolean);
        this.rerollUpcomingPieces(gameScene);
        this.updateLevelState(targetLevel);
        return true;
    }

    onReachedMaxLevel(gameScene) {
        const limit = this.config.specialMechanics.torikanTimes?.master?.level2600 ?? 435;
        if (this.endGameActive) {
            this.endGameActive = false;
            this.endGameCleared = true;
            this.endGameTimeRemaining = 0;
            this.displayedGrade = this.getDisplayedGrade();
            return false;
        }

        if ((gameScene?.currentTime || 0) > limit) {
            this.endGameActive = false;
            this.endGameCleared = false;
            this.displayedGrade = this.getDisplayedGrade();
            if (gameScene) {
                gameScene.grade = 'GM';
                gameScene.showGameOverScreen();
            }
            return true;
        }

        return this.startEndGame(gameScene);
    }

    captureBackstepState() {
        return {
            currentRotationSystem: this.currentRotationSystem,
            currentTiming: this.currentTiming,
            displayedGrade: this.displayedGrade,
            maxLevelReached: this.maxLevelReached,
            endGameActive: this.endGameActive,
            endGameCleared: this.endGameCleared,
            endGameRewindLevel: this.endGameRewindLevel,
            endGameStartTime: this.endGameStartTime,
            endGameTimeRemaining: this.endGameTimeRemaining,
            medals: { ...this.medals },
            lastPikiiSection: this.lastPikiiSection
        };
    }

    restoreBackstepState(gameScene, state = {}) {
        this.currentRotationSystem = state.currentRotationSystem || gameScene?.rotationSystem || this.currentRotationSystem;
        this.currentTiming = state.currentTiming || this.getTimingForLevel(gameScene?.level || 0, this.currentRotationSystem);
        this.displayedGrade = state.displayedGrade || this.displayedGrade;
        this.maxLevelReached = state.maxLevelReached || 0;
        this.endGameActive = !!state.endGameActive;
        this.endGameCleared = !!state.endGameCleared;
        this.endGameRewindLevel = typeof state.endGameRewindLevel === 'number' ? state.endGameRewindLevel : null;
        this.endGameStartTime = typeof state.endGameStartTime === 'number' ? state.endGameStartTime : null;
        this.endGameTimeRemaining = typeof state.endGameTimeRemaining === 'number'
            ? state.endGameTimeRemaining
            : this.config.specialMechanics.endGameRewindSeconds;
        this.medals = {
            bravo: state.medals?.bravo || 0,
            tetris: state.medals?.tetris || 0,
            tspin: state.medals?.tspin || 0,
            pikii: state.medals?.pikii || 0
        };
        this.lastPikiiSection = typeof state.lastPikiiSection === 'number' ? state.lastPikiiSection : null;
        this.updateLevelState(gameScene?.level || 0);
    }

    update(gameScene) {
        if (!gameScene) return;
        this.currentRotationSystem = gameScene.rotationSystem || this.currentRotationSystem;
        this.currentTiming = this.getTimingForLevel(gameScene.level || 0, this.currentRotationSystem);
        this.updateLevelState(gameScene.level || 0);
        this.applyPikiiState(gameScene);

        if (this.endGameActive) {
            const rewindSeconds = this.config.specialMechanics.endGameRewindSeconds;
            const elapsed = Math.max(0, (gameScene.currentTime || 0) - (this.endGameStartTime || 0));
            this.endGameTimeRemaining = Math.max(0, rewindSeconds - elapsed);
            if (this.endGameTimeRemaining <= 0 && !gameScene.gameOver) {
                this.endGameActive = false;
                gameScene.grade = 'GM';
                gameScene.showGameOverScreen();
                return;
            }
        }

        gameScene.tgm4MasterState = {
            pikiiActive: this.pikiiActive,
            pikii2Active: this.pikii2Active,
            cycloneActive: this.cycloneActive,
            masterPikiiActive: this.masterPikiiActive,
            masterPikiiFreezeTime: this.masterPikiiFreezeTime,
            endGameActive: this.endGameActive,
            endGameRewindLevel: this.endGameRewindLevel,
            endGameTimeRemaining: this.endGameTimeRemaining,
            medals: { ...this.medals }
        };
    }

    onCreditsEnd() {
        if (this.endGameCleared) {
            this.displayedGrade = this.getDisplayedGrade();
        }
    }

    onGameOver(gameScene) {
        this.endGameActive = false;
        if (gameScene) this.updateLevelState(gameScene.level || 0);
    }

    getDisplayedTime() {
        if (this.endGameActive) return this.endGameTimeRemaining;
        return null;
    }

    getDisplayedGrade() {
        if (this.endGameCleared) return this.getEndGameResultGrade();
        if (this.maxLevelReached >= 2600) return 'GM';
        if (this.maxLevelReached >= 1100) return 'MASTER!';
        return '';
    }

    getGradePoints() {
        return this.maxLevelReached;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM4MasterMode;
}
if (typeof window !== 'undefined') {
    window.TGM4MasterMode = TGM4MasterMode;
    window.MasterTGM4Mode = TGM4MasterMode;
}
