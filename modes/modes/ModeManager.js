// Mode Manager - Handles dynamic loading and management of Tetris game modes
// Replaces JSON configuration system with JavaScript-based mode definitions

class ModeManager {
    constructor() {
        this.modes = new Map();
        this.loadedModes = new Set();
        this.currentMode = null;
        
        // Color mapping for difficulty types
        this.difficultyColors = {
            'easy': '#00ff00',      // green
            'standard': '#0088ff',  // blue
            'master': '#888888',    // grey
            '20g': '#ff0000',       // red
            'race': '#ff8800',      // orange
            'all clear': '#ff69b4', // pink
            'puzzle': '#8800ff'     // purple
        };

        // Specific colors for individual modes (hex numbers for Phaser)
        this.modeColors = {
            'tgm1': 0x888888,      // grey
            'tgm2': 0x888888,      // grey
            'tgm3': 0x888888,      // grey
            'tgm4': 0x888888,      // grey
            '20g': 0xff0000,       // red
            'tadeath': 0xff0000,   // red
            'shirase': 0xff0000,   // red
            'master20g': 0xff0000, // red
            'marathon': 0x0088ff,  // blue
            'ultra': 0x0088ff,     // blue
            'zen': 0x0088ff,       // blue
            'sprint_40': 0x0088ff, // blue
            'sprint_100': 0x0088ff, // blue
            'asuka_easy': 0xff8800, // orange
            'asuka_normal': 0xff8800, // orange
            'asuka_hard': 0xff8800, // orange
            'konoha_easy': 0xff69b4, // pink
            'konoha_hard': 0xff69b4, // pink
            'tgm3_sakura': 0x8800ff, // purple
            'flashpoint': 0x8800ff, // purple
            'easy_normal': 0x00ff00, // green
            'easy_easy': 0x00ff00, // green
            'tgm2_master': 0x888888, // grey
            'tgm2_normal': 0x00ff00, // green
            'tgm_plus': 0x888888   // grey
        };
        
        this.initializeModes();
    }

    createModeInstance(modeClass) {
        const classRef = typeof window !== 'undefined' ? window[modeClass] : globalThis[modeClass];
        if (typeof classRef === 'function') {
            return new classRef();
        }
        console.warn(`${modeClass} not loaded, using BaseMode fallback`);
        return new BaseMode();
    }

