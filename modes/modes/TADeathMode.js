// TADeathMode - T.A. Death mode from TGM2: Extreme 20G mode with timing phases
// Features: Fixed 20G gravity, 6 timing phases, 3:25:00 torikan at level 500

class TADeathMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'T.A. Death';
        this.modeId = 'ta_death';
        
        // T.A. Death mode configuration (20G gravity, complex timing)
        this.config = {
            gravity: { type: 'fixed_20g' },     // Fixed 20G gravity throughout
            nextPieces: 1,                  // Standard next queue
            holdEnabled: false,             // T.A. Death does not support hold
            ghostEnabled: true,             // Ghost piece enabled
            levelUpType: 'piece',           // Level up per piece
            lineClearBonus: 1,
            lowestGrade: '',
            gravityLevelCap: 999,
            specialMechanics: {
                fixed20G: true,             // Fixed 20G gravity throughout
                progressiveTimings: true,   // 6 progressive timing phases
                torikanLimit: true,         // Time limit at level 500
                minimalGrading: true,       // Only M and GM grades
                deathMechanics: true        // Death mode specific mechanics
            }
        };
        
        // T.A. Death grading (minimal - only M and GM)
        this.displayedGrade = ''; // No grade until torikan is beaten
        this.internalGrade = 31;   // Start at 31 (9.5 grade level)
        this.isMGrade = false;
        this.isGMGrade = false;
        
        // T.A. Death scoring
        this.deathScore = 0;
        
        // Torikan time limit (3:25.00 = 205 seconds)
        this.torikanLimit = 205.0;
        this.torikanPassed = false;
        this.timeAtLevel500 = null; // Track time when level 500 is reached
        
        // Progressive timing system (6 phases) - T.A. Death official timings
        this.currentTimingPhase = 1; // 1-6 phases based on level
        this.timingPhases = [
            { minLevel: 0,   maxLevel: 99,  are: 18/60, lineAre: 14/60, das: 12/60, arr: 1/60, lock: 30/60, lineClear: 12/60 },
            { minLevel: 100, maxLevel: 199, are: 14/60, lineAre: 8/60,  das: 12/60, arr: 1/60, lock: 26/60, lineClear: 6/60 },
            { minLevel: 200, maxLevel: 299, are: 14/60, lineAre: 8/60,  das: 11/60, arr: 1/60, lock: 22/60, lineClear: 6/60 },
            { minLevel: 300, maxLevel: 399, are: 8/60,  lineAre: 8/60,  das: 10/60, arr: 1/60, lock: 18/60, lineClear: 6/60 },
            { minLevel: 400, maxLevel: 499, are: 7/60,  lineAre: 7/60,  das: 8/60,  arr: 1/60, lock: 15/60, lineClear: 5/60 },
            { minLevel: 500, maxLevel: 999, are: 6/60,  lineAre: 6/60,  das: 8/60,  arr: 1/60, lock: 15/60, lineClear: 4/60 }
        ];
        
        // T.A. Death specific states
        this.startedAtLevel500 = false;
        this.hasReachedMGrade = false;
        this.isDeathComplete = false;
    }
    
    // Get mode configuration
    getModeConfig() {
        return {
            gravity: { type: 'fixed_20g' },     // Fixed 20G gravity throughout
            das: 12/60,                        // Base T.A. Death DAS (changes with timing phases)
            arr: 1/60,                         // Standard ARR
            are: 18/60,                        // Base T.A. Death ARE (changes with timing phases)
            lockDelay: 30/60,                  // Base lock delay (changes with timing phases)
            nextPieces: 1,                     // Standard next queue
            holdEnabled: false,                // T.A. Death does not support hold
            ghostEnabled: true,                // Ghost piece enabled
            levelUpType: 'piece',              // Level up per piece
            lineClearBonus: 1,
            lowestGrade: '',
            gravityLevelCap: 999,
            hasGrading: true,
            specialMechanics: {
                fixed20G: true,                // Fixed 20G gravity throughout
                progressiveTimings: true,      // 6 progressive timing phases
                torikanLimit: true,            // Time limit at level 500
                minimalGrading: true,          // Only M and GM grades
                deathMechanics: true           // Death mode specific mechanics
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
    
    // Get gravity speed (fixed 20G throughout)
    getGravitySpeed(level) {
        // T.A. Death has fixed 20G gravity (5120 internal speed) throughout
        return 5120;
    }
    
    // Get timing values (dynamic based on current timing phase)
    getDAS() {
        const das = this.getCurrentTimingPhase().das;
        console.log(`T.A.Death DAS: ${das} (phase ${this.currentTimingPhase})`);
        return das;
    }

    getARR() {
        const arr = this.getCurrentTimingPhase().arr;
        console.log(`T.A.Death ARR: ${arr} (phase ${this.currentTimingPhase})`);
        return arr;
    }

    getARE() {
        const are = this.getCurrentTimingPhase().are;
        console.log(`T.A.Death ARE: ${are} (phase ${this.currentTimingPhase})`);
        return are;
    }

    getLineARE() {
        return this.getCurrentTimingPhase().lineAre;
    }

    getLockDelay() {
        const lock = this.getCurrentTimingPhase().lock;
        console.log(`T.A.Death Lock Delay: ${lock} (phase ${this.currentTimingPhase})`);
        return lock;
    }

    getLineClearDelay() {
        return this.getCurrentTimingPhase().lineClear;
    }
    
    // Get current timing phase based on level
    getCurrentTimingPhase() {
        return this.timingPhases[this.currentTimingPhase - 1] || this.timingPhases[0];
    }
    
    // Update timing phase based on level
    updateTimingPhase(level) {
        const oldPhase = this.currentTimingPhase;
        
        for (let i = this.timingPhases.length - 1; i >= 0; i--) {
            if (level >= this.timingPhases[i].minLevel && level <= this.timingPhases[i].maxLevel) {
                this.currentTimingPhase = i + 1; // Convert to 1-based index
                break;
            }
        }
        
        // Notify if timing phase changed
        if (oldPhase !== this.currentTimingPhase) {
            this.onTimingPhaseChange(oldPhase, this.currentTimingPhase);
        }
    }
    
    // Handle timing phase change
    onTimingPhaseChange(oldPhase, newPhase) {
        console.log(`T.A. Death: Timing phase changed from ${oldPhase} to ${newPhase}`);
        
        // T.A. Death has very strict timing - this is life/death critical
        this.playTimingChangeSound();
    }
    
    // Play timing change sound (death mode specific)
    playTimingChangeSound() {
        // In a real implementation, this would play a distinct death mode sound
        // to alert players of the timing changes
    }
    
    // Initialize mode for game scene
    initializeForGameScene(gameScene) {
        super.initializeForGameScene(gameScene);
    }
    
    // Handle level progression
    onLevelUpdate(level, oldLevel, updateType, amount) {
        // Update timing phase
        this.updateTimingPhase(level);

        // Check for torikan start (level 500)
        if (level >= 500 && !this.startedAtLevel500) {
            this.startedAtLevel500 = true;
            this.onTorikanStart();
        }

        // Standard TGM stops: 99, 199, ..., 998
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
    
    // Handle torikan start at level 500
    onTorikanStart() {
        console.log('T.A. Death: Torikan started at level 500');
        
        // Track the time when level 500 was reached
        this.timeAtLevel500 = this.getCurrentGameTime();
        
        // The player now has 3:25.00 to reach level 999
        // This will be checked in the update method
    }
    
    // Get current game time (placeholder for actual implementation)
    getCurrentGameTime() {
        // This would get the actual game time from the game scene
        // For now, return a placeholder that would be set by the game
        return this.currentGameTime || 0;
    }
    

    
    // Handle line clear with T.A. Death grading (minimal)
    handleLineClear(gameScene, linesCleared, pieceType = null) {
        if (linesCleared > 0) {
            // Handle minimal T.A. Death scoring
            this.updateDeathScore(gameScene, linesCleared);
            
            // Check for M grade achievement
            this.checkMGradeRequirements(gameScene);
        }
        
        // Check for level 999 completion
        this.checkDeathCompletion(gameScene);
    }
    
    // Update T.A. Death score using official TGM2 (TAP) scoring formula
    updateDeathScore(gameScene, linesCleared) {
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
        
        this.deathScore += totalScore;
        
        // Update score display
        if (gameScene.scoreText) {
            gameScene.scoreText.setText(this.deathScore.toString());
        }
    }
    

    
    // Check for M grade achievement at level 500
    checkMGradeRequirements(gameScene) {
        // T.A. Death M grade: Reach level 500 within 3:25.00 torikan time limit
        if (gameScene.level >= 500 && this.isWithinTimeLimit(gameScene)) {
            this.awardMGrade();
        }
    }
    
    // Check if player is within time limit
    isWithinTimeLimit(gameScene) {
        // Calculate required time based on progress
        // T.A. Death requires reaching level 999 within 3:25.00 from level 500
        // T.A. Death M grade: Must reach level 500 within 3:25.00
        if (!this.timeAtLevel500) return false; // Level 500 not reached yet
        
        const timeFromLevel500 = gameScene.currentTime; // Simplified - would need to track time at level 500
        const maxTimeAllowed = this.torikanLimit;
        
        return this.timeAtLevel500 <= this.torikanLimit;
    }
    
    // Award M grade
    awardMGrade() {
        if (!this.hasReachedMGrade) {
            this.hasReachedMGrade = true;
            this.displayedGrade = 'M';
            this.isMGrade = true;
            
            console.log('T.A. Death: M GRADE ACHIEVED!');
            
            // Continue to level 999 for potential GM grade
            // No immediate completion for M grade
        }
    }
    
    // Check for T.A. Death completion (GM grade)
    checkDeathCompletion(gameScene) {
        if (gameScene.level >= 999) {
            // GM grade: Reach level 999 regardless of time
            this.awardGMGrade();
            // Start 30s credits roll with stack intact
            gameScene.startCredits(30);
            console.log('T.A. Death: Credits started at level 999');
            return true;
        }
        return false;
    }
    
    // Award GM grade
    awardGMGrade() {
        this.displayedGrade = 'GM';
        this.isGMGrade = true;
        this.isDeathComplete = true;
        
        console.log('T.A. Death: GM GRADE ACHIEVED!');
        
        // Show completion message
        this.showCompletionMessage(gameScene, 'GM');
        
        // Proceed to game over
        gameScene.showGameOverScreen();
    }
    
    // Show completion message
    showCompletionMessage(gameScene, finalGrade) {
        if (!gameScene.add) return;
        
        let message = `DEATH COMPLETE\nRANK: ${finalGrade}`;
        let color = '#ff8800'; // Orange for M grade
        
        if (finalGrade === 'GM') {
            color = '#ffff00'; // Yellow for GM grade
            message = `PERFECT DEATH\nRANK: ${finalGrade}`;
        }
        
        const completionText = gameScene.add.text(gameScene.windowWidth / 2, gameScene.windowHeight / 2, message, {
            fontSize: '36px',
            fill: color,
            stroke: '#000',
            strokeThickness: 2,
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        gameScene.gameGroup.add(completionText);
    }
    
    // Update method (called every frame)
    update(gameScene, deltaTime) {
        // Check torikan time limit
        if (this.startedAtLevel500 && !this.isDeathComplete) {
            this.checkTorikanLimit(gameScene);
        }
        
        // T.A. Death has minimal grading, no decay needed
        // Just check for any game over conditions
    }
    
    // Check torikan time limit
    checkTorikanLimit(gameScene) {
        const timeFromLevel500 = gameScene.currentTime; // Simplified - would need exact time tracking
        
        if (timeFromLevel500 > this.torikanLimit) {
            // Torikan failed - game over with no grade
            console.log('T.A. Death: TORIKAN FAILED - Time limit exceeded, no grade awarded');
            
            // Set grade to empty to indicate no grade was achieved
            this.displayedGrade = '';
            
            // Start 30s credits roll at level 500 failure per spec
            gameScene.startCredits(30);
            console.log('T.A. Death: Credits started at torikan failure (level 500)');
        }
    }
    

    
    // Handle game over
    onGameOver(gameScene) {
        // Save best score
        this.saveBestScore(gameScene);
        
        console.log(`T.A. Death Mode: Game Over - Score: ${this.deathScore}, Level: ${gameScene.level}, Grade: ${this.displayedGrade}`);
    }

    // Finish credit roll (T.A. Death uses simple completion)
    finishCreditRoll(gameScene) {
        // No special ranking lines; just end the game
        gameScene.showGameOverScreen();
    }
    
    // Save best score for T.A. Death mode
    saveBestScore(gameScene) {
        const entry = {
            score: this.deathScore,
            level: gameScene.level,
            grade: this.displayedGrade,
            time: `${Math.floor(gameScene.currentTime / 60)}:${Math.floor(gameScene.currentTime % 60).toString().padStart(2, '0')}.${Math.floor((gameScene.currentTime % 1) * 100).toString().padStart(2, '0')}`,
            pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined,
            torikanPassed: this.torikanPassed,
            timingPhase: this.currentTimingPhase,
            mGrade: this.isMGrade,
            gmGrade: this.isGMGrade
        };
        if (typeof gameScene.saveLeaderboardEntry === 'function') {
            gameScene.saveLeaderboardEntry(this.modeId, entry);
        }
    }
    
    // Compare grades (GM > M > other grades)
    isHigherGrade(newGrade, oldGrade) {
        const gradeValues = { 'GM': 3, 'M': 2 };
        const newValue = gradeValues[newGrade] || 0;
        const oldValue = gradeValues[oldGrade] || 0;
        return newValue > oldValue;
    }
    
    // Get best score for this mode
    getBestScore(modeId) {
        // Legacy compatibility; MenuScene reads leaderboard_* instead.
        return {
            score: 0,
            level: 0,
            grade: '9',
            time: '0:00.00',
            torikanPassed: false,
            timingPhase: 1,
            mGrade: false,
            gmGrade: false
        };
    }
    
    // Get current displayed grade
    getDisplayedGrade() {
        return this.displayedGrade;
    }
    
    // Reset mode state for new game
    reset() {
        super.reset();
        
        // Reset T.A. Death specific variables
        this.displayedGrade = '';
        this.internalGrade = 31;
        this.isMGrade = false;
        this.isGMGrade = false;
        this.deathScore = 0;
        this.torikanPassed = false;
        this.timeAtLevel500 = null;
        this.startedAtLevel500 = false;
        this.hasReachedMGrade = false;
        this.isDeathComplete = false;
        
        // Reset timing system
        this.currentTimingPhase = 1;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TADeathMode };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.TADeathMode = TADeathMode;
}
