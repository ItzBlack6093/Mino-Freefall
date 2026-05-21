// Minosa - Shared all-clear solver used by puzzle modes.

class Minosa {
    constructor(options = {}) {
        this.maxNodes = options.maxNodes || 2500;
        this.nodesVisited = 0;
        this.searchLimited = false;
        this.resultCache = new Map();
        this.maxCacheEntries = options.maxCacheEntries || 256;
        this.guideCache = new Map();
        this.maxGuideCacheEntries = options.maxGuideCacheEntries || 128;
    }

    evaluate(options = {}) {
        const grid = this.cloneGrid(options.grid || []);
        const rows = options.rows || grid.length;
        const cols = options.cols || (grid[0] ? grid[0].length : 10);

        if (this.isEmptyGrid(grid) && options.searchFromEmpty !== true) {
            return this.createResult(Minosa.STATUS_POSSIBLE);
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
            return this.createResult(Minosa.STATUS_IMPOSSIBLE);
        }

        const holdType = this.normalizePieceType(options.holdType);
        const availablePieces = 1 + queue.length + (holdType ? 1 : 0);
        const pieceBudget = Number.isInteger(options.pieceBudget) && options.pieceBudget > 0
            ? options.pieceBudget
            : availablePieces;
        const targetDepths = this.getTargetDepths(grid, cols, pieceBudget);
        if (!targetDepths.length) {
            return this.createResult(Minosa.STATUS_IMPOSSIBLE);
        }
        const cacheKey = [
            options.rotationSystem || 'SRS',
            rows,
            cols,
            this.gridKey(grid),
            activeType,
            queue.join(''),
            holdType || '',
            options.canHold !== false ? '1' : '0',
            pieceBudget,
        ].join('|');
        const cached = this.resultCache.get(cacheKey);
        if (cached) {
            return {
                status: cached.status,
                path: [...cached.path],
                nodesVisited: 0,
                limited: Boolean(cached.limited),
            };
        }

        this.nodesVisited = 0;
        this.searchLimited = false;
        const memo = new Set();
        const path = [];
        const possible = this.search({
            grid,
            rows,
            cols,
            rotationSystem: options.rotationSystem || 'SRS',
            activeType,
            queue,
            holdType,
            canHold: options.canHold !== false,
            memo,
            path,
            targetDepths,
            targetDepthSet: new Set(targetDepths),
            maxDepth: targetDepths[targetDepths.length - 1],
            pieceBudget,
            depth: 0,
        });

        const result = this.createResult(
            possible || this.searchLimited ? Minosa.STATUS_POSSIBLE : Minosa.STATUS_IMPOSSIBLE,
            possible ? [...path] : []
        );
        this.rememberResult(cacheKey, result);
        return result;
    }

    evaluateGuide(options = {}) {
        const grid = this.cloneGrid(options.grid || []);
        const rows = options.rows || grid.length;
        const cols = options.cols || (grid[0] ? grid[0].length : 10);
        const guideMode = this.normalizeGuideMode(options.guideMode || options.mode || options.strategy);
        const lookahead = Math.max(1, Math.min(5, Number.isInteger(options.lookahead) ? options.lookahead : 3));
        const candidateLimit = Math.max(1, Math.min(16, Number.isInteger(options.candidateLimit) ? options.candidateLimit : 8));
        let activeType = this.normalizePieceType(options.currentType);
        let queue = Array.isArray(options.queue)
            ? options.queue.map(piece => this.normalizePieceType(piece)).filter(piece => piece)
            : [];

        if (!activeType && queue.length > 0) {
            activeType = queue[0];
            queue = queue.slice(1);
        }

        if (!activeType) {
            return this.createGuideResult(guideMode, null, [], Infinity);
        }

        const holdType = this.normalizePieceType(options.holdType);
        const cacheKey = [
            guideMode,
            options.rotationSystem || 'SRS',
            rows,
            cols,
            this.gridKey(grid),
            activeType,
            queue.join(''),
            holdType || '',
            options.canHold !== false ? '1' : '0',
            lookahead,
            candidateLimit,
        ].join('|');
        const cached = this.guideCache.get(cacheKey);
        if (cached) {
            return {
                mode: cached.mode,
                hint: cached.hint ? { ...cached.hint } : null,
                path: cached.path.map(step => ({ ...step })),
                score: cached.score,
                nodesVisited: 0,
                limited: Boolean(cached.limited),
                lookahead,
            };
        }

        this.nodesVisited = 0;
        this.searchLimited = false;
        const best = this.searchGuide({
            grid,
            rows,
            cols,
            rotationSystem: options.rotationSystem || 'SRS',
            activeType,
            queue,
            holdType,
            canHold: options.canHold !== false,
            guideMode,
            lookahead,
            candidateLimit,
            depth: 0,
        });

        const result = this.createGuideResult(
            guideMode,
            best?.path?.[0] || null,
            best?.path || [],
            Number.isFinite(best?.score) ? best.score : Infinity,
            lookahead
        );
        this.rememberGuideResult(cacheKey, result);
        return result;
    }

