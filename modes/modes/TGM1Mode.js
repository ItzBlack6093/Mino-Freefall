// TGM1 (Tetris: The Grand Master) Mode Implementation
// Official TGM1 mechanics with accurate gravity, timing, and grading

class TGM1Mode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM1';
        this.description = 'The Tetris game you know and love. Scale through the grades and be a Grand Master!';
    }

    getModeConfig() {
        return {
            gravity: {
                type: 'tgm1', // Use official TGM1 gravity curve
                value: 0,
                curve: null
            },
            das: 16/60,      // TGM1: 16 frames DAS
            arr: 1/60,       // TGM1: 1 frame ARR
            are: 30/60,      // TGM1: 30 frames ARE
            lockDelay: 0.5,  // TGM1: 30 frames lock delay
            nextPieces: 1,   // TGM1: Show only 1 next piece
            holdEnabled: false, // TGM1: No hold mechanics
            ghostEnabled: true, // TGM1: Ghost piece up to level 100
            levelUpType: 'piece',  // TGM1: Level increases per piece
            lineClearBonus: 1,
            gravityLevelCap: 999,
            lowestGrade: '9',
            specialMechanics: {
                sectionStops: [99, 199, 299, 399, 499, 599, 699, 799, 899, 998],
                gmRequirements: {
                    level300: { score: 12000, time: 255 }, // 4:15
                    level500: { score: 40000, time: 450 }, // 7:30
                    level999: { score: 126000, time: 810 } // 13:30
                },
                gradeThresholds: {
                    '9': 0, '8': 400, '7': 800, '6': 1400, '5': 2000, '4': 3500, '3': 5500, '2': 8000, '1': 12000,
                    'S1': 16000, 'S2': 22000, 'S3': 30000, 'S4': 40000, 'S5': 52000, 'S6': 66000, 'S7': 82000, 'S8': 100000, 'S9': 120000,
                    'GM': 126000
                }
            }
        };
    }

    // Timing getter methods
    getDAS() { return this.getModeConfig().das; }
    getARR() { return this.getModeConfig().arr; }
    getARE() { return this.getModeConfig().are; }
    getLineARE() { return this.getModeConfig().are; } // Same as ARE for TGM1
    getLockDelay() { return this.getModeConfig().lockDelay; }
    getLineClearDelay() { return this.getModeConfig().are; } // Use ARE for line clear delay

    // TGM1 uses the standard TGM1 gravity curve
    getGravitySpeed(level) {
        return this.getTGM1GravitySpeed(level);
    }

    // TGM1 level progression: +1 per piece (except stop levels), +1 per cleared line (up to 4)
    onLevelUpdate(level, oldLevel, updateType, amount) {
        const atStopLevel = (level % 100 === 99) || level === 998 || level === 999;

        if (updateType === 'piece') {
            if (!atStopLevel && level < 999) {
                return level + 1;
            }
            return level;
        } else if (updateType === 'lines') {
            const lineIncrement = Math.min(amount || 0, 4);
            if (oldLevel === 998 && lineIncrement > 0) {
                return 999;
            }
            return Math.min(level + lineIncrement, 999);
        }

        return level;
    }

    // TGM1 grading system with time requirements for GM
    calculateScore(baseScore, lines, piece, game) {
        if (lines === 0) return baseScore;

        // TGM1 official scoring:
        // Score = ceil([level + cleared lines]/4 + soft dropped rows + (2 * hard dropped rows))
        //        * cleared lines * combo * bravo
        
        const combo = game.comboCount > 0 ? (game.comboCount + 1) : 1;
        const bravo = this.checkBravo(game.board) ? 4 : 1;
        
        return Math.floor(baseScore * combo * bravo);
    }

    // Check for bravo (perfect clear)
    checkBravo(board) {
        // Bravo occurs when the board is completely full before clearing
        return board.grid.every(row => row.every(cell => cell !== 0));
    }

    // TGM1 GM grade requirements
    checkGMRequirements(game) {
        const config = this.getConfig();
        const gmReq = config.specialMechanics.gmRequirements;
        
        let gmAchieved = true;
        
        if (game.level >= 300 && game.score >= gmReq.level300.score && game.currentTime <= gmReq.level300.time) {
            game.gmConditions.level300.achieved = true;
        } else {
            gmAchieved = false;
        }
        
        if (game.level >= 500 && game.score >= gmReq.level500.score && game.currentTime <= gmReq.level500.time) {
            game.gmConditions.level500.achieved = true;
        } else {
            gmAchieved = false;
        }
        
        if (game.level >= 999 && game.score >= gmReq.level999.score && game.currentTime <= gmReq.level999.time) {
            game.gmConditions.level999.achieved = true;
        } else {
            gmAchieved = false;
        }
        
        return gmAchieved;
    }

    onReachedMaxLevel(gameScene) {
        if (!gameScene) {
            return false;
        }

        const gmAchieved = this.checkGMRequirements(gameScene);
        if (gmAchieved) {
            gameScene.grade = 'GM';
            if (gameScene.gradeText && typeof gameScene.gradeText.setText === 'function') {
                gameScene.gradeText.setText('GM');
            }
            return false;
        }

        gameScene.pendingCompleteSequence = false;
        gameScene.gameOverMessage = 'EXCELLENT';
        gameScene.gameOverSubMessage = 'Try again to be a grandmaster';
        gameScene.gameOverMessageColor = '#00ff88';
        gameScene.gameOverSubMessageColor = '#ffffff';
        gameScene.preserveGameOverMessage = true;
        gameScene.showStaticEndScreen({
            showTextImmediately: true,
            playGameOverSfx: false
        });
        return true;
    }

    shouldContinueCreditsAfterTopout(gameScene) {
        return !!gameScene?.creditsActive;
    }

    // Get next grade requirement
    getNextGradeRequirement(currentGrade, currentScore) {
        const config = this.getConfig();
        const thresholds = config.specialMechanics.gradeThresholds;
        
        const gradeOrder = ['9', '8', '7', '6', '5', '4', '3', '2', '1', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'GM'];
        const currentIndex = gradeOrder.indexOf(currentGrade);
        
        if (currentIndex === -1 || currentIndex === gradeOrder.length - 1) {
            return null; // Already at highest grade
        }
        
        const nextGrade = gradeOrder[currentIndex + 1];
        const requiredScore = thresholds[nextGrade];
        
        return {
            grade: nextGrade,
            score: requiredScore,
            pointsNeeded: Math.max(0, requiredScore - currentScore)
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TGM1Mode;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.TGM1Mode = TGM1Mode;
}