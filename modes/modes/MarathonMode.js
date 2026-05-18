// Marathon Mode - Standard Tetris Marathon with 150 line goal
// Based on standardtimings.md specifications

class MarathonMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'Marathon';
        this.description = 'Clear 150 lines with progressive gravity';
        this.targetLines = 150;
        this.linesCleared = 0;
    }

    getModeConfig() {
        return {
            gravity: {
                type: 'custom',
                curve: this.getMarathonGravity.bind(this)
            },
            das: 9/60,      // 9 frames
            arr: 1/60,       // 1 frame
            are: 7/60,       // 7 frames
            lineAre: 7/60,   // Matches ARE for Marathon
            lockDelay: 30/60, // 30 frames
            lineClearDelay: 9/60, // 9 frames line clear delay (per new standard)

            nextPieces: 6,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'lines',
            lineClearBonus: 1,
            gravityLevelCap: 999,
            hasGrading: false,

            specialMechanics: {
                targetLines: 150,
                progressiveGravity: true
            }
        };
    }

    getBgmConfig() {
        return {
            progressSource: 'linesCleared',
            stopSource: 'linesCleared',
            useStopBuffer: false,
            transitionStopOffset: 0,
            stopAt: 150,
            silentRanges: [
                { start: 55, end: 59 },
                { start: 115, end: 119 }
            ],
            segments: [
                { start: 0, end: 54, key: 'mf_std_1' },
                { start: 60, end: 114, key: 'mf_std_2' },
                { start: 120, end: 149, key: 'mf_std_3' }
            ],
            credits: {
                key: 'mf2_endroll',
                reuseCurrentTrack: false
            }
        };
    }

    // Timing getter methods
    getDAS() { return this.getConfig().das; }
    getARR() { return this.getConfig().arr; }
    getARE() { return this.getConfig().are; }
    getLineARE() { return this.getConfig().lineAre; } // Same as ARE for Marathon
    getLockDelay() { return this.getConfig().lockDelay; }
    getLineClearDelay() { return this.getConfig().lineClearDelay; }

    // Marathon gravity curve based on standardtimings.md
    getMarathonGravity(level) {
        // Convert level to internal gravity units (1/256 G)
        // Source values are from MarathonGravity.md in 1/65536 G units.
        const tableLevel = Math.max(1, Math.floor(level) + 1);

        switch (tableLevel) {
            case 1: return 4;
            case 2: return 5;
            case 3: return 7;
            case 4: return 9;
            case 5: return 12;
            case 6: return 16;
            case 7: return 22;
            case 8: return 32;
            case 9: return 45;
            case 10: return 67;
            case 11: return 99;
            case 12: return 152;
            case 13: return 237;
            case 14: return 388;
            case 15: return 610;
            default: return 5120; // 20G cap
        }
    }

    onLevelUpdate(level, oldLevel, updateType, amount) {
        if (updateType === 'lines') {
            this.linesCleared += amount;
            return Math.floor(this.linesCleared / 10);
        }

        return oldLevel;
    }

    handleLineClear(gameScene, linesCleared, pieceType) {
        // Check for marathon completion
        if (this.linesCleared >= this.targetLines) {
            gameScene.showGameOverScreen();
        }
    }

    update(gameScene, deltaTime) {
        // Update any marathon-specific logic
        // Could add time bonuses or other mechanics here
    }

    onGameOver(gameScene) {
        const entry = {
            score: gameScene.score,
            level: this.linesCleared,
            lines: this.linesCleared,
            grade: 'N/A',
            time: `${Math.floor(gameScene.currentTime / 60)}:${Math.floor(gameScene.currentTime % 60).toString().padStart(2, '0')}.${Math.floor((gameScene.currentTime % 1) * 100).toString().padStart(2, '0')}`,
            pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined
        };
        if (typeof gameScene.saveLeaderboardEntry === 'function') {
            gameScene.saveLeaderboardEntry('marathon', entry);
        }
    }

    reset() {
        this.linesCleared = 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarathonMode;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.MarathonMode = MarathonMode;
}