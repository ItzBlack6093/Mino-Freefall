// TGM3EasyMode - Ti Easy approximation
// Key points: 3 previews, Hold enabled, modest gravity ramp, short level cap (200) then credit roll

class TGM3EasyMode extends BaseMode {
    constructor() {
        super();
        this.modeName = 'TGM3 Easy';
        this.modeId = 'tgm3_easy';
        this.config = this.getModeConfig();
        this.hanabi = 0;
        this.comboSize = 0;
        this.framesSinceLastClear = 0;
        this.pieceActiveFrames = 0;
        this.thirtySecondBonus = false;
        this.lastThirtyLevel = 0;
        this.elapsedTime = 0;
        this.nextThirtyTrigger = 30;
        this.spinDuringGround = false;
        this.creditsComboSize = 0;
        this.creditsHanabiInterval = null;
        this.creditsHanabiTimer = 0;
        this.comboStreamTimer = 0;
        this.lastClearWasLine = false;
        this.hanabiParticles = [];
        this.graphicsPool = [];
        this.hanabiContainer = null;
        this.burstQueue = [];
        this.burstCooldown = 0;
    }

    getModeConfig() {
        return {
            gravity: { type: 'custom', curve: level => this.getGravitySpeed(level) },
            das: 16/60,
            arr: 1/60,
            are: 8/60,
            lineAre: 25/60,
            lockDelay: 30/60,
            lineClearDelay: 40/60,
            nextPieces: 3,
            holdEnabled: true,
            ghostEnabled: true,
            levelUpType: 'piece',
            lineClearBonus: 1,
            gravityLevelCap: 200,
            hasGrading: false,
            specialMechanics: {
                hanabi: true,
                sectionStops: [99, 199],
                creditsDuration: 55,
                creditsHanabi: true
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
            segments: [{ end: 999, key: 'mf1_1' }],
            credits: {
                key: 'mf1_endroll',
                reuseCurrentTrack: false
            }
        };
    }

    onLevelUpdate(level, oldLevel, type, amount) {
        // Match other modes: pieces advance levels normally until 99; beyond 99 only line clears advance
        let next = oldLevel;
        if (type === 'piece') {
            // Allow piece-based increment up to 99 and 199 only
            if (oldLevel < 99) {
                next = oldLevel + 1;
            } else if (oldLevel >= 99 && oldLevel < 199) {
                next = oldLevel + 1;
            } else {
                next = oldLevel; // freeze after 199 for piece-based increments
            }
        } else if (type === 'lines') {
            const inc = Math.max(amount || 0, 0);
            // Lines can advance beyond stops
            next = oldLevel + inc;
        }
        return next;
    }

    onPieceSpawn(gameScene) {
        this.pieceActiveFrames = 0;
        this.spinDuringGround = false;
        this.lastClearWasLine = false;
    }

    initializeForGameScene(gameScene) {
        if (super.initializeForGameScene) super.initializeForGameScene(gameScene);
        this.hanabi = 0;
        this.comboSize = 0;
        this.framesSinceLastClear = 0;
        this.pieceActiveFrames = 0;
        this.thirtySecondBonus = false;
        this.lastThirtyLevel = gameScene ? gameScene.level || 0 : 0;
        this.elapsedTime = 0;
        this.nextThirtyTrigger = 30;
        this.spinDuringGround = false;
        this.lastClearWasLine = false;
        this.clearParticles();
        this.burstQueue = [];
        this.burstCooldown = 0;
        if (gameScene) {
            this.hanabiContainer = gameScene.add.group();
        }
    }

    update(gameScene, deltaTime) {
        // Track frames for timing-sensitive bonuses
        const frames = deltaTime * 60;
        this.framesSinceLastClear += frames;
        this.pieceActiveFrames += frames;
        this.comboStreamTimer = Math.max(0, this.comboStreamTimer - frames);

        // Update own fireworks system
        this.updateBurstQueue(gameScene, deltaTime);
        this.updateParticles(deltaTime);

        // Credits free hanabi stream
        if (gameScene && gameScene.creditsActive && this.creditsHanabiInterval) {
            this.creditsHanabiTimer += frames;
            while (this.creditsHanabiTimer >= this.creditsHanabiInterval) {
                this.creditsHanabiTimer -= this.creditsHanabiInterval;
                this.hanabi += 1;
                this.queueBurst(1, 0);
                if (gameScene.hanabiTextInGame) {
                    gameScene.hanabiTextInGame.setText(this.hanabi.toString());
                }
            }
        }

        // 30s bonus trigger from main stopwatch
        this.elapsedTime += deltaTime;
        while (this.elapsedTime >= this.nextThirtyTrigger) {
            const levelNow = gameScene ? gameScene.level || 0 : 0;
            if (levelNow - this.lastThirtyLevel >= 30) {
                this.thirtySecondBonus = true;
            }
            this.lastThirtyLevel = levelNow;
            this.nextThirtyTrigger += 30;
        }
    }

    onRotateWhileGrounded(gameScene) {
        this.spinDuringGround = true;
    }

    onCreditsStart(gameScene) {
        // Freeze combo size for credits roll per Ti Easy behavior
        this.creditsComboSize = this.comboSize;
        // Precompute credit roll hanabi interval based on earned hanabi 0-200 (avoid divide by zero)
        const baseHanabi = Math.max(1, Math.floor(this.hanabi || 0));
        this.creditsHanabiInterval = Math.max(1, Math.floor(3265 / baseHanabi));
        // Start with a random initial phase up to interval-1 to mimic staggered first fire
        this.creditsHanabiTimer = Math.random() * this.creditsHanabiInterval;
    }

    handleLineClear(gameScene, linesCleared, pieceType = null) {
        if (linesCleared <= 0) return;

        this.lastClearWasLine = true;

        // Base line clear values (cap >4 as Tetris)
        const baseTable = { 1: 1.0, 2: 2.9, 3: 3.8, 4: 4.7 };
        const base = baseTable[Math.min(linesCleared, 4)] || 1.0;

        // Combo handling: singles keep; doubles+ increment; cap 9. Credits freeze combo.
        let comboMult = 1.0;
        if (gameScene && gameScene.creditsActive) {
            const frozen = Math.min(9, Math.max(0, this.creditsComboSize));
            const remap = { 0: 1, 1: 1, 2: 2, 3: 3, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 0 };
            const mapped = remap[frozen] ?? 1;
            const creditsComboTable = { 0: 1.0, 1: 1.5, 2: 1.9, 3: 2.2, 4: 2.9 };
            comboMult = creditsComboTable[mapped] || 1.0;
        } else {
            if (linesCleared >= 2) {
                this.comboSize = Math.min(9, this.comboSize + 1);
            }
            const comboTable = {
                0: 1.0, 1: 1.0, 2: 1.5, 3: 1.9, 4: 2.2,
                5: 2.9, 6: 3.5, 7: 3.9, 8: 4.2, 9: 4.5,
            };
            comboMult = comboTable[this.comboSize] || 1.0;
        }

        // Fixed speed combo bonus: active if stream timer > 0
        const fixedComboMult = this.comboStreamTimer > 0 ? 1.3 : 1.0;

        // Split bonus
        const clearedRows = gameScene && Array.isArray(gameScene.clearedLines)
            ? gameScene.clearedLines
            : [];
        let splitMult = 1.0;
        if (clearedRows.length > 1) {
            const diffs = clearedRows.slice(1).map((r, i) => r - clearedRows[i]);
            const nonContig = diffs.some((d) => d > 1);
            if (nonContig) splitMult = 1.4;
        }

        // Lucky level bonus (bugged in credits)
        const luckyLevels = new Set([25, 50, 75, 125, 150, 175, 199]);
        const levelBefore = gameScene ? gameScene.level || 0 : 0;
        const levelAfterRaw = levelBefore + linesCleared;
        const luckyCheckLevel =
            gameScene && gameScene.creditsActive
                ? levelAfterRaw - linesCleared
                : levelBefore;
        const lucky = luckyLevels.has(luckyCheckLevel) ? 1.3 : 1.0;

        // 30-second bonus
        const thirtyMult = this.thirtySecondBonus ? 1.4 : 1.0;
        this.thirtySecondBonus = false;

        // Variable speed combo bonus: (level - frames) x 1/100
        // Level is after line clear (tetris at 199 = 203), fixed at 200 during credits
        // Frames is frames since previous line clear (min 2: 1 spawn + 1 lock)
        // Bonus fades in from level 100 to 200, multiplier 1.0 to 2.0
        const levelAfterCredits = gameScene && gameScene.creditsActive ? 200 : levelAfterRaw;
        const speedFrames = Math.max(2, this.framesSinceLastClear);
        const varSpeedDelta = levelAfterCredits - speedFrames;
        const varSpeedMult = varSpeedDelta > 100 ? varSpeedDelta * 0.01 : 1.0;

        // Variable finesse bonus: (level - frames) x 1/120
        // Level is after line clear, fixed at 200 during credits
        // Frames is frames piece was active (min 1: 1 frame to lock, spawn not counted)
        // Bonus fades in from level 120 to 200, multiplier 1.0 to 1.6666...
        const finesseFrames = Math.max(1, this.pieceActiveFrames);
        const varFinDelta = levelAfterCredits - finesseFrames;
        const varFinMult = varFinDelta > 120 ? varFinDelta * (1/120) : 1.0;

        // Spin bonus
        let spinMult = 1.0;
        if (this.spinDuringGround) {
            if (pieceType === 'T') {
                spinMult = linesCleared >= 3 ? 4.0 : 3.0;
            } else if (pieceType !== 'O') {
                spinMult = 2.0;
            }
        }
        this.spinDuringGround = false;

        // Aggregate (truncated)
        let awarded =
            base *
            comboMult *
            fixedComboMult *
            splitMult *
            lucky *
            thirtyMult *
            varSpeedMult *
            varFinMult *
            spinMult;
        awarded = Math.floor(awarded);

        // Bravos only during 0-200 (not credits): +6 flat
        const isBravo =
            clearedRows.length > 0 &&
            gameScene &&
            gameScene.board &&
            gameScene.board.grid.every((row) => row.every((cell) => cell === 0));
        if (isBravo && (!gameScene || !gameScene.creditsActive)) {
            awarded += 6;
        }

        this.hanabi += awarded;
        if (awarded > 0) {
            this.queueBurst(awarded, 0.14);
        }
        if (gameScene && gameScene.hanabiTextInGame) {
            gameScene.hanabiTextInGame.setText(this.hanabi.toString());
        }

        // Reset timers for next piece/clear context
        this.framesSinceLastClear = 0;
        this.pieceActiveFrames = 0;
        this.comboStreamTimer = 100;
    }

    // Reset combo when a piece locks without clearing
    onPieceLock(piece, gameScene) {
        if (!this.lastClearWasLine) {
            this.comboSize = 0;
            this.comboStreamTimer = 0;
        }
        this.lastClearWasLine = false;
        return true;
    }

    onCreditsEnd(gameScene) {
        // Completion hanabi: +24 after credits roll
        this.hanabi += 24;
        this.queueBurst(24, 0.22);
        if (gameScene && gameScene.hanabiTextInGame) {
            gameScene.hanabiTextInGame.setText(this.hanabi.toString());
        }
    }

    queueBurst(count, delayBetween = 0.18) {
        for (let i = 0; i < count; i++) {
            const jitter = Math.random() * 0.08;
            this.burstQueue.push({ count: 1, delay: delayBetween + jitter });
        }
    }

    updateBurstQueue(gameScene, deltaTime) {
        if (this.burstCooldown > 0) {
            this.burstCooldown -= deltaTime;
        }
        while (this.burstQueue.length > 0 && this.burstCooldown <= 0) {
            const burst = this.burstQueue.shift();
            this.spawnBurst(gameScene, burst.count || 1);
            this.burstCooldown = burst.delay || 0.18;
        }
    }

    spawnBurst(gameScene, count = 1) {
        if (!gameScene) return;
        try {
            gameScene.playSfx("firework", 0.6);
        } catch {}

        if (!this.hanabiContainer) {
            this.hanabiContainer = gameScene.add.group();
        }

        const centerX = gameScene.matrixOffsetX + (gameScene.cellSize * gameScene.board.cols) / 2;
        const centerY = gameScene.matrixOffsetY + (gameScene.cellSize * gameScene.visibleRows) / 3;
        const spreadX = (gameScene.cellSize * gameScene.board.cols) * 0.65;
        const spreadY = (gameScene.cellSize * gameScene.visibleRows) * 0.4;
        const burstX = centerX + (Math.random() - 0.5) * spreadX;
        const burstY = centerY + (Math.random() - 0.5) * spreadY;

        const particlesPerBurst = 14 + Math.floor(Math.random() * 12);
        const maxActive = 140;
        const particlesToSpawn = Math.min(
            maxActive - this.hanabiParticles.length,
            Math.max(6, Math.min(28, count * particlesPerBurst))
        );

        const themes = [
            { r: 255, g: 60, b: 60 },
            { r: 60, g: 255, b: 60 },
            { r: 60, g: 120, b: 255 },
            { r: 255, g: 220, b: 60 },
            { r: 255, g: 60, b: 180 },
            { r: 60, g: 255, b: 255 },
            { r: 255, g: 255, b: 240 },
            { r: 255, g: 150, b: 40 },
            { r: 200, g: 60, b: 255 },
        ];
        const theme = themes[Math.floor(Math.random() * themes.length)];

        for (let i = 0; i < particlesToSpawn; i++) {
            let g = this.graphicsPool.pop();
            if (!g) {
                g = gameScene.add.graphics();
            } else {
                g.clear();
                g.setVisible(true);
            }

            const angle = Math.random() * Math.PI * 2;
            const speed = 45 + Math.random() * 85;
            const life = 0.5 + Math.random() * 0.35;
            const maxLife = life;
            const radius = 1.5 + Math.random() * 2.5;

            const color = Phaser.Display.Color.GetColor(
                Math.min(255, Math.max(0, theme.r + Math.floor((Math.random() - 0.5) * 70))),
                Math.min(255, Math.max(0, theme.g + Math.floor((Math.random() - 0.5) * 70))),
                Math.min(255, Math.max(0, theme.b + Math.floor((Math.random() - 0.5) * 70))),
            );

            g.fillStyle(color, 1);
            g.fillCircle(0, 0, radius);
            g.x = burstX;
            g.y = burstY;
            g.setDepth(1000);
            this.hanabiContainer.add(g);

            this.hanabiParticles.push({
                g,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 28,
                life,
                maxLife,
                drag: 0.94 + Math.random() * 0.04,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: 5 + Math.random() * 10,
            });
        }
    }

    updateParticles(deltaTime) {
        if (!this.hanabiParticles.length) return;
        const remaining = [];
        for (const p of this.hanabiParticles) {
            p.life -= deltaTime;
            if (p.life <= 0) {
                p.g.clear();
                p.g.setVisible(false);
                this.graphicsPool.push(p.g);
                continue;
            }
            p.vy += 120 * deltaTime;
            const dragFactor = Math.pow(p.drag, deltaTime * 60);
            p.vx *= dragFactor;
            p.vy *= dragFactor;
            p.g.x += p.vx * deltaTime;
            p.g.y += p.vy * deltaTime;
            const lifeRatio = p.life / p.maxLife;
            const twinkle = 0.6 + 0.4 * Math.sin(p.twinklePhase + (p.maxLife - p.life) * p.twinkleSpeed * 15);
            p.g.setAlpha(Math.max(0, lifeRatio * twinkle));
            remaining.push(p);
        }
        this.hanabiParticles = remaining;
    }

    clearParticles() {
        for (const p of this.hanabiParticles) {
            if (p.g) {
                p.g.clear();
                p.g.destroy();
            }
        }
        this.hanabiParticles = [];
        for (const g of this.graphicsPool) {
            if (g) g.destroy();
        }
        this.graphicsPool = [];
        if (this.hanabiContainer) {
            this.hanabiContainer.destroy(true);
            this.hanabiContainer = null;
        }
    }

    // Simplified Ti Easy gravity table (1/256G units converted)
    getGravitySpeed(level) {
        if (level < 8) return 4;
        if (level < 19) return 5;
        if (level < 35) return 6;
        if (level < 40) return 8;
        if (level < 50) return 10;
        if (level < 60) return 12;
        if (level < 70) return 16;
        if (level < 80) return 32;
        if (level < 90) return 48;
        if (level < 101) return 64;
        if (level < 112) return 16;
        if (level < 121) return 48;
        if (level < 132) return 80;
        if (level < 144) return 128;
        if (level < 156) return 112;
        if (level < 167) return 144;
        if (level < 177) return 176;
        if (level < 200) return 192;
        return 5120; // 20G during roll
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM3EasyMode };
}
if (typeof window !== 'undefined') {
    window.TGM3EasyMode = TGM3EasyMode;
}
