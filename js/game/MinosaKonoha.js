// MinosaKonoha - Konoha-specific scene adapter around the shared Minosa solver.

const MinosaBase = typeof Minosa !== 'undefined'
    ? Minosa
    : (
        typeof module !== 'undefined' &&
        module.exports &&
        typeof require === 'function'
            ? require('./Minosa').Minosa
            : null
    );

if (!MinosaBase) {
    throw new Error('MinosaKonoha requires Minosa to be loaded first.');
}

class MinosaKonoha extends MinosaBase {
    evaluateGameScene(gameScene) {
        const variant = this.getVariant(gameScene);
        const pieceBudget = this.getPieceBudget(variant);
        const boardRows = gameScene?.board?.rows || (Array.isArray(gameScene?.board?.grid) ? gameScene.board.grid.length : 0);
        const pieceWindow = this.getPieceWindow(gameScene, pieceBudget);

        if (!gameScene?.board?.grid) {
            return this.decorateResult(this.createResult(MinosaBase.STATUS_IMPOSSIBLE), {
                variant,
                pieceBudget,
                targetRows: variant === 'easy' ? 4 : boardRows,
                targetStartRow: variant === 'easy' ? Math.max(0, boardRows - 4) : 0,
            });
        }

        if (this.hasAchievedAllClear(gameScene) && !this.canProjectNextAllClear(pieceWindow)) {
            return this.decorateResult(this.createResult(MinosaBase.STATUS_ACHIEVED), {
                variant,
                pieceBudget,
                targetRows: variant === 'easy' ? 4 : boardRows,
                targetStartRow: variant === 'easy' ? Math.max(0, boardRows - 4) : 0,
            });
        }

        const solveWindow = variant === 'easy'
            ? this.getEasySolveWindow(gameScene)
            : this.getStandardSolveWindow(gameScene);

        if (!solveWindow) {
            return this.decorateResult(this.createResult(MinosaBase.STATUS_IMPOSSIBLE), {
                variant,
                pieceBudget,
                targetRows: variant === 'easy' ? 4 : boardRows,
                targetStartRow: variant === 'easy' ? Math.max(0, boardRows - 4) : 0,
            });
        }

        const result = this.evaluate({
            grid: solveWindow.grid,
            cols: solveWindow.cols,
            rows: solveWindow.rows,
            rotationSystem: gameScene.rotationSystem || 'SRS',
            currentType: pieceWindow.currentType,
            queue: pieceWindow.queue,
            holdType: pieceWindow.holdType,
            canHold: pieceWindow.canHold,
            pieceBudget,
            searchFromEmpty: variant === 'easy' || this.isEmptyGrid(solveWindow.grid),
        });

        return this.decorateResult(result, {
            variant,
            pieceBudget,
            targetRows: solveWindow.targetRows,
            targetStartRow: solveWindow.rowOffset,
            rowOffset: solveWindow.rowOffset,
        });
    }

    getVariant(gameScene) {
        const modeVariant = typeof gameScene?.gameMode?.variant === 'string'
            ? gameScene.gameMode.variant.toLowerCase()
            : '';
        if (modeVariant === 'easy' || modeVariant === 'hard') {
            return modeVariant;
        }
        const modeId = typeof gameScene?.gameMode?.getModeId === 'function'
            ? gameScene.gameMode.getModeId()
            : gameScene?.selectedMode;
        return typeof modeId === 'string' && modeId.toLowerCase().includes('easy') ? 'easy' : 'hard';
    }

    getPieceBudget(variant) {
        return variant === 'easy' ? 5 : 7;
    }

    hasAchievedAllClear(gameScene) {
        return Boolean(gameScene?.piecesPlaced > 0 && this.isEmptyGrid(gameScene?.board?.grid));
    }

    canProjectNextAllClear(pieceWindow) {
        return Boolean(pieceWindow?.currentType || (Array.isArray(pieceWindow?.queue) && pieceWindow.queue.length > 0));
    }

    getPieceWindow(gameScene, pieceBudget) {
        const queue = (Array.isArray(gameScene.nextPieces) ? gameScene.nextPieces : [])
            .map(piece => this.normalizePieceType(piece))
            .filter(piece => piece)
            .slice(0, pieceBudget);
        return {
            currentType: this.normalizePieceType(gameScene.currentPiece),
            queue,
            holdType: this.normalizePieceType(gameScene.holdPiece),
            canHold: gameScene.canHold !== false,
        };
    }

    getStandardSolveWindow(gameScene) {
        const grid = this.cloneGrid(gameScene.board.grid || []);
        return {
            grid,
            cols: gameScene.board.cols,
            rows: gameScene.board.rows,
            targetRows: gameScene.board.rows,
            rowOffset: 0,
        };
    }

    getEasySolveWindow(gameScene) {
        const grid = this.cloneGrid(gameScene.board.grid || []);
        const rows = gameScene?.board?.rows || grid.length;
        const cols = gameScene?.board?.cols || (grid[0] ? grid[0].length : 0);
        if (cols !== 5 || rows < 4) return null;
        const rowOffset = rows - 4;
        for (let row = 0; row < rowOffset; row++) {
            if (Array.isArray(grid[row]) && grid[row].some(cell => cell)) {
                return null;
            }
        }
        return {
            grid: grid.slice(rowOffset, rows),
            cols,
            rows: 4,
            targetRows: 4,
            rowOffset,
        };
    }

    decorateResult(result, options = {}) {
        const rowOffset = options.rowOffset || 0;
        const path = Array.isArray(result?.path) ? result.path : [];
        return {
            status: result?.status || MinosaBase.STATUS_IMPOSSIBLE,
            path: rowOffset
                ? path.map(step => ({ ...step, y: step.y + rowOffset }))
                : path.map(step => ({ ...step })),
            nodesVisited: Number.isFinite(result?.nodesVisited) ? result.nodesVisited : 0,
            limited: Boolean(result?.limited),
            pieceBudget: options.pieceBudget || 0,
            targetRows: options.targetRows || null,
            targetStartRow: options.targetStartRow || 0,
            variant: options.variant || 'hard',
        };
    }

    static getSharedInstance() {
        const root = typeof globalThis !== 'undefined'
            ? globalThis
            : (typeof window !== 'undefined' ? window : {});

        if (!(root.__minoFreefallMinosaKonohaInstance instanceof MinosaKonoha)) {
            root.__minoFreefallMinosaKonohaInstance = new MinosaKonoha();
        }
        return root.__minoFreefallMinosaKonohaInstance;
    }
}

function getMinosaKonohaInstance() {
    return MinosaKonoha.getSharedInstance();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MinosaKonoha,
        getMinosaKonohaInstance,
    };
}
if (typeof window !== 'undefined') {
    window.MinosaKonoha = MinosaKonoha;
    window.getMinosaKonohaInstance = getMinosaKonohaInstance;
}
