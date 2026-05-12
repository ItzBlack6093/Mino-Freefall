// 20G Mode Implementation
// Maximum gravity (20 rows per frame) from level 0

class Mode20G extends BaseMode {
    constructor() {
        super();
        this.modeName = '20G';
        this.modeId = 'master_20g';
        this.description = 'Maximum gravity from the start! Good luck!';
    }

    getModeConfig() {
        return {
            gravity: {
                type: 'static',
                value: 5120, // 20G = 20 rows per frame (5120/256 = 20)
                curve: null
            },
            das: 16/60,      // Faster DAS for 20G play
            arr: 1/60,       // Standard ARR
            are: 30/60,      // Shorter ARE for faster gameplay
            lockDelay: 30/60,  // Shorter lock delay for 20G
            nextPieces: 1,   // Show more next pieces for planning
            holdEnabled: false, // No hold in 20G mode
            ghostEnabled: false, // No ghost piece in 20G (too fast)
            levelUpType: 'piece',  // TGM1-style: level increases per piece
            lineClearBonus: 1,
            gravityLevelCap: 999,
            specialMechanics: {
                hardDropOnSpawn: true, // Auto-hard drop pieces on spawn
                noGravityDelay: true  // No gradual gravity increase
            }
        };
    }

    // Always return 20G regardless of level
    getGravitySpeed(level) {
        return 5120; // 20G constant
    }

    // 20G mode: TGM-style level progression with stops
    onLevelUpdate(level, oldLevel, updateType, amount) {
        const atStopLevel = (level % 100 === 99) || level === 998 || level === 999;

        if (updateType === 'piece') {
            if (!atStopLevel && level < 999) {
                return level + 1;
            }
            return level; // Stay at stop level
        } else if (updateType === 'lines') {
            const lineIncrement = Math.min(amount || 0, 4);
            if (oldLevel === 998 && lineIncrement > 0) {
                return 999;
            }
            return Math.min(level + lineIncrement, 999);
        }
        return level;
    }

    // 20G mode: check for 20G gravity detection
    isTwentyGMode() {
        return true;
    }

    // Get 20G-specific gravity information
    getGravityInfo() {
        return {
            type: '20G',
            value: 5120,
            description: '20 rows per frame (maximum speed)',
            rowsPerFrame: 20
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Mode20G;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.Mode20G = Mode20G;
}