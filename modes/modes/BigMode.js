// BigMode - Shared module for 5x10 board with double-sized pieces
// Used by modes like Konoha and TGM3 Shirase credits roll
// A standard 10x20 field appears as 5x10 when pieces are double-sized (2x2 cells per mino)

class BigMode {
    constructor() {
        this.bigModeActive = false;
        this.lastInitializedScene = null;
    }

    // Initialize big mode with proper board dimensions
    // For a true 5x10 board, we would need to scale down piece shapes and use 5 columns x 11 rows
    // Current implementation: use standard 10x22 board with double-sized rendering
    initializeBigMode(gameScene) {
        if (!gameScene) return false;

        // Set big mode flags
        this.bigModeActive = true;
        this.lastInitializedScene = gameScene;
        gameScene.bigModeActive = true;
        gameScene.bigBlocksActive = true;
        gameScene.bigModeController = this;

        // Note: Hold and next queue pieces should NOT use double size
        // They use previewCellSize which is independent of bigBlocksActive
        return true;
    }

    // Deinitialize big mode and restore normal rendering
    deinitializeBigMode(gameScene) {
        if (!gameScene) return false;

        this.bigModeActive = false;
        if (this.lastInitializedScene === gameScene) {
            this.lastInitializedScene = null;
        }
        gameScene.bigModeActive = false;
        gameScene.bigBlocksActive = false;
        if (gameScene.bigModeController === this) {
            gameScene.bigModeController = null;
        }
        return true;
    }

    // Check if big mode is active
    isBigModeActive(gameScene) {
        if (!gameScene) return this.bigModeActive;
        return !!(gameScene.bigModeActive || gameScene.bigBlocksActive);
    }

    // Get the effective board dimensions for big mode
    // Standard: 10 columns x 22 rows (2 hidden + 20 visible)
    // Big mode visual equivalent: 5 columns x 11 rows (1 hidden + 10 visible)
    getBoardDimensions() {
        return {
            cols: 5,  // Half of standard 10
            rows: 11   // Half of standard 22 (rounded)
        };
    }

    // Shared singleton used across modes so initialization works consistently.
    static getSharedInstance() {
        const root = typeof globalThis !== 'undefined'
            ? globalThis
            : (typeof window !== 'undefined' ? window : {});

        if (!(root.__minoFreefallBigModeInstance instanceof BigMode)) {
            root.__minoFreefallBigModeInstance = new BigMode();
        }
        return root.__minoFreefallBigModeInstance;
    }
}

function getBigModeInstance() {
    return BigMode.getSharedInstance();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BigMode, getBigModeInstance };
}
if (typeof window !== 'undefined') {
    window.BigMode = BigMode;
    window.getBigModeInstance = getBigModeInstance;
}
