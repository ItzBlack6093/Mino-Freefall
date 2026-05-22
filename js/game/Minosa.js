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
        const targetDepths = this.resolveTargetDepths(grid, cols, pieceBudget, options.targetDepths);
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
            targetDepths.join(','),
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
        const grid = Array.isArray(options.grid) ? options.grid : [];
        const rows = options.rows || grid.length;
        const cols = options.cols || (grid[0] ? grid[0].length : 10);
        const guideMode = this.normalizeGuideMode(options.guideMode || options.mode || options.strategy);
        const lookahead = Math.max(1, Math.min(7, Number.isInteger(options.lookahead) ? options.lookahead : 3));
        const candidateLimit = Math.max(1, Math.min(28, Number.isInteger(options.candidateLimit) ? options.candidateLimit : 8));
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
            options.behavior?.styleBand || '',
            options.openerPlan?.id || '',
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
            memo: new Map(),
            filledCells: this.countFilledCells(grid),
            metrics: this.analyzeGrid(grid, rows, cols),
            behavior: options.behavior || null,
            openerPlan: options.openerPlan || null,
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

    evaluateVersusTurn(options = {}) {
        const grid = Array.isArray(options.grid) ? options.grid : [];
        const rows = options.rows || grid.length;
        const cols = options.cols || (grid[0] ? grid[0].length : 10);
        const rotationSystem = options.rotationSystem || 'SRS';
        const currentType = this.normalizePieceType(options.currentType);
        const queue = Array.isArray(options.queue)
            ? options.queue.map(piece => this.normalizePieceType(piece)).filter(piece => piece)
            : [];
        const holdType = this.normalizePieceType(options.holdType);
        const canHold = options.canHold !== false;
        const profile = options.profile || {};
        const mistakeChanceRaw = Number(options.mistakeChance ?? profile.mistakeChance);
        const mistakeChance = Number.isFinite(mistakeChanceRaw)
            ? Math.max(0, Math.min(1, mistakeChanceRaw))
            : 0;
        const behavior = this.getVersusBehaviorProfile({
            ...options,
            rows,
            cols,
            profile,
            mistakeChance,
        });
        const openerPlan = this.selectVersusOpenerPlan({
            ...options,
            grid,
            rows,
            cols,
            currentType,
            queue,
            holdType,
            profile,
            behavior,
        });

        if (!currentType) return null;

        const unstableMove = Math.random() < mistakeChance;
        const lookaheadBase = Number.isInteger(options.lookahead)
            ? options.lookahead
            : (Number.isInteger(profile.lookahead) ? profile.lookahead : 3);
        const candidateLimitBase = Number.isInteger(options.candidateLimit)
            ? options.candidateLimit
            : (Number.isInteger(profile.candidateLimit) ? profile.candidateLimit : 8);
        const guideMode = this.selectVersusGuideMode({
            grid,
            rows,
            cols,
            matchRating: options.matchRating,
            queueType: options.queueType,
            profile,
            behavior,
            openerPlan,
            pieceCount: options.pieceCount,
        });
        const guide = this.evaluateGuide({
            grid,
            rows,
            cols,
            rotationSystem,
            currentType,
            queue,
            holdType,
            canHold,
            guideMode,
            lookahead: Math.max(1, lookaheadBase - (unstableMove ? 1 : 0)),
            candidateLimit: Math.max(3, candidateLimitBase - (unstableMove ? 3 : 0)),
            behavior,
            openerPlan,
        });

        if (!unstableMove && guide?.hint) {
            const placement = this.findPlacementForVersusStep({
                step: guide.hint,
                grid,
                rows,
                cols,
                rotationSystem,
            });
            if (placement) {
                return { step: guide.hint, placement, guideMode, unstableMove: false };
            }
        }

        const fallback = this.chooseVersusFallbackTurn({
            grid,
            rows,
            cols,
            rotationSystem,
            currentType,
            queue,
            holdType,
            canHold,
            preferredStep: guide?.hint || null,
            mistakeChance,
            behavior,
            openerPlan,
        });
        if (!fallback) return null;
        return { ...fallback, guideMode, unstableMove };
    }

    getVersusBehaviorProfile(options = {}) {
        const skill = Math.max(0, Math.min(1, Number(options.profile?.skill) || 0));
        const matchRating = Math.max(0, Number(options.matchRating) || 0);
        const pieceCount = Math.max(0, Number(options.pieceCount) || 0);
        const aggressionMultiplier = Math.max(1, Number(options.profile?.aggressionMultiplier) || 1);
        const styleBand = typeof options.profile?.styleBand === 'string'
            ? options.profile.styleBand
            : skill < 0.2
                ? 'cheese'
                : skill < 0.5
                    ? 'cleanup'
                    : skill < 0.78
                        ? 'opener'
                        : 'spike';
        const openerSkillGate = styleBand === 'spike' ? 0.75 : 0.52;

        return {
            skill,
            matchRating,
            pieceCount,
            styleBand,
            favorsMess: styleBand === 'cheese',
            cleanupBias: styleBand === 'cleanup' ? 0.8 : styleBand === 'opener' ? 1.05 : 1.2,
            dependencyBias: styleBand === 'cleanup' ? 1 : styleBand === 'opener' ? 0.7 : 0.35,
            aggressionMultiplier,
            openerBias: (skill >= openerSkillGate ? 0.85 + skill * 0.75 : 0) * aggressionMultiplier,
            tspinBias: (
                styleBand === 'spike' ? 1.4 + skill * 0.8 : styleBand === 'opener' ? 0.6 + skill * 0.35 : 0.15
            ) * aggressionMultiplier,
            spikeBias: (
                styleBand === 'spike' ? 1.35 + skill * 0.8 : styleBand === 'opener' ? 0.55 + skill * 0.4 : 0.1
            ) * aggressionMultiplier,
            stackCleanBias: styleBand === 'cheese' ? 0.45 : styleBand === 'cleanup' ? 1.05 : 1.3,
            prefersSinglesAndDoubles: styleBand === 'cheese',
            allowsOpeners: skill >= openerSkillGate && options.queueType !== 'tgm' && pieceCount <= 7,
            maxOpenerPieces: styleBand === 'spike' ? 8 : 6,
        };
    }

    selectVersusOpenerPlan(options = {}) {
        const behavior = options.behavior || this.getVersusBehaviorProfile(options);
        if (!behavior.allowsOpeners) return null;
        const grid = Array.isArray(options.grid) ? options.grid : [];
        const rows = options.rows || grid.length;
        const cols = options.cols || (grid[0] ? grid[0].length : 10);
        if (!this.isBoardPracticallyEmpty(grid, rows, cols, Math.max(10, behavior.maxOpenerPieces * 4))) return null;
        const openerBook = this.getVersusOpenerBook(options.queueType);
        if (!openerBook.length) return null;
        const signature = [
            options.currentType || '',
            Array.isArray(options.queue) ? options.queue.join('') : '',
            options.holdType || '',
            behavior.styleBand,
            Math.round(behavior.skill * 100),
        ].join('|');
        return openerBook[this.hashString(signature) % openerBook.length];
    }

    getVersusOpenerBook(queueType = 'guideline') {
        if (queueType === 'tgm') return [];
        return [
            {
                id: 'tetris_well_right',
                guideMode: Minosa.GUIDE_TETRIS,
                wellSide: 'right',
                targetWellDepth: 4,
                encourageTSlots: 0.15,
                rewardFlatStack: 1.15,
                discourageEarlyClears: 0.45,
            },
            {
                id: 'tetris_well_left',
                guideMode: Minosa.GUIDE_TETRIS,
                wellSide: 'left',
                targetWellDepth: 4,
                encourageTSlots: 0.15,
                rewardFlatStack: 1.05,
                discourageEarlyClears: 0.45,
            },
            {
                id: 'tki_probe',
                guideMode: Minosa.GUIDE_TSPIN,
                preferredSide: 'left',
                targetWellDepth: 2,
                encourageTSlots: 1.25,
                rewardFlatStack: 0.8,
                discourageEarlyClears: 0.7,
            },
            {
                id: 'dt_probe',
                guideMode: Minosa.GUIDE_TSPIN,
                preferredSide: 'right',
                targetWellDepth: 2,
                encourageTSlots: 1.4,
                rewardFlatStack: 0.72,
                discourageEarlyClears: 0.75,
            },
        ];
    }

    isBoardPracticallyEmpty(grid, rows, cols, maxFilledCells = 10) {
        if (!Array.isArray(grid)) return true;
        const filledCells = this.countFilledCells(grid);
        if (filledCells > maxFilledCells) return false;
        const metrics = this.analyzeGrid(grid, rows, cols);
        return metrics.holes === 0 && metrics.maxHeight <= 4;
    }

    hashString(value = '') {
        const text = String(value);
        let hash = 2166136261;
        for (let index = 0; index < text.length; index += 1) {
            hash ^= text.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    selectVersusGuideMode(options = {}) {
        const grid = options.grid || [];
        const rows = options.rows || grid.length;
        const cols = options.cols || (grid[0] ? grid[0].length : 10);
        const matchRating = Number(options.matchRating) || 0;
        const queueType = options.queueType === 'tgm' ? 'tgm' : 'guideline';
        const profileSkill = Number(options.profile?.skill) || 0;
        const behavior = options.behavior || this.getVersusBehaviorProfile(options);
        const openerPlan = options.openerPlan || null;

        if (typeof this.analyzeGrid !== 'function') {
            return Minosa.GUIDE_SURVIVAL;
        }

        const metrics = this.analyzeGrid(grid, rows, cols);
        const stackDanger = metrics.maxHeight >= (queueType === 'tgm' ? 14 : 13);
        if (openerPlan?.guideMode && behavior.allowsOpeners) {
            return openerPlan.guideMode;
        }
        if (behavior.styleBand === 'cheese') {
            return stackDanger || metrics.holes > 1 ? Minosa.GUIDE_SURVIVAL : Minosa.GUIDE_TETRIS;
        }
        if (behavior.styleBand === 'cleanup') {
            if (metrics.holes > 0 || stackDanger) return Minosa.GUIDE_SURVIVAL;
            return profileSkill >= 0.3 ? Minosa.GUIDE_TETRIS : Minosa.GUIDE_SURVIVAL;
        }
        if (matchRating >= 32) {
            return Minosa.GUIDE_VERSUS;
        }
        if (metrics.holes > 0 || stackDanger) {
            return Minosa.GUIDE_SURVIVAL;
        }
        if (profileSkill >= 0.55) {
            return Minosa.GUIDE_TETRIS;
        }
        return Minosa.GUIDE_SURVIVAL;
    }

    chooseVersusFallbackTurn(options = {}) {
        const grid = Array.isArray(options.grid) ? options.grid : [];
        const rows = options.rows || grid.length;
        const cols = options.cols || (grid[0] ? grid[0].length : 10);
        const rotationSystem = options.rotationSystem || 'SRS';
        const currentType = this.normalizePieceType(options.currentType);
        const queue = Array.isArray(options.queue)
            ? options.queue.map(piece => this.normalizePieceType(piece)).filter(piece => piece)
            : [];
        const holdType = this.normalizePieceType(options.holdType);
        const canHold = options.canHold !== false;
        const mistakeChanceRaw = Number(options.mistakeChance);
        const mistakeChance = Number.isFinite(mistakeChanceRaw)
            ? Math.max(0, Math.min(1, mistakeChanceRaw))
            : 0;
        const behavior = options.behavior || this.getVersusBehaviorProfile(options);
        const openerPlan = options.openerPlan || null;
        const candidates = [];

        const currentPlacements = currentType
            ? this.getPlacements(currentType, rotationSystem, grid, rows, cols)
            : [];
        if (currentPlacements.length > 0) {
            candidates.push({
                source: 'current',
                pieceType: currentType,
                usedHold: false,
                placements: currentPlacements,
            });
        }

        if (canHold) {
            const holdPieceType = holdType || queue[0] || null;
            const holdPlacements = holdPieceType
                ? this.getPlacements(holdPieceType, rotationSystem, grid, rows, cols)
                : [];
            if (holdPieceType && holdPlacements.length > 0) {
                candidates.push({
                    source: holdType ? 'hold' : 'next',
                    pieceType: holdPieceType,
                    usedHold: true,
                    placements: holdPlacements,
                });
            }
        }

        if (options.preferredStep) {
            const preferredPlacement = this.findPlacementForVersusStep({
                step: options.preferredStep,
                grid,
                rows,
                cols,
                rotationSystem,
            });
            if (preferredPlacement) {
                return { step: options.preferredStep, placement: preferredPlacement };
            }
        }

        const candidate = candidates[0];
        if (!candidate) return null;

        const filledCells = this.countFilledCells(grid);
        const scoredPlacements = candidate.placements
            .map(placement => {
                const simulation = this.simulatePlacement(grid, placement, rows, cols, filledCells);
                const metrics = this.analyzeGrid(simulation.nextGrid, rows, cols);
                let score =
                    metrics.holes * 100 * behavior.stackCleanBias +
                    metrics.maxHeight * (behavior.favorsMess ? 5 : 8) +
                    metrics.bumpiness * (behavior.favorsMess ? 2 : 3) +
                    metrics.aggregateHeight;
                if (behavior.prefersSinglesAndDoubles) {
                    if (simulation.linesCleared === 1) score -= 18;
                    if (simulation.linesCleared === 2) score -= 28;
                    if (simulation.linesCleared >= 3) score += 35;
                }
                score -= this.scoreOpenerStructureBonus({
                    openerPlan,
                    previousGrid: grid,
                    nextGrid: simulation.nextGrid,
                    rows,
                    cols,
                    linesCleared: simulation.linesCleared,
                });
                return { placement, score };
            })
            .sort((a, b) => a.score - b.score);

        const ceiling = Math.max(1, Math.ceil(scoredPlacements.length * (0.25 + mistakeChance)));
        const picked = scoredPlacements[Math.floor(Math.random() * ceiling)] || scoredPlacements[0];
        if (!picked?.placement) return null;

        return {
            step: {
                piece: candidate.pieceType,
                x: picked.placement.x,
                y: picked.placement.y,
                rotation: picked.placement.rotation,
                usedHold: candidate.usedHold,
                source: candidate.source,
            },
            placement: picked.placement,
        };
    }

    findPlacementForVersusStep(options = {}) {
        const step = options.step;
        if (!step?.piece) return null;
        const pieceType = this.normalizePieceType(step.piece);
        const rotations = this.getUniqueRotations(pieceType, options.rotationSystem || 'SRS');
        const shape = rotations[step.rotation];
        if (!shape) return null;
        const placement = {
            shape,
            x: step.x,
            y: step.y,
            rotation: step.rotation,
        };
        const grid = Array.isArray(options.grid) ? options.grid : [];
        const rows = options.rows || 22;
        const cols = options.cols || 10;
        if (!this.isFullyInsideBoard(shape, placement.x, placement.y, rows)) return null;
        return this.isValidPlacement(shape, placement.x, placement.y, grid, rows, cols)
            ? placement
            : null;
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

        const memoKey = this.getGuideStateKey(state);
        if (state.memo instanceof Map && state.memo.has(memoKey)) {
            return this.cloneGuideSearchResult(state.memo.get(memoKey));
        }

        const stateMetrics = state.metrics || this.analyzeGrid(state.grid, state.rows, state.cols);
        const needsTSlots =
            state.guideMode === Minosa.GUIDE_TSPIN ||
            state.guideMode === Minosa.GUIDE_VERSUS;
        const needsTSpinCheck = needsTSlots;
        const stateTSlots = needsTSlots
            ? (Number.isInteger(state.tSlots)
                ? state.tSlots
                : this.countTSLots(state.grid, state.rows, state.cols))
            : 0;
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
                    const simulation = this.simulatePlacement(
                        state.grid,
                        placement,
                        state.rows,
                        state.cols,
                        state.filledCells
                    );
                    const nextMetrics = this.analyzeGrid(simulation.nextGrid, state.rows, state.cols);
                    const nextTSlots = needsTSlots
                        ? this.countTSLots(simulation.nextGrid, state.rows, state.cols)
                        : 0;
                    const immediateScore = this.scoreGuidePlacement({
                        guideMode: state.guideMode,
                        grid: state.grid,
                        nextGrid: simulation.nextGrid,
                        placedGrid: simulation.placedGrid,
                        placement,
                        pieceType: candidate.pieceType,
                        holdType: candidate.holdType,
                        queue: candidate.queue,
                        cols: state.cols,
                        rows: state.rows,
                        linesCleared: simulation.linesCleared,
                        previousMetrics: stateMetrics,
                        nextMetrics,
                        previousTSlots: stateTSlots,
                        nextTSlots,
                        filledCells: simulation.filledCells,
                        behavior: state.behavior,
                        openerPlan: state.openerPlan,
                        isTSpin: needsTSpinCheck && candidate.pieceType === 'T'
                            ? this.isTSpinPlacement(
                                simulation.placedGrid,
                                placement,
                                candidate.pieceType,
                                state.rows,
                                state.cols
                            )
                            : false,
                    });
                    return {
                        placement,
                        nextGrid: simulation.nextGrid,
                        immediateScore,
                        filledCells: simulation.filledCells,
                        nextMetrics,
                        nextTSlots,
                    };
                })
                .sort((a, b) => a.immediateScore - b.immediateScore)
                .slice(0, state.candidateLimit);

            for (const { placement, nextGrid, immediateScore, filledCells, nextMetrics, nextTSlots } of placements) {
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
                        memo: state.memo,
                        filledCells,
                        metrics: nextMetrics,
                        tSlots: nextTSlots,
                        behavior: state.behavior,
                        openerPlan: state.openerPlan,
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

        if (state.memo instanceof Map) {
            state.memo.set(memoKey, this.cloneGuideSearchResult(best));
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

    simulatePlacement(grid, placement, rows, cols, baseFilledCells = null) {
        const placedGrid = this.placePlacement(grid, placement, rows, cols);
        const nextGrid = [];
        let linesCleared = 0;

        for (const row of placedGrid) {
            if (row.every(cell => cell)) {
                linesCleared += 1;
            } else {
                nextGrid.push(row);
            }
        }

        while (nextGrid.length < rows) {
            nextGrid.unshift(Array(cols).fill(0));
        }

        const filledBefore = Number.isInteger(baseFilledCells)
            ? baseFilledCells
            : this.countFilledCells(grid);
        const filledCells = Math.max(
            0,
            filledBefore + this.countShapeCells(placement.shape) - linesCleared * cols
        );

        return {
            placedGrid,
            nextGrid,
            linesCleared,
            filledCells,
        };
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

    getGuideStateKey(state) {
        return [
            this.gridKey(state.grid),
            state.activeType || '',
            state.queue.join(''),
            state.holdType || '',
            state.canHold ? '1' : '0',
            state.guideMode || '',
            state.lookahead || 0,
            state.candidateLimit || 0,
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

    resolveTargetDepths(grid, cols, availablePieces, explicitTargetDepths) {
        if (!Array.isArray(explicitTargetDepths)) {
            return this.getTargetDepths(grid, cols, availablePieces);
        }

        const normalizedDepths = [...new Set(
            explicitTargetDepths.filter(depth =>
                Number.isInteger(depth) && depth > 0 && depth <= availablePieces
            )
        )].sort((a, b) => a - b);

        return normalizedDepths;
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

    countShapeCells(shape) {
        return Array.isArray(shape)
            ? shape.reduce(
                (total, row) => total + row.reduce((rowTotal, cell) => rowTotal + (cell ? 1 : 0), 0),
                0
            )
            : 0;
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
        if (value === 'versus' || value === 'attack' || value === 'hybrid' || value === 'burst') {
            return Minosa.GUIDE_VERSUS;
        }
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
        const remainingRows = grid.filter(row => !row.every(cell => cell));
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

    scoreAllClearSetup(metrics, filledCells) {
        if (metrics.holes > 0 || metrics.coveredHoles > 0 || metrics.maxHeight > 5 || filledCells > 20) {
            return 0;
        }

        let bonus = 1200;
        bonus += Math.max(0, 20 - filledCells) * 120;
        bonus += Math.max(0, 5 - metrics.maxHeight) * 180;
        bonus += Math.max(0, 10 - metrics.bumpiness) * 40;
        bonus += Math.max(0, 12 - metrics.rowTransitions) * 25;
        if (filledCells % 4 === 0) bonus += 800;
        if (filledCells <= 12) bonus += 1400;
        return bonus;
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
        const previousMetrics = context.previousMetrics || this.analyzeGrid(context.grid, context.rows, context.cols);
        const nextMetrics = context.nextMetrics || this.analyzeGrid(context.nextGrid, context.rows, context.cols);
        const holeReduction = previousMetrics.holes - nextMetrics.holes;
        const rightWellDepth = this.getEdgeWellDepth(nextMetrics.heights, 'right');
        const leftWellDepth = this.getEdgeWellDepth(nextMetrics.heights, 'left');
        const edgeWellDepth = Math.max(rightWellDepth, leftWellDepth);
        const holdIReady = context.holdType === 'I' || context.queue[0] === 'I';
        const holdTReady = context.holdType === 'T' || context.queue[0] === 'T';
        const behavior = context.behavior || null;
        const openerBonus = this.scoreOpenerStructureBonus({
            openerPlan: context.openerPlan,
            previousGrid: context.grid,
            nextGrid: context.nextGrid,
            rows: context.rows,
            cols: context.cols,
            linesCleared: context.linesCleared,
            nextMetrics,
            previousMetrics,
            rightWellDepth,
            leftWellDepth,
            tSlotDelta: Number.isInteger(context.nextTSlots) && Number.isInteger(context.previousTSlots)
                ? context.nextTSlots - context.previousTSlots
                : 0,
        });

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
            score -= openerBonus;
            if (behavior?.prefersSinglesAndDoubles) {
                if (context.linesCleared === 1) score -= 180;
                if (context.linesCleared === 2) score -= 220;
                if (context.linesCleared >= 3) score += 420;
            }
            return score;
        }

        if (context.guideMode === Minosa.GUIDE_TSPIN) {
            const previousTSlots = Number.isInteger(context.previousTSlots)
                ? context.previousTSlots
                : this.countTSLots(context.grid, context.rows, context.cols);
            const nextTSlots = Number.isInteger(context.nextTSlots)
                ? context.nextTSlots
                : this.countTSLots(context.nextGrid, context.rows, context.cols);
            const tSlotDelta = nextTSlots - previousTSlots;
            const isTSpin = typeof context.isTSpin === 'boolean'
                ? context.isTSpin
                : this.isTSpinPlacement(context.placedGrid, context.placement, context.pieceType, context.rows, context.cols);
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
            score -= openerBonus * 0.85;
            if (behavior?.styleBand === 'spike') {
                score -= Math.max(0, tSlotDelta) * 320 * behavior.tspinBias;
                if (isTSpin) score -= 1400 * behavior.tspinBias;
            }
            return score;
        }

        if (context.guideMode === Minosa.GUIDE_VERSUS) {
            const previousTSlots = Number.isInteger(context.previousTSlots)
                ? context.previousTSlots
                : this.countTSLots(context.grid, context.rows, context.cols);
            const nextTSlots = Number.isInteger(context.nextTSlots)
                ? context.nextTSlots
                : this.countTSLots(context.nextGrid, context.rows, context.cols);
            const tSlotDelta = nextTSlots - previousTSlots;
            const filledCells = Number.isInteger(context.filledCells)
                ? context.filledCells
                : this.countFilledCells(context.nextGrid);
            const isTSpin = typeof context.isTSpin === 'boolean'
                ? context.isTSpin
                : this.isTSpinPlacement(context.placedGrid, context.placement, context.pieceType, context.rows, context.cols);
            const difficultClear = isTSpin || context.linesCleared === 4;
            const cleanBoard = nextMetrics.holes === 0 && nextMetrics.coveredHoles === 0;
            const downstackChain = context.linesCleared > 0 && holeReduction > 0;
            const allClearSetupBonus = cleanBoard ? this.scoreAllClearSetup(nextMetrics, filledCells) : 0;
            const finisherSetupBonus =
                Math.max(0, tSlotDelta) * 520 +
                Math.max(0, Math.min(edgeWellDepth, 4)) * 180;
            const stackCleanBias = behavior?.stackCleanBias || 1;
            const dependencyBias = behavior?.dependencyBias || 0;
            const tspinBias = behavior?.tspinBias || 0;
            const spikeBias = behavior?.spikeBias || 0;
            let score =
                nextMetrics.holes * 1700 * stackCleanBias +
                nextMetrics.coveredHoles * 1250 * stackCleanBias +
                nextMetrics.bumpiness * 7 +
                nextMetrics.aggregateHeight * 4 +
                nextMetrics.maxHeight * 20 +
                nextMetrics.rowTransitions * 2 +
                nextMetrics.columnTransitions * 2 +
                nextMetrics.wellDepth * 10;

            score -= holeReduction * 420;
            score -= context.linesCleared * (behavior?.prefersSinglesAndDoubles ? 70 : 140);
            score -= finisherSetupBonus * (0.55 + dependencyBias + spikeBias * 0.35);
            score -= allClearSetupBonus;
            score -= openerBonus;

            if (downstackChain) {
                score -= 900 + holeReduction * 260 + context.linesCleared * 180;
            }
            if (isTSpin) {
                score -= 9800 + context.linesCleared * 1900 * (1 + tspinBias * 0.28);
            } else if (context.linesCleared === 4 && context.pieceType === 'I') {
                score -= 8600 * (1 + spikeBias * 0.18);
            }
            if (difficultClear && holeReduction > 0) {
                score -= 1600;
            }
            if (context.linesCleared === 0 && cleanBoard) {
                score -= finisherSetupBonus * 0.45;
            }
            if (context.pieceType === 'T' && tSlotDelta > 0) {
                score -= 480 + tspinBias * 260;
            }
            if (holdTReady) score -= 160;
            if (holdIReady) score -= 110;
            if (behavior?.prefersSinglesAndDoubles) {
                if (context.linesCleared === 1) score -= 260;
                if (context.linesCleared === 2) score -= 320;
                if (context.linesCleared >= 3 || difficultClear) score += 950;
                score -= Math.max(0, Math.min(edgeWellDepth, 2)) * 130;
            }
            if (behavior?.styleBand === 'cleanup') {
                score -= Math.max(0, tSlotDelta) * 180;
                score -= Math.max(0, Math.min(edgeWellDepth, 3)) * 110;
            }
            if (behavior?.styleBand === 'spike' && cleanBoard) {
                score -= 280 + finisherSetupBonus * 0.24;
            }
            if (filledCells === 0) score -= 18000;
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

    scoreOpenerStructureBonus(context = {}) {
        const openerPlan = context.openerPlan || null;
        if (!openerPlan) return 0;
        const nextGrid = Array.isArray(context.nextGrid) ? context.nextGrid : [];
        const rows = context.rows || nextGrid.length;
        const cols = context.cols || (nextGrid[0] ? nextGrid[0].length : 10);
        const nextMetrics = context.nextMetrics || this.analyzeGrid(nextGrid, rows, cols);
        const rightWellDepth = Number.isFinite(context.rightWellDepth)
            ? context.rightWellDepth
            : this.getEdgeWellDepth(nextMetrics.heights, 'right');
        const leftWellDepth = Number.isFinite(context.leftWellDepth)
            ? context.leftWellDepth
            : this.getEdgeWellDepth(nextMetrics.heights, 'left');
        const tSlotDelta = Number.isFinite(context.tSlotDelta) ? context.tSlotDelta : 0;
        const targetSide = openerPlan.wellSide || openerPlan.preferredSide || 'right';
        const preferredWellDepth = targetSide === 'left' ? leftWellDepth : rightWellDepth;
        const offsideWellDepth = targetSide === 'left' ? rightWellDepth : leftWellDepth;
        const flatnessPenalty = nextMetrics.bumpiness * 110 * (openerPlan.rewardFlatStack || 0);
        const wellBonus = Math.max(0, Math.min(openerPlan.targetWellDepth || 0, preferredWellDepth)) * 320;
        const offsidePenalty = Math.max(0, offsideWellDepth - 1) * 180;
        const tSlotBonus = Math.max(0, tSlotDelta) * 460 * (openerPlan.encourageTSlots || 0);
        const clearPenalty = Math.max(0, context.linesCleared || 0) * 280 * (openerPlan.discourageEarlyClears || 0);
        return wellBonus + tSlotBonus - flatnessPenalty - offsidePenalty - clearPenalty;
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

    cloneGuideSearchResult(result) {
        if (!result) return null;
        return {
            score: result.score,
            path: Array.isArray(result.path) ? result.path.map(step => ({ ...step })) : [],
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
Minosa.GUIDE_VERSUS = 'versus';
Minosa.GUIDE_SURVIVAL = 'survival';
Minosa.GUIDE_MODES = [Minosa.GUIDE_TETRIS, Minosa.GUIDE_TSPIN, Minosa.GUIDE_VERSUS, Minosa.GUIDE_SURVIVAL];

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