    evaluateGuideGameScene(gameScene, options = {}) {
        if (!gameScene?.board?.grid) {
            return this.createGuideResult(
                this.normalizeGuideMode(options.guideMode || options.mode || options.strategy),
                null,
                [],
                Infinity
            );
        }

        return this.evaluateGuide({
            grid: gameScene.board.grid,
            cols: gameScene.board.cols,
            rows: gameScene.board.rows,
            rotationSystem: gameScene.rotationSystem || options.rotationSystem || 'SRS',
            currentType: gameScene.currentPiece,
            queue: Array.isArray(gameScene.nextPieces) ? gameScene.nextPieces : [],
            holdType: gameScene.holdPiece,
            canHold: gameScene.canHold !== false,
            guideMode: options.guideMode || options.mode || options.strategy || gameScene.hintGuideMode || gameScene.gameMode?.getConfig?.().hintGuideMode,
            lookahead: options.lookahead || gameScene.hintGuideLookahead || gameScene.gameMode?.getConfig?.().hintGuideLookahead,
            candidateLimit: options.candidateLimit || gameScene.hintGuideCandidateLimit || gameScene.gameMode?.getConfig?.().hintGuideCandidateLimit,
        });
    }

    search(state) {
        if (this.nodesVisited++ > this.maxNodes) {
            this.searchLimited = true;
            return false;
        }

        if (state.depth >= state.maxDepth) return false;

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
            )
                .map(placement => ({
                    placement,
                    nextGrid: this.applyPlacement(state.grid, placement, state.rows, state.cols),
                }))
                .sort((a, b) => this.countFilledCells(a.nextGrid) - this.countFilledCells(b.nextGrid));

