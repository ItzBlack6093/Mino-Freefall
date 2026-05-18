// TGM2NormalMode - Normal mode from TGM2: 300 levels with item blocks
// Features: Special items at levels 100 ("Free Fall") and 200 ("Del Even"), fixed timings

class TGM2NormalMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM2 Normal';
        this.modeId = 'tgm2_normal';

        // TGM2 Normal mode configuration
        this.config = {
            gravity: { type: 'tgm2_normal' },
            das: 16/60,                    // TGM2 Normal DAS (16 frames)
            arr: 1/60,                     // ARR is always 1/60
            are: 27/60,                    // TGM2 Normal ARE (27 frames)
            lineAre: 27/60,                // Line ARE mirrors ARE (official table lacks separate value)
            lockDelay: 30/60,              // Lock delay (30 frames)
            lineClearDelay: 40/60,         // Line clear delay (40 frames)
            nextPieces: 1,                 // Standard next queue
            holdEnabled: false,            // TGM2 supports hold
            ghostEnabled: true,            // Ghost piece enabled
            levelUpType: 'piece',          // Level up per piece
            lineClearBonus: 1,
            gravityLevelCap: 300,          // TGM2 Normal caps at 300
            specialMechanics: {
                sectionStops: [99, 199, 299]
            }
        };

        // TGM2 scoring (no grading)
        this.tgm2Score = 0;
        this.finishTimeBonusApplied = false;
        this.finishTimeBonus = 0;
        
        // Game progression tracking
        this.creditsStarted = false;
        this.creditsTimer = 0;
        this.creditsDuration = 30; // 30s credits roll per spec
        
    }
    
    // Get mode configuration
    getModeConfig() {
        return {
            gravity: { type: 'tgm2_normal' },
            das: 16/60,                    // TGM2 Normal DAS (14 frames)
            arr: 1/60,                     // ARR is always 1/60
            are: 27/60,                    // TGM2 Normal ARE (25 frames)
            lineAre: 27/60,                // Mirror ARE (table lacks line ARE column)
            lockDelay: 30/60,              // Lock delay (30 frames)
            lineClearDelay: 40/60,         // Line clear delay (40 frames)
            nextPieces: 1,                 // Standard next queue
            holdEnabled: false,            // TGM2 supports hold
            ghostEnabled: true,            // Ghost piece enabled
            levelUpType: 'piece',          // Level up per piece
            lineClearBonus: 1,
            gravityLevelCap: 300,          // TGM2 Normal caps at 300
            hasGrading: false,
            customScoring: true,
            specialMechanics: {
                sectionStops: [99, 199, 299], // Level stops, but 99/199 are bypassed by items
                creditsDuration: 30
            }
        };
    }

    // Get mode configuration
    getConfig() {
        return {
            ...this.getDefaultConfig(),
            ...this.getModeConfig()
        };
    }
    
    // Get mode name
    getName() {
        return this.modeName;
    }
    
    // Get mode ID
    getModeId() {
        return this.modeId;
    }

    getBgmConfig() {
        return {
            ...super.getBgmConfig(),
            credits: {
                key: 'mf1_2',
                reuseCurrentTrack: false
            }
        };
    }
    
    // Get gravity speed using TGM2 Normal curve (0-300)
    getGravitySpeed(level) {
        // TGM2 Normal mode gravity curve based on tgm2modes.md specifications
        let internalGravity;
        
        if (level < 8) internalGravity = 4;
        else if (level < 19) internalGravity = 5;
        else if (level < 35) internalGravity = 6;
        else if (level < 40) internalGravity = 8;
        else if (level < 50) internalGravity = 10;
        else if (level < 60) internalGravity = 12;
        else if (level < 70) internalGravity = 16;
        else if (level < 80) internalGravity = 32;
        else if (level < 90) internalGravity = 48;
        else if (level < 100) internalGravity = 64;
        else if (level < 108) internalGravity = 4;
        else if (level < 119) internalGravity = 5;
        else if (level < 125) internalGravity = 6;
        else if (level < 131) internalGravity = 8;
        else if (level < 139) internalGravity = 12;
        else if (level < 149) internalGravity = 32;
        else if (level < 156) internalGravity = 48;
        else if (level < 164) internalGravity = 80;
        else if (level < 174) internalGravity = 112;
        else if (level < 180) internalGravity = 128;
        else if (level < 200) internalGravity = 144;
        else if (level < 212) internalGravity = 16;
        else if (level < 221) internalGravity = 48;
        else if (level < 232) internalGravity = 80;
        else if (level < 244) internalGravity = 112;
        else if (level < 256) internalGravity = 144;
        else if (level < 267) internalGravity = 176;
        else if (level < 277) internalGravity = 192;
        else if (level < 287) internalGravity = 208;
        else if (level < 295) internalGravity = 224;
        else if (level < 300) internalGravity = 240;
        else internalGravity = 5120; // 20G for credit roll
        
        return internalGravity;
    }
    
    // Get timing values (fixed for Normal mode)
    getDAS() {
        return this.config.das;
    }
    
    getARR() {
        return this.config.arr;
    }
    
    getARE() {
        return this.config.are;
    }
    
    getLineARE() {
        return this.config.lineAre;
    }
    
    getLockDelay() {
        return this.config.lockDelay;
    }
    
    getLineClearDelay() {
        return this.config.lineClearDelay;
    }
    
    // Initialize mode for game scene
    initializeForGameScene(gameScene) {
        super.initializeForGameScene(gameScene);
    }
    
    // Handle level progression and item block spawning
    onLevelUpdate(level, oldLevel, updateType, amount) {
        // Normal mode: only stop at 299 (cap 300). +1 per piece spawn (except first piece handled by caller),
        // +1 per cleared line (up to 4).
        const atStopLevel = level === 299 || level >= 300;
        let newLevel = level;

        if (updateType === 'piece') {
            if (!atStopLevel) {
                newLevel = Math.min(level + 1, 300);
            }
        } else if (updateType === 'lines') {
            const lineIncrement = Math.min(Math.max(amount || 0, 0), 4);
            newLevel = Math.min(level + lineIncrement, 300);
        }

        return newLevel;
    }
    
    // Handle line clears with TGM2 Normal scoring (x6 multiplier)
    handleLineClear(gameScene, linesCleared, pieceType) {
        this.updateTGM2Score(gameScene, linesCleared, pieceType);

        // Update combo count for next clear
        if (linesCleared > 0) {
            gameScene.comboCount = gameScene.comboCount <= 0 ? 0 : gameScene.comboCount;
            gameScene.comboCount += (2 * linesCleared) - 2;
        } else {
            gameScene.comboCount = -1;
        }

        gameScene.score = this.tgm2Score;
    }

    // Update TGM2 score using official TGM2 (TAP) scoring formula
    updateTGM2Score(gameScene, linesCleared, pieceType) {
        if (linesCleared === 0) return;
        
        // Official TGM2 (TAP) scoring formula: Score = (⌈(Level + Lines) / 4⌉ + Soft + (2 × Sonic)) × Lines × Combo × Bravo + ⌈(Level After Clear) / 2⌉ + (Speed × 7)
        const levelBeforeClear = gameScene.level; // Level just before line clear
        const levelAfterClear = gameScene.level; // Level just after line clear
        const base = Math.ceil((levelBeforeClear + linesCleared) / 4);
        const soft = gameScene.softDropFrames || 0; // Cumulative frames of Down held during piece's active time
        const sonic = gameScene.maxSonicDrop || 0; // Single greatest sonic drop during piece's active time
        
        // Calculate combo (reset to 1 if previous piece cleared no lines)
        let combo;
        if (gameScene.comboCount <= 0) {
            combo = 1;
        } else {
            combo = gameScene.comboCount + (2 * linesCleared) - 2;
        }
        
        const bravo = this.isPerfectClear(gameScene) ? 4 : 1; // 4 for perfect clear, otherwise 1
        
        // Calculate level bonus after clear
        const levelBonus = Math.ceil(levelAfterClear / 2);
        
        // Calculate speed bonus
        const lockDelay = Math.round(this.getLockDelay() * 60); // Convert to frames
        const activeTime = this.getActiveTime(gameScene) || 1; // Minimum 1 frame
        const speed = Math.max(0, lockDelay - activeTime);
        const speedBonus = speed * 7;
        
        const lineScore = (base + soft + (2 * sonic)) * linesCleared * combo * bravo;
        const lineScoreWithMultiplier = lineScore * 6; // Normal mode multiplies line clear score by 6
        const totalScore = lineScoreWithMultiplier + levelBonus + speedBonus;
        
        this.tgm2Score += totalScore;
        
        // Update score display
        if (gameScene.scoreText) {
            gameScene.scoreText.setText(this.tgm2Score.toString());
        }
    }
    

    
    // Called by the engine when credits roll starts (via maxLevel path)
    onCreditsStart(gameScene) {
        this.applyFinishTimeBonus(gameScene);
        gameScene.score = this.tgm2Score;
    }
    
    
    update(gameScene, deltaTime) {
    }
    
    
    // Handle game over
    onGameOver(gameScene) {
        // Apply Normal mode finish time bonus before recording score
        this.applyFinishTimeBonus(gameScene);
        gameScene.score = this.tgm2Score;

        // Check for final rankings
        this.checkFinalRankings(gameScene);
        
        // Save best score
        this.saveBestScore(gameScene);
    }
    
    // Apply the Normal mode finish time bonus (up to 300 seconds)
    applyFinishTimeBonus(gameScene) {
        if (this.finishTimeBonusApplied) {
            return;
        }

        const seconds = Math.max(0, gameScene.currentTime || 0);
        const remaining = Math.max(0, Math.ceil(300 - seconds));
        this.finishTimeBonus = 1253 * remaining;
        this.tgm2Score += this.finishTimeBonus;
        this.finishTimeBonusApplied = true;

        if (gameScene.scoreText) {
            gameScene.scoreText.setText(this.tgm2Score.toString());
        }
    }

    // Check final rankings
    checkFinalRankings(gameScene) {
        const finalGrade = this.displayedGrade;
        const rankingType = this.creditsStarted ? 'credit_roll' : 'regular';
        
        console.log(`TGM2 Normal Final Ranking: ${finalGrade} (${rankingType})`);
    }
    
    // Save best score for TGM2 Normal mode
    saveBestScore(gameScene) {
        const entry = {
            score: this.tgm2Score,
            level: gameScene.level,
            time: `${Math.floor(gameScene.currentTime / 60)}:${Math.floor(gameScene.currentTime % 60).toString().padStart(2, '0')}.${Math.floor((gameScene.currentTime % 1) * 100).toString().padStart(2, '0')}`,
            pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined
        };
        if (typeof gameScene.saveLeaderboardEntry === 'function') {
            gameScene.saveLeaderboardEntry(this.modeId, entry);
        }
    }
    
    // Get best score for this mode
    getBestScore(modeId) {
        const key = `bestScore_${modeId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            score: 0,
            level: 0,
            time: '0:00.00'
        };
    }
    
    // Reset mode state for new game
    reset() {
        super.reset();

        this.tgm2Score = 0;

        // Reset credit roll
        this.creditsStarted = false;
        this.creditsTimer = 0;
        this.finishTimeBonusApplied = false;
        this.finishTimeBonus = 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM2NormalMode };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.TGM2NormalMode = TGM2NormalMode;
}