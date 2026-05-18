// Zen Mode - Endless relaxed play
// Based on standardtimings.md specifications

class ZenMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'Zen';
        this.description = 'Endless relaxed play';
        this.linesCleared = 0;
    }

    getLineARE() { return this.getModeConfig().are; } // Same as ARE for Zen
    getLockDelay() { return this.getModeConfig().lockDelay; }
    getLineClearDelay() { return this.getModeConfig().lineClearDelay; }

    getModeConfig() {
        return {
            gravity: {
                type: 'static',
                value: 4 // 20G for fast but manageable play
            },
            das: 9/60,      // 9 frames
            arr: 1/60,       // 1 frame
            are: 7/60,       // 7 frames
            lineAre: 7/60,   // Match ARE for line ARE
            lockDelay: 30/60, // 30 frames
            lineClearDelay: 9/60, // 9 frames line clear delay
            nextPieces: 6,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 999,
            hasGrading: false,
            specialMechanics: {
                endless: true,
                relaxed: true
            }
        };
    }

    getBgmConfig() {
        return {
            progressSource: 'level',
            stopSource: 'level',
            useStopBuffer: false,
            transitionStopOffset: 0,
            segments: [{ end: 999, key: 'mf_zen' }]
        };
    }

    handleLineClear(gameScene, linesCleared, pieceType) {
        this.linesCleared += linesCleared;
        // No end condition for zen mode
    }

    update(gameScene, deltaTime) {
        // Zen mode specific updates could go here
        // Maybe some visual effects or background changes based on lines cleared
    }

    onGameOver(gameScene) {
        const entry = {
            score: gameScene.score,
            level: this.linesCleared,
            grade: 'N/A',
            time: `${Math.floor(gameScene.currentTime / 60)}:${Math.floor(gameScene.currentTime % 60).toString().padStart(2, '0')}.${Math.floor((gameScene.currentTime % 1) * 100).toString().padStart(2, '0')}`,
            pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined
        };
        if (typeof gameScene.saveLeaderboardEntry === 'function') {
            gameScene.saveLeaderboardEntry('zen', entry);
        }
    }

    reset() {
        this.linesCleared = 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZenMode;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.ZenMode = ZenMode;
}