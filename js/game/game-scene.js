class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.board = new Board();
    this.board.scene = this;
    this.visibleRows = 20;
    this.bigModeActive = false;
    this.bigBlocksActive = false;
    this.bigModeBoardActive = false;
    this.currentPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    this.holdRequest = false;
    this.nextPieces = []; // Initialize next pieces array
    this.gravityTimer = 0.0;
    this.gravityAccum = 0.0;
    // lockDelay is a timer; lockDelayMax is the per-mode limit
    this.lockDelay = 0;
    this.lockDelayMax = 0.5;
    this.lockResetCount = 0; // Number of lock delay resets on current piece (SRS limit)
    // defer starting the lock timer until after the first grounded frame
    this.lockDelayBufferedStart = false;
    this.suppressPieceRenderThisFrame = false;
    this.lastGroundedY = null; // Track last grounded row for ARS lock reset rule
    this.isGrounded = false;
    this.level = 0;
    this.startingLevel = this.level; // Preserve the starting level for restarts
    this.piecesPlaced = 0; // Track pieces for level system
    this.score = 0;
    this.grade = null;
    this.internalGrade = null;
    this.gradeDisplay = null;
    this.gradeText = null;
    this.gradePointsText = null;
    this.playerNameText = null;
    this.bravoCountLabel = null;
    this.bravoCountText = null;
    this.asukaKitaLabel = null;
    this.asukaKitaText = null;
    this.roundsMedalLabels = [];
    this.roundsMedalTexts = [];
    this.minosaStatus = "possible";
    this.minosaPath = [];
    this.minosaHint = null;
    this.minosaPieceBudget = 0;
    this.minosaTargetRows = null;
    this.konohaMinosaRevision = 0;
    this.zenMinosaGuideSignature = null;
    this.hintPlacements = [];
    this.hintColor = 0xffff66;
    this.hintColorHex = "#ffff66";
    this.nextGradeText = null;
    this.levelDisplay = null;
    this.rollBonus = 0;
    this.sectionPerformance = [];
    this.coolAnnouncementsTargets = {};
    this.coolAnnouncementsShown = new Set();
    this.tgm3BagQueue = [];
    this.tgm3DroughtCounters = null;
    this.bgmInternalLevelBuffer = 0;
    this.suppressGameplayBgmForImmediateCreditsStart = false;
    this.regretAnnouncementsPending = {};
    this.regretAnnouncementsShown = new Set();
    this.coolDebugLogged = false;
    this.coolRegretText = null;
    this.coolRegretBlinkEvent = null;
    this.coolRegretHideEvent = null;
    this.bravoText = null;
    this.bravoValueText = null;
    this.bravoHideEvent = null;
    this.bravoTween = null;
    this.bravoValueTween = null;
    this.bravoActive = false;
    this.lastLineClearWasBravo = false;
    this.sectionPerfTexts = [];
    this.sectionTimes = [];
    this.torikanFailed = false;
    this.torikanChecked = { 500: false, 1000: false };
    this.torikanFailActive = false;
    this.torikanFailTimer = 0;
    this.torikanFailMessageShown = false;
    this.torikanFailGameOverShown = false;
    this.garbageCountdown = 0;
    this.garbageInterval = 1.5; // seconds between garbage rows in Shirase post-500
    this.shiraseGarbageQuota = 0; // Rising garbage quota (500-999)
    this.shiraseGarbageCounter = 0; // Counter per doc (increments per piece, decrements per line)
    this.shiraseTorikanLevel = null;
    this.monochromeApplied = false;
    this.monochromeActive = false;
    this.monochromeTextureKey = null;
    this.xrayActive = false;
    this.xrayColumn = 0;
    this.strobeActive = false;
    this.regretMessageTimer = 0;
    this.tapInternalGradeText = null;
    this.regretMessageText = null;
    this.playfieldBorder = null;
    this.gameOver = false;
    this.hudZoom = 1;
    // Calculate cell size and positioning for full screen
    this.calculateLayout();

    // DAS (Delayed Auto Shift) variables - will be set by mode
    this.dasDelay = 16 / 60; // seconds until auto-repeat starts
    this.arrDelay = 1 / 60; // seconds between repeats
    this.softDropMultiplier = 6; // soft drop speed multiplier (5–100, 100 = 20G)
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.leftInRepeat = false;
    this.rightInRepeat = false;
    this.softDropPressed = false;
    this.softDropMovedThisPiece = false;
    this.skipDASMovementAfterSpawn = false;

    // Rotation and action key states
    this.kKeyPressed = false;
    this.spaceKeyPressed = false;
    this.lKeyPressed = false;
    this.rotate180Pressed = false;
    this.xKeyPressed = false;

    // ARE (Appearance Delay) - will be set by mode
    this.areDelay = 30 / 60; // seconds until next piece appears
    this.areTimer = 0;
    this.areActive = false;
    this.lineClearDelayActive = false;
    this.lineClearDelayDuration = 0;
    this.pendingLineAREDelay = 0;
    this.pendingCompleteSequence = false;
    this.pendingStaticEndScreen = null;
    this.pendingCreditsStart = null;
    this.disableIhsIrsForZeroArr = false;
    this.zenSandboxConfig = null;
    this.zenSandboxRuntime = { bagQueue: [], bagType: null };
    this.zenCheeseTimer = 0;
    this.hasSpawnedPiece = false;
    this.garbageLinesClearedLast = 0;
    this.zenTopoutCooldown = false;
    this.zenTopoutFreezeActive = false;
    this.exitingToMenu = false;
    this.zenTopoutPendingFinish = false;
    this.zenTopoutFreezeStart = 0;
    this.zenSandboxLogOnce = false;
    this.zenTopoutFreezeLogged = false;
    this.zenGravityTime = 0;
    this.zenSandboxInitDone = false;
    this.suppressGameOverOnce = false;

    if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.ensureScene) {
      ZenSandboxHelper.ensureScene(this);
    }
    if (typeof this.tickZenCheese !== "function") {
      this.tickZenCheese = function (deltaSeconds = 0) {
        if (!this.isZenSandboxActive || !this.isZenSandboxActive()) return;
        if (!this.zenSandboxConfig || !this.board) return;
        if (this.isPaused) return;
        const { cheeseMode, cheeseInterval, cheesePercent } = this.zenSandboxConfig;
        if (cheeseMode !== "fixed_timing") return;
        if (!this.hasSpawnedPiece) return;
        const interval = Math.max(0.1, Number(cheeseInterval) || 0.1);
        const rows = 1;
        const percent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
        this.zenCheeseTimer = (this.zenCheeseTimer || 0) + deltaSeconds;
        if (this.zenCheeseTimer >= interval) {
          this.board.addCheeseRows(rows, percent);
          if (typeof this.playGarbageSfx === "function") this.playGarbageSfx(rows);
          this.zenCheeseTimer = 0;
        }
      };
    }
    // Fallback: ensure applyZenCheeseRows exists for sandbox cheese logic
    if (typeof this.applyZenCheeseRows !== "function") {
      this.applyZenCheeseRows = function (trigger, clearedCount = 0) {
        if (
          typeof GameScene !== "undefined" &&
          GameScene.prototype &&
          typeof GameScene.prototype.applyZenCheeseRows === "function"
        ) {
          return GameScene.prototype.applyZenCheeseRows.call(this, trigger, clearedCount);
        }
        return undefined;
      };
    }
    // Fallback: ensure cheese helpers exist on instance
    if (typeof this.ensureZenCheeseBaseline !== "function") {
      this.ensureZenCheeseBaseline = function (clearedCount = 0) {
        if (
          typeof GameScene !== "undefined" &&
          GameScene.prototype &&
          typeof GameScene.prototype.ensureZenCheeseBaseline === "function"
        ) {
          return GameScene.prototype.ensureZenCheeseBaseline.call(this, clearedCount);
        }
        return undefined;
      };
    }
    if (typeof this.countCheeseRows !== "function") {
      this.countCheeseRows = function () {
        if (
          typeof GameScene !== "undefined" &&
          GameScene.prototype &&
          typeof GameScene.prototype.countCheeseRows === "function"
        ) {
          return GameScene.prototype.countCheeseRows.call(this);
        }
        return 0;
      };
    }
    // Fallback: ensure handleZenTopout exists to avoid runtime errors in sandbox
    if (typeof this.handleZenTopout !== "function") {
      this.handleZenTopout = function () {
        if (
          typeof GameScene !== "undefined" &&
          GameScene.prototype &&
          typeof GameScene.prototype.handleZenTopout === "function"
        ) {
          return GameScene.prototype.handleZenTopout.call(this);
        }
        return undefined;
      };
    }
    if (typeof this.isZenSandboxActive !== "function") {
      this.isZenSandboxActive = function () {
        const modeId =
          (this.gameMode && typeof this.gameMode.getModeId === "function"
            ? this.gameMode.getModeId()
            : this.selectedMode) || "";
        const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
        return modeIdLower.includes("zen") && !!this.zenSandboxConfig;
      };
    }
    if (typeof this.getZenSpinMode !== "function") {
      this.getZenSpinMode = function () {
        if (!this.isZenSandboxActive || !this.isZenSandboxActive()) return "standard";
        return (this.zenSandboxConfig && this.zenSandboxConfig.spinType) || "standard";
      };
    }
    if (typeof this.isZenInfiniteResets !== "function") {
      this.isZenInfiniteResets = function () {
        // Ensure Zen config/runtime are loaded before filling queue so first bag uses selected randomizer
        const modeIdForZen =
          (this.gameMode && typeof this.gameMode.getModeId === "function"
            ? this.gameMode.getModeId()
            : this.selectedMode) || "";
        const isZenMode = typeof modeIdForZen === "string" && modeIdForZen.toLowerCase().includes("zen");
        if (isZenMode && (!this.zenSandboxConfig || !this.zenSandboxRuntime)) {
          if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.loadConfig) {
            const cfg = ZenSandboxHelper.loadConfig();
            this.zenSandboxConfig = cfg;
            if (ZenSandboxHelper.resetRuntime) ZenSandboxHelper.resetRuntime(this, cfg);
          }
        }
        const isZenSandbox = this.isZenSandboxActive && this.isZenSandboxActive();
        return isZenSandbox && this.zenSandboxConfig?.movementResetsInfinite;
      };
    }
    if (typeof this.getZenSandboxPiece !== "function") {
      this.getZenSandboxPiece = function () {
        // Ensure config/runtime present so the very first bag uses the selected randomizer
        if (!this.zenSandboxConfig && typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.loadConfig) {
          this.zenSandboxConfig = ZenSandboxHelper.loadConfig();
        }
        if (this.zenSandboxConfig && typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.resetRuntime) {
          if (!this.zenSandboxRuntime || this.zenSandboxRuntime.bagType !== this.zenSandboxConfig.bagType) {
            ZenSandboxHelper.resetRuntime(this, this.zenSandboxConfig);
          }
        }
        if (!this.zenSandboxConfig) return this.getRandomPiece();
        const helper = typeof ZenSandboxHelper !== "undefined" ? ZenSandboxHelper : null;
        if (helper && helper.nextPieceFromBag) {
          const piece = helper.nextPieceFromBag(this);
          return piece;
        }
        // Fallback: simple random piece using existing utilities
        const type = this.getRandomPiece ? this.getRandomPiece() : "I";
        return type;
      };
    }
    if (typeof this.updateZenSandboxDisplay !== "function") {
      this.updateZenSandboxDisplay = function () {
        if (!this.isZenSandboxActive || !this.isZenSandboxActive()) return;
        const mode = (this.zenSandboxConfig?.displayMode || "versus").toLowerCase();
        const showNone = mode === "none";
        const isReadyGo = !!this.readyGoPhase;
        const isUltraMode = this.selectedMode === "ultra";
        const isZenMode = this.selectedMode === "zen";
        const showAttack = !showNone && (mode === "versus" || mode === "efficiency");
        const showAtkPerPiece = showAttack && mode === "efficiency";
        // Hide piece/PPS metrics during Ready/Go and when display mode is none
        const showPps = !showNone && (mode === "versus" || mode === "speed" || mode === "efficiency");
        const showScore = !showNone && mode === "speed";
        const showScorePerPiece =
          (isUltraMode && !showNone) || (isZenMode && mode === "speed");
        const showFinesse =
          !showNone && (mode === "speed" || mode === "efficiency") && !!this.finesseEnabled;
        const showTime = !showNone && mode === "versus";

        const setGroupVisible = (elems, visible) => {
          elems
            .filter(Boolean)
            .forEach((el) => el.setVisible(!!visible));
        };

        const attackElems = [
          this.vsLabel,
          this.vsScoreText,
          this.attackLabel,
          this.attackTotalText,
          this.attackPerMinLabel,
          this.attackPerMinText,
        ];
        const atkPerPieceElems = [this.attackPerPieceLabel, this.attackPerPieceText];
        const ppsElems = [
          this.pieceCountLabel,
          this.pieceCountText,
          this.ppsLabel,
          this.ppsText,
          this.rawPpsLabel,
          this.rawPpsText,
        ];
        const scoreElems = [this.scoreLabel, this.scoreText];
        const scorePerPieceElems = [this.scorePerPieceLabel, this.scorePerPieceText];
        const finesseElems = [
          this.finesseInputLabel,
          this.finesseInputText,
          this.inputPerPieceLabel,
          this.inputPerPieceText,
          this.finesseTexts?.header,
          this.finesseTexts?.streakAcc,
          this.finesseTexts?.errors,
        ];
        const timeElems = [this.timeText];
        const linesElems = [
          this.levelLabel,
          this.levelDisplayLabel,
          this.levelDisplayText,
          this.levelBar,
          this.currentLevelText,
          this.capLevelText,
        ];

        setGroupVisible(attackElems, showAttack);
        setGroupVisible(atkPerPieceElems, showAtkPerPiece);
        setGroupVisible(ppsElems, showPps);
        setGroupVisible(scoreElems, showScore);
        setGroupVisible(scorePerPieceElems, showScorePerPiece);
        setGroupVisible(finesseElems, showFinesse);
        setGroupVisible(timeElems, showTime);
        setGroupVisible(linesElems, !showNone);

        if (this.spikeText) {
          const canShowSpike = showAttack && !this.readyGoPhase;
          this.spikeText.setVisible(canShowSpike);
        }
      };
    }
    this.loadZenSandboxConfig();
    if (typeof this.updateZenSandboxDisplay === "function") {
      this.updateZenSandboxDisplay();
    }

    // Line clear animation tracking
    this.clearedLines = []; // Lines being cleared for animation
    this.isClearingLines = false; // Flag for line clear animation phase
    this.lineClearPhase = false; // True during line clear ARE, false during normal ARE

    // ARE input tracking for IRS/IHS/DAS
    this.areRotationDirection = 0;
    this.areHoldPressed = false;
    this.areLeftHeld = false;
    this.areRightHeld = false;
    this.areLeftDasCharge = 0;
    this.areRightDasCharge = 0;
    this.skipDASMovementAfterSpawn = false;
    this.areRotationKeys = { k: false, space: false, l: false }; // Track which rotation keys are held during ARE

    // Enhanced scoring system
    this.comboCount = -1; // -1 means no combo active
    this.standardComboCount = -1;
    this.lastClearType = null; // 'single', 'double', 'triple', 'tetris', 'tspin'
    this.backToBack = false;
    this.totalLines = 0;
    this.lastPieceType = null;
    this.lastTetrisNoCombo = false; // Tracks a fresh tetris without prior combo for SFX chaining
    this.lastActionWasRotation = false;
    this.totalAttack = 0;
    this.totalGarbageCleared = 0;
    this.attackSpike = 0;
    this.lastAttackTime = 0;
    this.attackTotalText = null;
    this.attackPerMinText = null;
    this.attackPerPieceText = null;
    this.attackPerPieceLabel = null;
    this.spikeText = null;
    this.vsScoreText = null;
    this.scorePerPieceLabel = null;
    this.scorePerPieceText = null;
    this.inputPerPieceLabel = null;
    this.inputPerPieceText = null;
    this.spikeFadeTween = null;
    this.b2bChainText = null;
    this.b2bChainCount = -1;
    this.standardComboText = null;
    this.standardComboFadeTween = null;
    this.standardComboLastLineTime = 0;
    this.standardComboCount = -1;
    this.clearBannerGroup = null;
    this.clearBannerLine1 = null;
    this.clearBannerLine2 = null;
    this.clearBannerTween = null;
    this.clearBannerHideEvent = null;
    this.clearBannerBaseX = 0;
    this.clearBannerStartX = 0;
    this.clearBannerY = 0;
    this.clearBannerDuration = 1000;
    this.clearBannerActive = false;
    this.createClearBannerUI = (levelBottomY, scoreRowHeight, uiFontSize) => {
      const line1Font = Math.max(uiFontSize + 12, 28);
      const line2Font = Math.max(uiFontSize + 6, 22);
      const xBase = this.borderOffsetX - 80; // 50px further left
      const yBase =
        this.borderOffsetY + this.playfieldHeight / 2 - (line1Font + line2Font) / 2;

      this.clearBannerBaseX = xBase;
      this.clearBannerStartX = xBase + 30; // start right, slide left
      this.clearBannerY = yBase;

      this.clearBannerLine1 = this.add
        .text(0, 0, "", {
          fontSize: `${line1Font}px`,
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "left",
        })
        .setOrigin(0, 0);
      this.clearBannerLine2 = this.add
        .text(0, line1Font + 6, "", {
          fontSize: `${line2Font}px`,
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "left",
        })
        .setOrigin(0, 0);
      this.clearBannerGroup = this.add.container(
        this.clearBannerStartX,
        this.clearBannerY,
        [this.clearBannerLine1, this.clearBannerLine2],
      );
      this.clearBannerGroup.setAlpha(0);
      this.clearBannerGroup.setVisible(false);
      this.clearBannerGroup.setDepth(2000);
    };
    this.getPieceColorHex = (type) => {
      let colorInt = 0xffffff;
      if (this.rotationSystem === "ARS") {
        colorInt = ARS_COLORS[type] ?? colorInt;
      } else if (TETROMINOES[type] && TETROMINOES[type].color != null) {
        colorInt = TETROMINOES[type].color;
      }
      return `#${colorInt.toString(16).padStart(6, "0")}`;
    };
    this.hideClearBanner = () => {
      if (this.clearBannerHideEvent) {
        this.clearBannerHideEvent.remove(false);
        this.clearBannerHideEvent = null;
      }
      if (this.clearBannerTween) {
        this.clearBannerTween.stop();
        this.clearBannerTween = null;
      }
      if (this.clearBannerGroup) {
        this.clearBannerGroup.setVisible(false);
        this.clearBannerGroup.setAlpha(0);
        this.clearBannerGroup.x = this.clearBannerStartX || 0;
      }
      this.clearBannerActive = false;
    };
    this.showClearBanner = (clearType, spinInfo = {}, lines = 0, pieceType = null) => {
      if (
        !this.clearBannerGroup ||
        !this.clearBannerLine1 ||
        !this.clearBannerLine2
      ) {
        return;
      }
      const { isSpin } = spinInfo || {};
      const lineCount = Number(lines) || 0;
      if (lineCount === 0 && !isSpin) {
        this.hideClearBanner();
        return;
      }

      const colorHex = isSpin ? this.getPieceColorHex(pieceType) : "#ffffff";
      const line1Text = isSpin ? `${(pieceType || "").toUpperCase()}-SPIN` : "";
      let normalizedClear = clearType || "--";
      if (isSpin) {
        normalizedClear =
          normalizedClear.replace(/t-?spin\s*/i, "").trim() || normalizedClear;
      }
      normalizedClear = normalizedClear.toUpperCase();

      this.clearBannerLine1.setText(line1Text).setColor(colorHex);
      this.clearBannerLine1.setVisible(!!line1Text);
      const line2Y = isSpin ? this.clearBannerLine1.height + 6 : 0;
      this.clearBannerLine2.setY(line2Y);
      this.clearBannerLine2.setText(normalizedClear || "--").setColor(colorHex);

      this.clearBannerGroup.setVisible(true);
      this.clearBannerGroup.setAlpha(0);
      this.clearBannerGroup.x = this.clearBannerStartX;

      if (this.clearBannerTween) {
        this.clearBannerTween.stop();
        this.clearBannerTween = null;
      }
      if (this.clearBannerHideEvent) {
        this.clearBannerHideEvent.remove(false);
        this.clearBannerHideEvent = null;
      }

      this.clearBannerTween = this.tweens.add({
        targets: this.clearBannerGroup,
        x: this.clearBannerBaseX,
        alpha: 1,
        duration: 200,
        ease: "Sine.easeOut",
      });

      this.clearBannerActive = true;
      this.clearBannerHideEvent = this.time.delayedCall(
        this.clearBannerDuration,
        () => this.hideClearBanner(),
        [],
        this,
      );
    };
    this.spinRotatedWhileGrounded = false;

    this.isTSpin = false;

    // Piece active time tracking for scoring
    this.pieceActiveTime = 0;
    this.pieceSpawnTime = 0;

    // Drop tracking for scoring
    this.softDropRows = 0;
    this.hardDropRows = 0;

    // Time tracking for grade system
    this.startTime = null;
    this.currentTime = 0;
    this.bestTime = null;
    this.gradeHistory = [];
    this.sectionTimes = []; // Track time for each 100-level section
    this.sectionCoolTimes = []; // Track time to *70 per section for COOL

    this.sectionStartTime = 0;
    this.currentSection = 0;
    this.sectionTetrises = [];
    this.currentSectionTetrisCount = 0;
    this.section70Captured = new Set();

    // Piece per second tracking
    this.totalPiecesPlaced = 0; // Total pieces that have entered the playfield
    this.activeTime = 0; // Time spent not in ARE (piece movement time)
    this.areTime = 0; // Time spent in ARE phases
    this.conventionalPPS = 0; // PPS including ARE time
    this.rawPPS = 0; // PPS excluding ARE time
    this.maxPpsRecorded = 0;
    this.worstChoke = 0; // Longest active time (frames) for a single piece
    this.ppsHistory = [];
    this.ppsLockSampleIndices = [];
    this.ppsSampleTimer = 0;
    this.ppsSampleInterval = 0.5; // seconds
    this.ppsGraphGraphics = null;
    this.ppsGraphArea = null;
    this.ppsLegendText = null;
    this.ppsSummaryText = null;

    // Leaderboard tracking
    this.leaderboardSaved = false;

    // Finesse tracking (SRS only)
    this.finesseEnabled = false;
    this.finesseErrors = 0;
    this.finessePieces = 0;
    this.finesseCleanPieces = 0;
    this.finesseInputCount = 0;
    this.finesseStreak = 0;
    this.finesseCurrentInputs = { moves: 0, rotations: 0 };
    this.finesseTexts = {
      header: null,
      streakAcc: null,
      errors: null,
    };
    this.finesseInputText = null;
    this.zenSandboxPanelGroup = null;
    this.finesseInputLabel = null;
    this.finesseActiveForPiece = false;
    this.finesseLastAccuracy = 0;

    // Sections and level caps
    this.sectionCap = 99; // Start at first section cap
    this.sectionTransition = false;
    this.sectionMessage = null;
    this.sectionMessageTimer = 0;

    // Piece randomizer history (TGM1 system)
    this.pieceHistory = ["Z", "Z", "S", "S"]; // Start with [Z,Z,S,S] as specified
    this.pieceHistoryIndex = 0; // Current position in history for rotation
    this.firstPiece = true; // Track if this is the first piece
    this.isFirstSpawn = true; // Track if this is the first spawn for level setting
    // 7-bag randomizer queue (used by guideline-style modes)
    this.bagQueue = [];
    this.bagDrawCount = 0;
    this.bagDebugSeen = new Set();

    // Validate piece history to ensure it's correct
    this.validatePieceHistory();
    // Reset spin/hanabi for new run
    this.spinRotatedWhileGrounded = false;
    this.levelMaxSoundPlayed = false;
    this.lastBellLevel = -1;
    this.pendingCompleteSequence = false;
    this.pendingStaticEndScreen = null;
    this.pendingCreditsStart = null;

    // Pause functionality
    this.isPaused = false;
    this.pauseOverlay = null;

    // BGM system
    this.stage1BGM = null;
    this.stage2BGM = null;
    this.currentBGM = null;
    this.bgmEnabled = true;
    this.bgmTracks = {};
    this.bgmStarted = false;

    // Loop point configuration for BGM tracks
    this.loopPoints = {
      stage1: { start: 56.862, end: 113.708 },
      stage2: { start: 97.622, end: 203.217 },
    };

    this.bgmLoopTimer = null;

    // Track if BGM has been played for the first time
    this.bgmFirstPlay = {
      stage1: true,
      stage2: true,
    };

    // Re-apply mode timing configuration in case restart reset defaults
    this.applyModeConfiguration();
    this.applyInitialGradeFromMode();


    // Credits system
    this.creditsActive = false;
    this.creditsTimer = 0;
    this.creditsDuration = 61.6; // 61.60 seconds
    this.creditsText = null;
    this.creditsScrollSpeed = 0.5; // pixels per frame
    this.creditsAlpha = 1;
    this.congratulationsActive = false;
    this.gameComplete = false;
    this.level999Reached = false; // Track when level 999 is reached for TGM behavior
    this.creditsFinalized = false;
    this.creditsBgmStarted = false;
    this.rollFailedDuringRoll = false;
    this.creditsTopoutLockActive = false;
    this.creditsFinishPending = false;
    this.creditsRevealFinishPending = false;
    this.creditsFadeInDone = false;
    this.gameOverStatePrepared = false;
    this.creditsSkipArmed = false;

    this.invisibleStackActive = false;
    this.fadingRollActive = false;
    this.minoFadeActive = false;
    this.minoFadeReversed = false;
    this.minoFadeProgress = 0;
    this.minoFadeDelay = 30 / 60; // seconds between each row fade (will be calculated dynamically)
    this.minoFadeTimer = 0;
    this.minoFadePerRowDuration = 0;
    this.placedMinos = []; // Track all placed minos for fading
    this.placedMinoRows = []; // Track rows containing minos for row-by-row fading
    this.fadingComplete = false; // Track when fading is complete
    this.minoRowFadeAlpha = {}; // Row -> alpha during fading
    this.rollType = null; // 'fading' or 'mroll'
    this.rollLinesCleared = 0;
    this.rollFadeLastExpireTime = 0;
    this.creditsTransitionStartTime = null;
    this.gameOverFadeDoneTime = null;
    this.showGameOverText = false;
    this.gameOverMessage = "GAME OVER";
    this.gameOverSubMessage = "";
    this.gameOverMessageColor = null;
    this.gameOverSubMessageColor = null;
    this.preserveGameOverMessage = false;
    this.pendingCompleteSequence = false;
    this.pendingStaticEndScreen = null;
    this.pendingCreditsStart = null;
    this.preserveBoardOnStaticEnd = false;
    this.gameOverAutoExitDelay = 10;
    this.exitingToMenu = false;

    this.gameOverTextDelay = 3; // seconds until GAME OVER text appears
    this.gameOverTextTimer = 0;
    this.showGameOverText = false;
    this.gameOverSfxPlayed = false;

    // GM grade tracking
    this.gmConditions = {
      level300: { achieved: false, time: 0, score: 0 },
      level500: { achieved: false, time: 0, score: 0 },
      level999: { achieved: false, time: 0, score: 0 },
    };

    // Rotation system selection
    this.rotationSystem =
      localStorage.getItem("rotationSystem") || "SRS"; // 'SRS' or 'ARS'
    this.arsMoveResetEnabled =
      (localStorage.getItem("arsMoveReset") || "false") === "true";
    this.rotationSystemDisplay = null;
    this.initialGradeBaseline = null;
    this.initialGradeBaselineValue = null;
    this.initialInternalGradeBaseline = null;

    // Keybind and IRS display
    this.irsActivated = false;

    // FPS limiter
    this.lastUpdateTime = 0;
    this.deltaTime = 1 / 60; // Default delta time

    // Pause time tracking
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.metricsPauseActive = false;
    this.metricsPauseStart = null;

    // Mode and best score tracking
    this.selectedMode = null;
    this.gameMode = null; // Will be set by init method

    // Loading and ready-go phases
    this.loadingPhase = true;
    this.readyGoPhase = false;
    this.gameStarted = false;

    // Game over timer
    this.gameOverTimer = 0;

    // Soft drop ground sound tracking
    this.wasGroundedDuringSoftDrop = false;

    // Preview piece shown during Ready/Go
    this.previewPiece = null;

    // Section stop handling (TGM-style)
    this.levelStopActive = false;
  }

  markKonohaMinosaDirty() {
    this.konohaMinosaRevision = (this.konohaMinosaRevision || 0) + 1;
  }

  isNormalOrEasyMode() {
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const id = typeof modeId === "string" ? modeId.toLowerCase() : "";
    return id.includes("normal") || id.includes("easy");
  }

  // Get border color based on selected mode
  getModeTypeBorderColor() {
    if (
      this.gameMode &&
      this.gameMode.modeId &&
      typeof getModeManager !== "undefined"
    ) {
      const modeManager = getModeManager();
      const color = modeManager.modeColors[this.gameMode.modeId];
      return color || 0xffffff;
    }

    return 0xffffff; // Default white
  }

  getOverlayModeInfo() {
    const modeId = getModeInfoId(this.gameMode, this.selectedMode);
    const modeNameHint =
      (this.gameMode && typeof this.gameMode.getName === "function"
        ? this.gameMode.getName()
        : this.selectedMode) || modeId;
    return buildModeInfo(modeId, modeNameHint);
  }

  formatTimeValue(seconds) {
    if (seconds === null || seconds === undefined) return "--:--.--";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const cs = Math.floor((seconds % 1) * 100);
    return `${minutes}:${secs.toString().padStart(2, "0")}.${cs
      .toString()
      .padStart(2, "0")}`;
  }

  getSectionLength() {
    return this.selectedMode === "marathon" ? 10 : 100;
  }

  getSectionBasisValue() {
    return this.selectedMode === "marathon" ? this.totalLines : this.level;
  }

  // Finesse tracking helpers
  incrementFinesseMove() {
    if (
      !this.finesseEnabled ||
      !this.finesseActiveForPiece ||
      !this.currentPiece ||
      !this.currentPiece.finesseInputs
    ) {
      return;
    }
    this.currentPiece.finesseInputs.moves += 1;
  }

  recordFinesseInput() {
    if (this.areActive) return;
    this.finesseInputCount += 1;
    this.updateFinesseInputUI();
  }

  incrementFinesseRotation() {
    if (
      !this.finesseEnabled ||
      !this.finesseActiveForPiece ||
      !this.currentPiece ||
      !this.currentPiece.finesseInputs
    ) {
      return;
    }
    this.currentPiece.finesseInputs.rotations += 1;
  }

  resetFinessePieceInputs(piece) {
    if (!piece || !this.finesseEnabled) return;
    piece.finesseInputs = { moves: 0, rotations: 0 };
    this.finesseActiveForPiece = true;
  }

  evaluateFinesseOnLock(piece) {
    if (!this.finesseEnabled || !piece) return;
    const leftCol = getLeftmostColumn(piece);
    const minimalMoves = getSrsMinimalMoves(piece.type, piece.rotation, leftCol);
    const minimalRotations = getSrsMinimalRotations(piece.type, piece.rotation);
    if (minimalMoves === null || minimalRotations === null) {
      return;
    }
    const actual = computeFinesseActual(piece);
    const moveOveruse = Math.max(0, actual.moves - minimalMoves);
    const rotationOveruse = Math.max(0, actual.rotations - minimalRotations);
    const pieceErrors = moveOveruse + rotationOveruse; // each extra input counts as 1 error

    this.finessePieces += 1;
    if (pieceErrors > 0) {
      this.finesseErrors += pieceErrors;
      this.finesseStreak = 0;
    } else {
      this.finesseCleanPieces += 1;
      this.finesseStreak += 1;
    }
    const clean = Math.max(0, this.finesseCleanPieces);
    this.finesseLastAccuracy =
      this.finessePieces > 0 ? (clean / this.finessePieces) * 100 : 100;
    this.updateFinesseUI();
  }

  updateFinesseUI() {
    const { header, streakAcc, errors } = this.finesseTexts;
    const mode = (this.zenSandboxConfig?.displayMode || "versus").toLowerCase();
    const allowByMode =
      !this.zenSandboxConfig || mode === "speed" || mode === "efficiency";
    const visible = this.finesseEnabled && allowByMode && header && streakAcc && errors;
    if (!header || !streakAcc || !errors) return;
    header.setVisible(visible);
    streakAcc.setVisible(visible);
    errors.setVisible(visible);
    if (!visible) return;
    const streakVal = this.finesseStreak;
    const accVal =
      this.finessePieces > 0
        ? Math.max(0, Math.min(100, this.finesseLastAccuracy))
        : 100;
    const errorVal = this.finesseErrors;
    streakAcc.setText(`${streakVal.toString()}   ${accVal.toFixed(1)}%`);
    errors.setText(`${errorVal} errors`);
  }

  updateFinesseInputUI() {
    const mode = (this.zenSandboxConfig?.displayMode || "versus").toLowerCase();
    const allowByMode = !this.zenSandboxConfig || mode === "speed" || mode === "efficiency";
    const show =
      !!(
        this.finesseEnabled &&
        allowByMode &&
        this.finesseInputLabel &&
        this.finesseInputText &&
        this.inputPerPieceLabel &&
        this.inputPerPieceText
      );
    if (
      !this.finesseInputLabel ||
      !this.finesseInputText ||
      !this.inputPerPieceLabel ||
      !this.inputPerPieceText
    )
      return;
    this.finesseInputLabel.setVisible(show);
    this.finesseInputText.setVisible(show);
    this.inputPerPieceLabel.setVisible(show);
    this.inputPerPieceText.setVisible(show);
    if (!show) return;
    const inputs = this.finesseInputCount || 0;
    const pieces = Math.max(1, this.totalPiecesPlaced || 0);
    const inputsPerPiece = inputs / pieces;
    this.finesseInputText.setText(`${inputs}`);
    this.inputPerPieceText.setText(inputsPerPiece.toFixed(2));
  }

  getMaxSectionsForTracker() {
    if (this.selectedMode === "marathon") {
      const targetLines =
        this.gameMode && typeof this.gameMode.targetLines === "number"
          ? this.gameMode.targetLines
          : 999;
      return Math.ceil(targetLines / this.getSectionLength());
    }
    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    if (modeId === "tgm3_shirase") {
      return 13;
    }
    if (
      modeId === "tgm4_rounds" ||
      modeId === "tgm4_asuka_normal" ||
      modeId === "tgm4_asuka_hard"
    ) {
      const displayCap =
        this.gameMode && typeof this.gameMode.getDisplayLevelCap === "function"
          ? this.gameMode.getDisplayLevelCap()
          : this.gameMode && typeof this.gameMode.getGravityLevelCap === "function"
            ? this.gameMode.getGravityLevelCap()
            : this.gravityLevelCap || 999;
      return Math.max(1, Math.ceil(Math.max(1, displayCap) / this.getSectionLength()));
    }
    return 10;
  }

  isPuzzleMode(modeId) {
    return modeId === "tgm3_sakura";
  }

  modeUsesGrading() {
    const modeConfig = this.gameMode ? this.gameMode.getConfig() : {};
    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    const isKonohaMode =
      typeof modeId === "string" &&
      (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"));
    return modeConfig.hasGrading !== false && !isKonohaMode;
  }

  getGradeValue(grade) {
    const gradeValues = {
      9: 0,
      8: 1,
      7: 2,
      6: 3,
      5: 4,
      4: 5,
      3: 6,
      2: 7,
      1: 8,
      S1: 9,
      S2: 10,
      S3: 11,
      S4: 12,
      S5: 13,
      S6: 14,
      S7: 15,
      S8: 16,
      S9: 17,
      M: 18,
      GM: 19,
    };
    return gradeValues[grade] || 0;
  }

  getGradeLineValue(lineColor) {
    const values = {
      none: 0,
      green: 1,
      orange: 2,
    };
    const normalized = String(lineColor || "none").toLowerCase();
    return values[normalized] || 0;
  }

  compareEntries(modeId, a, b) {
    const getVal = (val) => (val === undefined || val === null ? 0 : val);
    const parseNumTime = (t) => {
      if (!t || typeof t !== "string") return Number.POSITIVE_INFINITY;
      const parts = t.split(":");
      if (parts.length !== 2) return Number.POSITIVE_INFINITY;
      const [m, s] = parts;
      const sec = parseFloat(s);
      if (Number.isNaN(sec)) return Number.POSITIVE_INFINITY;
      const minutes = parseInt(m, 10);
      if (Number.isNaN(minutes)) return Number.POSITIVE_INFINITY;
      return minutes * 60 + sec;
    };

    const byGrade = () =>
      this.getGradeValue(getVal(b.grade)) - this.getGradeValue(getVal(a.grade)) ||
      this.getGradeLineValue(getVal(b.gradeLineColor)) -
        this.getGradeLineValue(getVal(a.gradeLineColor));
    const byDesc = (x, y) => getVal(y) - getVal(x);
    const byAsc = (x, y) => getVal(x) - getVal(y);

    switch (modeId) {
      case "tgm2_normal": // Normal
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "easy_easy": // Easy
        return (
          byDesc(a.hanabi, b.hanabi) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "sprint_40":
      case "sprint_100": // Sprint
        return (
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.score, b.score) ||
          byDesc(a.pps, b.pps)
        );
      case "ultra": // Ultra
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.pps, b.pps)
        );
      case "marathon": // Marathon
        return (
          byDesc(a.lines, b.lines) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.pps, b.pps)
        );
      case "konoha_easy":
      case "konoha_hard": // All Clear
        return (
          byDesc(a.allClears, b.allClears) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm1":
      case "tgm2":
      case "tgm2_master":
      case "tgm_plus":
      case "tgm3":
      case "tgm3_master":
      case "tgm4":
      case "master_20g":
      case "tadeath":
      case "ta_death":
      case "shirase":
      case "tgm4_rounds":
      case "asuka_easy":
      case "asuka_normal":
      case "asuka_hard": // Master, 20G, Race
        return (
          byGrade() ||
          byDesc(a.level, b.level) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm3_sakura": // Puzzle
        return (
          byDesc(a.stage, b.stage) ||
          byDesc(a.completionRate, b.completionRate) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      default:
        // Generic: prefer score desc, time asc
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
    }
  }

  init(data) {

    this.selectedMode = data.mode || "Mode 1";
    this.gameMode = data.gameMode || null;

    // Reset first-piece state for fresh runs (handles returning from main menu)
    this.pieceHistory = ["Z", "Z", "S", "S"];
    this.pieceHistoryIndex = 0;
    this.firstPiece = true;
    this.isFirstSpawn = true;
    this.bagQueue = [];
    this.bagDrawCount = 0;
    this.bagDebugSeen = new Set();

    // Load mode if not provided
    if (!this.gameMode && typeof getModeManager !== "undefined") {
      const modeManager = getModeManager();
      this.gameMode = modeManager.getMode(this.selectedMode);
    } else if (this.gameMode === null) {
      const modeManager = getModeManager();
      this.gameMode = modeManager.getMode(this.selectedMode);
    }

    // Fallback to default if no mode loaded
    if (!this.gameMode) {
      console.warn("No game mode loaded, using fallback configuration");
      this.gameMode = {
        getConfig: () => ({
          gravity: { type: "tgm1", value: 0, curve: null },
          das: 16 / 60,
          arr: 1 / 60,
          are: 30 / 60,
          lockDelay: 0.5,
          nextPieces: 1,
          holdEnabled: false,
          ghostEnabled: true,
          levelUpType: "piece",
          lineClearBonus: 1,
          gravityLevelCap: 999,
          specialMechanics: {},
        }),
        getGravitySpeed: (level) => this.getTGM1GravitySpeed(level),
        getName: () => "Fallback Mode",
      };
    }

    const modeStartingLevelCap = getStartingLevelCapForMode(this.gameMode);
    this.startingLevel = normalizeStartLevel(
      data.startingLevel !== undefined
        ? data.startingLevel
        : getConfiguredStartingLevel(modeStartingLevelCap),
      {
        maxLevel: modeStartingLevelCap,
      },
    );
    this.level = this.startingLevel;
    this.customStartingLevelActive = this.startingLevel > 0;
    this.suppressGameplayBgmForImmediateCreditsStart = false;
    this.roundsDebugMedals = normalizeRoundsDebugMedalCount(data.roundsDebugMedals);

    // Ensure mode-dependent timing/gravity state reflects configured starting level.
    this.syncModeStateToStartingLevel();

    // Apply mode configuration to game settings
    this.applyModeConfiguration();
    this.applyInitialGradeFromMode();

    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeNameHint =
      (this.gameMode && typeof this.gameMode.getName === "function"
        ? this.gameMode.getName()
        : this.selectedMode) || modeId;
    createOrUpdateGlobalOverlay(this, buildModeInfo(modeId, modeNameHint));
  }

  getPlayerDisplayName() {
    const achievementName =
      typeof window.achievementSystem !== "undefined"
        ? window.achievementSystem.getPlayerName()
        : null;
    if (typeof achievementName === "string" && achievementName.trim()) {
      return achievementName.trim();
    }

    try {
      const storedName = localStorage.getItem("mino_player_name");
      if (typeof storedName === "string" && storedName.trim()) {
        return storedName.trim();
      }
    } catch (e) {
      console.warn("[GameScene] Failed to load player name:", e);
    }

    return "Player";
  }

  applyInitialGradeFromMode() {
    const modeConfig = this.gameMode ? this.gameMode.getConfig() : {};
    const hasGrading = this.modeUsesGrading();

    if (!hasGrading) {
      this.grade = null;
      this.internalGrade = null;
      this.initialGradeBaseline = null;
      this.initialGradeBaselineValue = null;
      this.initialInternalGradeBaseline = null;
      return;
    }

    // Reset mode grading state if supported
    if (this.gameMode) {
      if (typeof this.gameMode.resetGrading === "function") {
        this.gameMode.resetGrading(this);
      }
      if (this.gameMode.tgm2Grading && typeof this.gameMode.tgm2Grading.reset === "function") {
        this.gameMode.tgm2Grading.reset();
      }
      if (this.gameMode.tgm3Grading && typeof this.gameMode.tgm3Grading.reset === "function") {
        this.gameMode.tgm3Grading.reset();
      }
    }

    // Always start from the mode's lowest grade (or default "9"), ignoring any carried-over state
    // or mode getters that might be holding previous run values.
    const configLowestGrade =
      modeConfig && typeof modeConfig.lowestGrade === "string"
        ? modeConfig.lowestGrade
        : null;
    const baselineGrade = configLowestGrade ?? "9";
    const baselineInternal =
      typeof modeConfig.initialInternalGrade === "number"
        ? modeConfig.initialInternalGrade
        : 0;

    this.initialGradeBaseline = baselineGrade;
    this.initialGradeBaselineValue = this.getGradeValue(baselineGrade);
    this.initialInternalGradeBaseline = baselineInternal;

    this.grade = baselineGrade;
    this.internalGrade = baselineInternal;

    // If UI already exists, refresh visibility/text
    this.updateGradeUIVisibility?.();

    // Lock in baseline before any pieces spawn
    this.totalPiecesPlaced = 0;
  }

  syncModeStateToStartingLevel() {
    const modeStartingLevelCap = getStartingLevelCapForMode(this.gameMode);
    const startLevel = normalizeStartLevel(
      this.startingLevel !== undefined && this.startingLevel !== null
        ? this.startingLevel
        : this.level,
      { maxLevel: modeStartingLevelCap },
    );
    this.level = startLevel;
    if (!this.gameMode) return;

    const coolBonus = typeof this.gameMode.coolBonus === "number" ? this.gameMode.coolBonus : 0;
    const internalLevel = startLevel + coolBonus;

    if (
      Object.prototype.hasOwnProperty.call(this.gameMode, "internalLevel") ||
      typeof this.gameMode.updateTimingPhase === "function"
    ) {
      this.gameMode.internalLevel = internalLevel;
    }
    if (Object.prototype.hasOwnProperty.call(this.gameMode, "displayLevel")) {
      this.gameMode.displayLevel = startLevel;
    }
    if (Object.prototype.hasOwnProperty.call(this.gameMode, "bgmStopLevel")) {
      this.gameMode.bgmStopLevel = internalLevel;
    }
    if (typeof this.gameMode.updateTimingPhase === "function") {
      this.gameMode.updateTimingPhase(internalLevel);
    }
  }

  shouldUseStackFadeCredits() {
    return (
      this.selectedMode === "tgm2" ||
      this.selectedMode === "tgm2_master" ||
      this.selectedMode === "tgm3" ||
      this.selectedMode === "tgm3_master" ||
      this.selectedMode === "tgm3_easy" ||
      this.selectedMode === "tgm3_shirase" ||
      this.selectedMode === "shirase"
    );
  }

  handleReachedMaxLevel(context = {}) {
    const type = context.type || "piece";
    const amount = context.amount ?? 1;
    const maxLevel =
      typeof context.maxLevel === "number"
        ? context.maxLevel
        : this.gameMode && typeof this.gameMode.getDisplayLevelCap === "function"
          ? this.gameMode.getDisplayLevelCap()
          : this.gameMode
            ? this.gameMode.getGravityLevelCap()
            : 999;
    const oldLevel =
      typeof context.oldLevel === "number" ? context.oldLevel : Math.max(0, maxLevel - 1);
    const lastSectionIndex =
      typeof context.lastSectionIndex === "number" ? context.lastSectionIndex : this.currentSection;
    const continueSpawnAfterImmediateCredits =
      context.continueSpawnAfterImmediateCredits === true;

    if (
      this.gameMode &&
      typeof this.gameMode.onSectionComplete === "function" &&
      typeof this.sectionTimes[lastSectionIndex] === "number"
    ) {
      try {
        this.gameMode.onSectionComplete(
          this,
          lastSectionIndex,
          this.sectionTimes[lastSectionIndex],
        );
      } catch (e) {
        console.warn("[maxLevel] onSectionComplete failed", e);
      }
    }

    this.level999Reached = true;
    const maxLevelHandled =
      this.gameMode && typeof this.gameMode.onReachedMaxLevel === "function"
        ? !!this.gameMode.onReachedMaxLevel(this, {
            type,
            amount,
            oldLevel,
            maxLevel,
            lastSectionIndex,
          })
        : false;
    if (maxLevelHandled) {
      this.updateBGM();
      return true;
    }

    if (this.shouldUseStackFadeCredits()) {
      if (continueSpawnAfterImmediateCredits) {
        this.suppressGameplayBgmForImmediateCreditsStart = true;
      }
      this.creditsPending = true;
      this.creditsTransitionStartTime = this.time?.now ?? Date.now();
      this.invisibleStackActive = false;
      this.fadingRollActive = false;
      if (this.lineClearDelayActive || type === "lines") {
        this.pendingCompleteSequence = true;
      } else {
        this.startMinoFading();
      }
      this.updateBGM();
      return true;
    }

    if (this.gameMode && typeof this.gameMode.onCreditsStart === "function") {
      this.gameMode.onCreditsStart(this);
    }
    const modeCredits =
      this.gameMode && typeof this.gameMode.getConfig === "function"
        ? this.gameMode.getConfig()?.specialMechanics?.creditsDuration
        : undefined;
    if (continueSpawnAfterImmediateCredits) {
      this.suppressGameplayBgmForImmediateCreditsStart = true;
    }
    this.startCredits(modeCredits != null ? modeCredits : undefined);
    if (
      continueSpawnAfterImmediateCredits &&
      this.creditsBGM &&
      !this.creditsBgmStarted &&
      this.bgmEnabled &&
      !this.isPaused
    ) {
      this.creditsBGM.play();
      this.creditsBgmStarted = true;
    }
    this.updateBGM();
    return false;
  }

  markGroundedSpin() {
    this.spinRotatedWhileGrounded = true;
    if (
      this.gameMode &&
      typeof this.gameMode.onRotateWhileGrounded === "function"
    ) {
      this.gameMode.onRotateWhileGrounded(this);
    }
  }

  getHintModeId() {
    return (
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || ""
    );
  }

  isKonohaHintMode(modeId = this.getHintModeId()) {
    return typeof modeId === "string" && (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"));
  }

  isZenMinosaGuideEnabled(modeId = this.getHintModeId()) {
    const id = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const guideMode = String(this.zenSandboxConfig?.minosaGuideMode || "off").toLowerCase();
    return id.includes("zen") && guideMode !== "off";
  }

  getZenMinosaGuideConfig() {
    const cfg = this.zenSandboxConfig || {};
    return {
      guideMode: typeof cfg.minosaGuideMode === "string" ? cfg.minosaGuideMode : "off",
      lookahead: Math.max(1, Math.min(5, Math.round(Number(cfg.minosaGuideLookahead) || 3))),
      candidateLimit: Math.max(1, Math.min(16, Math.round(Number(cfg.minosaGuideCandidateLimit) || 8))),
    };
  }

  normalizeMinosaGuidePiece(piece) {
    const type =
      typeof piece === "string"
        ? piece
        : typeof piece?.type === "string"
          ? piece.type
          : typeof piece?.piece === "string"
            ? piece.piece
            : null;
    return typeof type === "string" ? type.toUpperCase() : null;
  }

  isValidMinosaHintStep(step) {
    return !!(
      step &&
      typeof step.piece === "string" &&
      Number.isFinite(step.x) &&
      Number.isFinite(step.y)
    );
  }

  getZenMinosaGuideSignature() {
    if (!this.board?.grid) return "";
    const config = this.getZenMinosaGuideConfig();
    let boardSignature = "";
    for (let r = 0; r < this.board.rows; r++) {
      const row = this.board.grid[r];
      for (let c = 0; c < this.board.cols; c++) {
        boardSignature += row[c] ? "1" : "0";
      }
    }
    const queueSignature = Array.isArray(this.nextPieces)
      ? this.nextPieces
          .map((piece) => this.normalizeMinosaGuidePiece(piece))
          .filter((piece) => piece)
          .join("")
      : "";
    return [
      config.guideMode,
      config.lookahead,
      config.candidateLimit,
      this.rotationSystem || "",
      this.board.rows,
      this.board.cols,
      boardSignature,
      this.normalizeMinosaGuidePiece(this.currentPiece) || "",
      queueSignature,
      this.normalizeMinosaGuidePiece(this.holdPiece) || "",
      this.canHold !== false ? "1" : "0",
    ].join("|");
  }

  updateZenMinosaGuideHint(modeId = this.getHintModeId()) {
    if (!this.isZenMinosaGuideEnabled(modeId)) {
      this.zenMinosaGuideSignature = null;
      this.minosaStatus = "possible";
      this.minosaPath = [];
      this.minosaHint = null;
      return null;
    }

    const signature = this.getZenMinosaGuideSignature();
    if (signature && signature === this.zenMinosaGuideSignature) {
      return this.isValidMinosaHintStep(this.minosaHint) ? this.minosaHint : null;
    }

    this.zenMinosaGuideSignature = signature;
    let minosa = typeof getMinosaInstance === "function" ? getMinosaInstance() : null;
    if (!minosa && typeof Minosa !== "undefined") {
      minosa =
        typeof Minosa.getSharedInstance === "function"
          ? Minosa.getSharedInstance()
          : new Minosa();
    }

    const result =
      minosa && typeof minosa.evaluateGuideGameScene === "function"
        ? minosa.evaluateGuideGameScene(this, this.getZenMinosaGuideConfig())
        : null;
    const path = Array.isArray(result?.path)
      ? result.path.filter((step) => this.isValidMinosaHintStep(step))
      : [];
    const hint = this.isValidMinosaHintStep(result?.hint) ? result.hint : path[0] || null;
    this.minosaStatus = hint ? "possible" : "impossible";
    this.minosaPath = path;
    this.minosaHint = hint;
    return hint;
  }

  getPrimaryMinosaHint(modeId = this.getHintModeId()) {
    const isKonohaMode = this.isKonohaHintMode(modeId);
    const isZenMinosaMode = this.isZenMinosaGuideEnabled(modeId);
    if (!isKonohaMode && !isZenMinosaMode) return null;
    if (isZenMinosaMode) {
      this.updateZenMinosaGuideHint(modeId);
    }
    const minosaStatus = this.gameMode?.minosaStatus || this.minosaStatus || "";
    if (minosaStatus !== "possible") return null;
    const sceneMinosaPath = this.gameMode?.minosaPath || this.minosaPath || [];
    const path = Array.isArray(sceneMinosaPath)
      ? sceneMinosaPath.filter(
          (step) =>
            step &&
            typeof step.piece === "string" &&
            Number.isFinite(step.x) &&
            Number.isFinite(step.y),
        )
      : [];
    if (path.length > 0) return path[0];
    const sceneMinosaHint = this.gameMode?.minosaHint || this.minosaHint || null;
    return sceneMinosaHint && typeof sceneMinosaHint.piece === "string"
      ? sceneMinosaHint
      : null;
  }

  drawHintPieceOverlay(graphics, piece, offsetX, offsetY, cellSize, options = {}) {
    if (!graphics || !piece || !Array.isArray(piece.shape)) return;
    const hiddenRows =
      options.hiddenRows !== undefined
        ? options.hiddenRows
        : Math.max(0, (this.board?.rows || 0) - (this.visibleRows || 0));
    const minimumBoardY =
      options.minimumBoardY !== undefined ? options.minimumBoardY : hiddenRows;
    const lineWidth =
      options.lineWidth !== undefined ? options.lineWidth : Math.max(3, Math.floor(cellSize * 0.14));
    const color = options.color !== undefined ? options.color : this.hintColor;
    const alpha = options.alpha !== undefined ? options.alpha : 0.95;
    const inset = Math.min(cellSize * 0.35, Math.max(1, lineWidth / 2));
    const outlineSize = Math.max(1, cellSize - inset * 2);
    graphics.lineStyle(lineWidth, color, alpha);

    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        const pieceY = piece.y + r;
        if (pieceY < minimumBoardY) continue;
        graphics.strokeRect(
          offsetX + (piece.x + c) * cellSize - cellSize / 2 + inset,
          offsetY + (pieceY - hiddenRows) * cellSize - cellSize / 2 + inset,
          outlineSize,
          outlineSize,
        );
      }
    }
  }

  hideBravoBanner() {
    this.bravoActive = false;
    if (this.bravoHideEvent) {
      this.bravoHideEvent.remove(false);
      this.bravoHideEvent = null;
    }
    if (this.bravoTween) {
      this.bravoTween.stop();
      this.bravoTween = null;
    }
    if (this.bravoValueTween) {
      this.bravoValueTween.stop();
      this.bravoValueTween = null;
    }
    if (this.bravoText) {
      this.bravoText.setVisible(false);
    }
    if (this.bravoValueText) {
      this.bravoValueText.setVisible(false);
    }
  }

  updatePlacementHint() {
    if (!this.hintGraphics) return;
    this.hintGraphics.clear();
    const modeId = this.getHintModeId();
    const isKonohaMode = this.isKonohaHintMode(modeId);
    const isZenMinosaMode = this.isZenMinosaGuideEnabled(modeId);
    if (
      !this.currentPiece ||
      this.areActive ||
      this.gameOver ||
      this.lineClearDelayActive ||
      this.loadingPhase ||
      this.readyGoPhase ||
      !(this.isNormalOrEasyMode() || isKonohaMode || isZenMinosaMode)
    ) {
      this.hintPlacement = null;
      this.hintPlacements = [];
      this.hintSignature = null;
      return;
    }

    const minosaHint = this.getPrimaryMinosaHint(modeId);
    if ((isKonohaMode || isZenMinosaMode) && !minosaHint) {
      this.hintPlacement = null;
      this.hintPlacements = [];
      this.hintSignature = null;
      return;
    }
    const hintPieceType = minosaHint ? minosaHint.piece : this.currentPiece.type;

    const rows = this.board.rows;
    const cols = this.board.cols;
    const baseGrid = this.board.grid;
    let boardSignature = "";
    for (let r = 0; r < rows; r++) {
      const row = baseGrid[r];
      for (let c = 0; c < cols; c++) {
        boardSignature += row[c] ? "1" : "0";
      }
    }
    const minosaHintSignature = minosaHint
      ? `${minosaHint.piece}|${minosaHint.x}|${minosaHint.y}|${minosaHint.rotation}|${minosaHint.usedHold ? "1" : "0"}|${minosaHint.source || ""}`
      : "";
    const hintSignature = `${hintPieceType}|${this.rotationSystem}|${rows}x${cols}|${boardSignature}|${minosaHintSignature}`;

    if (this.hintSignature !== hintSignature) {
      if (minosaHint && Number.isFinite(minosaHint.x) && Number.isFinite(minosaHint.y)) {
        const hintRotation = Number.isInteger(minosaHint.rotation) ? minosaHint.rotation : 0;
        const hintPiece = new Piece(hintPieceType, this.rotationSystem, hintRotation);
        hintPiece.x = minosaHint.x;
        hintPiece.y = minosaHint.y;
        this.hintPlacement = hintPiece;
        this.hintPlacements = [hintPiece];
        this.hintSignature = hintSignature;
      } else {
      const makeGridWithPiece = (piece) => {
        const grid = baseGrid.map((row) => row.slice());
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (!piece.shape[r][c]) continue;
            const gx = piece.x + c;
            const gy = piece.y + r;
            if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) {
              grid[gy][gx] = 1;
            }
          }
        }
        return grid;
      };

      const computeHeights = (grid) => {
        const heights = Array(cols).fill(0);
        for (let x = 0; x < cols; x++) {
          let y = 0;
          while (y < rows && grid[y][x] === 0) y++;
          heights[x] = rows - y;
        }
        return heights;
      };

      const scorePlacement = (piece) => {
        const grid = makeGridWithPiece(piece);
        const heights = computeHeights(grid);

        // Holes: empty cell with at least one filled above
        let holes = 0;
        let coveredHoles = 0;
        for (let x = 0; x < cols; x++) {
          let seenBlock = false;
          for (let y = 0; y < rows; y++) {
            const filled = grid[y][x] !== 0;
            if (filled) {
              seenBlock = true;
            } else if (seenBlock) {
              holes++;
              // Covered hole: if there is also a block immediately above
              if (y > 0 && grid[y - 1][x] !== 0) coveredHoles++;
            }
          }
        }

        // Surface stats
        const maxHeight = Math.max(...heights);
        const aggregateHeight = heights.reduce((a, b) => a + b, 0);
        let bumpiness = 0;
        for (let i = 0; i < cols - 1; i++) {
          bumpiness += Math.abs(heights[i] - heights[i + 1]);
        }

        // Ceiling penalty (hidden rows: y < 2)
        let aboveCeilPenalty = 0;
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (!piece.shape[r][c]) continue;
            const gy = piece.y + r;
            if (gy < 2) {
              aboveCeilPenalty += (2 - gy) * 50;
            }
          }
        }

        // Weighted score (lower is better)
        const score =
          holes * 1000 +
          coveredHoles * 800 +
          bumpiness * 5 +
          aggregateHeight * 2 +
          maxHeight * 3 +
          aboveCeilPenalty +
          piece.x * 0.01; // slight tie-breaker to favor leftmost

        return score;
      };

      const placements = [];
      const rotations = [0, 1, 2, 3];
      const pieceType = hintPieceType;
      for (const rot of rotations) {
        const shape = new Piece(pieceType, this.rotationSystem, rot).shape;
        const width = shape[0].length;
        for (let x = -2; x < this.board.cols; x++) {
          const tmpPiece = new Piece(pieceType, this.rotationSystem, rot);
          tmpPiece.x = x;
          tmpPiece.y = -4;
          // Move down until collision
          while (this.board.isValidPosition(tmpPiece, tmpPiece.x, tmpPiece.y + 1)) {
            tmpPiece.y += 1;
          }
          if (!this.board.isValidPosition(tmpPiece, tmpPiece.x, tmpPiece.y)) {
            continue;
          }
          // Skip if out of bounds horizontally
          if (tmpPiece.x < -2 || tmpPiece.x + width > this.board.cols + 2) {
            continue;
          }

          const score = scorePlacement(tmpPiece);
          placements.push({ score, piece: tmpPiece });
        }
      }

      if (!placements.length) {
        this.hintPlacement = null;
        this.hintPlacements = [];
        this.hintSignature = hintSignature;
        return;
      }
      placements.sort((a, b) => a.score - b.score);
      this.hintPlacement = placements[0].piece;
      this.hintPlacements = [placements[0].piece];
      this.hintSignature = hintSignature;
      }
    }

    const hintPlacement = this.hintPlacement || null;
    if (!hintPlacement) return;
    const startRow = 2;
    const cell = this.cellSize;
    const offX = this.matrixOffsetX;
    const offY = this.matrixOffsetY;
    this.drawHintPieceOverlay(this.hintGraphics, hintPlacement, offX, offY, cell, {
      hiddenRows: startRow,
      minimumBoardY: startRow,
      lineWidth: Math.max(4, Math.floor(cell * 0.16)),
    });

    // Apply smooth blink (alpha oscillation)
    const blinkSpeed = 2; // Hz
    const t = this.time.now / 1000;
    const alpha = 0.55 + 0.15 * (1 + Math.sin(2 * Math.PI * blinkSpeed * t));
    this.hintGraphics.setAlpha(Math.min(1, Math.max(0, alpha)));
    if (isKonohaMode) {
      this.hintGraphics.setDepth(9500);
      this.children.bringToTop(this.hintGraphics);
    }
  }

  preload() {
    // Assets are loaded in AssetLoaderScene
    // This preload is intentionally empty to avoid duplicate loading
  }

  // Timing helpers (ms-backed storage, frame-facing UI)
  getStoredTiming(key, defaultValue) {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultValue;
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }

  setStoredTiming(key, value) {
    localStorage.setItem(key, value);
  }

  framesToMs(frames) {
    return (frames / 60) * 1000;
  }

  msToFrames(ms) {
    return (ms / 1000) * 60;
  }

  getTimingMs(key, defaultFrames) {
    const defaultMs = this.framesToMs(defaultFrames);
    const raw = this.getStoredTiming(key, defaultMs);
    if (!Number.isFinite(raw)) return defaultMs;
    // Backward compatibility: treat plausible frame values as frames
    if (raw >= 0 && raw <= 120 && raw <= defaultFrames * 2) {
      return this.framesToMs(raw);
    }
    return raw;
  }

  getTimingFrames(key, defaultFrames) {
    const ms = this.getTimingMs(key, defaultFrames);
    return this.msToFrames(ms);
  }

  setTimingFromFrames(key, frames) {
    const ms = this.framesToMs(frames);
    this.setStoredTiming(key, ms);
  }

  getGameplayHudZoomSetting() {
    const defaultZoom = 1;
    const minZoom = 0.75;
    const maxZoom = 1.25;
    const raw = parseFloat(localStorage.getItem("gameplayHudZoom"));
    if (!Number.isFinite(raw)) return defaultZoom;
    return Math.min(maxZoom, Math.max(minZoom, raw));
  }

  setGameplayHudZoomSetting(value, { refresh = true } = {}) {
    const minZoom = 0.75;
    const maxZoom = 1.25;
    const clamped = Math.round(Math.min(maxZoom, Math.max(minZoom, value)) * 100) / 100;
    localStorage.setItem("gameplayHudZoom", clamped.toString());
    this.hudZoom = clamped;
    if (refresh) {
      this.applyGameplayHudZoom({ forceRedraw: true });
    }
    return clamped;
  }

  adjustGameplayHudZoom(delta) {
    const currentZoom = this.getGameplayHudZoomSetting();
    const nextZoom = currentZoom + delta;
    return this.setGameplayHudZoomSetting(nextZoom);
  }

  updatePowerupStatusLayout() {
    if (!this.powerupStatusText || !this.powerupStatusText.scene) return;
    const powerupLabelSize = Math.max(12, Math.floor(this.cellSize * 0.6));
    this.powerupStatusText.setPosition(this.borderOffsetX, this.borderOffsetY - 28);
    this.powerupStatusText.setStyle({ fontSize: `${powerupLabelSize}px` });
  }

  destroyResponsiveUi() {
    const destroyRef = (key) => {
      const target = this[key];
      if (target && typeof target.destroy === "function") {
        try {
          target.destroy();
        } catch (error) {
        }
      }
      this[key] = null;
    };

    const destroyTextGroup = (items) => {
      items.forEach((item) => {
        if (item && typeof item.destroy === "function") {
          try {
            item.destroy();
          } catch (error) {
          }
        }
      });
    };

    if (this.clearBannerHideEvent) {
      this.clearBannerHideEvent.remove(false);
      this.clearBannerHideEvent = null;
    }
    if (this.clearBannerTween) {
      this.clearBannerTween.stop();
      this.clearBannerTween = null;
    }
    if (this.clearBannerGroup) {
      this.clearBannerGroup.destroy(true);
      this.clearBannerGroup = null;
    }
    this.clearBannerLine1 = null;
    this.clearBannerLine2 = null;

    if (this.sectionTrackerGroup) {
      this.sectionTrackerGroup.destroy(true);
      this.sectionTrackerGroup = null;
    }
    if (this.zenSandboxPanelGroup) {
      this.zenSandboxPanelGroup.destroy(true);
      this.zenSandboxPanelGroup = null;
    }

    [
      "gradeDisplay",
      "gradeText",
      "gradePointsText",
      "nextGradeText",
      "levelLabel",
      "levelDisplayLabel",
      "levelDisplayText",
      "currentLevelText",
      "capLevelText",
      "levelBar",
      "scoreLabel",
      "scoreText",
      "scorePerPieceLabel",
      "scorePerPieceText",
      "vsLabel",
      "vsScoreText",
      "attackLabel",
      "attackTotalText",
      "attackPerMinLabel",
      "attackPerMinText",
      "attackPerPieceLabel",
      "attackPerPieceText",
      "finesseInputLabel",
      "finesseInputText",
      "inputPerPieceLabel",
      "inputPerPieceText",
      "pieceCountLabel",
      "pieceCountText",
      "ppsLabel",
      "ppsText",
      "rawPpsLabel",
      "rawPpsText",
      "playerNameText",
      "timeText",
      "coolRegretText",
      "hanabiLabel",
      "hanabiTextInGame",
      "bravoCountLabel",
      "bravoCountText",
      "asukaKitaLabel",
      "asukaKitaText",
      "ppsSummaryText",
      "ppsGraphGraphics",
      "ppsLegendText",
      "staffRollBonusText",
      "tapInternalGradeText",
      "powerupStatusText",
    ].forEach(destroyRef);

    destroyTextGroup(this.roundsMedalLabels || []);
    destroyTextGroup(this.roundsMedalTexts || []);
    destroyTextGroup(Object.values(this.finesseTexts || {}).filter(Boolean));

    this.roundsMedalLabels = [];
    this.roundsMedalTexts = [];
    this.finesseTexts = {};
    this.halfTimeTexts = null;
    this.sectionSectionLabels = null;
    this.sectionTimeTexts = null;
    this.sectionTotalTexts = null;
    this.sectionTallyTexts = null;
    this.sectionPerfTexts = [];
    this.playfieldBorder = null;
  }

  handleViewportResize(viewport = {}) {
    this.calculateLayout(viewport);
    this.applyGameplayHudZoom();
    this.destroyResponsiveUi();
    this.setupUI();
    this.updatePowerupStatusLayout();
    if (this.versusHUD && typeof this.versusHUD.relayout === "function") {
      this.versusHUD.relayout();
    }
  }

  applyGameplayHudZoom({ forceRedraw = false } = {}) {
    const zoom = this.getGameplayHudZoomSetting();
    this.hudZoom = zoom;
    this.uiScale = zoom;
    const camera = this.cameras?.main;
    if (camera) {
      camera.setZoom(zoom);
      const cameraCenterX = (this.scale?.width || camera.width) / 2;
      const cameraCenterY = (this.scale?.height || camera.height) / 2;
      camera.centerOn(cameraCenterX, cameraCenterY);
    }
    if (this.globalOverlayTexts) {
      createOrUpdateGlobalOverlay(this, this.getOverlayModeInfo());
    }
    if (forceRedraw && typeof this.draw === "function") {
      this.draw();
    }
  }

  // Apply mode-specific configuration to game settings
  applyModeConfiguration() {
    if (!this.gameMode) {
      console.warn("No gameMode available, using default configuration");
      return;
    }

    const config = this.gameMode.getConfig();

    if (!config) {
      console.warn("No config found in gameMode, using default");
      return;
    }

    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isEligibleTimingOverride = [
      "sprint_40",
      "sprint_100",
      "sprint",
      "ultra",
      "zen",
      "marathon",
    ].some(
      (id) => modeIdLower.includes(id),
    );
    this.isEligibleTimingOverride = isEligibleTimingOverride;

    // Rotation system + ARS reset behavior
    const storedRotation = localStorage.getItem("rotationSystem") || "SRS";
    const configRotation = config.rotationSystem || null;
    this.rotationSystem = configRotation || storedRotation;

    const storedArsMoveReset =
      (localStorage.getItem("arsMoveReset") || "false") === "true";
    const configArsMoveReset =
      config.specialMechanics && typeof config.specialMechanics.arsMoveResetEnabled === "boolean"
        ? config.specialMechanics.arsMoveResetEnabled
        : null;
    this.arsMoveResetEnabled =
      configArsMoveReset !== null ? configArsMoveReset : storedArsMoveReset;

    // Apply timing configurations - use mode methods if available for progressive timings
    // Timing overrides now stored in milliseconds for precision
    // Base timings from mode, then override with user settings for eligible modes (user wins)
    this.dasDelay =
      this.gameMode.getDAS && typeof this.gameMode.getDAS === "function"
        ? this.gameMode.getDAS()
        : config.das || 16 / 60;
    if (isEligibleTimingOverride) {
      const storedDasFrames = this.getTimingFrames("timing_das_frames", 10); // slider default 10f
      const clamped = Math.min(Math.max(storedDasFrames, 1), 20);
      this.dasDelay = clamped / 60;
    }
    this.disableIhsIrsForZeroArr = false;

    this.arrDelay =
      this.gameMode.getARR && typeof this.gameMode.getARR === "function"
        ? this.gameMode.getARR()
        : config.arr || 1 / 60;
    if (isEligibleTimingOverride) {
      const storedArrFrames = this.getTimingFrames("timing_arr_frames", 2); // slider default 2f
      const clamped = Math.min(Math.max(storedArrFrames, 0), 5);
      this.arrDelay = clamped / 60;
    }
    if (isEligibleTimingOverride && this.arrDelay <= 0) {
      this.disableIhsIrsForZeroArr = true;
    }
    this.areOverride = null;
    this.areDelay =
      this.gameMode.getARE && typeof this.gameMode.getARE === "function"
        ? this.gameMode.getARE()
        : config.are || 30 / 60;
    if (isEligibleTimingOverride) {
      const storedAreFrames = this.getTimingFrames("timing_are_frames", 7); // slider default 7f
      const clamped = Math.min(Math.max(storedAreFrames, 0), 60);
      this.areDelay = clamped / 60;
      this.areOverride = clamped / 60;
    }
    this.lineAreOverride = null;
    this.lineClearDelayOverride = null;
    if (isEligibleTimingOverride) {
      const storedLineAreFrames = this.getTimingFrames("timing_line_are_frames", 7); // slider default 7f
      const clamped = Math.min(Math.max(storedLineAreFrames, 0), 60);
      this.lineAreOverride = clamped / 60;
      this.lineClearDelayOverride = clamped / 60;
    }

    // If ARR is zero, force zero ARE/line ARE/line clear delay to spawn immediately and disable IHS/IRS
    if (this.disableIhsIrsForZeroArr) {
      this.areDelay = 0;
      this.areOverride = 0;
      this.lineAreOverride = 0;
      this.lineClearDelayOverride = 0;
    }
    // Soft drop speed multiplier (keep as-is, scalar not time-based)
    // Non-Standard modes: fixed 1G speed (1 row per frame)
    this.softDropMultiplier = 1;
    if (this.usesStandardDropBehavior()) {
      const storedSdf = this.getStoredTiming("timing_sdf_mult", null);
      if (storedSdf !== null) {
        const clamped = Math.min(Math.max(storedSdf, 5), 100);
        this.softDropMultiplier = clamped;
      } else {
        this.softDropMultiplier = config.softDropMultiplier || 6;
      }
    }

    // Debug: detailed timing state
    const rawDasMs = this.getStoredTiming("timing_das_frames", null);
    const rawArrMs = this.getStoredTiming("timing_arr_frames", null);
    const rawAreMs = this.getStoredTiming("timing_are_frames", null);
    const rawLineAreMs = this.getStoredTiming("timing_line_are_frames", null);
    const timingDebug = {
      modeId,
      isEligibleTimingOverride,
      stored: {
        das: rawDasMs,
        arr: rawArrMs,
        are: rawAreMs,
        lineAre: rawLineAreMs,
        sdf: this.getStoredTiming("timing_sdf_mult", null),
      },
      appliedFrames: {
        das: Math.round(this.dasDelay * 60 * 1000) / 1000,
        arr: Math.round(this.arrDelay * 60 * 1000) / 1000,
        are: Math.round(this.areDelay * 60 * 1000) / 1000,
        lineAre:
          this.lineAreOverride !== null
            ? Math.round(this.lineAreOverride * 60 * 1000) / 1000
            : null,
      },
      appliedSeconds: {
        das: this.dasDelay,
        arr: this.arrDelay,
        are: this.areDelay,
        lineAre: this.lineAreOverride,
      },
      softDropMultiplier: this.softDropMultiplier,
    };
    this.lockDelayMax =
      this.gameMode.getLockDelay &&
      typeof this.gameMode.getLockDelay === "function"
        ? this.gameMode.getLockDelay()
        : config.lockDelay || 0.5;

    // Apply other configurations
    this.nextPiecesCount = config.nextPieces || 1;
    this.holdEnabled = config.holdEnabled || false;
    this.ghostEnabled = typeof config.ghostEnabled === "boolean" ? config.ghostEnabled : true;
    if (this.isTgm4Mode()) {
      this.nextPiecesCount = 6;
      this.holdEnabled = true;
    }
    if (this.isNormalOrEasyMode()) {
      this.ghostEnabled = true;
    }
    this.hintGraphics = null;
    this.hintPlacement = null;
    this.hintPlacements = [];
    this.spinRotatedWhileGrounded = false;
    this.levelUpType = config.levelUpType || "piece";
    this.lineClearBonus = config.lineClearBonus || 1;
    this.gravityLevelCap = config.gravityLevelCap || 999;
    this.nextPiecesCount = config.nextPieces || 1; // Number of next pieces to show

    // Store modeId for easy reference
    this.modeId = this.gameMode.modeId || null;

    // Enable finesse tracking only for SRS and sprint/ultra modes
    const isSprintMode =
      this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100";
    const isUltraMode = this.selectedMode === "ultra";
    const isZenMode = this.selectedMode === "zen";
    this.finesseEnabled =
      this.rotationSystem === "SRS" && (isSprintMode || isUltraMode || isZenMode);
    if (!this.finesseEnabled) {
      this.finesseErrors = 0;
      this.finessePieces = 0;
      this.finesseCleanPieces = 0;
      this.finesseInputCount = 0;
      this.finesseStreak = 0;
      this.finesseCurrentInputs = { moves: 0, rotations: 0 };
      this.finesseActiveForPiece = false;
      this.finesseLastAccuracy = 0;
      this.updateFinesseInputUI?.();
    }

    // Debug: log applied timing overrides for eligible modes
    if (isEligibleTimingOverride) {
      console.log("[TimingOverride]", {
        modeId,
        dasFrames: Math.round(this.dasDelay * 60),
        arrFrames: Math.round(this.arrDelay * 60),
        areFrames: Math.round(this.areDelay * 60),
        lineAreFrames:
          this.lineAreOverride !== null ? Math.round(this.lineAreOverride * 60) : null,
        sdfMult: this.softDropMultiplier,
      });
    }
  }

  // Leaderboard helpers (GameScene)
  isPuzzleMode(modeId) {
    return modeId === "tgm3_sakura";
  }

  getGradeValue(grade) {
    const gradeValues = {
      9: 0,
      8: 1,
      7: 2,
      6: 3,
      5: 4,
      4: 5,
      3: 6,
      2: 7,
      1: 8,
      S1: 9,
      S2: 10,
      S3: 11,
      S4: 12,
      S5: 13,
      S6: 14,
      S7: 15,
      S8: 16,
      S9: 17,
      M: 18,
      GM: 19,
    };
    return gradeValues[grade] || 0;
  }

  compareEntries(modeId, a, b) {
    const getVal = (val) => (val === undefined || val === null ? 0 : val);
    const parseNumTime = (t) => {
      if (!t || typeof t !== "string") return Number.POSITIVE_INFINITY;
      const parts = t.split(":");
      if (parts.length !== 2) return Number.POSITIVE_INFINITY;
      const [m, s] = parts;
      const sec = parseFloat(s);
      if (Number.isNaN(sec)) return Number.POSITIVE_INFINITY;
      const minutes = parseInt(m, 10);
      if (Number.isNaN(minutes)) return Number.POSITIVE_INFINITY;
      return minutes * 60 + sec;
    };

    const byGrade = () =>
      this.getGradeValue(getVal(b.grade)) - this.getGradeValue(getVal(a.grade));
    const byDesc = (x, y) => getVal(y) - getVal(x);
    const byAsc = (x, y) => getVal(x) - getVal(y);

    switch (modeId) {
      case "tgm2_normal": // Normal
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "easy_easy": // Easy
        return (
          byDesc(a.hanabi, b.hanabi) ||
          byDesc(a.lines, b.lines) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "easy_hard": // Hard
        return (
          byDesc(a.hanabi, b.hanabi) ||
          byDesc(a.lines, b.lines) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm2_master":
      case "tgmplus":
      case "tgm2_death":
        return (
          byDesc(a.level, b.level) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byGrade()
        );
      case "marathon":
      case "ultra":
      case "zen":
      case "sprint_40":
      case "sprint_100":
        return (
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.lines, b.lines) ||
          byDesc(a.score, b.score)
        );
      default:
        // Generic: prefer score desc, time asc
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
    }
  }

  shouldAllowAREInputs() {
    const lineAre = this.lineAreOverride || 0;
    const lineClearDelay = this.lineClearDelayOverride || 0;
    return this.areDelay > 0 || this.pendingLineAREDelay > 0 || lineAre > 0 || lineClearDelay > 0;
  }

  resetActiveDASState() {
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.leftInRepeat = false;
    this.rightInRepeat = false;
  }

  updateBufferedDASInput(leftPressed, rightPressed, deltaSeconds) {
    this.areLeftHeld = !!leftPressed;
    this.areRightHeld = !!rightPressed;
    this.areLeftDasCharge = this.areLeftHeld
      ? Math.min(this.dasDelay, (this.areLeftDasCharge || 0) + deltaSeconds)
      : 0;
    this.areRightDasCharge = this.areRightHeld
      ? Math.min(this.dasDelay, (this.areRightDasCharge || 0) + deltaSeconds)
      : 0;
  }

  primeDASForSpawn(allowDasInputs) {
    const leftHeldAtSpawn = allowDasInputs && this.areLeftHeld;
    const rightHeldAtSpawn = allowDasInputs && this.areRightHeld;
    const leftChargeAtSpawn = leftHeldAtSpawn ? Math.min(this.dasDelay, this.areLeftDasCharge || 0) : 0;
    const rightChargeAtSpawn = rightHeldAtSpawn ? Math.min(this.dasDelay, this.areRightDasCharge || 0) : 0;

    this.resetActiveDASState();

    if (leftHeldAtSpawn) {
      this.leftKeyPressed = true;
      this.leftTimer = leftChargeAtSpawn;
    }
    if (rightHeldAtSpawn) {
      this.rightKeyPressed = true;
      this.rightTimer = rightChargeAtSpawn;
    }
    if (leftHeldAtSpawn || rightHeldAtSpawn) {
      this.skipDASMovementAfterSpawn = true;
    }

    this.areLeftHeld = false;
    this.areRightHeld = false;
    this.areLeftDasCharge = 0;
    this.areRightDasCharge = 0;
  }

  getLeaderboard(modeId) {
    const key = `leaderboard_${modeId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice().sort((a, b) => this.compareEntries(modeId, a, b));
        }
      } catch (e) {
        console.warn("Failed to parse leaderboard", modeId, e);
      }
    }

    // Fallback: migrate legacy single best score if present
    const legacyKey = `bestScore_${modeId}`;
    const legacyStored = localStorage.getItem(legacyKey);
    if (legacyStored && this.getBestScore) {
      const legacy = this.getBestScore(modeId);
      const migrated = [legacy];
      localStorage.setItem(key, JSON.stringify(migrated));
      return migrated;
    }
    return [];
  }

  saveLeaderboardEntryToModeId(modeId, entry) {
    if ((this.startingLevel || 0) > 0) return;
    const key = `leaderboard_${modeId}`;
    const list = this.getLeaderboard(modeId);
    list.push(entry);
    const deduped = [];
    const seen = new Set();
    list
      .filter(Boolean)
      .sort((a, b) => this.compareEntries(modeId, a, b))
      .forEach((e) => {
        const sig = JSON.stringify({
          time: e.time,
          score: e.score,
          allClears: e.allClears,
          level: e.level,
          grade: e.grade,
          gradeLineColor: e.gradeLineColor,
          lines: e.lines,
          pps: e.pps,
        });
        if (!seen.has(sig)) {
          seen.add(sig);
          deduped.push(e);
        }
      });
    const capped = deduped.slice(0, this.isPuzzleMode(modeId) ? 1 : 5);
    localStorage.setItem(key, JSON.stringify(capped));
    this.leaderboardSaved = true;
  }

  saveLeaderboardEntry(modeId, entry) {
    this.saveLeaderboardEntryToModeId(modeId, entry);

    const selectedModeId =
      typeof this.selectedMode === "string" && this.selectedMode !== "Mode 1"
        ? this.selectedMode
        : null;

    if (selectedModeId && selectedModeId !== modeId) {
      this.saveLeaderboardEntryToModeId(selectedModeId, entry);
    }
  }

  calculateLayout(viewport = {}) {
    const windowWidth = Math.max(
      1,
      Math.floor(
        viewport.width ||
        this.scale?.width ||
        this.cameras?.main?.width ||
        window.innerWidth,
      ),
    );
    const windowHeight = Math.max(
      1,
      Math.floor(
        viewport.height ||
        this.scale?.height ||
        this.cameras?.main?.height ||
        window.innerHeight,
      ),
    );

    const maxCellWidth = Math.floor((windowWidth * 0.8) / this.board.cols);
    const maxCellHeight = Math.floor((windowHeight * 0.9) / this.visibleRows);
    const maxCellSize = this.bigModeBoardActive ? 80 : 40;
    this.hudZoom = this.getGameplayHudZoomSetting();
    this.uiScale = this.hudZoom;
    this.cellSize = Math.min(maxCellWidth, maxCellHeight, maxCellSize);

    // Ensure minimum cell size for readability
    this.cellSize = Math.max(this.cellSize, 20);

    this.playfieldWidth = this.cellSize * this.board.cols;
    this.playfieldHeight = this.cellSize * this.visibleRows;

    this.borderOffsetX = Math.floor((windowWidth - this.playfieldWidth) / 2);
    this.borderOffsetY =
      Math.floor((windowHeight - this.playfieldHeight) / 2) - 30; // Adjusted for better centering

    this.matrixOffsetX = this.borderOffsetX + 17 + (this.bigModeBoardActive ? 20 : 0);
    this.matrixOffsetY = this.borderOffsetY + 20 + (this.bigModeBoardActive ? 20 : 0);

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;

    if (this.cameras?.main) {
      if (typeof this.cameras.main.setSize === "function") {
        this.cameras.main.setSize(windowWidth, windowHeight);
      }
      this.cameras.main.centerOn(windowWidth / 2, windowHeight / 2);
    }

    if (this.globalOverlayTexts) {
      createOrUpdateGlobalOverlay(this, this.getOverlayModeInfo());
    }
  }

  applyBigModeBoardDimensions(dimensions = {}) {
    const rows = Number.isInteger(dimensions.rows) ? dimensions.rows : 12;
    const cols = Number.isInteger(dimensions.cols) ? dimensions.cols : 5;
    const visibleRows = Number.isInteger(dimensions.visibleRows) ? dimensions.visibleRows : 10;
    const previousBoard = this.board;
    if (previousBoard && previousBoard.rows === rows && previousBoard.cols === cols) {
      this.board = previousBoard;
      this.board.scene = this;
      this.visibleRows = visibleRows;
      this.bigModeBoardActive = true;
      this.calculateLayout();
      return;
    }
    const board = new Board(rows, cols);
    if (previousBoard && previousBoard.grid && (previousBoard.rows !== rows || previousBoard.cols !== cols)) {
      for (let r = 0; r < visibleRows; r++) {
        for (let c = 0; c < cols; c++) {
          const sourceRows = [2 + r * 2, 2 + r * 2 + 1];
          const sourceCols = [c * 2, c * 2 + 1];
          let sourceCell = 0;
          let sourceFade = 0;
          let sourceFrozen = false;
          for (const sourceRow of sourceRows) {
            for (const sourceCol of sourceCols) {
              const cell = previousBoard.grid[sourceRow]?.[sourceCol];
              if (!sourceCell && cell) sourceCell = cell;
              sourceFade = Math.max(sourceFade, previousBoard.fadeGrid?.[sourceRow]?.[sourceCol] || 0);
              sourceFrozen = sourceFrozen || !!previousBoard.frozenGrid?.[sourceRow]?.[sourceCol];
            }
          }
          const targetRow = 2 + r;
          board.grid[targetRow][c] = sourceCell && typeof sourceCell === "object" ? { ...sourceCell } : sourceCell;
          board.fadeGrid[targetRow][c] = sourceFade;
          board.frozenGrid[targetRow][c] = sourceFrozen;
        }
      }
    }
    this.board = board;
    this.board.scene = this;
    this.visibleRows = visibleRows;
    this.bigModeBoardActive = true;
    this.calculateLayout();
  }

  positionPieceAtSpawn(piece) {
    if (!piece || !this.board || !Array.isArray(piece.shape)) return;
    const pieceWidth = piece.shape.reduce((maxWidth, row) => {
      let rightmost = -1;
      for (let c = 0; c < row.length; c++) {
        if (row[c]) rightmost = c;
      }
      return Math.max(maxWidth, rightmost + 1);
    }, 0);
    piece.x = Math.max(0, Math.floor((this.board.cols - pieceWidth) / 2));
    piece.y = 1;
  }

  setupUI() {
    const uiFontSize = Math.max(
      16,
      Math.min(24, Math.floor(this.cellSize * 0.8)),
    );
    const largeFontSize = Math.max(
      20,
      Math.min(32, Math.floor(this.cellSize * 1.2)),
    );
    const xlargeFontSize = Math.max(
      28,
      Math.min(48, Math.floor(this.cellSize * 1.8)),
    );
    const timeFontSize = Math.max(
      24,
      Math.min(40, Math.floor(this.cellSize * 1.5)),
    ); // Larger for time

    // UI positioned to the left of border, moved 50px right
    const uiX = Math.max(20, this.borderOffsetX - 200) + 50;

    // Grade display - next to matrix on left, right-aligned, moved 25px right
    // Only show for modes that use grading
    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    const modeConfig = this.gameMode ? this.gameMode.getConfig() : {};
    const hasGrading = this.modeUsesGrading();
    const specialMechanics = modeConfig.specialMechanics || {};
    const isTADeathMode = modeId === "tadeath" || modeId === "ta_death";
    const isTGM2Mode =
      Boolean(specialMechanics.tgm2Grading) ||
      (typeof modeId === "string" && modeId.startsWith("tgm2"));
    const isTgm3 = modeId === "tgm3_master" || modeId === "tgm3" || modeId === "tgm3_shirase" || modeId === "shirase";
    const isTgm4 = typeof modeId === "string" && modeId.startsWith("tgm4");
    const hideGradePoints =
      isTADeathMode ||
      modeId === "tgm1" ||
      modeId === "master_20g" ||
      modeId === "tgm3_shirase" ||
      modeId === "shirase" ||
      (!isTgm3 &&
        this.gameMode &&
        typeof this.gameMode.isTwentyGMode === "function" &&
        this.gameMode.isTwentyGMode());
    this.shouldShowGradePoints = !hideGradePoints;
    this.shouldShowNextGradeText =
      hasGrading &&
      !isTADeathMode &&
      !isTGM2Mode &&
      !isTgm4 &&
      modeId !== "tgm3_master" &&
      modeId !== "tgm3" &&
      modeId !== "tgm3_shirase" &&
      modeId !== "shirase";

    if (hasGrading) {
      const gradeX = uiX + 25;
      const isTgm3Master = modeId === "tgm3_master" || modeId === "tgm3";
      const isShiraseMode = modeId === "tgm3_shirase" || modeId === "shirase";
      // Push grade down in Ti-like modes so it doesn't overlap HOLD
      const gradeYOffset = isTgm3Master || isShiraseMode || isTgm4 ? 140 : 0;
      const gradeY = this.borderOffsetY + gradeYOffset;
      const gradeWidth = 80;
      this.gradeDisplay = this.add.graphics();
      this.gradeDisplay.lineStyle(2, 0xffffff);
      this.gradeDisplay.strokeRect(gradeX, gradeY, gradeWidth, 80);
      const initialDisplayedGrade =
        this.initialGradeBaseline !== null && this.initialGradeBaseline !== undefined
          ? this.initialGradeBaseline
          : (this.grade ?? "9");
      this.grade = initialDisplayedGrade;
      const gradeTextValue = this.grade ?? "9";
      const gradeVisible = !!gradeTextValue;
      this.gradeText = this.add
        .text(gradeX + gradeWidth / 2, gradeY + 40, gradeTextValue, {
          fontSize: `${xlargeFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "center",
        })
        .setOrigin(0.5);
      this.gradeDisplay.setVisible(gradeVisible);
      this.gradeText.setVisible(gradeVisible);
      if (this.gradePointsText) {
        this.gradePointsText.destroy();
        this.gradePointsText = null;
      }
      if (this.shouldShowGradePoints) {
        this.gradePointsText = this.add
          .text(gradeX + gradeWidth / 2, gradeY + 90, "0", {
            fontSize: `${largeFontSize - 4}px`,
            fill: "#ffffff",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          })
          .setOrigin(0.5, 0);
        this.gradePointsText.setVisible(gradeVisible);
      }
      if (this.shouldShowNextGradeText) {
        if (this.nextGradeText) {
          this.nextGradeText.destroy();
          this.nextGradeText = null;
        }
        this.nextGradeText = this.add
          .text(gradeX + gradeWidth / 2, gradeY + 130, "", {
            fontSize: `${uiFontSize - 2}px`,
            fill: "#cccccc",
            fontFamily: "Courier New",
            fontStyle: "normal",
            align: "center",
          })
          .setOrigin(0.5, 0);
        this.nextGradeText.setWordWrapWidth(gradeWidth * 1.5);
        this.nextGradeText.setVisible(gradeVisible);
        this.updateNextGradeText();
      } else if (this.nextGradeText) {
        this.nextGradeText.destroy();
        this.nextGradeText = null;
      }
      this.updateGradeUIVisibility();
    }

    // Level display - next to matrix on left, right-aligned, moved 60px up and 20px right
    const levelBottomY = this.borderOffsetY + this.playfieldHeight - 60;
    const levelRowHeight = 20; // Decreased spacing
    const levelFontSize = Math.max(
      24,
      Math.min(36, Math.floor(this.cellSize * 1.0)),
    ); // Increased font

    // Determine mode types
    const isMarathonMode = !!(this.selectedMode && this.selectedMode === "marathon");
    const isUltraMode = !!(this.selectedMode && this.selectedMode === "ultra");
    const isZenMode = !!(this.selectedMode === "zen");
    const isKonohaMode =
      typeof modeId === "string" &&
      (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"));
    const isSprintMode = !!(
      this.selectedMode &&
      (this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100")
    );
    const isLineCountMode = !!(
      isMarathonMode || isUltraMode || isZenMode || isSprintMode
    );

    // For Marathon mode, add separate level display above
    if (isMarathonMode) {
      this.levelDisplayLabel = this.add
        .text(uiX + 135, levelBottomY - 4.5 * levelRowHeight - 83, "LEVEL", {
          fontSize: `${uiFontSize - 4}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(1, 0);
      this.levelDisplayText = this.add
        .text(uiX + 140, levelBottomY - 4 * levelRowHeight - 83, "1", {
          fontSize: `${levelFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "right",
        })
        .setOrigin(1, 0);
    }

    // Level/Lines label and display
    const levelLabelText = isLineCountMode ? "LINES" : "LEVEL";
    this.levelLabel = this.add
      .text(
        uiX + 135,
        levelBottomY - 3.5 * levelRowHeight - 43,
        levelLabelText,
        {
          fontSize: `${uiFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        },
      )
      .setOrigin(1, 0);
    // Level bar and texts will be added in draw

    // Score display - next to matrix on left, right-aligned, moved 30px up and 20px right
    const scoreRowHeight = 25;
    this.scoreLabel = this.add
      .text(uiX + 135, levelBottomY, "SCORE", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.scoreText = this.add
      .text(uiX + 140, levelBottomY + 15, "0", {
        fontSize: `${xlargeFontSize}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);
    this.scorePerPieceLabel = this.add
      .text(uiX + 135, levelBottomY + 61, "SCORE/PIECE", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.scorePerPieceText = this.add
      .text(uiX + 140, levelBottomY + 76, "0.00", {
        fontSize: `${largeFontSize}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);

    // Clear banner (line clear/spin indicator) - slides in from left of matrix
    this.createClearBannerUI(levelBottomY, scoreRowHeight, uiFontSize);

    // Piece per second displays - moved to right side of matrix, aligned with bottom of stack
    const ppsX = this.borderOffsetX + this.cellSize * this.board.cols + 20;
    const ppsY = this.borderOffsetY + this.playfieldHeight - 40; // Align with bottom of stack
    const spikeY = this.borderOffsetY + this.playfieldHeight * 0.5;

    // Attack metrics (above PPS)
    const atkLabelStyle = {
      fontSize: `${uiFontSize - 4}px`,
      fill: "#ffdd55",
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "right",
    };
    const atkValueStyle = {
      fontSize: `${largeFontSize}px`,
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "right",
    };
    const atkSubStyle = {
      fontSize: `${uiFontSize - 6}px`,
      fill: "#cccccc",
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "right",
    };

    const uiParent = this.overlayGroup || this.gameGroup;
    const atkX = uiX + 135;
    const atkBaseY = levelBottomY - 3.5 * levelRowHeight - 220; // moved up by 70px
    const atkRow = 18;
    this.vsLabel = this.add.text(atkX, atkBaseY, "VS", atkLabelStyle).setOrigin(1, 0);
    this.vsScoreText = this.add
      .text(atkX + 5, atkBaseY + atkRow, "0.00", {
        fontSize: `${largeFontSize - 8}px`,
        fill: "#a0d8ff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);
    this.attackLabel = this.add.text(atkX, atkBaseY + atkRow * 2, "ATK", atkLabelStyle).setOrigin(1, 0);
    this.attackTotalText = this.add
      .text(atkX + 5, atkBaseY + atkRow * 3, "0", atkValueStyle)
      .setOrigin(1, 0);
    this.attackPerMinLabel = this.add
      .text(atkX, atkBaseY + atkRow * 4 + 4, "ATK/MIN", atkSubStyle)
      .setOrigin(1, 0);
    this.attackPerMinText = this.add
      .text(atkX + 5, atkBaseY + atkRow * 5 + 4, "0.00", {
        fontSize: `${largeFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);
    this.attackPerPieceLabel = this.add
      .text(atkX, atkBaseY + atkRow * 6 + 8, "ATK/PIECE", atkSubStyle)
      .setOrigin(1, 0);
    this.attackPerPieceText = this.add
      .text(atkX + 5, atkBaseY + atkRow * 7 + 8, "0.00", {
        fontSize: `${largeFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);
    this.spikeText = this.add
      .text(atkX, spikeY, "SPIKE 0", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#ffaa33",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0)
      .setVisible(false);
    const attackUIElements = [
      this.vsLabel,
      this.vsScoreText,
      this.attackLabel,
      this.attackTotalText,
      this.attackPerMinLabel,
      this.attackPerMinText,
      this.attackPerPieceLabel,
      this.attackPerPieceText,
      this.spikeText,
    ];
    // Show attack metrics only in Zen (spike text is separately hidden during Ready/Go)
    const showAttackUI = isZenMode;
    attackUIElements.forEach((el) => {
      if (el === this.spikeText) {
        el.setVisible(isZenMode && !this.readyGoPhase);
      } else {
        el.setVisible(showAttackUI);
      }
      if (isZenMode) {
        el.setDepth(2000);
      }
    });
    uiParent.addMultiple(attackUIElements);

    if (isZenMode && typeof this.updateZenSandboxDisplay === "function") {
      this.updateZenSandboxDisplay();
    }

    // Finesse tracking display (sprint/ultra with SRS)
    const finesseMode = (this.zenSandboxConfig?.displayMode || "versus").toLowerCase();
    const finesseVisible =
      !!this.finesseEnabled &&
      (!this.isZenSandboxActive ||
        !this.isZenSandboxActive() ||
        finesseMode === "speed" ||
        finesseMode === "efficiency");
    const finesseY = ppsY - 110;
    const inputY = finesseY - 86; // moved up further
    this.finesseInputLabel = this.add
      .text(ppsX, inputY, "INPUTS", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.finesseInputText = this.add
      .text(ppsX, inputY + 15, "0", {
        fontSize: `${uiFontSize - 2}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.inputPerPieceLabel = this.add
      .text(ppsX, inputY + 30, "INPUT/PIECE", {
        fontSize: `${uiFontSize - 8}px`,
        fill: "#999999",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.inputPerPieceText = this.add
      .text(ppsX, inputY + 45, "0.00", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.finesseTexts.header = this.add
      .text(ppsX, finesseY, "FINESSE", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#ffdd55",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.finesseTexts.streakAcc = this.add
      .text(ppsX, finesseY + 15, "0   100.0%", {
        fontSize: `${uiFontSize - 2}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.finesseTexts.errors = this.add
      .text(ppsX, finesseY + 30, "0 errors", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    uiParent.addMultiple([
      this.finesseInputLabel,
      this.finesseInputText,
      this.inputPerPieceLabel,
      this.inputPerPieceText,
      this.finesseTexts.header,
      this.finesseTexts.streakAcc,
      this.finesseTexts.errors,
    ]);

    // B2B chain display on left side, lower than clear banner
    const b2bX = this.borderOffsetX - 80; // align above stack near clear banner
    const b2bY = this.borderOffsetY + this.playfieldHeight / 2 - uiFontSize - 10;
    this.b2bChainText = this.add
      .text(b2bX, b2bY, "B2B x0", {
        fontSize: `${uiFontSize - 2}px`,
        fill: "#ffff55",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0)
      .setDepth(2000)
      .setVisible(false);
    uiParent.add(this.b2bChainText);

    // Standard combo display (for sprint/ultra/marathon/zen)
    this.standardComboNumberText = this.add
      .text(0, 0, "0", {
        fontSize: `${uiFontSize}px`,
        fill: "#88ff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);
    this.standardComboLabelText = this.add
      .text(this.standardComboNumberText.width + 6, 2, "COMBO", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#88ff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);
    this.standardComboText = this.add
      .container(b2bX, b2bY - 24, [
        this.standardComboNumberText,
        this.standardComboLabelText,
      ])
      .setVisible(false);
    uiParent.add(this.standardComboText);

    this.hanabiLabel = this.add
      .text(ppsX, ppsY - 40, "HANABI", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.hanabiTextInGame = this.add
      .text(ppsX, ppsY - 25, "0", {
        fontSize: `${largeFontSize}px`,
        fill: "#ffff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);
    const showPieceCount =
      isZenMode || isUltraMode || isSprintMode || isMarathonMode;

    this.pieceCountLabel = this.add
      .text(ppsX, ppsY - 45, "PIECES", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(showPieceCount);
    this.pieceCountText = this.add
      .text(ppsX, ppsY - 30, "0", {
        fontSize: `${largeFontSize - 4}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0)
      .setVisible(showPieceCount);

    const showRoundsMedals = modeId === "tgm4_rounds";
    const roundsMedalDefs = [
      { key: "bravo", label: "AC", color: "#ffff88" },
      { key: "tetris", label: "TET", color: "#88ddff" },
      { key: "tspin", label: "TSP", color: "#ffaaaa" },
      { key: "pikii", label: "PIK", color: "#ffffff" },
    ];
    this.roundsMedalLabels = [];
    this.roundsMedalTexts = [];
    roundsMedalDefs.forEach((medal, index) => {
      const rowY = ppsY - 125 + index * 20;
      const label = this.add
        .text(ppsX, rowY, medal.label, {
          fontSize: `${uiFontSize - 6}px`,
          fill: "#ccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0, 0)
        .setVisible(showRoundsMedals);
      const value = this.add
        .text(ppsX + 42, rowY, "0", {
          fontSize: `${uiFontSize - 4}px`,
          fill: medal.color,
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "left",
        })
        .setOrigin(0, 0)
        .setVisible(showRoundsMedals);
      this.roundsMedalLabels.push(label);
      this.roundsMedalTexts.push(value);
    });

    this.ppsLabel = this.add
      .text(ppsX, ppsY, "PPS", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.ppsText = this.add
      .text(ppsX, ppsY + 15, "0.00", {
        fontSize: `${largeFontSize}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);
    this.rawPpsLabel = this.add
      .text(ppsX, ppsY + 40, "RAW PPS", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.rawPpsText = this.add
      .text(ppsX, ppsY + 55, "0.00", {
        fontSize: `${largeFontSize - 4}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);

    const showAsukaKitas =
      typeof modeId === "string" &&
      (modeId.startsWith("tgm4_asuka") || modeId.startsWith("asuka_"));
    const showKonohaMinosa = typeof modeId === "string" && (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"));
    const showKitaDisplay = showAsukaKitas || showKonohaMinosa;
    const showBravoCounter = showKonohaMinosa;
    const bravoLabelY = showKonohaMinosa ? ppsY - 85 : ppsY - 45;
    const bravoTextY = showKonohaMinosa ? ppsY - 70 : ppsY - 30;
    const kitaLabelY = showKonohaMinosa ? ppsY - 45 : ppsY - 85;
    const kitaTextY = showKonohaMinosa ? ppsY - 30 : ppsY - 70;
    this.bravoCountLabel = this.add
      .text(ppsX, bravoLabelY, "BRAVO", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(showBravoCounter);
    this.bravoCountText = this.add
      .text(ppsX, bravoTextY, "0", {
        fontSize: `${largeFontSize - 4}px`,
        fill: "#ffff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0)
      .setVisible(showBravoCounter);
    this.asukaKitaLabel = this.add
      .text(ppsX, kitaLabelY, "KITAS", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(false);
    this.asukaKitaText = this.add
      .text(ppsX, kitaTextY, showKonohaMinosa ? "🦊" : "0", {
        fontSize: `${largeFontSize - 4}px`,
        fill: "#ffff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0)
      .setVisible(showKitaDisplay);

    // Show Hanabi counter only in Easy mode
    const showHanabi = modeId === "tgm3_easy";
    if (this.hanabiLabel) this.hanabiLabel.setVisible(showHanabi);
    if (this.hanabiTextInGame) this.hanabiTextInGame.setVisible(showHanabi);

    const clearSectionTrackerRefs = () => {
      this.ppsSummaryText = null;
      this.ppsGraphGraphics = null;
      this.ppsGraphArea = null;
      this.ppsLegendText = null;
      this.halfTimeTexts = null;
      this.sectionSectionLabels = null;
      this.sectionTimeTexts = null;
      this.sectionTotalTexts = null;
      this.sectionTallyTexts = null;
    };

    const shouldShowSectionTracker =
      !(isUltraMode || isZenMode || isKonohaMode) && modeId !== "tgm3_sakura";
    const shouldShowZenPanel = isZenMode && this.zenSandboxConfig;
    if (this.sectionTrackerGroup) {
      this.sectionTrackerGroup.destroy(true);
      this.sectionTrackerGroup = null;
      clearSectionTrackerRefs();
    }
    if (this.zenSandboxPanelGroup) {
      this.zenSandboxPanelGroup.destroy(true);
      this.zenSandboxPanelGroup = null;
    }

    if (!shouldShowSectionTracker) {
      clearSectionTrackerRefs();
    }

    if (shouldShowSectionTracker) {
      const trackerX = Math.max(20, this.borderOffsetX - 430);
      const trackerWidth = 240;
      const gradePanelLeftX = hasGrading ? uiX + 25 : uiX;
      const shouldShiftTrackerDown = trackerX + trackerWidth >= gradePanelLeftX - 10;
      const trackerY = shouldShiftTrackerDown
        ? this.borderOffsetY + 170
        : this.borderOffsetY - 10;
      const sectionRowHeight = Math.max(16, Math.floor(this.cellSize * 0.6));
      this.sectionTrackerGroup = this.add.container(trackerX, trackerY);

      const isTgm2Normal =
      modeId === "tgm2_normal" || modeId === "normal" || modeId === "tgm2normal";

      if (isSprintMode) {
        const header = this.add.text(0, 0, "PPS GRAPH", {
          fontSize: `${uiFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        this.sectionTrackerGroup.add(header);

        const graphWidth = 120;
        const graphY = sectionRowHeight + 6;
        const graphMargin = graphY; // keep bottom margin equal to top margin
        const graphHeight = Math.max(
          140,
          this.scale.height - (trackerY + graphY + graphMargin),
        );
        this.ppsGraphArea = {
          x: 0,
          y: graphY,
          width: graphWidth,
          height: graphHeight,
        };
        this.ppsGraphGraphics = this.add.graphics();
        this.sectionTrackerGroup.add(this.ppsGraphGraphics);

        // Summary text under graph
        const summaryStyle = {
          fontSize: `${uiFontSize - 6}px`,
          fill: "#ccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        };
        this.ppsSummaryText = this.add.text(
          0,
          graphY + graphHeight + 6,
          "Max PPS: -- | Worst choke: --",
          summaryStyle,
        );
        this.sectionTrackerGroup.add(this.ppsSummaryText);

        // Legend: clarify that top of chart is most recent
        const legendStyle = {
          fontSize: `${uiFontSize - 8}px`,
          fill: "#ccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        };
        this.ppsLegendText = this.add.text(
          -70,
          graphY + graphHeight * 0.5,
          "← TIME",
          legendStyle,
        ).setAngle(90);
        this.ppsLegendText.setOrigin(0.5, 0.5);
        this.sectionTrackerGroup.add(this.ppsLegendText);

        const yLabel = this.add.text(
          graphWidth + 6,
          graphY - 6,
          "PPS",
          {
            fontSize: `${uiFontSize - 6}px`,
            fill: "#ccc",
            fontFamily: "Courier New",
            fontStyle: "bold",
          },
        );
        this.sectionTrackerGroup.add(yLabel);
      } else {
        const header = this.add.text(0, 0, "SECTIONS", {
          fontSize: `${uiFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        this.sectionTrackerGroup.add(header);

        const sectionLabelFontSize = Math.max(10, uiFontSize - 6);
        const sectionTimeFontSize = Math.max(12, uiFontSize - 4);
        const rowLineHeight = Math.max(12, Math.floor(sectionLabelFontSize * 1.1));
        const rowHeight = rowLineHeight +
          Math.max(14, Math.floor(sectionTimeFontSize * 1.1));

        this.halfTimeTexts = null;
        let tableStartY = sectionRowHeight;
        const isShiraseMode =
          modeId === "tgm3_shirase" || modeId === "shirase" || modeId === "tgm3_shirase_mode";
        const isEasyMode = modeId === "tgm3_easy";

        const hideHalfSplits =
          modeId === "tgm4_rounds" ||
          modeId === "tgm4_asuka_normal" ||
          modeId === "tgm4_asuka_hard";
        if (!isTgm2Normal && !isMarathonMode && !isShiraseMode && !isEasyMode && !hideHalfSplits) {
          const colWidth = 120;
          const labelStyle = {
            fontSize: `${sectionLabelFontSize}px`,
            fill: "#ccc",
            fontFamily: "Courier New",
            fontStyle: "bold",
          };
          const timeStyle = {
            fontSize: `${sectionTimeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
          };

          const half1Label = this.add.text(
            0,
            sectionRowHeight,
            "1ST HALF",
            labelStyle,
          );
          const half1Time = this.add.text(
            0,
            sectionRowHeight + rowLineHeight,
            "--:--.--",
            timeStyle,
          );
          const half2Label = this.add
            .text(colWidth, sectionRowHeight, "2ND HALF", labelStyle)
            .setVisible(false);
          const half2Time = this.add
            .text(colWidth, sectionRowHeight + rowLineHeight, "--:--.--", timeStyle)
            .setVisible(false);

          this.sectionTrackerGroup.add([half1Label, half1Time, half2Label, half2Time]);
          this.halfTimeTexts = [
            { label: half1Label, time: half1Time },
            { label: half2Label, time: half2Time },
          ];

          tableStartY = sectionRowHeight + rowHeight + 6;
        }

        this.sectionSectionLabels = [];
        this.sectionTimeTexts = [];
        this.sectionTotalTexts = [];

        this.sectionTallyTexts = [];
        const sectionLength = this.getSectionLength();
        const maxSections = this.getMaxSectionsForTracker();
        const trackerMaxLevel =
          this.gameMode && typeof this.gameMode.getGravityLevelCap === "function"
            ? (typeof this.gameMode.getDisplayLevelCap === "function"
                ? this.gameMode.getDisplayLevelCap()
                : this.gameMode.getGravityLevelCap())
            : this.gravityLevelCap || 999;
        for (let i = 0; i < maxSections; i++) {
          const sectionStart = i * sectionLength;
          const sectionEnd = i === maxSections - 1
            ? trackerMaxLevel
            : sectionStart + sectionLength - 1;
          const y = tableStartY + i * rowHeight;

          const label = this.add.text(
            0,
            y,
            `${sectionStart.toString().padStart(3, "0")}-${sectionEnd
              .toString()
              .padStart(3, "0")}`,
            {
              fontSize: `${sectionLabelFontSize}px`,
              fill: "#ccc",
              fontFamily: "Courier New",
              fontStyle: "bold",
            },
          );
          const timeText = this.add.text(0, y + rowLineHeight, "--:--.--", {
            fontSize: `${sectionTimeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
          });

          const tallyText = this.add.text(140, y, "", {
            fontSize: `${sectionLabelFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
          });
          const perfText = this.add.text(200, y, "", {
            fontSize: `${Math.max(sectionLabelFontSize - 2, 12)}px`,
            fill: "#ffff55",
            fontFamily: "Courier New",
            fontStyle: "bold",
          });
          const totalText = this.add.text(140, y + rowLineHeight, "--:--.--", {
            fontSize: `${sectionTimeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
          });

          label.setVisible(false);
          timeText.setVisible(false);
          tallyText.setVisible(false);
          perfText.setVisible(false);
          totalText.setVisible(false);

          this.sectionTrackerGroup.add([label, timeText, tallyText, perfText, totalText]);
          this.sectionSectionLabels.push(label);
          this.sectionTimeTexts.push(timeText);
          this.sectionTallyTexts.push(tallyText);
          this.sectionPerfTexts.push(perfText);
          this.sectionTotalTexts.push(totalText);
        }

        // Staff roll grade bonus display placeholder
        const rollBonusY = tableStartY + maxSections * rowHeight + 6;
        this.staffRollBonusText = this.add.text(0, rollBonusY, "ROLL BONUS: --", {
          fontSize: `${sectionLabelFontSize}px`,
          fill: "#ccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        this.sectionTrackerGroup.add(this.staffRollBonusText);
        // Hidden by default; only shown during TGM3 credits roll
        this.staffRollBonusText.setVisible(false);

        // TAP internal grade (TGM2-style mapping, no COOL bonus)
        const tapGradeY = rollBonusY + rowHeight;
        this.tapInternalGradeText = this.add.text(0, tapGradeY, "TAP GRADE: --", {
          fontSize: `${sectionLabelFontSize}px`,
          fill: "#ffffaa",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        this.sectionTrackerGroup.add(this.tapInternalGradeText);
        this.tapInternalGradeText.setVisible(false);
      }
    }

    // Zen sandbox panel (left side, above everything)
    if (
      shouldShowZenPanel &&
      typeof ZenSandboxHelper !== "undefined" &&
      typeof ZenSandboxHelper.renderPanel === "function"
    ) {
      const panelX = Math.max(20, this.borderOffsetX - 750);
      const panelY = Math.max(10, this.borderOffsetY - 30);
      const panel = ZenSandboxHelper.renderPanel(this, this.zenSandboxConfig, {
        x: panelX,
        y: panelY,
        cellSize: this.cellSize,
      });
      if (panel && typeof panel.setDepth === "function") {
        panel.setDepth(10000);
      }
    }

    // Player name and stopwatch stack beneath the matrix
    if (this.playerNameText && !this.playerNameText.scene) {
      this.playerNameText = null;
    }
    const playerNameFontSize = Math.max(
      16,
      Math.min(22, Math.floor(this.cellSize * 0.7)),
    );
    const playerNameX = this.borderOffsetX + this.playfieldWidth / 2;
    const playerNameY = this.borderOffsetY + this.playfieldHeight + 6;
    const playerNameValue = this.getPlayerDisplayName();
    if (!this.playerNameText) {
      this.playerNameText = this.add
        .text(playerNameX, playerNameY, playerNameValue, {
          fontSize: `${playerNameFontSize}px`,
          fill: "#cccccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "center",
        })
        .setOrigin(0.5, 0);
    } else {
      this.playerNameText.setPosition(playerNameX, playerNameY);
      this.playerNameText.setText(playerNameValue);
      this.playerNameText.setStyle({ fontSize: `${playerNameFontSize}px` });
    }
    if (
      typeof KonohaIllustrationSystem !== "undefined" &&
      typeof KonohaIllustrationSystem.drawPlayerInfoIcon === "function"
    ) {
      KonohaIllustrationSystem.drawPlayerInfoIcon(this, {
        centerX: playerNameX,
        topY: playerNameY,
        textWidth: this.playerNameText?.width || 0,
        fontSize: playerNameFontSize,
      });
    }

    const playerNameBottomY =
      playerNameY + (this.playerNameText?.height || playerNameFontSize);
    const coolRegretY = playerNameBottomY + 6;
    const timeY = coolRegretY + Math.max(timeFontSize - 4, 18) - 6;

    // Time - centered below border, larger font, bold
    if (this.timeText && !this.timeText.scene) {
      this.timeText = null;
    }
    if (!this.timeText) {
      this.timeText = this.add
        .text(
          playerNameX,
          timeY,
          "0:00.00",
          {
            fontSize: `${timeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          },
        )
        .setOrigin(0.5, 0);
      // COOL/REGRET banner above stopwatch
      this.coolRegretText = this.add
        .text(
          playerNameX,
          coolRegretY,
          "",
          {
            fontSize: `${Math.max(timeFontSize - 4, 18)}px`,
            fill: "#ffff55",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          },
        )
        .setOrigin(0.5, 0)
        .setVisible(false)
        .setDepth(9999);
    } else {
      // Update position and style if text already exists
      this.timeText.setPosition(playerNameX, timeY);
      this.timeText.setStyle({ fontSize: `${timeFontSize}px` });
      if (this.coolRegretText) {
        this.coolRegretText.setPosition(playerNameX, coolRegretY);
        this.coolRegretText.setStyle({
          fontSize: `${Math.max(timeFontSize - 4, 18)}px`,
        });
      }
    }

    // Playfield border - adjusted to fit exactly 10x20 with smaller width and height
    // Use mode type color for border
    const modeTypeColor = this.getModeTypeBorderColor();
    this.playfieldBorder = this.add.graphics();
    this.playfieldBorder.lineStyle(3, modeTypeColor);
    this.playfieldBorder.strokeRect(
      this.borderOffsetX - 4,
      this.borderOffsetY - 3,
      this.cellSize * this.board.cols + 4,
      this.cellSize * this.visibleRows + 5,
    ); // Height reduced by 1px, width expanded 1px left
  }

  create() {
    // Initialize game elements here (spawn deferred until after READY/GO)
    this.gameGroup = this.add.group();
    ensureMonochromeMinoTextures(this);
    // Overlay group for transient UI (e.g., READY/GO) that must survive draw() clears
    this.overlayGroup = this.add.group();
    this.hintGraphics = this.add.graphics({
      lineStyle: { width: 4, color: this.hintColor, alpha: 0.95 },
    });
    this.hintGraphics.setDepth(9500);
    this.powerupEffectHandler =
      typeof PowerupEffectHandler !== "undefined"
        ? new PowerupEffectHandler(this)
        : null;
    this.pendingPowerup = null;
    this.powerupSpawned = { free_fall: false, del_even: false };
    this.powerupCells = new Map();
    const powerupLabelSize = Math.max(12, Math.floor(this.cellSize * 0.6));
    this.powerupStatusText = this.add.text(
      this.borderOffsetX,
      this.borderOffsetY - 28,
      "",
      {
        fontSize: `${powerupLabelSize}px`,
        fill: "#0ff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      },
    );
    this.gameGroup.add(this.powerupStatusText);
    this.updatePowerupStatusLayout();
    this.cursors = this.input.keyboard.createCursorKeys();

    // Scene instances can be reused across restarts; reset runtime flags/timers.
    this.board = new Board();
    this.board.scene = this;
    this.visibleRows = 20;
    this.bigModeActive = false;
    this.bigBlocksActive = false;
    this.bigModeBoardActive = false;
    this.currentPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    this.holdRequest = false;
    this.nextPieces = [];
    this.pairsQueue = [];
    this.lastClassicPiece = null;
    this.areActive = false;
    this.areTimer = 0;
    this.isClearingLines = false;
    this.clearedLines = [];
    this.lineClearPhase = false;

    this.score = 0;
    this.totalLines = 0;
    this.piecesPlaced = 0;
    this.comboCount = -1;
    this.backToBack = false;
    this.lastClearType = null;
    this.lastLineClearWasBravo = false;
    this.lastPieceType = null;
    this.backstepHistory = [];
    this.backstepRestoreInProgress = false;
    this.backstepAnimationActive = false;
    this.backstepAnimationTimer = 0;
    this.backstepAnimationDuration = 61 / 60;
    this.backstepAnimationRiseDistance = 1.25;
    this.backstepAnimationPiece = null;
    this.backstepAnimationBaseY = 0;
    this.backstepAnimationQueue = [];
    this.pendingBackstepPieceState = null;
    this.lastLockedPieceState = null;
    this.totalAttack = 0;
    this.attackSpike = 0;
    this.lastAttackTime = 0;
    this.b2bChainCount = -1;
    this.standardComboCount = -1;
    this.standardComboLastLineTime = 0;
    if (this.standardComboNumberText && this.standardComboLabelText) {
      this.standardComboNumberText.setText("0");
      this.standardComboLabelText.setText("COMBO");
      this.standardComboLabelText.setX(this.standardComboNumberText.width + 6);
    }
    if (this.standardComboText) {
      this.standardComboText.setVisible(false);
      this.standardComboText.setAlpha(1);
      this.standardComboText.setScale(1);
    }
    if (this.b2bChainText) {
      this.b2bChainText.setText("B2B x0");
      this.b2bChainText.setVisible(false);
      this.b2bChainText.setColor("#ffff55");
      this.b2bChainText.setAlpha(1);
      this.b2bChainText.setScale(1);
    }
    if (this.hideClearBanner) this.hideClearBanner();

    this.level = this.startingLevel != null ? this.startingLevel : 0;
    this.currentSection = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
    this.currentSectionPieceIndex = 0;
    this.sectionStartTime = 0;
    this.sectionTimes = [];
    this.sectionTetrises = [];
    this.currentSectionTetrisCount = 0;

    this.isGrounded = false;
    this.lockDelay = 0;
    this.lockDelayBufferedStart = false;
    this.skipDASMovementAfterSpawn = false;
    this.stackAlpha = 1;

    // Reset randomizer / first-spawn logic so the first spawned piece does not increment level.
    this.pieceHistory = ["Z", "Z", "S", "S"];
    this.pieceHistoryIndex = 0;
    this.firstPiece = true;
    this.isFirstSpawn = true;
    this.bagQueue = this.createShuffledBag();
    this.bagDrawCount = 0;
    this.bagDebugSeen = new Set();
    this.guidelineBagSeed = null;
    this.validatePieceHistory();

    // Start with an empty preview queue; generateNextPieces will fill using the active randomizer
    this.nextPieces = [];

    // Reset stack/credits/fade systems
    this.invisibleStackActive = false;
    this.fadingRollActive = false;
    this.minoFadeActive = false;
    this.minoFadeReversed = false;
    this.minoFadeProgress = 0;
    this.minoFadeTimer = 0;
    this.minoFadePerRowDuration = 0;
    this.placedMinos = [];
    this.placedMinoRows = [];
    this.fadingComplete = false;
    this.minoRowFadeAlpha = {};
    this.gameOverFadeDoneTime = null;
    this.creditsFinishPending = false;
    this.creditsRevealFinishPending = false;
    this.creditsFadeInDone = false;
    this.gameOverStatePrepared = false;
    this.showGameOverText = false;
    this.gameOverTextTimer = 0;
    this.gameOverSfxPlayed = true;
    this.gameOverMessage = "GAME OVER";
    this.gameOverSubMessage = "";
    this.gameOverMessageColor = null;
    this.gameOverSubMessageColor = null;
    this.preserveGameOverMessage = false;
    this.pendingCompleteSequence = false;
    this.pendingStaticEndScreen = null;
    this.pendingCreditsStart = null;
    this.preserveBoardOnStaticEnd = false;
    this.gameOverAutoExitDelay = 10;
    this.creditsPending = false;
    this.creditsActive = false;
    this.creditsTimer = 0;
    this.creditsDuration = 61.6;
    this.creditsTopoutLockActive = false;
    this.creditsSkipArmed = false;
    this.suppressGameplayBgmForImmediateCreditsStart = false;
    this.creditsBgmStarted = false;
    this.creditsTransitionStartTime = null;
    this.rollFadeLastExpireTime = 0;
    this.gradeLineColor = "none";
    this.congratulationsActive = false;
    this.gameComplete = false;
    this.sprintCompleted = false;

    this.gameOver = false;
    this.gameOverTimer = 0;
    this.isPaused = false;
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.level999Reached = false;
    this.readyGoPhase = false;
    this.loadingPhase = true;
    this.gameStarted = false;

    // Ensure layout values are correct for UI drawing (level bar, border, etc.)
    this.calculateLayout();

    this.events.once("shutdown", () => {
      if (this.input && this.handleHudZoomWheel) {
        this.input.off("wheel", this.handleHudZoomWheel, this);
        this.handleHudZoomWheel = null;
      }
      if (this.bgmLoopTimer) {
        this.bgmLoopTimer.remove(false);
        this.bgmLoopTimer = null;
      }
      if (this.currentBGM) {
        this.currentBGM.stop();
        this.currentBGM = null;
      }
      const bgmObjects = [
        this.stage1BGM,
        this.stage2BGM,
        this.tgm2_stage1,
        this.tgm2_stage2,
        this.tgm2_stage3,
        this.tgm2_stage4,
      ];
      bgmObjects.forEach((bgm) => {
        if (bgm) {
          bgm.stop();
          bgm.destroy();
        }
      });
      this.stage1BGM = null;
      this.stage2BGM = null;
      this.tgm2_stage1 = null;
      this.tgm2_stage2 = null;
      this.tgm2_stage3 = null;
      this.tgm2_stage4 = null;
      if (this.tweens) this.tweens.killAll();
      if (this.time) this.time.removeAllEvents();

      // Clear UI refs
      this.playerNameText = null;
      this.timeText = null;
      this.levelLabel = null;
      this.levelDisplayLabel = null;
      this.levelDisplayText = null;
      this.currentLevelText = null;
      this.capLevelText = null;
      this.levelBar = null;
      this.scoreLabel = null;
      this.scoreText = null;
      this.ppsLabel = null;
      this.ppsText = null;
      this.pieceCountLabel = null;
      this.pieceCountText = null;
      this.rawPpsLabel = null;
      this.rawPpsText = null;
      this.gradeDisplay = null;
      this.gradeText = null;
      this.gradePointsText = null;
      this.bravoCountLabel = null;
      this.bravoCountText = null;
      this.nextGradeText = null;
      this.roundsMedalLabels = [];
      this.roundsMedalTexts = [];
      this.playfieldBorder = null;
      this.minoRowFadeAlpha = null;
      if (this.hanabiLabel) this.hanabiLabel.destroy();
      if (this.hanabiTextInGame) this.hanabiTextInGame.destroy();
      if (this.bravoCountLabel) this.bravoCountLabel.destroy();
      if (this.bravoCountText) this.bravoCountText.destroy();
      if (this.asukaKitaLabel) this.asukaKitaLabel.destroy();
      if (this.asukaKitaText) this.asukaKitaText.destroy();
      (this.roundsMedalLabels || []).forEach((label) => label?.destroy());
      (this.roundsMedalTexts || []).forEach((text) => text?.destroy());
      this.hanabiLabel = null;
      this.hanabiTextInGame = null;
      this.bravoCountLabel = null;
      this.bravoCountText = null;
      this.asukaKitaLabel = null;
      this.asukaKitaText = null;
      this.roundsMedalLabels = [];
      this.roundsMedalTexts = [];
    });

    const keybinds = (() => {
      const defaultKeybinds = {
        moveLeft: Phaser.Input.Keyboard.KeyCodes.Z,
        moveRight: Phaser.Input.Keyboard.KeyCodes.C,
        softDrop: Phaser.Input.Keyboard.KeyCodes.S,
        rotateCW: Phaser.Input.Keyboard.KeyCodes.K,
        rotateCW2: Phaser.Input.Keyboard.KeyCodes.UP,
        rotateCCW: Phaser.Input.Keyboard.KeyCodes.SPACE,
        rotateCCW2: Phaser.Input.Keyboard.KeyCodes.L,
        rotate180: Phaser.Input.Keyboard.KeyCodes.X,
        hardDrop: Phaser.Input.Keyboard.KeyCodes.X,
        hold: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        backstep: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
        pause: Phaser.Input.Keyboard.KeyCodes.ESC,
        menu: Phaser.Input.Keyboard.KeyCodes.M,
        restart: Phaser.Input.Keyboard.KeyCodes.ENTER,
      };
      const stored = localStorage.getItem("keybinds");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...defaultKeybinds, ...parsed };
        } catch (e) {}
      }
      return defaultKeybinds;
    })();

    const ensureKeyCode = (code, fallback) =>
      Number.isInteger(code) ? code : fallback;
    const makeKey = (keyCode, fallback) =>
      this.input.keyboard.addKey(ensureKeyCode(keyCode, fallback));

    this.keys = {
      left: makeKey(keybinds.moveLeft, Phaser.Input.Keyboard.KeyCodes.Z),
      right: makeKey(keybinds.moveRight, Phaser.Input.Keyboard.KeyCodes.C),
      softDrop: makeKey(keybinds.softDrop, Phaser.Input.Keyboard.KeyCodes.S),
      hardDrop: makeKey(keybinds.hardDrop, Phaser.Input.Keyboard.KeyCodes.X),
      rotateCW: makeKey(keybinds.rotateCW, Phaser.Input.Keyboard.KeyCodes.K),
      rotateCW2: makeKey(keybinds.rotateCW2, Phaser.Input.Keyboard.KeyCodes.UP),
      rotateCCW: makeKey(
        keybinds.rotateCCW,
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      ),
      rotateCCW2: makeKey(keybinds.rotateCCW2, Phaser.Input.Keyboard.KeyCodes.L),
      rotate180: makeKey(keybinds.rotate180, Phaser.Input.Keyboard.KeyCodes.X),
      hold: makeKey(keybinds.hold, Phaser.Input.Keyboard.KeyCodes.SHIFT),
      backstep: makeKey(keybinds.backstep, Phaser.Input.Keyboard.KeyCodes.BACKSPACE),
      pause: makeKey(keybinds.pause, Phaser.Input.Keyboard.KeyCodes.ESC),
      menu: makeKey(keybinds.menu, Phaser.Input.Keyboard.KeyCodes.M),
      restart: makeKey(keybinds.restart, Phaser.Input.Keyboard.KeyCodes.ENTER),
    };

    this.input.keyboard.addCapture([
      keybinds.moveLeft,
      keybinds.moveRight,
      keybinds.softDrop,
      keybinds.hardDrop,
      keybinds.rotateCW,
      keybinds.rotateCW2,
      keybinds.rotateCCW,
      keybinds.rotateCCW2,
      keybinds.rotate180,
      keybinds.hold,
      keybinds.backstep,
      keybinds.pause,
      keybinds.menu,
      keybinds.restart,
    ]);
    this.restartKey = this.keys.restart;
    this.handleHudZoomWheel = (_pointer, _gameObjects, _deltaX, deltaY, _deltaZ, event) => {
      if (!Number.isFinite(deltaY) || deltaY === 0) return;
      const zoomStep = 0.05;
      this.adjustGameplayHudZoom(deltaY < 0 ? zoomStep : -zoomStep);
      event?.preventDefault?.();
    };
    this.input.on("wheel", this.handleHudZoomWheel, this);

    // Initialize time tracking; actual start time is set on GO
    this.startTime = null;
    this.gameStartTime = null;
    this.currentTime = 0;
    this.sectionStartTime = 0;
    this.currentSection = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
    this.currentSectionTetrisCount = 0;
    this.section70Captured = new Set();
    if (Array.isArray(this.sectionCoolTimes)) {
      this.sectionCoolTimes = [];
    }
    this.tgm3BagQueue = [];
    this.tgm3DroughtCounters = null;
    this.hideBravoBanner();
    this.bgmInternalLevelBuffer = 0;
    this.totalPausedTime = 0;
    this.isPaused = false;
    this.pauseStartTime = null;

    // Initialize game mode first so grading/config is ready
    if (this.gameMode && typeof this.gameMode.initializeForGameScene === "function") {
      this.gameMode.initializeForGameScene(this);
    }
    // Ensure grade is initialized at mode start (before UI and first piece)
    this.applyInitialGradeFromMode();

    // UI
    this.setupUI();
    this.applyGameplayHudZoom();

    // Initialize BGM system (playback deferred until first spawn)
    this.initializeBGM();
    this.bgmStarted = false;
    // Ensure any leftover BGM from previous scene is stopped
    this.stopCurrentBGM();
    this.applyEffectiveVolumesScene();

    // Prepare next queue (but do not spawn yet)
    if (this.nextPieces.length < 6) {
      this.generateNextPieces();
    }

    // Initialize versus mode networking if match data is present
    if (window.__versusMatchData || (this.gameMode && this.gameMode.getConfig &&
        this.gameMode.getConfig().specialMechanics &&
        this.gameMode.getConfig().specialMechanics.versus)) {
      initVersusMode(this);
    }

    // Show READY/GO; spawn will occur after GO
    this.loadingPhase = false;
    this.showReadyGo();

    createOrUpdateGlobalOverlay(this, this.getOverlayModeInfo());
  }

  // BGM methods are attached from js/game/game-scene-bgm.js.

  getMasterVolumeSetting() {
    const v = localStorage.getItem("masterVolume");
    return v ? parseFloat(v) : 1.0;
  }

  getBGMVolumeSetting() {
    const v = localStorage.getItem("bgmVolume");
    return v ? parseFloat(v) : 1.0;
  }

  getSFXVolumeSetting() {
    const v = localStorage.getItem("sfxVolume");
    return v ? parseFloat(v) : 1.0;
  }

  getSfxVolumeFactor(base = 1) {
    return base * this.getMasterVolumeSetting() * this.getSFXVolumeSetting();
  }

  playSfx(key, baseVolume = 1) {
    const vol = this.getSfxVolumeFactor(baseVolume);
    try {
      return this.sound?.add(key, { volume: vol })?.play();
    } catch (e) {
      console.warn("Sfx play error", key, e);
    }
    return null;
  }

  showCoolRegretBanner(kind) {
    // Recreate banner if missing (defensive)
    if (!this.coolRegretText) {
      const fontSize = this.timeText?.style?.fontSize || `${Math.max(this.uiScale * 24, 18)}px`;
      this.coolRegretText = this.add
        .text(
          this.borderOffsetX + this.playfieldWidth / 2,
          this.borderOffsetY + this.playfieldHeight + 22,
          "",
          {
            fontSize,
            fill: "#ffff55",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          },
        )
        .setOrigin(0.5, 0.5)
        .setVisible(false)
        .setDepth(9999);
    }
    // Clear previous timers
    if (this.coolRegretBlinkEvent) {
      this.coolRegretBlinkEvent.remove(false);
      this.coolRegretBlinkEvent = null;
    }
    if (this.coolRegretHideEvent) {
      this.coolRegretHideEvent.remove(false);
      this.coolRegretHideEvent = null;
    }

    const upperKind = (kind || "").toUpperCase();
    this.coolRegretText.setText(upperKind);
    this.coolRegretText.setVisible(true);
    this.coolRegretText.setAlpha(1);
    this.coolRegretText.setColor("#ffff55");
    this.children.bringToTop(this.coolRegretText);

    // Blink between yellow and white every 150ms for 3s total
    let toggle = false;
    this.coolRegretBlinkEvent = this.time.addEvent({
      delay: 150,
      loop: true,
      callback: () => {
        toggle = !toggle;
        this.coolRegretText.setColor(toggle ? "#ffffff" : "#ffff55");
      },
    });
    this.coolRegretHideEvent = this.time.delayedCall(
      3000,
      () => {
        if (this.coolRegretBlinkEvent) {
          this.coolRegretBlinkEvent.remove(false);
          this.coolRegretBlinkEvent = null;
        }
        this.coolRegretText.setVisible(false);
      },
      [],
      this,
    );

    // Play COOL sfx when applicable
    if (upperKind === "COOL") {
      this.playSfx("cool", 0.7);
    }
  }

  isBoardCompletelyEmpty() {
    if (!this.board || !Array.isArray(this.board.grid)) return false;
    // Treat any falsy cell (0, null, undefined) as empty to avoid mismatches across modes
    return this.board.grid.every((row) => row.every((cell) => !cell));
  }

  isAllClearAfterLines(linesToClear) {
    if (!this.board || !Array.isArray(this.board.grid)) return false;
    if (!Array.isArray(linesToClear) || linesToClear.length === 0) return false;
    const nextBoard = this.buildBoardAfterLineClear(linesToClear);
    if (!nextBoard || !Array.isArray(nextBoard.grid)) return false;
    for (let r = 0; r < nextBoard.grid.length; r++) {
      const row = nextBoard.grid[r];
      if (!row || !row.every((cell) => !cell)) {
        return false;
      }
    }
    return true;
  }

  isMasterPikiiFrozenCell(cell) {
    return !!(
      cell &&
      typeof cell === "object" &&
      (cell.frozen ||
        (Number.isFinite(cell.masterPikiiFreezeAt) &&
          (this.currentTime || 0) >= cell.masterPikiiFreezeAt))
    );
  }

  getMasterPikiiPreservedColumns(row, boardState = this.board) {
    const rowCells = boardState?.grid?.[row];
    if (!Array.isArray(rowCells) || rowCells.length === 0) {
      return new Set();
    }

    const preservedColumns = new Set();
    let latestTimedColumn = -1;
    let latestTimedFreezeAt = -Infinity;

    for (let c = 0; c < rowCells.length; c++) {
      const cell = rowCells[c];
      if (!this.isMasterPikiiFrozenCell(cell)) continue;
      preservedColumns.add(c);
      if (Number.isFinite(cell?.masterPikiiFreezeAt) && cell.masterPikiiFreezeAt > latestTimedFreezeAt) {
        latestTimedFreezeAt = cell.masterPikiiFreezeAt;
        latestTimedColumn = c;
      }
    }

    // Keep at least one cell clearable so a complete row can never stay fully frozen.
    if (preservedColumns.size === rowCells.length) {
      preservedColumns.delete(latestTimedColumn >= 0 ? latestTimedColumn : rowCells.length - 1);
    }

    return preservedColumns;
  }

  buildBoardAfterLineClear(linesToClear, boardState = this.board) {
    if (!boardState || !Array.isArray(boardState.grid)) return null;
    const rows = boardState.rows || boardState.grid.length || 0;
    const cols =
      boardState.cols || (Array.isArray(boardState.grid[0]) ? boardState.grid[0].length : 0);
    const validLines = Array.from(
      new Set(
        (Array.isArray(linesToClear) ? linesToClear : []).filter(
          (row) => Number.isInteger(row) && row >= 0 && row < rows,
        ),
      ),
    ).sort((a, b) => a - b);

    if (validLines.length === 0) {
      return {
        grid: boardState.grid,
        fadeGrid: boardState.fadeGrid,
        frozenGrid: boardState.frozenGrid,
        preservedFrozenRows: false,
      };
    }

    const applyGravityClear = (sourceGrid, sourceFadeGrid, sourceFrozenGrid, clearedRows) => {
      const clearedSet = new Set(clearedRows);
      const newGrid = [];
      const newFadeGrid = [];
      const newFrozenGrid = [];

      for (let r = 0; r < rows; r++) {
        if (!clearedSet.has(r)) {
          newGrid.push(sourceGrid[r]);
          newFadeGrid.push(sourceFadeGrid?.[r] || Array(cols).fill(0));
          newFrozenGrid.push(sourceFrozenGrid?.[r] || Array(cols).fill(false));
        }
      }

      for (let i = 0; i < clearedRows.length; i++) {
        newGrid.unshift(Array(cols).fill(0));
        newFadeGrid.unshift(Array(cols).fill(0));
        newFrozenGrid.unshift(Array(cols).fill(false));
      }

      return {
        grid: newGrid,
        fadeGrid: newFadeGrid,
        frozenGrid: newFrozenGrid,
      };
    };

    const preservedColumnsByRow = new Map(
      validLines.map((row) => [row, this.getMasterPikiiPreservedColumns(row, boardState)]),
    );
    const preservedFrozenLines = validLines.filter(
      (row) => (preservedColumnsByRow.get(row)?.size || 0) > 0,
    );
    const preservedFrozenRows = preservedFrozenLines.length > 0;

    if (!preservedFrozenRows) {
      return {
        ...applyGravityClear(
          boardState.grid,
          boardState.fadeGrid,
          boardState.frozenGrid,
          validLines,
        ),
        preservedFrozenRows,
      };
    }

    const preservedSet = new Set(preservedFrozenLines);
    const normalLines = validLines.filter((row) => !preservedSet.has(row));
    const workingGrid = boardState.grid.map((row) => row.slice());
    const workingFadeGrid = Array.from({ length: rows }, (_, r) =>
      (boardState.fadeGrid?.[r] || Array(cols).fill(0)).slice(),
    );
    const workingFrozenGrid = Array.from({ length: rows }, (_, r) =>
      (boardState.frozenGrid?.[r] || Array(cols).fill(false)).slice(),
    );

    // Master Pikii frozen rows clear in place: only the non-frozen minos vanish.
    for (const row of preservedFrozenLines) {
      const preservedColumns = preservedColumnsByRow.get(row) || new Set();
      for (let c = 0; c < cols; c++) {
        if (!preservedColumns.has(c)) {
          workingGrid[row][c] = 0;
          workingFadeGrid[row][c] = 0;
          workingFrozenGrid[row][c] = false;
        }
      }
    }

    if (normalLines.length === 0) {
      return {
        grid: workingGrid,
        fadeGrid: workingFadeGrid,
        frozenGrid: workingFrozenGrid,
        preservedFrozenRows,
      };
    }

    return {
      ...applyGravityClear(workingGrid, workingFadeGrid, workingFrozenGrid, normalLines),
      preservedFrozenRows,
    };
  }

  showBravoBanner(bravoValue = null) {
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const isKonohaMode =
      typeof modeId === "string" && (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"));

    this.hideBravoBanner();

    if (isKonohaMode) {
      const labelFontSize = `${Math.max(this.uiScale * 22, 18)}px`;
      const valueFontSize = `${Math.max(this.uiScale * 28, 22)}px`;
      const paddingX = Math.max(14, Math.floor(this.cellSize * 0.45));
      const paddingY = Math.max(10, Math.floor(this.cellSize * 0.35));
      const bannerY = this.borderOffsetY + paddingY;
      const valueText = String(
        bravoValue != null
          ? bravoValue
          : this.gameMode?.bravoCount ?? this.bravoCount ?? 0,
      );

      if (!this.bravoText) {
        this.bravoText = this.add
          .text(0, 0, "BRAVO", {
            fontSize: labelFontSize,
            fill: "#ffdd44",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Courier New",
            fontStyle: "bold",
          })
          .setOrigin(0, 0)
          .setDepth(9999)
          .setAlpha(0);
        if (this.overlayGroup) {
          this.overlayGroup.add(this.bravoText);
        } else {
          this.gameGroup.add(this.bravoText);
        }
      }

      if (!this.bravoValueText) {
        this.bravoValueText = this.add
          .text(0, 0, valueText, {
            fontSize: valueFontSize,
            fill: "#ffff88",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "right",
          })
          .setOrigin(1, 0)
          .setDepth(9999)
          .setAlpha(0);
        if (this.overlayGroup) {
          this.overlayGroup.add(this.bravoValueText);
        } else {
          this.gameGroup.add(this.bravoValueText);
        }
      }

      this.bravoActive = true;
      this.bravoText.setStyle({
        fontSize: labelFontSize,
        fill: "#ffdd44",
        stroke: "#000000",
        strokeThickness: 3,
        fontFamily: "Courier New",
        fontStyle: "bold",
      });
      this.bravoText
        .setText("BRAVO")
        .setPosition(this.borderOffsetX + paddingX, bannerY)
        .setOrigin(0, 0)
        .setScale(0.88)
        .setAngle(0)
        .setAlpha(0)
        .setVisible(true);
      this.bravoValueText.setStyle({
        fontSize: valueFontSize,
        fill: "#ffff88",
        stroke: "#000000",
        strokeThickness: 3,
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      });
      this.bravoValueText
        .setText(valueText)
        .setPosition(this.borderOffsetX + this.playfieldWidth - paddingX, bannerY)
        .setOrigin(1, 0)
        .setScale(0.88)
        .setAngle(0)
        .setAlpha(0)
        .setVisible(true);
      this.children.bringToTop(this.bravoText);
      this.children.bringToTop(this.bravoValueText);

      try {
        this.playSfx("gradeup", 0.7);
      } catch {}

      this.bravoTween = this.tweens.add({
        targets: this.bravoText,
        scale: { from: 0.88, to: 1 },
        alpha: { from: 0, to: 1 },
        angle: { from: 0, to: -10 },
        duration: 220,
        ease: "Back.Out",
      });
      this.bravoValueTween = this.tweens.add({
        targets: this.bravoValueText,
        scale: { from: 0.88, to: 1 },
        alpha: { from: 0, to: 1 },
        angle: { from: 0, to: 10 },
        duration: 220,
        ease: "Back.Out",
      });
      return;
    }

    const fontSize = this.timeText?.style?.fontSize || `${Math.max(this.uiScale * 28, 20)}px`;

    // Reuse if exists
    if (!this.bravoText) {
      this.bravoText = this.add
        .text(
          this.borderOffsetX + this.playfieldWidth / 2,
          this.borderOffsetY + this.playfieldHeight / 2,
          "BRAVO!!",
          {
            fontSize,
            fill: "#ffdd44",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          },
        )
        .setOrigin(0.5, 0.5)
        .setDepth(9999)
        .setAlpha(0);
      if (this.overlayGroup) {
        this.overlayGroup.add(this.bravoText);
      } else {
        this.gameGroup.add(this.bravoText);
      }
    }

    this.bravoActive = true;
    this.bravoText.setStyle({
      fontSize,
      fill: "#ffdd44",
      stroke: "#000000",
      strokeThickness: 0,
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "center",
    });
    this.bravoText
      .setText("BRAVO!!")
      .setPosition(this.borderOffsetX + this.playfieldWidth / 2, this.borderOffsetY + this.playfieldHeight / 2)
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setScale(0)
      .setAngle(0)
      .setVisible(true);
    if (this.bravoValueText) {
      this.bravoValueText.setVisible(false);
    }
    this.children.bringToTop(this.bravoText);

    try {
      this.playSfx("firework", 0.85);
    } catch {}

    // Preserve the original non-Konoha Bravo sequence.
    this.bravoTween = this.tweens.add({
      targets: this.bravoText,
      scale: { from: 0, to: 1 },
      alpha: { from: 0, to: 1 },
      angle: { from: 0, to: 360 },
      duration: 1000,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.bravoTween = this.tweens.add({
          targets: this.bravoText,
          scale: { from: 1, to: 0.9 },
          alpha: { from: 1, to: 0 },
          duration: 3000,
          ease: "Cubic.easeInOut",
          onComplete: () => {
            if (this.bravoText) {
              this.bravoText.setVisible(false);
            }
            this.bravoActive = false;
            this.bravoHideEvent = null;
            this.bravoTween = null;
          },
        });
      },
    });
  }

  getAttackTableForSpin(spinType, lineClear) {
    const selectedAttackTable = this.getSelectedAttackTable();
    const basis = this.getSectionBasisValue();
    const pendingEntries = Object.entries(this.coolAnnouncementsTargets || {});
    if (pendingEntries.length === 0) return;

    pendingEntries.forEach(([secStr, target]) => {
      const sec = Number.parseInt(secStr, 10);
      if (typeof target !== "number" || this.coolAnnouncementsShown.has(sec)) return;
      const windowStart = target;
      const windowEnd = target + 11; // 80–90 inclusive if target is 80–90
      if (basis >= windowStart && basis <= windowEnd) {
        this.showCoolRegretBanner("COOL");
        this.coolAnnouncementsShown.add(sec);
        delete this.coolAnnouncementsTargets[sec];
      }
    });
  }

  checkCoolRegretAnnouncements() {
    const sectionLength = this.getSectionLength();
    const basis = this.getSectionBasisValue();
    const pendingEntries = Object.entries(this.coolAnnouncementsTargets || {});
    if (pendingEntries.length === 0) return;

    pendingEntries.forEach(([secStr, target]) => {
      const sec = Number.parseInt(secStr, 10);
      if (typeof target !== "number" || this.coolAnnouncementsShown.has(sec)) return;
      const windowStart = target;
      const windowEnd = target + 11; // 80–90 inclusive if target is 80–90
      if (basis >= windowStart && basis <= windowEnd) {
        this.showCoolRegretBanner("COOL");
        this.coolAnnouncementsShown.add(sec);
        delete this.coolAnnouncementsTargets[sec];
      }
    });
  }

  showReadyGo() {
    this.readyGoPhase = true;
    const centerX = this.game.config.width / 2;
    const centerY = this.game.config.height / 2;

    // Re-apply zen display rules during Ready/Go (hide PPS/pieces when displayMode is "none")
    if (typeof this.updateZenSandboxDisplay === "function") {
      this.updateZenSandboxDisplay();
    }

    // Pre-initialize PPS/UI at scene display so sprint modes start at zero
    this.totalPiecesPlaced = 0;
    this.activeTime = 0;
    this.areTime = 0;
    this.conventionalPPS = 0;
    this.rawPPS = 0;
    this.maxPpsRecorded = 0;
    this.worstChoke = 0;
    this.ppsHistory = [];
    this.ppsLockSampleIndices = [];
    this.ppsSampleTimer = 0;
    this.lastPpsRecordedPieceCount = 0;
    if (this.ppsText) this.ppsText.setText("0.00");
    if (this.pieceCountText) this.pieceCountText.setText("0");
    if (this.rawPpsText) this.rawPpsText.setText("0.00");
    if (this.ppsGraphGraphics) this.ppsGraphGraphics.clear();
    if (this.ppsSummaryText && this.ppsSummaryText.scene) {
      this.ppsSummaryText.setText("Max PPS: -- | Worst choke: --");
    }

    // Prepare first piece during Ready/Go so it is visible (peek without consuming queue)
    if (!this.previewPiece) {
      if (this.nextPieces.length < 6) {
        this.generateNextPieces();
      }
      if (this.gameMode && typeof this.gameMode.applyCyclonePreviewToQueue === "function") {
        this.gameMode.applyCyclonePreviewToQueue(this);
      }
      const rawNext = this.nextPieces[0];
      let pieceType =
        typeof rawNext === "string"
          ? rawNext
          : typeof rawNext?.type === "string"
            ? rawNext.type
            : typeof rawNext?.piece === "string"
              ? rawNext.piece
              : rawNext;
      if (typeof pieceType !== "string") {
        pieceType = "I";
      }
      pieceType = pieceType.toUpperCase();
      this.previewPiece = new Piece(
        pieceType,
        this.rotationSystem,
        this.getStoredPieceRotation(rawNext, 0),
      );
    }

    const readyText = this.add
      .text(centerX, centerY, "READY", {
        fontSize: "64px",
        fill: "#ffff00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    // Render Ready/Go above everything
    this.children.bringToTop(readyText);
    this.overlayGroup.add(readyText);
    readyText.setDepth(9999);

    this.playSfx("ready", 0.7);

    // Ensure Zen config is loaded before applying cheese
    if (!this.zenSandboxConfig && typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.loadConfig) {
      this.zenSandboxConfig = ZenSandboxHelper.loadConfig();
    }
    // Seed a persistent cheese hole column for the session (fixed across injections when percent=0)
    if (this.board && !Number.isInteger(this.zenCheeseHoleCol)) {
      const cols = Number.isFinite(this.board.cols) && this.board.cols > 0 ? this.board.cols : 10;
      this.zenCheeseHoleCol = Math.floor(Math.random() * cols) % cols;
    }
    // Apply cheese previews in Zen sandbox modes (fixed_rows only; fixed_timing waits for first spawn)
    if (this.isZenSandboxActive && this.isZenSandboxActive() && this.board && this.zenSandboxConfig) {
      const { cheeseMode, cheeseRows, cheesePercent } = this.zenSandboxConfig;
      if (cheeseMode === "fixed_rows") {
        // Immediately inject target rows to avoid missing baseline at spawn
        if (typeof this.board.addCheeseRows === "function") {
          const rows = Math.max(1, Math.floor(Number(cheeseRows) || 1));
          const percent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
          this.board.addCheeseRows(rows, percent);
        }
        this.ensureZenCheeseBaseline?.(0);
      } else if (cheeseMode === "fixed_timing") {
        // Do not inject before first spawn; start timer at first spawn
        this.zenCheeseTimer = 0;
      }
    }

    this.time.delayedCall(1000, () => {
      readyText.destroy();

      const goText = this.add
        .text(centerX, centerY, "GO", {
          fontSize: "64px",
          fill: "#00ff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.children.bringToTop(goText);
      this.overlayGroup.add(goText);
      goText.setDepth(9999);

      this.playSfx("go", 0.7);

      this.time.delayedCall(500, () => {
        goText.destroy();
        this.readyGoPhase = false;
        this.gameStarted = true;
        // Start timer at GO
        this.startTime = Date.now();
        this.gameStartTime = this.startTime;
        this.currentTime = 0;
        this.sectionStartTime = 0;
        // Hard reset PPS metrics/UI at run start (covers sprint modes)
        this.totalPiecesPlaced = 0;
        this.activeTime = 0;
        this.areTime = 0;
        this.conventionalPPS = 0;
        this.rawPPS = 0;
        this.maxPpsRecorded = 0;
        this.worstChoke = 0;
        this.ppsHistory = [];
        this.lastPpsRecordedPieceCount = 0;
        if (this.ppsText) this.ppsText.setText("0.00");
        if (this.rawPpsText) this.rawPpsText.setText("0.00");
        if (this.ppsGraphGraphics) this.ppsGraphGraphics.clear();
        if (this.ppsSummaryText && this.ppsSummaryText.scene) {
          this.ppsSummaryText.setText("Max PPS: -- | Worst choke: --");
        }
        this.previewPiece = null;
        if (this.nextPieces.length < 6) {
          this.generateNextPieces();
        }
        this.sectionStartTime = this.currentTime;
        this.currentSection = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
        this.currentSectionTetrisCount = 0;
        this.spawnPiece();
        this.startInitialBGM();
      });
    });
  }

  updateTimer() {
    if (
      !this.gameStarted ||
      !this.startTime ||
      this.isPaused ||
      this.level999Reached ||
      this.gameOver ||
      this.zenTopoutFreezeActive ||
      this.metricsPauseActive ||
      (this.minoFadeActive && this.gameOverFadeDoneTime === null) ||
      this.creditsActive
    ) {
      return;
    }
    this.currentTime = (Date.now() - this.startTime) / 1000;
    // Keep PPS UI clamped to zero when no pieces have been placed yet
    if (this.totalPiecesPlaced === 0) {
      this.conventionalPPS = 0;
      this.rawPPS = 0;
      if (this.ppsText) this.ppsText.setText("0.00");
      if (this.rawPpsText) this.rawPpsText.setText("0.00");
    }
  }

  isBackstepModeActive() {
    const specialMechanics =
      (this.gameMode &&
        typeof this.gameMode.getConfig === "function" &&
        this.gameMode.getConfig()?.specialMechanics) ||
      {};
    return specialMechanics.rewind === true;
  }

  isBackstepSnapshotCaptureEnabled() {
    const specialMechanics =
      (this.gameMode &&
        typeof this.gameMode.getConfig === "function" &&
        this.gameMode.getConfig()?.specialMechanics) ||
      {};
    return specialMechanics.rewind === true || specialMechanics.backstepSnapshots === true;
  }

  cloneBackstepValue(value) {
    if (value === undefined || value === null) return value;
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  capturePieceBackstepState(piece) {
    if (!piece) return null;
    return {
      type: piece.type,
      rotationSystem: piece.rotationSystem,
      rotation: piece.rotation,
      textureKey: piece.textureKey || null,
      x: piece.x,
      y: piece.y,
      fractionalY: piece.fractionalY || 0,
      color: piece.color,
      shape: piece.shape.map((row) => [...row]),
      finesseInputs: this.cloneBackstepValue(piece.finesseInputs || { moves: 0, rotations: 0 }),
      extra: this.cloneBackstepValue({
        isPowerup: piece.isPowerup,
        powerupType: piece.powerupType,
        powerupFillColor: piece.powerupFillColor,
        powerupColors: piece.powerupColors,
        baseColor: piece.baseColor,
        tgm4Cyclone: piece.tgm4Cyclone,
        tgm4CycloneRotation: piece.tgm4CycloneRotation,
        tgm4MasterPikii: piece.tgm4MasterPikii,
        freezeAfter: piece.freezeAfter,
      }),
    };
  }

  restorePieceBackstepState(pieceState) {
    if (!pieceState) return null;
    const piece = new Piece(
      pieceState.type,
      pieceState.rotationSystem || this.rotationSystem,
      pieceState.rotation || 0,
      pieceState.textureKey || null,
    );
    piece.x = pieceState.x;
    piece.y = pieceState.y;
    piece.fractionalY = pieceState.fractionalY || 0;
    piece.color = pieceState.color;
    piece.shape = Array.isArray(pieceState.shape)
      ? pieceState.shape.map((row) => [...row])
      : piece.getRotatedShape().map((row) => [...row]);
    piece.finesseInputs = this.cloneBackstepValue(
      pieceState.finesseInputs || { moves: 0, rotations: 0 },
    );
    Object.assign(piece, this.cloneBackstepValue(pieceState.extra || {}));
    return piece;
  }

  captureBackstepSnapshot(reason = "active") {
    if (!this.isBackstepSnapshotCaptureEnabled() || !this.currentPiece) return null;
    const modeBackstepState =
      this.gameMode && typeof this.gameMode.captureBackstepState === "function"
        ? this.gameMode.captureBackstepState(this)
        : null;
    return {
      reason,
      sectionIndex:
        typeof this.currentSection === "number"
          ? this.currentSection
          : Math.floor((this.level || 0) / this.getSectionLength()),
      board: {
        rows: this.board.rows,
        cols: this.board.cols,
        grid: this.cloneBackstepValue(this.board.grid),
        fadeGrid: this.cloneBackstepValue(this.board.fadeGrid),
        frozenGrid: this.cloneBackstepValue(this.board.frozenGrid),
        currentTextureKey: this.board.currentTextureKey || null,
      },
      currentPiece: this.capturePieceBackstepState(this.currentPiece),
      holdPiece: this.capturePieceBackstepState(this.holdPiece),
      nextPieces: this.cloneBackstepValue(this.nextPieces),
      pieceHistory: this.cloneBackstepValue(this.pieceHistory),
      firstPiece: this.firstPiece,
      bagQueue: this.cloneBackstepValue(this.bagQueue),
      bagDrawCount: this.bagDrawCount,
      lastClassicPiece: this.lastClassicPiece,
      pairsQueue: this.cloneBackstepValue(this.pairsQueue),
      tgm3BagQueue: this.cloneBackstepValue(this.tgm3BagQueue),
      canHold: this.canHold,
      holdRequest: false,
      currentSectionPieceIndex: this.currentSectionPieceIndex || 0,
      level: this.level,
      score: this.score,
      totalLines: this.totalLines,
      piecesPlaced: this.piecesPlaced,
      totalPiecesPlaced: this.totalPiecesPlaced,
      comboCount: this.comboCount,
      backToBack: this.backToBack,
      lastClearType: this.lastClearType,
      lastPieceType: this.lastPieceType,
      totalAttack: this.totalAttack,
      attackSpike: this.attackSpike,
      lastAttackTime: this.lastAttackTime,
      b2bChainCount: this.b2bChainCount,
      standardComboCount: this.standardComboCount,
      standardComboLastLineTime: this.standardComboLastLineTime,
      sectionStartTime: this.sectionStartTime,
      sectionTimes: this.cloneBackstepValue(this.sectionTimes),
      sectionTetrises: this.cloneBackstepValue(this.sectionTetrises),
      currentSectionTetrisCount: this.currentSectionTetrisCount,
      currentTime: this.currentTime,
      activeTime: this.activeTime,
      areTime: this.areTime,
      grade: this.grade,
      internalGrade: this.internalGrade,
      modeBackstepState,
      lastLockedPiece: this.cloneBackstepValue(this.lastLockedPieceState),
    };
  }

  pushBackstepSnapshot(reason = "active") {
    if (!this.isBackstepSnapshotCaptureEnabled() || this.backstepRestoreInProgress) return;
    const snapshot = this.captureBackstepSnapshot(reason);
    if (!snapshot) return;
    this.backstepHistory.push(snapshot);
    if (this.backstepHistory.length > 256) {
      this.backstepHistory.shift();
    }
  }

  restoreBackstepSnapshot(snapshot, options = {}) {
    if (!snapshot || !this.board) return false;
    const { deferCurrentPiece = false } = options;

    this.backstepRestoreInProgress = true;
    try {
      this.board.rows = snapshot.board.rows;
      this.board.cols = snapshot.board.cols;
      this.board.grid = this.cloneBackstepValue(snapshot.board.grid);
      this.board.fadeGrid = this.cloneBackstepValue(snapshot.board.fadeGrid);
      this.board.frozenGrid = this.cloneBackstepValue(snapshot.board.frozenGrid);
      this.board.currentTextureKey = snapshot.board.currentTextureKey || null;

      this.pendingBackstepPieceState = deferCurrentPiece
        ? this.cloneBackstepValue(snapshot.currentPiece)
        : null;
      this.currentPiece = deferCurrentPiece
        ? null
        : this.restorePieceBackstepState(snapshot.currentPiece);
      this.holdPiece = this.restorePieceBackstepState(snapshot.holdPiece);
      this.nextPieces = this.cloneBackstepValue(snapshot.nextPieces || []);
      this.pieceHistory = this.cloneBackstepValue(snapshot.pieceHistory || ["Z", "Z", "S", "S"]);
      this.firstPiece = !!snapshot.firstPiece;
      this.bagQueue = this.cloneBackstepValue(snapshot.bagQueue || []);
      this.bagDrawCount = snapshot.bagDrawCount || 0;
      this.lastClassicPiece = snapshot.lastClassicPiece || null;
      this.pairsQueue = this.cloneBackstepValue(snapshot.pairsQueue || []);
      this.tgm3BagQueue = this.cloneBackstepValue(snapshot.tgm3BagQueue || []);
      this.canHold = snapshot.canHold !== false;
      this.holdRequest = false;
      this.currentSectionPieceIndex = snapshot.currentSectionPieceIndex || 0;

      this.level = snapshot.level || 0;
      this.score = snapshot.score || 0;
      this.totalLines = snapshot.totalLines || 0;
      this.piecesPlaced = snapshot.piecesPlaced || 0;
      this.totalPiecesPlaced = snapshot.totalPiecesPlaced || 0;
      this.comboCount = snapshot.comboCount ?? -1;
      this.backToBack = !!snapshot.backToBack;
      this.lastClearType = snapshot.lastClearType || null;
      this.lastPieceType = snapshot.lastPieceType || null;
      this.totalAttack = snapshot.totalAttack || 0;
      this.attackSpike = snapshot.attackSpike || 0;
      this.lastAttackTime = snapshot.lastAttackTime || 0;
      this.b2bChainCount = snapshot.b2bChainCount ?? -1;
      this.standardComboCount = snapshot.standardComboCount ?? -1;
      this.standardComboLastLineTime = snapshot.standardComboLastLineTime || 0;
      this.sectionTimes = this.cloneBackstepValue(snapshot.sectionTimes || this.sectionTimes || []);
      this.sectionTetrises = this.cloneBackstepValue(snapshot.sectionTetrises || this.sectionTetrises || []);
      this.currentSection =
        typeof snapshot.sectionIndex === "number"
          ? snapshot.sectionIndex
          : Math.floor((snapshot.level || 0) / this.getSectionLength());
      this.currentSectionTetrisCount = snapshot.currentSectionTetrisCount || 0;
      this.grade = snapshot.grade ?? this.grade;
      this.internalGrade = snapshot.internalGrade ?? this.internalGrade;
      this.lastLockedPieceState = this.cloneBackstepValue(snapshot.lastLockedPiece || null);

      this.areActive = false;
      this.areTimer = 0;
      this.isClearingLines = false;
      this.clearedLines = [];
      this.lineClearPhase = false;
      this.lineClearDelayActive = false;
      this.lineClearDelayDuration = 0;
      this.pendingLineAREDelay = 0;
      this.isGrounded = false;
      this.lockDelay = 0;
      this.lockDelayBufferedStart = false;
      this.skipGravityThisFrame = false;
      this.gravityAccum = 0;
      this.lastGroundedY = null;
      this.lastSpinInfo = null;
      this.softDropRows = 0;
      this.hardDropRows = 0;
      this.softDropAccum = 0;
      this.softDropPressed = false;
      this.wasGroundedDuringSoftDrop = false;
      this.finesseActiveForPiece = !!this.currentPiece;
      this.gameOver = false;
      this.leftKeyPressed = false;
      this.rightKeyPressed = false;
      this.leftInRepeat = false;
      this.rightInRepeat = false;
      this.leftTimer = 0;
      this.rightTimer = 0;
      this.kKeyPressed = false;
      this.spaceKeyPressed = false;
      this.lKeyPressed = false;
      this.xKeyPressed = false;
      this.rotate180Pressed = false;

      if (this.gameMode && typeof this.gameMode.restoreBackstepState === "function") {
        this.gameMode.restoreBackstepState(this, snapshot.modeBackstepState || {});
      }

      if (this.scoreText) this.scoreText.setText(this.score.toString());
      if (this.pieceCountText) this.pieceCountText.setText(this.totalPiecesPlaced.toString());
      if (this.asukaKitaText && typeof this.gameMode?.kitas === "number") {
        this.asukaKitaText.setText(this.gameMode.kitas.toString());
      }
      this.updateGradeUIVisibility();
      return true;
    } finally {
      this.backstepRestoreInProgress = false;
    }
  }

  performBackstep() {
    if (!this.isBackstepModeActive() || this.backstepHistory.length < 2) return false;
    const currentSnapshot = this.backstepHistory[this.backstepHistory.length - 1];
    const targetSnapshot = this.backstepHistory[this.backstepHistory.length - 2];
    if (!targetSnapshot || !currentSnapshot) return false;
    const currentSection =
      typeof this.currentSection === "number"
        ? this.currentSection
        : Math.floor((this.level || 0) / this.getSectionLength());
    if (targetSnapshot.sectionIndex < currentSection) {
      return false;
    }
    if (
      targetSnapshot.sectionIndex === currentSection &&
      (targetSnapshot.currentSectionPieceIndex || 0) <= 1
    ) {
      return false;
    }

    this.backstepHistory.pop();
    const rewindAnimationPieceState =
      currentSnapshot.reason === "spawn" ? currentSnapshot.lastLockedPiece : null;
    const restored = this.restoreBackstepSnapshot(
      this.backstepHistory[this.backstepHistory.length - 1],
      { deferCurrentPiece: !!rewindAnimationPieceState },
    );
    if (!restored) return false;

    if (this.gameMode && typeof this.gameMode.backsteps === "number") {
      this.gameMode.backsteps += 1;
    }

    if (rewindAnimationPieceState) {
      this.startBackstepAnimationSequence([rewindAnimationPieceState]);
    } else if (this.currentPiece || this.pendingBackstepPieceState) {
      this.currentPiece =
        this.currentPiece || this.restorePieceBackstepState(this.pendingBackstepPieceState);
      this.pendingBackstepPieceState = null;
      this.pieceSpawnTime = this.time.now;
      this.pieceActiveTime = 0;
      this.resetLockDelay();
      this.isGrounded = false;
      this.gravityAccum = 0;
      this.resetFinessePieceInputs(this.currentPiece);
    }
    return true;
  }

  startBackstepAnimationSequence(
    pieceStates,
    options = {},
  ) {
    const items = Array.isArray(pieceStates)
      ? pieceStates
          .map((pieceState) => {
            const piece = this.restorePieceBackstepState(pieceState);
            if (!piece) return null;
            return {
              piece,
              baseY: piece.y || 0,
            };
          })
          .filter(Boolean)
      : [];
    if (!items.length) {
      this.finishBackstepAnimationSequence();
      return false;
    }

    this.backstepAnimationQueue = items;
    this.backstepAnimationDuration = Math.max(1 / 60, options.duration ?? this.backstepAnimationDuration ?? 61 / 60);
    this.backstepAnimationRiseDistance = Math.max(0.5, options.riseDistance ?? 1.25);
    this.backstepAnimationTimer = 0;
    this.backstepAnimationActive = true;
    this.backstepAnimationPiece = null;
    this.backstepAnimationBaseY = 0;
    this.advanceBackstepAnimationPiece();
    return true;
  }

  advanceBackstepAnimationPiece() {
    const nextItem = Array.isArray(this.backstepAnimationQueue)
      ? this.backstepAnimationQueue.shift()
      : null;
    if (!nextItem) {
      this.finishBackstepAnimationSequence();
      return false;
    }

    this.backstepAnimationPiece = nextItem.piece;
    this.backstepAnimationBaseY = nextItem.baseY || 0;
    this.backstepAnimationTimer = 0;
    this.backstepAnimationActive = true;
    return true;
  }

  finishBackstepAnimationSequence() {
    this.backstepAnimationActive = false;
    this.backstepAnimationTimer = 0;
    this.backstepAnimationPiece = null;
    this.backstepAnimationBaseY = 0;
    this.backstepAnimationQueue = [];
    if (this.pendingBackstepPieceState) {
      this.currentPiece = this.restorePieceBackstepState(this.pendingBackstepPieceState);
      this.pendingBackstepPieceState = null;
      this.pieceSpawnTime = this.time.now;
      this.pieceActiveTime = 0;
      this.resetLockDelay();
      this.isGrounded = false;
      this.gravityAccum = 0;
      this.resetFinessePieceInputs(this.currentPiece);
    }
  }

  findBackstepSnapshotForAbsoluteTime(targetTime) {
    if (!Array.isArray(this.backstepHistory) || !this.backstepHistory.length) return null;
    let candidate = this.backstepHistory[0];
    for (const snapshot of this.backstepHistory) {
      if (typeof snapshot?.currentTime !== "number") continue;
      if (snapshot.currentTime > targetTime) break;
      candidate = snapshot;
    }
    return candidate;
  }

  update(time, delta) {
    // Track delta time in seconds for consistency
    this.deltaTime = delta / 1000;

    // If loading or not fully initialized, skip gameplay but still draw UI (next queue, etc.)
    if (this.loadingPhase) {
      this.draw();
      return;
    }

    // Ensure spike text stays hidden during Ready/Go without affecting other attack UI
    if (this.spikeText && this.readyGoPhase) {
      this.spikeText.setVisible(false);
    }

    // During Zen topout freeze, halt all mechanics and timers but keep drawing current frame.
    // Safety: if the Phaser timer failed to fire, finish after 2s based on wall-clock time.
    if (this.zenTopoutFreezeActive) {
      if (!this.zenTopoutFreezeLogged) {
        try {
          console.log("[ZenTopout] freeze tick", {
            pending: this.zenTopoutPendingFinish,
            start: this.zenTopoutFreezeStart,
            now: this.time?.now || Date.now(),
          });
        } catch {}
        this.zenTopoutFreezeLogged = true;
      }
      const finishZenSafe = (reason = "freeze_tick") => {
        if (typeof this.finishZenTopout === "function") {
          try {
            this.finishZenTopout(reason);
            return;
          } catch (err) {
            try {
              console.error("[ZenTopout] finishZenTopout threw, falling back", err);
            } catch {}
          }
        }
        // Inline fallback: clear board and respawn without GAME OVER UI/SFX
        this.zenTopoutPendingFinish = false;
        this.zenTopoutFreezeActive = false;
        this.zenTopoutCooldown = false;
        this.zenTopoutFreezeStart = 0;
        this.gameOver = false;
        this.showGameOverText = false;
        this.gameOverTextTimer = 0;
        this.gameOverSfxPlayed = true;
        this.gameOverFadeDoneTime = null;
        if (this.board) {
          if (typeof this.board.clearAll === "function") {
            this.board.clearAll();
          } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
            for (let r = 0; r < this.board.rows; r++) {
              this.board.grid[r] = Array(this.board.cols).fill(0);
              this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
            }
          }
          this.ensureZenCheeseBaseline?.(0);
        }
        this.playSfx?.("fall");
        this.currentPiece = null;
        this.isGrounded = false;
        if (this.nextPieces.length < 6) this.generateNextPieces();
        this.spawnPiece?.();
      };
      const now = this.time?.now || Date.now();
      if (this.zenTopoutPendingFinish && this.zenTopoutFreezeStart && now - this.zenTopoutFreezeStart >= 2000) {
        finishZenSafe("freeze_tick");
      }
      // Safety: if freeze is stuck but pending got cleared, force finish after 2.5s
      if (!this.zenTopoutPendingFinish && this.zenTopoutFreezeStart && now - this.zenTopoutFreezeStart >= 2500) {
        this.zenTopoutPendingFinish = true;
        finishZenSafe("freeze_watchdog");
      }
      // Suppress GAME OVER UI/SFX while frozen
      this.gameOver = false;
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;
      this.preserveBoardOnStaticEnd = false;
      this.gameOverAutoExitDelay = 10;
      // Continue mino fade progression during freeze
      if (this.minoFadeActive) {
        this.minoFadeTimer += this.deltaTime;
        const totalRows = this.placedMinoRows.length;
        if (totalRows === 0 || this.minoFadePerRowDuration <= 0) {
          this.minoFadeActive = false;
          this.fadingComplete = true;
        } else if (this.minoFadeProgress < totalRows) {
          const rowIndex = this.minoFadeProgress;
          const rowToFade = this.placedMinoRows[rowIndex];
          const perRow = this.minoFadePerRowDuration;
          const alpha = Math.max(0, 1 - this.minoFadeTimer / perRow);
          this.minoRowFadeAlpha[rowToFade] = alpha;
          if (this.minoFadeTimer >= perRow) {
            this.minoFadeTimer = 0;
            this.minoFadeProgress++;
            this.minoRowFadeAlpha[rowToFade] = 0;
            if (this.minoFadeProgress >= totalRows) {
              this.minoFadeActive = false;
              this.fadingComplete = true;
            }
          }
        }
      }
      this.draw();
      return;
    }

    // Zen sandbox: timed cheese injection
    this.tickZenCheese(this.deltaTime);
    // During READY/GO sequence, still allow directional keys to be sampled for DAS/ARE carry
    if (this.readyGoPhase && !this.gameStarted) {
      if (this.keys) {
        const leftDown =
          !!(this.cursors?.left && this.cursors.left.isDown) ||
          !!(this.keys.left && this.keys.left.isDown);
        const rightDown =
          !!(this.cursors?.right && this.cursors.right.isDown) ||
          !!(this.keys.right && this.keys.right.isDown);
        const zKeyDown = !!(this.keys.left && this.keys.left.isDown);
        const cKeyDown = !!(this.keys.right && this.keys.right.isDown);
        this.updateBufferedDASInput(leftDown || zKeyDown, rightDown || cKeyDown, this.deltaTime);
      }
      this.draw();
      return;
    }

    // Safety: ensure input keys are initialized before use
    if (!this.keys || !this.cursors) {
      return;
    }

    // Input handling (null-safe)
    const isDown = (key) => !!(key && key.isDown);
    const justDown = (key) => !!(key && Phaser.Input.Keyboard.JustDown(key));

    if (
      this.creditsActive &&
      this.gameMode &&
      typeof this.gameMode.shouldAllowCreditsSkip === "function" &&
      this.gameMode.shouldAllowCreditsSkip(this)
    ) {
      const creditsSkipKeys = [
        this.cursors?.up,
        this.cursors?.down,
        this.cursors?.left,
        this.cursors?.right,
        this.keys?.left,
        this.keys?.right,
        this.keys?.softDrop,
        this.keys?.hardDrop,
        this.keys?.rotate180,
        this.keys?.rotateCW,
        this.keys?.rotateCW2,
        this.keys?.rotateCCW,
        this.keys?.rotateCCW2,
        this.keys?.hold,
        this.keys?.start,
        this.keys?.pause,
        this.keys?.menu,
        this.restartKey,
      ];
      const anyCreditsSkipHeld = creditsSkipKeys.some((key) => isDown(key));
      if (!this.creditsSkipArmed) {
        if (!anyCreditsSkipHeld) {
          this.creditsSkipArmed = true;
        }
      } else if (creditsSkipKeys.some((key) => justDown(key))) {
        this.finalizeCreditsRoll();
        if (this.exitingToMenu) {
          return;
        }
        this.draw();
        return;
      }
    }

    // Handle pause before gameplay inputs so no movement/rotation/drop can run while paused.
    if (justDown(this.keys.pause) && !this.gameOver) {
      this.togglePause();
    }
    if (this.isPaused) {
      if (justDown(this.keys.menu)) {
        this.goToMenu();
        return;
      }
      this.draw();
      return;
    }

    if (this.backstepAnimationActive) {
      if (
        !this.gameOver &&
        this.keys?.backstep &&
        Phaser.Input.Keyboard.JustDown(this.keys.backstep) &&
        this.performBackstep()
      ) {
        this.draw();
        return;
      }
      if (this.gameMode && this.gameMode.update) {
        this.gameMode.update(this, this.deltaTime);
      }
      this.backstepAnimationTimer += this.deltaTime;
      const progress = Math.min(1, this.backstepAnimationTimer / this.backstepAnimationDuration);
      if (this.backstepAnimationPiece) {
        this.backstepAnimationPiece.y =
          this.backstepAnimationBaseY - progress * (this.backstepAnimationRiseDistance || 1.25);
      }
      if (progress >= 1) {
        this.advanceBackstepAnimationPiece();
      }
      this.draw();
      return;
    }

    // Custom key bindings (safe for modes that don't define all keys)
    const zKeyDown = isDown(this.keys.left);
    const cKeyDown = isDown(this.keys.right);
    const sKeyDown = isDown(this.keys.softDrop);
    const xKeyDown = isDown(this.keys.hardDrop);
    const rotate180Down = isDown(this.keys.rotate180);
    const kKeyDown = isDown(this.keys.rotateCW) || isDown(this.keys.rotateCW2);
    const spaceKeyDown =
      isDown(this.keys.rotateCCW) || isDown(this.keys.rotateCCW2);
    const lKeyDown = isDown(this.keys.rotateCCW2);
    const backstepJustDown = justDown(this.keys.backstep);
    const startDown = isDown(this.keys.start);
    const startJustDown = justDown(this.keys.start);
    const holdJustDown = justDown(this.keys.hold);
    if (holdJustDown) {
      this.holdRequest = true;
    }

    if (
      !this.gameOver &&
      !this.backstepAnimationActive &&
      backstepJustDown &&
      this.performBackstep()
    ) {
      this.draw();
      return;
    }

    // Global hold consumption pass (piece-active, not in ARE)
    if (
      this.holdEnabled &&
      this.holdRequest &&
      !this.areActive &&
      this.currentPiece
    ) {
      if (this.performHoldSwap({ bypassCanHold: false, isIHS: false })) {
        this.holdRequest = false;
      } else {
      }
    }

    const leftDown = isDown(this.cursors.left);
    const rightDown = isDown(this.cursors.right);
    const downDown = isDown(this.cursors.down);
    const softDropHeld = downDown || sKeyDown;
    const leftPressed = leftDown || zKeyDown;
    const rightPressed = rightDown || cKeyDown;
    const bothPressed = leftPressed && rightPressed;

    // During top-out, ignore all movement/rotation. Only allow restart once the fade has finished.
    if (this.gameOver) {
      this.leftKeyPressed = false;
      this.rightKeyPressed = false;
      this.leftInRepeat = false;
      this.rightInRepeat = false;
      this.leftTimer = 0;
      this.rightTimer = 0;
      this.kKeyPressed = false;
      this.spaceKeyPressed = false;
      this.lKeyPressed = false;
      this.xKeyPressed = false;
      if (justDown(this.restartKey) && !this.minoFadeActive && this.fadingComplete) {
        this.goToMenu();
        return;
      }
      // Let game-over logic (fade/timers/UI) run below, but skip movement/rotation.
    }

    // Update BGM scheduling
    this.updateBGM();
    // Fallback: ensure section transition/evaluation fires when basis passes threshold
    {
      const sectionLength = this.getSectionLength();
      const maxLevel =
        this.gameMode && typeof this.gameMode.getGravityLevelCap === "function"
          ? (typeof this.gameMode.getDisplayLevelCap === "function"
              ? this.gameMode.getDisplayLevelCap()
              : this.gameMode.getGravityLevelCap())
          : this.gravityLevelCap || 999;
      const basis = this.getSectionBasisValue();
      const targetSection = Math.floor(basis / sectionLength);
      const allowBackfill = (this.startingLevel || 0) === 0;
      const needsFirstEval =
        allowBackfill &&
        targetSection > 0 &&
        typeof this.sectionTimes[targetSection - 1] !== "number";
      const forceFirstSection =
        allowBackfill &&
        basis >= sectionLength &&
        typeof this.sectionTimes[0] !== "number";
      if (
        (needsFirstEval || targetSection > this.currentSection || forceFirstSection) &&
        this.level < maxLevel
      ) {
        this.handleSectionTransition(targetSection || 1);
      }
    }
    // Check COOL/REGRET banner scheduling after any potential section transition
    this.checkCoolRegretAnnouncements();

    const skipDASMovementThisFrame = !this.gameOver && this.skipDASMovementAfterSpawn;
    if (!this.gameOver) {
      this.skipDASMovementAfterSpawn = false;
    }

    if (this.gameOver) {
      // Skip any input-driven movement/rotation/drop.
    } else if (this.rotationSystem === "ARS") {

      // Hold first (if supported and not in ARE)
      if (!this.areActive && this.holdEnabled && this.holdRequest) {
        if (this.performHoldSwap({ bypassCanHold: false, isIHS: false })) {
          this.holdRequest = false;
        }
      }
      // ARS: Process rotation before movement

      // Track rotation keys for immediate response
      this.kKeyPressed = this.kKeyPressed || false;
      this.spaceKeyPressed = this.spaceKeyPressed || false;
      this.lKeyPressed = this.lKeyPressed || false;
      this.xKeyPressed = this.xKeyPressed || false;

      // K key for clockwise rotation - immediate response
      if (kKeyDown && !this.kKeyPressed) {
        this.kKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, 1, this.rotationSystem)
        ) {
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          } else {
            this.spinRotatedWhileGrounded = false;
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
          // Don't play ground sound on rotation failure
        }
      } else if (!kKeyDown && this.kKeyPressed) {
        this.kKeyPressed = false;
      }

      // 180 rotation - immediate response
      if (rotate180Down && !this.rotate180Pressed) {
        this.rotate180Pressed = true;
        if (this.currentPiece) {
          const first = this.currentPiece.rotate(this.board, 1, this.rotationSystem);
          const second = this.currentPiece.rotate(this.board, 1, this.rotationSystem);
          if (first || second) {
            this.resetLockDelay();
            if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
              this.markGroundedSpin();
            } else {
              this.spinRotatedWhileGrounded = false;
            }
          } else {
            this.isGrounded = !this.currentPiece.canMoveDown(this.board);
          }
        }
      } else if (!rotate180Down && this.rotate180Pressed) {
        this.rotate180Pressed = false;
      }

      // Space key for counter-clockwise rotation - immediate response
      if (spaceKeyDown && !this.spaceKeyPressed) {
        this.spaceKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, -1, this.rotationSystem)
        ) {
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          } else {
            this.spinRotatedWhileGrounded = false;
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
        }
      } else if (!spaceKeyDown && this.spaceKeyPressed) {
        this.spaceKeyPressed = false;
      }

      // L key for counter-clockwise rotation - immediate response
      if (lKeyDown && !this.lKeyPressed) {
        this.lKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, -1, this.rotationSystem)
        ) {
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          } else {
            this.spinRotatedWhileGrounded = false;
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
        }
      } else if (!lKeyDown && this.lKeyPressed) {
        this.lKeyPressed = false;
      }

      // X key for hard drop - immediate response
      if (xKeyDown && !this.xKeyPressed) {
        this.xKeyPressed = true;
        // Disable hard drop on TGM1 and 20G modes
        if (!this.isLegacySoftDropLockMode() && this.currentPiece) {
          this.recordFinesseInput(); // Count the keypress
          // Calculate hard drop rows before dropping
          const ghost = this.currentPiece.getGhostPosition(this.board);
          this.hardDropRows = ghost.y - this.currentPiece.y;
          this.currentPiece.hardDrop(this.board);
          // In ARS, begin lock delay instead of instant lock
          this.isGrounded = true;
          this.lockDelay = this.deltaTime;
          this.lockDelayBufferedStart = false;
          this.currentPiece.playGroundSound(this);
          this.spinRotatedWhileGrounded = false;
        }
      } else if (!xKeyDown && this.xKeyPressed) {
        this.xKeyPressed = false;
      }

      // Track key states for DAS using custom keys (z for left, c for right)
      if (leftPressed && !bothPressed && !this.leftKeyPressed) {
        this.leftKeyPressed = true;
        this.leftTimer = 0;
        this.leftInRepeat = false;
        // Initial movement
        if (
          !skipDASMovementThisFrame &&
          this.currentPiece &&
          this.currentPiece.move(this.board, -1, 0)
        ) {
          this.incrementFinesseMove();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          this.spinRotatedWhileGrounded = false;
        }
        // Don't set grounded state here - let gravity/soft drop logic handle it
      }
      if (rightPressed && !bothPressed && !this.rightKeyPressed) {
        this.rightKeyPressed = true;
        this.rightTimer = 0;
        this.rightInRepeat = false;
        // Initial movement
        if (
          !skipDASMovementThisFrame &&
          this.currentPiece &&
          this.currentPiece.move(this.board, 1, 0)
        ) {
          this.incrementFinesseMove();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          this.spinRotatedWhileGrounded = false;
        }
        // Don't set grounded state here - let gravity/soft drop logic handle it
      }
    } else {
      // Hold first (if supported and not in ARE)
      if (!this.areActive && this.holdEnabled && this.holdRequest) {
        if (this.performHoldSwap({ bypassCanHold: false, isIHS: false })) {
          this.holdRequest = false;
        }
      }
      // SRS: Process movement before rotation

      // Track key states for DAS using custom keys (z for left, c for right)
      if ((leftDown || zKeyDown) && !this.leftKeyPressed) {
        this.leftKeyPressed = true;
        this.leftTimer = 0;
        this.leftInRepeat = false;
        // Initial movement
        if (
          !skipDASMovementThisFrame &&
          this.currentPiece &&
          this.currentPiece.move(this.board, -1, 0)
        ) {
          this.incrementFinesseMove();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
        }
        // Don't set grounded state here - let gravity/soft drop logic handle it
      }
      if ((rightDown || cKeyDown) && !this.rightKeyPressed) {
        this.rightKeyPressed = true;
        this.rightTimer = 0;
        this.rightInRepeat = false;
        // Initial movement
        if (
          !skipDASMovementThisFrame &&
          this.currentPiece &&
          this.currentPiece.move(this.board, 1, 0)
        ) {
          this.incrementFinesseMove();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
        }
        // Don't set grounded state here - let gravity/soft drop logic handle it
      }

      // Track rotation keys for immediate response
      this.kKeyPressed = this.kKeyPressed || false;
      this.spaceKeyPressed = this.spaceKeyPressed || false;
      this.lKeyPressed = this.lKeyPressed || false;
      this.xKeyPressed = this.xKeyPressed || false;

      // K key for clockwise rotation - immediate response
      if (kKeyDown && !this.kKeyPressed) {
        this.kKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, 1, this.rotationSystem)
        ) {
          this.incrementFinesseRotation();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
          // Don't play ground sound on rotation failure
        }
      } else if (!kKeyDown && this.kKeyPressed) {
        this.kKeyPressed = false;
      }

      // Space key for counter-clockwise rotation - immediate response
      if (spaceKeyDown && !this.spaceKeyPressed) {
        this.spaceKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, -1, this.rotationSystem)
        ) {
          this.incrementFinesseRotation();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
        }
      } else if (!spaceKeyDown && this.spaceKeyPressed) {
        this.spaceKeyPressed = false;
      }

      // L key for counter-clockwise rotation - immediate response
      if (lKeyDown && !this.lKeyPressed) {
        this.lKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, -1, this.rotationSystem)
        ) {
          this.incrementFinesseRotation();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
        }
      } else if (!lKeyDown && this.lKeyPressed) {
        this.lKeyPressed = false;
      }

      // X key for hard drop - immediate response
      if (xKeyDown && !this.xKeyPressed) {
        this.xKeyPressed = true;
        // Disable hard drop on TGM1 and 20G modes
        if (!this.isLegacySoftDropLockMode() && this.currentPiece) {
          this.recordFinesseInput(); // Count the keypress
          // Calculate hard drop rows before dropping
          const ghost = this.currentPiece.getGhostPosition(this.board);
          this.hardDropRows = ghost.y - this.currentPiece.y;
          this.currentPiece.hardDrop(this.board);
          // For ARS, place without instant lock; for others, lock immediately
          if (this.rotationSystem === "ARS") {
            this.isGrounded = true;
            this.lockDelay = this.deltaTime;
            this.lockDelayBufferedStart = false;
            this.currentPiece.playGroundSound(this);
          } else {
            this.lockPiece();
          }
        }
      } else if (!xKeyDown && this.xKeyPressed) {
        this.xKeyPressed = false;
      }
    }

    // Handle DAS for left key (cursors.left or z key)
    if (!skipDASMovementThisFrame && this.leftKeyPressed && leftPressed && !bothPressed) {
      this.leftTimer += this.deltaTime;
      if (!this.leftInRepeat) {
        // Wait for DAS delay
        if (this.leftTimer >= this.dasDelay) {
          this.leftInRepeat = true;
          this.leftTimer -= this.dasDelay;
          if (this.currentPiece) {
            const moved = this.currentPiece.move(this.board, -1, 0);
            if (moved) {
              this.resetLockDelay();
            } else {
              // Piece tried to move left during DAS - no ground sound for movement failures
            }
            // Don't set grounded state here - let gravity/soft drop logic handle it
          }
        }
      } else if (this.leftInRepeat) {
        // Handle ARR (Auto Repeat Rate)
        if (this.arrDelay <= 0) {
          // Instant travel to wall when ARR is 0
          if (this.currentPiece) {
            let movedAny = false;
            let guard = this.board.cols + 2;
            while (guard-- > 0 && this.currentPiece.move(this.board, -1, 0)) {
              movedAny = true;
            }
            if (movedAny) {
              this.resetLockDelay();
            }
          }
          this.leftTimer = 0;
        } else {
          while (this.leftTimer >= this.arrDelay) {
            this.leftTimer -= this.arrDelay;
            if (this.currentPiece) {
              const moved = this.currentPiece.move(this.board, -1, 0);
              if (moved) {
                this.resetLockDelay();
              } else {
                // Piece tried to move left during ARR - no ground sound for movement failures
              }
              // Don't set grounded state here - let gravity/soft drop logic handle it
            }
          }
        }
      }
    }

    // Handle DAS for right key (cursors.right or c key)
    if (!skipDASMovementThisFrame && this.rightKeyPressed && rightPressed && !bothPressed) {
      this.rightTimer += this.deltaTime;
      if (!this.rightInRepeat) {
        // Wait for DAS delay
        if (this.rightTimer >= this.dasDelay) {
          this.rightInRepeat = true;
          this.rightTimer -= this.dasDelay;
          if (this.currentPiece) {
            const moved = this.currentPiece.move(this.board, 1, 0);
            if (moved) {
              this.resetLockDelay();
            } else {
              // Piece tried to move right during DAS - no ground sound for movement failures
            }
            // Don't set grounded state here - let gravity/soft drop logic handle it
          }
        }
      } else {
        // Handle ARR (Auto Repeat Rate)
        if (this.arrDelay <= 0) {
          // Instant travel to wall when ARR is 0
          if (this.currentPiece) {
            let movedAny = false;
            let guard = this.board.cols + 2;
            while (guard-- > 0 && this.currentPiece.move(this.board, 1, 0)) {
              movedAny = true;
            }
            if (movedAny) {
              this.resetLockDelay();
            }
          }
          this.rightTimer = 0;
        } else {
          while (this.rightTimer >= this.arrDelay) {
            this.rightTimer -= this.arrDelay;
            if (this.currentPiece) {
              const moved = this.currentPiece.move(this.board, 1, 0);
              if (moved) {
                this.resetLockDelay();
              } else {
                // Piece tried to move right during ARR - no ground sound for movement failures
              }
              // Don't set grounded state here - let gravity/soft drop logic handle it
            }
          }
        }
      }
    }

    // Key release handling
    if (!leftPressed && this.leftKeyPressed) {
      this.leftKeyPressed = false;
      this.leftTimer = 0;
      this.leftInRepeat = false;
    }
    if (!rightPressed && this.rightKeyPressed) {
      this.rightKeyPressed = false;
      this.rightTimer = 0;
      this.rightInRepeat = false;
    }
    if (!rotate180Down && this.rotate180Pressed) {
      this.rotate180Pressed = false;
    }

    // Update placement hint each frame
    this.updatePlacementHint();

    // Handle ARE input tracking - allow during loading for initial piece handling
    const allowAreInputs = this.shouldAllowAREInputs();
    if (this.areActive || !this.currentPiece) {
      if (allowAreInputs) {
        this.updateBufferedDASInput(leftDown || zKeyDown, rightDown || cKeyDown, this.deltaTime);
        this.areRotationKeys.k = kKeyDown;
        this.areRotationKeys.space = spaceKeyDown;
        this.areRotationKeys.l = lKeyDown;

        // Determine rotation direction based on currently held keys during ARE
        // Priority: K (clockwise) > Space/L (counter-clockwise)
        // Deactivate if keys are released during ARE
        if (kKeyDown) {
          this.areRotationDirection = 1;
          if (!this.irsActivated) {
            this.irsActivated = true;
          }
        } else if (spaceKeyDown || lKeyDown) {
          this.areRotationDirection = -1;
          if (!this.irsActivated) {
            this.irsActivated = true;
          }
        } else {
          this.areRotationDirection = 0;
          if (this.irsActivated) {
            this.irsActivated = false;
          }
        }

        // Hold functionality for ARE - check if hold key is currently held during ARE
        const holdCurrentlyHeld = this.holdEnabled && isDown(this.keys.hold);
        if (holdCurrentlyHeld && !this.areHoldPressed) {
          this.areHoldPressed = true;
        } else if (!holdCurrentlyHeld && this.areHoldPressed) {
          this.areHoldPressed = false;
        }
      } else {
        // ARE inputs disabled when delays are 0
        this.areRotationKeys = { k: false, space: false, l: false };
        this.areRotationDirection = 0;
        this.irsActivated = false;
        this.areHoldPressed = false;
        if (!this.isFirstSpawn) {
          this.areLeftDasCharge = 0;
          this.areRightDasCharge = 0;
        }
      }
    } else {
      // Reset ARE rotation tracking when not in ARE and piece exists
      this.areRotationKeys = { k: false, space: false, l: false };
      this.areRotationDirection = 0;
      this.irsActivated = false;
      this.areHoldPressed = false;
    }

    // Update mino fading system (runs even when game is over)
    if (this.minoFadeActive) {
      this.minoFadeTimer += this.deltaTime;

      const totalRows = this.placedMinoRows.length;
      if (totalRows === 0 || this.minoFadePerRowDuration <= 0) {
        this.minoFadeActive = false;
        this.fadingComplete = true;
        this.minoFadeReversed = false;
        if (this.creditsFinishPending) {
          this.creditsFinishPending = false;
          this.completeCreditsFadeReveal(true);
        } else if (this.creditsRevealFinishPending) {
          this.creditsRevealFinishPending = false;
          this.completeCreditsFadeReveal(false);
        } else if (!this.zenTopoutPendingFinish && !this.zenTopoutFreezeActive && this.gameOverFadeDoneTime === null) {
          this.gameOverFadeDoneTime = this.time.now;
        }
        if (this.creditsPending) {
          this.beginPendingCreditsTransition();
        }
      } else if (this.minoFadeProgress < totalRows) {
        const rowIndex = this.minoFadeProgress;
        const rowToFade = this.placedMinoRows[rowIndex];
        const perRow = this.minoFadePerRowDuration;
        let alpha;
        if (this.minoFadeReversed) {
          alpha = Math.min(1, this.minoFadeTimer / perRow);
        } else {
          alpha = Math.max(0, 1 - this.minoFadeTimer / perRow);
        }
        this.minoRowFadeAlpha[rowToFade] = alpha;

        if (this.minoFadeTimer >= perRow) {
          this.minoFadeTimer = 0;
          this.minoFadeProgress++;
          this.minoRowFadeAlpha[rowToFade] = this.minoFadeReversed ? 1 : 0;
          if (this.minoFadeProgress >= totalRows) {
            this.minoFadeActive = false;
            this.fadingComplete = true;
            this.minoFadeReversed = false;
            if (this.creditsFinishPending) {
              this.creditsFinishPending = false;
              this.completeCreditsFadeReveal(true);
            } else if (this.creditsRevealFinishPending) {
              this.creditsRevealFinishPending = false;
              this.completeCreditsFadeReveal(false);
            } else if (!this.zenTopoutPendingFinish && !this.zenTopoutFreezeActive && this.gameOverFadeDoneTime === null) {
              this.gameOverFadeDoneTime = this.time.now;
            }
            if (this.creditsPending) {
              this.beginPendingCreditsTransition();
            }
          }
        }
      }

      // Restore roll visibility masks once a reversed fade completes.
      if (!this.minoFadeActive && this._fadingRollActiveBeforeTopout !== undefined) {
        this.fadingRollActive = this._fadingRollActiveBeforeTopout;
        this._fadingRollActiveBeforeTopout = undefined;
      }
      if (!this.minoFadeActive && this._invisibleStackActiveBeforeTopout !== undefined) {
        this.invisibleStackActive = this._invisibleStackActiveBeforeTopout;
        this._invisibleStackActiveBeforeTopout = undefined;
      }
    }

    // Fail-safe: if pending credits somehow outlives fade completion, force transition.
    if (this.creditsPending && !this.minoFadeActive && !this.creditsActive && !this.lineClearDelayActive && !this.lineClearPhase) {
      this.beginPendingCreditsTransition();
    }

    // Some modes queue a credits roll from outside the line-clear ARE path (e.g. TGM1 999 starts).
    if (
      this.pendingCreditsStart &&
      !this.creditsActive &&
      !this.lineClearDelayActive &&
      !this.lineClearPhase &&
      !this.areActive &&
      !this.gameOver
    ) {
      const pendingCreditsStart = this.pendingCreditsStart;
      this.pendingCreditsStart = null;
      this.beginModeCreditsRoll(pendingCreditsStart);
    }

    // Update game over timer (runs even when game is over)
    if (this.gameOver) {
      this.gameOverTimer += this.deltaTime;
      if (this.gameOverTimer >= (this.gameOverAutoExitDelay || 10)) {
        // 10 seconds
        this.saveBestScore();
        this.goToMenu();
        return;
      }
    }

    // Torikan fail staged flow for TGM3 Master
    if (this.torikanFailActive) {
      this.torikanFailTimer += this.deltaTime;
      // Show message after 1s
      if (!this.torikanFailMessageShown && this.torikanFailTimer >= 1) {
        this.torikanFailMessageShown = true;
        this.gameOverMessage = "Excellent... but let's go better next time";
      }
      // Trigger GAME OVER after 5s
      if (!this.torikanFailGameOverShown && this.torikanFailTimer >= 5) {
        this.torikanFailGameOverShown = true;
        this.showGameOverScreen();
      }
      // Return to menu after 10s from fail start
      if (this.torikanFailTimer >= 10) {
        this.goToMenu();
        return;
      }
      // Skip further update logic during staged fail
      this.draw();
      return;
    }
    // Suppress GAME OVER during Zen recovery; otherwise show after fade
    const suppressGameOverUI = this.zenTopoutFreezeActive || this.zenTopoutPendingFinish;
    if (suppressGameOverUI) {
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;
    } else if (!this.creditsPending && this.fadingComplete && this.gameOverFadeDoneTime !== null) {
      const elapsedSinceFade = this.time.now - this.gameOverFadeDoneTime;
      if (elapsedSinceFade >= 3000) {
        if (!this.creditsActive || this.rollFailedDuringRoll) {
          this.showGameOverText = true;
          this.metricsPauseActive = false; // resume metrics after topout animation finishes
        }
        if (!this.gameOverSfxPlayed) {
          this.gameOverSfxPlayed = true;
          this.playSfx?.("gameover", 0.8);
        }
      }
    }

    // Determine if metrics should pause (topout animation, pause, zen freeze, credits, etc.)
    const topoutAnimActive =
      this.minoFadeActive ||
      this.zenTopoutFreezeActive ||
      (this.gameOver && !this.fadingComplete);
    if (topoutAnimActive) {
      if (!this.metricsPauseActive) {
        this.metricsPauseActive = true;
        this.metricsPauseStart = Date.now();
      }
    } else if (this.metricsPauseActive) {
      // Exiting metrics pause: shift timers so elapsed excludes the paused duration
      const pausedMs = this.metricsPauseStart ? Date.now() - this.metricsPauseStart : 0;
      const pausedSec = pausedMs / 1000;
      if (pausedMs > 0) {
        if (this.startTime) this.startTime += pausedMs;
        if (this.gameStartTime) this.gameStartTime += pausedMs;
        if (this.sectionStartTime !== null && this.sectionStartTime !== undefined) {
          this.sectionStartTime += pausedSec;
        }
        if (this.lastAttackTime) this.lastAttackTime += pausedSec;
      }
      this.metricsPauseActive = false;
      this.metricsPauseStart = null;
    }
    const metricsPaused =
      this.isPaused ||
      this.level999Reached ||
      this.creditsActive ||
      this.metricsPauseActive ||
      (this.gameOver && !this.showGameOverText);

    // Update time tracking using Date.now() for reliability
    if (!metricsPaused) {
      this.updateTimer();
    }
    if (!metricsPaused) {
      this.tickAttackDecay(this.currentTime || 0);
      this.tickStandardCombo(this.currentTime || 0);
    }
    if (!metricsPaused) {
      this.updateAttackUI();
    }

    // Handle BGM first play vs loop mode
    this.manageBGMLoopMode();

    // Track active time and ARE time for PPS calculations (ignore paused time)
    if (!metricsPaused && !this.gameOver) {
      if (!this.areActive) {
        this.activeTime += this.deltaTime;
      } else {
        this.areTime += this.deltaTime;
      }
    }

    // Sakura-specific input (skip, hold-advance) before pause/game over exit
    if (
      this.gameMode &&
      typeof this.gameMode.handleSakuraInput === "function" &&
      this.selectedMode === "tgm3_sakura"
    ) {
      this.gameMode.handleSakuraInput(
        this,
        { startDown, startJustDown, holdJustDown },
        this.deltaTime,
      );
    }

    // Skip ALL game logic if game over
    if (this.gameOver) {
      // Still update UI for pause screen
      this.draw();
      return;
    }

    if (!this.currentPiece) {
      // Credits can outlive active gameplay, so keep the update loop alive long enough
      // for the staff roll timer/scroll to continue even after the field locks out.
      if (!this.areActive && !this.creditsActive) {
        this.draw();
        return;
      }
    } else if (!this.areActive) {
      // Track key states for DAS using custom keys (z for left, c for right)
      // Allow DAS during loading for initial piece handling
      // Soft drop handling - only when s key is held
      if (softDropHeld) {
        const softDropJustPressed = !this.softDropPressed;
        if (softDropJustPressed) {
          this.softDropPressed = true;
          this.recordFinesseInput(); // Count the keypress, not the repeats
        }
        let movedRows = 0;
        // Non-Standard modes: use time-based 1G speed (60 rows/second)
        // Standard modes: use multiplier-based per-frame movement
        if (!this.usesStandardDropBehavior()) {
          // Time-based 1G soft drop for non-Standard modes
          const softDropRowsPerSecond = 60; // 1G = 60 rows/second
          if (!this.softDropAccum) this.softDropAccum = 0;
          this.softDropAccum += softDropRowsPerSecond * this.deltaTime;
          const rowsToFall = Math.floor(this.softDropAccum);
          if (rowsToFall > 0) {
            for (let i = 0; i < rowsToFall; i++) {
              if (this.currentPiece.move(this.board, 0, 1)) {
                movedRows += 1;
                this.resetLockDelay();
                this.wasGroundedDuringSoftDrop = false;
                this.softDropMovedThisPiece = true;
                this.softDropRows += 1;
              } else {
                break;
              }
            }
            this.softDropAccum -= rowsToFall;
          }
        } else {
          // Standard modes: use multiplier-based movement
          const softDropRowsPerSecond =
            this.softDropMultiplier >= 100
              ? 20 * BASE_FPS
              : Math.max(1, this.softDropMultiplier) * BASE_FPS;
          if (!this.softDropAccum) this.softDropAccum = 0;
          this.softDropAccum += softDropRowsPerSecond * this.deltaTime;
          const maxSteps = Math.floor(this.softDropAccum);
          for (let i = 0; i < maxSteps; i++) {
            if (this.currentPiece.move(this.board, 0, 1)) {
              movedRows += 1;
              this.resetLockDelay();
              this.wasGroundedDuringSoftDrop = false;
              this.softDropMovedThisPiece = true;
              this.softDropRows += 1;
            } else {
              break;
            }
          }
          if (maxSteps > 0) this.softDropAccum = Math.max(0, this.softDropAccum - maxSteps);
        }

        const canMoveFurther = this.board.isValidPosition(
          this.currentPiece,
          this.currentPiece.x,
          this.currentPiece.y + 1,
        );

        if (!canMoveFurther) {
          if (!this.isGrounded) {
            // Lock immediately when soft drop is held and piece touches ground (TGM1 and 20G modes)
            if (this.isLegacySoftDropLockMode()) {
              if (this.softDropMovedThisPiece) {
                if (
                  !this.wasGroundedDuringSoftDrop &&
                  this.currentPiece.isTouchingGround(this.board)
                ) {
                  this.currentPiece.playGroundSound(this);
                }
                this.lockPiece();
                this.wasGroundedDuringSoftDrop = true;
              } else {
                this.isGrounded = true;
              }
            } else {
              // Non-TGM1/20G modes: use original logic based on rotation system
              if (this.rotationSystem === "ARS") {
                if (
                  !this.wasGroundedDuringSoftDrop &&
                  this.currentPiece.isTouchingGround(this.board)
                ) {
                  this.currentPiece.playGroundSound(this);
                }
                this.lockPiece();
                this.wasGroundedDuringSoftDrop = true;
              } else {
                this.isGrounded = true;
                if (
                  !this.wasGroundedDuringSoftDrop &&
                  this.currentPiece.isTouchingGround(this.board)
                ) {
                  this.currentPiece.playGroundSound(this);
                  this.wasGroundedDuringSoftDrop = true;
                }
              }
            }
          } else {
            // Already grounded - lock immediately if soft drop is held in TGM1/20G modes
            if (
              this.isLegacySoftDropLockMode() &&
              (this.softDropMovedThisPiece || softDropJustPressed)
            ) {
              this.lockPiece();
            }
          }
        } else if (movedRows === 0) {
          // No movement, still airborne
          this.wasGroundedDuringSoftDrop = false;
        }
        // If piece was already grounded, don't increment lock delay
      } else {
        // Reset flag when soft drop key is not held
        this.softDropPressed = false;
        this.wasGroundedDuringSoftDrop = false;
        this.softDropAccum = 0; // Reset accumulation for non-Standard modes
      }

      // Single press actions (keep JustDown for these)
      if (justDown(this.cursors.down) && !downDown) {
        this.recordFinesseInput(); // Count the keypress
        if (this.currentPiece.move(this.board, 0, 1)) {
          this.resetLockDelay();
        } else if (!this.isGrounded) {
          if (this.rotationSystem === "ARS") {
            // Single-tap soft drop in ARS: lock on contact
            if (this.currentPiece.isTouchingGround(this.board)) {
              this.currentPiece.playGroundSound(this);
            }
            this.lockPiece();
          } else {
            // Only start lock delay if piece wasn't already grounded
            this.isGrounded = true;
            this.lockDelay += this.deltaTime;
            if (this.lockDelay >= this.lockDelayMax) {
              // 30 frames = 0.5 seconds
              this.lockPiece();
            }
          }
        } else {
          // Piece is already grounded but tried to move down - play ground sound only if touching ground
          if (this.currentPiece.isTouchingGround(this.board)) {
            this.currentPiece.playGroundSound(this);
          }
        }
        // If piece was already grounded, don't increment lock delay
      }
      // Hold functionality for modes that support it
      if (this.holdEnabled && this.holdRequest) {
        if (this.performHoldSwap({ bypassCanHold: false, isIHS: false })) {
          this.holdRequest = false;
        }
      }
    }

    // Gravity (TGM-style curve, time-based to be FPS independent)
    const zenActive =
      typeof this.isZenSandboxActive === "function" ? this.isZenSandboxActive() : false;
    if (!this.areActive) {
      // Only apply gravity when not in ARE
      const skipGravityThisFrame = this.skipGravityThisFrame;
      if (skipGravityThisFrame) {
        this.skipGravityThisFrame = false;
      }
      let zenRowsPerSecond = null;
      // Only apply zen sandbox gravity override if zen mode is actually active
      if (zenActive && this.zenSandboxConfig) {
        const cfg = this.zenSandboxConfig;
        const mode = cfg.gravityMode || "none";
        if (mode === "none") {
          zenRowsPerSecond = 0;
        } else if (mode === "static") {
          const rpf = Number(cfg.gravityRowsPerFrame || 0) || 0;
          zenRowsPerSecond = rpf * 60;
        } else {
          // fallback to helper if available (presets)
          if (typeof this.getZenGravityRowsPerSecond === "function") {
            zenRowsPerSecond = this.getZenGravityRowsPerSecond(this.deltaTime);
          }
        }
      }
      const internalGravity = Math.max(1, this.getTGMGravitySpeed(this.level));
      if (this.currentPiece) {
        if (skipGravityThisFrame) {
          this.gravityAccum = 0;
        } else if (internalGravity >= 5120) {
          this.currentPiece.hardDrop(this.board);
          this.isGrounded = true;
          this.lastGroundedY = this.currentPiece ? this.currentPiece.y : this.lastGroundedY;
          this.gravityAccum = 0;
        } else {
          if (softDropHeld) {
            this.gravityAccum = 0;
          } else {
            if (
              this.isGrounded &&
              this.board.isValidPosition(
                this.currentPiece,
                this.currentPiece.x,
                this.currentPiece.y + 1,
              )
            ) {
              this.isGrounded = false;
              this.lockDelay = 0;
              this.lastGroundedY = null;
            }

            // rowsPerSecond derived from internalGravity (1/256G units) assuming 60 fps baseline
            let rowsPerSecond = (internalGravity / 256) * 60;
            if (typeof zenRowsPerSecond === "number") {
              rowsPerSecond = zenRowsPerSecond;
            }
            this.gravityAccum += rowsPerSecond * this.deltaTime; // deltaTime in seconds

            const rowsToFall = Math.floor(this.gravityAccum);
            if (rowsToFall > 0) {
              let movedRows = 0;
              for (let i = 0; i < rowsToFall; i++) {
                if (this.currentPiece.move(this.board, 0, 1)) {
                  movedRows++;
                  this.isGrounded = false;
                  this.resetLockDelay();
                } else {
                  // Piece can't move down anymore
                  if (!this.isGrounded) {
                    this.isGrounded = true;
                    this.lockDelay = this.deltaTime; // Start counting from current delta time
                    this.currentPiece.playGroundSound(this);
                  }
                  break;
                }
              }
              // retain fractional remainder only if we moved; if blocked, drop any accumulated
              this.gravityAccum = movedRows > 0 ? this.gravityAccum - movedRows : 0;
            }
          }
        }
      }
    }

    // Count lock delay continuously when grounded (increment after initial frame)
    if (this.isGrounded && this.currentPiece && !this.areActive) {
      // If we just spawned onto the stack in 20G, start counting on the first active frame
      if (this.lockDelayBufferedStart) {
        this.lockDelayBufferedStart = false;
        this.lockDelay = this.deltaTime;
      } else {
        // If grounded and lock delay hasn't started, begin it now
        if (this.lockDelay === 0) {
          this.lockDelay = this.deltaTime;
        } else {
          this.lockDelay += this.deltaTime;
        }

        if (this.lockDelay >= this.lockDelayMax) {
          // 30 frames = 0.5 seconds
          this.lockPiece();
        }
      }
    }

    // ARE (Appearance Delay) handling
    if (this.areActive) {
      this.areTimer += this.deltaTime;
      let areTransitions = 0;
      while (this.areActive && areTransitions < 4) {
        const currentDelay = this.areDelay;
        if (currentDelay > 0) {
          if (this.areTimer < currentDelay) break;
          this.areTimer -= currentDelay;
        } else {
          this.areTimer = 0;
        }
        areTransitions += 1;
        if (this.lineClearDelayActive) {
          // Line clear delay completed, perform flash fade-out and enter line ARE
          this.lineClearDelayActive = false;
          this.lineClearPhase = true;
          this.areDelay =
            this.pendingLineAREDelay !== null && this.pendingLineAREDelay !== undefined
              ? this.pendingLineAREDelay
              : 41 / 60;
          this.areTimer = 0;

          // Resolve the actual line clear before the post-999 route decides what to show next.
          this.clearStoredLines();
          if (this.deleteBottomRowRequested && this.board?.deleteBottomRow) {
            this.board.deleteBottomRow();
            this.deleteBottomRowRequested = false;
          }
          this.playSfx("fall", 0.7);
          this.isClearingLines = false;
          this.lineClearDelayDuration = 0;
          this.pendingLineAREDelay = 0;
        } else if (this.lineClearPhase) {
          // Line ARE completed
          this.lineClearPhase = false;
          const pendingStaticEndScreen = this.pendingStaticEndScreen;
          const pendingCreditsStart = this.pendingCreditsStart;

          // Trigger deferred complete sequence if pending (after both line clear delay and line ARE finish)
          if (this.pendingCompleteSequence) {
            this.pendingCompleteSequence = false;
            try {
              this.playSfx("complete", 0.8);
            } catch {}
            // Trigger special stack fade schedule for TGM2/TGM3 Master/TGM3 Easy
            const usesStackFadeToCredits =
              this.selectedMode === "tgm2" ||
              this.selectedMode === "tgm2_master" ||
              this.selectedMode === "tgm3" ||
              this.selectedMode === "tgm3_master" ||
              this.selectedMode === "tgm3_easy";
            if (usesStackFadeToCredits) {
              this.startMinoFading();
            }
            if (pendingCreditsStart) {
              this.pendingCreditsStart = null;
              this.areActive = false;
              this.beginModeCreditsRoll(pendingCreditsStart);
              continue;
            }
            if (pendingStaticEndScreen) {
              this.pendingStaticEndScreen = null;
              this.areActive = false;
              this.showStaticEndScreen(pendingStaticEndScreen.options || {});
              continue;
            }
            // If credits are pending (TGM2/TGM3 Master/TGM3 Easy), don't spawn next piece;
            // the fade completion will trigger credits transition.
            if (this.creditsPending) {
              this.areActive = false;
            } else {
              this.areActive = false;
              this.spawnPiece();
            }
          } else {
            if (pendingCreditsStart) {
              this.pendingCreditsStart = null;
              this.areActive = false;
              this.beginModeCreditsRoll(pendingCreditsStart);
              continue;
            }
            if (pendingStaticEndScreen) {
              this.pendingStaticEndScreen = null;
              this.areActive = false;
              this.showStaticEndScreen(pendingStaticEndScreen.options || {});
              continue;
            }
            this.areActive = false;
            this.spawnPiece();
          }
        } else {
          // Normal ARE completed, spawn next piece
          this.areActive = false;
          this.spawnPiece();
        }
      }
    }

    // Update piece active time for scoring
    if (this.currentPiece && this.pieceSpawnTime > 0) {
      this.pieceActiveTime += 1; // Increment by 1 frame per update call
    }

    // Update grade based on performance (only for modes with grading)
    if (!this.creditsActive) {
      const hasGrading = this.modeUsesGrading();
      if (hasGrading) {
        // Before any piece is placed, pin grade/internalGrade to baseline and skip external getters.
        if (this.totalPiecesPlaced === 0) {
          if (this.initialGradeBaseline) this.grade = this.initialGradeBaseline;
          if (typeof this.initialInternalGradeBaseline === "number") {
            this.internalGrade = this.initialInternalGradeBaseline;
          }
          this.updateGradeUIVisibility();
        } else if (this.gameMode && typeof this.gameMode.getDisplayedGrade === "function") {
          const displayedGrade = this.gameMode.getDisplayedGrade();
          const baselineValue =
            typeof this.initialGradeBaselineValue === "number"
              ? this.initialGradeBaselineValue
              : -Infinity;
          const currentValue = this.getGradeValue(this.grade);
          const displayedValue = this.getGradeValue(displayedGrade);

          // Only accept displayed grade if it is not below the initial baseline
          // and not below the current grade.
          if (
            displayedGrade &&
            displayedValue >= baselineValue &&
            displayedValue >= currentValue
          ) {
            this.grade = displayedGrade;
          } else if (this.grade == null && this.initialGradeBaseline) {
            this.grade = this.initialGradeBaseline;
          }

          if (this.gameMode && typeof this.gameMode.getInternalGrade === "function") {
            const internalGrade = this.gameMode.getInternalGrade();
            if (typeof internalGrade === "number") {
              // Do not overwrite with lower than baseline internal grade
              const baselineInternal =
                typeof this.initialInternalGradeBaseline === "number"
                  ? this.initialInternalGradeBaseline
                  : null;
              if (
                baselineInternal === null ||
                internalGrade >= baselineInternal ||
                this.internalGrade == null
              ) {
                this.internalGrade = internalGrade;
              }
            }
          } else if (this.internalGrade == null && this.initialInternalGradeBaseline !== null) {
            this.internalGrade = this.initialInternalGradeBaseline;
          }
          this.updateGradeUIVisibility();
        } else {
          this.updateGrade();
        }
        this.updateGradeUIVisibility();
      }
    }

    // Calculate piece per second rates (skip during credits)
    if (!metricsPaused && !this.creditsActive) {
      this.updatePPS();
    }

    // Update section message
    if (this.sectionMessage) {
      this.sectionMessageTimer--;
      if (this.sectionMessageTimer <= 0) {
        this.sectionMessage = null;
      }
    }

    // Update game mode (for TGM2 grading system, powerup minos, etc.)
    if (this.gameMode && this.gameMode.update) {
      this.gameMode.update(this, this.deltaTime);
    }

    // Update versus mode (board sync, garbage application, HUD)
    if (this.versusActive) {
      updateVersusMode(this, this.deltaTime);
    }

    // Update credits system
    if (this.creditsActive) {
      this.creditsTimer += this.deltaTime; // Use deltaTime for frame-rate independence

      // End credits after duration
      if (this.creditsTimer >= this.creditsDuration) {
        this.finalizeCreditsRoll();
        if (this.exitingToMenu) {
          return;
        }
      }
    }

    // Draw

  this.draw();
}

  // Safeguard: PPS updater (noop if metrics not in use)
  updatePPS() {
    // If PPS tracking fields exist, keep lightweight calculation; otherwise skip.
    if (typeof this.computePPS === "function") {
      if (this.zenTopoutFreezeActive) return;
      // If no pieces placed yet, clamp to zero and clear graph/history
      if (!this.totalPiecesPlaced) {
        this.conventionalPPS = 0;
        this.rawPPS = 0;
        if (this.ppsText) this.ppsText.setText("0.00");
        if (this.rawPpsText) this.rawPpsText.setText("0.00");
        if (this.ppsGraphGraphics) this.ppsGraphGraphics.clear();
        if (Array.isArray(this.ppsHistory)) this.ppsHistory.length = 0;
        if (Array.isArray(this.ppsLockSampleIndices)) this.ppsLockSampleIndices.length = 0;
        this.lastPpsRecordedPieceCount = 0;
        this.ppsSampleTimer = 0;
        return;
      }

      this.computePPS();

      // Time-based sampling for PPS graph
      const dt = this.deltaTime || 0;
      this.ppsSampleTimer += dt;
      while (this.ppsSampleTimer >= this.ppsSampleInterval) {
        this.ppsSampleTimer -= this.ppsSampleInterval;
        this.ppsHistory.push(this.conventionalPPS);
        if (this.ppsHistory.length > 200) {
          this.ppsHistory.shift();
          if (Array.isArray(this.ppsLockSampleIndices)) {
            this.ppsLockSampleIndices = this.ppsLockSampleIndices
              .map((idx) => idx - 1)
              .filter((idx) => idx >= 0);
          }
        }
      }
    }
  }

  // Compute piece-per-second metrics (conventional includes ARE; raw excludes ARE)
  computePPS() {
    const totalTime = this.activeTime + this.areTime;
    if (totalTime > 0) {
      this.conventionalPPS = this.totalPiecesPlaced / totalTime;
    }
    if (this.activeTime > 0) {
      this.rawPPS = this.totalPiecesPlaced / this.activeTime;
    }
    // Clamp to finite numbers to avoid NaN in UI
    if (!Number.isFinite(this.conventionalPPS)) this.conventionalPPS = 0;
    if (!Number.isFinite(this.rawPPS)) this.rawPPS = 0;
  }

  getShiraseQuotaForLevel(level) {
    if (level < 500 || level >= 1000) return 0;
    if (level < 600) return 20;
    if (level < 700) return 18;
    if (level < 800) return 10;
    if (level < 900) return 9;
    return 8; // 900-999
  }

  raiseShiraseGarbage() {
    if (!this.board || !this.board.grid || !this.board.grid.length) return;
    try {
      console.log("[Shirase] raiseShiraseGarbage", {
        hasPlayGarbage: typeof this.playGarbageSfx === "function",
      });
    } catch {}
    const bottomRowIndex = this.board.rows - 1;
    const bottomRow = this.board.grid[bottomRowIndex] || [];
    const garbageRow = bottomRow.map((cell) => (cell ? 0x444444 : 0));
    // Raise stack: remove top row, push garbage clone at bottom
    this.board.grid.shift();
    this.board.grid.push(garbageRow);
    if (this.board.fadeGrid) {
      this.board.fadeGrid.shift();
      this.board.fadeGrid.push(Array(this.board.cols).fill(0));
    }
    // Garbage SFX – invoke helper if present; otherwise play directly with log
    try {
      if (typeof GameScene !== "undefined" && GameScene.prototype.playGarbageSfx) {
        GameScene.prototype.playGarbageSfx.call(this, 1);
      } else if (this.sound) {
        console.log("[SFX][Shirase] direct play fallback", { hasSound: !!this.sound });
        this.playSfx("garbage");
      }
    } catch (err) {
      console.warn("[Shirase] playGarbageSfx fallback error", err);
    }
  }

  spawnPiece() {
    // Block piece spawning while transition fade is running before credits start.
    if (this.minoFadeActive) {
      return;
    }

    if (this.creditsTopoutLockActive) {
      return;
    }

    if (
      this.creditsActive &&
      this.creditsBGM &&
      !this.creditsBgmStarted &&
      this.bgmEnabled &&
      !this.isPaused
    ) {
      this.creditsBGM.play();
      this.creditsBgmStarted = true;
    }

    const configuredMaxLevel = getStartingLevelCapForMode(this.gameMode);
    if (
      this.isFirstSpawn &&
      !this.creditsPending &&
      !this.creditsActive &&
      !this.level999Reached &&
      configuredMaxLevel > 0 &&
      (this.startingLevel || 0) >= configuredMaxLevel
    ) {
      const sectionLength = this.getSectionLength();
      const oldLevel = Math.max(0, configuredMaxLevel - 1);
      const lastSectionIndex = Math.floor(oldLevel / sectionLength);
      if (
        this.handleReachedMaxLevel({
          type: "start",
          amount: 0,
          oldLevel,
          maxLevel: configuredMaxLevel,
          lastSectionIndex,
          continueSpawnAfterImmediateCredits: true,
        })
      ) {
        return;
      }
    }

    // Mark that gameplay pieces have begun spawning (enables timed cheese/SFX gating)
    if (!this.hasSpawnedPiece) {
      this.hasSpawnedPiece = true;
      this.zenCheeseTimer = 0; // start timing from first spawn
    }
    // Shirase garbage check before spawning next piece (during ARE)
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const isShiraseMode =
      modeId === "tgm3_shirase" || modeId === "shirase" || modeId === "tgm3_shirase_mode";
    if (isShiraseMode && this.level >= 500 && this.level < 1000) {
      const quota = this.getShiraseQuotaForLevel(this.level);
      if (quota > 0 && this.shiraseGarbageCounter >= quota) {
        this.raiseShiraseGarbage();
        this.shiraseGarbageCounter = 0;
      }
    }

    if (this.nextPieces.length < 6) {
      this.generateNextPieces();
    }
    // Reset lock reset tracking for new piece
    this.lockResetCount = 0;
    this.lastGroundedY = null;
    this.softDropMovedThisPiece = false;
    // Reset spin tracking for new piece
    this.spinRotatedWhileGrounded = false;

    // Sanitize next piece entry
    const rawNext = this.nextPieces.shift();
    let pieceType =
      typeof rawNext === "string"
        ? rawNext
        : typeof rawNext?.type === "string"
          ? rawNext.type
          : typeof rawNext?.piece === "string"
            ? rawNext.piece
            : rawNext;
    let pieceTextureKey =
      rawNext && typeof rawNext === "object" && rawNext.textureKey
        ? rawNext.textureKey
        : null;
    const queuedInitialRotation = this.getStoredPieceRotation(rawNext, 0);
    const hasQueuedInitialRotation =
      !!(
        rawNext &&
        typeof rawNext === "object" &&
        (
          Number.isInteger(rawNext.tgm4CycloneRotation) ||
          Number.isInteger(rawNext.rotation)
        )
      );
    if (typeof pieceType !== "string") {
      pieceType = "I";
    }
    pieceType = pieceType.toUpperCase();

    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isTgm3Mode =
      modeIdLower === "tgm3" ||
      modeIdLower === "tgm3_master" ||
      modeIdLower === "tgm3_easy" ||
      modeIdLower === "tgm3_sakura" ||
      modeIdLower === "tgm3_shirase" ||
      modeIdLower === "shirase";

    // For Ti modes, update history on actual spawn so later history checks use real recent pieces.
    if (isTgm3Mode) {
      this.pieceHistory.shift();
      this.pieceHistory.push(pieceType);
      this.validatePieceHistory();
    }

    // Immediately top up queue so previews stay at 6 after consuming one
    if (this.nextPieces.length < 6) {
      this.generateNextPieces();
    }

    // Determine mode and powerup gating (TGM2 Normal only)
    const isTgm2Normal =
      modeIdLower === "tgm2_normal" || modeIdLower === "normal" || modeIdLower === "tgm2normal";
    let powerupType = null;
    if (isTgm2Normal) {
      // Force powerup spawn at/after thresholds if not yet spawned
      if (this.level >= 200 && !this.powerupSpawned.del_even) {
        powerupType = "del_even";
      } else if (this.level >= 100 && !this.powerupSpawned.free_fall) {
        powerupType = "free_fall";
      }
    }

    // Create piece (powerup if allowed)
    if (
      powerupType &&
      typeof PowerupMino !== "undefined" &&
      PowerupMino.createPowerupPiece
    ) {
      this.currentPiece = PowerupMino.createPowerupPiece(
        pieceType,
        powerupType,
        this.rotationSystem,
      );
      // Track for status label
      this.activePowerupType = powerupType;
      // Mark as spawned to guarantee once-per-level
      if (powerupType === "free_fall") this.powerupSpawned.free_fall = true;
      if (powerupType === "del_even") this.powerupSpawned.del_even = true;
    } else {
      this.currentPiece = new Piece(
        pieceType,
        this.rotationSystem,
        queuedInitialRotation,
        pieceTextureKey,
      );
      this.activePowerupType = null;
    }
    if (hasQueuedInitialRotation) {
      this.currentPiece.tgm4CycloneRotation = queuedInitialRotation;
    }

    this.applyModeSpawnStateToCurrentPiece();

    this.positionPieceAtSpawn(this.currentPiece);

    // Shirase garbage counter increment per piece spawn (500-999)
    if (isShiraseMode && this.level >= 500 && this.level < 1000) {
      this.shiraseGarbageCounter += 1;
    }

    if (this.isFirstSpawn && this.gameMode && !this.isEligibleTimingOverride) {
      this.dasDelay =
        this.gameMode.getDAS && typeof this.gameMode.getDAS === "function"
          ? this.gameMode.getDAS()
          : this.dasDelay;
      this.arrDelay =
        this.gameMode.getARR && typeof this.gameMode.getARR === "function"
          ? this.gameMode.getARR()
          : this.arrDelay;
      this.areDelay =
        this.gameMode.getARE && typeof this.gameMode.getARE === "function"
          ? this.gameMode.getARE()
          : this.areDelay;
    }


    // Track if piece will be pre-rotated for spawn validation
    let wasPreRotated = false;

    // IRS sound will be played after IRS is applied

    // Play next mino sound for the piece that will spawn NEXT (not current piece)
    if (this.nextPieces.length > 0) {
      const rawNextSound = this.nextPieces[0];
      let nextSoundType =
        typeof rawNextSound === "string"
          ? rawNextSound
          : typeof rawNextSound?.type === "string"
            ? rawNextSound.type
            : typeof rawNextSound?.piece === "string"
              ? rawNextSound.piece
              : rawNextSound;
      if (typeof nextSoundType !== "string") {
        nextSoundType = "I";
      }
      const nextPieceSoundKey = `sound_${nextSoundType.toLowerCase()}`;
      this.playSfx(nextPieceSoundKey, 0.4);
    }

    if (
      !this.board.isValidPosition(
        this.currentPiece,
        this.currentPiece.x,
        this.currentPiece.y,
      )
    ) {
      // If prerotated piece can't spawn, try shifting up to give player a chance
      if (wasPreRotated) {
        let shifted = false;
        for (let shiftY = -1; shiftY >= -3; shiftY--) {
          if (
            this.board.isValidPosition(
              this.currentPiece,
              this.currentPiece.x,
              this.currentPiece.y + shiftY,
            )
          ) {
            this.currentPiece.y += shiftY;
            shifted = true;
            break;
          }
        }
        if (!shifted) {
          const zenActive = this.isZenSandboxActive();
          if (zenActive) {
            const recoverZenTopout = () => {
              try {
                console.log("[ZenTopout] inline recover (after shift)");
              } catch {}
              // Drive default topout visuals: fade stack and slow BGM, then clear and respawn without GAME OVER text.
              const startTime = this.time?.now || Date.now();
              this.zenTopoutPendingFinish = true;
              this.zenTopoutFreezeActive = true;
              this.zenTopoutCooldown = false;
              this.zenTopoutFreezeStart = startTime;
              this.suppressGameOverOnce = true;
              this.gameOver = false;
              this.showGameOverText = false;
              this.gameOverTextTimer = 0;
              this.gameOverSfxPlayed = true;
              this.gameOverFadeDoneTime = null;
              if (this.gameOverText?.setVisible) this.gameOverText.setVisible(false);
              else if (this.gameOverText?.setAlpha) this.gameOverText.setAlpha(0);
              // Prime mino fade based on current stack
              try {
                this.placedMinos = [];
                this.placedMinoRows = [];
                this.minoRowFadeAlpha = {};
                this.fadingComplete = false;
                for (let r = 0; r < this.board.rows; r++) {
                  for (let c = 0; c < this.board.cols; c++) {
                    const cell = this.board.grid[r][c];
                    if (cell) {
                      this.placedMinos.push({ x: c, y: r, color: cell, faded: false });
                      if (!this.placedMinoRows.includes(r)) this.placedMinoRows.push(r);
                    }
                  }
                }
                this.placedMinoRows.sort((a, b) => b - a);
                const rowCount = this.placedMinoRows.length;
                this.minoFadePerRowDuration = rowCount > 0 ? 2 / rowCount : 2;
                this.minoFadeActive = true;
                this.minoFadeProgress = 0;
                this.minoFadeTimer = 0;
              } catch (err) {
                try {
                  console.error("[ZenTopout] inline fade init error (after shift)", err);
                } catch {}
              }
              // Slow BGM during delay (ramp 1x -> 0.25x over 2s)
              try {
                const originalRate =
                  this.currentBGM && typeof this.currentBGM.rate === "number"
                    ? this.currentBGM.rate
                    : 1;
                this._zenTopoutBgmRate = originalRate;
                if (this.currentBGM) {
                  if (this.tweens?.add) {
                    this.tweens.add({
                      targets: this.currentBGM,
                      rate: 0.25,
                      duration: 2000,
                      ease: "Linear",
                    });
                  } else if (this.currentBGM.setRate) {
                    this.currentBGM.setRate(0.25);
                  } else {
                    this.currentBGM.rate = 0.25;
                  }
                }
              } catch {}
              const restoreBgmRate = () => {
                try {
                  const rate = this._zenTopoutBgmRate || 1;
                  if (this.tweens?.add && this.currentBGM) {
                    this.tweens.add({
                      targets: this.currentBGM,
                      rate,
                      duration: 300,
                      ease: "Linear",
                    });
                  } else if (this.currentBGM?.setRate) {
                    this.currentBGM.setRate(rate);
                  } else if (this.currentBGM) {
                    this.currentBGM.rate = rate;
                  }
                  this._zenTopoutBgmRate = null;
                } catch {}
              };
              const finalizeTopout = () => {
                try {
                  // Clear board like default topout but skip GAME OVER UI
                  if (this.board) {
                    if (typeof this.board.clearAll === "function") {
                      this.board.clearAll();
                    } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
                      for (let r = 0; r < this.board.rows; r++) {
                        this.board.grid[r] = Array(this.board.cols).fill(0);
                        this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
                      }
                    }
                    this.ensureZenCheeseBaseline?.(0);
                  }
                  this.playSfx?.("fall");
                  this.currentPiece = null;
                  this.isGrounded = false;
                  if (this.nextPieces.length < 6) this.generateNextPieces();
                  this.zenTopoutPendingFinish = false;
                  this.zenTopoutFreezeActive = false;
                  this.zenTopoutCooldown = false;
                  this.zenTopoutFreezeStart = 0;
                  restoreBgmRate();
                  if (this.time?.delayedCall) {
                    this.time.delayedCall(0, () => this.spawnPiece());
                  } else if (typeof setTimeout === "function") {
                    setTimeout(() => this.spawnPiece(), 0);
                  } else {
                    this.spawnPiece();
                  }
                } catch (err) {
                  try {
                    console.error("[ZenTopout] inline finalize error (after shift)", err);
                  } catch {}
                  this.zenTopoutPendingFinish = false;
                  this.zenTopoutFreezeActive = false;
                  this.zenTopoutCooldown = false;
                  restoreBgmRate();
                }
              };
              const doClear = () => {
                try {
                  console.log("[ZenTopout] doClear (after shift)");
                } catch {}
                finalizeTopout();
              };
              if (this.time?.delayedCall) {
                this.time.delayedCall(2000, doClear);
              } else if (typeof setTimeout === "function") {
                setTimeout(doClear, 2000);
              } else {
                doClear();
              }
              return;
            };
            try {
              console.log("[ZenTopout] spawn fail after shift", {
                prerotated: wasPreRotated,
                pos: { x: this.currentPiece?.x, y: this.currentPiece?.y },
                zenActive,
                mode: this.gameMode?.getModeId?.() || this.selectedMode,
                hasConfig: !!this.zenSandboxConfig,
                level: this.level,
              });
            } catch {}
            recoverZenTopout();
            return;
          }
          // Still can't spawn after shifting - in Zen, do a silent recover; otherwise game over
          if (this.isZenSandboxActive()) {
            this.zenTopoutPendingFinish = true;
            this.zenTopoutFreezeActive = true;
            this.zenTopoutCooldown = false;
            this.zenTopoutFreezeStart = this.time?.now || Date.now();
            this.gameOver = false;
            this.showGameOverText = false;
            this.gameOverTextTimer = 0;
            this.gameOverSfxPlayed = true;
            this.gameOverFadeDoneTime = null;
            if (typeof this.finishZenTopout === "function") {
              this.finishZenTopout("zen_fallback_after_shift_fail");
            } else {
              // Inline fallback clear/spawn
              if (this.board) {
                if (typeof this.board.clearAll === "function") {
                  this.board.clearAll();
                } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
                  for (let r = 0; r < this.board.rows; r++) {
                    this.board.grid[r] = Array(this.board.cols).fill(0);
                    this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
                  }
                }
                this.ensureZenCheeseBaseline?.(0);
              }
              this.playSfx?.("fall");
              this.currentPiece = null;
              this.isGrounded = false;
              if (this.nextPieces.length < 6) this.generateNextPieces();
              this.spawnPiece();
            }
            return;
          }
          // Non-zen: game over
          if (this.currentBGM) {
            this.currentBGM.stop();
            this.currentBGM = null;
          }
          this.showGameOverScreen();
          return;
        }
      } else {
        const zenActive = this.isZenSandboxActive();
        if (zenActive) {
          try {
            console.log("[ZenTopout] spawn fail no-shift", {
              prerotated: wasPreRotated,
              pos: { x: this.currentPiece?.x, y: this.currentPiece?.y },
              zenActive,
              mode: this.gameMode?.getModeId?.() || this.selectedMode,
              hasConfig: !!this.zenSandboxConfig,
              level: this.level,
            });
          } catch {}
          // Use the Zen-specific showGameOverScreen copy and return
          this.showGameOverScreen();
          return;
        }
        // Game over - piece can't spawn (reached top of visible area)
        // Stop BGM on game over
        if (this.currentBGM) {
          this.currentBGM.stop();
          this.currentBGM = null;
        }

        // Show game over screen
        this.showGameOverScreen();
        return;
      }
    }

    const hasInstantSpawnGravity = this.getTGMGravitySpeed(this.level) >= 5120;
    this.resetLockDelay();
    this.isGrounded = false;
    this.gravityAccum = 0;
    this.skipGravityThisFrame = false;

    // Track piece spawn time for scoring
    this.pieceSpawnTime = this.time.now;
    this.pieceActiveTime = 0;

    // Preserve ARE input states so we can apply IRS/IHS correctly after swapping
    const allowAreInputs = this.shouldAllowAREInputs();
    const allowDasInputs = allowAreInputs || this.isFirstSpawn;
    const rotationDirectionAtSpawn = allowAreInputs ? this.areRotationDirection : 0;
    const rotationKeysAtSpawn = allowAreInputs ? { ...this.areRotationKeys } : {};
    // Check actual key state at spawn time for IHS (must be held down, not just pressed once)
    const holdPressedAtSpawn = allowAreInputs && this.holdEnabled && !!(this.keys.hold && this.keys.hold.isDown);

    // Reset ARE rotation and hold tracking for the next cycle
    this.areRotationDirection = 0;
    this.areHoldPressed = false;

    // Handle ARE hold (Initial Hold System) for modes that support hold
    if (allowAreInputs && this.holdEnabled && holdPressedAtSpawn) {
      this.performHoldSwap({ bypassCanHold: true, isIHS: true });
    }
    // Always clear queued hold requests from ARE so they don't trigger a regular hold after spawn
    if (allowAreInputs) {
      this.holdRequest = false;
    }

    const irsRotationDirection = rotationDirectionAtSpawn;

    // Apply IRS to the spawning piece (which may have been swapped by IHS)
    if (allowAreInputs && irsRotationDirection === 1) {
      this.currentPiece.rotation = 1; // Clockwise 90 degrees
      this.currentPiece.shape = this.currentPiece.getRotatedShape();
      wasPreRotated = true;
    } else if (allowAreInputs && irsRotationDirection === -1) {
      this.currentPiece.rotation = 3; // Counter-clockwise 90 degrees
      this.currentPiece.shape = this.currentPiece.getRotatedShape();
      wasPreRotated = true;
    }

    // Prevent the held rotation key from rotating again on the first active frame after spawn.
    // Otherwise, the piece can rotate twice (IRS + immediate input rotation), which can apply kicks (often +1Y).
    if (allowAreInputs && rotationKeysAtSpawn.k) {
      this.kKeyPressed = true;
    }
    if (allowAreInputs && rotationKeysAtSpawn.space) {
      this.spaceKeyPressed = true;
    }
    if (allowAreInputs && rotationKeysAtSpawn.l) {
      this.lKeyPressed = true;
    }

    // IRS rotates the piece without kicks; ensure the rotated spawn is still valid.
    if (
      wasPreRotated &&
      !this.board.isValidPosition(
        this.currentPiece,
        this.currentPiece.x,
        this.currentPiece.y,
      )
    ) {
      let shifted = false;
      for (let shiftY = -1; shiftY >= -3; shiftY--) {
        if (
          this.board.isValidPosition(
            this.currentPiece,
            this.currentPiece.x,
            this.currentPiece.y + shiftY,
          )
        ) {
          this.currentPiece.y += shiftY;
          shifted = true;
          break;
        }
      }

      if (!shifted) {
        if (this.currentBGM) {
          this.currentBGM.stop();
          this.currentBGM = null;
        }
        this.showGameOverScreen();
        return;
      }
    }

    // Log IRS+IHS combination
    // Play IRS sound if piece was pre-rotated
    if (wasPreRotated) {
      this.playSfx("IRS", 0.5);
    }

    if (hasInstantSpawnGravity) {
      this.currentPiece.hardDrop(this.board);
      this.isGrounded = true;
      this.lastGroundedY = this.currentPiece ? this.currentPiece.y : this.lastGroundedY;
      this.lockDelayBufferedStart = true;
      this.lockDelay = 0;
      this.gravityAccum = 0;
      this.skipGravityThisFrame = true;
    }

    // Reset finesse tracking for the freshly active piece
    this.resetFinessePieceInputs(this.currentPiece);

    this.primeDASForSpawn(allowDasInputs);

    // Update level on piece spawn
    if (this.isFirstSpawn) {
      // Only set level to 0 when starting from level 0
      if (!this.startingLevel || this.startingLevel === 0) {
        this.level = 0;
      }
      this.isFirstSpawn = false;
    } else {
      this.updateLevel("piece");
    }

    this.currentSectionPieceIndex = (this.currentSectionPieceIndex || 0) + 1;
    this.pushBackstepSnapshot("spawn");
    this.markKonohaMinosaDirty();
    const spawnModeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    if (
      typeof spawnModeId === "string" &&
      (spawnModeId.startsWith("tgm4_konoha") || spawnModeId.startsWith("konoha_"))
    ) {
      this.hideBravoBanner();
    }
    if (
      typeof KonohaIllustrationSystem !== "undefined" &&
      typeof KonohaIllustrationSystem.onPieceSpawn === "function"
    ) {
      KonohaIllustrationSystem.onPieceSpawn(this);
    }
  }

  generateNextPieces(minCount = 6) {
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isGuidelineBagMode =
      modeIdLower.includes("ultra") ||
      modeIdLower.includes("sprint") ||
      modeIdLower.includes("marathon");
    const isZenMode = modeIdLower.includes("zen");
    if (isGuidelineBagMode) {
      // Force a fresh standard 7-bag when entering guideline modes to avoid stale/randomized bags
      // from prior Zen sessions or other modes.
      const needsNewBag =
        this.guidelineBagSeed !== modeIdLower ||
        !Array.isArray(this.bagQueue) ||
        this.bagQueue.length < 7 ||
        this.bagDrawCount > 0;
      if (needsNewBag) {
        this.bagQueue = this.createShuffledBag();
        this.bagDrawCount = 0;
        this.bagDebugSeen = new Set();
        this.guidelineBagSeed = modeIdLower;
      }
      // Ignore any Zen sandbox bag/runtime for these modes
      this.zenSandboxConfig = null;
      this.zenSandboxRuntime = { bagQueue: [], bagType: null };
    }
    if (isZenMode) {
      if (!this.zenSandboxConfig) {
        if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.loadConfig) {
          this.zenSandboxConfig = ZenSandboxHelper.loadConfig();
        } else if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.defaults) {
          this.zenSandboxConfig = { ...ZenSandboxHelper.defaults };
        } else {
          this.zenSandboxConfig = { bagType: "7bag" };
        }
      }
      if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.resetRuntime) {
        const needsReset =
          !this.zenSandboxRuntime ||
          this.zenSandboxRuntime.bagType !== this.zenSandboxConfig.bagType ||
          !this.zenSandboxInitDone;
        if (needsReset) {
          ZenSandboxHelper.resetRuntime(this, this.zenSandboxConfig);
          if (Array.isArray(this.nextPieces)) this.nextPieces.length = 0;
          this.zenSandboxInitDone = true;
        }
      }
    }
    // Treat any Zen mode as sandbox for piece generation (config is loaded above)
    const isZenSandbox = isZenMode;
    const prefersTGMRand =
      !isGuidelineBagMode &&
      (modeIdLower.startsWith("tgm") ||
        modeIdLower.includes("shirase") ||
        modeIdLower.includes("death") ||
        modeIdLower.includes("plus") ||
        modeIdLower.includes("tgm4_rounds") ||
        modeIdLower === "master_20g");
    const isShiraseMode =
      modeId === "tgm3_shirase" || modeId === "shirase" || modeId === "tgm3_shirase_mode";
    const monoActive = isShiraseMode && this.level >= 1000;
    const monoTextureKey = this.rotationSystem === "ARS" ? "mono_ars" : "mono";

    const isTgm3Mode =
      modeIdLower === "tgm3" ||
      modeIdLower === "tgm3_master" ||
      modeIdLower === "tgm3_easy" ||
      modeIdLower === "tgm3_sakura" ||
      modeIdLower === "tgm3_shirase" ||
      modeIdLower === "shirase";
    // Default to 7-bag whenever we're not using a custom generator or TGM3 35-bag.
    const use7Bag =
      isGuidelineBagMode ||
      (!(this.gameMode && this.gameMode.generateNextPiece) && !prefersTGMRand && !isTgm3Mode);

    // Helper to normalize piece type strings
    const normalizeType = (p) =>
      typeof p === "string"
        ? p.toUpperCase()
        : typeof p?.type === "string"
          ? p.type.toUpperCase()
          : typeof p?.piece === "string"
            ? p.piece.toUpperCase()
            : null;

    while (this.nextPieces.length < minCount) {
      // Check if current mode supports powerup minos
      let piece;
      if (isZenSandbox) {
        piece = this.getZenSandboxPiece();
      } else if (this.gameMode && this.gameMode.generateNextPiece) {
        piece = this.gameMode.generateNextPiece(this);
      } else if (isTgm3Mode) {
        piece = this.generateTgm3Piece();
      } else if (use7Bag) {
        piece = this.generate7BagPiece();
      } else {
        // Non-7-bag path: use TGM1 history unless explicitly classic or pairs
        const prefersClassic = this.selectedMode === "classic" || this.selectedMode === "classic_mode";
        const prefersPairs = this.selectedMode === "pairs" || this.selectedMode === "pairs_mode";
        if (prefersPairs) {
          piece = this.generatePairsPiece();
        } else if (prefersClassic) {
          piece = this.generateClassicPiece();
        } else {
          piece = this.generateTGM1Piece();
        }
      }

      const entry =
        monoActive && piece && typeof piece === "object" && !piece.textureKey
          ? { ...piece, textureKey: monoTextureKey }
          : monoActive && typeof piece === "string"
            ? { type: piece, textureKey: monoTextureKey }
            : piece;

      const queueIndex = this.nextPieces.length; // 0-based index where this piece will sit

      // Ti-specific: apply history rejection only to the piece immediately after the visible 3-preview window (index 3).
      if (isTgm3Mode) {
        let tgm3Candidate = entry;
        if (queueIndex === 3) {
          let attempts = 0;
          while (
            attempts < 6 &&
            normalizeType(tgm3Candidate) &&
            this.pieceHistory.includes(normalizeType(tgm3Candidate))
          ) {
            tgm3Candidate = this.generateTgm3Piece();
            attempts++;
          }
        }

        // Enforce first-piece S/Z/O restriction for Ti modes, but do not apply full history filter.
        this.nextPieces.push(
          this.applyFirstPieceRestriction(
            tgm3Candidate,
            modeIdLower,
            false, // keep history-only-on-index-3 behavior
          ),
        );
        continue;
      }

      const applyHistory =
        !use7Bag &&
        !isTgm3Mode &&
        !(this.gameMode && this.gameMode.generateNextPiece) &&
        !prefersClassic &&
        !prefersPairs;
      this.nextPieces.push(
        this.applyFirstPieceRestriction(
          entry,
          modeIdLower,
          applyHistory, // enforce history only on TGM1 generator path
        ),
      );
    }
  }

  validatePieceHistory() {
    // Ensure piece history contains exactly 4 pieces and no null/undefined values
    if (!this.pieceHistory || this.pieceHistory.length !== 4) {
      this.pieceHistory = ["Z", "Z", "S", "S"]; // Reset to initial state
    }

    // Filter out any null, undefined, or invalid pieces
    const validPieces = Object.keys(TETROMINOES);
    this.pieceHistory = this.pieceHistory.filter(
      (piece) => piece && validPieces.includes(piece),
    );

    // If history got too small, fill with default pieces
    while (this.pieceHistory.length < 4) {
      this.pieceHistory.push("Z"); // Default fallback
    }

    // Ensure we never have more than 4 pieces
    if (this.pieceHistory.length > 4) {
      this.pieceHistory = this.pieceHistory.slice(-4); // Keep only last 4
    }
  }

  generateClassicPiece() {
    // Classic: random with no immediate repeats
    const pieces = Object.keys(TETROMINOES);
    const last = this.lastClassicPiece || null;
    const pool = pieces.filter((p) => p !== last);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.lastClassicPiece = pick;
    return pick;
  }

  generatePairsPiece() {
    // Pairs: choose two minos at a time and emit A,B,B,A before choosing a new pair
    if (!Array.isArray(this.pairsQueue)) this.pairsQueue = [];
    if (this.pairsQueue.length === 0) {
      const bag = this.createShuffledBag();
      for (let i = 0; i < bag.length; i += 2) {
        const a = bag[i];
        const b = bag[(i + 1) % bag.length];
        this.pairsQueue.push(a, b, b, a);
      }
    }
    return this.pairsQueue.shift();
  }

  generateTGM1Piece() {
    // TGM1 randomizer algorithm:
    // 1. Keep a history of four recent pieces (start with [Z,Z,S,S])
    // 2. Generate a piece, then check if the piece is in the history
    // 3. If it does, generate another piece (retry generating another piece up to 6 times)
    // 4. The first piece can never be S, Z, or O

    const types = Object.keys(TETROMINOES);
    let generatedPiece;
    let attempts = 0;

    // First piece restriction: cannot be S, Z, or O
    if (this.firstPiece) {
      const firstPieceTypes = ["I", "J", "L", "T"]; // Exclude S, Z, O
      generatedPiece =
        firstPieceTypes[Math.floor(Math.random() * firstPieceTypes.length)];
      this.firstPiece = false;
    } else {
      // Generate piece with history checking
      do {
        generatedPiece = types[Math.floor(Math.random() * types.length)];
        attempts++;
      } while (this.pieceHistory.includes(generatedPiece) && attempts < 6);
    }

    // Update history: maintain exactly 4 most recent pieces
    // Remove oldest piece and add new piece
    this.pieceHistory.shift(); // Remove first (oldest) element
    this.pieceHistory.push(generatedPiece); // Add new piece at end

    // Ensure history never exceeds 4 pieces (safety check)
    if (this.pieceHistory.length > 4) {
      this.pieceHistory = this.pieceHistory.slice(-4); // Keep only last 4
    }

    return generatedPiece;
  }

  generateTgm3Piece() {
    const PIECES = ["I", "J", "L", "O", "S", "T", "Z"];

    if (!this.tgm3DroughtCounters) {
      this.tgm3DroughtCounters = {};
      PIECES.forEach((p) => {
        this.tgm3DroughtCounters[p] = 0;
      });
    }
    if (!Array.isArray(this.tgm3BagQueue)) {
      this.tgm3BagQueue = [];
    }

    const pickMaxDroughtPiece = () => {
      let max = -1;
      let chosen = "I";
      PIECES.forEach((p) => {
        const d = this.tgm3DroughtCounters[p] ?? 0;
        if (d > max || (d === max && p < chosen)) {
          max = d;
          chosen = p;
        }
      });
      return chosen;
    };

    const shuffleArray = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const ensureBag = () => {
      if (this.tgm3BagQueue.length === 0) {
        const bag = [];
        for (let i = 0; i < 5; i++) {
          bag.push(...PIECES);
        }
        this.tgm3BagQueue = shuffleArray(bag);
      }
    };

    ensureBag();

    const piece = this.tgm3BagQueue.shift();

    // Update drought counters
    PIECES.forEach((p) => {
      this.tgm3DroughtCounters[p] = (this.tgm3DroughtCounters[p] ?? 0) + 1;
    });
    this.tgm3DroughtCounters[piece] = 0;

    // Append current max-drought piece to keep bag length at 35
    const droughtPiece = pickMaxDroughtPiece();
    this.tgm3BagQueue.push(droughtPiece);

    return piece;
  }

  applyFirstPieceRestriction(rawPiece, modeIdLower = "", enforceHistory = false) {
    if (!this.firstPiece) return rawPiece;

    const exempt =
      modeIdLower === "ultra" ||
      modeIdLower === "marathon" ||
      modeIdLower === "zen" ||
      modeIdLower.startsWith("sprint");

    if (exempt) {
      this.firstPiece = false;
      return rawPiece;
    }

    // For all non-exempt modes, always enforce history safety on the very first piece
    const enforceFirst = true;

    const type =
      typeof rawPiece === "string"
        ? rawPiece.toUpperCase()
        : typeof rawPiece?.type === "string"
          ? rawPiece.type.toUpperCase()
          : typeof rawPiece?.piece === "string"
            ? rawPiece.piece.toUpperCase()
            : null;
    const textureKey = rawPiece && typeof rawPiece === "object" ? rawPiece.textureKey : null;

    // If first piece in non-exempt mode, reject S/Z/O and also avoid any history collision.
    const disallowed = ["S", "Z", "O"];
    if (!type || disallowed.includes(type) || (enforceFirst && this.pieceHistory.includes(type))) {
      // pick from safe set and avoid current history if possible
      const allowed = ["I", "J", "L", "T"].filter(
        (p) => !this.pieceHistory.includes(p),
      );
      const pool = allowed.length > 0 ? allowed : ["I", "J", "L", "T"];
      const replacement = pool[Math.floor(Math.random() * pool.length)];

      this.firstPiece = false;

      if (typeof rawPiece === "string") {
        return { type: replacement, textureKey };
      }
      if (rawPiece && typeof rawPiece === "object") {
        return { ...rawPiece, type: replacement, piece: replacement, textureKey };
      }
      return { type: replacement, textureKey };
    }

    // Allowed piece: keep original
    this.firstPiece = false;
    return rawPiece;
  }

  createShuffledBag() {
    const bag = ["I", "J", "L", "O", "S", "T", "Z"];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
  }

  generate7BagPiece() {
    if (!Array.isArray(this.bagQueue)) {
      this.bagQueue = [];
    }
    // Refill only when a bag is fully consumed to keep bags separate and unique.
    if (this.bagQueue.length === 0) {
      this.bagQueue = this.createShuffledBag();
      this.bagDrawCount = 0;
      this.bagDebugSeen = new Set();
    }
    if (!(this.bagDebugSeen instanceof Set)) this.bagDebugSeen = new Set();

    const piece = this.bagQueue.shift();
    this.bagDrawCount++;
    this.bagDebugSeen.add(piece);

    if (this.bagDrawCount === 7) {
      if (this.bagDebugSeen.size !== 7) {
        console.warn(
          "[7-BAG DEBUG] Incomplete bag detected:",
          Array.from(this.bagDebugSeen),
        );
      }
      this.bagDebugSeen = new Set();
      this.bagDrawCount = 0;
    }
    return piece;
  }

  // Developer harness: logs and returns the first n bags to verify uniqueness.
  debugLogBags(bagCount = 3) {
    const results = [];
    // Preserve live state so gameplay is not affected.
    const originalQueue = Array.isArray(this.bagQueue) ? [...this.bagQueue] : [];
    const originalDrawCount = this.bagDrawCount;
    const originalDebugSeen = this.bagDebugSeen ? new Set(this.bagDebugSeen) : null;
    const originalFirstPiece = this.firstPiece;

    this.bagQueue = [];
    this.bagDrawCount = 0;
    this.bagDebugSeen = new Set();
    this.firstPiece = originalFirstPiece;

    for (let i = 0; i < bagCount; i++) {
      const pieces = [];
      for (let j = 0; j < 7; j++) {
        pieces.push(this.generate7BagPiece());
      }
      const unique = new Set(pieces);
      results.push({
        bag: i + 1,
        pieces: pieces.join(""),
        size: unique.size,
        hasDuplicate: unique.size !== 7,
      });
    }

    console.table(results);

    // Restore live state.
    this.bagQueue = originalQueue;
    this.bagDrawCount = originalDrawCount;
    this.bagDebugSeen = originalDebugSeen;
    this.firstPiece = originalFirstPiece;

    return results;
  }

  lockPiece() {
    // Play lock sound
    this.playSfx("lock", 0.6);

    // Track pieces placed for PPS calculation (freeze piece counter during credits roll).
    if (!this.creditsActive) {
      this.totalPiecesPlaced++;
      if (this.pieceCountText) this.pieceCountText.setText(this.totalPiecesPlaced.toString());
    }
    this.updateFinesseInputUI?.();
    // Track worst choke (longest active time)
    this.worstChoke = Math.max(this.worstChoke, this.pieceActiveTime || 0);

    // Start lock flash effect
    this.startLockFlash();

    const rollClock = this.creditsActive ? this.creditsTimer || 0 : this.currentTime || 0;
    let pieceFadeExpireAt = null;
    if (this.fadingRollActive && !this.invisibleStackActive) {
      const modeIdForFade =
        (this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode) || "";
      const modeKeyForFade = typeof modeIdForFade === "string" ? modeIdForFade.toLowerCase() : "";
      // Ti disappearing roll: blocks disappear 5s after lock.
      const fadeLifetimeSec =
        modeKeyForFade === "tgm3" || modeKeyForFade === "tgm3_master" ? 5 : 4;
      const baseExpire = rollClock + fadeLifetimeSec;
      const minGap = 1 / 60;
      pieceFadeExpireAt = Math.max(baseExpire, (this.rollFadeLastExpireTime || 0) + minGap);
      this.rollFadeLastExpireTime = pieceFadeExpireAt;
    }

    const lockedPiece = this.currentPiece;
    if (!lockedPiece) {
      return;
    }
    const lockedPieceType = lockedPiece.type ?? null;

    // Track placed minos before placing the piece
    this.lastLockedPieceState = this.capturePieceBackstepState(lockedPiece);
    for (let r = 0; r < lockedPiece.shape.length; r++) {
      for (let c = 0; c < lockedPiece.shape[r].length; c++) {
        if (lockedPiece.shape[r][c]) {
          const boardX = lockedPiece.x + c;
          const boardY = lockedPiece.y + r;
          this.trackPlacedMino(boardX, boardY, lockedPiece.color);

          if (
            this.fadingRollActive &&
            !this.invisibleStackActive &&
            boardY >= 0 &&
            boardY < this.board.rows &&
            boardX >= 0 &&
            boardX < this.board.cols
          ) {
            this.board.fadeGrid[boardY][boardX] = pieceFadeExpireAt;
          }
        }
      }
    }

    if (lockedPiece?.tgm4MasterPikii && Number.isFinite(lockedPiece.freezeAfter)) {
      lockedPiece.masterPikiiFreezeAt = (this.currentTime || 0) + lockedPiece.freezeAfter;
    }

    this.board.placePiece(
      lockedPiece,
      lockedPiece.x,
      lockedPiece.y,
    );
    this.markKonohaMinosaDirty();

    // Mode hook: notify piece lock (e.g., Easy combo reset on no clear)
    if (this.gameMode && typeof this.gameMode.onPieceLock === "function") {
      this.gameMode.onPieceLock(lockedPiece, this);
    }

    // Finesse evaluation on lock (SRS sprint/ultra only)
    this.evaluateFinesseOnLock(lockedPiece);
    this.finesseActiveForPiece = false;

    // Check for spin (T: 3-corner, others: immobile)
    const spinInfo = this.detectSpin(lockedPiece, this.board);
    this.lastSpinInfo = spinInfo;

    // Detect cleared lines for animation (don't clear them yet)
    const linesToClear = [];
    const allCompletedLines = [];
    // Check ALL rows in the board (0-21) to find complete lines
    for (let r = 0; r < this.board.rows; r++) {
      if (this.board.grid[r].every((cell) => cell !== 0)) {
        allCompletedLines.push(r);
        if (!this.board.isFrozenLine?.(r)) {
          linesToClear.push(r);
        }
      }
    }
    const effectiveLinesCleared =
      this.gameMode && typeof this.gameMode.getEffectiveLineClearCount === "function"
        ? this.gameMode.getEffectiveLineClearCount(this, linesToClear, allCompletedLines)
        : linesToClear.length;

    // Count cleared garbage rows (grey cheese rows are 0x444444)
    let garbageLinesCleared = 0;
    if (linesToClear.length > 0 && this.board?.grid) {
      garbageLinesCleared = linesToClear.reduce((acc, rowIndex) => {
        const row = this.board.grid[rowIndex] || [];
        const hasGarbageBlock = row.some((cell) => cell === 0x444444);
        return acc + (hasGarbageBlock ? 1 : 0);
      }, 0);
    }
    this.lastClearedHadGarbage = garbageLinesCleared > 0;
    this.garbageLinesClearedLast = garbageLinesCleared;

    // Store cleared lines for animation
    this.clearedLines = linesToClear;
    this.completedLinesThisLock = allCompletedLines;
    this.lastLineClearWasBravo = false;

    // Track pending powerup activation if any part of the powerup piece is cleared
    this.pendingPowerup = null;
    if (
      lockedPiece &&
      lockedPiece.isPowerup &&
      lockedPiece.powerupType &&
      linesToClear.length > 0
    ) {
      const positions =
        typeof lockedPiece.getPowerupCellPositions === "function"
          ? lockedPiece.getPowerupCellPositions()
          : [];
      const clearedSet = new Set(linesToClear);
      const hit = positions.some((p) => clearedSet.has(p.boardY));
      if (hit) {
        this.pendingPowerup = {
          type: lockedPiece.powerupType,
        };
        this.powerupCells.set(this.pendingPowerup.type, positions);
      }
    }

    const hadComboActive = this.comboCount > 0;
    const isTetrisClear = effectiveLinesCleared === 4;

    // SFX flags for Tetris and immediate follow-up clear
    let playApplause = false;
    let playComboChime = false;
    if (linesToClear.length > 0 && this.lastTetrisNoCombo) {
      playComboChime = true;
    }
    if (isTetrisClear && !hadComboActive) {
      playApplause = true;
    }

    if (!this.creditsActive && effectiveLinesCleared === 4) {
      const sectionIndex = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
      if (sectionIndex === this.currentSection) {
        this.currentSectionTetrisCount++;
      }
    }

    // Update score with enhanced system
    const prevBackToBack = this.backToBack;
    const isAllClearFlag =
      linesToClear.length > 0 && this.isAllClearAfterLines && this.isAllClearAfterLines(linesToClear);
    this.updateScore(effectiveLinesCleared, lockedPieceType, spinInfo, {
      isAllClear: isAllClearFlag,
    });
    if (garbageLinesCleared > 0) {
      this.totalGarbageCleared = (this.totalGarbageCleared || 0) + garbageLinesCleared;
    }
    const triggeredBravo = linesToClear.length > 0 && this.isAllClearAfterLines(linesToClear);
    this.lastLineClearWasBravo = triggeredBravo;
    if (triggeredBravo) {
      const modeId =
        (this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode) || "unknown";
      const isKonohaMode =
        typeof modeId === "string" && (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"));
      try {
        `[BRAVO] mode=${modeId} lines=${linesToClear.length} level=${this.level} score=${this.score}`;
      } catch {}
      if (!isKonohaMode) {
        this.showBravoBanner();
      }
    }
    // Zen cheese injection on line clears when configured (only in Zen sandbox modes)
    if (this.isZenSandboxActive && this.isZenSandboxActive()) {
      if (this.zenSandboxConfig && this.zenSandboxConfig.cheeseMode === "fixed_rows") {
        if (garbageLinesCleared > 0) {
          // Call helper (if present) and also force baseline directly for safety
          const rowsTarget = Math.max(1, Math.floor(Number(this.zenSandboxConfig.cheeseRows) || 1));
          const percent = Math.max(0, Math.min(100, Number(this.zenSandboxConfig.cheesePercent) || 0));
          const bottom = this.countBottomCheeseRows?.() || 0;
          const missing = Math.max(0, rowsTarget - bottom);
          const fillAmount = Math.min(missing, garbageLinesCleared);
          if (fillAmount > 0) {
            if (this.board && typeof this.board.addCheeseRows === "function") {
              this.board.addCheeseRows(fillAmount, percent);
            } else if (typeof this.ensureZenCheeseBaseline === "function") {
              // Fallback: baseline may add up to target, but limited by fillAmount through missing clamp
              this.ensureZenCheeseBaseline(linesToClear.length);
            }
          }
        }
      }
    }

    // Attack computation and B2B chain UI
    const attackResult = this.computeAttack(
      effectiveLinesCleared,
      spinInfo,
      triggeredBravo,
      prevBackToBack,
    );
    if (attackResult) {
      this.updateAttackStats(attackResult.attack, this.currentTime || 0);
      this.updateAttackUI();
      const shouldShowB2B =
        this.shouldShowB2BChain() &&
        (attackResult.isDifficult || attackResult.b2bBroken || attackResult.newChain >= 1);
      if (shouldShowB2B && this.b2bChainText) this.b2bChainText.setVisible(true);
      this.showB2BChain(
        attackResult.b2bMaintained,
        attackResult.b2bBroken,
        attackResult.prevChain,
        attackResult.newChain,
      );
      if (!shouldShowB2B && this.b2bChainText) this.b2bChainText.setVisible(false);
    }

    // Standard combo for zen/marathon/sprint/ultra
    if (this.isStandardComboMode()) {
      this.updateStandardCombo(effectiveLinesCleared > 0, this.currentTime || 0);
    }

    // Only adjust level for actual line clears; piece-based increments happen on spawn
    if (effectiveLinesCleared > 0) {
      this.updateLevel("lines", effectiveLinesCleared);
    }
    this.canHold = true;

    // Play Tetris / combo sounds with explicit sequencing
    if (linesToClear.length > 0) {
      try {
        if (playApplause) {
          this.playSfx("applause", 0.8);
        }
        if (playComboChime) {
          this.playSfx("combo", 0.7);
        }
      } catch {}
    }

    // Update Tetris->follow-up clear state
    if (linesToClear.length === 0) {
      this.lastTetrisNoCombo = false;
    } else if (playComboChime) {
      this.lastTetrisNoCombo = false; // consumed the follow-up
    } else if (playApplause) {
      this.lastTetrisNoCombo = true; // arm for next clear
    } else {
      this.lastTetrisNoCombo = false;
    }

    // Handle powerup effects for TGM2 mode
    if (this.gameMode && this.gameMode.handleLineClear) {
      this.gameMode.handleLineClear(
        this,
        effectiveLinesCleared,
        lockedPieceType,
      );
    }

    this.currentPiece = null;
    const hasPhysicalLineClear = linesToClear.length > 0;
    const shouldUseLineClearDelay = hasPhysicalLineClear || effectiveLinesCleared === 4;

    if (shouldUseLineClearDelay) {
      const lineClearDelay =
        this.isEligibleTimingOverride && this.lineClearDelayOverride !== null
          ? this.lineClearDelayOverride
          : this.gameMode && this.gameMode.getLineClearDelay
            ? this.gameMode.getLineClearDelay()
            : 40 / 60;
      const lineAREDelay =
        this.isEligibleTimingOverride && this.lineAreOverride !== null
          ? this.lineAreOverride
          : this.gameMode && this.gameMode.getLineARE
            ? this.gameMode.getLineARE()
            : 41 / 60;
      this.lineClearDelayDuration = lineClearDelay;
      this.pendingLineAREDelay = lineAREDelay;
      this.areDelay = lineClearDelay;
      this.areTimer = 0;
      this.areActive = true;
      this.lineClearDelayActive = true;
      this.lineClearPhase = false;
      this.isClearingLines = true;
      this.resetActiveDASState();
      // Reset ARE input state when ARE starts
      this.areRotationDirection = 0;
      this.areHoldPressed = false;

      // Play clear sound
      this.playSfx("clear", 0.7);
    } else {
      // Start normal ARE (prefer explicit override, else mode timing)
      const normalARE =
        this.isEligibleTimingOverride && this.areOverride !== null
          ? this.areOverride
          : this.gameMode && this.gameMode.getARE
            ? this.gameMode.getARE()
            : 30 / 60;
      this.areDelay = normalARE;
      this.areTimer = 0;
      this.areActive = true;
      this.lineClearPhase = false;
      this.isClearingLines = false;
      this.lineClearDelayActive = false;
      this.lineClearDelayDuration = 0;
      this.pendingLineAREDelay = 0;
      this.resetActiveDASState();
      // Reset ARE input state when ARE starts
      this.areRotationDirection = 0;
      this.areHoldPressed = false;
    }

    // Shirase garbage counter decrement on line clears (500-999)
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const isShiraseMode =
      modeId === "tgm3_shirase" || modeId === "shirase" || modeId === "tgm3_shirase_mode";
    if (isShiraseMode && this.level >= 500 && this.level < 1000) {
      this.shiraseGarbageCounter = Math.max(
        0,
        this.shiraseGarbageCounter - linesToClear.length,
      );
    }

    // If item animation is active (e.g., powerup activation), delay ARE start by 2 seconds
    if (this.gameMode && this.gameMode.itemAnimationActive) {
      this.areTimer = -2; // Delay ARE start by 2 seconds
    }
  }

  // Reset piece to its default orientation (used when moving into hold)
  resetPieceToDefaultRotation(piece) {
    const rotations =
      this.rotationSystem === "ARS"
        ? SEGA_ROTATIONS[piece.type].rotations
        : TETROMINOES[piece.type].rotations;
    piece.rotation = 0;
    piece.shape = rotations[0].map((row) => [...row]);
  }

  getStoredPieceRotation(pieceLike, defaultRotation = 0) {
    if (!pieceLike) return defaultRotation;
    if (Number.isInteger(pieceLike.tgm4CycloneRotation)) {
      return pieceLike.tgm4CycloneRotation;
    }
    return defaultRotation;
  }

  getNextPieceTypeFromQueue() {
    const entry = this.getNextPieceEntryFromQueue();
    return entry.type;
  }

  getNextPieceEntryFromQueue() {
    if (this.nextPieces.length < 1) {
      this.generateNextPieces();
    }
    if (this.nextPieces.length < 1) {
      return { type: "I", textureKey: null };
    }
    const raw = this.nextPieces.shift();
    let t =
      typeof raw === "string"
        ? raw
        : typeof raw?.type === "string"
          ? raw.type
          : typeof raw?.piece === "string"
            ? raw.piece
            : raw;
    if (typeof t !== "string") t = "I";
    const textureKey =
      raw && typeof raw === "object" && raw.textureKey
        ? raw.textureKey
        : null;
    const tgm4CycloneRotation =
      raw && typeof raw === "object" && Number.isInteger(raw.tgm4CycloneRotation)
        ? raw.tgm4CycloneRotation
        : null;
    return { type: t.toUpperCase(), textureKey, tgm4CycloneRotation };
  }

  applyModeSpawnStateToCurrentPiece() {
    if (!this.currentPiece || !this.gameMode || typeof this.gameMode.onPieceSpawn !== "function") {
      return;
    }
    const modePiece =
      this.gameMode.onPieceSpawn.length >= 2
        ? this.gameMode.onPieceSpawn(this.currentPiece, this)
        : this.gameMode.onPieceSpawn(this);
    if (modePiece) {
      this.currentPiece = modePiece;
    }
  }

  performHoldSwap({ bypassCanHold = false, isIHS = false } = {}) {
    if (!this.holdEnabled) return false;
    if (!bypassCanHold && !this.canHold) return false;
    if (!this.currentPiece) return false;

    const currentType = this.currentPiece.type;
    const currentTextureKey = this.currentPiece.textureKey || null;
    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    const preserveCycloneHoldRotation =
      modeId === "tgm4_rounds" && !!this.gameMode?.cycloneActive;
    const assignCycloneRotation = (piece, rotation) => {
      if (preserveCycloneHoldRotation && Number.isInteger(rotation)) {
        piece.tgm4CycloneRotation = rotation;
      }
    };

    // Normalize existing hold piece if stored as string
    if (this.holdPiece && typeof this.holdPiece === "string") {
      this.holdPiece = new Piece(this.holdPiece, this.rotationSystem, 0);
    }

    if (this.holdPiece) {
      // Swap current with held
      const holdType = this.holdPiece.type;
      const holdTextureKey = this.holdPiece.textureKey || null;
      const holdRotation = this.getStoredPieceRotation(this.holdPiece, 0);
      const currentRotation = this.getStoredPieceRotation(this.currentPiece, 0);
      this.holdPiece = new Piece(currentType, this.rotationSystem, currentRotation, currentTextureKey);
      assignCycloneRotation(this.holdPiece, currentRotation);
      this.currentPiece = new Piece(holdType, this.rotationSystem, holdRotation, holdTextureKey);
      assignCycloneRotation(this.currentPiece, holdRotation);
    } else {
      // Move current to hold, pull next from queue
      const currentRotation = this.getStoredPieceRotation(this.currentPiece, 0);
      this.holdPiece = new Piece(currentType, this.rotationSystem, currentRotation, currentTextureKey);
      assignCycloneRotation(this.holdPiece, currentRotation);
      const nextEntry = this.getNextPieceEntryFromQueue();
      const nextRotation = this.getStoredPieceRotation(nextEntry, 0);
      this.currentPiece = new Piece(nextEntry.type, this.rotationSystem, nextRotation, nextEntry.textureKey);
      assignCycloneRotation(this.currentPiece, nextRotation);
    }

    // Cyclone hold should respawn exactly as previewed; other modes reset to default.
    if (!preserveCycloneHoldRotation || !Number.isInteger(this.currentPiece.tgm4CycloneRotation)) {
      this.resetPieceToDefaultRotation(this.currentPiece);
    }
    this.applyModeSpawnStateToCurrentPiece();
    this.positionPieceAtSpawn(this.currentPiece);

    this.canHold = false;
    this.resetLockDelay();
    this.isGrounded = false;

    // Play hold/IHS sound if available
    try {
      const soundKey = isIHS ? "IHS" : "lock";
      this.playSfx(soundKey, isIHS ? 0.6 : 0.4);
    } catch {}

    if (!isIHS) {
      this.pushBackstepSnapshot("hold");
    }

    this.markKonohaMinosaDirty();

    return true;
  }

  // Hold functionality for modes that support it
  hold() {
    this.performHoldSwap({ bypassCanHold: false, isIHS: false });
  }

  clearStoredLines() {
    // ROBUST FIX: Clear lines without index shifting issues
    // Instead of splice/unshift, build a new grid without the cleared lines
    const clearedCount = this.clearedLines.length;

    // Safety: if a powerup row is being cleared but pendingPowerup isn't set (e.g., grid-stored powerup cells), detect it here.
    if (!this.pendingPowerup && this.clearedLines.length > 0) {
      for (const rowIdx of this.clearedLines) {
        const row = this.board.grid[rowIdx] || [];
        const cellWithPower = row.find(
          (cell) => cell && typeof cell === "object" && cell.powerupType,
        );
        if (cellWithPower) {
          this.pendingPowerup = { type: cellWithPower.powerupType };
          // cache positions for restoration (best-effort)
          const positions = [];
          for (let c = 0; c < row.length; c++) {
            const cell = row[c];
            if (cell && typeof cell === "object" && cell.powerupType === cellWithPower.powerupType) {
              positions.push({
                boardX: c,
                boardY: rowIdx,
                powerupType: cell.powerupType,
                originalColor: cell.originalColor,
                color: cell.color,
              });
            }
          }
          this.powerupCells.set(cellWithPower.powerupType, positions);
          break;
        }
      }
    }

    // Phase 1: Clear originally detected lines
    if (this.clearedLines.length > 0) {
      const nextBoard = this.buildBoardAfterLineClear(this.clearedLines);
      if (nextBoard) {
        this.board.grid = nextBoard.grid;
        this.board.fadeGrid = nextBoard.fadeGrid;
        this.board.frozenGrid = nextBoard.frozenGrid;
      }
    }

    // Powerup effects (run after normal clears, before extra-line pass)
    if (this.pendingPowerup && this.powerupEffectHandler) {
      this.powerupEffectHandler.executePowerupByType(this.pendingPowerup.type);
      // Restore remaining cells of the powerup piece to original mino color/texture
      const cells = this.powerupCells.get(this.pendingPowerup.type) || [];
      for (const cell of cells) {
        const { boardX, boardY, originalColor } = cell;
        if (
          boardY >= 0 &&
          boardY < this.board.rows &&
          boardX >= 0 &&
          boardX < this.board.cols &&
          this.board.grid[boardY][boardX] !== 0
        ) {
          const restoreColor =
            typeof originalColor === "number"
              ? originalColor
              : this.board.grid[boardY][boardX].color || this.board.grid[boardY][boardX];
          this.board.grid[boardY][boardX] = restoreColor;
        }
      }
      // Normalize any remaining powerup objects on the board to plain colors
      for (let r = 0; r < this.board.rows; r++) {
        for (let c = 0; c < this.board.cols; c++) {
          const cell = this.board.grid[r][c];
          if (cell && typeof cell === "object" && cell.powerupType) {
            const fallbackColor =
              typeof cell.originalColor === "number"
                ? cell.originalColor
                : typeof cell.color === "number"
                  ? cell.color
                  : 0;
            this.board.grid[r][c] = fallbackColor;
          }
        }
      }
      this.powerupCells.delete(this.pendingPowerup.type);
      if (this.powerupStatusText) this.powerupStatusText.setText("");
      this.pendingPowerup = null;
    }

    // Extra-line pass for certain modes (e.g., 2P garbage handling) - kept for compatibility
    if (typeof this.performExtraLinePass === "function") {
      this.performExtraLinePass();
    }

    // After grid mutations, re-apply fixed_rows baseline if configured AND garbage was cleared
    if (
      this.zenSandboxConfig &&
      this.zenSandboxConfig.cheeseMode === "fixed_rows" &&
      this.lastClearedHadGarbage
    ) {
      const rowsTarget = Math.max(1, Math.floor(Number(this.zenSandboxConfig.cheeseRows) || 1));
      const percent = Math.max(0, Math.min(100, Number(this.zenSandboxConfig.cheesePercent) || 0));
      const bottom = this.countBottomCheeseRows?.() || 0;
      const missing = Math.max(0, rowsTarget - bottom);
      const refill = Math.min(missing, this.garbageLinesClearedLast || 0);
      if (refill > 0) {
        // Add only the amount of garbage actually cleared (capped by missing)
        if (typeof this.ensureZenCheeseBaseline === "function") {
          this.ensureZenCheeseBaseline(clearedCount);
        } else if (this.board && typeof this.board.addCheeseRows === "function") {
          this.board.addCheeseRows(refill, percent);
        }
      }
    }

    this.markKonohaMinosaDirty();
    if (
      this.lastLineClearWasBravo &&
      this.gameMode &&
      typeof this.gameMode.updateMinosaStatus === "function"
    ) {
      this.gameMode.updateMinosaStatus(this);
    }
    this.lastLineClearWasBravo = false;

    // Reset cleared lines after processing
    this.clearedLines = [];

    // Phase 2: CRITICAL FIX - Re-check for any newly completed lines
    const additionalLines = [];
    for (let r = 0; r < this.board.rows; r++) {
      if (
        this.board.grid[r].every((cell) => cell !== 0) &&
        !(this.board.isFrozenLine && this.board.isFrozenLine(r))
      ) {
        additionalLines.push(r);
      }
    }

    // Clear any additional lines that became complete
    if (additionalLines.length > 0) {
      const nextBoard = this.buildBoardAfterLineClear(additionalLines);
      if (nextBoard) {
        this.board.grid = nextBoard.grid;
        this.board.fadeGrid = nextBoard.fadeGrid;
        this.board.frozenGrid = nextBoard.frozenGrid;
      }
    }

    // Final hard inject after all cleanup to ensure target garbage rows exist
    if (
      this.zenSandboxConfig &&
      this.zenSandboxConfig.cheeseMode === "fixed_rows" &&
      this.lastClearedHadGarbage
    ) {
      const rowsTarget = Math.max(1, Math.floor(Number(this.zenSandboxConfig.cheeseRows) || 1));
      const percent = Math.max(0, Math.min(100, Number(this.zenSandboxConfig.cheesePercent) || 0));
      const bottom = this.countBottomCheeseRows?.() || 0;
      const missing = Math.max(0, rowsTarget - bottom);
      if (missing > 0) {
        if (this.board && typeof this.board.addCheeseRows === "function") {
          this.board.addCheeseRows(missing, percent);
        } else if (typeof this.ensureZenCheeseBaseline === "function") {
          this.ensureZenCheeseBaseline(0);
        }
      }
    }
  }

  resetLockDelay() {
    const isActuallyGrounded =
      this.currentPiece && this.board
        ? !this.currentPiece.canMoveDown(this.board)
        : this.isGrounded;

    if (this.isGrounded && !isActuallyGrounded) {
      this.isGrounded = false;
      this.lockDelay = 0;
      this.lastGroundedY = null;
      this.wasGroundedDuringSoftDrop = false;
      return;
    }

    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    const useRoundsStepReset =
      modeId === "tgm4_rounds" &&
      ((this.gameMode && typeof this.gameMode.maxLevelReached === "number"
        ? this.gameMode.maxLevelReached
        : this.level) >= 1200);
    if (useRoundsStepReset && isActuallyGrounded) {
      const currentY = this.currentPiece ? this.currentPiece.y : null;
      if (currentY === null) return;
      if (this.lastGroundedY === null) {
        this.lastGroundedY = currentY;
        this.lockDelay = 0;
        this.isGrounded = true;
        this.wasGroundedDuringSoftDrop = false;
        return;
      }
      if (currentY <= this.lastGroundedY) {
        return;
      }
      this.lastGroundedY = currentY;
      this.lockDelay = 0;
      this.isGrounded = true;
      this.wasGroundedDuringSoftDrop = false;
      return;
    }

    // SRS: limit lock delay resets to prevent infinite stalling (unless Zen infinite resets)
    if (this.rotationSystem === "SRS" && isActuallyGrounded && !this.isZenInfiniteResets()) {
      if (this.lockResetCount >= 15) {
        return;
      }
      this.lockResetCount++;
    }

    // ARS: lock reset rules
    if (this.rotationSystem === "ARS" && isActuallyGrounded) {
      // If move-reset is enabled, behave like SRS (limited by 15 total resets unless Zen infinite)
      if (this.arsMoveResetEnabled) {
        if (!this.isZenInfiniteResets() && this.lockResetCount >= 15) {
          return;
        }
        this.lockResetCount++;
        this.lockDelay = 0;
        this.isGrounded = true; // stay grounded
        this.wasGroundedDuringSoftDrop = false;
        return;
      }

      // Default ARS step-reset: only allow reset after dropping at least one row while grounded
      const currentY = this.currentPiece ? this.currentPiece.y : null;
      if (currentY === null) return;
      if (this.lastGroundedY === null) {
        this.lastGroundedY = currentY;
        // First grounded frame after touch: start counting lock delay
        this.lockDelay = 0;
        this.wasGroundedDuringSoftDrop = false;
        return;
      }
      // Require downward progress of at least one row while staying grounded
      if (!this.isZenInfiniteResets() && currentY <= this.lastGroundedY) {
        // No progress: do not reset timer (unless infinite resets enabled)
        return;
      }
      this.lastGroundedY = currentY;
      // Keep grounded state but reset the timer
      this.lockDelay = 0;
      this.wasGroundedDuringSoftDrop = false;
      return;
    }

    // Default reset behavior
    this.lockDelay = 0;
    this.maxPpsRecorded = Math.max(this.maxPpsRecorded, this.conventionalPPS);

    // Track PPS history per placed piece for sprint graph
    if (this.totalPiecesPlaced > this.lastPpsRecordedPieceCount) {
      this.ppsHistory.push(this.conventionalPPS);
      this.lastPpsRecordedPieceCount = this.totalPiecesPlaced;
      if (Array.isArray(this.ppsLockSampleIndices)) {
        this.ppsLockSampleIndices.push(this.ppsHistory.length - 1);
      }
      // Keep history reasonable
      if (this.ppsHistory.length > 200) {
        this.ppsHistory.shift();
        if (Array.isArray(this.ppsLockSampleIndices)) {
          this.ppsLockSampleIndices = this.ppsLockSampleIndices
            .map((idx) => idx - 1)
            .filter((idx) => idx >= 0);
        }
      }
    }
  }

  drawSprintPpsGraph() {
    if (!this.ppsGraphGraphics || !this.ppsGraphArea) {
      return;
    }
    const history = this.ppsHistory || [];
    const { x, y, width, height } = this.ppsGraphArea;
    const g = this.ppsGraphGraphics;

    g.clear();
    g.fillStyle(0x0a0a0a, 0.6);
    g.fillRect(x, y, width, height);
    g.lineStyle(1, 0xffffff, 0.5);
    g.strokeRect(x - 1, y - 1, width + 2, height + 2);

    if (!history.length) {
      if (this.ppsSummaryText) {
        const chokeSec = (this.worstChoke || 0) / 60;
        this.ppsSummaryText.setText(
          `Max PPS: ${this.maxPpsRecorded.toFixed(2)} | Worst choke: ${chokeSec.toFixed(2)}s`,
        );
      }
      return;
    }

    const maxPoints = Math.max(2, Math.min(history.length, 120));
    const visibleHistory = history.slice(-maxPoints);
    const maxPps = Math.max(1.5, ...visibleHistory);

    // Draw line graph: newest at top (vertical axis is reversed)
    const stepY = height / (visibleHistory.length - 1 || 1);
    const pts = visibleHistory.map((pps, idx) => {
      const px = x + Math.min(width, Math.max(1, (pps / maxPps) * width));
      const py = y + height - idx * stepY;
      return { px, py };
    });

    g.lineStyle(2, 0x00ffd0, 1);
    g.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) g.moveTo(p.px, p.py);
      else g.lineTo(p.px, p.py);
    });
    g.strokePath();

    // Draw dots at piece lock samples
    if (Array.isArray(this.ppsLockSampleIndices) && this.ppsLockSampleIndices.length) {
      const startIndex = history.length - visibleHistory.length;
      g.fillStyle(0xffffff, 1);
      this.ppsLockSampleIndices.forEach((lockIdx) => {
        if (lockIdx < startIndex || lockIdx >= history.length) return;
        const pt = pts[lockIdx - startIndex];
        if (pt) g.fillCircle(pt.px, pt.py, 3);
      });
    }

    if (this.ppsSummaryText) {
      const chokeSec = (this.worstChoke || 0) / 60;
      this.ppsSummaryText.setText(
        `Max PPS: ${this.maxPpsRecorded.toFixed(2)} | Worst choke: ${chokeSec.toFixed(2)}s`,
      );
    }
  }

  updateScore(
    lines,
    pieceType = null,
    spinInfo = { isSpin: false, isTSpin: false },
    options = {},
  ) {
    // Don't update score during credits roll
    if (this.creditsActive) {
      if (this.rollType) {
        this.rollLinesCleared += lines;
        if (lines > 0) {
          this.lastClearDuringRoll = { lines, time: this.currentTime };

          // For TGM3 modes: incrementally add staff roll bonus per clear
          const modeId =
            this.gameMode && typeof this.gameMode.getModeId === "function"
              ? this.gameMode.getModeId()
              : this.selectedMode;
          if (
            (modeId === "tgm3_master" || modeId === "tgm3") &&
            this.gameMode &&
            typeof this.gameMode.addStaffRollLines === "function"
          ) {
            this.gameMode.addStaffRollLines(lines, this.rollType === "mroll" ? "mroll" : "fading");
          }

          // Update roll bonus display
          if (this.staffRollBonusText) {
            let bonusText = String(this.rollLinesCleared);
            if (
              (modeId === "tgm3_master" || modeId === "tgm3") &&
              this.gameMode &&
              typeof this.gameMode.getStaffRollBonus === "function"
            ) {
              bonusText = this.gameMode.getStaffRollBonus().toFixed(2);
            }
            this.staffRollBonusText.setText(`ROLL BONUS: ${bonusText}`);
          }
        }
      }
      return;
    }

    // Skip default scoring for modes with custom scoring (e.g., TGM2 Normal x6 multiplier)
    const modeConfig = this.gameMode && typeof this.gameMode.getConfig === "function"
      ? this.gameMode.getConfig()
      : {};
    if (modeConfig.customScoring) {
      this.totalLines += lines;
      this.softDropRows = 0;
      this.hardDropRows = 0;
      this.lastPieceType = pieceType;
      return;
    }

    // Determine scoring system based on mode
    const guidelineModes = new Set([
      "marathon",
      "sprint_40",
      "sprint_100",
      "ultra",
      "zen",
    ]);

    const selectedModeKey =
      typeof this.selectedMode === "string"
        ? this.selectedMode
        : this.selectedModeId || "";

    const isTwentyGMode =
      (this.gameMode && typeof this.gameMode.isTwentyGMode === "function"
        ? this.gameMode.isTwentyGMode()
        : false) || selectedModeKey === "master_20g";

    const isStandardMode = !isTwentyGMode && guidelineModes.has(selectedModeKey);

    if (isStandardMode) {
      this.updateGuidelineScore(lines, pieceType, spinInfo, options);
    } else {
      this.updateTGM1Score(lines, pieceType, spinInfo);
    }
  }

  updateGuidelineScore(
    lines,
    pieceType = null,
    spinInfo = { isSpin: false, isTSpin: false },
    options = {},
  ) {
    let points = 0;
    let clearType = null;
    const { isSpin, isTSpin } = spinInfo || {};

    // Base scoring per standardscoring.md (no level multiplier)
    const lineBase = [0, 100, 300, 500, 800];
    const spinBase = [400, 800, 1200, 1600, 2600]; // any spin with lines (T or otherwise)

    const isAllClear = !!options.isAllClear;

    // Compute base points for the clear
    if (lines > 0 || isSpin) {
      const idx = Math.min(lines, 4);
      if (isSpin) {
        points += spinBase[idx] || 0;
        if (lines === 0) clearType = "spin zero";
        else clearType = `spin ${["zero", "single", "double", "triple", "quad"][idx]}`;
      } else {
        points += lineBase[lines] || 0;
        clearType = ["", "single", "double", "triple", "quad"][lines] || null;
      }

      // Back-to-back 1.5x for difficult clears (quad or any spin with lines)
      const isDifficult = lines >= 4 || (isSpin && lines > 0);
      if (this.backToBack && isDifficult) {
        points = Math.floor(points * 1.5);
        clearType = clearType ? `${clearType} b2b` : "b2b";
      }
      this.backToBack = isDifficult;

      // All clear bonus
      if (isAllClear) {
        points += 3500;
        clearType = clearType ? `${clearType} all clear` : "all clear";
      }
    } else {
      this.comboCount = -1;
    }

    // Combos: start at -1; first clear sets to 0, second consecutive clear reaches 1
    if (lines > 0) {
      if (this.comboCount < 0) {
        this.comboCount = 0;
      } else {
        this.comboCount += 1;
      }
      points += this.comboCount * 50;
    } else {
      this.comboCount = -1;
    }

    // Drop bonuses (flat, not level-scaled)
    points += this.softDropRows; // 1 per soft drop cell
    points += this.hardDropRows * 2; // 2 per hard drop cell

    // Reset drop counters for next piece
    this.softDropRows = 0;
    this.hardDropRows = 0;

    this.score += points;
    this.totalLines += lines;
    const isSprintMode =
      this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100";
    if (isSprintMode) {
      const sprintTarget = this.selectedMode === "sprint_100" ? 100 : 40;
      this.totalLines = Math.min(this.totalLines, sprintTarget);
    }
    this.lastClearType = clearType;
    this.showClearBanner(clearType, spinInfo, lines, pieceType);

    // Track piece for potential T-spin detection next time
    this.lastPieceType = pieceType;
  }

  updateTGM1Score(lines, pieceType = null, spinInfo = { isSpin: false, isTSpin: false }) {
    // Official TGM1 scoring formula:
    // Score = ceil([level + cleared lines]/4 + soft dropped rows + (2 * hard dropped rows))
    //        * cleared lines * combo * bravo

    let points = 0;
    let clearType = null;

    // Calculate combo value
    // Combo = Previous combo value + (2 * Cleared lines) - 2, or 1 if no lines cleared
    let combo = 1; // Default for no lines cleared
    if (lines > 0) {
      this.comboCount = this.comboCount === -1 ? 0 : this.comboCount;
      this.comboCount += 2 * lines - 2;
      combo = Math.max(1, this.comboCount + 1); // +1 because combo starts at 1
    } else {
      this.comboCount = -1;
    }

    // Calculate bravo bonus (perfect clear)
    let bravo = 1;
    if (lines > 0) {
      if (this.isBoardCompletelyEmpty()) {
        bravo = 4;
        clearType = "bravo";
      }
    }

    // Main scoring formula
    if (lines > 0) {
      const baseScore = Math.ceil(
        (this.level + lines) / 4 + this.softDropRows + 2 * this.hardDropRows,
      );
      points = baseScore * lines * combo * bravo;
    }

    // Reset drop counters for next piece
    this.softDropRows = 0;
    this.hardDropRows = 0;

    this.score += points;
    this.totalLines += lines;
    if (this.selectedMode === "sprint_40") {
      this.totalLines = Math.min(this.totalLines, 40);
    }
    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    const isRoundsMode = modeId === "tgm4_rounds";
    const isTSpinClear = !!spinInfo?.isTSpin && lines > 0;
    if (isRoundsMode && isTSpinClear) {
      const tSpinLineName = ["zero", "single", "double", "triple", "quad"][Math.min(lines, 4)] || "single";
      const tSpinClearType = `t-spin ${tSpinLineName}`;
      clearType = clearType ? `${tSpinClearType} ${clearType}` : tSpinClearType;
      this.showClearBanner(clearType, { ...spinInfo, isSpin: true, isTSpin: true }, lines, pieceType);
    }
    this.lastClearType = clearType;

    this.updateGrade();

    // Track piece for potential T-spin detection next time
    this.lastPieceType = pieceType;
  }

  updateLevel(type, amount = 1) {
    if (this.creditsActive) {
      return;
    }
    const oldLevel = this.level;

    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isExemptStopMode =
      modeIdLower === "zen" ||
      modeIdLower === "marathon" ||
      modeIdLower.startsWith("sprint") ||
      modeIdLower === "ultra" ||
      modeIdLower === "tgm2_normal";
    const bypassLevelStop =
      this.gameMode && typeof this.gameMode.shouldBypassLevelStop === "function"
        ? !!this.gameMode.shouldBypassLevelStop(this)
        : false;

    if (type === "piece") {
      this.piecesPlaced++;
    }

    // Use mode-specific level update logic
    let newLevel = this.level;
    if (this.gameMode && this.gameMode.onLevelUpdate) {
      this.gameMode.currentGameTime = this.currentTime || 0;
      newLevel = this.gameMode.onLevelUpdate(
        this.level,
        oldLevel,
        type,
        amount,
      );
    } else {
      // Default logic with TGM3 line bonuses (triple +1, tetris +2)
      if (type === "piece") {
        newLevel += 1;
      } else if (type === "lines") {
        const bonus = amount === 3 ? 1 : amount === 4 ? 2 : 0;
        newLevel += amount + bonus;
      }
    }

    // Apply level stop: at x99 only line clears may advance (non-exempt modes)
    const atStopLevel = oldLevel % 100 === 99;
    if (!isExemptStopMode && !bypassLevelStop && type === "piece" && atStopLevel) {
      newLevel = oldLevel;
    }

    this.level = newLevel;

    // Ensure level never exceeds mode's gravity level cap
    const maxLevel =
      this.gameMode && typeof this.gameMode.getDisplayLevelCap === "function"
        ? this.gameMode.getDisplayLevelCap()
        : this.gameMode
          ? this.gameMode.getGravityLevelCap()
          : 999;
    if (this.level > maxLevel) {
      this.level = maxLevel;
    }

    // Torikan checks
    const isShiraseMode =
      this.selectedMode === "tgm3_shirase" || this.selectedMode === "shirase";
    const isTGM3Master =
      this.selectedMode === "tgm3" || this.selectedMode === "tgm3_master";
    if ((isShiraseMode || isTGM3Master) && !this.torikanFailed) {
      const specMech =
        (this.gameMode &&
          typeof this.gameMode.getConfig === "function" &&
          this.gameMode.getConfig()?.specialMechanics) ||
        {};
      const times =
        specMech.torikanTimes &&
        (this.rotationSystem === "ARS" || this.rotationSystem === "classic"
          ? specMech.torikanTimes.classic
          : specMech.torikanTimes.world);
      if (times) {
        if (this.level >= 500 && !this.torikanChecked[500]) {
          this.torikanChecked[500] = true;
          if (this.currentTime > (times.level500 || Infinity)) {
            this.torikanFailed = true;
            if (isShiraseMode) this.grade = "S5";
            // TGM3 Master/Shirase torikan fail: trigger staged fail sequence instead of immediate game over
            if (isTGM3Master || isShiraseMode) {
              this.torikanFailActive = true;
              this.torikanFailTimer = 0;
              this.torikanFailMessageShown = false;
              this.torikanFailGameOverShown = false;
              this.startMinoFading();
              // Stop BGM immediately
              if (this.currentBGM) {
                this.currentBGM.stop();
                this.currentBGM = null;
              }
              if (this.creditsBGM) {
                this.creditsBGM.stop();
                this.creditsBGM = null;
              }
              // Clear held inputs
              this.leftKeyPressed = false;
              this.rightKeyPressed = false;
              this.leftInRepeat = false;
              this.rightInRepeat = false;
              this.leftTimer = 0;
              this.rightTimer = 0;
              this.kKeyPressed = false;
              this.spaceKeyPressed = false;
              this.lKeyPressed = false;
              this.xKeyPressed = false;
              return;
            }
            this.showGameOverScreen();
            return;
          }
        }
        if (isShiraseMode && this.level >= 1000 && !this.torikanChecked[1000]) {
          this.torikanChecked[1000] = true;
          if (this.currentTime > (times.level1000 || Infinity)) {
            this.torikanFailed = true;
            this.grade = "S10";
            this.torikanFailActive = true;
            this.torikanFailTimer = 0;
            this.torikanFailMessageShown = false;
            this.torikanFailGameOverShown = false;
            this.startMinoFading();
            if (this.currentBGM) {
              this.currentBGM.stop();
              this.currentBGM = null;
            }
            if (this.creditsBGM) {
              this.creditsBGM.stop();
              this.creditsBGM = null;
            }
            this.leftKeyPressed = false;
            this.rightKeyPressed = false;
            this.leftInRepeat = false;
            this.rightInRepeat = false;
            this.leftTimer = 0;
            this.rightTimer = 0;
            this.kKeyPressed = false;
            this.spaceKeyPressed = false;
            this.lKeyPressed = false;
            this.xKeyPressed = false;
            return;
          }
        }
      }
    }

    const specialMechanics =
      (this.gameMode &&
        typeof this.gameMode.getConfig === "function" &&
        this.gameMode.getConfig()?.specialMechanics) ||
      {};
    const sectionStops = Array.isArray(specialMechanics.sectionStops)
      ? specialMechanics.sectionStops
      : [];
    const isNormalMode = this.isNormalOrEasyMode() && !sectionStops.length;
    const allowsBellAndSectionStops = !bypassLevelStop;
    const stopLevelHit =
      allowsBellAndSectionStops &&
      !isNormalMode &&
      sectionStops.includes(this.level) &&
      this.level !== this.lastBellLevel;

    // Play bell at x99 level stops (once per stop) except Normal mode bypass
    if (
      allowsBellAndSectionStops &&
      this.level % 100 === 99 &&
      this.level !== this.lastBellLevel &&
      !isNormalMode
    ) {
      this.lastBellLevel = this.level;
      try {
        this.playSfx("bell", 0.6);
      } catch {}
    }

    // Enforce section stop by freezing level until a line clear occurs (handled via stop flag)
    if (stopLevelHit) {
      this.lastBellLevel = this.level;
      this.levelStopActive = true;
    } else if (!stopLevelHit) {
      // Clear stop when advancing via line clear at stop levels
      this.levelStopActive = false;
    }

    // Play complete when reaching max level once
    if (this.level >= maxLevel && !this.levelMaxSoundPlayed) {
      this.levelMaxSoundPlayed = true;
      // Defer complete SFX if line clear delay is active (or about to be, since updateLevel runs before ARE setup in handlePieceLock)
      if (this.lineClearDelayActive || type === "lines") {
        this.pendingCompleteSequence = true;
      } else {
        try {
          this.playSfx("complete", 0.8);
        } catch {}
      }
    }

    // Shirase monochrome activation 1000-1299
    if (isShiraseMode) {
      if (this.level >= 1000) {
        if (!this.monochromeActive) {
          this.monochromeActive = true;
        }
        this.board?.applyMonochromeTextures(this);
        this.shiraseGarbageCounter = 0; // Disable garbage after 1000
        if (this.level >= 1300) {
          if (this.gameMode && typeof this.gameMode.initializeBigRoll === "function") {
            this.gameMode.initializeBigRoll(this);
          } else {
            this.bigBlocksActive = true;
          }
        } else {
          this.bigBlocksActive = false;
        }
      } else {
        if (this.monochromeActive) {
          this.monochromeActive = false;
          this.board?.clearMonochromeTextures();
        }
        this.bigBlocksActive = false;
      }
    } else {
      // Check if mode has bigMode enabled (e.g., Konoha)
      const specMech =
        (this.gameMode &&
          typeof this.gameMode.getConfig === "function" &&
          this.gameMode.getConfig()?.specialMechanics) ||
        {};
      const bigModeEnabled = specMech.bigMode === true;
      if (!bigModeEnabled) {
        this.bigBlocksActive = false;
      }
    }

    // Update mode-specific timings in case they change with level (but don't overwrite user overrides)
    if (this.gameMode && !this.isEligibleTimingOverride) {
      this.dasDelay =
        this.gameMode.getDAS && typeof this.gameMode.getDAS === "function"
          ? this.gameMode.getDAS()
          : 16 / 60;
      this.arrDelay =
        this.gameMode.getARR && typeof this.gameMode.getARR === "function"
          ? this.gameMode.getARR()
          : 1 / 60;
      this.areDelay =
        this.gameMode.getARE && typeof this.gameMode.getARE === "function"
          ? this.gameMode.getARE()
          : 30 / 60;
      this.lockDelayMax =
        this.gameMode.getLockDelay && typeof this.gameMode.getLockDelay === "function"
          ? this.gameMode.getLockDelay()
          : 0.5;
    }

    // Check for section transitions
    const sectionLength = this.getSectionLength();
    const newBasis = this.getSectionBasisValue();
    const oldBasis =
      this.selectedMode === "marathon"
        ? type === "lines"
          ? Math.max(0, newBasis - amount)
          : newBasis
        : oldLevel;
    const oldSection = Math.floor(oldBasis / sectionLength);
    const newSection = Math.floor(newBasis / sectionLength);

    // Capture *70 time for COOL if reached in current section
    const sectionStart = newSection * sectionLength;
    const coolThresholdLevel = sectionStart + 70;
    if (
      this.level >= coolThresholdLevel &&
      !this.section70Captured.has(newSection)
    ) {
      const coolTime = this.currentTime - this.sectionStartTime;
      this.sectionCoolTimes[newSection] = coolTime;
      this.section70Captured.add(newSection);
      if (this.gameMode) {
        this.gameMode.sectionCoolTimes = this.gameMode.sectionCoolTimes || [];
        this.gameMode.sectionCoolTimes[newSection] = coolTime;
      }
      // Buffer internal level for BGM (includes COOL bonus) at *70
      const internalLevelForBgmStop =
        this.gameMode && typeof this.gameMode.bgmStopLevel === "number"
          ? this.gameMode.bgmStopLevel
          : this.gameMode && typeof this.gameMode.internalLevel === "number"
            ? this.gameMode.internalLevel
            : this.level;
      this.bgmInternalLevelBuffer = Math.max(this.bgmInternalLevelBuffer || 0, internalLevelForBgmStop);
      // Early COOL banner scheduling for current section (esp. 000-099)
      if (
        this.gameMode &&
        typeof this.gameMode.evaluateSectionPerformance === "function"
      ) {
        const sectionIndexForEval = newSection + 1; // 1-based for evaluator
        const earlyResult = this.gameMode.evaluateSectionPerformance(
          sectionIndexForEval,
          coolTime,
          coolTime,
        );
        if (earlyResult === "cool") {
          const sectionLength = this.getSectionLength();
          const baseLevel = newSection * sectionLength;
          const targetLevel = baseLevel + 80 + Math.floor(Math.random() * 11); // 80-90 inclusive
          this.coolAnnouncementsTargets[newSection] = targetLevel;
          this.coolAnnouncementsShown.delete(newSection);
          const schedule = this.getBgmSchedule(modeId);
          if (
            schedule &&
            schedule.useStopBuffer !== false &&
            this.hasBgmSegmentChange(schedule, baseLevel, baseLevel + sectionLength)
          ) {
            this.bgmInternalLevelBuffer = Math.max(this.bgmInternalLevelBuffer || 0, targetLevel);
          }
          // Early scheduling done; banner will fire in checkCoolRegretAnnouncements.
        }
      }
    }

    if (newSection > oldSection && this.level < maxLevel) {
      this.handleSectionTransition(newSection);
    }

    // Check for important level milestones
    const milestones = [100, 200, 300, 500, maxLevel];
    if (milestones.includes(this.level) && this.level !== oldLevel) {
      if (this.level === maxLevel) {
        const sectionLength = this.getSectionLength();
        const basisAtMax = this.getSectionBasisValue();
        const oldBasisForMax =
          this.selectedMode === "marathon" && type === "lines"
            ? Math.max(0, basisAtMax - amount)
            : oldLevel;
        const lastSectionIndex = Math.floor(oldBasisForMax / sectionLength);
        if (
          typeof this.sectionTimes[lastSectionIndex] !== "number" &&
          lastSectionIndex === this.currentSection
        ) {
          this.sectionTimes[lastSectionIndex] = this.currentTime - this.sectionStartTime;
          this.sectionTetrises[lastSectionIndex] = this.currentSectionTetrisCount;
          if (
            typeof this.sectionCoolTimes[lastSectionIndex] !== "number" &&
            this.section70Captured.has(lastSectionIndex)
          ) {
            this.sectionCoolTimes[lastSectionIndex] = this.currentTime - this.sectionStartTime;
          }
        }

        this.handleReachedMaxLevel({
          type,
          amount,
          oldLevel,
          maxLevel,
          lastSectionIndex,
        });
      }
    }

    // Update BGM based on level
    this.updateBGM();
  }

  handleSectionTransition(section) {
    if (typeof section !== "number" || section <= this.currentSection) return;
    this.sectionTransition = true;
    const sectionLength = this.getSectionLength();

    const completedSection = section - 1;
    if (completedSection >= 0) {
      this.sectionTimes[completedSection] = this.currentTime - this.sectionStartTime;
      this.sectionTetrises[completedSection] = this.currentSectionTetrisCount;
      // Persist section times into mode for COOL/REGRET checks that need previous section timing
      if (this.gameMode && Array.isArray(this.sectionTimes)) {
        this.gameMode.sectionTimes = this.gameMode.sectionTimes || [];
        this.gameMode.sectionTimes[completedSection] = this.sectionTimes[completedSection];
      }

      // Mode hook for section completion (used by multiple TGM variants)
      if (this.gameMode && typeof this.gameMode.onSectionComplete === "function") {
        try {
          this.gameMode.onSectionComplete(
            this,
            completedSection,
            this.sectionTimes[completedSection],
          );
        } catch (e) {
          console.warn("[handleSectionTransition] onSectionComplete failed", e);
        }
      }

      // COOL/REGRET evaluation for TGM3 Master
      if (
        this.gameMode &&
        typeof this.gameMode.evaluateSectionPerformance === "function" &&
        typeof this.gameMode.onSectionCool === "function" &&
        typeof this.gameMode.onSectionRegret === "function"
      ) {
        const sectionTime = this.sectionTimes[completedSection];
        const coolTime =
          this.sectionCoolTimes && typeof this.sectionCoolTimes[completedSection] === "number"
            ? this.sectionCoolTimes[completedSection]
            : null;
        const evalSectionIndex = completedSection + 1; // shift to 1-based for COOL/REGRET
        const result = this.gameMode.evaluateSectionPerformance(
          evalSectionIndex,
          sectionTime,
          coolTime,
        );
        const modeId =
          this.gameMode && typeof this.gameMode.getModeId === "function"
            ? this.gameMode.getModeId()
            : this.selectedMode;
        if (result === "cool") {
          this.gameMode.onSectionCool();
          // Only add generic rollBonus for non-TGM3 Master modes
          if (
            typeof this.rollBonus === "number" &&
            modeId !== "tgm3_master" &&
            modeId !== "tgm3"
          ) {
            this.rollBonus += 1;
          }
          this.sectionPerformance[completedSection] = "COOL";
          // Schedule COOL announcement in the current section between *80-*90
          // COOL should announce in the section where it was earned.
          const currentSectionIndex = completedSection;
          const baseLevel = currentSectionIndex * sectionLength;
          const targetLevel = baseLevel + 80 + Math.floor(Math.random() * 11); // 80-90 inclusive
          this.coolAnnouncementsTargets[currentSectionIndex] = targetLevel;
          this.coolAnnouncementsShown.delete(currentSectionIndex);
          // Update BGM internal level buffer to COOL animation target level
          // so BGM stops when COOL animation appears, not at *70
          // Only do this if the next section changes BGM track
          const nextSection = completedSection + 1;
          const schedule = this.getBgmSchedule(modeId);
          if (schedule && schedule.segments) {
            const currentSectionLevel = currentSectionIndex * sectionLength;
            const nextSectionLevel = nextSection * sectionLength;
            if (
              schedule.useStopBuffer !== false &&
              this.hasBgmSegmentChange(schedule, currentSectionLevel, nextSectionLevel)
            ) {
              if (this.gameMode && typeof this.gameMode.bgmStopLevel === "number") {
                this.bgmInternalLevelBuffer = Math.max(this.bgmInternalLevelBuffer || 0, targetLevel);
              }
            }
          }
        } else if (result === "regret") {
          this.gameMode.onSectionRegret();
          this.sectionPerformance[completedSection] = "REGRET";
          // Show REGRET once at start of next section
          const nextSection = section;
          this.regretAnnouncementsPending[nextSection] = true;
        } else {
          this.sectionPerformance[completedSection] = null;
        }
      }

      this.sectionStartTime = this.currentTime;
      this.currentSection = section;
      this.currentSectionPieceIndex = 0;
      this.currentSectionTetrisCount = 0;
      // Reset *70 capture for the new section
      if (Array.isArray(this.sectionCoolTimes)) {
        this.sectionCoolTimes[section] = undefined;
      }
      if (this.section70Captured instanceof Set) {
        this.section70Captured.delete(section);
      }
      // Show REGRET immediately at section start if pending
      if (this.regretAnnouncementsPending[section] && !this.regretAnnouncementsShown.has(section)) {
        this.showCoolRegretBanner("REGRET");
        this.regretAnnouncementsShown.add(section);
        delete this.regretAnnouncementsPending[section];
      }
      // Apply TGM3 internal timing/gravity phase on section entry using internal level with COOL bonus
      if (
        this.gameMode &&
        typeof this.gameMode.getModeId === "function" &&
        this.gameMode.getModeId() === "tgm3_master" &&
        typeof this.gameMode.updateTimingPhase === "function"
      ) {
        const sectionLength = this.getSectionLength();
        const internalLevel =
          section * sectionLength + (typeof this.gameMode.coolBonus === "number" ? this.gameMode.coolBonus : 0);
        this.gameMode.internalLevel = internalLevel;
        this.gameMode.bgmStopLevel = internalLevel;
        this.gameMode.updateTimingPhase(internalLevel);
      }
    }

    // Play section change sound
    this.playSfx("sectionchange", 0.6);

    // Section completion messages removed - uncomment if needed for other modes
    /*
        // Show section completion message
        const sectionStart = (section - 1) * 100;
        let sectionEnd = section * 100 - 1;
        if (section >= 5) {
            sectionEnd = 999;
        }
        this.showSectionMessage(`Section ${sectionStart}-${sectionEnd} Complete!`);
        */

    // Adjust section cap based on mode (default to Normal mode)
    if (this.selectedMode === "marathon") {
      this.sectionCap = (section + 1) * 10;
    } else {
      this.sectionCap = (section + 1) * 100;
      if (section >= 9) {
        this.sectionCap = 999;
      }
    }
  }

  getTGMGravitySpeed(level) {
    // Use mode-based gravity calculation if mode is available
    if (this.gameMode) {
      const effLevel =
        typeof this.gameMode.internalLevel === "number"
          ? this.gameMode.internalLevel
          : level;
      return this.gameMode.getGravitySpeed(effLevel);
    }

    // Fallback to TGM1 curve if no mode
    return this.getTGM1GravitySpeed(level);
  }

  // Official TGM1 Internal Gravity system (fallback method)
  getTGM1GravitySpeed(level) {
    // Official TGM1 Internal Gravity system
    // Returns Internal Gravity value in 1/256 G units
    // Based on Internal Gravity values in the TGM1 specification

    let internalGravity;

    if (level < 30) internalGravity = 4;
    else if (level < 35) internalGravity = 6;
    else if (level < 40) internalGravity = 8;
    else if (level < 50) internalGravity = 10;
    else if (level < 60) internalGravity = 12;
    else if (level < 70) internalGravity = 16;
    else if (level < 80) internalGravity = 32;
    else if (level < 90) internalGravity = 48;
    else if (level < 100) internalGravity = 64;
    else if (level < 120) internalGravity = 80;
    else if (level < 140) internalGravity = 96;
    else if (level < 160) internalGravity = 112;
    else if (level < 170) internalGravity = 128;
    else if (level < 200) internalGravity = 144;
    else if (level < 220) internalGravity = 4;
    else if (level < 230) internalGravity = 32;
    else if (level < 233) internalGravity = 64;
    else if (level < 236) internalGravity = 96;
    else if (level < 239) internalGravity = 128;
    else if (level < 243) internalGravity = 160;
    else if (level < 247) internalGravity = 192;
    else if (level < 251) internalGravity = 224;
    else if (level < 300)
      internalGravity = 256; // 1G
    else if (level < 330)
      internalGravity = 512; // 2G
    else if (level < 360)
      internalGravity = 768; // 3G
    else if (level < 400)
      internalGravity = 1024; // 4G
    else if (level < 420)
      internalGravity = 1280; // 5G
    else if (level < 450)
      internalGravity = 1024; // 4G
    else if (level < 500)
      internalGravity = 768; // 3G
    else internalGravity = 5120; // 20G

    return internalGravity;
  }

  detectSpin(piece, board) {
    if (!piece || !board) return { isSpin: false, isTSpin: false, spinType: null };
    if (piece.type === "O") return { isSpin: false, isTSpin: false, spinType: null };

    const spinMode = this.getZenSpinMode();
    if (spinMode === "t_only" && piece.type !== "T") {
      return { isSpin: false, isTSpin: false, spinType: null };
    }
    if (spinMode === "all") {
      return { isSpin: true, isTSpin: piece.type === "T", spinType: `${piece.type}-spin` };
    }

    // Build set of current piece cells to ignore self-collision
    const pieceCells = new Set();
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        pieceCells.add(`${piece.x + c},${piece.y + r}`);
      }
    }

    const cellBlocked = (x, y) => {
      if (x < 0 || x >= board.cols || y >= board.rows) return true;
      if (y < 0) return false; // above visible area is allowed
      const key = `${x},${y}`;
      if (pieceCells.has(key)) return false; // ignore current piece footprint
      return !!board.grid[y][x];
    };

    const canMove = (dx, dy) => {
      for (const key of pieceCells) {
        const [px, py] = key.split(",").map(Number);
        const nx = px + dx;
        const ny = py + dy;
        if (nx < 0 || nx >= board.cols || ny >= board.rows) return false;
        if (ny < 0) continue; // off-screen above is ok
        if (cellBlocked(nx, ny)) return false;
      }
      return true;
    };

    // T: 3-corner rule with grounding guard and self-aware occupancy
    if (piece.type === "T") {
      // Require grounded
      if (canMove(0, 1)) return { isSpin: false, isTSpin: false, spinType: null };

      // Require last movement to be a rotation while grounded
      if (!this.spinRotatedWhileGrounded) {
        return { isSpin: false, isTSpin: false, spinType: null };
      }

      const pivotX = piece.x + 1;
      const pivotY = piece.y + 1;
      const corners = [
        [pivotX - 1, pivotY - 1],
        [pivotX + 1, pivotY - 1],
        [pivotX - 1, pivotY + 1],
        [pivotX + 1, pivotY + 1],
      ];
      let filledCorners = 0;
      for (const [cx, cy] of corners) {
        if (cellBlocked(cx, cy)) filledCorners++;
      }
      if (filledCorners >= 3) {
        return { isSpin: true, isTSpin: true, spinType: "t-spin" };
      }
      if (filledCorners === 2) {
        return { isSpin: true, isTSpin: false, spinType: "t-spin mini" };
      }
      return { isSpin: false, isTSpin: false, spinType: null };
    }

    // Non-T: immobile rule as requested:
    // must be grounded (cannot move down) AND cannot move 1 left, 1 right, or 1 up.

    // Grounded check (cannot move down)
    const isGrounded = !canMove(0, 1);
    if (!isGrounded) return { isSpin: false, isTSpin: false, spinType: null };

    const blockedLeft = !canMove(-1, 0);
    const blockedRight = !canMove(1, 0);
    const blockedUp = !canMove(0, -1);
    const blockedDown = !canMove(0, 1);

    const isImmobile = blockedDown && blockedLeft && blockedRight && blockedUp;
    return {
      isSpin: isImmobile,
      isTSpin: false,
      spinType: isImmobile ? `${piece.type}-spin` : null,
    };
  }

  isStandardComboMode() {
    const m = this.selectedMode;
    return m === "ultra" || m === "zen" || m === "marathon" || m === "sprint_40" || m === "sprint_100";
  }

  getCurrentModeId() {
    if (typeof this.modeId === "string" && this.modeId) return this.modeId;
    if (this.gameMode && typeof this.gameMode.getModeId === "function") {
      return this.gameMode.getModeId();
    }
    return this.selectedMode;
  }

  isTgm4Mode() {
    const modeId = this.getCurrentModeId();
    return typeof modeId === "string" && modeId.startsWith("tgm4");
  }

  shouldHideGravityBarAndSectionCap() {
    const modeId = this.getCurrentModeId();
    return (
      modeId === "konoha_easy" ||
      modeId === "konoha_hard" ||
      modeId === "tgm4_rounds"
    );
  }

  usesStandardDropBehavior() {
    return this.isStandardComboMode() || this.isTgm4Mode();
  }

  isLegacySoftDropLockMode() {
    const modeId = this.getCurrentModeId();
    return modeId === "tgm1" || modeId === "master_20g";
  }

  shouldShowB2BChain() {
    return this.isStandardComboMode();
  }

  updateStandardCombo(onLineClear, nowSeconds) {
    if (!this.standardComboText) return;
    if (this.standardComboFadeTween) {
      this.standardComboFadeTween.stop();
      this.standardComboFadeTween = null;
    }
    if (onLineClear) {
      this.standardComboCount = this.standardComboCount < 0 ? 0 : this.standardComboCount + 1;
      this.standardComboLastLineTime = nowSeconds || 0;
      if (this.standardComboCount >= 1) {
        this.standardComboNumberText?.setText(`${this.standardComboCount}`);
        this.standardComboLabelText?.setX((this.standardComboNumberText?.width || 0) + 6);
        this.standardComboText.setAlpha(1);
        this.standardComboText.setVisible(true);
        this.standardComboText.setScale(1);
        this.tweens.add({
          targets: this.standardComboText,
          scale: { from: 1, to: 1.2 },
          duration: 140,
          yoyo: true,
          ease: "Back.easeOut",
        });
      }
    }
  }

  tickStandardCombo(nowSeconds) {
    if (!this.standardComboText) return;
    if (this.standardComboCount < 0) return;
    const idle = nowSeconds - (this.standardComboLastLineTime || 0);
    if (idle > 1.25) {
      if (!this.standardComboFadeTween) {
        this.standardComboFadeTween = this.tweens.add({
          targets: this.standardComboText,
          alpha: { from: this.standardComboText.alpha, to: 0 },
          duration: 320,
          onComplete: () => {
            this.standardComboFadeTween = null;
            this.standardComboText.setVisible(false);
            this.standardComboCount = -1;
          },
        });
      }
    }
  }

  computeAttack(lines, spinInfo, isAllClear, prevBackToBack) {
    // Zen sandbox: optional guideline attack table
    if (
      this.isZenSandboxActive() &&
      this.zenSandboxConfig &&
      this.zenSandboxConfig.attackTableType === "guideline" &&
      typeof this.getGuidelineAttack === "function"
    ) {
      return this.getGuidelineAttack(lines, spinInfo, isAllClear, prevBackToBack);
    }

    const baseTable = [0, 0, 1, 2, 4];
    const isSpin = !!(spinInfo && spinInfo.isSpin);
    const spinType = spinInfo ? spinInfo.spinType : null;
    const isMini = spinType && spinType.includes("mini");
    const isDifficult = (lines >= 4 || (isSpin && lines > 0)) && lines > 0;

    // Base attack
    let base = 0;
    if (isSpin) {
      if (isMini) {
        base = lines === 2 ? 1 : 0;
      } else {
        base = 2 * lines;
      }
    } else {
      base = baseTable[lines] || 0;
    }

    // B2B bonus when chain is maintained
    const b2bMaintained = prevBackToBack && isDifficult;
    if (b2bMaintained) base += 1;

    // All clear bonus
    if (isAllClear) base += 10;

    // Treat the first clear in a chain as combo 0 so Tetrises start at base 4 (not 5)
    const comboVal = Math.max(0, (this.comboCount || 0) - 1);
    let attack = 0;
    if (base > 0) {
      // comboVal is -1 before first clear, 0 on first clear, 1 on second clear, etc.
      attack = Math.floor(base * (1 + 0.25 * Math.max(0, comboVal)));
    } else if (comboVal >= 2) {
      attack = Math.floor(Math.log(1 + 1.25 * comboVal));
    }

    // B2B chain bookkeeping
    const prevChain = this.b2bChainCount ?? -1;
    let newChain = prevChain;
    let b2bBroken = false;
    if (isDifficult) {
      if (prevChain < 0) {
        newChain = 0; // first difficult clear starts chain at 0
      } else {
        newChain = b2bMaintained ? prevChain + 1 : 1;
      }
    } else {
      if (lines > 0) {
        if (prevBackToBack) {
          b2bBroken = true;
        }
        newChain = -1;
      } else {
        // No clear (piece placement) does not break chain
        newChain = prevChain;
      }
    }
    this.b2bChainCount = newChain;

    return {
      attack,
      isDifficult,
      b2bMaintained,
      b2bBroken,
      prevChain,
      newChain,
    };
  }

  updateAttackStats(attack, nowSeconds) {
    if (attack <= 0) return;

    if (this.spikeFadeTween) {
      this.spikeFadeTween.stop();
      this.spikeFadeTween = null;
    }
    if (this.spikeText) {
      this.spikeText.setAlpha(1);
      this.spikeText.setVisible(true);
      this.spikeText.setScale(1);
      this.tweens.add({
        targets: this.spikeText,
        scale: { from: 1, to: 1.18 },
        duration: 120,
        yoyo: true,
        ease: "Cubic.easeOut",
      });
    }

    const elapsedSinceLast = nowSeconds - (this.lastAttackTime || 0);
    if (elapsedSinceLast > 1) {
      this.attackSpike = 0;
    }
    this.lastAttackTime = nowSeconds;
    this.totalAttack = (this.totalAttack || 0) + attack;
    this.attackSpike = (this.attackSpike || 0) + attack;
  }

  tickAttackDecay(nowSeconds) {
    if (!this.lastAttackTime) return;
    const idle = nowSeconds - this.lastAttackTime;
    if (this.attackSpike > 0 && idle > 1) {
      this.attackSpike = 0;
      if (this.spikeFadeTween) {
        this.spikeFadeTween.stop();
        this.spikeFadeTween = null;
      }
      if (this.spikeText) {
        this.spikeText.setAlpha(0);
        this.spikeText.setVisible(false);
      }
      this.updateAttackUI();
    } else if (this.attackSpike > 0 && idle > 0.5) {
      if (!this.spikeFadeTween && this.spikeText) {
        this.spikeFadeTween = this.tweens.add({
          targets: this.spikeText,
          alpha: { from: this.spikeText.alpha, to: 0 },
          duration: 500,
          onComplete: () => {
            this.spikeFadeTween = null;
            if (this.spikeText) {
              this.spikeText.setVisible(false);
            }
          },
        });
      }
    }
  }

  updateAttackUI() {
    if (
      !this.attackTotalText ||
      !this.attackPerMinText ||
      !this.spikeText ||
      !this.attackPerPieceText
    )
      return;

    // Hide spike counter outside Zen or during Ready/Go
    const isZenMode =
      typeof this.isZenSandboxActive === "function" ? this.isZenSandboxActive() : false;
    if (this.readyGoPhase) {
      this.spikeText.setVisible(false);
      return;
    }
    if (!isZenMode) {
      this.spikeText.setVisible(false);
      // Still update totals/ATK per min if UI is shown elsewhere (e.g., Zen only)
      return;
    }
    const elapsed = Math.max(0.0001, this.currentTime || 0); // avoid div/0
    const atkPerMin = (this.totalAttack / elapsed) * 60;
    const piecesPlaced = Math.max(1, this.totalPiecesPlaced || 0);
    const atkPerPiece = this.totalAttack / piecesPlaced;

    this.attackTotalText.setText(`${Math.floor(this.totalAttack) || 0}`);
    this.attackPerMinText.setText(atkPerMin.toFixed(2));
    this.attackPerPieceText.setText(atkPerPiece.toFixed(2));

    if (this.attackSpike >= 8) {
      const spike = Math.floor(this.attackSpike);
      const t = Math.min(spike / 20, 1);
      const lerp = (a, b, k) => Math.round(a + (b - a) * k);
      const r = lerp(255, 255, t);
      const g = lerp(170, 40, t);
      const b = lerp(51, 40, t);
      const hex = (n) => n.toString(16).padStart(2, "0");
      const color = `#${hex(r)}${hex(g)}${hex(b)}`;
      this.spikeText.setColor(color);
      this.spikeText.setText(`SPIKE ${spike}`);
      this.spikeText.setVisible(true);
    } else {
      this.spikeText.setVisible(false);
    }

    // VS score: (attack sent + garbage cleared) / pieces * PPS * 100
    if (this.vsScoreText) {
      const pieces = Math.max(1, this.totalPiecesPlaced || 0);
      const pps = Number.isFinite(this.conventionalPPS) ? this.conventionalPPS : 0;
      const totalVsAttack = Number(this.totalAttack || 0) + Number(this.totalGarbageCleared || 0);
      const vsScore = ((totalVsAttack / pieces) * pps * 100).toFixed(2);
      this.vsScoreText.setText(vsScore);
    }
  }

  showB2BChain(b2bMaintained, b2bBroken, prevChain, newChain) {
    if (!this.b2bChainText) return;
    if (!this.shouldShowB2BChain()) {
      this.b2bChainText.setVisible(false);
      return;
    }
    this.b2bChainText.setText(`B2B x${newChain}`);

    if (b2bMaintained && newChain > prevChain) {
      this.b2bChainText.setColor("#ffff55");
      this.b2bChainText.setScale(1);
      this.tweens.add({
        targets: this.b2bChainText,
        scale: { from: 1, to: 1.2 },
        duration: 140,
        yoyo: true,
        ease: "Cubic.easeOut",
      });
    } else if (b2bBroken) {
      // Only flash if chain was at least 2; otherwise hide quietly
      if (prevChain >= 2) {
        this.b2bChainText.setText("B2B x0");
        this.b2bChainText.setColor("#ff4444");
        this.b2bChainText.setScale(1);
        this.b2bChainText.setVisible(true);
        this.tweens.add({
          targets: this.b2bChainText,
          alpha: { from: 1, to: 0.3 },
          duration: 120,
          yoyo: true,
          repeat: 2, // 3 flashes total
          onComplete: () => {
            this.b2bChainText.setAlpha(1);
            this.b2bChainText.setColor("#ffff55");
            this.b2bChainText.setVisible(false);
          },
        });
      } else {
        this.b2bChainText.setVisible(false);
      }
    } else if (newChain <= 0) {
      this.b2bChainText.setVisible(false);
    } else {
      this.b2bChainText.setVisible(true);
    }
  }

  updateGrade() {
    if (!this.modeUsesGrading()) {
      this.grade = null;
      this.internalGrade = null;
      return;
    }

    // Official TGM1 grade progression based on score thresholds with time requirements for GM
    const score = this.score;
    const time = this.currentTime;
    const level = this.level;

    let newGrade = "9"; // Default grade

    // Track GM conditions
    if (level >= 300 && score >= 12000 && time <= 4 * 60 + 15) {
      // 4:15
      this.gmConditions.level300.achieved = true;
      this.gmConditions.level300.time = time;
      this.gmConditions.level300.score = score;
    }
    if (level >= 500 && score >= 40000 && time <= 7 * 60 + 30) {
      // 7:30
      this.gmConditions.level500.achieved = true;
      this.gmConditions.level500.time = time;
      this.gmConditions.level500.score = score;
    }
    if (level >= 999 && score >= 126000 && time <= 13 * 60 + 30) {
      // 13:30
      this.gmConditions.level999.achieved = true;
      this.gmConditions.level999.time = time;
      this.gmConditions.level999.score = score;
    }

    // Grand Master requirements (all three conditions must be achieved)
    if (
      this.gmConditions.level300.achieved &&
      this.gmConditions.level500.achieved &&
      this.gmConditions.level999.achieved
    ) {
      newGrade = "GM";
    }
    // Regular grade progression based on score thresholds (from tetris.wiki)
    else if (score >= 120000) newGrade = "S9";
    else if (score >= 100000) newGrade = "S8";
    else if (score >= 82000) newGrade = "S7";
    else if (score >= 66000) newGrade = "S6";
    else if (score >= 52000) newGrade = "S5";
    else if (score >= 40000) newGrade = "S4";
    else if (score >= 30000) newGrade = "S3";
    else if (score >= 22000) newGrade = "S2";
    else if (score >= 16000) newGrade = "S1";
    else if (score >= 12000) newGrade = "1";
    else if (score >= 8000) newGrade = "2";
    else if (score >= 5500) newGrade = "3";
    else if (score >= 3500) newGrade = "4";
    else if (score >= 2000) newGrade = "5";
    else if (score >= 1400) newGrade = "6";
    else if (score >= 800) newGrade = "7";
    else if (score >= 400) newGrade = "8";
    // Keep grade 9 for scores below 400 points

    const previousGrade = this.grade;
    const previousDisplayedGrade =
      this.gradeText && typeof this.gradeText.text === "string"
        ? this.gradeText.text.trim()
        : previousGrade;
    const previousDisplayedValue = this.getGradeValue(previousDisplayedGrade);
    const newGradeValue = this.getGradeValue(newGrade);
    const previousGradeValue = this.getGradeValue(previousGrade);

    // Update grade if it improved (only upgrade, don't downgrade)
    if (newGradeValue > previousGradeValue) {
      this.grade = newGrade;
      if (newGradeValue > previousDisplayedValue) {
        this.animateGradeUpgrade();
      }
      this.gradeHistory.push({
        grade: newGrade,
        level: this.level,
        time: this.currentTime,
        score: score,
      });
    }

    if (this.gameMode && typeof this.grade === "string" && this.grade.trim() !== "") {
      this.gameMode.displayedGrade = this.grade;
    }
    if (this.gameMode && typeof this.internalGrade === "number") {
      this.gameMode.internalGrade = this.internalGrade;
    }
  }

  getGradeValue(grade) {
    const gradeValues = {
      9: 0,
      8: 1,
      7: 2,
      6: 3,
      5: 4,
      4: 5,
      3: 6,
      2: 7,
      1: 8,
      S1: 9,
      S2: 10,
      S3: 11,
      S4: 12,
      S5: 13,
      S6: 14,
      S7: 15,
      S8: 16,
      S9: 17,
      M: 18,
      GM: 19,
    };
    return gradeValues[grade] || 0;
  }

  updateGradeUIVisibility() {
    if (!this.gradeDisplay || !this.gradeText) return;

    const gradeValue =
      typeof this.grade === "string" ? this.grade.trim() : this.grade;
    const hasGrade =
      gradeValue !== undefined &&
      gradeValue !== null &&
      gradeValue !== "" &&
      gradeValue !== 0;

    this.gradeDisplay.setVisible(hasGrade);
    this.gradeText.setVisible(hasGrade);
    if (this.gradePointsText) {
      this.gradePointsText.setVisible(hasGrade && this.shouldShowGradePoints !== false);
    }

    if (this.nextGradeText) {
      this.nextGradeText.setVisible(
        hasGrade && this.shouldShowNextGradeText,
      );
    }
  }

  updateNextGradeText() {
    if (!this.nextGradeText || !this.shouldShowNextGradeText) return; // Skip if grade display not created

    const gradeThresholds = {
      9: 400,
      8: 800,
      7: 1400,
      6: 2000,
      5: 3500,
      4: 5500,
      3: 8000,
      2: 12000,
      1: 16000,
      S1: 22000,
      S2: 30000,
      S3: 40000,
      S4: 52000,
      S5: 66000,
      S6: 82000,
      S7: 100000,
      S8: 120000,
      S9: 126000,
      GM: Infinity,
    };
    const nextThreshold = gradeThresholds[this.grade];
    if (nextThreshold === Infinity) { // Infinity is used for GM grade, so display this at S9
      this.nextGradeText.setText("Next grade at ?????? points");
    } else {
      this.nextGradeText.setText(`Next grade at  ${nextThreshold} points`);
    }
  }

  animateGradeUpgrade() {
    if (!this.modeUsesGrading()) {
      return;
    }

    // Play grade up sound
    this.playSfx("gradeup", 0.6);

    // Simple flash animation (only if grade text exists)
    if (this.gradeText) {
      this.gradeText.setTint(0xffff00);
      this.time.delayedCall(200, () => {
        this.gradeText.setTint(0xffffff);
      });
      this.time.delayedCall(400, () => {
        this.gradeText.setTint(0xffff00);
      });
      this.time.delayedCall(600, () => {
        this.gradeText.setTint(0xffffff);
      });
    }
  }

  getHeldKeys() {
    const held = [];
    if (this.leftKeyPressed) held.push("Z");
    if (this.rightKeyPressed) held.push("C");
    if (this.kKeyPressed) held.push("K");
    if (this.spaceKeyPressed) held.push("Space");
    if (this.lKeyPressed) held.push("L");
    if (this.xKeyPressed) held.push("X");
    if (this.keys.s.isDown) held.push("S");
    return held;
  }

  restartGame() {
    // Check if mode uses grading
    const hasGrading = this.modeUsesGrading();

    // Reset all game variables
    this.board = new Board();
    this.board.scene = this;
    this.visibleRows = 20;
    this.bigModeActive = false;
    this.bigBlocksActive = false;
    this.bigModeBoardActive = false;
    if (this.gameMode && typeof this.gameMode.initializeForGameScene === "function") {
      this.gameMode.initializeForGameScene(this);
    }
    this.currentPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    this.nextPieces = [];
    this.gravityTimer = 0.0;
    this.gravityAccum = 0.0;
    this.lockDelay = 0;
    this.isGrounded = false;
    this.level = this.startingLevel || 0; // Use preserved starting level or default to 0
    this.piecesPlaced = 0; // Reset piece counter
    this.score = 0;
    this.grade = null;
    this.internalGrade = null;
    this.gameOver = false;
    this.sectionCap = 99;
    this.sectionTransition = false;
    this.sectionMessage = null;
    this.sectionMessageTimer = 0;
    this.comboCount = -1;
    this.backToBack = false;
    this.totalLines = 0;
    this.lastClearType = null;
    this.lastLineClearWasBravo = false;
    this.gradeHistory = [];
    this.sectionTimes = [];
    this.sectionStartTime = 0;
    this.currentSection = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
    this.sectionTetrises = [];
    this.currentSectionTetrisCount = 0;

    // Reset piece active time tracking
    this.pieceActiveTime = 0;
    this.pieceSpawnTime = 0;

    // Reset drop tracking
    this.softDropRows = 0;
    this.hardDropRows = 0;

    // Reset piece per second tracking
    this.totalPiecesPlaced = 0;
    this.activeTime = 0;
    this.areTime = 0;
    this.conventionalPPS = 0;
    this.rawPPS = 0;
    this.maxPpsRecorded = 0;
    this.worstChoke = 0;
    this.ppsHistory = [];
    this.ppsLockSampleIndices = [];
    this.ppsSampleTimer = 0;
    this.lastPpsRecordedPieceCount = 0;
    this.ppsGraphGraphics = null;
    this.ppsGraphArea = null;
    if (this.ppsSummaryText) {
      this.ppsSummaryText.setText("Max PPS: -- | Worst choke: --");
    }
    if (this.pieceCountText) this.pieceCountText.setText("0");
    this.finesseActiveForPiece = false;

    // Reset leaderboard saved flag so new runs can submit once
    this.leaderboardSaved = false;

    // Reset TGM1 randomizer
    this.pieceHistory = ["Z", "Z", "S", "S"]; // Reset to initial state
    this.pieceHistoryIndex = 0;
    this.firstPiece = true;
    this.isFirstSpawn = true;

    // Reset BGM first play flags
    this.bgmFirstPlay = {
      stage1: true,
      stage2: true,
    };

    // Reset key states
    this.kKeyPressed = false;
    this.spaceKeyPressed = false;
    this.lKeyPressed = false;
    this.rotate180Pressed = false;
    this.xKeyPressed = false;

    // Reset mino fading system
    this.placedMinos = [];
    this.placedMinoRows = [];
    this.minoFadeActive = false;
    this.fadingComplete = false;
    this.showGameOverText = false;

    this.invisibleStackActive = false;
    this.fadingRollActive = false;

    // Reset loading phases
    this.loadingPhase = true;
    this.readyGoPhase = false;
    this.gameStarted = false;

    // Validate piece history to ensure it's correct after reset
    this.validatePieceHistory();

    // Sync mode internal level/timing phase before READY/GO so first spawn uses correct gravity.
    this.syncModeStateToStartingLevel();
    this.applyModeConfiguration();

    // Reapply mode grading baseline after full reset
    this.applyInitialGradeFromMode();

    // Reset time tracking; actual start time is set on GO
    this.startTime = null;
    this.gameStartTime = null;
    this.currentTime = 0;
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.level999Reached = false; // Reset level 999 flag
    this.pendingCompleteSequence = false;
    this.pendingStaticEndScreen = null;
    this.pendingCreditsStart = null;
    this.preserveBoardOnStaticEnd = false;
    this.gameOverAutoExitDelay = 10;
    this.exitingToMenu = false;
    this.creditsSkipArmed = false;
    this.suppressGameplayBgmForImmediateCreditsStart = false;

    // Clear game elements
    this.gameGroup.clear(true, true);

    // Stop and destroy current BGM
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }

    // Clear all BGM objects to ensure clean restart
    if (this.stage1BGM) {
      this.stage1BGM.destroy();
      this.stage1BGM = null;
    }
    if (this.stage2BGM) {
      this.stage2BGM.destroy();
      this.stage2BGM = null;
    }

    // Clear TGM2 BGM objects
    if (this.tgm2_stage1) {
      this.tgm2_stage1.destroy();
      this.tgm2_stage1 = null;
    }
    if (this.tgm2_stage2) {
      this.tgm2_stage2.destroy();
      this.tgm2_stage2 = null;
    }
    if (this.tgm2_stage3) {
      this.tgm2_stage3.destroy();
      this.tgm2_stage3 = null;
    }
    if (this.tgm2_stage4) {
      this.tgm2_stage4.destroy();
      this.tgm2_stage4 = null;
    }

    // Reset UI
    this.scoreText.setText("0");
    this.currentLevelText.setText("0");
    if (hasGrading) {
      this.gradeText.setText("9");
    }
    // Reset Marathon mode separate level display
    if (isMarathonMode && this.levelDisplayText) {
      this.levelDisplayText.setText("1");
    }
    this.timeText.setText("0:00.00");
    this.ppsText.setText("0.00");
    this.rawPpsText.setText("0.00");
    (this.roundsMedalTexts || []).forEach((text) => text?.setText("0"));

    // Restart loading sequence
    this.time.delayedCall(500, () => {
      this.loadingPhase = false;
      this.showReadyGo();
    });

    // Restart game (queue prep only; spawn happens after GO in showReadyGo)
    this.generateNextPieces();

    // Restart BGM
    this.updateBGM();
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    // Handle time tracking during pause using Date.now()
    if (this.isPaused) {
      // Pausing: record the pause start time
      this.pauseStartTime = Date.now();
    } else {
      if (this.pauseStartTime && this.startTime) {
        const now = Date.now();
        const pausedDuration = now - this.pauseStartTime;
        this.startTime += pausedDuration;
        this.pauseStartTime = null;
      }
    }

    // Pause/resume BGM
    if (this.currentBGM) {
      try {
        if (this.isPaused) {
          if (this.currentBGM.isPlaying && typeof this.currentBGM.pause === "function") {
            this.currentBGM.pause();
          }
        } else if (this.currentBGM.isPaused && typeof this.currentBGM.resume === "function") {
          this.currentBGM.resume();
        }
      } catch (error) {
        console.warn("Current BGM pause/resume failed:", error);
      }
    }
    if (this.creditsBGM) {
      try {
        if (this.isPaused) {
          if (this.creditsBGM.isPlaying && typeof this.creditsBGM.pause === "function") {
            this.creditsBGM.pause();
          }
        } else if (this.creditsActive) {
          if (!this.creditsBgmStarted && this.currentPiece && this.bgmEnabled) {
            this.creditsBGM.play();
            this.creditsBgmStarted = true;
          } else if (this.creditsBGM.isPaused && typeof this.creditsBGM.resume === "function") {
            this.creditsBGM.resume();
          }
        }
      } catch (error) {
        console.warn("Credits BGM pause/resume failed:", error);
      }
    }
  }

  goToMenu() {
    // Centralized safe return to menu to avoid stale scenes causing blank screens
    this.exitingToMenu = true;
    const mgr = this.scene;
    const rootMgr = this.game && this.game.scene ? this.game.scene : mgr;

    try {
      if (rootMgr && typeof rootMgr.getScenes === "function") {
        rootMgr.getScenes(true).map((s) => s.scene.key);
      }
    } catch (e) {
      console.warn("[goToMenu] failed to inspect scene state", e);
    }

    ["AssetLoaderScene", "LoadingScreenScene", "GameScene"].forEach((key) => {
      if (rootMgr.isActive(key)) {
        rootMgr.stop(key);
      }
    });

    // Remove any stray canvas elements left by previous Phaser instances
    const activeCanvas = this.game && this.game.canvas;
    if (activeCanvas && activeCanvas.parentNode) {
      const canvases = Array.from(activeCanvas.parentNode.querySelectorAll("canvas"));
      canvases.forEach((c) => {
        if (c !== activeCanvas && c.parentNode) {
          c.parentNode.removeChild(c);
        }
      });
    }

    // Re-add fresh scene instances to guarantee clean state
    const ensureScene = (key, ctor) => {
      if (!rootMgr.getScene(key)) {
        try {
          rootMgr.add(key, new ctor(), false);
        } catch (e) {
          console.error(`[goToMenu] failed to add ${key}`, e);
        }
      }
    };
    ensureScene("AssetLoaderScene", AssetLoaderScene);
    ensureScene("LoadingScreenScene", LoadingScreenScene);
    ensureScene("GameScene", GameScene);

    // Fully restart MenuScene to ensure it is active/visible
    let menu = rootMgr.getScene("MenuScene");
    const hasMenuKey = rootMgr.keys && rootMgr.keys["MenuScene"];
    if (!menu || !hasMenuKey) {
      try {
        const menuInstance = new MenuScene({ key: "MenuScene" });
        rootMgr.add("MenuScene", menuInstance, true);
        menu = rootMgr.getScene("MenuScene");
      } catch (e) {
        console.error("[goToMenu] failed to add MenuScene", e);
      }
    } else if (rootMgr.isActive("MenuScene") || rootMgr.isSleeping("MenuScene")) {
      rootMgr.stop("MenuScene");
      menu = null;
    }

    try {
      if (!rootMgr.isActive("MenuScene")) {
        rootMgr.start("MenuScene");
      }
    } catch (e) {
      console.error("[goToMenu] start MenuScene failed", e);
    }
    if (rootMgr.isActive("MenuScene")) {
      rootMgr.bringToTop("MenuScene");
      rootMgr.resume("MenuScene");
    }
    menu = rootMgr.getScene("MenuScene");
    if (menu && menu.scene) {
      menu.scene.setVisible(true);
      menu.scene.wake();
      if (typeof menu.setupKeyboardControls === "function") {
        menu.setupKeyboardControls();
      }
      if (menu.cameras && menu.cameras.main) {
        menu.cameras.main.visible = true;
      }
    }
  }

  startCredits(creditsDurationSec = null) {
    this.creditsActive = true;
    this.creditsTimer = 0;
    this.creditsTopoutLockActive = false;
    this.creditsSkipArmed = false;
    if (creditsDurationSec != null) {
      this.creditsDuration = creditsDurationSec;
    }
    // Allow continuous play/spawn during credits
    this.creditsGameplayEnabled = true;
    // Easy mode credits use hanabi bonuses during roll if configured
    this.creditsHanabi = false;
    const specialMechanics =
      (this.gameMode &&
        typeof this.gameMode.getConfig === "function" &&
        this.gameMode.getConfig()?.specialMechanics) ||
      {};
    if (specialMechanics.creditsHanabi) {
      this.creditsHanabi = true;
    }
    this.rollLinesCleared = 0;
    this.rollFailedDuringRoll = false;
    this.creditsFinalized = false;
    this.creditsBgmStarted = false;
    this.rollFadeLastExpireTime = 0;
    this.creditsRevealFinishPending = false;

    // Determine roll type based on mode flags
    this.rollType = null;
    if (this.gameMode) {
      if (this.gameMode.mRollStarted) {
        this.rollType = "mroll";
        this.invisibleStackActive = true;
        this.fadingRollActive = false;
      } else if (this.gameMode.fadingRollActive) {
        this.rollType = "fading";
        this.monochromeActive = false;
        this.bigBlocksActive = false;
      }
    }

    // Show roll bonus counter only for TGM3 credits roll
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const showRollBonus = modeIdLower === "tgm3" || modeIdLower === "tgm3_master";
    if (this.staffRollBonusText) {
      this.staffRollBonusText.setVisible(showRollBonus);
    }

    // Play completion sound if GM grade achieved
    if (this.grade === "GM") {
      this.playSfx("complete", 0.8);
    }

    const persistCurrentBgmIntoCredits =
      typeof this.shouldPersistCurrentBgmIntoCredits === "function" &&
      this.shouldPersistCurrentBgmIntoCredits();

    // Load credits BGM if available
    this.createCreditsBGM();

    // T.A.Death-style rolls keep the final gameplay track running into credits.
    if (!persistCurrentBgmIntoCredits) {
      this.stopCurrentBGM();
    }
  }

  beginPendingCreditsTransition() {
    if (!this.creditsPending || this.creditsActive) return;
    this.creditsPending = false;

    // Transition to credits roll: actually clear the board state (not just visual fade).
    this.currentPiece = null;
    this.isGrounded = false;
    this.lockDelay = 0;
    this.gravityAccum = 0;
    if (this.board) {
      if (typeof this.board.clearAll === "function") {
        this.board.clearAll();
      } else if (Array.isArray(this.board.grid)) {
        for (let r = 0; r < this.board.rows; r++) {
          this.board.grid[r] = Array(this.board.cols).fill(0);
          if (Array.isArray(this.board.fadeGrid) && this.board.fadeGrid[r]) {
            this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
          }
        }
      }
      if (typeof this.board.resetFadeState === "function") {
        this.board.resetFadeState();
      }
    }
    this.placedMinos = [];
    this.placedMinoRows = [];
    this.minoRowFadeAlpha = {};
    // Credits flow should not inherit topout GAME OVER timers.
    this.minoFadeReversed = false;
    this.fadingComplete = false;
    this.gameOverFadeDoneTime = null;
    this.showGameOverText = false;
    this.gameOverTextTimer = 0;
    this.gameOverSfxPlayed = true;
    this.creditsFinishPending = false;
    this.creditsFadeInDone = false;
    // Ensure we are not stuck in an old ARE state after fade completion.
    this.areActive = false;
    this.areTimer = 0;

    this.creditsActive = true;
    if (this.gameMode && typeof this.gameMode.onCreditsStart === "function") {
      this.gameMode.onCreditsStart(this);
    }
    this.startCredits();

    // Kick off the first credits piece explicitly; otherwise some paths can
    // enter credits with no active piece and no pending ARE spawn.
    if (!this.currentPiece && !this.gameOver) {
      const nowMs = this.time?.now ?? Date.now();
      const startedAtMs =
        typeof this.creditsTransitionStartTime === "number"
          ? this.creditsTransitionStartTime
          : nowMs;
      // Guarantee 3.0s from fade-start to first credits spawn.
      const spawnDelayMs = Math.max(0, 3000 - (nowMs - startedAtMs));
      if (this.time?.delayedCall) {
        this.time.delayedCall(spawnDelayMs, () => {
          if (!this.currentPiece && this.creditsActive && !this.minoFadeActive) {
            this.spawnPiece();
          }
        });
      } else if (typeof setTimeout === "function") {
        setTimeout(() => {
          if (!this.currentPiece && this.creditsActive && !this.minoFadeActive) {
            this.spawnPiece();
          }
        }, spawnDelayMs);
      } else if (this.creditsActive && !this.minoFadeActive) {
        this.spawnPiece();
      }
    }
  }

  setGradeLineColor(color) {
    this.gradeLineColor = color;
  }

  beginModeCreditsRoll(options = {}) {
    const { spawnFirstPiece = true } = options;
    if (this.creditsActive) {
      return;
    }

    this.pendingCreditsStart = null;
    this.pendingStaticEndScreen = null;

    if (this.gameMode && typeof this.gameMode.onCreditsStart === "function") {
      this.gameMode.onCreditsStart(this);
    }
    const modeCredits =
      this.gameMode && typeof this.gameMode.getConfig === "function"
        ? this.gameMode.getConfig()?.specialMechanics?.creditsDuration
        : undefined;
    this.startCredits(modeCredits != null ? modeCredits : undefined);

    if (
      spawnFirstPiece &&
      !this.currentPiece &&
      !this.minoFadeActive &&
      !this.creditsTopoutLockActive &&
      !this.gameOver
    ) {
      this.spawnPiece();
    }

    this.updateBGM();
  }

  finalizeCreditsRoll() {
    if (this.creditsFinalized) return;
    this.creditsFinalized = true;
    this.creditsActive = false;
    this.creditsTopoutLockActive = false;

    // Hide roll bonus counter once credits are done
    if (this.staffRollBonusText) {
      this.staffRollBonusText.setVisible(false);
    }

    // Stop credits BGM if still playing
    if (this.creditsBGM) {
      this.creditsBGM.stop();
      this.creditsBGM = null;
    }
    if (
      typeof this.shouldPersistCurrentBgmIntoCredits === "function" &&
      this.shouldPersistCurrentBgmIntoCredits()
    ) {
      this.stopCurrentBGM();
    }
    this.creditsBgmStarted = false;

    // Staff roll grading: add roll bonus based on roll performance
    if (typeof this.rollBonus === "number") {
      const rollFactor = this.rollType === "mroll" ? 1.0 : 0.5;
      this.rollBonus += (this.rollLinesCleared || 0) * rollFactor;
      // For TGM3 Master: feed roll bonus into grading system (displayed grade) instead of rollBonus accumulation
      const modeId =
        this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode;
      if (
        (modeId === "tgm3_master" || modeId === "tgm3") &&
        this.gameMode &&
        typeof this.gameMode.addStaffRollBonus === "function" &&
        typeof this.gameMode.addStaffRollLines === "function"
      ) {
        // Already processed incrementally during the roll; no need to batch here
      }
    }

    // Mode-specific credits end hook
    if (this.gameMode && typeof this.gameMode.onCreditsEnd === "function") {
      this.gameMode.onCreditsEnd(this);
    }

    // Show Hanabi summary after credits if available
    if (this.gameMode && this.gameMode.hanabi !== undefined) {
      this.showHanabiSummary(this.gameMode.hanabi);
    }

    // Grade line color: orange on successful roll clear, green on fail/topout
    if (this.rollFailedDuringRoll) {
      this.setGradeLineColor("green");
    } else {
      this.setGradeLineColor("orange");
    }

    // If invisible stack was active (M-roll) or fading roll was active, reveal the stack
    // with a row-by-row fade-in instead of showing it instantly.
    if (this.invisibleStackActive || this.fadingRollActive) {
      this.startMinoFadeIn();
      // Keep the stack visible after the fade-in completes by clearing the saved restoration values.
      this._fadingRollActiveBeforeTopout = undefined;
      this._invisibleStackActiveBeforeTopout = undefined;
      this.creditsFinishPending = true;
      return;
    }

    // Only call the mode finisher when the mode actually overrides BaseMode's noop.
    if (this.hasCustomCreditRollFinishHandler()) {
      this.gameMode.finishCreditRoll(this);
      return;
    }

    // Fallback: end the game normally
    this.showGameOverScreen();
  }

  hasCustomCreditRollFinishHandler() {
    if (!this.gameMode || typeof this.gameMode.finishCreditRoll !== "function") {
      return false;
    }

    let proto = Object.getPrototypeOf(this.gameMode);
    while (proto) {
      if (Object.prototype.hasOwnProperty.call(proto, "finishCreditRoll")) {
        if (
          typeof BaseMode !== "undefined" &&
          BaseMode.prototype &&
          typeof BaseMode.prototype.finishCreditRoll === "function"
        ) {
          return proto.finishCreditRoll !== BaseMode.prototype.finishCreditRoll;
        }
        return proto.constructor?.name !== "BaseMode";
      }
      proto = Object.getPrototypeOf(proto);
    }

    return false;
  }

  shouldContinueCreditsAfterTopout() {
    if (
      !this.creditsActive ||
      this.invisibleStackActive ||
      this.fadingRollActive ||
      this.creditsTopoutLockActive
    ) {
      return false;
    }

    return !!(
      this.gameMode &&
      typeof this.gameMode.shouldContinueCreditsAfterTopout === "function" &&
      this.gameMode.shouldContinueCreditsAfterTopout(this)
    );
  }

  continueCreditsAfterTopout() {
    this.currentPiece = null;
    this.isGrounded = false;
    this.lockDelay = 0;
    this.lockResetCount = 0;
    this.gravityAccum = 0;
    this.areActive = false;
    this.areTimer = 0;
    this.lineClearDelayActive = false;
    this.lineClearPhase = false;
    this.pendingLineAREDelay = 0;
    this.pendingCompleteSequence = false;
    this.creditsGameplayEnabled = false;
    this.creditsTopoutLockActive = true;
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftInRepeat = false;
    this.rightInRepeat = false;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.kKeyPressed = false;
    this.spaceKeyPressed = false;
    this.lKeyPressed = false;
    this.xKeyPressed = false;
  }

  trackPlacedMino(x, y, color) {
    // Add mino to tracking list for fading
    this.placedMinos.push({ x, y, color, faded: false });

    // Track rows that contain minos for row-by-row fading
    if (!this.placedMinoRows.includes(y)) {
      this.placedMinoRows.push(y);
    }
  }

  startMinoFading() {
    // Rebuild placed mino tracking from current board state to ensure all rows fade.
    this.placedMinos = [];
    this.placedMinoRows = [];
    this.fadingComplete = false;
    this.gameOverFadeDoneTime = null;
    for (let y = 0; y < this.board.rows; y++) {
      for (let x = 0; x < this.board.cols; x++) {
        const cell = this.board.grid[y][x];
        if (cell) {
          this.placedMinos.push({ x, y, color: cell, faded: false });
          if (!this.placedMinoRows.includes(y)) {
            this.placedMinoRows.push(y);
          }
        }
      }
    }
    // Include the active piece in fading, if present
    if (this.currentPiece && this.currentPiece.shape) {
      for (let r = 0; r < this.currentPiece.shape.length; r++) {
        for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
          if (this.currentPiece.shape[r][c]) {
            const x = this.currentPiece.x + c;
            const y = this.currentPiece.y + r;
            if (
              y >= 0 &&
              y < this.board.rows &&
              x >= 0 &&
              x < this.board.cols
            ) {
              this.board.grid[y][x] = this.currentPiece.color;
              this.placedMinos.push({ x, y, color: this.currentPiece.color, faded: false });
              if (!this.placedMinoRows.includes(y)) {
                this.placedMinoRows.push(y);
              }
            }
          }
        }
      }
    }

    this.minoFadeActive = true;
    this.minoFadeReversed = false;
    this.minoFadeProgress = 0;
    this.minoFadeTimer = 0;
    this.gameOverTextTimer = 0;
    this.showGameOverText = false;
    this.minoRowFadeAlpha = {};

    // Stop BGM immediately when game over and fading starts
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }

    // Sort rows from bottom to top for proper fading order
    this.placedMinoRows.sort((a, b) => b - a); // Descending order

    // Calculate fade timing to complete all rows in ~2 seconds total
    const rowCount = this.placedMinoRows.length;
    if (rowCount > 0) {
      this.minoFadePerRowDuration = 2 / rowCount;
    } else {
      this.minoFadePerRowDuration = 2;
    }
  }

  startMinoFadeIn() {
    // Rebuild placed mino tracking from current board state.
    this.placedMinos = [];
    this.placedMinoRows = [];
    this.fadingComplete = false;
    this.gameOverFadeDoneTime = null;
    for (let y = 0; y < this.board.rows; y++) {
      for (let x = 0; x < this.board.cols; x++) {
        const cell = this.board.grid[y][x];
        if (cell) {
          this.placedMinos.push({ x, y, color: cell, faded: false });
          if (!this.placedMinoRows.includes(y)) {
            this.placedMinoRows.push(y);
          }
        }
      }
    }
    // Include the active piece, if present.
    if (this.currentPiece && this.currentPiece.shape) {
      for (let r = 0; r < this.currentPiece.shape.length; r++) {
        for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
          if (this.currentPiece.shape[r][c]) {
            const x = this.currentPiece.x + c;
            const y = this.currentPiece.y + r;
            if (
              y >= 0 &&
              y < this.board.rows &&
              x >= 0 &&
              x < this.board.cols
            ) {
              this.board.grid[y][x] = this.currentPiece.color;
              this.placedMinos.push({ x, y, color: this.currentPiece.color, faded: false });
              if (!this.placedMinoRows.includes(y)) {
                this.placedMinoRows.push(y);
              }
            }
          }
        }
      }
    }

    this.minoFadeActive = true;
    this.minoFadeReversed = true;
    this.minoFadeProgress = 0;
    this.minoFadeTimer = 0;
    this.gameOverTextTimer = 0;
    this.showGameOverText = false;
    this.minoRowFadeAlpha = {};

    // Start all tracked rows at alpha 0 so they are invisible initially.
    for (const row of this.placedMinoRows) {
      this.minoRowFadeAlpha[row] = 0;
    }

    // Sort rows from bottom to top for proper reveal order.
    this.placedMinoRows.sort((a, b) => b - a);

    const rowCount = this.placedMinoRows.length;
    if (rowCount > 0) {
      this.minoFadePerRowDuration = 2 / rowCount;
    } else {
      this.minoFadePerRowDuration = 2;
    }

    // Temporarily disable roll visibility masks so the fade-in is visible.
    this._fadingRollActiveBeforeTopout = this.fadingRollActive;
    this.fadingRollActive = false;
    this._invisibleStackActiveBeforeTopout = this.invisibleStackActive;
    this.invisibleStackActive = false;
  }

  completeCreditsFadeReveal(callOnGameOver = false) {
    this.creditsFadeInDone = true;
    // Avoid re-running the default game over fade so the revealed stack stays visible.
    this.gameOver = true;
    this.gameOverTimer = 0;
    this.fadingComplete = true;
    this.gameOverFadeDoneTime = this.time.now;
    this.invisibleStackActive = false;
    this.fadingRollActive = false;
    this._fadingRollActiveBeforeTopout = undefined;
    this._invisibleStackActiveBeforeTopout = undefined;
    this.gameOverStatePrepared = true;

    if (this.board && this.board.fadeGrid) {
      for (let r = 0; r < this.board.rows; r++) {
        this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
      }
    }
    this.minoRowFadeAlpha = {};

    if (callOnGameOver && this.gameMode && this.gameMode.onGameOver) {
      this.gameMode.onGameOver(this);
    }
    if (this.hasCustomCreditRollFinishHandler()) {
      this.gameMode.finishCreditRoll(this);
    } else {
      this.showGameOverScreen();
    }
  }

  startLockFlash() {
    // Store the locked piece's color and position for the flash effect
    const flashColor = this.currentPiece ? this.currentPiece.color : 0xffffff;
    const stackAlpha = this.stackAlpha || 1;
    let activePieceAlpha = 1;
    if (this.isGrounded && this.lockDelay > 0) {
      const fadeFrac = Math.min(this.lockDelay / (this.lockDelayMax || 0.5), 1);
      activePieceAlpha = 1 - fadeFrac * 0.6;
    }

    // Build a cell-precise overlay so only occupied minos flash
    const bigBlocks = !!this.bigBlocksActive;
    const blockSize = bigBlocks ? this.cellSize * 2 : this.cellSize;
    const hiddenRows = Math.max(0, this.board.rows - this.visibleRows);

    // Create a temporary flash overlay covering only the mino cells
    const flashOverlay = this.add.graphics();
    const flashCells = [];

    if (this.currentPiece) {
      for (let r = 0; r < this.currentPiece.shape.length; r++) {
        for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
          if (!this.currentPiece.shape[r][c]) continue;
          const boardX = this.currentPiece.x + c;
          const boardY = this.currentPiece.y + r;
          const drawX = this.matrixOffsetX + boardX * this.cellSize;
          const drawY = this.matrixOffsetY + (boardY - hiddenRows) * this.cellSize;
          const renderX = bigBlocks ? drawX - this.cellSize / 2 : drawX;
          const renderY = bigBlocks ? drawY - this.cellSize / 2 : drawY;
          const left = renderX - blockSize / 2;
          const top = renderY - blockSize / 2;
          flashCells.push({ left, top });
        }
      }
    }

    // Render above board and independent of gameGroup clearing
    flashOverlay.setDepth(9999);

    const paintOverlay = (color, alpha) => {
      flashOverlay.clear();
      flashOverlay.fillStyle(color, alpha);
      for (let i = 0; i < flashCells.length; i++) {
        const cell = flashCells[i];
        flashOverlay.fillRect(cell.left, cell.top, blockSize, blockSize);
      }
    };

    // Fixed 3-frame lock animation:
    // frame 1: active piece opacity
    // frame 2: white
    // frame 3: stack opacity
    const frameMs = 1000 / BASE_FPS;
    paintOverlay(flashColor, activePieceAlpha);
    this.time.delayedCall(frameMs, () => {
      if (!flashOverlay || !flashOverlay.scene) return;
      paintOverlay(0xffffff, activePieceAlpha);
      this.time.delayedCall(frameMs, () => {
        if (!flashOverlay || !flashOverlay.scene) return;
        paintOverlay(flashColor, stackAlpha);
        this.time.delayedCall(frameMs, () => {
          if (flashOverlay && flashOverlay.scene) flashOverlay.destroy();
        });
      });
    });
  }

  saveBestScore() {
    if (this.leaderboardSaved) return;
    if (!this.selectedMode) return;
    if (typeof this.saveLeaderboardEntry !== "function") return;
    if ((this.startingLevel || 0) > 0) return;

    // For sprint modes, only save completed runs (40L/100L)
    if (
      (this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100") &&
      !this.sprintCompleted
    ) {
      return;
    }

    // Sakura: store best stage/time/completion from mode
    if (this.selectedMode === "tgm3_sakura" && this.gameMode) {
      const stage = this.gameMode.bestStageReached || 0;
      const completionRate = Number(((stage / 27) * 100).toFixed(1));
      const bestTimeSeconds = this.gameMode.bestTimeSeconds;
      const time =
        bestTimeSeconds === null || bestTimeSeconds === undefined
          ? "--:--.--"
          : this.formatTimeValue(bestTimeSeconds);
      const entry = { stage, completionRate, time };
      this.saveLeaderboardEntry(this.selectedMode, entry);
      this.leaderboardSaved = true;
      return;
    }

    // Fallback generic entry; mode-specific handlers should prefer saveLeaderboardEntry directly.
    const entry = {
      hanabi: this.gameMode && this.gameMode.hanabi !== undefined ? this.gameMode.hanabi : undefined,
      score: this.score,
      level: this.level,
      lines: this.lines,
      grade: this.grade,
      gradeLineColor: this.gradeLineColor || "none",
      time:
        this.currentTime !== undefined && this.currentTime !== null
          ? `${Math.floor(this.currentTime / 60)
              .toString()
              .padStart(2, "0")}:${Math.floor(this.currentTime % 60)
              .toString()
              .padStart(2, "0")}.${Math.floor((this.currentTime % 1) * 100)
              .toString()
              .padStart(2, "0")}`
          : undefined,
      pps: this.conventionalPPS != null ? Number(this.conventionalPPS.toFixed(2)) : undefined,
    };
    this.saveLeaderboardEntry(this.selectedMode, entry);
    this.leaderboardSaved = true;
  }

  getBestScore(mode) {
    const key = `bestScore_${mode}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    return { score: 0, level: 0, grade: "9", time: "--:--.--" };
  }

  checkAchievements() {
    if (typeof window.achievementSystem === "undefined") return;

    const modeId = this.gameMode && typeof this.gameMode.getModeId === "function"
      ? this.gameMode.getModeId()
      : this.selectedMode;

    const gameState = {
      grade: this.grade,
      level: this.level,
      time: this.currentTime,
      score: this.score,
      linesClearedInMRoll: this.linesClearedInMRoll || 0,
      creditsSurvived: this.creditsSurvived || false,
      mRollCleared: this.mRollCleared || false,
      hanabi: this.gameMode?.hanabi || 0,
      stagesCleared: this.stagesCleared || 0,
      modeCleared: this.modeCleared || false,
    };

    const newlyUnlocked = window.achievementSystem.checkAndUnlock(modeId, gameState);
    if (newlyUnlocked.length > 0) {
      console.log("Achievements unlocked:", newlyUnlocked);
    }
  }

  showStaticEndScreen(options = {}) {
    const {
      showTextImmediately = false,
      playGameOverSfx = false,
      preserveBoardVisible = false,
      autoExitDelay = 10,
    } = options;

    this.gameOver = true;
    this.gameOverTimer = 0;
    this.gameOverAutoExitDelay = Math.max(0, Number(autoExitDelay) || 10);
    this.currentPiece = null;
    this.isGrounded = false;
    this.lockDelay = 0;
    this.lockResetCount = 0;
    this.gravityAccum = 0;
    this.areActive = false;
    this.areTimer = 0;
    this.lineClearDelayActive = false;
    this.lineClearPhase = false;
    this.pendingLineAREDelay = 0;
    this.minoFadeActive = false;
    this.minoFadeReversed = false;
    this.fadingComplete = true;
    this.gameOverFadeDoneTime = this.time?.now ?? Date.now();
    this.gameOverStatePrepared = true;
    this.preserveBoardOnStaticEnd = preserveBoardVisible === true;
    this.pendingStaticEndScreen = null;
    this.pendingCreditsStart = null;
    this.creditsPending = false;
    this.creditsActive = false;
    this.creditsTopoutLockActive = false;
    this.creditsBgmStarted = false;
    this.showGameOverText = showTextImmediately;
    this.gameOverTextTimer = showTextImmediately ? this.gameOverTextDelay : 0;
    this.gameOverSfxPlayed = !playGameOverSfx;

    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftInRepeat = false;
    this.rightInRepeat = false;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.kKeyPressed = false;
    this.spaceKeyPressed = false;
    this.lKeyPressed = false;
    this.xKeyPressed = false;

    this.checkAchievements();

    if (this.gameMode && this.gameMode.hanabi !== undefined) {
      this.showHanabiSummary(this.gameMode.hanabi);
    }

    if (this.gameMode && this.gameMode.onGameOver) {
      this.gameMode.onGameOver(this);
    }
  }

  showGameOverScreen() {
    if (this.shouldContinueCreditsAfterTopout()) {
      this.continueCreditsAfterTopout();
      return;
    }

    // Zen: use custom recover-only flow (no GAME OVER text) and keep matrix visible
    if (this.isZenSandboxActive && this.isZenSandboxActive()) {
      try {
        console.log("[ZenTopout] showGameOverScreen zen path", {
          gameOver: this.gameOver,
          showText: this.showGameOverText,
          pending: this.zenTopoutPendingFinish,
          freeze: this.zenTopoutFreezeActive,
          cooldown: this.zenTopoutCooldown,
          suppressOnce: this.suppressGameOverOnce,
          goTextVisible: this.gameOverText?.visible,
          goTextAlpha: this.gameOverText?.alpha,
          boardRows: this.board?.rows,
        });
      } catch {}
      // Block gameplay input and ARE progression during topout delay
      this._zenSavedAREDelay = this.areDelay;
      this.areActive = true;
      this.areTimer = 0;
      this.areDelay = 9999; // large sentinel to prevent ARE completion
      this.lineClearDelayActive = false;
      this.lineClearPhase = false;
      this.pendingLineAREDelay = 0;
      // Drop any active piece to avoid repeated locks during the delay
      this.currentPiece = null;
      this.isGrounded = false;
      this.lockDelay = 0;
      this.lockResetCount = 0;
      this.gravityAccum = 0;
      this.gameOver = false;
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;
      this.suppressGameOverOnce = true;
      // Clear any invisibility/roll flags that could hide pieces
      this.invisibleStackActive = false;
      this.fadingRollActive = false;
      this.minoFadeActive = false;
      // Ensure any existing text is hidden
      if (this.gameOverText?.setVisible) this.gameOverText.setVisible(false);
      else if (this.gameOverText?.setAlpha) this.gameOverText.setAlpha(0);
      // Remove any lingering game over text objects from the scene
      try {
        if (this.gameGroup?.getChildren) {
          this.gameGroup.getChildren().forEach((child) => {
            if (
              child?.text &&
              (child.text === this.gameOverMessage || child.text === "GAME OVER")
            ) {
              child.destroy?.();
            }
          });
        }
      } catch {}
      try {
        console.log("[ZenTopout] hide gameOverText zen", {
          visible: this.gameOverText?.visible,
          alpha: this.gameOverText?.alpha,
        });
      } catch {}

      // Build fade data like default topout but skip the GAME OVER overlay
      try {
        this.placedMinos = [];
        this.placedMinoRows = [];
        this.minoRowFadeAlpha = {};
        this.fadingComplete = false;
        for (let r = 0; r < this.board.rows; r++) {
          for (let c = 0; c < this.board.cols; c++) {
            const cell = this.board.grid[r][c];
            if (cell) {
              this.placedMinos.push({ x: c, y: r, color: cell, faded: false });
              if (!this.placedMinoRows.includes(r)) this.placedMinoRows.push(r);
            }
          }
        }
        this.placedMinoRows.sort((a, b) => b - a);
        const rowCount = this.placedMinoRows.length;
        this.minoFadePerRowDuration = rowCount > 0 ? 2 / rowCount : 2;
        this.minoFadeActive = true;
        this.minoFadeProgress = 0;
        this.minoFadeTimer = 0;
        console.log("[ZenTopout] fade init zen", {
          placed: this.placedMinos.length,
          rows: this.placedMinoRows.slice(0, 5),
          rowCount,
        });
      } catch {}

      // Slow BGM similar to default topout
      try {
        const originalRate =
          this.currentBGM && typeof this.currentBGM.rate === "number" ? this.currentBGM.rate : 1;
        this._zenTopoutBgmRate = originalRate;
        if (this.currentBGM) {
          if (this.tweens?.add) {
            this.tweens.add({
              targets: this.currentBGM,
              rate: 0.25,
              duration: 2000,
              ease: "Linear",
            });
          } else if (this.currentBGM.setRate) {
            this.currentBGM.setRate(0.25);
          } else {
            this.currentBGM.rate = 0.25;
          }
        }
        console.log("[ZenTopout] bgm slow zen", {
          originalRate: this._zenTopoutBgmRate,
          hasBgm: !!this.currentBGM,
        });
      } catch {}

      const restoreBgmRate = () => {
        try {
          const rate = this._zenTopoutBgmRate || 1;
          if (this.tweens?.add && this.currentBGM) {
            this.tweens.add({
              targets: this.currentBGM,
              rate,
              duration: 300,
              ease: "Linear",
            });
          } else if (this.currentBGM?.setRate) {
            this.currentBGM.setRate(rate);
          } else if (this.currentBGM) {
            this.currentBGM.rate = rate;
          }
          this._zenTopoutBgmRate = null;
          console.log("[ZenTopout] bgm restore zen", { rate });
        } catch {}
      };

      // Clear stack and respawn without hiding the matrix or showing GAME OVER text
      const finalizeZenTopout = () => {
        try {
          if (this.board) {
            if (typeof this.board.clearAll === "function") {
              this.board.clearAll();
            } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
              for (let r = 0; r < this.board.rows; r++) {
                this.board.grid[r] = Array(this.board.cols).fill(0);
                this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
              }
            }
            this.ensureZenCheeseBaseline?.(0);
            // Ensure fade grid is fully reset to avoid invisible stack artifacts
            if (Array.isArray(this.board.fadeGrid)) {
              for (let r = 0; r < this.board.fadeGrid.length; r++) {
                this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
              }
            }
            if (typeof this.board.resetFadeState === "function") {
              this.board.resetFadeState();
            }
          }
          this.playSfx?.("fall");
          this.currentPiece = null;
          this.isGrounded = false;
          if (this.nextPieces.length < 6) this.generateNextPieces();
          // Ensure a fresh next queue entry exists before spawn to avoid empty texture/render issues
          if (this.nextPieces.length === 0) this.generateNextPieces();
          // Clear hold without affecting next queue
          this.holdPiece = null;
          this.canHold = true;
          this.holdRequest = false;
          // Reset render-suppression flags so the next piece draws
          this.suppressPieceRenderThisFrame = false;
          this.suppressPieceRenderNextFrame = false;
          this.skipGravityThisFrame = false;
          // Stop fade once clear completes
          this.minoFadeActive = false;
          this.fadingComplete = false;
          this.placedMinos = [];
          this.placedMinoRows = [];
          this.invisibleStackActive = false;
          this.fadingRollActive = false;
          console.log("[ZenTopout] finalize zen", {
            nextLen: this.nextPieces?.length,
            goTextVisible: this.gameOverText?.visible,
            goTextAlpha: this.gameOverText?.alpha,
            suppressRender: this.suppressPieceRenderThisFrame,
            suppressNext: this.suppressPieceRenderNextFrame,
            skipGravity: this.skipGravityThisFrame,
          });
          this.zenTopoutPendingFinish = false;
          this.zenTopoutFreezeActive = false;
          this.zenTopoutCooldown = false;
          this.zenTopoutFreezeStart = 0;
          // Restore ARE handling
          this.areDelay =
            this._zenSavedAREDelay !== undefined && this._zenSavedAREDelay !== null
              ? this._zenSavedAREDelay
              : this.areDelay;
          this._zenSavedAREDelay = null;
          this.areTimer = 0;
          this.areActive = false;
          restoreBgmRate();
          if (this.time?.delayedCall) {
            this.time.delayedCall(0, () => this.spawnPiece());
          } else if (typeof setTimeout === "function") {
            setTimeout(() => this.spawnPiece(), 0);
          } else {
            this.spawnPiece();
          }
        } catch (err) {
          try {
            console.error("[ZenTopout] finalize error (showGameOverScreen zen path)", err);
          } catch {}
          this.zenTopoutPendingFinish = false;
          this.zenTopoutFreezeActive = false;
          this.zenTopoutCooldown = false;
          restoreBgmRate();
        }
      };

      const doClear = () => {
        finalizeZenTopout();
      };

      // Drive the fade for 2s then clear
      if (this.time?.delayedCall) {
        console.log("[ZenTopout] schedule clear (delayedCall)");
        this.time.delayedCall(2000, doClear);
      } else if (typeof setTimeout === "function") {
        console.log("[ZenTopout] schedule clear (setTimeout)");
        setTimeout(doClear, 2000);
      } else {
        console.log("[ZenTopout] immediate clear (no timer)");
        doClear();
      }
      return;
    }

    // One-shot suppression (used by Zen recoveries that haven't activated freeze yet)
    if (this.suppressGameOverOnce) {
      this.suppressGameOverOnce = false;
      this.gameOver = false;
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;
      return;
    }

    this.stopAllBGMs?.();

    this.gameOverSfxPlayed = false;

    const wasCreditsActive = this.creditsActive;
    const creditsRollUsesHiddenStack =
      wasCreditsActive && (this.invisibleStackActive || this.fadingRollActive);
    if (wasCreditsActive) {
      this.rollFailedDuringRoll = true;
      // Topping out during credits is a fail: set to at least green line
      this.rollHighestLine = Math.max(this.rollHighestLine, 18);
      this.creditsActive = false;
      this.creditsFinalized = true;
      this.creditsTopoutLockActive = false;
      this.creditsBgmStarted = false;
      if (this.creditsBGM) {
        this.creditsBGM.stop();
        this.creditsBGM = null;
      }
      if (this.rollFailedDuringRoll) {
        this.setGradeLineColor("green");
      } else {
        this.setGradeLineColor("orange");
      }
    }
    this.gameOver = true;
    this.gameOverTimer = 0; // Start timer for 10 seconds
    if (!this.torikanFailActive && !this.preserveGameOverMessage) {
      this.gameOverMessage = this.sprintCompleted ? "CONGRATULATIONS" : "GAME OVER";
      this.gameOverSubMessage = "";
      this.gameOverMessageColor = null;
      this.gameOverSubMessageColor = null;
    }
    this.finesseActiveForPiece = false;

    // Check for achievements
    this.checkAchievements();

    // Show Hanabi summary if available
    if (this.gameMode && this.gameMode.hanabi !== undefined) {
      this.showHanabiSummary(this.gameMode.hanabi);
    }

    // Freeze section tracking so the losing section remains counted and displayed.
    if (
      this.sectionTimes &&
      typeof this.currentSection === "number" &&
      typeof this.sectionStartTime === "number" &&
      typeof this.sectionTimes[this.currentSection] !== "number"
    ) {
      this.sectionTimes[this.currentSection] = this.currentTime - this.sectionStartTime;
      if (this.sectionTetrises) {
        this.sectionTetrises[this.currentSection] = this.currentSectionTetrisCount;
      }
    }

    // Clear any held input state so pieces cannot keep moving during game over.
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftInRepeat = false;
    this.rightInRepeat = false;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.kKeyPressed = false;
    this.spaceKeyPressed = false;
    this.lKeyPressed = false;
    this.xKeyPressed = false;

    if (this.bgmLoopTimer) {
      this.bgmLoopTimer.remove(false);
      this.bgmLoopTimer = null;
    }

    // Stop any playing BGM (stage BGM or credits BGM)
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }
    if (this.creditsBGM) {
      this.creditsBGM.stop();
      this.creditsBGM = null;
    }

    // Stop stage BGM objects
    const stageBgms = [this.stage1BGM, this.stage2BGM];
    stageBgms.forEach((bgm) => {
      if (bgm) {
        if (bgm.isPlaying) {
          bgm.stop();
        }
        bgm.destroy();
      }
    });
    this.stage1BGM = null;
    this.stage2BGM = null;

    // Stop TGM2 BGM objects
    const tgm2Bgms = [
      this.tgm2_stage1,
      this.tgm2_stage2,
      this.tgm2_stage3,
      this.tgm2_stage4,
    ];
    tgm2Bgms.forEach((bgm) => {
      if (bgm) {
        if (bgm.isPlaying) {
          bgm.stop();
        }
        bgm.destroy();
      }
    });
    this.tgm2_stage1 = null;
    this.tgm2_stage2 = null;
    this.tgm2_stage3 = null;
    this.tgm2_stage4 = null;

    // Hidden/disappearing rolls reveal the stack on topout; visible-stack rolls fade out normally.
    if (this.creditsFadeInDone) {
      // Stack was already revealed via credits fade-in; keep it visible.
      this.fadingComplete = true;
      this.gameOverFadeDoneTime = this.time.now;
      // Ensure stack stays visible by explicitly disabling invisibility
      this.invisibleStackActive = false;
      this.fadingRollActive = false;
    } else if (creditsRollUsesHiddenStack) {
      this.creditsRevealFinishPending = true;
      this.startMinoFadeIn();
      this._fadingRollActiveBeforeTopout = undefined;
      this._invisibleStackActiveBeforeTopout = undefined;
    } else {
      this.startMinoFading();
    }

    // Handle game over in game mode (for TGM2, powerup minos, etc.)
    if (this.gameMode && this.gameMode.onGameOver) {
      this.gameMode.onGameOver(this);
    }
  }

  showHanabiSummary(hanabiValue) {
    const text = `Hanabi: ${hanabiValue}`;
    if (this.hanabiText && this.hanabiText.destroy) {
      this.hanabiText.destroy();
    }
    this.hanabiText = this.add
      .text(
        this.borderOffsetX + this.playfieldWidth / 2,
        this.borderOffsetY + this.playfieldHeight + 80,
        text,
        {
          fontSize: "24px",
          fill: "#ffff88",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "center",
        },
      )
      .setOrigin(0.5, 0);
  }

  drawCreditsScreen() {
    // Don't draw credits if game is paused
    if (this.isPaused) {
      return;
    }

    // Create scrolling credits text behind the tetrominos (under the matrix)
    const creditsLayout = [
      { text: "MINO FREEFALL Pre-beta", type: "title" },
      { text: "WORK IN PROGRESS", type: "title"},
      { text: "", type: "spacer" },
      { text: "Created by", type: "section" },
      { text:"The Colorbleed Neon team", type: "content"},
      { text: "Neneko, the one and only", type:"content"},
      { text: "member of the team", type:"content"},
      { text: "", type: "spacer" },
      { text: "Special Thanks", type: "section" },
      { text: "Caithness", type: "content" },
      { text: "switchpalacecorner A.K.A spc", type: "content" },
      { text: "EdenGT", type: "content" },
      { text: "colour_thief", type: "content" },
      { text: "ItzBlack", type: "content" },
      { text: "Shard Nguyen", type: "content" },
      { text: "Vz61", type: "content" },
      { text: "And everyone from the", type: "content" },
      { text: "THEABSOLUTE.PLUS Discord server", type: "content" },
      { text: "", type: "spacer" },
      { text: "As well as", type: "section" },
      { text: "Friends & Family", type: "content" },
      { text: "LumiBach, the ICT teacher", type: "content" },
      { text: "", type: "spacer" },
      { text: "Music & Sound", type: "section" },
      { text: "Taken from Texmaster", type: "content" },
      { text: "and various games", type: "content" },
      { text: "BGM", type: "section" },
      { text: "Interstellar Pack", type: "content" },
      { text: "by DavidKBD", type: "content" }, 
      { text: "Original BGMs", type: "content" },
      { text: "is coming soon", type: "content" },
      { text: "", type: "spacer" },
      { text: "Inspired by", type: "section" },
      { text: "Tetris: The Grand Master Series", type: "content" },
      { text: "Texmaster 2009", type: "content" },
      { text: "TETR.IO", type: "content" },
      { text: "", type: "spacer" },
      { text: "Technical Implementation", type: "section" },
      { text: "Phaser 3 Game Framework", type: "content" },
      { text: "from phaser.io", type: "content" },
      { text: "TGM mechanics", type: "content" },
      { text: "12 hours of coding a day", type: "content" },
      { text: "", type: "spacer" },
      { text: "Piece Randomizer", type: "section" },
      { text: "TGM History Checking System", type: "content" },
      { text: "Also called IRM", type: "content" },
      { text: "", type: "spacer" },
      { text: "7-bag system", type: "content" },
      { text: "The one you know and love", type: "content" },
      { text: "", type: "spacer" },
      { text: "If you have made it this far", type: "closing" },
      { text: "You are pretty good at this game", type: "closing" },
      { text: "", type: "spacer" },
      { text: "Thank you for playing!", type: "closing" },
      { text: "-- Created by Colorbleed Neon --", type: "closing" },
    ];

    // Per-type styling to keep layout modifiable
    const extraLineSpacing = 75;
    const lineStyles = {
      title: { fontSize: 36, color: "#ffff00", lineHeight: 44 },
      section: { fontSize: 24, color: "#00ffff", lineHeight: 34 },
      content: { fontSize: 20, color: "#ffffff", lineHeight: 30 },
      closing: { fontSize: 22, color: "#ff00ff", lineHeight: 32 },
      spacer: { fontSize: 20, color: "#ffffff", lineHeight: 20 },
    };

    // Build positioned lines so we can preserve order (including spacers)
    const lines = creditsLayout.map((entry) => {
      const style = lineStyles[entry.type] || lineStyles.content;
      return {
        ...entry,
        style,
        height: style.lineHeight + extraLineSpacing,
      };
    });

    const visibleMatrixHeight = this.cellSize * this.visibleRows; // Height of visible matrix area
    const totalCreditsHeight = lines.reduce((sum, line) => sum + line.height, 0);
    const matrixBottomY = this.borderOffsetY + this.playfieldHeight;
    const matrixTopY = this.borderOffsetY;
    const centerX =
      this.matrixOffsetX + (this.cellSize * this.board.cols) / 2 - 5; // Center horizontally over matrix, shifted 5px left

    // Start just below the matrix so the first line scrolls in immediately
    const firstLineHeight = lines[0]?.height || 30;
    const startGap = 8; // small gap so first line begins offscreen
    const creditsStartY = matrixBottomY + firstLineHeight / 2 + startGap;

    // Compute total distance so the last line fully clears the top exactly at creditsDuration
    let cumulative = 0;
    const lastIndex = lines.length - 1;
    const lastLineHeight = lines[lastIndex]?.height || 30;
    const lastLineCenterOffset =
      lines.reduce((acc, line, idx) => {
        const offset = acc.offset + line.height / 2;
        acc.positions.push(offset);
        acc.offset += line.height;
        return acc;
      }, { offset: 0, positions: [] }).positions[lastIndex] || 0;

    const totalScrollDistance =
      creditsStartY + lastLineCenterOffset + lastLineHeight / 2 - matrixTopY;
    this.creditsScrollSpeed = totalScrollDistance / this.creditsDuration; // pixels per second

    // Clamp to duration so we don't loop; end position aligns with creditsDuration
    const scrollProgress =
      Math.min(this.creditsTimer, this.creditsDuration) *
      this.creditsScrollSpeed;

    // Draw lines in order; keep spacing by using cumulative offsets
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineCenterOffset = cumulative + line.height / 2;
      const y = creditsStartY - scrollProgress + lineCenterOffset;
      cumulative += line.height;

      // Only draw if within or overlapping the matrix area
      if (y + line.height / 2 < matrixTopY || y - line.height / 2 > matrixBottomY) {
        continue;
      }

      const { fontSize, color } = line.style;
      const textObj = this.add
        .text(centerX, y, line.text, {
          fontSize: `${fontSize}px`,
          fill: color,
          stroke: "#000000",
          strokeThickness: 2,
          fontFamily: "Courier New",
          fontStyle: "bold",
          wordWrap: { width: this.cellSize * this.board.cols - 30 },
          align: "center",
        })
        .setOrigin(0.5);
      this.gameGroup.add(textObj);
    }
  }

  drawLevelBar() {
    // If Zen display mode is "none", hide level/lines UI entirely
    if (this.isZenSandboxActive && this.isZenSandboxActive()) {
      const mode = (this.zenSandboxConfig?.displayMode || "").toLowerCase();
      if (mode === "none") {
        [
          this.levelLabel,
          this.levelDisplayLabel,
          this.levelDisplayText,
          this.currentLevelText,
          this.capLevelText,
          this.levelBar,
        ]
          .filter(Boolean)
          .forEach((el) => {
            el.setVisible(false);
            if (el.clear) el.clear();
          });
        return;
      }
    }

    const uiX = Math.max(20, this.borderOffsetX - 200) + 50;
    const levelBottomY = this.borderOffsetY + this.playfieldHeight - 60;
    const levelRowHeight = 20; // Decreased spacing
    const rightX = uiX + 120;
    const currentLevelX = rightX + 17;
    const levelFontSize = Math.max(
      24,
      Math.min(36, Math.floor(this.cellSize * 1.0)),
    ); // Increased font

    // Determine mode types
    const isMarathonMode = this.selectedMode === "marathon";
    const isUltraMode = this.selectedMode === "ultra";
    const isZenMode = this.selectedMode === "zen";
    const isSprintMode =
      this.selectedMode &&
      (this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100");
    const isLineCountMode = isMarathonMode || isUltraMode || isZenMode || isSprintMode;
    const hideGravityBarAndSectionCap = this.shouldHideGravityBarAndSectionCap();

    if (this.currentLevelText && !this.currentLevelText.scene) {
      this.currentLevelText = null;
    }
    if (this.capLevelText && !this.capLevelText.scene) {
      this.capLevelText = null;
    }
    if (this.levelBar && !this.levelBar.scene) {
      this.levelBar = null;
    }
    if (this.levelDisplayText && !this.levelDisplayText.scene) {
      this.levelDisplayText = null;
    }
    if (this.levelDisplayLabel && !this.levelDisplayLabel.scene) {
      this.levelDisplayLabel = null;
    }

    // For Marathon mode, update separate level display
    if (isMarathonMode && this.levelDisplayText) {
      this.levelDisplayText.setPosition(uiX + 140, levelBottomY - 4 * levelRowHeight - 83);
      this.levelDisplayText.setStyle({ fontSize: `${levelFontSize}px` });
      this.levelDisplayText.setText((this.level + 1).toString());
    }

    // For Zen/Ultra modes, only show lines cleared, no level bar or cap
    if (isZenMode || isUltraMode) {
      // Current lines - top row
      const currentY = levelBottomY - 3 * levelRowHeight;
      const currentLinesText = this.totalLines.toString();
      if (!this.currentLevelText) {
        this.currentLevelText = this.add
          .text(currentLevelX, currentY - 30, currentLinesText, {
            fontSize: `${levelFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "right",
          })
          .setOrigin(1, 0);
      } else {
        this.currentLevelText.setPosition(currentLevelX, currentY - 30);
        this.currentLevelText.setStyle({ fontSize: `${levelFontSize}px` });
        this.currentLevelText.setText(currentLinesText);
      }
      return; // Don't draw bar or cap for Zen mode
    }

    // Calculate section cap based on mode
    let sectionCap;
    if (isMarathonMode) {
      // Marathon: next multiple of 10 above current lines
      sectionCap = Math.ceil((this.totalLines + 1) / 10) * 10;
    } else if (isSprintMode) {
      // Sprint: 40 for sprint_40, 100 for sprint_100
      sectionCap = this.selectedMode === "sprint_40" ? 40 : 100;
    } else {
      // TGM modes: default section calculation
      const rawMaxLevel =
        this.gameMode && typeof this.gameMode.getDisplayLevelCap === "function"
          ? this.gameMode.getDisplayLevelCap()
          : this.gameMode
            ? this.gameMode.getGravityLevelCap()
            : 999;
      const maxLevel = Number.isFinite(rawMaxLevel) ? rawMaxLevel : 999;
      const section = Math.floor(this.level / 100);
      if (maxLevel === 300) {
        // TGM2 Normal: always show 300 as the cap
        sectionCap = 300;
      } else {
        sectionCap = Math.min((section + 1) * 100, maxLevel);
      }
    }

    // Current level/lines - top row
    const currentY = levelBottomY - 3 * levelRowHeight;
    const currentValue =
      isLineCountMode ? this.totalLines.toString() : this.level.toString();
    if (!this.currentLevelText) {
      this.currentLevelText = this.add
        .text(currentLevelX, currentY - 30, currentValue, {
          fontSize: `${levelFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "right",
        })
        .setOrigin(1, 0);
    } else {
      this.currentLevelText.setPosition(currentLevelX, currentY - 30);
      this.currentLevelText.setStyle({ fontSize: `${levelFontSize}px` });
      this.currentLevelText.setText(currentValue);
    }
    this.currentLevelText.setVisible(true);

    if (hideGravityBarAndSectionCap) {
      if (this.levelBar) {
        this.levelBar.clear();
        this.levelBar.setVisible(false);
      }
      if (this.capLevelText) {
        this.capLevelText.setVisible(false);
      }
      return;
    }

    // Bar - middle row, white background with red fill
    {
      const barY = levelBottomY - 2 * levelRowHeight;
      const barWidth = 60;
      const barHeight = 4;
      const barX = rightX - barWidth;
      const internalGravity = this.getTGMGravitySpeed(this.level);
      // Green bar: percentage of sub-1G gravity (0–256)
      const greenRatio = Math.min(internalGravity / 256, 1);
      // Red overlay: gravity beyond 1G, scaled up to 10G (2560)
      const redRatio =
        internalGravity > 256
          ? Math.min((internalGravity - 256) / (2560 - 256), 1)
          : 0;

      if (!this.levelBar) {
        this.levelBar = this.add.graphics();
      }
      this.levelBar.setVisible(true);
      this.levelBar.clear();
      // White background
      this.levelBar.fillStyle(0xffffff);
      this.levelBar.fillRect(barX + 14, barY - 15, barWidth, barHeight);
      // Green fill for sub-1G portion
      this.levelBar.fillStyle(0x00ff00);
      this.levelBar.fillRect(
        barX + 14,
        barY - 15,
        barWidth * greenRatio,
        barHeight,
      );
      // Red overlay for gravity beyond 1G
      if (redRatio > 0) {
        this.levelBar.fillStyle(0xff0000);
        this.levelBar.fillRect(
          barX + 14,
          barY - 15,
          barWidth * redRatio,
          barHeight,
        );
      }
    }

    // Cap level - bottom row
    const capY = levelBottomY - levelRowHeight;
    const capText = sectionCap.toString();
    if (!this.capLevelText) {
      this.capLevelText = this.add
        .text(currentLevelX, capY - 25, capText, {
          fontSize: `${levelFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "right",
        })
        .setOrigin(1, 0);
    } else {
      this.capLevelText.setPosition(currentLevelX, capY - 25);
      this.capLevelText.setStyle({ fontSize: `${levelFontSize}px` });
      this.capLevelText.setText(capText);
    }
    this.capLevelText.setVisible(true);
  }

  draw() {
    // Check if mode uses grading
    const hasGrading = this.modeUsesGrading();

    // Capture and immediately clear one-frame render suppression so it never persists
    const suppressRender = this.suppressPieceRenderThisFrame;
    this.suppressPieceRenderThisFrame = false;
    this.gameGroup.clear(true, true);
    this.playfieldBorder = null;

    // Show loading text during loading phase
    if (this.loadingPhase) {
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
      const loadingText = this.add
        .text(centerX, centerY, "LOADING...", {
          fontSize: "48px",
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.gameGroup.add(loadingText);
      return; // Don't draw anything else during loading
    }

    // Draw credits screen first (behind everything)
    if (this.creditsActive) {
      this.drawCreditsScreen();
    }

    // Draw matrix and border during ready-go and after
    if (this.readyGoPhase || this.gameStarted) {
      // Border adjusted to fit exactly 10x20 with smaller width and height
      // Use mode type color for border
      const modeTypeColor = this.getModeTypeBorderColor();
      this.playfieldBorder = this.add.graphics();
      this.playfieldBorder.lineStyle(3, modeTypeColor);
      this.playfieldBorder.strokeRect(
        this.borderOffsetX - 4,
        this.borderOffsetY - 3,
        this.cellSize * this.board.cols + 4,
        this.cellSize * this.visibleRows + 5,
      ); // Height reduced by 1px, width expanded 1px left
      this.gameGroup.add(this.playfieldBorder);

      // Draw game elements using matrix offset (skip during game over after fading)
      // During game over fading, keep drawing the stack so row-by-row alpha can be applied.
      // Also keep drawing after a credits fade-in so the revealed stack stays visible.
      if (
        this.gameStarted &&
        (!this.gameOver ||
          this.minoFadeActive ||
          this.creditsFadeInDone ||
          this.preserveBoardOnStaticEnd) &&
        (!this.fadingComplete || this.creditsFadeInDone || this.preserveBoardOnStaticEnd)
      ) {
        if (
          typeof KonohaIllustrationSystem !== "undefined" &&
          typeof KonohaIllustrationSystem.drawMatrixIllustration === "function"
        ) {
          KonohaIllustrationSystem.drawMatrixIllustration(this);
        }
        this.board.draw(
          this,
          this.matrixOffsetX,
          this.matrixOffsetY,
          this.cellSize,
        );
        if (this.selectedMode === "tgm4_rounds" && this.tgm4MasterState?.pikiiActive) {
          const frozenStartRow = Math.max(
            2,
            Number.isInteger(this.tgm4MasterState?.pikiiStartRow)
              ? this.tgm4MasterState.pikiiStartRow
              : this.board.rows - 10,
          );
          const overlayY = this.matrixOffsetY + (frozenStartRow - 2) * this.cellSize - this.cellSize / 2;
          const overlayHeight = (this.board.rows - frozenStartRow) * this.cellSize;
          if (overlayHeight > 0) {
            const frozenOverlay = this.add.graphics();
            frozenOverlay.fillStyle(0xffffff, 0.12);
            frozenOverlay.fillRect(
              this.matrixOffsetX - this.cellSize / 2,
              overlayY,
              this.board.cols * this.cellSize,
              overlayHeight,
            );
            frozenOverlay.lineStyle(2, 0xffffff, 0.45);
            frozenOverlay.strokeRect(
              this.matrixOffsetX - this.cellSize / 2,
              overlayY,
              this.board.cols * this.cellSize,
              overlayHeight,
            );
            this.gameGroup.add(frozenOverlay);
          }
        }
      }
    }

    const hiddenRows = Math.max(0, this.board.rows - this.visibleRows);

    // Draw line clear animation if active
    if (this.isClearingLines && this.clearedLines.length > 0) {
      // Calculate fading alpha based on progress through line clear ARE
      const fadeProgress = this.areTimer / this.areDelay; // 0 to 1
      const fadeAlpha = Math.max(0.2, 1.0 - fadeProgress); // Fade from 1.0 to 0.2

      // Draw cleared lines with fading effect, respecting stack dimming
      for (const lineRow of this.clearedLines) {
        for (let col = 0; col < this.board.cols; col++) {
          const textureKey =
            this.rotationSystem === "ARS" ? "mino_ars" : "mino_srs";
          const texture = this.textures ? this.textures.get(textureKey) : null;
          const textureSource = texture && texture.source ? texture.source[0] : null;
          const hasValidTextureSource =
            !!texture && !!textureSource && !!textureSource.image;

          // Apply stack dimming to cleared cells so brightness is consistent
          const cellAlpha = fadeAlpha * (this.stackAlpha || 1);

          if (hasValidTextureSource) {
            const sprite = this.add.sprite(
              this.matrixOffsetX + col * this.cellSize,
              this.matrixOffsetY + (lineRow - hiddenRows) * this.cellSize,
              textureKey,
            );
            sprite.setDisplaySize(this.cellSize, this.cellSize);
            sprite.setTint(0xffffff); // White for cleared lines
            sprite.setAlpha(cellAlpha);
            this.gameGroup.add(sprite);
          } else {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff, cellAlpha);
            graphics.fillRect(
              this.matrixOffsetX + col * this.cellSize - this.cellSize / 2,
              this.matrixOffsetY + (lineRow - hiddenRows) * this.cellSize -
                this.cellSize / 2,
              this.cellSize,
              this.cellSize,
            );
            this.gameGroup.add(graphics);
          }
        }
      }
    }

    if (this.backstepAnimationPiece) {
      const progress = Math.min(
        1,
        this.backstepAnimationTimer / (this.backstepAnimationDuration || 1),
      );
      const animationAlpha = 1 - progress * 0.45;
      this.backstepAnimationPiece.draw(
        this,
        this.matrixOffsetX,
        this.matrixOffsetY,
        this.cellSize,
        false,
        animationAlpha,
        true,
        { minimumBoardY: Number.NEGATIVE_INFINITY },
      );
    }
    // Draw current/ghost only during active play; during game over fading we already merged the active piece into the board
    if (
      this.currentPiece &&
      !this.gameOver &&
      !this.minoFadeActive &&
      !this.fadingComplete &&
      !suppressRender
    ) {
      // Ghost piece: always visible in Easy/Normal modes, only 0-100 in other modes
      if (this.isNormalOrEasyMode() || this.level <= 100) {
        const ghost = this.currentPiece.getGhostPosition(this.board);
        ghost.draw(
          this,
          this.matrixOffsetX,
          this.matrixOffsetY,
          this.cellSize,
          true,
          1,
          true,
          { minimumBoardY: Number.NEGATIVE_INFINITY },
        );
      }

      // Calculate alpha for lock delay fade effect
      let pieceAlpha = 1;
      if (this.isGrounded && this.lockDelay > 0) {
        // Fade from 100% to 40% over the configured lock delay window
        const fadeFrac = Math.min(this.lockDelay / (this.lockDelayMax || 0.5), 1);
        pieceAlpha = 1 - fadeFrac * 0.6;
      }

      this.currentPiece.draw(
        this,
        this.matrixOffsetX,
        this.matrixOffsetY,
        this.cellSize,
        false,
        pieceAlpha,
        true,
        { minimumBoardY: Number.NEGATIVE_INFINITY },
      );

      // Blinking yellow border around active piece
      const blinkAlpha = 0.5 + 0.5 * Math.sin(this.time.now * 0.02);
      const bigBlocks = !!this.bigBlocksActive;
      const outlineCellSize = bigBlocks ? this.cellSize * 2 : this.cellSize;
      for (let r = 0; r < this.currentPiece.shape.length; r++) {
        for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
          if (!this.currentPiece.shape[r][c]) continue;
          const pieceY = this.currentPiece.y + r;
          const drawX = this.matrixOffsetX + (this.currentPiece.x + c) * this.cellSize;
          const drawY = this.matrixOffsetY + (pieceY - hiddenRows) * this.cellSize;
          const renderX = bigBlocks ? drawX - this.cellSize / 2 : drawX;
          const renderY = bigBlocks ? drawY - this.cellSize / 2 : drawY;
          const outline = this.add.graphics();
          outline.lineStyle(2, 0xffff00, blinkAlpha);
          outline.strokeRect(
            renderX - outlineCellSize / 2,
            renderY - outlineCellSize / 2,
            outlineCellSize,
            outlineCellSize,
          );
          this.gameGroup.add(outline);
        }
      }
    }

    // Update UI
    this.scoreText.setText(this.score.toString());
    if (this.scorePerPieceText) {
      const piecesForScore = Math.max(1, this.totalPiecesPlaced || 0);
      const scorePerPiece = this.score / piecesForScore;
      this.scorePerPieceText.setText(scorePerPiece.toFixed(2));
    }

    // Update grade display only for modes that use grading (freeze during credits)
    if (hasGrading && !this.creditsActive) {
      const fetchedGrade =
        this.gameMode && typeof this.gameMode.getDisplayedGrade === "function"
          ? this.gameMode.getDisplayedGrade()
          : null;
      const tgm3Grade =
        this.gameMode && this.gameMode.tgm3Grading && typeof this.gameMode.tgm3Grading.getDisplayedGrade === "function"
          ? this.gameMode.tgm3Grading.getDisplayedGrade()
          : null;
      const gradeToShow =
        (typeof fetchedGrade === "string" && fetchedGrade.trim() !== "" && fetchedGrade) ||
        (typeof tgm3Grade === "string" && tgm3Grade.trim() !== "" && tgm3Grade) ||
        (this.grade && this.grade) ||
        (this.initialGradeBaseline ?? "9");
      this.grade = gradeToShow;
      if (this.gradeText) {
        this.gradeText.setText(gradeToShow);
      }
      if (this.gradePointsText) {
        const gradePoints =
          (this.gameMode && typeof this.gameMode.getGradePoints === "function"
            ? this.gameMode.getGradePoints()
            : null) ??
          (this.gameMode &&
            this.gameMode.tgm3Grading &&
            typeof this.gameMode.tgm3Grading.getGradePoints === "function"
            ? this.gameMode.tgm3Grading.getGradePoints()
            : this.gameMode &&
                this.gameMode.tgm3Grading &&
                typeof this.gameMode.tgm3Grading.gradePoints !== "undefined"
              ? this.gameMode.tgm3Grading.gradePoints
              : null);
        const gpVal = gradePoints != null ? gradePoints.toString() : "0";
        this.gradePointsText.setText(gpVal);
      }

      if (this.nextGradeText && this.shouldShowNextGradeText) {
        this.updateNextGradeText();
      } else if (this.nextGradeText) {
        this.nextGradeText.setVisible(false);
      }

      // TAP-style internal grade (TGM2 mapping, no COOL bonuses)
      if (
        this.tapInternalGradeText &&
        this.gameMode &&
        this.gameMode.tgm3Grading &&
        typeof this.gameMode.tgm3Grading.getBaseDisplayedGrade === "function"
      ) {
        const tapGrade = this.gameMode.tgm3Grading.getBaseDisplayedGrade();
        this.tapInternalGradeText.setText(`TAP GRADE: ${tapGrade ?? "--"}`);
        this.tapInternalGradeText.setVisible(true);
      } else if (this.tapInternalGradeText) {
        this.tapInternalGradeText.setVisible(false);
      }

      this.updateGradeUIVisibility();
    }

    // Update piece per second displays
    this.ppsText.setText(this.conventionalPPS.toFixed(2));
    this.rawPpsText.setText(this.rawPPS.toFixed(2));
    if (Array.isArray(this.roundsMedalTexts) && this.roundsMedalTexts.length > 0) {
      const medals = this.tgm4MasterState?.medals || this.gameMode?.medals || {};
      const medalValues = [
        medals.bravo || 0,
        medals.tetris || 0,
        medals.tspin || 0,
        medals.pikii || 0,
      ];
      this.roundsMedalTexts.forEach((text, index) => {
        if (text) text.setText(`${medalValues[index] ?? 0}`);
      });
    }
    if (this.bravoCountText) {
      const modeId =
        this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode;
      const isKonohaMode =
        typeof modeId === "string" &&
        (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"));
      if (isKonohaMode) {
        const bravoCount =
          this.gameMode && typeof this.gameMode.bravoCount === "number"
            ? this.gameMode.bravoCount
            : typeof this.bravoCount === "number"
              ? this.bravoCount
              : 0;
        this.bravoCountText.setText(bravoCount.toString());
      }
    }
    if (this.asukaKitaText) {
      const modeId = this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
      if (typeof modeId === "string" && (modeId.startsWith("tgm4_konoha") || modeId.startsWith("konoha_"))) {
        const status = this.gameMode?.minosaStatus || this.minosaStatus || "possible";
        const iconByStatus = {
          achieved: "🦊✓",
          possible: "🦊",
          impossible: "🦊✕",
        };
        const colorByStatus = {
          achieved: "#88ff88",
          possible: "#ffff88",
          impossible: "#ff8888",
        };
        const hint = this.gameMode?.minosaHint || this.minosaHint || null;
        const path =
          this.gameMode?.minosaPath || this.minosaPath || [];
        const pieceBudget =
          this.gameMode?.minosaPieceBudget || this.minosaPieceBudget || 0;
        const hintSuffix =
          status === "possible" && hint?.usedHold && hint?.piece
            ? ` ${hint.source === "hold" ? "H" : "N"}:${hint.piece}`
            : "";
        const remainingSuffix =
          status === "possible" &&
          Array.isArray(path) &&
          path.length > 0 &&
          pieceBudget > 0
            ? ` ${path.length}/${pieceBudget}`
            : "";
        this.asukaKitaText.setText(`${iconByStatus[status] || iconByStatus.impossible}${hintSuffix}${remainingSuffix}`);
        this.asukaKitaText.setColor(colorByStatus[status] || colorByStatus.impossible);
      } else {
        const kitaCount =
          this.gameMode && typeof this.gameMode.kitas === "number"
            ? this.gameMode.kitas
            : this.kitas || 0;
        const isAsukaMode =
          typeof modeId === "string" &&
          (modeId.startsWith("tgm4_asuka") || modeId.startsWith("asuka_"));
        const kitaDisplayText =
          isAsukaMode && kitaCount > 0 ? `🦊x${kitaCount}` : kitaCount.toString();
        this.asukaKitaText.setText(kitaDisplayText);
        this.asukaKitaText.setColor("#ffff88");
      }
    }
    if (
      this.ppsGraphGraphics &&
      this.ppsGraphArea &&
      this.selectedMode &&
      (this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100")
    ) {
      this.drawSprintPpsGraph();
    }

    // Draw level bar
    this.drawLevelBar();

    // Format and display time
    const isUltraMode = this.selectedMode === "ultra";
    let timeToDisplay = this.currentTime;

    if (this.gameMode && typeof this.gameMode.getDisplayedTime === "function") {
      const modeTime = this.gameMode.getDisplayedTime(this);
      if (typeof modeTime === "number" && Number.isFinite(modeTime)) {
        timeToDisplay = Math.max(0, modeTime);
      }
    } else if (isUltraMode) {
      const timeLimit =
        this.gameMode && this.gameMode.timeLimit ? this.gameMode.timeLimit : 120;
      const elapsedActiveTime =
        this.gameMode && typeof this.gameMode.elapsedActiveTime === "number"
          ? this.gameMode.elapsedActiveTime
          : this.currentTime;
      timeToDisplay = Math.max(0, timeLimit - elapsedActiveTime);
    }

    const minutes = Math.floor(timeToDisplay / 60);
    const seconds = Math.floor(timeToDisplay % 60);
    const centiseconds = Math.floor((timeToDisplay % 1) * 100);
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;

    if (this.timeText) {
      this.timeText.setText(timeString);
    } else {
    }

    if (
      this.sectionTrackerGroup &&
      this.sectionTimeTexts &&
      this.sectionTotalTexts &&
      this.sectionSectionLabels
    ) {
      const modeId =
        this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode;
      const isTgm3Mode = typeof modeId === "string" && modeId.startsWith("tgm3") && modeId !== "tgm3_easy";
      const isTgm2Normal = modeId === "tgm2_normal";
      const isMarathonMode = this.selectedMode === "marathon";
      const maxLevel =
        this.gameMode && typeof this.gameMode.getGravityLevelCap === "function"
          ? (typeof this.gameMode.getDisplayLevelCap === "function"
              ? this.gameMode.getDisplayLevelCap()
              : this.gameMode.getGravityLevelCap())
          : this.gravityLevelCap || 999;

      const sectionLength = this.getSectionLength();
      const maxSections = this.getMaxSectionsForTracker();
      const basis = this.getSectionBasisValue();
      const basisLastSectionIndex = Math.min(
        maxSections - 1,
        Math.max(0, Math.floor(Math.max(0, basis - 1) / sectionLength)),
      );
      const lastSectionIndex = Math.min(
        maxSections - 1,
        Math.max(
          basisLastSectionIndex,
          typeof this.currentSection === "number" ? this.currentSection : 0,
        ),
      );
      const displayedCurrentSection = Math.min(this.currentSection, lastSectionIndex);

      const sectionTimesArray = [];
      const sectionTetrisesArray = [];
      for (let i = 0; i < maxSections; i++) {
        if (i > lastSectionIndex) {
          sectionTimesArray.push(null);
          sectionTetrisesArray.push(null);
          continue;
        }

        const storedFullTime =
          this.sectionTimes && typeof this.sectionTimes[i] === "number"
            ? this.sectionTimes[i]
            : undefined;
        const storedCoolTime =
          this.sectionCoolTimes && typeof this.sectionCoolTimes[i] === "number"
            ? this.sectionCoolTimes[i]
            : undefined;
        const storedTetrises = this.sectionTetrises ? this.sectionTetrises[i] : undefined;
        const isCurrent =
          i === displayedCurrentSection &&
          !this.gameOver &&
          (!isMarathonMode ? this.level < maxLevel : true) &&
          typeof storedFullTime !== "number";
        const currentElapsed = this.currentTime - this.sectionStartTime;
        // Main section stopwatch should continue past *70; only COOL split freezes.
        const timeValue =
          typeof storedFullTime === "number"
            ? storedFullTime
            : isCurrent
              ? currentElapsed
              : null;
        sectionTimesArray.push(timeValue);

        const tetrisValue =
          typeof storedTetrises === "number"
            ? storedTetrises
            : isCurrent
              ? this.currentSectionTetrisCount || 0
              : null;
        sectionTetrisesArray.push(tetrisValue);
      }

      let runningTotal = 0;
      for (let i = 0; i < this.sectionTimeTexts.length; i++) {
        const shouldShow = i <= displayedCurrentSection && i <= lastSectionIndex;
        this.sectionSectionLabels[i].setVisible(shouldShow);
        this.sectionTimeTexts[i].setVisible(shouldShow);
        if (this.sectionTallyTexts && this.sectionTallyTexts[i]) {
          this.sectionTallyTexts[i].setVisible(shouldShow);
        }
        if (this.sectionPerfTexts && this.sectionPerfTexts[i]) {
          this.sectionPerfTexts[i].setVisible(shouldShow);
        }

        const storedFullTime =
          this.sectionTimes && typeof this.sectionTimes[i] === "number"
            ? this.sectionTimes[i]
            : undefined;
        const storedCoolTime =
          this.sectionCoolTimes && typeof this.sectionCoolTimes[i] === "number"
            ? this.sectionCoolTimes[i]
            : undefined;
        const liveTime =
          typeof storedFullTime === "number"
            ? storedFullTime
            : i === displayedCurrentSection
              ? this.currentTime - this.sectionStartTime
              : undefined;
        // In TGM3, cumulative totals should use the COOL (0-*70) split; otherwise use full time.
        const splitTime = isTgm3Mode
          ? typeof storedCoolTime === "number"
            ? storedCoolTime
            : typeof liveTime === "number"
              ? liveTime
              : undefined
          : typeof storedFullTime === "number"
            ? storedFullTime
            : typeof liveTime === "number"
              ? liveTime
              : undefined;
        const hasCompletedTime = typeof splitTime === "number";
        this.sectionTotalTexts[i].setVisible(shouldShow && hasCompletedTime);

        if (!shouldShow) {
          continue;
        }

        const val = sectionTimesArray[i];
        this.sectionTimeTexts[i].setText(this.formatTimeValue(val));

        const tVal = sectionTetrisesArray[i];
        if (this.sectionTallyTexts && this.sectionTallyTexts[i]) {
          const tallyText =
            typeof tVal === "number" && tVal > 0 ? "x".repeat(Math.min(tVal, 6)) : "";
          this.sectionTallyTexts[i].setText(tallyText);
        }
        if (this.sectionPerfTexts && this.sectionPerfTexts[i]) {
          const perf =
            Array.isArray(this.sectionPerformance) && this.sectionPerformance[i]
              ? this.sectionPerformance[i]
              : "";
          this.sectionPerfTexts[i].setText(perf);
          this.sectionPerfTexts[i].setColor(perf === "COOL" ? "#ffff55" : "#ff7777");
        }

        if (hasCompletedTime) {
          if (isTgm3Mode) {
            // TGM3: right column shows per-section *70 split time, resetting each section
            this.sectionTotalTexts[i].setText(this.formatTimeValue(splitTime));
          } else {
            runningTotal += splitTime || 0;
            this.sectionTotalTexts[i].setText(this.formatTimeValue(runningTotal));
          }
        }
      }

      if (this.halfTimeTexts && this.halfTimeTexts.length >= 2) {
        const firstHalf = sectionTimesArray
          .slice(0, 5)
          .reduce((sum, t) => (t !== null && t !== undefined ? sum + t : sum), 0);
        const secondHalf = sectionTimesArray
          .slice(5)
          .reduce((sum, t) => (t !== null && t !== undefined ? sum + t : sum), 0);

        this.halfTimeTexts[0].time.setText(this.formatTimeValue(firstHalf || 0));
        this.halfTimeTexts[1].time.setText(this.formatTimeValue(secondHalf || 0));

        const showSecondHalf = displayedCurrentSection >= 5;
        this.halfTimeTexts[1].label.setVisible(showSecondHalf);
        this.halfTimeTexts[1].time.setVisible(showSecondHalf);
      }
    }

    // Draw NEXT label - positioned to the right of border
    const nextX = this.borderOffsetX + this.cellSize * this.board.cols + 20;
    const nextY = this.borderOffsetY;
    const nextFontSize = Math.max(
      16,
      Math.min(24, Math.floor(this.cellSize * 0.8)),
    );
    const modeId = this.getHintModeId();
    const previewHint = this.getPrimaryMinosaHint(modeId);
    const highlightHoldHint =
      !!(
        previewHint &&
        previewHint.usedHold &&
        previewHint.source === "hold" &&
        typeof previewHint.piece === "string"
      );
    const highlightNextHint =
      !!(
        previewHint &&
        previewHint.usedHold &&
        previewHint.source === "next" &&
        typeof previewHint.piece === "string"
      );

    const nextLabel = this.add.text(nextX, nextY, "NEXT", {
      fontSize: `${nextFontSize}px`,
      fill: highlightNextHint ? this.hintColorHex : "#fff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    });
    this.gameGroup.add(nextLabel);

    // Draw multiple next pieces based on mode configuration
    const maxNextPieces = this.nextPiecesCount || 1;
    const normalModeCellSize = Math.max(
      20,
      Math.min(
        Math.floor((this.windowWidth * 0.8) / 10),
        Math.floor((this.windowHeight * 0.9) / 20),
        40,
      ),
    );
    const previewBaseCellSize = this.bigModeBoardActive
      ? normalModeCellSize
      : this.cellSize;
    const previewCellSize = Math.max(8, Math.floor(previewBaseCellSize * 0.6)); // Keep queue previews at normal-size scale in Big Mode
    if (this.gameMode && typeof this.gameMode.applyCyclonePreviewToQueue === "function") {
      this.gameMode.applyCyclonePreviewToQueue(this);
    }
    let queuedPowerupType = null;
    for (let i = 0; i < Math.min(maxNextPieces, this.nextPieces.length); i++) {
      // Sanitize preview type to avoid undefined rotations
      const rawNext = this.nextPieces[i];
      let previewType =
        typeof rawNext === "string"
          ? rawNext
          : typeof rawNext?.type === "string"
            ? rawNext.type
            : typeof rawNext?.piece === "string"
              ? rawNext.piece
              : rawNext;
      if (typeof previewType !== "string") {
        previewType = "I";
      }

      // Detect queued powerup (if raw object carries powerupType)
      if (!queuedPowerupType && rawNext && typeof rawNext === "object" && rawNext.powerupType) {
        queuedPowerupType = rawNext.powerupType;
      }

      const previewTextureKey =
        rawNext && typeof rawNext === "object" && rawNext.textureKey
          ? rawNext.textureKey
          : this.rotationSystem === "ARS"
            ? "mino_ars"
            : "mino_srs";
      const previewRotation = this.getStoredPieceRotation(rawNext, 0);
      const nextPiece = new Piece(
        previewType,
        this.rotationSystem,
        previewRotation,
        previewTextureKey,
      );
      // Use matrix-relative positioning like the main game pieces
      nextPiece.x = 0;
      nextPiece.y = 2; // Start from the top visible row
      // Position the next piece area to the right of the playfield
      const nextAreaOffsetX =
        this.borderOffsetX + this.cellSize * this.board.cols + 20;
      const nextAreaOffsetY =
        this.borderOffsetY + 30 + i * (previewCellSize * 3 + 4); // Closer spacing
      nextPiece.draw(this, nextAreaOffsetX, nextAreaOffsetY, previewCellSize, false, 1, false);
      if (highlightNextHint && i === 0) {
        const nextHighlight = this.add.graphics();
        nextHighlight.lineStyle(Math.max(4, Math.floor(previewCellSize * 0.2)), this.hintColor, 0.95);
        nextHighlight.strokeRect(
          nextAreaOffsetX - previewCellSize,
          nextAreaOffsetY - previewCellSize,
          previewCellSize * 4,
          previewCellSize * 4,
        );
        this.gameGroup.add(nextHighlight);
      }
    }

    // Update powerup status text based on next queue if not already showing active
    if (!this.pendingPowerup && this.powerupStatusText) {
      if (queuedPowerupType) {
        this.powerupStatusText.setText(
          queuedPowerupType === "free_fall"
            ? "POWERUP: FREE FALL"
            : queuedPowerupType === "del_even"
              ? "POWERUP: DEL EVEN"
              : ""
        );
      } else if (!this.activePowerupType) {
        this.powerupStatusText.setText("");
      }
    }

    // Draw HOLD label and piece for modes that support hold
    if (this.holdEnabled) {
      const holdX = this.borderOffsetX - 80;
      const holdY = this.borderOffsetY;
      const holdFontSize = Math.max(
        16,
        Math.min(24, Math.floor(this.cellSize * 0.8)),
      );

      const holdLabel = this.add.text(holdX, holdY, "HOLD", {
        fontSize: `${holdFontSize}px`,
        fill: highlightHoldHint ? this.hintColorHex : "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      });
      this.gameGroup.add(holdLabel);

      // Draw hold piece with same size as preview pieces
      if (this.holdPiece) {
        // Show held piece in its stored orientation (Cyclone can preserve prerotation in hold).
        let holdType =
          typeof this.holdPiece.type === "string" ? this.holdPiece.type : "I";
        const holdDisplayRotation = this.getStoredPieceRotation(this.holdPiece, 0);
        const displayPiece = new Piece(
          holdType,
          this.holdPiece.rotationSystem,
          holdDisplayRotation,
          this.holdPiece.textureKey || null,
        );
        displayPiece.x = 0;
        displayPiece.y = 2; // Start from the top visible row
        displayPiece.draw(this, holdX, holdY + 30, previewCellSize, false, 1, false);
        if (highlightHoldHint) {
          const holdHighlight = this.add.graphics();
          this.drawHintPieceOverlay(holdHighlight, displayPiece, holdX, holdY + 30, previewCellSize, {
            hiddenRows: Math.max(0, (this.board?.rows || 0) - (this.visibleRows || 0)),
            minimumBoardY: Number.NEGATIVE_INFINITY,
            lineWidth: Math.max(4, Math.floor(previewCellSize * 0.2)),
          });
          this.gameGroup.add(holdHighlight);
        }
      }
    }



    // Add playfield border to game group (already created above)
    this.gameGroup.add(this.playfieldBorder);

    // Draw pause overlay - centered on screen
    if (this.isPaused) {
      const overlay = this.add.rectangle(
        this.windowWidth / 2,
        this.windowHeight / 2,
        this.windowWidth,
        this.windowHeight,
        0x000000,
        0.8,
      );
      overlay.setDepth(1000000);
      const pauseFontSize = Math.max(
        48,
        Math.min(72, Math.floor(this.cellSize * 2.4)),
      );
      const pauseText = this.add
        .text(this.windowWidth / 2, this.windowHeight / 2 - 50, "PAUSED", {
          fontSize: `${pauseFontSize}px`,
          fill: "#ffff00",
          stroke: "#000",
          strokeThickness: 2,
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      pauseText.setDepth(1000001);
      const resumeFontSize = Math.max(
        16,
        Math.min(28, Math.floor(this.cellSize * 0.9)),
      );
      const resumeText = this.add
        .text(
          this.windowWidth / 2,
          this.windowHeight / 2 + 50,
          "Press ESC to resume",
          {
            fontSize: `${resumeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "normal",
          },
        )
        .setOrigin(0.5);
      resumeText.setDepth(1000001);
      const menuText = this.add
        .text(
          this.windowWidth / 2,
          this.windowHeight / 2 + 90,
          "Press M to return to menu",
          {
            fontSize: `${resumeFontSize - 4}px`,
            fill: "#ffcccc",
            fontFamily: "Courier New",
            fontStyle: "normal",
          },
        )
        .setOrigin(0.5);
      menuText.setDepth(1000001);
      this.gameGroup.add(overlay);
      this.gameGroup.add(pauseText);
      this.gameGroup.add(resumeText);
      this.gameGroup.add(menuText);
    }

    // Draw game over text - centered on screen (only after 3 seconds)
    // Skip in Zen to avoid overlay
    if (this.showGameOverText && !(this.isZenSandboxActive && this.isZenSandboxActive())) {
      const gameOverFontSize = Math.max(
        48,
        Math.min(72, Math.floor(this.cellSize * 1.5)),
      );
      const subtitleFontSize = Math.max(
        18,
        Math.min(30, Math.floor(gameOverFontSize * 0.42)),
      );

      const centerY = this.windowHeight / 2;
      const centerX = this.windowWidth / 2;

      const gameOverText = this.add
        .text(centerX, centerY, this.gameOverMessage || "GAME OVER", {
          fontSize: `${gameOverFontSize}px`,
          fill:
            this.gameOverMessageColor ||
            (this.sprintCompleted ? "#00ff88" : "#ff0000"),
          stroke: "#000",
          strokeThickness: 6,
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.gameGroup.add(gameOverText);

      if (this.gameOverSubMessage) {
        const subtitleText = this.add
          .text(centerX, centerY + gameOverFontSize * 0.75, this.gameOverSubMessage, {
            fontSize: `${subtitleFontSize}px`,
            fill: this.gameOverSubMessageColor || "#ffffff",
            stroke: "#000",
            strokeThickness: 4,
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          })
          .setOrigin(0.5);
        this.gameGroup.add(subtitleText);
      }
    }
  }
}
