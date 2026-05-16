// BigMode - Shared module for visual and logical big-piece modes
// Used by modes like Konoha and TGM3 Shirase credits roll

class BigMode {
    constructor() {
        this.bigModeActive = false;
        this.lastInitializedScene = null;
    }

    initializeBigMode(gameScene, options = {}) {
        if (!gameScene) return false;

        const visualScale = options.visualScale !== false;
        const useBoardDimensions = options.boardDimensions === true;

        this.bigModeActive = true;
        this.lastInitializedScene = gameScene;
        gameScene.bigModeActive = true;
        gameScene.bigBlocksActive = visualScale;
        gameScene.bigModeController = this;

        if (useBoardDimensions) {
            const dimensions = {
                ...this.getBoardDimensions(),
                ...(options.dimensions || {})
            };
            const alreadyUsingDimensions = gameScene.bigModeBoardActive
                && gameScene.board?.cols === dimensions.cols
                && gameScene.board?.rows === dimensions.rows
                && gameScene.visibleRows === dimensions.visibleRows;
            if (typeof gameScene.applyBigModeBoardDimensions === 'function') {
                gameScene.applyBigModeBoardDimensions(dimensions);
            } else {
                gameScene.bigModeBoardActive = true;
            }
            if (!alreadyUsingDimensions && typeof gameScene.positionPieceAtSpawn === 'function') {
                gameScene.positionPieceAtSpawn(gameScene.currentPiece);
            }
        } else {
            gameScene.bigModeBoardActive = false;
        }

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
        gameScene.bigModeBoardActive = false;
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

    getBoardDimensions() {
        return {
            cols: 5,
            rows: 12,
            visibleRows: 10
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
