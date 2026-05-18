// Base class for all Tetris game modes
// Provides common functionality and configuration management

class BaseMode {
    constructor() {
        this.modeName = 'Base Mode';
        this.description = 'Base mode implementation';
        this.modeDefinition = null;
        this.metadata = {};
        this.config = this.getDefaultConfig();
    }

    applyModeDefinition(modeId, modeDefinition = {}) {
        this.modeId = modeId;
        this.modeDefinition = modeDefinition;
        this.metadata = modeDefinition.config || {};
        this.difficulty = this.metadata.difficulty || this.difficulty || 'unknown';
        this.displayName = modeDefinition.name || this.displayName || this.modeName;
        this.category = modeDefinition.category || this.category || this.difficulty;
    }

    getModeDefinition() {
        return this.modeDefinition;
    }

    getMetadata(key, defaultValue = null) {
        if (!key) return this.metadata;
        return Object.prototype.hasOwnProperty.call(this.metadata, key) ? this.metadata[key] : defaultValue;
    }

    // Override this method in each mode to define specific behavior
    getModeConfig() {
        return {
            gravity: {
                type: 'tgm1', // 'tgm1', 'static', 'linear', 'custom'
                value: 0,     // For static gravity
                curve: null   // Custom function for advanced gravity curves
            },
            das: 16/60,      // Delayed Auto Shift (seconds)
            arr: 1/60,       // Auto Repeat Rate (seconds)
            are: 30/60,      // Appearance Delay (seconds)
            lineAre: 30/60,  // Line ARE (seconds)
            lockDelay: 0.5,  // Lock Delay (seconds)
            lineClearDelay: 41/60, // Line clear delay (seconds)

            nextPieces: 1,   // Number of next pieces to show
            holdEnabled: false,
            ghostEnabled: true,
            levelUpType: 'piece',  // 'piece' or 'lines'
            lineClearBonus: 1,     // Multiplier for line clear points
            gravityLevelCap: 999,
            specialMechanics: {}   // Mode-specific features
        };
    }

    // Get the complete configuration for this mode
    getConfig() {
        const defaultConfig = this.getDefaultConfig();
        const metadataConfig = this.metadata || {};
        const modeConfig = this.getModeConfig() || {};
        return {
            ...defaultConfig,
            ...metadataConfig,
            ...modeConfig,
            specialMechanics: {
                ...(defaultConfig.specialMechanics || {}),
                ...(metadataConfig.specialMechanics || {}),
                ...(modeConfig.specialMechanics || {})
            }
        };
    }

    getBgmConfig() {
        return {
            progressSource: 'internalLevelOrLevel',
            stopSource: 'bgmStopLevelOrProgress',
            useStopBuffer: true,
            transitionStopOffset: 9,
            segments: [
                { end: 499, key: 'mf1_1' },
                { end: 999, key: 'mf1_2' }
            ],
            credits: {
                key: 'mf2_endroll',
                reuseCurrentTrack: false
            }
        };
    }

    // Default configuration (can be overridden)
    getDefaultConfig() {
        return {
            gravity: {
                type: 'tgm1',
                value: 0,
                curve: null
            },
            das: 16/60,
            arr: 1/60,
            are: 30/60,
            lineAre: 30/60,
            lockDelay: 0.5,
            lineClearDelay: 41/60,

            nextPieces: 1,
            holdEnabled: false,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 999,
            specialMechanics: {}
        };
    }

    // Calculate gravity speed based on level and mode configuration
    getGravitySpeed(level) {
        const config = this.getConfig();
        
        switch (config.gravity.type) {
            case 'static':
            case 'fixed':
                return config.gravity.value;

            case 'fixed_20g':
                return 5120;
            
            case 'linear':
                // Simple linear progression: base + (level * multiplier)
                return config.gravity.base + (level * config.gravity.multiplier);
            
            case 'custom':
                if (config.gravity.curve && typeof config.gravity.curve === 'function') {
                    return config.gravity.curve(level);
                }
                return config.gravity.value;
            
            case 'tgm1':
            default:
                return this.getTGM1GravitySpeed(level);
        }
    }