            for (const { placement, nextGrid } of placements) {
                const step = {
                    piece: candidate.pieceType,
                    x: placement.x,
                    y: placement.y,
                    rotation: placement.rotation,
                    usedHold: candidate.usedHold,
                    source: candidate.source,
                };
                state.path.push(step);

                const nextDepth = state.depth + 1;
                if (this.isEmptyGrid(nextGrid)) {
                    return state.targetDepthSet.has(nextDepth);
                }

                if (nextDepth >= state.maxDepth) {
                    state.path.pop();
                    continue;
                }

                let nextActiveType = candidate.nextActiveType;
                let nextQueue = candidate.queue;
                if (!nextActiveType && nextQueue.length > 0) {
                    nextActiveType = nextQueue[0];
                    nextQueue = nextQueue.slice(1);
                }

                const remainingPieces = Math.min(
                    (nextActiveType ? 1 : 0) + nextQueue.length + (candidate.holdType ? 1 : 0),
                    state.maxDepth - nextDepth
                );
                if (!this.canReachTargetDepth(state.targetDepths, nextDepth, remainingPieces)) {
                    state.path.pop();
                    continue;
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
                    targetDepths: state.targetDepths,
                    targetDepthSet: state.targetDepthSet,
                    maxDepth: state.maxDepth,
                    pieceBudget: state.pieceBudget,
                    depth: nextDepth,
                })) {
                    return true;
                }

                state.path.pop();
            }
        }

        return false;
    }

    searchGuide(state) {
        if (this.nodesVisited++ > this.maxNodes) {
            this.searchLimited = true;
            return null;
        }

        const candidates = this.getTurnCandidates(state);
        let best = null;

        for (const candidate of candidates) {
            const placements = this.getPlacements(
                candidate.pieceType,
                state.rotationSystem,
                state.grid,
                state.rows,
                state.cols
            )
                .map(placement => {
                    const placedGrid = this.placePlacement(state.grid, placement, state.rows, state.cols);
                    const nextGrid = this.clearCompletedRows(placedGrid, state.rows, state.cols);
                    const linesCleared = this.countClearedLines(state.grid, nextGrid, state.cols);
                    const immediateScore = this.scoreGuidePlacement({
                        guideMode: state.guideMode,
                        grid: state.grid,
                        nextGrid,
                        placedGrid,
                        placement,
                        pieceType: candidate.pieceType,
                        holdType: candidate.holdType,
                        queue: candidate.queue,
                        cols: state.cols,
                        rows: state.rows,
                        linesCleared,
                    });
                    return { placement, nextGrid, immediateScore };
                })
                .sort((a, b) => a.immediateScore - b.immediateScore)
                .slice(0, state.candidateLimit);

            for (const { placement, nextGrid, immediateScore } of placements) {
                const step = {
                    piece: candidate.pieceType,
                    x: placement.x,
                    y: placement.y,
                    rotation: placement.rotation,
                    usedHold: candidate.usedHold,
                    source: candidate.source,
                };

                let totalScore = immediateScore;
                let path = [step];
                let nextActiveType = candidate.nextActiveType;
                let nextQueue = candidate.queue;
                if (!nextActiveType && nextQueue.length > 0) {
                    nextActiveType = nextQueue[0];
                    nextQueue = nextQueue.slice(1);
                }

                if (state.depth + 1 < state.lookahead && nextActiveType) {
                    const future = this.searchGuide({
                        grid: nextGrid,
                        rows: state.rows,
                        cols: state.cols,
                        rotationSystem: state.rotationSystem,
                        activeType: nextActiveType,
                        queue: nextQueue,
                        holdType: candidate.holdType,
                        canHold: true,
                        guideMode: state.guideMode,
                        lookahead: state.lookahead,
                        candidateLimit: state.candidateLimit,
                        depth: state.depth + 1,
                    });
                    if (future) {
                        totalScore += future.score * 0.92;
                        path = [step, ...future.path];
                    }
                }

                if (!best || totalScore < best.score) {
                    best = { score: totalScore, path };
                }
            }
        }

        return best;
    }

    getTurnCandidates(state) {
        const currentCandidate = {
            pieceType: state.activeType,
            holdType: state.holdType,
            queue: state.queue,
            nextActiveType: null,
            usedHold: false,
            source: 'current',
        };

        if (!state.canHold) return [currentCandidate];

        const holdCandidate = state.holdType
            ? {
                pieceType: state.holdType,
                holdType: state.activeType,
                queue: state.queue,
                nextActiveType: null,
                usedHold: true,
                source: 'hold',
            }
            : state.queue.length > 0
                ? {
                    pieceType: state.queue[0],
                    holdType: state.activeType,
                    queue: state.queue.slice(1),
                    nextActiveType: null,
                    usedHold: true,
                    source: 'next',
                }
                : null;

        if (!holdCandidate) return [currentCandidate];

        // Prefer evaluating hold first on the root node so the visible Minosa hint
        // reflects held-piece opportunities instead of always defaulting to active.
        if ((state.depth || 0) === 0) {
            return [holdCandidate, currentCandidate];
        }
        return [currentCandidate, holdCandidate];
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
        return this.clearCompletedRows(this.placePlacement(grid, placement, rows, cols), rows, cols);
    }

    getStateKey(state) {
        return [
            this.gridKey(state.grid),
            state.activeType || '',
            state.queue.join(''),
            state.holdType || '',
            state.canHold ? '1' : '0',
            state.pieceBudget || 0,
            state.depth || 0,
        ].join('|');
    }

    getTargetDepths(grid, cols, availablePieces) {
        const filledCells = this.countFilledCells(grid);
        const targetDepths = [];
        for (let depth = 1; depth <= availablePieces; depth++) {
            if ((filledCells + depth * 4) % cols === 0) {
                targetDepths.push(depth);
            }
        }
        return targetDepths;
    }

    canReachTargetDepth(targetDepths, depth, remainingPieces) {
        return targetDepths.some(targetDepth => targetDepth > depth && targetDepth <= depth + remainingPieces);
    }

    countFilledCells(grid) {
        return grid.reduce(
            (total, row) => total + row.reduce((rowTotal, cell) => rowTotal + (cell ? 1 : 0), 0),
            0
        );
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

    normalizeGuideMode(mode) {
        const value = typeof mode === 'string' ? mode.toLowerCase().trim() : '';
        if (value === 'tetris' || value === 'tetris_guide') return Minosa.GUIDE_TETRIS;
        if (value === 'tspin' || value === 't-spin' || value === 't_spin' || value === 'tspin_guide') return Minosa.GUIDE_TSPIN;
        if (value === 'survival' || value === 'downstack' || value === 'survival_guide' || value === 'downstack_guide') {
            return Minosa.GUIDE_SURVIVAL;
        }
        return Minosa.GUIDE_SURVIVAL;
    }

    placePlacement(grid, placement, rows, cols) {
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
        return nextGrid;
    }

    clearCompletedRows(grid, rows, cols) {
        const remainingRows = this.cloneGrid(grid).filter(row => !row.every(cell => cell));
        while (remainingRows.length < rows) {
            remainingRows.unshift(Array(cols).fill(0));
        }
        return remainingRows;
    }

    countClearedLines(grid, nextGrid, cols) {
        return Math.max(0, Math.round((this.countFilledCells(grid) + 4 - this.countFilledCells(nextGrid)) / cols));
    }

    analyzeGrid(grid, rows, cols) {
        const heights = Array(cols).fill(0);
        let holes = 0;
        let coveredHoles = 0;
        let wellDepth = 0;
        let rowTransitions = 0;
        let columnTransitions = 0;

        for (let x = 0; x < cols; x++) {
            let seenBlock = false;
            for (let y = 0; y < rows; y++) {
                const filled = !!grid[y]?.[x];
                if (!seenBlock && filled) {
                    heights[x] = rows - y;
                }
                if (filled) {
                    seenBlock = true;
                } else if (seenBlock) {
                    holes += 1;
                    if (y > 0 && grid[y - 1]?.[x]) coveredHoles += 1;
                }
            }
        }

        let bumpiness = 0;
        for (let x = 0; x < cols - 1; x++) {
            bumpiness += Math.abs(heights[x] - heights[x + 1]);
        }

        for (let y = 0; y < rows; y++) {
            let previousFilled = true;
            for (let x = 0; x < cols; x++) {
                const filled = !!grid[y]?.[x];
                if (filled !== previousFilled) rowTransitions += 1;
                previousFilled = filled;
            }
            if (!previousFilled) rowTransitions += 1;
        }

        for (let x = 0; x < cols; x++) {
            let previousFilled = true;
            for (let y = 0; y < rows; y++) {
                const filled = !!grid[y]?.[x];
                if (filled !== previousFilled) columnTransitions += 1;
                previousFilled = filled;
            }
            if (!previousFilled) columnTransitions += 1;
        }

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (grid[y]?.[x]) continue;
                const leftFilled = x === 0 || !!grid[y]?.[x - 1];
                const rightFilled = x === cols - 1 || !!grid[y]?.[x + 1];
                if (leftFilled && rightFilled) {
                    wellDepth += 1;
                }
            }
        }

        return {
            heights,
            holes,
            coveredHoles,
            aggregateHeight: heights.reduce((sum, value) => sum + value, 0),
            maxHeight: Math.max(...heights),
            bumpiness,
            rowTransitions,
            columnTransitions,
            wellDepth,
        };
    }

    getEdgeWellDepth(heights, side = 'right') {
        if (!Array.isArray(heights) || heights.length < 2) return 0;
        if (side === 'left') {
            return Math.max(0, heights[1] - heights[0]);
        }
        return Math.max(0, heights[heights.length - 2] - heights[heights.length - 1]);
    }

    countTSLots(grid, rows, cols) {
        let slots = 0;
        for (let y = 1; y < rows - 1; y++) {
            for (let x = 1; x < cols - 1; x++) {
                if (grid[y]?.[x]) continue;
                const left = !!grid[y]?.[x - 1];
                const right = !!grid[y]?.[x + 1];
                const below = !!grid[y + 1]?.[x];
                const above = !!grid[y - 1]?.[x];
                const supportCorners =
                    (grid[y + 1]?.[x - 1] ? 1 : 0) +
                    (grid[y + 1]?.[x + 1] ? 1 : 0) +
                    (grid[y - 1]?.[x - 1] ? 1 : 0) +
                    (grid[y - 1]?.[x + 1] ? 1 : 0);
                if (left && right && below && !above && supportCorners >= 3) {
                    slots += 1;
                }
            }
        }
        return slots;
    }

    isTSpinPlacement(placedGrid, placement, pieceType, rows, cols) {
        if (pieceType !== 'T') return false;
        const pivotX = placement.x + 1;
        const pivotY = placement.y + 1;
        const corners = [
            [pivotX - 1, pivotY - 1],
            [pivotX + 1, pivotY - 1],
            [pivotX - 1, pivotY + 1],
            [pivotX + 1, pivotY + 1],
        ];
        let blockedCorners = 0;
        for (const [x, y] of corners) {
            if (x < 0 || x >= cols || y < 0 || y >= rows || placedGrid[y]?.[x]) {
                blockedCorners += 1;
            }
        }
        return blockedCorners >= 3;
    }

    scoreGuidePlacement(context) {
        const previousMetrics = this.analyzeGrid(context.grid, context.rows, context.cols);
        const nextMetrics = this.analyzeGrid(context.nextGrid, context.rows, context.cols);
        const holeReduction = previousMetrics.holes - nextMetrics.holes;
        const tSlotDelta = this.countTSLots(context.nextGrid, context.rows, context.cols) - this.countTSLots(context.grid, context.rows, context.cols);
        const rightWellDepth = this.getEdgeWellDepth(nextMetrics.heights, 'right');
        const leftWellDepth = this.getEdgeWellDepth(nextMetrics.heights, 'left');
        const edgeWellDepth = Math.max(rightWellDepth, leftWellDepth);
        const holdIReady = context.holdType === 'I' || context.queue[0] === 'I';
        const holdTReady = context.holdType === 'T' || context.queue[0] === 'T';
        const isTSpin = this.isTSpinPlacement(context.placedGrid, context.placement, context.pieceType, context.rows, context.cols);

        if (context.guideMode === Minosa.GUIDE_TETRIS) {
            let score =
                nextMetrics.holes * 1800 +
                nextMetrics.coveredHoles * 1200 +
                nextMetrics.bumpiness * 8 +
                nextMetrics.aggregateHeight * 3 +
                nextMetrics.maxHeight * 18 +
                nextMetrics.rowTransitions * 2 +
                nextMetrics.columnTransitions * 2;
            score -= context.linesCleared * 120;
            score -= holeReduction * 240;
            score -= Math.min(edgeWellDepth, 4) * 180;
            if (context.linesCleared === 4 && context.pieceType === 'I') score -= 12000;
            if (context.pieceType === 'I' && context.linesCleared > 0 && context.linesCleared < 4) score += 900;
            if (context.pieceType !== 'I' && context.linesCleared > 0 && edgeWellDepth < 3) score += 300;
            if (holdIReady) score -= 120;
            return score;
        }

        if (context.guideMode === Minosa.GUIDE_TSPIN) {
            let score =
                nextMetrics.holes * 1300 +
                nextMetrics.coveredHoles * 950 +
                nextMetrics.bumpiness * 7 +
                nextMetrics.aggregateHeight * 3 +
                nextMetrics.maxHeight * 14 +
                nextMetrics.rowTransitions * 2 +
                nextMetrics.columnTransitions * 2;
            score -= holeReduction * 180;
            score -= tSlotDelta * 480;
            score -= context.linesCleared * 80;
            if (isTSpin) {
                score -= 9000 + context.linesCleared * 1400;
            } else if (context.pieceType === 'T') {
                score += 450;
            }
            if (holdTReady) score -= 180;
            return score;
        }

        return (
            nextMetrics.holes * 2000 +
            nextMetrics.coveredHoles * 1400 +
            nextMetrics.bumpiness * 10 +
            nextMetrics.aggregateHeight * 4 +
            nextMetrics.maxHeight * 24 +
            nextMetrics.rowTransitions * 3 +
            nextMetrics.columnTransitions * 3 +
            nextMetrics.wellDepth * 18 -
            context.linesCleared * 240 -
            holeReduction * 320
        );
    }

    createGuideResult(mode, hint = null, path = [], score = Infinity, lookahead = null) {
        return {
            mode: this.normalizeGuideMode(mode),
            hint: hint ? { ...hint } : null,
            path: Array.isArray(path) ? path.map(step => ({ ...step })) : [],
            score,
            nodesVisited: this.nodesVisited,
            limited: this.searchLimited,
            lookahead,
        };
    }

    createResult(status, path = []) {
        return { status, path, nodesVisited: this.nodesVisited, limited: this.searchLimited };
    }

    rememberResult(key, result) {
        if (!(this.resultCache instanceof Map)) {
            this.resultCache = new Map();
        }
        if (this.resultCache.size >= this.maxCacheEntries) {
            const firstKey = this.resultCache.keys().next().value;
            this.resultCache.delete(firstKey);
        }
        this.resultCache.set(key, { status: result.status, path: [...result.path], limited: Boolean(result.limited) });
    }

    rememberGuideResult(key, result) {
        if (!(this.guideCache instanceof Map)) {
            this.guideCache = new Map();
        }
        if (this.guideCache.size >= this.maxGuideCacheEntries) {
            const firstKey = this.guideCache.keys().next().value;
            this.guideCache.delete(firstKey);
        }
        this.guideCache.set(key, {
            mode: result.mode,
            hint: result.hint ? { ...result.hint } : null,
            path: Array.isArray(result.path) ? result.path.map(step => ({ ...step })) : [],
            score: result.score,
            limited: Boolean(result.limited),
        });
    }

    static getSharedInstance() {
        const root = typeof globalThis !== 'undefined'
            ? globalThis
            : (typeof window !== 'undefined' ? window : {});

        if (!(root.__minoFreefallMinosaInstance instanceof Minosa)) {
            root.__minoFreefallMinosaInstance = new Minosa();
        }
        return root.__minoFreefallMinosaInstance;
    }
}

Minosa.STATUS_POSSIBLE = 'possible';
Minosa.STATUS_ACHIEVED = 'achieved';
Minosa.STATUS_IMPOSSIBLE = 'impossible';
Minosa.GUIDE_TETRIS = 'tetris';
Minosa.GUIDE_TSPIN = 'tspin';
Minosa.GUIDE_SURVIVAL = 'survival';
Minosa.GUIDE_MODES = [Minosa.GUIDE_TETRIS, Minosa.GUIDE_TSPIN, Minosa.GUIDE_SURVIVAL];

function getMinosaInstance() {
    return Minosa.getSharedInstance();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Minosa, getMinosaInstance };
}
if (typeof window !== 'undefined') {
    window.Minosa = Minosa;
    window.getMinosaInstance = getMinosaInstance;
}
