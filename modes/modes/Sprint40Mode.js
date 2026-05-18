class Sprint40Mode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'Sprint';
        this.description = 'Clear lines as fast as possible';
        this.targetLines = 40; // Default, can be overridden
        this.linesCleared = 0;
        this.startTime = null;
        this.finishTime = null;
    }

    getModeConfig() {
        return {
            gravity: {
                type: 'static',
                value: 4 // 20G
            },
            das: 9/60,       // 9 frames
            arr: 1/60,        // 1 frame
            are: 7/60,        //  7 frames.
            lineAre: 7/60,    // Line ARE matches grid for sprint
            lockDelay: 30/60,  // 10 frames
            lineClearDelay: 9/60, // 9 frames for line clear delay flash

            nextPieces: 6,
            holdEnabled: true, // ensure hold stays enabled (copied by getConfig)
            ghostEnabled: true,
            levelUpType: 'lines',
            lineClearBonus: 1,
            gravityLevelCap: 999,
            hasGrading: false,
            specialMechanics: {
                timeAttack: true,
                targetLines: this.targetLines
            }
        };
    }

    getBgmConfig() {
        return {
            progressSource: 'level',
            stopSource: 'level',
            useStopBuffer: false,
            transitionStopOffset: 0,
            segments: [{ end: 999, key: 'mf1_1' }]
        };
    }



    // Timing getter methods
    getDAS() { return this.getConfig().das; }
    getARR() { return this.getConfig().arr; }
    getARE() { return this.getConfig().are; }
    getLineARE() { return this.getConfig().lineAre; } // Same as ARE for Sprint
    getLockDelay() { return this.getConfig().lockDelay; }
    getLineClearDelay() { return this.getConfig().lineClearDelay; }
    getTargetLines() { return this.targetLines; }


    initializeForGameScene(gameScene) {
        // Set target lines based on mode
        if (gameScene.selectedMode === 'sprint_100') {
            this.targetLines = 100;
        } else {
            this.targetLines = 40;
        }
        this.linesCleared = 0;
        this.startTime = null;
        this.finishTime = null;
    }

    onLevelUpdate(level, oldLevel, updateType, amount) {
        if (updateType === 'lines') {
            // Level increases by number of lines cleared
            return oldLevel + amount;
        }
        return level;
    }

    handleLineClear(gameScene, linesCleared, pieceType) {
        this.linesCleared = Math.min(
            this.targetLines,
            this.linesCleared + linesCleared,
        );

        // Record finish time on first completion
        if (this.linesCleared >= this.targetLines && !this.finishTime) {
            this.finishTime = gameScene.currentTime;
            if (gameScene) {
                gameScene.sprintCompleted = true;
            }
            gameScene.showGameOverScreen();
        }
    }

    update(gameScene, deltaTime) {
        // Track start time
        if (!this.startTime && gameScene.currentPiece) {
            this.startTime = gameScene.currentTime;
        }
    }

    onGameOver(gameScene) {
        if (this.finishTime) {
            const timeString = `${Math.floor(this.finishTime / 60)}:${Math.floor(this.finishTime % 60).toString().padStart(2, '0')}.${Math.floor((this.finishTime % 1) * 100).toString().padStart(2, '0')}`;
            const entry = {
                score: gameScene.score,
                level: this.linesCleared,
                grade: 'N/A',
                time: timeString,
                pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined
            };
            if (typeof gameScene.saveLeaderboardEntry === 'function') {
                gameScene.saveLeaderboardEntry(gameScene.selectedMode, entry);
            }
        }
    }

    parseTime(timeString) {
        if (!timeString || timeString === '0:00.00') return null;
        const parts = timeString.split(':');
        if (parts.length !== 2) return null;
        const [minutes, seconds] = parts;
        return parseInt(minutes) * 60 + parseFloat(seconds);
    }

    reset() {
        this.linesCleared = 0;
        this.startTime = null;
        this.finishTime = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sprint40Mode;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.Sprint40Mode = Sprint40Mode;
}
