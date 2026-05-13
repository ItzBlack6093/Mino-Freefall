// Base class for all Tetris game modes
// Provides common functionality and configuration management

class BaseMode {
    constructor() {
        this.modeName = 'Base Mode';
        this.description = 'Base mode implementation';
        this.config = this.getDefaultConfig();
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
        return {
            ...this.getDefaultConfig(),
            ...this.getModeConfig()
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
                return config.gravity.value;
            
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
        return this.getConfig().das;
    }

    getARR() {
        return this.getConfig().arr;
    }

    getARE() {
        return this.getConfig().are;
    }

    getLineARE() {
        return this.getConfig().lineAre;
    }

    getLockDelay() {
        return this.getConfig().lockDelay;
    }

    getLineClearDelay() {
        return this.getConfig().lineClearDelay;
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

    getGravityLevelCap() {
        return this.getConfig().gravityLevelCap;
    }

    // Mode-specific hook for level updates
    onLevelUpdate(level, oldLevel, updateType, amount) {
        // Default implementation - can be overridden by modes
        return level;
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

    // Get mode name
    getName() {
        return this.modeName;
    }

    // Get mode description
    getDescription() {
        return this.description;
    }
    
    // Mode initialization for game scene
    initializeForGameScene(gameScene) {
        // Default implementation - can be overridden by modes
    }
    
    // Handle line clear events
    handleLineClear(gameScene, linesCleared, pieceType) {
        // Default implementation - can be overridden by modes
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