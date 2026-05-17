// Mode Manager - Handles loading and lifecycle for Tetris game modes.
// Static mode metadata lives in ModeRegistry.js.

const ModeRegistrySource = typeof ModeRegistry !== 'undefined'
    ? ModeRegistry
    : (typeof require !== 'undefined' ? require('./ModeRegistry.js') : null);

class ModeManager {
    constructor() {
        this.modes = new Map();
        this.loadedModes = new Set();
        this.currentMode = null;
        
        this.registry = ModeRegistrySource || {};
        this.difficultyColors = this.registry.difficultyColors || {};
        this.modeColors = this.registry.modeColors || {};
        
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
        this.modeDefinitions = this.registry.modeDefinitions || {};
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
                if (typeof modeInstance.applyModeDefinition === 'function') {
                    modeInstance.applyModeDefinition(modeId, modeDef);
                } else {
                    modeInstance.modeId = modeId;
                    modeInstance.difficulty = modeDef.config.difficulty;
                    modeInstance.metadata = modeDef.config;
                }

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
        const commonModes = ['tgm1', 'master_20g', 'marathon', 'zen', 'sprint_40'];
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