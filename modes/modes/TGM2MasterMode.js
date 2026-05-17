// TGM2MasterMode - Master mode from TGM2: 999 levels with progressive timing after level 500
// Features: Shrinking delays after level 500, Fading Roll and M-Roll credit roll challenges

class TGM2MasterMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM2 Master';
        this.modeId = 'tgm2_master';
        
        // Master mode configuration
        this.config = {
            gravity: { type: 'tgm2_master' }, // Use TGM2 Master gravity curve
            das: 16/60,                    // Base TGM2 Master DAS (changes with timing phases)
            arr: 2/60,                     // Standard TGM2 Master ARR  
            are: 27/60,                    // Base TGM2 Master ARE timing (changes with timing phases)
            lineAre: 27/60,                // Base line clear ARE (changes with timing phases)
            lockDelay: 30/60,              // TGM2 Master lock delay (changes with timing phases)
            lineClearDelay: 40/60,         // Base line clear delay (changes with timing phases)
            nextPieces: 1,                 // Standard next queue
            holdEnabled: false,            
            ghostEnabled: true,            // Ghost piece enabled
            levelUpType: 'piece',          // Level up per piece
            lineClearBonus: 1,
            gravityLevelCap: 999,
            lowestGrade: '9',
            specialMechanics: {
                fadingRoll: true,          // Enable Fading Roll credit roll
                mRoll: true,               // Enable M-Roll challenge
                tgm2Grading: true,         // Use TGM2 grading system
                progressiveTimings: true   // Enable progressive timing system
            }
        };
        
        // TGM2 grade display
        this.displayedGrade = '9';
        this.lastDisplayedGrade = '9';
        
        // TGM2 scoring
        this.tgm2Score = 0;
        
        // Credit roll system
        this.creditsStarted = false;
        this.creditsTimer = 0;
        this.creditsDuration = 61.60; // Same as other TGM2 modes
        this.fadingRollActive = false;
        this.mRollUnlocked = false;
        this.mRollStarted = false;
        this.linesClearedInMRoll = 0;
        
        // Progressive timing system
        this.currentTimingPhase = 1; // 1-6 phases based on level
        this.timingPhases = [
            { minLevel: 0, maxLevel: 499, are: 27/60, lineAre: 27/60, das: 16/60, arr: 1/60, lock: 30/60, lineClear: 40/60 },
            { minLevel: 500, maxLevel: 599, are: 27/60, lineAre: 27/60, das: 10/60, arr: 1/60, lock: 30/60, lineClear: 25/60 },
            { minLevel: 600, maxLevel: 699, are: 27/60, lineAre: 18/60, das: 10/60, arr: 1/60, lock: 30/60, lineClear: 16/60 },
            { minLevel: 700, maxLevel: 799, are: 18/60, lineAre: 14/60, das: 10/60, arr: 1/60, lock: 30/60, lineClear: 12/60 },
            { minLevel: 800, maxLevel: 899, are: 14/60, lineAre: 8/60,  das: 10/60, arr: 1/60, lock: 30/60, lineClear: 6/60 },
            { minLevel: 900, maxLevel: 999, are: 14/60, lineAre: 8/60,  das: 8/60,  arr: 1/60, lock: 17/60, lineClear: 6/60 }
        ];
        
        // Initialize TGM2 grading system
        this.tgm2Grading = new TGM2GradingSystem();
    }
    
    onCreditsStart(gameScene) {
        this.fadingRollActive = true;
        if (gameScene) {
            gameScene.fadingRollActive = true;
            gameScene.invisibleStackActive = false;
        }

        this.checkMRollConditions(gameScene);
    }

    getInternalGrade() {
        return this.tgm2Grading ? this.tgm2Grading.internalGrade : 0;
    }
    
    getGradePoints() {
        return this.tgm2Grading ? this.tgm2Grading.gradePoints : 0;
    }
    
    // Get mode configuration
    getModeConfig() {
        return {
            gravity: { type: 'tgm2_master' }, // Use TGM2 Master gravity curve
            das: 16/60,                    // Base TGM2 Master DAS (changes with timing phases)
            arr: 2/60,                     // Standard TGM2 Master ARR
            are: 27/60,                    // Base TGM2 Master ARE timing (changes with timing phases)
            lockDelay: 30/60,              // TGM2 Master lock delay (changes with timing phases)
            nextPieces: 1,                 // Standard next queue
            holdEnabled: false,            // TGM2 supports hold
            ghostEnabled: true,            // Ghost piece enabled
            levelUpType: 'piece',          // Level up per piece
            lineClearBonus: 1,
            gravityLevelCap: 999,
            hasGrading: true,
            specialMechanics: {
                fadingRoll: true,          // Enable Fading Roll credit roll
                mRoll: true,               // Enable M-Roll challenge
                tgm2Grading: true,         // Use TGM2 grading system
                progressiveTimings: true   // Enable progressive timing system
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
    
    // Handle level progression with Master rules (piece spawn except first piece; 998 -> 999 requires a line clear)
    onLevelUpdate(level, oldLevel, updateType, amount) {
        if (updateType === 'piece') {
            // Advance on piece spawn (except first piece handled by caller), but stop at 998 to require line clear for 999
            const nextLevel = Math.min(level + 1, 998);
            this.updateTimingPhase(nextLevel);
            return nextLevel;
        }

        if (updateType === 'lines') {
            const lines = Math.max(0, amount || 0);

            // 998 -> 999 requires a line clear
            if (oldLevel === 998 && lines > 0) {
                this.updateTimingPhase(999);
                return 999;
            }

            const nextLevel = Math.min(level + lines, 999);
            this.updateTimingPhase(nextLevel);
            return nextLevel;
        }

        this.updateTimingPhase(level);
        return level;
    }
    
    // Get gravity speed using TGM2 Master curve (0-999)
    getGravitySpeed(level) {
        // TGM2 Master mode gravity curve based on tgm2modes.md specifications
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
    
    // Get timing values (dynamic based on current timing phase)
    getDAS() {
        return this.getCurrentTimingPhase().das;
    }
    
    getARR() {
        return this.getCurrentTimingPhase().arr;
    }
    
    getARE() {
        return this.getCurrentTimingPhase().are;
    }
    
    getLineARE() {
        return this.getCurrentTimingPhase().lineAre;
    }
    
    getLockDelay() {
        return this.getCurrentTimingPhase().lock;
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
        console.log(`TGM2 Master: Timing phase changed from ${oldPhase} to ${newPhase}`);
        
        // Play timing change sound if available
        // This would trigger visual/audio feedback for the speed increase
    }
    
    // Initialize mode for game scene
    initializeForGameScene(gameScene) {
        super.initializeForGameScene(gameScene);
        
        // Initialize TGM2 grading system level
        this.tgm2Grading.setLevel(gameScene.level);
        
        // Initialize timing phase
        this.updateTimingPhase(gameScene.level);
        
        // Initialize M-Roll conditions
        this.checkMRollConditions(gameScene);
    }
    
    // Handle line clear with TGM2 grading
    handleLineClear(gameScene, linesCleared, pieceType = null) {
        // Handle TGM2 grading system
        if (
            this.config.specialMechanics.tgm2Grading &&
            !(gameScene && gameScene.creditsActive)
        ) {
            // Update level in grading system
            this.tgm2Grading.setLevel(gameScene.level);
            
            // Calculate combo size for TGM2
            const comboSize = this.calculateTGM2ComboSize(gameScene);
            
            // Check if this was a Tetris
            const isTetris = linesCleared === 4;
            
            // Award grade points
            this.tgm2Grading.awardPoints(linesCleared, comboSize, gameScene.level, isTetris);

            const newDisplayedGrade = this.tgm2Grading.getDisplayedGrade();
            const displayedGradeChanged = newDisplayedGrade !== this.displayedGrade;

            // Update displayed grade
            this.displayedGrade = newDisplayedGrade;
            
            // Update grade display in game
            if (gameScene.gradeText) {
                gameScene.gradeText.setText(this.displayedGrade);
            }
            
            if (displayedGradeChanged) {
                this.triggerGradeUpAnimation(gameScene);
            }
        }
        
        // Handle TGM2 scoring
        this.updateTGM2Score(gameScene, linesCleared, pieceType);
        
        // Check for credit roll start
        this.checkCreditRoll(gameScene);
        
        // Track M-Roll progress
        if (this.mRollStarted) {
            this.linesClearedInMRoll += linesCleared;
        }
    }
    
    // Calculate TGM2 combo size
    calculateTGM2ComboSize(gameScene) {
        if (gameScene.comboCount === -1) {
            return 1; // No combo active
        }
        
        // TGM2 combo is based on consecutive non-single clears
        return Math.max(1, gameScene.comboCount + 1);
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
        
        const baseScore = (base + soft + (2 * sonic)) * linesCleared * combo * bravo;
        const totalScore = baseScore + levelBonus + speedBonus;
        
        this.tgm2Score += totalScore;
        
        // Update score display
        if (gameScene.scoreText) {
            gameScene.scoreText.setText(this.tgm2Score.toString());
        }
    }
    

    
    // Check for credit roll start
    checkCreditRoll(gameScene) {
        if (gameScene.level >= 999 && !this.creditsStarted) {
            console.log('TGM2 Master: Credits pending (stack fade then roll)');
        }
    }

    // Called by GameScene when credits actually begin (after stack fade)
    onCreditsStart(gameScene) {
        this.creditsStarted = true;
        this.creditsTimer = 0;
        this.creditsDuration = gameScene.creditsDuration || this.creditsDuration || 61.6;
        const forceMRoll = (() => {
            try {
                return (localStorage.getItem('forceMRoll') || 'false') === 'true';
            } catch (_e) {
                return false;
            }
        })();
        // Re-check right at roll start so unlock state reflects final run stats.
        this.checkMRollConditions(gameScene);
        if (forceMRoll) {
            this.mRollUnlocked = true;
        }

        // Decide roll type based on unlock
        if (this.mRollUnlocked) {
            this.startMRoll(gameScene);
        } else {
            this.fadingRollActive = true;
            if (gameScene) {
                gameScene.fadingRollActive = true;
                gameScene.invisibleStackActive = false;
            }
        }
    }
    
    // Check M-Roll unlock conditions
    checkMRollConditions(gameScene) {
        const currentTime = gameScene.currentTime;
        const sectionTimes = gameScene.sectionTimes || {};
        const sectionTetrises = gameScene.sectionTetrises || {};

        const globalTimeOk = currentTime <= 525;
        const gradeOk = this.displayedGrade === 'S9';

        const firstFiveSections = [0, 1, 2, 3, 4];
        const firstFiveTimes = firstFiveSections
            .map((s) => sectionTimes[s])
            .filter((t) => typeof t === 'number');
        const firstFiveComplete = firstFiveTimes.length === 5;
        const averageFirstFive = firstFiveComplete
            ? Math.floor(firstFiveTimes.reduce((a, b) => a + b, 0) / 5)
            : null;

        const section0to4Ok = firstFiveSections.every(
            (s) => typeof sectionTimes[s] === 'number' && sectionTimes[s] <= 65,
        );
        const tetrises0to4Ok = firstFiveSections.every(
            (s) => (sectionTetrises[s] || 0) >= 2,
        );

        const time500Ok =
            typeof sectionTimes[5] === 'number' &&
            averageFirstFive !== null &&
            sectionTimes[5] <= averageFirstFive + 2;
        const tetris500Ok = (sectionTetrises[5] || 0) >= 1;

        const chainSections = [6, 7, 8];
        const chainTimesOk = chainSections.every((s) => {
            const prev = s - 1;
            if (typeof sectionTimes[s] !== 'number' || typeof sectionTimes[prev] !== 'number') {
                return false;
            }
            return sectionTimes[s] <= sectionTimes[prev] + 2;
        });
        const chainTetrisesOk = chainSections.every((s) => (sectionTetrises[s] || 0) >= 1);

        const section900Ok =
            typeof sectionTimes[9] === 'number' &&
            typeof sectionTimes[8] === 'number' &&
            sectionTimes[9] <= sectionTimes[8] + 2;

        const sectionTimeOk =
            section0to4Ok &&
            time500Ok &&
            chainTimesOk &&
            section900Ok;
        const sectionTetrisOk = tetrises0to4Ok && tetris500Ok && chainTetrisesOk;

        this.mRollUnlocked = globalTimeOk && gradeOk && sectionTimeOk && sectionTetrisOk;
        if (this.mRollUnlocked) {
            console.log('TGM2 Master: M-Roll unlocked!');
        }
    }
    
    // Start M-Roll challenge
    startMRoll(gameScene) {
        if (!this.mRollUnlocked) return;
        
        this.mRollStarted = true;
        this.linesClearedInMRoll = 0;
        
        console.log('TGM2 Master: M-Roll started - pieces will be invisible');

        if (gameScene) {
            gameScene.invisibleStackActive = true;
            gameScene.fadingRollActive = false;
        }

        this.fadingRollActive = false;
        
        // Set pieces to invisible in M-Roll
        // This would require integration with the piece rendering system
    }
    
    // Trigger grade up animation
    triggerGradeUpAnimation(gameScene) {
        if (gameScene.sound) {
            gameScene.playSfx('gradeup', 0.6);
        }
        
        // Flash grade text
        if (gameScene.gradeText) {
            gameScene.gradeText.setTint(0xffff00);
            gameScene.time.delayedCall(200, () => {
                gameScene.gradeText.setTint(0xffffff);
            });
        }
    }
    
    // Update TGM2 grading system decay (called every frame)
    update(gameScene, deltaTime) {
        if (this.config.specialMechanics.tgm2Grading && !gameScene.creditsActive) {
            // Update TGM2 grading system decay
            this.tgm2Grading.update(deltaTime);

            // Update game state for decay control
            const hasControl = !gameScene.areActive;
            const hasActiveCombo = gameScene.comboCount >= 1 && gameScene.lastClearType !== 'single';
            this.tgm2Grading.setGameState(hasControl, hasActiveCombo);

            // Update level in grading system
            this.tgm2Grading.setLevel(gameScene.level);
        }
        
        // Handle credit roll
        if (this.creditsStarted && gameScene && gameScene.creditsActive) {
            this.creditsTimer += deltaTime;
            
            if (this.creditsTimer >= this.creditsDuration) {
                this.creditsStarted = false;
                this.finishCreditRoll(gameScene);
            }
        }
    }
    
    // Finish credit roll and determine final ranking
    finishCreditRoll(gameScene) {
        const linesDuringRoll = gameScene.rollLinesCleared || 0;
        const failedDuringRoll = gameScene.rollFailedDuringRoll;

        let finalGrade = this.displayedGrade;
        let rankingType = 'regular';
        let lineColor = 'none';

        if (this.mRollStarted) {
            this.linesClearedInMRoll = linesDuringRoll;
            if (failedDuringRoll) {
                finalGrade = 'm';
                rankingType = 'm_roll_failed';
                lineColor = 'green';
            } else if (linesDuringRoll >= 32) {
                finalGrade = 'GM';
                rankingType = 'm_roll_orange';
                lineColor = 'orange';
            } else {
                finalGrade = 'GM';
                rankingType = 'm_roll_green';
                lineColor = 'green';
            }
        } else if (this.fadingRollActive) {
            if (failedDuringRoll) {
                finalGrade = this.displayedGrade;
                rankingType = 'fading_failed';
                lineColor = 'green';
            } else {
                finalGrade = this.displayedGrade;
                rankingType = 'fading';
                lineColor = 'orange';
            }
        } else {
            if (failedDuringRoll) {
                lineColor = 'green';
            }
        }

        if (gameScene) {
            if (typeof gameScene.setGradeLineColor === 'function') {
                gameScene.setGradeLineColor(lineColor);
            } else {
                gameScene.gradeLineColor = lineColor;
            }
        }

        console.log(`TGM2 Master Final Ranking: ${finalGrade} (${rankingType}) lines:${linesDuringRoll} lineColor:${lineColor}`);

        // Show final ranking
        this.showFinalRanking(gameScene, finalGrade, rankingType, lineColor);

        // Only call showGameOverScreen if game over state hasn't already been prepared
        // (e.g., from credits fade-in completion)
        if (!gameScene.gameOverStatePrepared) {
            gameScene.showGameOverScreen();
        }
    }
    
    // Show final ranking
    showFinalRanking(gameScene, grade, rankingType, lineColor = 'none') {
        if (!gameScene.add) return;
        
        let color = '#ffffff'; // default
        if (lineColor === 'orange') color = '#ff8800';
        else if (lineColor === 'green') color = '#00ff00';
        
        const rankingText = gameScene.add.text(gameScene.windowWidth / 2, gameScene.windowHeight / 2, 
            `RANK: ${grade}`, {
            fontSize: '36px',
            fill: color,
            stroke: '#000',
            strokeThickness: 2,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        gameScene.gameGroup.add(rankingText);
    }
    
    // Get current displayed grade
    getDisplayedGrade() {
        return this.displayedGrade;
    }
    
    // Handle game over
    onGameOver(gameScene) {
        // Save best score
        this.saveBestScore(gameScene);
    }
    
    // Save best score for TGM2 Master mode
    saveBestScore(gameScene) {
        const entry = {
            score: this.tgm2Score,
            level: gameScene.level,
            grade: this.displayedGrade,
            time: `${Math.floor(gameScene.currentTime / 60)}:${Math.floor(gameScene.currentTime % 60).toString().padStart(2, '0')}.${Math.floor((gameScene.currentTime % 1) * 100).toString().padStart(2, '0')}`,
            pps: gameScene.conventionalPPS != null ? Number(gameScene.conventionalPPS.toFixed(2)) : undefined,
            gradePoints: this.tgm2Grading.totalGradePoints,
            internalGrade: this.tgm2Grading.internalGrade
        };
        if (typeof gameScene.saveLeaderboardEntry === 'function') {
            gameScene.saveLeaderboardEntry(this.modeId, entry);
        }
    }
    
    // Get best score for this mode
    getBestScore(modeId) {
        // Legacy compatibility; MenuScene reads leaderboard_* instead.
        return {
            score: 0,
            level: 0,
            grade: '9',
            time: '0:00.00',
            gradePoints: 0,
            internalGrade: 0
        };
    }
    
    // Reset mode state for new game
    reset() {
        super.reset();
        
        // Reset TGM2 grading system
        this.tgm2Grading.reset();
        this.displayedGrade = '9';
        this.tgm2Score = 0;
        
        // Reset credit roll system
        this.creditsStarted = false;
        this.creditsTimer = 0;
        this.fadingRollActive = false;
        this.mRollUnlocked = false;
        this.mRollStarted = false;
        this.linesClearedInMRoll = 0;
        
        // Reset timing system
        this.currentTimingPhase = 1;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM2MasterMode };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.TGM2MasterMode = TGM2MasterMode;
}
