// MinosaModule - Shared All Clear detector for Konoha modes

class MinosaModule {
    constructor(options = {}) {
        this.maxNodes = options.maxNodes || 40000;
        this.nodesVisited = 0;
        this.resultCache = new Map();
        this.maxCacheEntries = options.maxCacheEntries || 256;
    }

    evaluateGameScene(gameScene) {
        if (!gameScene?.board?.grid) {
            return this.createResult(MinosaModule.STATUS_IMPOSSIBLE);
        }

        const achieved = gameScene.bravoActive ||
            gameScene.lastClearType === 'bravo' ||
            (typeof gameScene.lastClearType === 'string' && gameScene.lastClearType.includes('all clear')) ||
            (gameScene.piecesPlaced > 0 && this.isEmptyGrid(gameScene.board.grid));

        if (achieved) {
            return this.createResult(MinosaModule.STATUS_ACHIEVED);
        }

        const currentType = this.normalizePieceType(gameScene.currentPiece);
        const queue = (Array.isArray(gameScene.nextPieces) ? gameScene.nextPieces : [])
            .map(piece => this.normalizePieceType(piece))
            .filter(piece => piece);
        const holdType = this.normalizePieceType(gameScene.holdPiece);

        return this.evaluate({
            grid: gameScene.board.grid,
            cols: gameScene.board.cols,
            rows: gameScene.board.rows,
            rotationSystem: gameScene.rotationSystem || 'SRS',
            currentType,
            queue,
            holdType,
            canHold: gameScene.canHold !== false,
        });
    }

    evaluate(options = {}) {
        const grid = this.cloneGrid(options.grid || []);
        const rows = options.rows || grid.length;
        const cols = options.cols || (grid[0] ? grid[0].length : 10);

        if (this.isEmptyGrid(grid)) {
            return this.createResult(MinosaModule.STATUS_POSSIBLE);
        }

        let activeType = this.normalizePieceType(options.currentType);
        let queue = Array.isArray(options.queue)
            ? options.queue.map(piece => this.normalizePieceType(piece)).filter(piece => piece)
            : [];

        if (!activeType && queue.length > 0) {
            activeType = queue[0];
            queue = queue.slice(1);
        }

        if (!activeType) {
            return this.createResult(MinosaModule.STATUS_IMPOSSIBLE);
        }

        const cacheKey = [
            options.rotationSystem || 'SRS',
            rows,
            cols,
            this.gridKey(grid),
            activeType,
            queue.join(''),
            this.normalizePieceType(options.holdType) || '',
            options.canHold !== false ? '1' : '0',
        ].join('|');
        const cached = this.resultCache.get(cacheKey);
        if (cached) {
            return this.createResult(cached.status, [...cached.path]);
        }

        this.nodesVisited = 0;
        const memo = new Set();
        const path = [];
        const possible = this.search({
            grid,
            rows,
            cols,
            rotationSystem: options.rotationSystem || 'SRS',
            activeType,
            queue,
            holdType: this.normalizePieceType(options.holdType),
            canHold: options.canHold !== false,
            memo,
            path,
        });

        const result = this.createResult(
            possible ? MinosaModule.STATUS_POSSIBLE : MinosaModule.STATUS_IMPOSSIBLE,
            possible ? [...path] : []
        );
        this.rememberResult(cacheKey, result);
        return result;
    }

    search(state) {
        if (this.nodesVisited++ > this.maxNodes) return false;

        const key = this.getStateKey(state);
        if (state.memo.has(key)) return false;
        state.memo.add(key);

        const candidates = this.getTurnCandidates(state);
        for (const candidate of candidates) {
            const placements = this.getPlacements(
                candidate.pieceType,
                state.rotationSystem,
                state.grid,
                state.rows,
                state.cols
            );

            for (const placement of placements) {
                const nextGrid = this.applyPlacement(state.grid, placement, state.rows, state.cols);
                const step = {
                    piece: candidate.pieceType,
                    x: placement.x,
                    y: placement.y,
                    rotation: placement.rotation,
                    usedHold: candidate.usedHold,
                    source: candidate.source,
                };
                state.path.push(step);

                if (this.isEmptyGrid(nextGrid)) {
                    return true;
                }

                let nextActiveType = candidate.nextActiveType;
                let nextQueue = candidate.queue;
                if (!nextActiveType && nextQueue.length > 0) {
                    nextActiveType = nextQueue[0];
                    nextQueue = nextQueue.slice(1);
                }

                if (nextActiveType && this.search({
                    grid: nextGrid,
                    rows: state.rows,
                    cols: state.cols,
                    rotationSystem: state.rotationSystem,
                    activeType: nextActiveType,
                    queue: nextQueue,
                    holdType: candidate.holdType,
                    canHold: true,
                    memo: state.memo,
                    path: state.path,
                })) {
                    return true;
                }

                state.path.pop();
            }
        }

        return false;
    }

    getTurnCandidates(state) {
        const candidates = [{
            pieceType: state.activeType,
            holdType: state.holdType,
            queue: state.queue,
            nextActiveType: null,
            usedHold: false,
            source: 'current',
        }];

        if (!state.canHold) return candidates;

        if (state.holdType) {
            candidates.push({
                pieceType: state.holdType,
                holdType: state.activeType,
                queue: state.queue,
                nextActiveType: null,
                usedHold: true,
                source: 'hold',
            });
        } else if (state.queue.length > 0) {
            candidates.push({
                pieceType: state.queue[0],
                holdType: state.activeType,
                queue: state.queue.slice(1),
                nextActiveType: null,
                usedHold: true,
                source: 'next',
            });
        }

        return candidates;
    }

