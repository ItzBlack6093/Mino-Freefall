// Ultra Mode - 2-minute score attack
// Based on standardtimings.md specifications

class UltraMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'Ultra';
        this.description = '2-minute score attack';
        this.timeLimit = 120; // 2 minutes in seconds
        this.startTime = null;
        this.elapsedActiveTime = 0;
    }

    getModeConfig() {
        return {
            gravity: {
                type: 'static',
                value: 4
            },
            das: 9/60,       // 9 frames
            arr: 1/60,        // 1 frame
            are: 7/60,        // 7 frames
            lineAre: 7/60,    // Match ARE for Ultra
            lockDelay: 10/60, // 10 frames
            lineClearDelay: 9/60, // 9 frames line clear delay

            nextPieces: 6,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'none',
            lineClearBonus: 1,
            gravityLevelCap: 999,
            hasGrading: false,
            specialMechanics: {
                timeLimit: 120,
                scoreAttack: true
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
    getDAS() { return this.getModeConfig().das; }
    getARR() { return this.getModeConfig().arr; }
    getARE() { return this.getModeConfig().are; }
    getLineARE() { return this.getModeConfig().lineAre; } // Same as ARE for Ultra
    getLockDelay() { return this.getModeConfig().lockDelay; }
    getLineClearDelay() { return this.getModeConfig().lineClearDelay; }

    initializeForGameScene(gameScene) {
        this.startTime = null;
        this.elapsedActiveTime = 0;
    }

    update(gameScene, deltaTime) {
        // Track start time
        if (!this.startTime && gameScene.currentPiece) {
            this.startTime = gameScene.currentTime;
        }

        if (this.startTime !== null) {
            this.elapsedActiveTime = gameScene.currentTime - this.startTime;
        }

        // Check time limit
        if (this.startTime !== null && this.elapsedActiveTime >= this.timeLimit) {
            gameScene.showGameOverScreen();
        }
    }

    onLevelUpdate(level, oldLevel, updateType, amount) {
        return oldLevel;
    }

    onGameOver(gameScene) {
        const timeString = `${Math.floor(this.timeLimit / 60)}:${Math.floor(this.timeLimit % 60).toString().padStart(2, '0')}.00`;

        const entry = {
            score: gameScene.score,
            level: gameScene.level,
            grade: 'N/A',
            time: timeString,
            pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined
        };
        if (typeof gameScene.saveLeaderboardEntry === 'function') {
            gameScene.saveLeaderboardEntry('ultra', entry);
        }
    }

    reset() {
        this.startTime = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraMode;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.UltraMode = UltraMode;
}