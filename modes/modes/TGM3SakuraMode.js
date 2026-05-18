// TGM3SakuraMode - Sakura puzzle/time-attack implementation (simplified visual effects)
// - Fixed 255-piece loop
// - 27 stages (20 main + 7 EX) from sakurastages.md
// - Effects: mirror (pre-spawn), x-ray sweep (1 column / 2f, 1s pause), strobe (0.5s cycle), auto-rotate (every 0.5s, start on spawn), EX3 big blocks (double size, 1 mini-cell movement)
// - Timers: main 180s, per-stage 60s for first 20; EX uses main only; jewels +1s on clear (during ARE step)
// - Stage flow: Ready/Go with stage number/effect, post-stage stats for 3s (skip with Start)

class TGM3SakuraMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM3 Sakura';
        this.modeId = 'tgm3_sakura';
        this.config = this.getModeConfig();

        // Sequence (255 chars) from sakurapiece.md
        this.sequence = 'LIJOTSZILJOTISJZLOIJSZTIOJZTLSOZTISOLTJSIZTOJLIZSTOIZLTJOSILTZSOITJLZSTJJISOLJITSLZOIZSJOITSZLJTSZLIST';
        this.seqIndex = 0;

        // Stage data
        this.stages = this.buildStages();
        this.stageIndex = 0;
        this.jewelSet = new Set(); // "r,c" strings

        // Timers (seconds)
        this.mainTimer = 180;
        this.stageTimer = 60;
        this.stageStartTime = 0;
        this.readyGoActive = false;
        this.postStageActive = false;

        // Effect helpers
        this.xrayTimer = 0;
        this.xrayColumn = 0;
        this.xrayPause = 0;
        this.strobeTimer = 0;
        this.autoRotateTimer = 0;
        this.mirrorCounter = 0;
        this.effectText = '';

        // UI refs
        this.ui = { stageText: null, effectText: null, readyGo: null, postText: null };
    }

    getModeConfig() {
        return {
            gravity: { type: 'custom', curve: level => this.getGravitySpeed(level) },
            das: 14/60,
            arr: 1/60,
            are: 25/60,
            lineAre: 25/60,
            lockDelay: 30/60,
            lineClearDelay: 40/60,
            nextPieces: 3,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 300,
            hasGrading: false,
            specialMechanics: {
                sakura: true,
                fixedSequence: true
            }
        };
    }

    getName() { return this.modeName; }
    getModeId() { return this.modeId; }

    getBgmConfig() {
        return {
            progressSource: 'level',
            stopSource: 'level',
            useStopBuffer: false,
            transitionStopOffset: 0,
            segments: [{ end: 999, key: 'mf1_1' }]
        };
    }

    // --- Lifecycle hooks ---
    initializeForGameScene(gameScene) {
        super.initializeForGameScene(gameScene);
        this.resetState();
        this.applyStage(gameScene);
        this.showReadyGo(gameScene);
    }

    resetState() {
        this.stageIndex = 0;
        this.seqIndex = 0;
        this.mainTimer = 180;
        this.stageTimer = 60;
        this.stageStartTime = 0;
        this.readyGoActive = false;
        this.postStageActive = false;
        this.postStageTimer = null;
        this.postSkipRequested = false;
        this.mirrorCounter = 0;
        this.xrayTimer = 0;
        this.xrayColumn = 0;
        this.xrayPause = 0;
        this.strobeTimer = 0;
        this.autoRotateTimer = 0;
        this.effectText = '';
        this.skipHoldTimer = 0;
        this.skipTriggered = false;
        this.bestStageReached = 0; // 1-27, 27 = ALL
        this.bestTimeSeconds = null;
        this.exStagesUnlocked = 3;
        this.totalMainClearTime = 0;
        this.xrayRevealCooldown = 0;
        this.mainElapsedSeconds = 0;
    }

    isReadyGoActive() { return this.readyGoActive; }

    handleSakuraInput(gameScene, inputs, deltaTime) {
        // Ready/Go: Hold key advances sequence and updates hold box
        if (this.readyGoActive) {
            if (inputs.holdJustDown) {
                this.advanceSequenceWithHold(gameScene);
            }
            return;
        }

        // Post-stage: allow skip of summary
        if (this.postStageActive) {
            if (inputs.startJustDown) {
                this.skipPostStage(gameScene);
            }
            return;
        }

        // Active stage: skip by holding Start/Enter 3s (if enough time remains)
        if (inputs.startDown) {
            this.skipHoldTimer += deltaTime;
            if (this.skipHoldTimer >= 3 && !this.skipTriggered) {
                this.skipTriggered = true;
                // Skip rule: disallow skip if total timer <30s
                if (this.mainTimer > 30) {
                    this.mainTimer = Math.max(0, this.mainTimer - 30);
                    this.onSkipTriggered(gameScene);
                }
            }
        } else {
            this.skipHoldTimer = 0;
            this.skipTriggered = false;
        }
    }

    advanceSequenceWithHold(gameScene) {
        const nextType = this.generateNextPiece(gameScene);
        // Store an actual Piece instance in hold to keep hold swapping functional
        gameScene.holdPiece = new Piece(nextType, gameScene.rotationSystem, 0);
        gameScene.canHold = true;
    }

    // Called every frame
    update(gameScene, deltaTime) {
        // Skip timers during Ready/Go or post-stage
        if (this.readyGoActive || this.postStageActive) return;

        const inMainStages = this.stageIndex < 20;
        // Timers
        if (this.mainTimer > 0) this.mainTimer = Math.max(0, this.mainTimer - deltaTime);
        if (inMainStages) this.stageTimer = Math.max(0, this.stageTimer - deltaTime);

        // Effects
        this.updateEffects(gameScene, deltaTime);

        // Auto-rotate current piece if effect applies
        if (this.isAutoRotateStage()) {
            this.autoRotateTimer += deltaTime;
            if (this.autoRotateTimer >= 0.5) {
                this.autoRotateTimer = 0;
                if (gameScene.currentPiece) {
                    gameScene.rotateCurrentPiece(-1); // assume helper exists for CCW
                    // Grey tint
                    if (gameScene.currentPiece) gameScene.currentPiece.color = 0x888888;
                }
            }
        }

        // Completion / fail checks
        if (this.jewelSet.size === 0) {
            this.finishStage(gameScene, true);
        } else if (this.mainTimer <= 0 || (inMainStages && this.stageTimer <= 0)) {
            this.finishStage(gameScene, false);
        }
    }

    onPieceSpawn(gameScene) {
        // Mirror pre-spawn if effect
        if (this.isMirrorStage()) {
            this.mirrorCounter = (this.mirrorCounter + 1) % 3;
            if (this.mirrorCounter === 0) {
                this.mirrorBoard(gameScene);
            }
        }
        // Reset auto-rotate timer
        this.autoRotateTimer = 0;
    }

    // Called after line clear; we use it to detect jewel clears and time bonuses
    handleLineClear(gameScene, linesCleared, pieceType = null) {
        // Check if the cleared piece was an item block
        if (gameScene.currentPiece && gameScene.currentPiece.isItemBlock) {
            this.activateItemBlock(gameScene.currentPiece.itemType, gameScene);
        }
        // Detect cleared jewels (cells now empty)
        const clearedJewels = [];
        for (const key of Array.from(this.jewelSet)) {
            const [r, c] = key.split(',').map(Number);
            const cell = (gameScene.board.grid[r] || [])[c];
            if (!cell) {
                clearedJewels.push(key);
                this.jewelSet.delete(key);
            }
        }
        if (clearedJewels.length > 0) {
            // +1s per jewel during ARE; approximate by immediate apply
            const bonus = clearedJewels.length;
            this.mainTimer += bonus;
            try {
                gameScene.playSfx('jewelclear', 0.7);
            } catch {}
        }
    }

    // --- Piece generation ---
    generateNextPiece(gameScene) {
        const ch = this.sequence[this.seqIndex % this.sequence.length];
        this.seqIndex = (this.seqIndex + 1) % this.sequence.length;
        return ch;
    }

    // --- Stage management ---
    finishStage(gameScene, cleared) {
        this.postStageActive = true;
        const timeTaken = (this.stageStartTime > 0 ? (this.stageElapsed(gameScene)) : 0);
        let bonus = 0;
        if (cleared) {
            if (timeTaken <= 10) bonus = 10;
            else if (timeTaken <= 20) bonus = 5;
        }
        this.mainTimer += bonus;
        const stageNumber = this.stageIndex + 1;
        if (cleared) {
            this.bestStageReached = Math.max(this.bestStageReached, stageNumber);
            // Track main clear time for EX gating
            if (stageNumber <= 20) {
                this.mainElapsedSeconds += timeTaken;
            }
            if (stageNumber === 20) {
                const totalTime = this.mainElapsedSeconds;
                this.exStagesUnlocked = totalTime <= 300 ? 7 : totalTime <= 360 ? 5 : 3;
                if (this.bestTimeSeconds === null) this.bestTimeSeconds = totalTime;
                else this.bestTimeSeconds = Math.min(this.bestTimeSeconds, totalTime);
            }
            if (stageNumber === this.stages.length) {
                // ALL clear: mark best
                this.bestStageReached = Math.max(this.bestStageReached, stageNumber);
            }
        } else {
            this.bestStageReached = Math.max(this.bestStageReached, stageNumber);
        }
        this.showPostStage(gameScene, timeTaken, bonus);

        this.postSkipRequested = false;
        if (this.postStageTimer) {
            this.postStageTimer.remove(false);
        }
        this.postStageTimer = gameScene.time.delayedCall(3000, () => {
            this.postStageActive = false;
            this.advanceStage(gameScene);
        });
    }

    stageElapsed(gameScene) {
        return (gameScene.currentTime || 0) - this.stageStartTime;
    }

    advanceStage(gameScene) {
        this.stageIndex += 1;
        const maxStages = 20 + this.exStagesUnlocked;
        if (this.stageIndex >= maxStages || this.stageIndex >= this.stages.length) {
            gameScene.showGameOverScreen();
            return;
        }
        this.applyStage(gameScene);
        this.showReadyGo(gameScene);
    }

    applyStage(gameScene) {
        // Clear board
        for (let r = 0; r < gameScene.board.rows; r++) {
            gameScene.board.grid[r] = Array(gameScene.board.cols).fill(0);
        }

        const stage = this.stages[this.stageIndex];
        this.effectText = stage.effect || '';
        this.jewelSet.clear();
        // Big-block effect for EX3
        if (gameScene) {
            const isBig = stage.effectType === 'big';
            const isXray = stage.effectType === 'xray';
            const isStrobe = stage.effectType === 'strobe';
            gameScene.bigBlocksActive = isBig;
            gameScene.xrayActive = isXray;
            gameScene.xrayColumn = isXray ? this.xrayColumn : -1;
            gameScene.xrayRevealCooldown = isXray ? this.xrayPause : 0;
            gameScene.strobeActive = isStrobe;
        }

        // Apply layout (top -> bottom)
        const colorMap = {
            I: 0x00ffff, O: 0xffff00, T: 0xaa00ff, S: 0x00ff00,
            Z: 0xff0000, J: 0x0000ff, L: 0xff8800, C: 0xffffff
        };
        const startRow = Math.max(0, gameScene.board.rows - stage.layout.length);
        stage.layout.forEach((line, idx) => {
            const r = startRow + idx;
            for (let c = 0; c < Math.min(line.length, gameScene.board.cols); c++) {
                const ch = line[c];
                if (ch === '.') continue;
                const color = colorMap[ch] || 0x888888;
                gameScene.board.grid[r][c] = color;
                if (ch === 'C') {
                    this.jewelSet.add(`${r},${c}`);
                }
            }
        });

        // Timers
        this.stageTimer = this.stageIndex < 20 ? 60 : Infinity;
        this.stageStartTime = gameScene.currentTime || 0;
    }

    showReadyGo(gameScene) {
        this.readyGoActive = true;
        const stageNum = this.stageIndex + 1;

        // Clear hold
        gameScene.holdPiece = null;
        gameScene.canHold = true;

        // Play READY/GO SFX if available
        try {
            if (gameScene.sound) {
                gameScene.playSfx('ready', 0.7);
                gameScene.time.delayedCall(800, () => {
                    gameScene.playSfx('go', 0.8);
                });
            }
        } catch (e) {
            console.warn('Sakura Ready/Go SFX failed', e);
        }

        // UI texts
        this.destroyUI();
        if (gameScene.add) {
            this.ui.stageText = gameScene.add.text(
                gameScene.windowWidth / 2, gameScene.windowHeight * 0.1,
                `STAGE ${stageNum}`, { fontSize: '18px', color: '#ffffff' }
            ).setOrigin(0.5);
            this.ui.readyGo = gameScene.add.text(
                gameScene.windowWidth / 2, gameScene.windowHeight * 0.35,
                'READY... GO!', { fontSize: '32px', color: '#ffff00' }
            ).setOrigin(0.5);
            if (this.effectText) {
                this.ui.effectText = gameScene.add.text(
                    gameScene.windowWidth / 2, gameScene.windowHeight * 0.6,
                    this.effectText, { fontSize: '16px', color: '#00ffff' }
                ).setOrigin(0.5);
            }
        }

        // Delay then start
        gameScene.time.delayedCall(2000, () => {
            this.readyGoActive = false;
            this.destroyUI();
        });
    }

    showPostStage(gameScene, timeTaken, bonus) {
        this.destroyUI();
        if (!gameScene.add) return;
        const total = this.mainTimer.toFixed(2);
        const completionRate = Math.min(100, (this.bestStageReached / 27) * 100);
        const bestTimeText = this.bestTimeSeconds != null ? `${this.bestTimeSeconds.toFixed(2)}s` : 'N/A';
        const text = `Stage ${this.stageIndex + 1} ${this.jewelSet.size === 0 ? 'CLEAR' : 'FAIL'}\nTime: ${timeTaken.toFixed(2)}s\nBonus: +${bonus}s\nTotal: ${total}s\nBest Stage: ${this.bestStageReached}\nBest Time (main): ${bestTimeText}\nCompletion: ${completionRate.toFixed(1)}%`;
        this.ui.postText = gameScene.add.text(
            gameScene.windowWidth / 2, gameScene.windowHeight * 0.35,
            text, { fontSize: '20px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);
    }

    skipPostStage(gameScene) {
        if (!this.postStageActive) return;
        this.postStageActive = false;
        if (this.postStageTimer) {
            this.postStageTimer.remove(false);
            this.postStageTimer = null;
        }
        this.advanceStage(gameScene);
    }

    // Triggered when skip occurs to fade stack and show results immediately
    onSkipTriggered(gameScene) {
        // Minimal fade: reduce alpha of stack graphics if present
        if (gameScene.board && gameScene.board.grid) {
            if (gameScene.placedMinoRows) {
                gameScene.minoFadeActive = true;
                gameScene.minoFadeTimer = 0;
                gameScene.minoFadeProgress = 0;
                gameScene.minoFadePerRowDuration = 0.25;
                gameScene.placedMinoRows = [...Array(gameScene.board.rows).keys()];
                gameScene.minoRowFadeAlpha = Array(gameScene.board.rows).fill(1);
            }
        }
        // Immediately show post-stage UI
        this.showPostStage(gameScene, this.stageElapsed(gameScene), 0);
        this.skipPostStage(gameScene);
    }

    destroyUI() {
        ['stageText', 'effectText', 'readyGo', 'postText'].forEach(key => {
            if (this.ui[key]) {
                this.ui[key].destroy();
                this.ui[key] = null;
            }
        });
    }

    // --- Effects ---
    updateEffects(gameScene, deltaTime) {
        if (this.isXrayStage()) {
            if (this.xrayPause > 0) {
                this.xrayPause -= deltaTime;
            } else {
                this.xrayTimer += deltaTime;
                if (this.xrayTimer >= (2 / 60)) { // every 2 frames at 60fps
                    this.xrayTimer = 0;
                    this.xrayColumn += 1;
                    if (this.xrayColumn >= gameScene.board.cols) {
                        this.xrayColumn = 0;
                        this.xrayPause = 1; // 1s delay
                    }
                }
            }
        } else {
            this.xrayTimer = 0;
            this.xrayColumn = 0;
            this.xrayPause = 0;
        }

        if (this.isStrobeStage()) {
            this.strobeTimer += deltaTime;
            if (this.strobeTimer >= 0.5) {
                this.strobeTimer = 0;
            }
            // Visual pulse not implemented; rendering layer would handle opacity/height
        } else {
            this.strobeTimer = 0;
        }

        if (gameScene) {
            gameScene.xrayActive = this.isXrayStage();
            gameScene.xrayColumn = this.isXrayStage() ? this.xrayColumn : -1;
            gameScene.xrayRevealCooldown = this.isXrayStage() ? this.xrayPause : 0;
            gameScene.strobeActive = this.isStrobeStage();
        }
    }

    mirrorBoard(gameScene) {
        const cols = gameScene.board.cols;
        for (let r = 0; r < gameScene.board.rows; r++) {
            const row = gameScene.board.grid[r] || [];
            for (let c = 0; c < cols / 2; c++) {
                const opposite = cols - 1 - c;
                const tmp = row[c];
                row[c] = row[opposite];
                row[opposite] = tmp;
            }
        }
        // Also mirror jewels
        const newSet = new Set();
        for (const key of this.jewelSet) {
            const [r, c] = key.split(',').map(Number);
            const nc = cols - 1 - c;
            newSet.add(`${r},${nc}`);
        }
        this.jewelSet = newSet;
    }

    isMirrorStage() { return this.stages[this.stageIndex]?.effectType === 'mirror'; }
    isXrayStage() { return this.stages[this.stageIndex]?.effectType === 'xray'; }
    isStrobeStage() { return this.stages[this.stageIndex]?.effectType === 'strobe'; }
    isAutoRotateStage() { return this.stages[this.stageIndex]?.effectType === 'autorotate'; }

    // --- Stage data helpers ---
    buildStages() {
        const parse = (layout, effectType = null, effect = '') => ({ layout, effectType, effect });
        const stages = [];
        // Main 1-20
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','..........','..........','..CC..CT..','.CIIIIIIC.','.COOOOOOC.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','....CJJC..','....IIII..','.....CCC..','.CIIIIIII.','.JJJJJJJC.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','...CTLC...','....LC....','....CC....','.TLTLTLTL.','.CTLTLTLC.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','..CSSSS...','...CCJJ...','C.CSSSSS..','JCJJJJJJC.'
        ], 'mirror', 'Effect: Mirror playfield every 3 pieces.'));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','.CIOICIOC.','..........','..........','..........','..........','..IOIOIO..','.COIOIOIC.','.CIOIOIOC.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','....CC....','..C.JO.C..','....OJ....','.COJCOJOC.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','..........','CC.ZSZS..','....CCSZ..','Z...ZSCC..','SZSZSZSZ..',
            'ZSZSZSZSC.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '...CTTTTTC','.........T','.........T','.COOOOOOOC','..........','..........','JJJJJJC...','J.........','C.........','LLLLLLLLC.'
        ], 'xray', 'Effect: X-ray every odd piece.'));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','...CTTTT..','...IIIIC..','TTTCCC....','IIIIIIII..','TTTTTTTT..','IIIIIIIIC.','TTTTTTTTC.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','...CSSC...','..CSSSSC..','.CSSSSSSC.','....I.....','....I.....','....I.L...','....CLL...'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','..........','..........','....LL....','....C.....','....ZC....',
            '.....C....','....LL....','....CC....','CSS.LL.SSC'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','..........','.......SSC','..ZCZ...CS','.ZCZCZ...C','ZZZCZZZ...'
        ], 'strobe', 'Effect: Strobing minos.'));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','..........','I........C','II......CI','III....CII','JJJJ..CJJJ',
            '.CJJJCJJC.'
        ], 'mirror', 'Effect: Mirror playfield every 3 pieces.'));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','...OZO....','C..COZC...','...OZOZOZC','.......COZ','......COZC'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..J....J..','..JOJJOJ..','...OJJO...','....CC....','..........','....CC....','...COOC...',
            '..COOOOO..'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..C....C..','..I..C.I..','..I.CC.I..','..I....I..','..CIIIIC..','..........','..........'
        ], 'autorotate', 'Effect: Auto-rotate every 4 pieces.'));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            'C..S..T..C','...S..T...','...S..C...','...S..T...','...C..T...','...S..T...','...S..C...','...S..T...','...S..T...','.TTTCCSSS.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','...OCOO...','..O....O..','.L..CC..C.','.C..CC..L.','.ZL....LZ.','.ZZLLLLZZ.'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '......C...','.....L....','....LZL...','.L..LZZL..','.LL..CZZ..','..CZ.ZZZZ.','..ZZZZOCLL','.ZLOCOOOOL','.LLOOIIIIC','..LOJJCJJJ'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','..CJJJJJ..','I..CIII..I','SS..CS..SS','OOC....COO','ZZZC..CZZZ'
        ]));

        // EX 1-7
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..SSSSS...','.SSSSSSCS.','SSSSSSSSC.','S..SLLS..S','.C.SLL.C.C','....LL....','....LL....','....LL....','....CC....'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..J....J..','.JCJ..JCJ.','..J....J..','..........','..........','....CC....','..........','..........','...ICCI...','...JJCJ...'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','........IT','........OS',
            'CC........','ZC........','..........','..........','..........','..........','..........','..........','....CC....','....CC....'
        ], 'big', 'Effect: Double-size pieces'));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','..........','..........','..........','SSSSC.....','.....COOOC','..........','CJJJC.....',
            '.....CZZZC'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '..........','..........','..........','.....C....','...C...C..','.....C....','...C...C..','.....C....','..........','..........'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','....ZZ....','....LL....',
            '....LL....','....LL....','...CLLC...','..LIIIIL..','..LIIIIL..','..L..C.L..','..L.CC.L..','..LJJJCL..','..LCJJJL..','..LLLLLL..'
        ]));
        stages.push(parse([
            '..........','..........','..........','..........','..........','..........','..........','..........','..........','..........',
            '.CLSSSSSC.','S.OLSSSS.O','SS.OLSS.OL','SSS.OL.OLS','SSSL.COLSS','SSLOC.LSSS','SLO.LC.SSS','LO.SSLO.SS','O.SSSSLO.S','.CSSSSSLC.'
        ]));
        return stages;
    }

    // Simple gravity curve; Sakura speed is modest then 20G late-game.
    getGravitySpeed(level) {
        if (level < 30) return 4;
        if (level < 60) return 16;
        if (level < 100) return 64;
        if (level < 160) return 256;
        if (level < 200) return 768;
        return 5120; // 20G
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM3SakuraMode };
}
if (typeof window !== 'undefined') {
    window.TGM3SakuraMode = TGM3SakuraMode;
}