    // Initialize all available modes
    initializeModes() {
        // Register all available modes with their IDs and class references
        this.modeDefinitions = {
            // EASY modes
            'tgm2_normal': { modeClass: 'TGM2NormalMode', name: 'Normal', category: 'EASY', config: { difficulty: 'easy', description: 'TGM2 Normal mode with item blocks at levels 100 and 200!' } },
            'tgm3_easy': { modeClass: 'TGM3EasyMode', name: 'Easy', category: 'EASY', config: { difficulty: 'easy', description: 'TGM3 Easy with Hanabi scoring and credit roll' } },

            // STANDARD modes
            'sprint_40': { modeClass: 'Sprint40Mode', name: 'Sprint 40L', category: 'STANDARD', config: { difficulty: 'standard', description: 'Clear 40 lines as fast as possible' } },
            'sprint_100': { modeClass: 'Sprint40Mode', name: 'Sprint 100L', category: 'STANDARD', config: { difficulty: 'standard', description: 'Clear 100 lines as fast as possible', specialMechanics: { targetLines: 100, timeAttack: true, speedBonus: true } } },
            'ultra': { modeClass: 'UltraMode', name: 'Ultra', category: 'STANDARD', config: { difficulty: 'standard', description: '2-minute score attack' } },
            'marathon': { modeClass: 'MarathonMode', name: 'Marathon', category: 'STANDARD', config: { difficulty: 'standard', description: 'Clear 150 lines' } },
            'zen': { modeClass: 'ZenMode', name: 'Zen', category: 'STANDARD', config: { difficulty: 'standard', description: 'Endless relaxed play' } },

            // MASTER modes
            'tgm1': { modeClass: 'TGM1Mode', name: 'TGM1', category: 'MASTER', config: { difficulty: 'master', description: 'The Tetris game you know and love. Scale through the grades and be a Grand Master!' } },
            'tgm2': { modeClass: 'TGM2MasterMode', name: 'TGM2', category: 'MASTER', config: { difficulty: 'master', description: 'Brand new mechanics, brand new challenges! Do you have what it takes?' } },
            'tgm_plus': { modeClass: 'TGMPlusMode', name: 'TGM+', category: 'MASTER', config: { difficulty: 'master', description: 'Rising garbage mode with fixed 24-row pattern!' } },
            'tgm3': { modeClass: 'TGM3Mode', name: 'TGM3', category: 'MASTER', config: { difficulty: 'master', description: 'Try to be COOL!!, or you will REGRET!! it' } },
            'tgm4': { modeClass: 'TGM4NormalMode', name: 'TGM4 Normal', category: 'MASTER', config: { difficulty: 'master', description: 'TGM4 Normal: 999 levels with TGM1-inspired speed and Zero of Ten grading' } },
            'tgm4_1_1': { modeClass: 'TGM4OneOneMode', name: '1.1', category: 'MASTER', config: { difficulty: 'master', description: 'TGM4 x.1 mode inspired by TGM1 with score-based grading' } },

            // 20G modes
            '20g': { modeClass: 'Mode20G', name: '20G', category: '20G', config: { difficulty: '20g', description: 'Maximum gravity from the start! Good luck!' } },
            'tadeath': { modeClass: 'TADeathMode', name: 'T.A.Death', category: '20G', config: { difficulty: '20g', description: 'Difficult 20G challenge mode. Speed is key!' } },
            'shirase': { modeClass: 'TGM3ShiraseMode', name: 'Shirase', category: '20G', config: { difficulty: '20g', description: 'Lightning-fast speeds. Do you have what it takes?' } },
            'master20g': { modeClass: 'TGM4MasterMode', name: 'Master', category: '20G', config: { difficulty: '20g', description: 'TGM4 Master: 2600-level 20G challenge with Pikii, Cyclone, and End Game hooks' } },
            'tgm4_2_1': { modeClass: 'TGM4TwoOneMode', name: '2.1', category: '20G', config: { difficulty: '20g', description: 'TGM4 x.1 mode inspired by T.A. Death with a level 500 torikan' } },
            'tgm4_3_1': { modeClass: 'TGM4ThreeOneMode', name: '3.1', category: '20G', config: { difficulty: '20g', description: 'TGM4 x.1 mode inspired by Shirase, extended to level 2000' } },
            'tgm4_4_1': { modeClass: 'TGM4FourOneMode', name: '4.1', category: '20G', config: { difficulty: '20g', description: 'TGM4 hidden x.1 mode with fixed 20G and invisible rising-garbage roll hooks' } },

            // RACE modes
            'asuka_easy': { modeClass: 'TGM4AsukaEasyMode', name: 'Asuka Easy', category: 'RACE', config: { difficulty: 'race', description: 'TGM4 Asuka Easy: slower Kita, rewind, and infinity challenge to level 1000' } },
            'asuka_normal': { modeClass: 'TGM4AsukaNormalMode', name: 'Asuka', category: 'RACE', config: { difficulty: 'race', description: 'TGM4 Asuka: 20G Kita race to level 1300 with Vanish phases' } },
            'asuka_hard': { modeClass: 'TGM4AsukaHardMode', name: 'Asuka Hard', category: 'RACE', config: { difficulty: 'race', description: 'TGM4 Asuka Hard: 4:30 Kita-management challenge' } },

            // ALL CLEAR / PUZZLE modes
            'konoha_easy': { modeClass: 'TGM4KonohaEasyMode', name: 'Konoha Easy', category: 'ALL CLEAR', config: { difficulty: 'puzzle', description: 'TGM4 Konoha Easy: Big-mode all-clear challenge with five pieces' } },
            'konoha_hard': { modeClass: 'TGM4KonohaHardMode', name: 'Konoha Hard', category: 'ALL CLEAR', config: { difficulty: 'puzzle', description: 'TGM4 Konoha Hard: Big-mode all-clear challenge with all seven pieces' } },
            'tgm3_sakura': { modeClass: 'TGM3SakuraMode', name: 'TGM3-Sakura', category: 'PUZZLE', config: { difficulty: 'puzzle', description: 'Puzzle mode from TGM3' } },
            'flashpoint': { modeClass: 'ZenMode', name: 'Flashpoint', category: 'PUZZLE', config: { difficulty: 'puzzle', description: 'From Flashpoint.' } }
        };
    }

