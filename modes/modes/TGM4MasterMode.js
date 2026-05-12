class TGM4MasterMode extends TGM3ShiraseMode {
    constructor() {
        super();
        this.modeName = 'TGM4 Master';
        this.modeId = 'tgm4_rounds';
        this.config = this.getModeConfig();
        this.currentTiming = this.getTimingForLevel(0);
        this.displayedGrade = '';
        this.maxLevelReached = 0;
        this.endGameCleared = false;
        this.medals = { bravo: 0, tetris: 0 };
        this.pikiiActive = false;
        this.pikii2Active = false;
        this.masterPikiiActive = false;
        this.cycloneActive = false;
        this.masterPikiiFreezeTime = 2/60;
        this.lastPikiiSection = null;
    }

    getModeConfig() {
        return {
            gravity: { type: 'static', value: 5120 },
            das: 10/60,
            arr: 1/60,
            are: 12/60,
            lineAre: 8/60,
            lockDelay: 20/60,
            lineClearDelay: 6/60,
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
                torikan: true,
                torikanTimes: { master: { level2600: 435 } }
            }
        };
    }

    getTimingForLevel(level) {
        const frame = n => n / 60;
        if (level < 99) return { are: frame(12), lineAre: frame(8), das: frame(10), lock: frame(20), lineClear: frame(6) };
        if (level < 100) return { are: frame(12), lineAre: frame(8), das: frame(10), lock: frame(20), lineClear: frame(5) };
        if (level < 199) return { are: frame(12), lineAre: frame(7), das: frame(10), lock: frame(20), lineClear: frame(5) };
        if (level < 300) return { are: frame(12), lineAre: frame(6), das: frame(10), lock: frame(20), lineClear: frame(4) };
        if (level < 400) return { are: frame(10), lineAre: frame(6), das: frame(8), lock: frame(20), lineClear: frame(4) };
        if (level < 499) return { are: frame(9), lineAre: frame(6), das: frame(8), lock: frame(19), lineClear: frame(4) };
        if (level < 501) return { are: frame(9), lineAre: frame(6), das: frame(8), lock: frame(19), lineClear: frame(3) };
        if (level < 600) return { are: frame(8), lineAre: frame(5), das: frame(8), lock: frame(19), lineClear: frame(3) };
        if (level < 700) return { are: frame(7), lineAre: frame(5), das: frame(8), lock: frame(16), lineClear: frame(3) };
        if (level < 800) return { are: frame(7), lineAre: frame(5), das: frame(8), lock: frame(14), lineClear: frame(3) };
        if (level < 900) return { are: frame(7), lineAre: frame(5), das: frame(8), lock: frame(12), lineClear: frame(3) };
        if (level < 1000) return { are: frame(6), lineAre: frame(5), das: frame(8), lock: frame(10), lineClear: frame(3) };
        if (level < 1800) return { are: frame(12), lineAre: frame(10), das: frame(8), lock: frame(16), lineClear: frame(3) };
        if (level < 1900) return { are: frame(12), lineAre: frame(10), das: frame(8), lock: frame(14), lineClear: frame(3) };
        if (level < 2000) return { are: frame(12), lineAre: frame(10), das: frame(8), lock: frame(12), lineClear: frame(3) };
        if (level <= 2300) return { are: frame(12), lineAre: frame(10), das: frame(8), lock: frame(10), lineClear: frame(3) };
        return { are: frame(12), lineAre: frame(10), das: frame(4), lock: frame(10), lineClear: frame(3) };
    }

    onSectionComplete(gameScene, sectionIndex) {
        this.updateLevelState((sectionIndex + 1) * 100);
        this.releasePikiiFrozenRows(gameScene, sectionIndex);
        if (gameScene) {
            gameScene.sectionPerformance = gameScene.sectionPerformance || [];
            gameScene.sectionPerformance[sectionIndex] = this.getDisplayedGrade();
        }
    }

    updateLevelState(level) {
        this.maxLevelReached = Math.max(this.maxLevelReached, level || 0);
        this.pikiiActive = this.isInRange(this.maxLevelReached, [[300, 399], [500, 599], [700, 999]]);
        this.pikii2Active = this.isInRange(this.maxLevelReached, [[700, 999]]);
        this.cycloneActive = this.maxLevelReached >= 1000;
        this.masterPikiiActive = this.maxLevelReached >= 1300;
        this.masterPikiiFreezeTime = this.getMasterPikiiFreezeTime();
        this.displayedGrade = this.getDisplayedGrade();
    }

    isInRange(level, ranges) {
        return ranges.some(([start, end]) => level >= start && level <= end);
    }

    getMasterPikiiFreezeTime() {
        const medalCount = (this.medals.bravo || 0) + (this.medals.tetris || 0);
        return Math.max(2/60, (12 - Math.min(10, medalCount)) / 60);
    }

    handleLineClear(gameScene, linesCleared) {
        if (gameScene?.lastClearType === 'bravo') this.medals.bravo += 1;
        if (linesCleared === 4) {
            this.medals.tetris += 1;
            if (this.masterPikiiActive && gameScene) {
                gameScene.deleteBottomRowRequested = true;
            }
        }
    }

    getEffectiveLineClearCount(gameScene, linesToClear, allCompletedLines) {
        if (!this.pikiiActive && !this.masterPikiiActive) return linesToClear.length;
        return allCompletedLines.length;
    }

    releasePikiiFrozenRows(gameScene, sectionIndex) {
        if (!gameScene?.board?.clearFrozenRows) return;
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
        const level = gameScene.level || this.maxLevelReached;
        const section = Math.floor(level / 100);
        const startRow = Math.floor(gameScene.board.rows / 2);
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

    update(gameScene) {
        if (!gameScene) return;
        this.updateLevelState(gameScene.level || 0);
        this.applyPikiiState(gameScene);
        gameScene.tgm4MasterState = {
            pikiiActive: this.pikiiActive,
            pikii2Active: this.pikii2Active,
            cycloneActive: this.cycloneActive,
            masterPikiiActive: this.masterPikiiActive,
            masterPikiiFreezeTime: this.masterPikiiFreezeTime,
            medals: this.medals
        };
    }

    onCreditsEnd(gameScene) {
        this.endGameCleared = true;
        this.displayedGrade = this.getDisplayedGrade();
    }

    onGameOver(gameScene) {
        if (gameScene) this.updateLevelState(gameScene.level || 0);
    }

    getDisplayedGrade() {
        if (this.endGameCleared) return 'Gm ROUNDS';
        if (this.maxLevelReached >= 2600) return 'Gm';
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