    // Official TGM1 Internal Gravity system (fallback)
    getTGM1GravitySpeed(level) {
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

    // Get mode-specific timing values
    getDAS() {
        return this.getTimingValue('das');
    }

    getARR() {
        return this.getTimingValue('arr');
    }

    getARE() {
        return this.getTimingValue('are');
    }

    getLineARE() {
        return this.getTimingValue('lineAre', 'are');
    }

    getLockDelay() {
        return this.getTimingValue('lockDelay', 'lock');
    }

    getLineClearDelay() {
        return this.getTimingValue('lineClearDelay', 'lineClear');
    }

    getTimingTable() {
        return this.timingPhases || this.timings || null;
    }

    getTimingForLevel(level = 0) {
        const timingTable = this.getTimingTable();
        if (!Array.isArray(timingTable) || timingTable.length === 0) {
            return null;
        }

        return timingTable.find((timing) => {
            const min = timing.minLevel ?? timing.start ?? 0;
            const max = timing.maxLevel ?? timing.end ?? Infinity;
            return level >= min && level <= max;
        }) || timingTable[timingTable.length - 1];
    }

    getCurrentTiming(level = null) {
        if (this.currentTiming && typeof this.currentTiming === 'object') {
            return this.currentTiming;
        }
        if (typeof this.currentTimingPhase === 'number' && Array.isArray(this.timingPhases)) {
            return this.timingPhases[this.currentTimingPhase - 1] || this.timingPhases[0] || null;
        }
        const effectiveLevel = level ?? this.internalLevel ?? this.level ?? 0;
        return this.getTimingForLevel(effectiveLevel);
    }

    getTimingValue(key, alternateKey = null) {
        const currentTiming = this.getCurrentTiming();
        if (currentTiming && Object.prototype.hasOwnProperty.call(currentTiming, key)) {
            return currentTiming[key];
        }
        if (alternateKey && currentTiming && Object.prototype.hasOwnProperty.call(currentTiming, alternateKey)) {
            return currentTiming[alternateKey];
        }

        const config = this.getConfig();
        if (Object.prototype.hasOwnProperty.call(config, key)) {
            return config[key];
        }
        return alternateKey && Object.prototype.hasOwnProperty.call(config, alternateKey)
            ? config[alternateKey]
            : undefined;
    }

    getNextPiecesCount() {
        return this.getConfig().nextPieces;
    }

    isHoldEnabled() {
        return this.getConfig().holdEnabled;
    }

    isGhostEnabled() {
        return this.getConfig().ghostEnabled;
    }

    getLevelUpType() {
        return this.getConfig().levelUpType;
    }

    getLineClearBonus() {
        return this.getConfig().lineClearBonus;
    }

    getGradePoints() {
        return 0;
    }

    getDisplayedGrade() {
        return this.displayedGrade || this.getConfig().lowestGrade || '';
    }

    getInternalGrade() {
        return this.internalGrade || 0;
    }

    getStaffRollBonus() {
        return 0;
    }

    addStaffRollBonus(points = 0) {
        return points;
    }

    addStaffRollLines(lines = 0) {
        return lines;
    }

    getGravityLevelCap() {
        return this.getConfig().gravityLevelCap;
    }

    // Display/UI level cap (can differ from gravity/internal cap in some modes)
    getDisplayLevelCap() {
        return this.getGravityLevelCap();
    }

    // Mode-specific hook for level updates
    onLevelUpdate(level, oldLevel, updateType, amount) {
        // Default implementation - can be overridden by modes
        return level;
    }

    shouldBypassLevelStop(gameScene) {
        return false;
    }

    onReachedMaxLevel(gameScene, context = {}) {
        return false;
    }

    onSectionComplete(gameScene, section, previousSection) {
    }

    evaluateSectionPerformance(section, sectionTime, coolTime = null) {
        return null;
    }

    onSectionCool() {
    }

    onSectionRegret() {
    }

    onCreditsStart(gameScene) {
    }

    onCreditsEnd(gameScene) {
    }

    finishCreditRoll(gameScene) {
    }

    initializeBigRoll(gameScene) {
    }

    // Mode-specific hook for piece spawning
    onPieceSpawn(piece, game) {
        // Default implementation - can be overridden by modes
        return piece;
    }

    // Mode-specific hook for piece locking
    onPieceLock(piece, game) {
        // Default implementation - can be overridden by modes
        return true;
    }

    onRotateWhileGrounded(gameScene) {
    }

    // Mode-specific hook for line clearing
    onLineClear(lines, game) {
        // Default implementation - can be overridden by modes
        return lines;
    }

    // Mode-specific hook for score calculation
    calculateScore(baseScore, lines, piece, game) {
        // Default implementation - can be overridden by modes
        return Math.floor(baseScore * this.getLineClearBonus());
    }

    getActiveTime(gameScene) {
        return gameScene?.currentPieceActiveTime || 10;
    }

    isPerfectClear(gameScene) {
        const grid = gameScene?.board?.grid || gameScene?.grid;
        return Array.isArray(grid) && grid.every((row) => Array.isArray(row) && row.every((cell) => !cell));
    }

    formatGameTime(seconds = 0) {
        const minutes = Math.floor(seconds / 60);
        const wholeSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
        const centiseconds = Math.floor((seconds % 1) * 100).toString().padStart(2, '0');
        return `${minutes}:${wholeSeconds}.${centiseconds}`;
    }

    getBestScore(modeId) {
        return {
            score: 0,
            level: 0,
            grade: this.getDisplayedGrade(),
            time: '0:00.00'
        };
    }

    // Get mode name
    getName() {
        return this.displayName || this.modeName || this.getModeId();
    }

    getDisplayName() {
        return this.displayName || this.getName();
    }

    // Get mode description
    getDescription() {
        return this.getMetadata('description', this.description || '');
    }
    
    // Mode initialization for game scene
    initializeForGameScene(gameScene) {
        // Default implementation - can be overridden by modes
    }
    
    // Handle line clear events
    handleLineClear(gameScene, linesCleared, pieceType) {
        // Default implementation - can be overridden by modes
    }

    getEffectiveLineClearCount(gameScene, linesToClear = [], allCompletedLines = linesToClear) {
        return linesToClear.length;
    }
    
    // Update method called every frame
    update(gameScene, deltaTime) {
        // Default implementation - can be overridden by modes
    }
    
    // Handle game over
    onGameOver(gameScene) {
        // Default implementation - can be overridden by modes
    }
    
    // Reset mode state
    reset() {
        // Default implementation - can be overridden by modes
    }

    resetGrading(gameScene) {
    }

    updateTimingPhase(level) {
        const timingTable = this.getTimingTable();
        if (!Array.isArray(timingTable)) return;
        const timing = this.getTimingForLevel(level);
        const nextIndex = timingTable.indexOf(timing);
        if (nextIndex >= 0) {
            this.currentTimingPhase = nextIndex + 1;
        }
    }

    captureBackstepState(gameScene) {
        return {};
    }

    restoreBackstepState(gameScene, snapshot = {}) {
    }

    handleSakuraInput(gameScene, action, isPressed) {
        return false;
    }

    advanceSequenceWithHold(gameScene) {
        return false;
    }

    isTwentyGMode() {
        const gravity = this.getConfig().gravity || {};
        return gravity.type === 'fixed_20g' || gravity.value === 5120 || this.getGravitySpeed(this.level || 0) >= 5120;
    }

    getDisplayedTime(gameScene) {
        return gameScene ? gameScene.currentTime : 0;
    }
    
    // Get mode ID
    getModeId() {
        if (this.modeId) return this.modeId;
        return this.modeName.toLowerCase().replace(/\s+/g, '_');
    }
    
    // Generate next piece (can be overridden for custom piece generation)
    generateNextPiece(gameScene) {
        // Default implementation - use game's standard piece generation
        return gameScene.generateTGM1Piece();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseMode;
}