    // Load a specific mode by ID
    loadMode(modeId) {
        const modeDef = this.modeDefinitions[modeId];
        if (!modeDef) {
            console.error(`Mode not found: ${modeId}`);
            return null;
        }

        // Create new mode instance
        let modeInstance = null;

        try {
            modeInstance = this.createModeInstance(modeDef.modeClass);
            
            // Set mode metadata and config
            if (modeInstance) {
                modeInstance.modeId = modeId;
                modeInstance.difficulty = modeDef.config.difficulty;
                modeInstance.metadata = modeDef.config;

                // Only override config for modes that don't have their own getModeConfig() with timing values
                // Modes with their own getModeConfig() should use that as the single source of truth
                const modeConfig = modeInstance.getModeConfig();
                const hasTimingConfig = modeConfig && (modeConfig.das || modeConfig.arr || modeConfig.are || modeConfig.lockDelay);
                if (!hasTimingConfig) {
                    modeInstance.config = modeDef.config;
                }
            }
            
        } catch (error) {
            console.error(`Failed to load mode ${modeId}:`, error);
            // Fallback to BaseMode
            modeInstance = new BaseMode();
            modeInstance.modeId = modeId;
            modeInstance.difficulty = 'unknown';
        }

        // Cache the loaded mode
        this.modes.set(modeId, modeInstance);
        this.loadedModes.add(modeId);
        this.currentMode = modeInstance;

        return modeInstance;
    }

    // Get current mode
    getCurrentMode() {
        return this.currentMode;
    }

    // Get mode by ID (loads if necessary)
    getMode(modeId) {
        return this.loadMode(modeId);
    }

    // Check if mode is loaded
    isModeLoaded(modeId) {
        return this.loadedModes.has(modeId);
    }

    // Get all available mode IDs
    getAvailableModeIds() {
        return Object.keys(this.modeDefinitions);
    }

    // Get mode information without loading
    getModeInfo(modeId) {
        return this.modeDefinitions[modeId] || null;
    }

    // Get mode configuration
    getModeConfig(modeId) {
        const modeInfo = this.getModeInfo(modeId);
        return modeInfo ? modeInfo.config : null;
    }

    // Get all modes grouped by difficulty
    getModesByDifficulty() {
        const modesByDifficulty = {};
        
        for (const [modeId, modeDef] of Object.entries(this.modeDefinitions)) {
            const difficulty = modeDef.config.difficulty;
            if (!modesByDifficulty[difficulty]) {
                modesByDifficulty[difficulty] = [];
            }
            modesByDifficulty[difficulty].push({
                id: modeId,
                name: this.getModeDisplayName(modeId),
                description: modeDef.config.description
            });
        }
        
        return modesByDifficulty;
    }

    getMenuModeTypes() {
        const modeTypes = [];
        for (const [modeId, modeDef] of Object.entries(this.modeDefinitions)) {
            const category = modeDef.category || String(modeDef.config.difficulty || 'other').toUpperCase();
            let group = modeTypes.find((modeType) => modeType.name === category);
            if (!group) {
                group = { name: category, modes: [] };
                modeTypes.push(group);
            }
            group.modes.push({
                id: modeId,
                name: this.getModeDisplayName(modeId),
                description: modeDef.config.description
            });
        }
        return modeTypes;
    }

    // Get human-readable mode name
    getModeDisplayName(modeId) {
        const modeInfo = this.getModeInfo(modeId);
        return modeInfo && modeInfo.name ? modeInfo.name : modeId;
    }

    // Preload commonly used modes
    preloadCommonModes() {
        const commonModes = ['tgm1', '20g', 'marathon', 'zen', 'sprint_40'];
        commonModes.forEach(modeId => {
            if (this.modeDefinitions[modeId]) {
                this.loadMode(modeId);
            }
        });
    }

    // Clear mode cache (for memory management)
    clearCache() {
        this.modes.clear();
        this.loadedModes.clear();
        this.currentMode = null;
    }

    // Get memory usage statistics
    getMemoryStats() {
        return {
            loadedModes: this.loadedModes.size,
            cachedInstances: this.modes.size,
            totalDefined: Object.keys(this.modeDefinitions).length
        };
    }
}

// Global mode manager instance
let globalModeManager = null;

// Get or create global mode manager
function getModeManager() {
    if (!globalModeManager) {
        globalModeManager = new ModeManager();
    }
    return globalModeManager;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModeManager, getModeManager };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.ModeManager = ModeManager;
    window.getModeManager = getModeManager;
}