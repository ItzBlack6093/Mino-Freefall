 // TGMPlusMode - Rising garbage mode similar to Sega's Bloxeed
// Features: Rising garbage blocks, fixed 24-row pattern, no grading system

class TGMPlusMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM+';
        this.modeId = 'tgm_plus';
        
        // TGM+ mode configuration (Master gravity, Normal timings)
        this.config = {
            gravity: { type: 'tgm2_master' }, // Use TGM2 Master gravity curve
            das: 16/60,                    // Standard TGM+ DAS (same as Normal mode)
            arr: 1/60,                     // ARR is always 1/60
            are: 27/60,                    // TGM+ ARE timing (same as Normal mode)
            lineAre: 27/60,                // TGM+ line clear ARE
            lockDelay: 30/60,              // TGM+ lock delay
            lineClearDelay: 40/60,         // TGM+ line clear delay
            nextPieces: 1,                 // Standard next queue
            holdEnabled: false,            // TGM+ supports hold
            ghostEnabled: true,            // Ghost piece enabled
            levelUpType: 'piece',          // Level up per piece
            lineClearBonus: 1,
            gravityLevelCap: 999,
            specialMechanics: {
                risingGarbage: true,       // Enable rising garbage system
                noGrading: true,           // No grading system
                fixedPattern: true,        // Fixed 24-row garbage pattern
                excellentMessage: true     // Show "Excellent!" on completion
            }
        };
        
        // TGM+ scoring (simple, no grades)
        this.tgmPlusScore = 0;
        
        // Rising garbage system
        this.garbageCounter = 0;           // Counter for pieces without line clears
        this.garbageThreshold = 13;        // Base threshold (13 - floor(level/100))
        this.garbagePatternIndex = 0;      // Current position in 24-row pattern
        this.garbagePattern = this.generateGarbagePattern(); // 24-row garbage pattern
        this.garbageRows = [];             // Currently active garbage rows
        this.rowsWithGarbage = 0;          // Count of rows containing garbage
        
        // Game progression
        this.excellentShown = false;
        
    }
    
    // Get mode configuration
    getModeConfig() {
        return {
            gravity: { type: 'tgm2_master' }, // Use TGM2 Master gravity curve
            das: 16/60,                    // Standard TGM+ DAS (same as Normal mode)
            arr: 1/60,                     // ARR is always 1/60
            are: 27/60,                    // TGM+ ARE timing (same as Normal mode)
            lockDelay: 30/60,              // TGM+ lock delay
            nextPieces: 1,                 // Standard next queue
            holdEnabled: false,            // TGM+ supports hold
            ghostEnabled: true,            // Ghost piece enabled
            levelUpType: 'piece',          // Level up per piece
            lineClearBonus: 1,
            gravityLevelCap: 999,
            hasGrading: false,
            specialMechanics: {
                risingGarbage: true,       // Enable rising garbage system
                noGrading: true,           // No grading system
                fixedPattern: true,        // Fixed 24-row garbage pattern
                excellentMessage: true     // Show "Excellent!" on completion
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
    
    // Get gravity speed using TGM2 Master curve
    getGravitySpeed(level) {
        // TGM+ uses Master mode gravity curve
        let internalGravity;
        
        if (level < 30) internalGravity = 4;
        else if (level < 35) internalGravity = 6;
        else if (level < 40) internalGravity = 8;
        else if (level < 50) internalGravity = 10;
        else if (level < 60) internalGravity = 12;
        else if (level < 70) internalGravity = 16;
        else if (level < 80) internalGravity = 32;
        else if (level < 90) internalGravity = 48;
        else if (level < 100) internalGravity = 64;
        else if (level < 120) internalGravity = 80;
        else if (level < 140) internalGravity = 96;
        else if (level < 160) internalGravity = 112;
        else if (level < 170) internalGravity = 128;
        else if (level < 200) internalGravity = 144;
        else if (level < 220) internalGravity = 4;
        else if (level < 230) internalGravity = 32;
        else if (level < 233) internalGravity = 64;
        else if (level < 236) internalGravity = 96;
        else if (level < 239) internalGravity = 128;
        else if (level < 243) internalGravity = 160;
        else if (level < 247) internalGravity = 192;
        else if (level < 251) internalGravity = 224;
        else if (level < 300) internalGravity = 256; // 1G
        else if (level < 330) internalGravity = 512; // 2G
        else if (level < 360) internalGravity = 768; // 3G
        else if (level < 400) internalGravity = 1024; // 4G
        else if (level < 420) internalGravity = 1280; // 5G
        else if (level < 450) internalGravity = 1024; // 4G
        else if (level < 500) internalGravity = 768; // 3G
        else internalGravity = 5120; // 20G
        
        return internalGravity;
    }
    
    // Get timing values (fixed for TGM+, same as Normal mode)
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
    
    // Generate fixed 24-row garbage pattern (based on tgm2modes.md specifications)
    generateGarbagePattern() {
        // This is the exact pattern from TGM2 documentation
        return [
            ".GGGGGGGGG", // Row 0
            ".GGGGGGGGG", // Row 1  
            ".GGGGGGGGG", // Row 2
            ".GGGGGGGGG", // Row 3
            "GGGGGGGGG.", // Row 4
            "GGGGGGGGG.", // Row 5
            "GGGGGGGGG.", // Row 6
            "GGGGGGGGG.", // Row 7
            "..GGGGGGGG", // Row 8
            ".GGGGGGGGG", // Row 9
            ".GGGGGGGGG", // Row 10
            "GGGGGGGG..", // Row 11
            "GGGGGGGGG.", // Row 12
            "GGGGGGGGG.", // Row 13
            "GG.GGGGGGG", // Row 14
            "G..GGGGGGG", // Row 15
            "G.GGGGGGGG", // Row 16
            "GGGGGGG.GG", // Row 17
            "GGGGGGG..G", // Row 18
            "GGGGGGGG.G", // Row 19
            "GGGG..GGGG", // Row 20
            "GGGG..GGGG", // Row 21
            "GGGG.GGGGG", // Row 22
            "GGG...GGGG"  // Row 23
        ];
    }
    
    // Convert pattern string to boolean array (true = garbage, false = empty)
    parseGarbageRow(patternRow) {
        const result = [];
        for (let i = 0; i < patternRow.length; i++) {
            result.push(patternRow[i] === 'G');
        }
        return result;
    }
    
    // Get current garbage threshold based on level
    getGarbageThreshold(level) {
        return Math.max(1, 13 - Math.floor(level / 100));
    }
    
    // Initialize mode for game scene
    initializeForGameScene(gameScene) {
        super.initializeForGameScene(gameScene);
    }

    // Handle level progression with section stops
    onLevelUpdate(level, oldLevel, updateType, amount) {
        if (updateType === 'piece') {
            // Check if current level is a stop level BEFORE incrementing
            const currentIsStopLevel = (level % 100 === 99) ||
                                      (level === 998) || // 998 requires line clear
                                      (level === 999);   // 999 is final level
            if (!currentIsStopLevel && level < 999) {
                return level + 1;
            }
            return level; // Stay at stop level
        } else if (updateType === 'lines') {
            // Line clears advance level by 1 and can bypass stop levels, but 998->999 requires line clear
            if (oldLevel === 998 && amount > 0) {
                return 999;
            }
            return Math.min(level + 1, 999);
        }
        return level;
    }
    
    // Handle piece locking
    onPieceLock(piece, game) {
        // Increment garbage counter when piece locks without clearing lines
        // This is handled in the handleLineClear method
        return true;
    }
    
    // Handle line clear
    handleLineClear(gameScene, linesCleared, pieceType = null) {
        if (linesCleared > 0) {
            // Line clears reset the garbage counter
            this.garbageCounter = 0;
            
            // Add to score
            this.updateScore(gameScene, linesCleared);
        } else {
            // No lines cleared - increment garbage counter
            this.garbageCounter++;
            
            // Check if we should raise garbage
            const threshold = this.getGarbageThreshold(gameScene.level);
            if (this.garbageCounter >= threshold) {
                this.raiseGarbage(gameScene);
                this.garbageCounter = 0; // Reset counter after raising garbage
            }
        }
        
        // Check for level completion
        this.checkLevelCompletion(gameScene);
    }
    
    // Update score using official TGM2 (TAP) scoring formula
    updateScore(gameScene, linesCleared) {
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
        
        const baseScore = (base + soft + (2 * sonic)) * linesCleared * combo * bravo;
        const totalScore = baseScore + levelBonus + speedBonus;
        
        this.tgmPlusScore += totalScore;
        
        // Update score display
        if (gameScene.scoreText) {
            gameScene.scoreText.setText(this.tgmPlusScore.toString());
        }
    }
    
    // Check if last line clear was a perfect clear
    isPerfectClear(gameScene) {
        // Check if the playfield is completely empty after line clear
        // This would require access to the board state after clear
        // For now, return false as perfect clear detection is complex
        return false;
    }
    
    // Get active time for speed calculation
    getActiveTime(gameScene) {
        // This would track the number of frames the piece was active
        // For now, return a default value that would be tracked in the game
        return gameScene.currentPieceActiveTime || 10; // Default 10 frames
    }
    
    // Raise garbage from bottom of playfield
    raiseGarbage(gameScene) {
        console.log('TGM+ Mode: Raising garbage');
        
        // Get next pattern row
        const patternRow = this.parseGarbageRow(this.garbagePattern[this.garbagePatternIndex]);
        this.garbagePatternIndex = (this.garbagePatternIndex + 1) % this.garbagePattern.length;
        
        // Create garbage row (bottom row of playfield)
        const garbageRow = Array(gameScene.board.cols).fill(0);
        for (let col = 0; col < gameScene.board.cols; col++) {
            if (patternRow[col]) {
                garbageRow[col] = 0x808080; // Gray color for garbage blocks
            }
        }
        
        // Shift all existing rows up and add garbage at bottom
        gameScene.board.grid.shift(); // Remove top row
        gameScene.board.grid.push(garbageRow); // Add garbage at bottom
        
        // Track garbage rows
        this.garbageRows.push(garbageRow);
        this.rowsWithGarbage++;
        
        // Play garbage sound
        if (typeof gameScene.playGarbageSfx === 'function') {
            gameScene.playGarbageSfx(1);
        } else if (gameScene.sound) {
            gameScene.playSfx('garbage', 0.5);
        }
        
        // Show garbage raise message occasionally
        if (this.rowsWithGarbage % 5 === 0) {
            this.showGarbageMessage(gameScene);
        }
        
        // Check if garbage has reached the top (game over)
        this.checkGarbageGameOver(gameScene);
    }
    
    // Show garbage raise message
    showGarbageMessage(gameScene) {
        if (!gameScene.add) return;
        
        const garbageText = gameScene.add.text(gameScene.windowWidth / 2, gameScene.windowHeight / 4, 'GARBAGE!', {
            fontSize: '32px',
            fill: '#808080',
            stroke: '#000',
            strokeThickness: 2,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        gameScene.gameGroup.add(garbageText);
        
        // Fade out after 1 second
        gameScene.time.delayedCall(1000, () => {
            garbageText.destroy();
        });
    }
    
    // Check if garbage has reached the top (game over condition)
    checkGarbageGameOver(gameScene) {
        // Check if any garbage blocks are in the top few rows (making the game unplayable)
        const topRowsToCheck = 3;
        
        for (let row = 0; row < topRowsToCheck; row++) {
            if (gameScene.board.grid[row]) {
                const hasGarbage = gameScene.board.grid[row].some(cell => cell === 0x808080);
                if (hasGarbage) {
                    console.log('TGM+ Mode: Garbage reached top - Game Over');
                    gameScene.showGameOverScreen();
                    return;
                }
            }
        }
    }
    
    // Check for level completion (999 levels)
    checkLevelCompletion(gameScene) {
        if (gameScene.level >= 999 && !this.excellentShown) {
            this.excellentShown = true;
            
            // Show "Excellent!" message
            this.showExcellentMessage(gameScene);
            
            // Start credit roll (but completion is not required)
            gameScene.startCredits();
            
            console.log('TGM+ Mode: Level 999 reached - showing "Excellent!"');
        }
    }
    
    // Show "Excellent!" message
    showExcellentMessage(gameScene) {
        if (!gameScene.add) return;
        
        const excellentText = gameScene.add.text(gameScene.windowWidth / 2, gameScene.windowHeight / 2, 'EXCELLENT!', {
            fontSize: '48px',
            fill: '#00ff00',
            stroke: '#000',
            strokeThickness: 3,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        gameScene.gameGroup.add(excellentText);
        
        // Add a brief delay before proceeding
        gameScene.time.delayedCall(3000, () => {
            excellentText.destroy();
        });
    }
    
    // Update method (called every frame)
    update(gameScene, deltaTime) {
        // TGM+ has no grading system, so no decay to update
        
        // Additional TGM+ specific updates could go here
        // (e.g., visual effects for garbage, etc.)
    }
    
    // Handle game over
    onGameOver(gameScene) {
        this.saveBestScore(gameScene);
        console.log(`TGM+ Mode: Game Over - Score: ${this.tgmPlusScore}, Level: ${gameScene.level}`);
    }

    saveBestScore(gameScene) {
        const entry = {
            score: this.tgmPlusScore,
            level: gameScene.level,
            grade: 'N/A',
            time: `${Math.floor(gameScene.currentTime / 60)}:${Math.floor(gameScene.currentTime % 60).toString().padStart(2, '0')}.${Math.floor((gameScene.currentTime % 1) * 100).toString().padStart(2, '0')}`,
            pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined,
            garbageRows: this.rowsWithGarbage
        };
        if (typeof gameScene.saveLeaderboardEntry === 'function') {
            gameScene.saveLeaderboardEntry(this.modeId, entry);
        }
    }

    getBestScore(modeId) {
        return {
            score: 0,
            level: 0,
            grade: 'N/A',
            time: '0:00.00',
            garbageRows: 0
        };
    }

    getGarbageProgress() {
        const threshold = this.getGarbageThreshold(0);
        return {
            counter: this.garbageCounter,
            threshold: threshold,
            progress: Math.min(1, this.garbageCounter / threshold),
            patternIndex: this.garbagePatternIndex,
            rowsWithGarbage: this.rowsWithGarbage
        };
    }
    
    // Reset mode state for new game
    reset() {
        super.reset();
        
        // Reset TGM+ specific variables
        this.tgmPlusScore = 0;
        this.garbageCounter = 0;
        this.garbageThreshold = 13;
        this.garbagePatternIndex = 0;
        this.garbageRows = [];
        this.rowsWithGarbage = 0;
        this.excellentShown = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGMPlusMode };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.TGMPlusMode = TGMPlusMode;
}