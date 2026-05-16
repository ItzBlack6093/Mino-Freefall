// BigMode - Shared module for 5x10 board with double-sized pieces
// Used by modes like Konoha and TGM3 Shirase credits roll
// A standard 10x20 field appears as 5x10 when pieces are double-sized (2x2 cells per mino)

class BigMode {
    constructor() {
        this.bigModeActive = false;
    }

    // Initialize big mode with proper board dimensions
    // For a true 5x10 board, we would need to scale down piece shapes and use 5 columns x 11 rows
    // Current implementation: use standard 10x22 board with double-sized rendering
    initializeBigMode(gameScene) {
        if (!gameScene) return;

        // Set big mode flags
        gameScene.bigModeActive = true;
        gameScene.bigBlocksActive = true;

        // Note: Hold and next queue pieces should NOT use double size
        // They use previewCellSize which is independent of bigBlocksActive
    }

    // Deinitialize big mode and restore normal rendering
    deinitializeBigMode(gameScene) {
        if (!gameScene) return;

        gameScene.bigModeActive = false;
        gameScene.bigBlocksActive = false;
    }

    // Check if big mode is active
    isBigModeActive(gameScene) {
        return gameScene && (gameScene.bigModeActive || gameScene.bigBlocksActive);
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
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BigMode };
}
if (typeof window !== 'undefined') {
    window.BigMode = BigMode;
}