    getPlacements(pieceType, rotationSystem, grid, rows, cols) {
        const rotations = this.getUniqueRotations(pieceType, rotationSystem);
        const placements = [];

        for (let rotation = 0; rotation < rotations.length; rotation++) {
            const shape = rotations[rotation];
            const minX = -shape[0].length + 1;
            const maxX = cols - 1;
            for (let x = minX; x <= maxX; x++) {
                let found = null;
                for (let y = -shape.length; y < rows; y++) {
                    if (this.isValidPlacement(shape, x, y, grid, rows, cols)) {
                        found = y;
                    } else if (found !== null) {
                        break;
                    }
                }
                if (found !== null && this.isFullyInsideBoard(shape, x, found, rows)) {
                    placements.push({ shape, x, y: found, rotation });
                }
            }
        }

        return placements;
    }

    getUniqueRotations(pieceType, rotationSystem) {
        const source = this.getRotationSource(rotationSystem);
        const piece = source?.[pieceType];
        if (!piece || !Array.isArray(piece.rotations)) return [];

        const seen = new Set();
        const rotations = [];
        for (const shape of piece.rotations) {
            const normalized = shape.map(row => row.map(cell => cell ? 1 : 0));
            const key = normalized.map(row => row.join('')).join('/');
            if (!seen.has(key)) {
                seen.add(key);
                rotations.push(normalized);
            }
        }
        return rotations;
    }

    getRotationSource(rotationSystem) {
        if (
            (rotationSystem === 'ARS' || rotationSystem === 'TGM' || rotationSystem === 'classic') &&
            typeof SEGA_ROTATIONS !== 'undefined'
        ) {
            return SEGA_ROTATIONS;
        }
        if (typeof TETROMINOES !== 'undefined') return TETROMINOES;
        return null;
    }

    isValidPlacement(shape, x, y, grid, rows, cols) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (!shape[r][c]) continue;
                const boardX = x + c;
                const boardY = y + r;
                if (boardX < 0 || boardX >= cols || boardY >= rows) return false;
                if (boardY >= 0 && grid[boardY]?.[boardX]) return false;
            }
        }
        return true;
    }

    isFullyInsideBoard(shape, x, y, rows) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] && y + r < 0) return false;
            }
        }
        return true;
    }

    applyPlacement(grid, placement, rows, cols) {
        const nextGrid = this.cloneGrid(grid);
        for (let r = 0; r < placement.shape.length; r++) {
            for (let c = 0; c < placement.shape[r].length; c++) {
                if (!placement.shape[r][c]) continue;
                const boardX = placement.x + c;
                const boardY = placement.y + r;
                if (boardY >= 0 && boardY < rows && boardX >= 0 && boardX < cols) {
                    nextGrid[boardY][boardX] = 1;
                }
            }
        }

        const remainingRows = nextGrid.filter(row => !row.every(cell => cell));
        while (remainingRows.length < rows) {
            remainingRows.unshift(Array(cols).fill(0));
        }
        return remainingRows;
    }

    getStateKey(state) {
        return [
            this.gridKey(state.grid),
            state.activeType || '',
            state.queue.join(''),
            state.holdType || '',
            state.canHold ? '1' : '0',
        ].join('|');
    }

    gridKey(grid) {
        return grid.map(row => row.map(cell => cell ? '1' : '0').join('')).join('/');
    }

    cloneGrid(grid) {
        return grid.map(row => row.map(cell => cell ? 1 : 0));
    }

    isEmptyGrid(grid) {
        return Array.isArray(grid) && grid.every(row => Array.isArray(row) && row.every(cell => !cell));
    }

    normalizePieceType(piece) {
        const type = typeof piece === 'string'
            ? piece
            : typeof piece?.type === 'string'
                ? piece.type
                : typeof piece?.piece === 'string'
                    ? piece.piece
                    : null;
        return typeof type === 'string' ? type.toUpperCase() : null;
    }

    createResult(status, path = []) {
        return { status, path, nodesVisited: this.nodesVisited };
    }

    rememberResult(key, result) {
        if (this.resultCache.size >= this.maxCacheEntries) {
            const firstKey = this.resultCache.keys().next().value;
            this.resultCache.delete(firstKey);
        }
        this.resultCache.set(key, { status: result.status, path: [...result.path] });
    }

    static getSharedInstance() {
        const root = typeof globalThis !== 'undefined'
            ? globalThis
            : (typeof window !== 'undefined' ? window : {});

        if (!(root.__minoFreefallMinosaModuleInstance instanceof MinosaModule)) {
            root.__minoFreefallMinosaModuleInstance = new MinosaModule();
        }
        return root.__minoFreefallMinosaModuleInstance;
    }
}

MinosaModule.STATUS_POSSIBLE = 'possible';
MinosaModule.STATUS_ACHIEVED = 'achieved';
MinosaModule.STATUS_IMPOSSIBLE = 'impossible';

function getMinosaModuleInstance() {
    return MinosaModule.getSharedInstance();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MinosaModule, getMinosaModuleInstance };
}
if (typeof window !== 'undefined') {
    window.MinosaModule = MinosaModule;
    window.getMinosaModuleInstance = getMinosaModuleInstance;
}
