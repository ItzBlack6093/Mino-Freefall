class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });

    this.modeTypes = this.getModeTypesFromManager();

    this.currentModeTypeIndex = 0;
    this.currentSubmodeIndex = 0;

    // UI elements
    this.modeTypeTitle = null;
    this.leftModeTypeArrow = null;
    this.rightModeTypeArrow = null;
    this.upSubmodeArrow = null;
    this.downSubmodeArrow = null;
    this.modeTypeListContainer = null;
    this.submodeTitle = null;
    this.submodeDescription = null;
    this.leaderboardContainer = null;
    this.leaderboardTitle = null;
    this.leaderboardEntries = [];
    this.leaderboardPlaceholder = null;
    this.startButton = null;
    this.settingsButton = null;
    this.settingsBorder = null;
    this.pendingStartData = null;
    this.startingLevelPromptActive = false;
    this.startingLevelPromptBg = null;
    this.startingLevelPromptContainer = null;
    this.startingLevelPromptSelection = 0;
    this.startingLevelPromptLevelLabel = null;
    this.startingLevelPromptValueText = null;
    this.startingLevelPromptLeftArrow = null;
    this.startingLevelPromptRightArrow = null;
    this.startingLevelPromptRoundsMedalLabel = null;
    this.startingLevelPromptRoundsMedalValueText = null;
    this.startingLevelPromptRoundsMedalLeftArrow = null;
    this.startingLevelPromptRoundsMedalRightArrow = null;
  }

  getModeTypesFromManager() {
    if (typeof getModeManager === "undefined") {
      return [];
    }
    const modeManager = getModeManager();
    return modeManager.getMenuModeTypes();
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.tPieceX = centerX;
    this.tPieceY = centerY - 90;
    this.modeTypes = this.getModeTypesFromManager();

    this.events.off("wake", this.handleMenuWake, this);
    this.events.off("resume", this.handleMenuWake, this);
    this.events.on("wake", this.handleMenuWake, this);
    this.events.on("resume", this.handleMenuWake, this);

    this.events.once("shutdown", () => {
      this.events.off("wake", this.handleMenuWake, this);
      this.events.off("resume", this.handleMenuWake, this);
      if (this.input && this.input.keyboard && this.input.keyboard.removeAllListeners) {
        this.input.keyboard.removeAllListeners();
      }
    });

    // First-visit name prompt
    this.showNamePromptIfNeeded();

    // Title
    this.add
      .text(centerX, centerY - 220, "MINO FREEFALL", {
        fontSize: "48px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 0,
          stroke: true,
          fill: false,
        },
      })
      .setOrigin(0.5);

    this.createMenuUI();
    this.updateMenuDisplay();
    this.setupKeyboardControls();

    createOrUpdateGlobalOverlay(this, { ...this.getOverlayModeInfo(), showMode: false });
  }

  handleMenuWake() {
    if (this.modeTypes.length === 0) {
      this.modeTypes = this.getModeTypesFromManager();
    }
    if (this.modeTypes.length > 0) {
      this.updateMenuDisplay();
    }
    this.updateProfileBadge();
  }

  showNamePromptIfNeeded() {
    if (typeof window.achievementSystem === "undefined") return;

    const playerName = window.achievementSystem.getPlayerName();
    if (!playerName) {
      this.showNamePrompt();
    }
  }

  showNamePrompt() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Dark overlay background
    this.namePromptOverlay = this.add.graphics();
    this.namePromptOverlay.fillStyle(0x000000, 0.85);
    this.namePromptOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.namePromptOverlay.setDepth(10000);

    // Prompt container
    this.namePromptContainer = this.add.container(centerX, centerY);
    this.namePromptContainer.setDepth(10001);

    // Prompt text
    this.namePromptText = this.add.text(0, -60, "Enter your player name", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "center",
    }).setOrigin(0.5);
    this.namePromptContainer.add(this.namePromptText);

    // Create HTML input for name entry
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.placeholder = "Player";
    inputElement.maxLength = 16;
    inputElement.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Courier New', monospace;
      font-size: 20px;
      padding: 10px;
      text-align: center;
      background: #222;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 4px;
      z-index: 10002;
    `;
    document.body.appendChild(inputElement);
    inputElement.focus();

    this.nameInputElement = inputElement;

    // Handle Enter key on the HTML input directly
    inputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.submitName();
      }
    });

    // Confirm button
    this.namePromptButton = this.add.text(0, 40, "Confirm", {
      fontSize: "18px",
      fill: "#00ff00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5).setInteractive();
    this.namePromptButton.on("pointerdown", () => this.submitName());
    this.namePromptButton.on("pointerover", () => this.namePromptButton.setStyle({ fill: "#ffff00" }));
    this.namePromptButton.on("pointerout", () => this.namePromptButton.setStyle({ fill: "#00ff00" }));
    this.namePromptContainer.add(this.namePromptButton);

    // Handle Enter key
    this.nameEnterKey = this.input.keyboard.on("keydown-ENTER", () => this.submitName());

    // Store reference for cleanup
    this.namePromptActive = true;
  }

  submitName() {
    if (!this.namePromptActive) return;

    const name = this.nameInputElement.value.trim();

    // Validation: name cannot be empty
    if (!name) {
      this.nameInputElement.style.borderColor = "#ff0000";
      this.nameInputElement.focus();
      return;
    }

    if (typeof window.achievementSystem !== "undefined") {
      window.achievementSystem.setPlayerName(name);
    }

    // Cleanup
    this.namePromptActive = false;
    this.input.keyboard.off("keydown-ENTER");
    if (this.nameInputElement && this.nameInputElement.parentNode) {
      this.nameInputElement.parentNode.removeChild(this.nameInputElement);
    }
    if (this.namePromptOverlay) {
      this.namePromptOverlay.destroy();
    }
    if (this.namePromptContainer) {
      this.namePromptContainer.destroy();
    }

    // Update profile badge if it exists
    this.updateProfileBadge();
  }

  createProfileBadge() {
    const badgeWidth = 160;
    const badgeHeight = 60;
    const padding = 20;
    const x = this.cameras.main.width - padding - 100;
    const y = padding + 50;

    this.profileBadgeGroup = this.add.container(x, y);

    // Border rectangle
    this.profileBadgeBorder = this.add.graphics();
    this.profileBadgeBorder.lineStyle(1, 0xffffff);
    this.profileBadgeBorder.strokeRect(
      -badgeWidth / 2,
      -badgeHeight / 2,
      badgeWidth,
      badgeHeight
    );
    this.profileBadgeGroup.add(this.profileBadgeBorder);

    // Player name
    this.profileBadgeName = this.add.text(0, -12, "Player", {
      fontSize: "14px",
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "normal",
    }).setOrigin(0.5);
    this.profileBadgeGroup.add(this.profileBadgeName);

    // Achievement rating
    this.profileBadgeRating = this.add.text(0, 12, "AR 0", {
      fontSize: "18px",
      fill: "#ffcc00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.profileBadgeGroup.add(this.profileBadgeRating);

    // Make interactive
    this.profileBadgeGroup.setInteractive(
      new Phaser.Geom.Rectangle(-badgeWidth / 2, -badgeHeight / 2, badgeWidth, badgeHeight),
      Phaser.Geom.Rectangle.Contains
    );
    this.profileBadgeGroup.on("pointerdown", () => this.showAchievementOverlay());
    this.profileBadgeGroup.on("pointerover", () => this.profileBadgeBorder.lineStyle(2, 0xffff00));
    this.profileBadgeGroup.on("pointerout", () => this.profileBadgeBorder.lineStyle(1, 0xffffff));

    this.updateProfileBadge();
  }

  updateProfileBadge() {
    if (!this.profileBadgeGroup) return;

    const playerName = typeof window.achievementSystem !== "undefined"
      ? (window.achievementSystem.getPlayerName() || "Player")
      : "Player";
    const rating = typeof window.achievementSystem !== "undefined"
      ? window.achievementSystem.getScore()
      : 0;

    this.profileBadgeName.setText(playerName);
    this.profileBadgeRating.setText(`AR ${rating}`);
  }

  showAchievementOverlay() {
    if (typeof window.achievementSystem === "undefined") return;

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Dark overlay background
    this.achievementOverlayBg = this.add.graphics();
    this.achievementOverlayBg.fillStyle(0x000000, 0.85);
    this.achievementOverlayBg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.achievementOverlayBg.setDepth(10000);

    // Overlay container
    this.achievementOverlayContainer = this.add.container(centerX, centerY);
    this.achievementOverlayContainer.setDepth(10001);

    // Title
    this.achievementOverlayTitle = this.add.text(0, -280, "ACHIEVEMENTS", {
      fontSize: "32px",
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.achievementOverlayContainer.add(this.achievementOverlayTitle);

    // Close button (X)
    this.achievementCloseButton = this.add.text(280, -280, "X", {
      fontSize: "24px",
      fill: "#ff0000",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5).setInteractive();
    this.achievementCloseButton.on("pointerdown", () => this.hideAchievementOverlay());
    this.achievementCloseButton.on("pointerover", () => this.achievementCloseButton.setStyle({ fill: "#ffff00" }));
    this.achievementCloseButton.on("pointerout", () => this.achievementCloseButton.setStyle({ fill: "#ff0000" }));
    this.achievementOverlayContainer.add(this.achievementCloseButton);

    // Scrollable achievement list
    this.achievementScrollContainer = this.add.container(0, 0);
    this.achievementOverlayContainer.add(this.achievementScrollContainer);

    const groupedAchievements = window.achievementSystem.getAllByGroup();
    let yOffset = -240;

    for (const [game, achievements] of Object.entries(groupedAchievements)) {
      // Group header
      const header = this.add.text(0, yOffset, game, {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      }).setOrigin(0.5);
      this.achievementScrollContainer.add(header);
      yOffset += 30;

      // Achievement rows
      achievements.forEach((achievement) => {
        const isCompleted = window.achievementSystem.isCompleted(achievement.id);

        // Checkmark
        const checkmark = this.add.text(-180, yOffset, isCompleted ? "✓" : " ", {
          fontSize: "16px",
          fill: isCompleted ? "#55ff55" : "#666666",
          fontFamily: "Courier New",
          fontStyle: "bold",
        }).setOrigin(0, 0.5);
        this.achievementScrollContainer.add(checkmark);

        // Description
        const desc = this.add.text(0, yOffset, achievement.description, {
          fontSize: "14px",
          fill: isCompleted ? "#ffffff" : "#aaaaaa",
          fontFamily: "Courier New",
          wordWrap: { width: 300 },
        }).setOrigin(0, 0.5);
        this.achievementScrollContainer.add(desc);

        // Points
        const points = this.add.text(180, yOffset, achievement.points.toString(), {
          fontSize: "14px",
          fill: "#ffcc00",
          fontFamily: "Courier New",
        }).setOrigin(1, 0.5);
        this.achievementScrollContainer.add(points);

        yOffset += 22;
      });

      yOffset += 15; // Extra spacing between groups
    }

    // Escape key to close
    this.achievementEscapeKey = this.input.keyboard.on("keydown-ESC", () => this.hideAchievementOverlay());
  }

  hideAchievementOverlay() {
    if (this.achievementOverlayBg) {
      this.achievementOverlayBg.destroy();
      this.achievementOverlayBg = null;
    }
    if (this.achievementEscapeKey) {
      this.input.keyboard.off("keydown-ESC");
      this.achievementEscapeKey = null;
    }
    if (this.achievementOverlayContainer) {
      this.achievementOverlayContainer.destroy();
    }
  }

  createMenuUI() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Mode type list container (left side)
    this.modeTypeListContainer = this.add.container(
      centerX - 350,
      centerY - 50,
    );

    // Submode navigation arrows (center)
    this.upSubmodeArrow = this.add
      .text(centerX - 100, centerY + 20, "◀", {
        fontSize: "24px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.downSubmodeArrow = this.add
      .text(centerX + 100, centerY + 20, "▶", {
        fontSize: "24px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Submode title and description (center)
    this.submodeTitle = this.add
      .text(centerX, centerY + 20, "", {
        fontSize: "24px",
        fill: "#00ffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.submodeDescription = this.add
      .text(centerX, centerY + 60, "", {
        fontSize: "14px",
        fill: "#cccccc",
        fontFamily: "Courier New",
        wordWrap: { width: 300 },
        align: "center",
      })
      .setOrigin(0.5);

    // Best scores leaderboard (right side)
    const leaderboardBaseX = centerX + 270;
    const leaderboardBaseY = centerY - 80;
    const leaderboardOffsetX = 30;
    const leaderboardOffsetY = 100;
    const leaderboardTitleExtraY = -100;
    this.leaderboardContainer = this.add.container(
      leaderboardBaseX + leaderboardOffsetX,
      leaderboardBaseY + leaderboardOffsetY,
    );

    // Placeholder for modes without leaderboards (e.g., Zen)
    this.leaderboardPlaceholder = this.add
      .text(
        leaderboardBaseX + leaderboardOffsetX,
        leaderboardBaseY + leaderboardOffsetY + 10,
        "Sandbox mode - experiment and have fun! No leaderboards.",
        {
          fontSize: "18px",
          fill: "#cccccc",
          fontFamily: "Courier New",
          align: "center",
          wordWrap: { width: 240 },
        },
      )
      .setOrigin(0.5)
      .setVisible(false);

    // Leaderboard title - anchored relative to the container, pushed further down
    this.leaderboardTitle = this.add
      .text(
        leaderboardBaseX + leaderboardOffsetX,
        leaderboardBaseY + leaderboardOffsetY + leaderboardTitleExtraY,
        "BEST SCORES",
      {
        fontSize: "20px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Leaderboard entries will be created dynamically
    this.leaderboardEntries = [];

    // Start button (bottom center)
    this.startButton = this.add
      .text(centerX, centerY + 120, "START GAME", {
        fontSize: "24px",
        fill: "#00ff00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.startButton.on("pointerdown", () => {
      if (this.hasBlockingOverlay() || this.startingLevelPromptActive) return;
      this.startSelectedMode();
    });

    this.startButton.on("pointerover", () => {
      this.startButton.setStyle({ fill: "#ffffff" });
    });

    this.startButton.on("pointerout", () => {
      this.startButton.setStyle({ fill: "#00ff00" });
    });

    // Settings button (bottom with border)
    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonX = centerX + 200;
    const buttonY = this.cameras.main.height - 60;

    // Create border rectangle
    this.settingsBorder = this.add.graphics();
    this.settingsBorder.lineStyle(2, 0xffffff);
    this.settingsBorder.strokeRect(
      buttonX - buttonWidth / 2,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
    );

    // Create button text
    this.settingsButton = this.add
      .text(buttonX, buttonY, "Settings", {
        fontSize: "18px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.settingsButton.on("pointerdown", () => {
      if (this.hasBlockingOverlay() || this.startingLevelPromptActive) return;
      this.scene.start("SettingsScene");
    });

    this.settingsButton.on("pointerover", () => {
      this.settingsButton.setStyle({ fill: "#ffff00" });
    });

    this.settingsButton.on("pointerout", () => {
      this.settingsButton.setStyle({ fill: "#ffffff" });
    });

    // Arrow click handlers
    this.upSubmodeArrow.on("pointerdown", () => {
      if (this.hasBlockingOverlay() || this.startingLevelPromptActive) return;
      this.navigateSubmode(-1);
    });

    this.downSubmodeArrow.on("pointerdown", () => {
      if (this.hasBlockingOverlay() || this.startingLevelPromptActive) return;
      this.navigateSubmode(1);
    });

    // Create initial mode type list display
    this.createModeTypeListDisplay();

    // Create profile badge
    this.createProfileBadge();
  }

  updateMenuLayout() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Update submode arrows (center)
    if (this.upSubmodeArrow) {
      this.upSubmodeArrow.setPosition(centerX - 100, centerY + 20);
    }
    if (this.downSubmodeArrow) {
      this.downSubmodeArrow.setPosition(centerX + 100, centerY + 20);
    }

    // Update submode title and description (center)
    if (this.submodeTitle) {
      this.submodeTitle.setPosition(centerX, centerY + 20);
    }
    if (this.submodeDescription) {
      this.submodeDescription.setPosition(centerX, centerY + 60);
    }

    // Update mode type list container (left side)
    if (this.modeTypeListContainer) {
      this.modeTypeListContainer.setPosition(centerX - 350, centerY - 50);
    }

    // Update leaderboard container (right side) - keep consistent with creation offsets
    const leaderboardBaseX = centerX + 270;
    const leaderboardBaseY = centerY - 80;
    const leaderboardOffsetX = 30;
    const leaderboardOffsetY = 100;
    const leaderboardTitleOffsetX = 15;
    const leaderboardTitleExtraY = -100;
    if (this.leaderboardContainer) {
      this.leaderboardContainer.setPosition(
        leaderboardBaseX + leaderboardOffsetX,
        leaderboardBaseY + leaderboardOffsetY,
      );
    }
    if (this.leaderboardTitle) {
      this.leaderboardTitle.setPosition(
        leaderboardBaseX + leaderboardTitleOffsetX,
        leaderboardBaseY + leaderboardOffsetY + leaderboardTitleExtraY,
      );
    }

    // Update start button (bottom center)
    if (this.startButton) {
      this.startButton.setPosition(centerX, centerY + 120);
    }

    // Update settings button (bottom with border)
    if (this.settingsButton && this.settingsBorder) {
      const buttonWidth = 120;
      const buttonHeight = 40;
      const buttonX = centerX + 200;
      const buttonY = this.cameras.main.height - 60;

      this.settingsButton.setPosition(buttonX, buttonY);

      // Update border
      this.settingsBorder.clear();
      this.settingsBorder.lineStyle(2, 0xffffff);
      this.settingsBorder.strokeRect(
        buttonX - buttonWidth / 2,
        buttonY - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
      );
    }

    // Update profile badge position
    if (this.profileBadgeGroup) {
      const padding = 20;
      this.profileBadgeGroup.setPosition(this.cameras.main.width - padding - 100, padding + 50);
    }

    if (this.startingLevelPromptActive) {
      this.layoutStartingLevelPrompt();
    }

    createOrUpdateGlobalOverlay(this, this.getOverlayModeInfo());
  }

  setupKeyboardControls() {
    if (this.input && this.input.keyboard && this.input.keyboard.removeAllListeners) {
      this.input.keyboard.removeAllListeners();
    }

    // Left/Right for submode navigation within selected mode type
    this.input.keyboard.on("keydown-LEFT", () => {
      if (this.hasBlockingOverlay()) return;
      if (this.startingLevelPromptActive) {
        this.adjustPendingPromptValue(-1);
        return;
      }
      this.navigateSubmode(-1);
    });

    this.input.keyboard.on("keydown-RIGHT", () => {
      if (this.hasBlockingOverlay()) return;
      if (this.startingLevelPromptActive) {
        this.adjustPendingPromptValue(1);
        return;
      }
      this.navigateSubmode(1);
    });

    // Up/Down for mode type selection (all displayed vertically)
    this.input.keyboard.on("keydown-UP", () => {
      if (this.hasBlockingOverlay()) return;
      if (this.startingLevelPromptActive) {
        this.adjustPendingPromptSelection(-1);
        return;
      }
      this.navigateModeType(-1);
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      if (this.hasBlockingOverlay()) return;
      if (this.startingLevelPromptActive) {
        this.adjustPendingPromptSelection(1);
        return;
      }
      this.navigateModeType(1);
    });

    // Enter to start game
    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.hasBlockingOverlay()) return;
      if (this.startingLevelPromptActive) {
        this.confirmStartingLevelPrompt();
        return;
      }
      this.startSelectedMode();
    });

    // Escape for settings
    this.input.keyboard.on("keydown-ESC", () => {
      if (this.startingLevelPromptActive) {
        this.hideStartingLevelPrompt();
        return;
      }
      if (this.hasBlockingOverlay()) return;
      this.scene.start("SettingsScene");
    });
  }

  hasBlockingOverlay() {
    return Boolean(this.namePromptActive || this.achievementOverlayContainer);
  }

  shouldSkipStartingLevelPrompt(modeTypeName) {
    return ["STANDARD", "ALL CLEAR", "PUZZLE"].includes(String(modeTypeName || "").toUpperCase());
  }

  navigateModeType(direction) {
    const numModeTypes = this.modeTypes.length;
    this.currentModeTypeIndex =
      (this.currentModeTypeIndex + direction + numModeTypes) % numModeTypes;
    this.currentSubmodeIndex = 0; // Reset to first submode in new mode type
    this.updateMenuDisplay();
  }

  navigateSubmode(direction) {
    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const numSubmodes = currentModeType.modes.length;
    this.currentSubmodeIndex =
      (this.currentSubmodeIndex + direction + numSubmodes) % numSubmodes;
    this.updateMenuDisplay();
  }

  getOverlayModeInfo() {
    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const currentSubmode = currentModeType.modes[this.currentSubmodeIndex];
    return buildModeInfo(currentSubmode.id, currentSubmode.name || currentSubmode.id);
  }

  createModeTypeListDisplay() {
    // Clear existing mode type list
    if (this.modeTypeListContainer && this.modeTypeListContainer.removeAll) {
      this.modeTypeListContainer.removeAll(true);
    }

    const modeTypes = this.modeTypes;

    // Create mode type list entries
    modeTypes.forEach((modeType, index) => {
      const modeTypeY = index * 50; // Increased spacing between mode types

      // Mode type name text positioned relative to container
      const modeTypeColor =
        index === this.currentModeTypeIndex
          ? this.getDifficultyColor(modeType.name)
          : "#666666";
      const modeTypeText = this.add
        .text(0, modeTypeY, modeType.name, {
          fontSize: "18px",
          fill: modeTypeColor,
          fontFamily: "Courier New",
          fontStyle: index === this.currentModeTypeIndex ? "bold" : "normal",
        })
        .setOrigin(0, 0.5);

      // Make selected mode type interactive
      if (index === this.currentModeTypeIndex) {
        modeTypeText.setInteractive();
        modeTypeText.on("pointerdown", () => {
          if (this.hasBlockingOverlay() || this.startingLevelPromptActive) return;
          this.currentModeTypeIndex = index;
          this.currentSubmodeIndex = 0; // Reset to first submode
          this.updateMenuDisplay();
        });
      }

      // Add to container
      if (this.modeTypeListContainer && this.modeTypeListContainer.add) {
        this.modeTypeListContainer.add(modeTypeText);
      }
    });
  }

  updateLeaderboardDisplay() {
    if (this.leaderboardEntries && this.leaderboardEntries.length > 0) {
      this.leaderboardEntries.forEach((entry) => {
        Object.values(entry).forEach((t) => t && t.destroy && t.destroy());
      });
    }
    this.leaderboardEntries = [];

    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const currentSubmode = currentModeType.modes[this.currentSubmodeIndex];
    const modeId = currentSubmode.id;
    const isPuzzleMode = this.isPuzzleMode(modeId);
    const leaderboard = this.getLeaderboard(modeId);

    if (isPuzzleMode) {
      const entry = leaderboard[0] || {};
      const placeholders = {
        stage: entry.stage || "—",
        completion: entry.completionRate != null ? `${entry.completionRate}%` : "—",
        time: entry.time || "--:--.--",
      };

      const baseX = this.leaderboardContainer.x;
      const baseY = this.leaderboardContainer.y;

      const stageText = this.add
        .text(baseX, baseY - 20, `Best Stage: ${placeholders.stage}`, {
          fontSize: "24px",
          fill: "#ffff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      const completionText = this.add
        .text(baseX, baseY + 10, `Completion Rate: ${placeholders.completion}`, {
          fontSize: "18px",
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      const timeText = this.add
        .text(baseX, baseY + 40, `Time Taken: ${placeholders.time}`, {
          fontSize: "18px",
          fill: "#cccccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      this.leaderboardEntries.push({ stageText, completionText, timeText });
      return;
    }

    const maxEntries = 5;
    const padded = [...leaderboard];
    while (padded.length < maxEntries) padded.push(null);

    const rowHeight = 48;
    const startY =
      this.leaderboardContainer.y - ((maxEntries - 1) * rowHeight) / 2 + 30;

    padded.slice(0, maxEntries).forEach((entry, index) => {
      const y = startY + index * rowHeight;

      const formatted = this.formatLeaderboardEntry(modeId, entry);
      const leftText = this.add
        .text(this.leaderboardContainer.x - 110, y, formatted.left, {
          fontSize: "24px",
          fill: "#ffff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0, 0.5);

      // Stack secondary fields (middle/right) in one column
      const secondaryX = this.leaderboardContainer.x + 40;
      const middleText = this.add
        .text(secondaryX, y - rowHeight * 0.2, formatted.middle, {
          fontSize: "16px",
          fill: "#00ffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      const rightText = this.add
        .text(secondaryX, y + rowHeight * 0.2, formatted.right, {
          fontSize: "16px",
          fill: "#cccccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      this.leaderboardEntries.push({ leftText, middleText, rightText });
    });
  }

  updateLeaderboard(modeId) {
    // modeId is accepted for compatibility; display uses current selection
    this.updateLeaderboardDisplay();
  }

  /**
   * Compute MR (Mino Rating) from Glicko rating.
   * Asymptotically clamps from 0 to 40 using: MR = 40 * (1 - e^(-r / 1500))
   * where r is clamped to >= 0. Returns a value with 2 decimal places.
   */
  computeMR(glickoRating) {
    const r = Math.max(0, glickoRating);
    const mr = 40 * (1 - Math.exp(-r / 1500));
    return Math.round(mr * 100) / 100;
  }

  /**
   * Convert HSV to a 6-digit hex color string.
   * h: 0-360, s: 0-1, v: 0-1
   */
  hsvToHex(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r, g, b;
    if (h < 0) h = 360 + (h % 360);
    if (h >= 360) h = h % 360;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Display the player's Rating, Glicko, RD, and MR in the right-side panel
   * (replaces leaderboard for versus modes).
   */
  updateVersusRatingDisplay() {
    // Clear existing leaderboard entries
    if (this.leaderboardEntries && this.leaderboardEntries.length > 0) {
      this.leaderboardEntries.forEach((entry) => {
        Object.values(entry).forEach((t) => t && t.destroy && t.destroy());
      });
    }
    this.leaderboardEntries = [];

    // Read player stats from localStorage / NetworkManager
    const nm = window.__minoNetworkManager;
    const rating = nm ? nm.rating : (parseInt(localStorage.getItem("mino_rating"), 10) || 1500);
    const rd = nm ? nm.rd : (parseFloat(localStorage.getItem("mino_rd")) || 350);
    const gamesPlayed = nm ? nm.gamesPlayed : (parseInt(localStorage.getItem("mino_games_played"), 10) || 0);
    const provisional = nm ? nm.provisional : (gamesPlayed < 10);
    const mr = this.computeMR(rating);

    const baseX = this.leaderboardContainer.x;
    const baseY = this.leaderboardContainer.y;

    // MR (prominent)
    const mrLabel = this.add
      .text(baseX, baseY - 40, "MR", {
        fontSize: "16px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5, 0.5);

    const mrColor = provisional
      ? "#ff0000"
      : this.hsvToHex(Math.max(95 - (mr / 40) * 150, -50), 0.9, 0.9);

    const mrValue = this.add
      .text(baseX, baseY - 15, provisional ? "?.??" : mr.toFixed(2), {
        fontSize: "36px",
        fill: mrColor,
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);

    // Glicko (same as rating value but labeled explicitly)
    const glickoLabel = this.add
      .text(baseX - 60, baseY + 30, "Glicko", {
        fontSize: "14px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0, 0.5);

    const glickoValue = this.add
      .text(baseX + 70, baseY + 30, provisional ? "?" : String(rating), {
        fontSize: "18px",
        fill: "#00ffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(1, 0.5);

    // RD (Rating Deviation)
    const rdLabel = this.add
      .text(baseX - 60, baseY + 60, "RD", {
        fontSize: "14px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0, 0.5);

    const rdValue = this.add
      .text(baseX + 70, baseY + 60, provisional ? "?" : rd.toFixed(1), {
        fontSize: "18px",
        fill: "#aaaaaa",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(1, 0.5);

    // Provisional badge
    if (provisional) {
      const provText = this.add
        .text(baseX, baseY + 95, `Provisional (${gamesPlayed}/10 games)`, {
          fontSize: "12px",
          fill: "#ff8800",
          fontFamily: "Courier New",
        })
        .setOrigin(0.5, 0.5);
      this.leaderboardEntries.push({ provText });
    }

    this.leaderboardEntries.push({
      mrLabel, mrValue,
      glickoLabel, glickoValue, rdLabel, rdValue,
    });
  }

  updateMenuDisplay() {
    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const currentSubmode = currentModeType.modes[this.currentSubmodeIndex];
    const modeId = currentSubmode.id;

    // Update submode display
    this.submodeTitle.setText(currentSubmode.name);
    this.submodeDescription.setText(currentSubmode.description);

    // Update submode arrows (vertical navigation)
    const numSubmodes = currentModeType.modes.length;
    this.upSubmodeArrow.setStyle({
      fill: this.currentSubmodeIndex > 0 ? "#ffffff" : "#444444",
    });
    this.downSubmodeArrow.setStyle({
      fill: this.currentSubmodeIndex < numSubmodes - 1 ? "#ffffff" : "#444444",
    });

    // Recreate mode type list with updated selection highlighting
    this.createModeTypeListDisplay();

    // Update leaderboard / rating panel
    const isVersusMode = modeId === "versus_guideline" || modeId === "versus_tgm";
    if (modeId === "zen") {
      if (this.leaderboardEntries && this.leaderboardEntries.length > 0) {
        this.leaderboardEntries.forEach((entry) => {
          Object.values(entry).forEach((t) => t && t.destroy && t.destroy());
        });
      }
      this.leaderboardEntries = [];
      if (this.leaderboardContainer) this.leaderboardContainer.setVisible(false);
      if (this.leaderboardTitle) this.leaderboardTitle.setVisible(false);
      if (this.leaderboardPlaceholder)
        this.leaderboardPlaceholder.setVisible(true);
    } else if (isVersusMode) {
      // Show rating panel instead of leaderboard for versus modes
      if (this.leaderboardPlaceholder)
        this.leaderboardPlaceholder.setVisible(false);
      if (this.leaderboardContainer) this.leaderboardContainer.setVisible(true);
      if (this.leaderboardTitle) {
        this.leaderboardTitle.setText("PLAYER RATING");
        this.leaderboardTitle.setVisible(true);
      }
      this.updateVersusRatingDisplay();
    } else {
      if (this.leaderboardContainer) this.leaderboardContainer.setVisible(true);
      if (this.leaderboardTitle) {
        this.leaderboardTitle.setText("BEST SCORES");
        this.leaderboardTitle.setVisible(true);
      }
      if (this.leaderboardPlaceholder)
        this.leaderboardPlaceholder.setVisible(false);
      this.updateLeaderboard(currentSubmode.id);
    }

    createOrUpdateGlobalOverlay(this, { ...this.getOverlayModeInfo(), showMode: false });
  }

  startSelectedMode() {
    if (this.hasBlockingOverlay() || this.startingLevelPromptActive) return;

    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const currentSubmode = currentModeType.modes[this.currentSubmodeIndex];
    const modeId = currentSubmode.id;
    this.selectedMode = modeId;

    // Initialize mode manager and load the selected mode
    if (typeof getModeManager === "undefined") {
      console.error(
        "Mode manager not available - make sure mode files are loaded",
      );
      // Fallback to default mode
      this.recreateGameplayScenes();
      this.scene.start("AssetLoaderScene", { mode: "tgm1" });
      return;
    }

    const modeManager = getModeManager();
    const mode = modeManager.getMode(modeId);

    if (!mode) {
      console.error("[MenuScene] Mode not found", { modeId });
      // Still proceed to asset loader so it can fail gracefully or show message
      this.recreateGameplayScenes();
      this.scene.start("AssetLoaderScene", { mode: modeId });
      return;
    }

    // Versus modes route through MatchmakingScene for online pairing
    if (modeId === "versus_guideline" || modeId === "versus_tgm") {
      const queueType = modeId === "versus_tgm" ? "tgm" : "guideline";
      this.scene.start("MatchmakingScene", { queueType });
      return;
    }

    if (this.shouldSkipStartingLevelPrompt(currentModeType.name)) {
      this.launchMode(modeId, mode, 0);
      return;
    }

    this.showStartingLevelPrompt(modeId, mode);
  }

  recreateGameplayScenes() {
    try {
      const rootMgr = this.game && this.game.scene ? this.game.scene : this.scene;
      rootMgr && rootMgr.getScenes && rootMgr.getScenes(true).map((s) => s.scene.key);
      if (this.game && this.game.canvas && this.game.canvas.parentNode) {
        this.game.canvas.parentNode.querySelectorAll("canvas");
      }
    } catch (e) {
      console.warn("[MenuScene] failed to inspect scene state before start", e);
    }

    const rootMgr = this.game && this.game.scene ? this.game.scene : this.scene;
    const recreateScene = (key, ctor) => {
      try {
        if (rootMgr.isActive(key)) {
          rootMgr.stop(key);
        }
        if (rootMgr.getScene(key)) {
          rootMgr.remove(key, true);
        }
        rootMgr.add(key, new ctor(), false);
      } catch (err) {
        console.error(`[MenuScene] failed to recreate scene ${key}`, err);
      }
    };
    recreateScene("AssetLoaderScene", AssetLoaderScene);
    recreateScene("LoadingScreenScene", LoadingScreenScene);
    recreateScene("GameScene", GameScene);
  }

  showStartingLevelPrompt(modeId, mode) {
    const startLevelCap = getStartingLevelCapForMode(mode);
    const roundedCap = Math.floor(startLevelCap / 100) * 100;
    const showRoundsDebugMedals = modeId === "tgm4_rounds";
    const capLabel =
      startLevelCap % 100 === 0
        ? `0-${startLevelCap.toString().padStart(3, "0")}`
        : `0-${roundedCap.toString().padStart(3, "0")} + MAX ${startLevelCap.toString().padStart(3, "0")}`;
    this.pendingStartData = {
      modeId,
      mode,
      startLevelCap,
      startingLevel: getConfiguredStartingLevel(startLevelCap),
      roundsDebugMedals: showRoundsDebugMedals ? 0 : null,
      showRoundsDebugMedals,
    };
    this.startingLevelPromptSelection = 0;
    this.startingLevelPromptActive = true;

    this.startingLevelPromptBg = this.add.graphics().setDepth(10000);
    this.startingLevelPromptBg.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.cameras.main.width, this.cameras.main.height),
      Phaser.Geom.Rectangle.Contains,
    );
    this.startingLevelPromptBg.on("pointerdown", () => {});

    this.startingLevelPromptContainer = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
    );
    this.startingLevelPromptContainer.setDepth(10001);

    const panel = this.add.graphics();
    const panelHeight = showRoundsDebugMedals ? 340 : 280;
    const valueX = 56;
    const leftArrowX = valueX - 120;
    const rightArrowX = valueX + 120;
    const labelX = -185;
    const levelRowY = showRoundsDebugMedals ? -6 : 0;
    panel.fillStyle(0x111111, 0.95);
    panel.fillRect(-240, -panelHeight / 2, 480, panelHeight);
    panel.lineStyle(2, 0xffffff, 1);
    panel.strokeRect(-240, -panelHeight / 2, 480, panelHeight);
    this.startingLevelPromptContainer.add(panel);

    const title = this.add.text(0, showRoundsDebugMedals ? -116 : -96, showRoundsDebugMedals ? "START OPTIONS" : "STARTING LEVEL", {
      fontSize: "28px",
      fill: "#ffff00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.startingLevelPromptContainer.add(title);

    const capText = this.add.text(0, showRoundsDebugMedals ? -78 : -58, capLabel, {
      fontSize: "18px",
      fill: "#ffffff",
      fontFamily: "Courier New",
    }).setOrigin(0.5);
    this.startingLevelPromptContainer.add(capText);

    this.startingLevelPromptLevelLabel = this.add.text(labelX, levelRowY, "LEVEL", {
      fontSize: "22px",
      fill: "#ffff66",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0, 0.5).setInteractive();
    this.startingLevelPromptLevelLabel.on("pointerdown", () => {
      this.startingLevelPromptSelection = 0;
      this.updateStartingLevelPromptDisplay();
    });
    this.startingLevelPromptContainer.add(this.startingLevelPromptLevelLabel);

    this.startingLevelPromptLeftArrow = this.add.text(leftArrowX, levelRowY, "<", {
      fontSize: "42px",
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5).setInteractive();
    this.startingLevelPromptLeftArrow.on("pointerdown", () => {
      this.startingLevelPromptSelection = 0;
      this.adjustPendingStartingLevel(-100);
    });
    this.startingLevelPromptContainer.add(this.startingLevelPromptLeftArrow);

    this.startingLevelPromptValueText = this.add.text(valueX, levelRowY, "000", {
      fontSize: "40px",
      fill: "#00ff00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5).setInteractive();
    this.startingLevelPromptValueText.on("pointerdown", () => {
      this.startingLevelPromptSelection = 0;
      this.updateStartingLevelPromptDisplay();
    });
    this.startingLevelPromptContainer.add(this.startingLevelPromptValueText);

    this.startingLevelPromptRightArrow = this.add.text(rightArrowX, levelRowY, ">", {
      fontSize: "42px",
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5).setInteractive();
    this.startingLevelPromptRightArrow.on("pointerdown", () => {
      this.startingLevelPromptSelection = 0;
      this.adjustPendingStartingLevel(100);
    });
    this.startingLevelPromptContainer.add(this.startingLevelPromptRightArrow);

    if (showRoundsDebugMedals) {
      const medalRowY = 58;
      this.startingLevelPromptRoundsMedalLabel = this.add.text(labelX, medalRowY, "MEDALS EACH", {
        fontSize: "22px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      }).setOrigin(0, 0.5).setInteractive();
      this.startingLevelPromptRoundsMedalLabel.on("pointerdown", () => {
        this.startingLevelPromptSelection = 1;
        this.updateStartingLevelPromptDisplay();
      });
      this.startingLevelPromptContainer.add(this.startingLevelPromptRoundsMedalLabel);

      this.startingLevelPromptRoundsMedalLeftArrow = this.add.text(leftArrowX, medalRowY, "<", {
        fontSize: "42px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      }).setOrigin(0.5).setInteractive();
      this.startingLevelPromptRoundsMedalLeftArrow.on("pointerdown", () => {
        this.startingLevelPromptSelection = 1;
        this.adjustPendingRoundsDebugMedals(-1);
      });
      this.startingLevelPromptContainer.add(this.startingLevelPromptRoundsMedalLeftArrow);

      this.startingLevelPromptRoundsMedalValueText = this.add.text(valueX, medalRowY, "00", {
        fontSize: "36px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      }).setOrigin(0.5).setInteractive();
      this.startingLevelPromptRoundsMedalValueText.on("pointerdown", () => {
        this.startingLevelPromptSelection = 1;
        this.updateStartingLevelPromptDisplay();
      });
      this.startingLevelPromptContainer.add(this.startingLevelPromptRoundsMedalValueText);

      this.startingLevelPromptRoundsMedalRightArrow = this.add.text(rightArrowX, medalRowY, ">", {
        fontSize: "42px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      }).setOrigin(0.5).setInteractive();
      this.startingLevelPromptRoundsMedalRightArrow.on("pointerdown", () => {
        this.startingLevelPromptSelection = 1;
        this.adjustPendingRoundsDebugMedals(1);
      });
      this.startingLevelPromptContainer.add(this.startingLevelPromptRoundsMedalRightArrow);

      const medalNote = this.add.text(0, 96, "APPLIES TO AC / TET / TSP / PIK", {
        fontSize: "14px",
        fill: "#aaaaaa",
        fontFamily: "Courier New",
        align: "center",
      }).setOrigin(0.5);
      this.startingLevelPromptContainer.add(medalNote);
    }

    const confirmButton = this.add.text(0, showRoundsDebugMedals ? 132 : 68, "ENTER TO START", {
      fontSize: "22px",
      fill: "#00ff00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5).setInteractive();
    confirmButton.on("pointerdown", () => {
      this.confirmStartingLevelPrompt();
    });
    this.startingLevelPromptContainer.add(confirmButton);

    const instructions = this.add.text(
      0,
      showRoundsDebugMedals ? 160 : 112,
      showRoundsDebugMedals
        ? "UP/DOWN SELECT  LEFT/RIGHT CHANGE  ENTER CONFIRM  ESC CANCEL"
        : "LEFT/RIGHT CHANGE  ENTER CONFIRM  ESC CANCEL",
      {
        fontSize: "14px",
        fill: "#aaaaaa",
        fontFamily: "Courier New",
        align: "center",
      },
    ).setOrigin(0.5);
    this.startingLevelPromptContainer.add(instructions);

    this.layoutStartingLevelPrompt();
    this.updateStartingLevelPromptDisplay();
  }

  layoutStartingLevelPrompt() {
    if (this.startingLevelPromptBg) {
      this.startingLevelPromptBg.clear();
      this.startingLevelPromptBg.fillStyle(0x000000, 0.85);
      this.startingLevelPromptBg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
      if (this.startingLevelPromptBg.input?.hitArea?.setTo) {
        this.startingLevelPromptBg.input.hitArea.setTo(
          0,
          0,
          this.cameras.main.width,
          this.cameras.main.height,
        );
      }
    }
    if (this.startingLevelPromptContainer) {
      this.startingLevelPromptContainer.setPosition(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
      );
    }
  }

  updateStartingLevelPromptDisplay() {
    if (!this.pendingStartData || !this.startingLevelPromptValueText) return;
    const {
      startingLevel,
      startLevelCap,
      roundsDebugMedals = 0,
      showRoundsDebugMedals = false,
    } = this.pendingStartData;
    const levelSelected = !showRoundsDebugMedals || this.startingLevelPromptSelection === 0;
    this.startingLevelPromptValueText.setText(startingLevel.toString().padStart(3, "0"));
    this.startingLevelPromptValueText.setFill(levelSelected ? "#00ff00" : "#ffffff");
    if (this.startingLevelPromptLevelLabel) {
      this.startingLevelPromptLevelLabel.setFill(levelSelected ? "#ffff66" : "#ffffff");
    }
    if (this.startingLevelPromptLeftArrow) {
      this.startingLevelPromptLeftArrow.setFill(
        startingLevel > 0 ? (levelSelected ? "#00ff00" : "#ffffff") : "#444444",
      );
    }
    if (this.startingLevelPromptRightArrow) {
      this.startingLevelPromptRightArrow.setFill(
        startingLevel < startLevelCap ? (levelSelected ? "#00ff00" : "#ffffff") : "#444444",
      );
    }
    if (showRoundsDebugMedals && this.startingLevelPromptRoundsMedalValueText) {
      const medalsSelected = this.startingLevelPromptSelection === 1;
      this.startingLevelPromptRoundsMedalValueText.setText(
        roundsDebugMedals.toString().padStart(2, "0"),
      );
      this.startingLevelPromptRoundsMedalValueText.setFill(
        medalsSelected ? "#00ff00" : "#ffffff",
      );
      if (this.startingLevelPromptRoundsMedalLabel) {
        this.startingLevelPromptRoundsMedalLabel.setFill(
          medalsSelected ? "#ffff66" : "#ffffff",
        );
      }
      if (this.startingLevelPromptRoundsMedalLeftArrow) {
        this.startingLevelPromptRoundsMedalLeftArrow.setFill(
          roundsDebugMedals > 0 ? (medalsSelected ? "#00ff00" : "#ffffff") : "#444444",
        );
      }
      if (this.startingLevelPromptRoundsMedalRightArrow) {
        this.startingLevelPromptRoundsMedalRightArrow.setFill(
          roundsDebugMedals < 99 ? (medalsSelected ? "#00ff00" : "#ffffff") : "#444444",
        );
      }
    }
  }

  adjustPendingStartingLevel(delta) {
    if (!this.pendingStartData) return;
    const next = normalizeStartLevel(this.pendingStartData.startingLevel + delta, {
      maxLevel: this.pendingStartData.startLevelCap,
    });
    if (next === this.pendingStartData.startingLevel) return;
    this.pendingStartData.startingLevel = next;
    this.updateStartingLevelPromptDisplay();
  }

  adjustPendingRoundsDebugMedals(delta) {
    if (!this.pendingStartData?.showRoundsDebugMedals) return;
    const next = normalizeRoundsDebugMedalCount(
      (this.pendingStartData.roundsDebugMedals || 0) + delta,
    );
    if (next === this.pendingStartData.roundsDebugMedals) return;
    this.pendingStartData.roundsDebugMedals = next;
    this.updateStartingLevelPromptDisplay();
  }

  adjustPendingPromptSelection(delta) {
    if (!this.pendingStartData?.showRoundsDebugMedals) {
      this.adjustPendingStartingLevel(delta < 0 ? 100 : -100);
      return;
    }
    this.startingLevelPromptSelection = (this.startingLevelPromptSelection + delta + 2) % 2;
    this.updateStartingLevelPromptDisplay();
  }

  adjustPendingPromptValue(delta) {
    if (this.pendingStartData?.showRoundsDebugMedals && this.startingLevelPromptSelection === 1) {
      this.adjustPendingRoundsDebugMedals(delta);
      return;
    }
    this.adjustPendingStartingLevel(delta * 100);
  }

  hideStartingLevelPrompt() {
    this.startingLevelPromptActive = false;
    this.pendingStartData = null;
    this.startingLevelPromptSelection = 0;
    if (this.startingLevelPromptBg) {
      this.startingLevelPromptBg.destroy();
      this.startingLevelPromptBg = null;
    }
    if (this.startingLevelPromptContainer) {
      this.startingLevelPromptContainer.destroy(true);
      this.startingLevelPromptContainer = null;
    }
    this.startingLevelPromptLevelLabel = null;
    this.startingLevelPromptValueText = null;
    this.startingLevelPromptLeftArrow = null;
    this.startingLevelPromptRightArrow = null;
    this.startingLevelPromptRoundsMedalLabel = null;
    this.startingLevelPromptRoundsMedalValueText = null;
    this.startingLevelPromptRoundsMedalLeftArrow = null;
    this.startingLevelPromptRoundsMedalRightArrow = null;
  }

  confirmStartingLevelPrompt() {
    if (!this.pendingStartData) return;
    const {
      modeId,
      mode,
      startingLevel,
      startLevelCap,
      roundsDebugMedals = 0,
      showRoundsDebugMedals = false,
    } = this.pendingStartData;
    const normalizedLevel = normalizeStartLevel(startingLevel, {
      maxLevel: startLevelCap,
    });
    localStorage.setItem("startingLevel", String(normalizedLevel));
    this.hideStartingLevelPrompt();
    this.launchMode(
      modeId,
      mode,
      normalizedLevel,
      showRoundsDebugMedals ? normalizeRoundsDebugMedalCount(roundsDebugMedals) : 0,
    );
  }

  launchMode(modeId, mode, startingLevel, roundsDebugMedals = 0) {
    this.selectedModeId = modeId;
    this.recreateGameplayScenes();

    const startLevelCap = getStartingLevelCapForMode(mode);
    this.scene.start("AssetLoaderScene", {
      mode: modeId,
      gameMode: mode,
      startingLevel: normalizeStartLevel(startingLevel, { maxLevel: startLevelCap }),
      roundsDebugMedals: normalizeRoundsDebugMedalCount(roundsDebugMedals),
    });
  }

  isPuzzleMode(modeId) {
    return modeId === "tgm3_sakura";
  }

  // Sakura: during Ready/Go, pressing Hold advances sequence (handled by mode)
  advanceSakuraSequenceWithHold() {
    if (
      this.gameMode &&
      typeof this.gameMode.advanceSequenceWithHold === "function" &&
      this.gameMode.isReadyGoActive &&
      this.gameMode.isReadyGoActive()
    ) {
      this.gameMode.advanceSequenceWithHold(this);
    }
  }

  getLeaderboard(modeId) {
    const key = `leaderboard_${modeId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
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
          level: e.level,
          grade: e.grade,
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
          byDesc(a.level, b.level) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm1":
      case "tgm2":
      case "tgm_plus":
      case "tgm3":
      case "tgm4":
      case "master_20g":
      case "tadeath":
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

  formatLeaderboardEntry(modeId, entry) {
    if (!entry) {
      return { left: "—", middle: "—", right: "—" };
    }

    const fmtTime = (t) => t || "--:--.--";
    const fmtNum = (n) => (n === undefined || n === null ? "—" : n.toString());
    const fmtPps = (n) =>
      n === undefined || n === null ? "—" : Number(n).toFixed(2);

    switch (modeId) {
      case "tgm2_normal": // Normal
        return {
          left: fmtNum(entry.score),
          middle: fmtTime(entry.time),
          right: "",
        };
      case "easy_easy": // Easy - Hanabi | Score | Level
      case "easy_hard": // Easy Hard variant
        return {
          left: fmtNum(entry.hanabi || "—"),
          middle: fmtNum(entry.score || "—"),
          right: `L${fmtNum(entry.level || 0)}`,
        };
      case "sprint_40":
      case "sprint_100": // Sprint
        return {
          left: fmtTime(entry.time),
          middle: fmtNum(entry.score),
          right: fmtPps(entry.pps),
        };
      case "ultra": // Ultra
        return {
          left: fmtNum(entry.score),
          middle: fmtTime(entry.time),
          right: fmtPps(entry.pps),
        };
      case "marathon": // Marathon
        return {
          left: fmtNum(entry.lines),
          middle: fmtPps(entry.pps),
          right: fmtTime(entry.time),
        };
      case "konoha_easy":
      case "konoha_hard": // All Clear
        return {
          left: fmtNum(entry.allClears),
          middle: fmtNum(entry.level),
          right: fmtTime(entry.time),
        };
      case "tgm1":
      case "tgm2":
      case "tgm_plus":
      case "tgm3":
      case "tgm4":
      case "master_20g":
      case "tadeath":
      case "shirase":
      case "tgm4_rounds":
      case "asuka_easy":
      case "asuka_normal":
      case "asuka_hard": // Master, 20G, Race
        return {
          left: entry.grade || "9",
          middle: `L${fmtNum(entry.level)}`,
          right: fmtTime(entry.time),
        };
      default:
        return {
          left: fmtNum(entry.score),
          middle: fmtNum(entry.level || ""),
          right: fmtTime(entry.time),
        };
    }
  }

  getBestScore(mode) {
    const key = `bestScore_${mode}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure all required properties exist with fallbacks
        return {
          score: parsed.score || 0,
          level: parsed.level || 0,
          grade: parsed.grade || "9",
          time: parsed.time || "--:--.--",
        };
      } catch (error) {
        console.warn(`Failed to parse stored score for mode ${mode}:`, error);
      }
    }
    return { score: 0, level: 0, grade: "9", time: "--:--.--" };
  }

  // Get difficulty color for a mode type
  getDifficultyColor(modeTypeName) {
    if (typeof getModeManager !== "undefined") {
      const modeManager = getModeManager();
      return (
        modeManager.difficultyColors[modeTypeName.toLowerCase()] || "#ffffff"
      );
    }
    // Fallback colors if mode manager not available
    const fallbackColors = {
      easy: "#00ff00", // green
      standard: "#0088ff", // blue
      master: "#888888", // grey
      "20g": "#ff0000", // red
      race: "#ff8800", // orange
      "all clear": "#ff69b4", // pink
      puzzle: "#8800ff", // purple
    };
    return fallbackColors[modeTypeName.toLowerCase()] || "#ffffff";
  }

  update() {
    // Check for window resize and update layout if needed
    const currentWindowWidth = window.innerWidth;
    const currentWindowHeight = window.innerHeight;

    if (
      this.windowWidth !== currentWindowWidth ||
      this.windowHeight !== currentWindowHeight
    ) {
      this.windowWidth = currentWindowWidth;
      this.windowHeight = currentWindowHeight;
      this.updateMenuLayout();
    }

    // Keep overlay in sync (e.g., in case of external changes)
    if (this.globalOverlayTexts) {
      createOrUpdateGlobalOverlay(this, { ...this.getOverlayModeInfo(), showMode: false });
    }
  }
}

class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: "SettingsScene" });
    this.keybindLabels = {};
    this.keybindTexts = {};
    this.listeningForKey = null;
    this.keybindActions = {
      moveLeft: "Move Left",
      moveRight: "Move Right",
      softDrop: "Soft Drop",
      rotateCW: "Rotate CW",
      rotateCW2: "Rotate CW (Alt)",
      rotateCCW: "Rotate CCW",
      rotateCCW2: "Rotate CCW (Alt)",
      rotate180: "Rotate 180",
      hardDrop: "Hard Drop",
      hold: "Hold",
      backstep: "Backstep",
      pause: "Pause",
      menu: "Return to Menu",
      restart: "Restart",
    };

    // Volume controls
    this.mainVolumeLabel = null;
    this.mainVolumeText = null;
    this.mainVolumeSlider = null;
    this.mainVolumeSliderFill = null;
    this.mainVolumeKnob = null;

    this.bgmVolumeLabel = null;
    this.bgmVolumeText = null;
    this.bgmVolumeSlider = null;
    this.bgmVolumeSliderFill = null;
    this.bgmVolumeKnob = null;

    this.sfxVolumeLabel = null;
    this.sfxVolumeText = null;
    this.sfxVolumeSlider = null;
    this.sfxVolumeSliderFill = null;
    this.sfxVolumeKnob = null;

    // ARS lock reset mode toggle
    this.arsResetModeText = null;

    // Timing sliders (frames)
    this.dasLabel = null;
    this.dasText = null;
    this.dasSlider = null;
    this.dasSliderFill = null;
    this.dasSliderKnob = null;
    this.draggingDAS = false;
    this.draggingARR = false;
    this.draggingARE = false;
    this.draggingLineARE = false;
    this.draggingSDF = false;
    this.arrLabel = null;
    this.arrText = null;
    this.arrSlider = null;
    this.arrSliderFill = null;
    this.arrSliderKnob = null;
    this.areLabel = null;
    this.areText = null;
    this.areSlider = null;
    this.areSliderFill = null;
    this.areSliderKnob = null;
    this.lineAreLabel = null;
    this.lineAreText = null;
    this.lineAreSlider = null;
    this.lineAreSliderFill = null;
    this.lineAreSliderKnob = null;
    this.sdfLabel = null;
    this.sdfText = null;
    this.sdfSlider = null;
    this.sdfSliderFill = null;
    this.sdfSliderKnob = null;
    this.forceMRollLabel = null;
    this.forceMRollText = null;

    // Zen sandbox toggles
    this.zenBagText = null;
    this.zenAttackTableText = null;
    this.zenCheeseModeText = null;
    this.zenCheesePercentText = null;
    this.zenCheeseRowsText = null;
    this.zenCheeseIntervalText = null;
    this.zenSpinModeText = null;
    this.zenInfiniteResetsText = null;
    this.settingsTabs = [];
    this.activeSettingsTab = "controls";
    this.settingTabObjects = {};
  }

  preload() {
    const ensureImageTexture = (key, url) => {
      if (this.textures.exists(key)) {
        const existingTexture = this.textures.get(key);
        const src =
          existingTexture && existingTexture.source
            ? existingTexture.source[0]
            : null;
        if (!src || !src.image) {
          this.textures.remove(key);
        }
      }
      if (!this.textures.exists(key)) {
        this.load.image(key, url);
      }
    };

    ensureImageTexture("mino_srs", "img/mino.png");
    ensureImageTexture("mino_ars", "img/minoARS.png");
    ensureImageTexture("mono", "img/mono.png");
    ensureImageTexture("mono_ars", "img/monoARS.png");
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.tPieceX = centerX;
    this.tPieceY = centerY - 35;

    this.events.once("shutdown", () => {
      if (this.input && this.input.keyboard) {
        this.input.keyboard.off("keydown", this.onKeyDown, this);
      }
    });

    createOrUpdateGlobalOverlay(this, { modeLabel: "Mode: —", modeTypeName: "" });

    // Title - moved up 50px
    this.add
      .text(centerX, centerY - 200, "Settings", {
        fontSize: "36px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    const tabY = centerY - 145;
    this.settingsTabs = [
      { key: "controls", label: "Controls", x: centerX - 410 },
      { key: "handling", label: "Handling", x: centerX - 190 },
      { key: "rotation", label: "Rotation System", x: centerX + 50 },
      { key: "audio", label: "Audio", x: centerX + 270 },
      { key: "profile", label: "Profile", x: centerX + 490 },
    ].map((tab) => {
      const text = this.add
        .text(tab.x, tabY, tab.label, {
          fontSize: "18px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        })
        .setOrigin(0.5)
        .setInteractive();
      text.on("pointerdown", () => {
        this.setSettingsTab(tab.key);
      });
      return { ...tab, text };
    });

    // Rotation system toggle - moved up 50px
    const rotationSystem = localStorage.getItem("rotationSystem") || "SRS";
    this.rotationText = this.add
      .text(centerX, centerY - 95, `Rotation System: ${rotationSystem}`, {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.rotationText.on("pointerdown", () => {
      const currentSystem = localStorage.getItem("rotationSystem") || "SRS";
      const newSystem = currentSystem === "SRS" ? "ARS" : "SRS";
      localStorage.setItem("rotationSystem", newSystem);
      this.rotationSystem = newSystem;
      this.rotationText.setText(`Rotation System: ${newSystem}`);
      this.updateRotationSystemDisplay(newSystem);
      this.updateArsResetModeVisibility(newSystem);
    });

    // Add T piece display under rotation system text
    this.rotationSystem = rotationSystem;
    this.tPieceDisplay = this.createTPieceDisplay(this.tPieceX, this.tPieceY, this.rotationSystem);
    // Ensure initial display uses correct texture/tint for current selection
    this.updateRotationSystemDisplay(this.rotationSystem);

    // ARS lock reset mode toggle (only relevant when ARS is selected)
    const arsResetIsMove =
      (localStorage.getItem("arsMoveReset") || "false") === "true";
    // ARS reset label (two-line: label + value)
    this.arsResetLabel = this.add
      .text(centerX, centerY + 55, "ARS Lock Reset", {
        fontSize: "18px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.arsResetModeText = this.add
      .text(
        centerX,
        centerY + 80,
        arsResetIsMove ? "Move (SRS-style)" : "Step (default)",
        {
          fontSize: "18px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5)
      .setInteractive();
    this.arsResetModeText.on("pointerdown", () => {
      const current = (localStorage.getItem("arsMoveReset") || "false") === "true";
      const next = !current;
      localStorage.setItem("arsMoveReset", next.toString());
      this.updateArsResetModeText(next);
    });
    this.updateArsResetModeVisibility(rotationSystem);

    // Keybind settings - moved to left side
    const keybindsX = centerX;
    const keybindsY = centerY - 95;

    const keybindsHeader = this.add
      .text(keybindsX, keybindsY - 45, "Keybinds (Click to change)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    let yOffset = keybindsY;
    const spacing = 35;
    const keybindActionKeys = Object.keys(this.keybindActions);
    const keybindRows = Math.ceil(keybindActionKeys.length / 2);

    keybindActionKeys.forEach((action, index) => {
      const columnX = index < keybindRows ? centerX - 290 : centerX + 290;
      yOffset = keybindsY + (index % keybindRows) * spacing;
      // Label
      this.keybindLabels[action] = this.add
        .text(columnX - 25, yOffset, this.keybindActions[action] + ":", {
          fontSize: "18px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        })
        .setOrigin(1, 0.5); // Right-aligned

      // Current keybind
      const currentKey = this.getCurrentKeybind(action);
      this.keybindTexts[action] = this.add
        .text(columnX + 35, yOffset, currentKey, {
          fontSize: "18px",
          fill: "#00ff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0, 0.5)
        .setInteractive(); // Left-aligned

      this.keybindTexts[action].on("pointerdown", () => {
        this.startListeningForKey(action);
      });
    });

    // Volume controls - moved to right side with main volume control
    const volumeX = centerX - 280; // Moved to right
    const volumeY = centerY - 45;

    // Main Volume
    this.mainVolumeLabel = this.add
      .text(volumeX, volumeY - 60, "Master Volume", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Main Volume slider background
    const mainSliderX = volumeX;
    const mainSliderY = volumeY - 20;
    const sliderWidth = 200;
    const sliderHeight = 10;

    this.mainVolumeSlider = this.add.graphics();
    this.mainVolumeSlider.fillStyle(0x333333);
    this.mainVolumeSlider.fillRect(
      mainSliderX - sliderWidth / 2,
      mainSliderY - sliderHeight / 2,
      sliderWidth,
      sliderHeight,
    );

    // Main Volume slider fill
    this.mainVolumeSliderFill = this.add.graphics();
    this.mainVolumeSliderFill.fillStyle(0x00ff00);
    this.mainVolumeSliderFill.fillRect(
      mainSliderX - sliderWidth / 2,
      mainSliderY - sliderHeight / 2,
      sliderWidth * this.getMasterVolume(),
      sliderHeight,
    );

    // Main Volume slider knob
    this.mainVolumeKnob = this.add.graphics();
    this.mainVolumeKnob.fillStyle(0xffffff);
    this.mainVolumeKnob.fillCircle(
      mainSliderX - sliderWidth / 2 + sliderWidth * this.getMasterVolume(),
      mainSliderY,
      8,
    );

    // Main Volume percentage text
    this.mainVolumeText = this.add
      .text(
        mainSliderX,
        mainSliderY + 30,
        `${Math.round(this.getMasterVolume() * 100)}%`,
        {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5);

    // Make Main slider interactive
    this.mainVolumeSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        mainSliderX - sliderWidth / 2,
        mainSliderY - sliderHeight / 2,
        sliderWidth,
        sliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.mainVolumeSlider.on("pointerdown", (pointer) => {
      this.draggingMainVolume = true;
      this.updateMainVolumeFromPointer(pointer);
    });
    this.mainVolumeSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingMainVolume = true;
        this.updateMainVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingMainVolume && pointer.isDown) {
        this.updateMainVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointerup", () => {
      this.draggingMainVolume = false;
    });

    const bgmSliderX = centerX;
    const bgmSliderY = mainSliderY;

    // BGM Volume
    this.bgmVolumeLabel = this.add
      .text(bgmSliderX, volumeY - 60, "BGM Volume", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // BGM Volume slider background

    this.bgmVolumeSlider = this.add.graphics();
    this.bgmVolumeSlider.fillStyle(0x333333);
    this.bgmVolumeSlider.fillRect(
      bgmSliderX - sliderWidth / 2,
      bgmSliderY - sliderHeight / 2,
      sliderWidth,
      sliderHeight,
    );

    // BGM Volume slider fill
    this.bgmVolumeSliderFill = this.add.graphics();
    this.bgmVolumeSliderFill.fillStyle(0x00ff00);
    this.bgmVolumeSliderFill.fillRect(
      bgmSliderX - sliderWidth / 2,
      bgmSliderY - sliderHeight / 2,
      sliderWidth * this.getBGMVolume(),
      sliderHeight,
    );

    // BGM Volume slider knob
    this.bgmVolumeKnob = this.add.graphics();
    this.bgmVolumeKnob.fillStyle(0xffffff);
    this.bgmVolumeKnob.fillCircle(
      bgmSliderX - sliderWidth / 2 + sliderWidth * this.getBGMVolume(),
      bgmSliderY,
      8,
    );

    // BGM Volume percentage text
    this.bgmVolumeText = this.add
      .text(
        bgmSliderX,
        bgmSliderY + 30,
        `${Math.round(this.getBGMVolume() * 100)}%`,
        {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5);

    // Make BGM slider interactive
    this.bgmVolumeSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        bgmSliderX - sliderWidth / 2,
        bgmSliderY - sliderHeight / 2,
        sliderWidth,
        sliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.bgmVolumeSlider.on("pointerdown", (pointer) => {
      this.draggingBGMVolume = true;
      this.updateBGMVolumeFromPointer(pointer);
    });
    this.bgmVolumeSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingBGMVolume = true;
        this.updateBGMVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingBGMVolume && pointer.isDown) {
        this.updateBGMVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointerup", () => {
      this.draggingBGMVolume = false;
    });

    const sfxSliderX = centerX + 280;
    const sfxSliderY = mainSliderY;

    // SFX Volume
    this.sfxVolumeLabel = this.add
      .text(sfxSliderX, volumeY - 60, "SFX Volume", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // SFX Volume slider background

    this.sfxVolumeSlider = this.add.graphics();
    this.sfxVolumeSlider.fillStyle(0x333333);
    this.sfxVolumeSlider.fillRect(
      sfxSliderX - sliderWidth / 2,
      sfxSliderY - sliderHeight / 2,
      sliderWidth,
      sliderHeight,
    );

    // SFX Volume slider fill
    this.sfxVolumeSliderFill = this.add.graphics();
    this.sfxVolumeSliderFill.fillStyle(0x00ff00);
    this.sfxVolumeSliderFill.fillRect(
      sfxSliderX - sliderWidth / 2,
      sfxSliderY - sliderHeight / 2,
      sliderWidth * this.getSFXVolume(),
      sliderHeight,
    );

    // SFX Volume slider knob
    this.sfxVolumeKnob = this.add.graphics();
    this.sfxVolumeKnob.fillStyle(0xffffff);
    this.sfxVolumeKnob.fillCircle(
      sfxSliderX - sliderWidth / 2 + sliderWidth * this.getSFXVolume(),
      sfxSliderY,
      8,
    );

    // SFX Volume percentage text
    this.sfxVolumeText = this.add
      .text(
        sfxSliderX,
        sfxSliderY + 30,
        `${Math.round(this.getSFXVolume() * 100)}%`,
        {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5);

    // Make SFX slider interactive
    this.sfxVolumeSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        sfxSliderX - sliderWidth / 2,
        sfxSliderY - sliderHeight / 2,
        sliderWidth,
        sliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.sfxVolumeSlider.on("pointerdown", (pointer) => {
      this.draggingSFXVolume = true;
      this.updateSFXVolumeFromPointer(pointer);
    });
    this.sfxVolumeSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingSFXVolume = true;
        this.updateSFXVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingSFXVolume && pointer.isDown) {
        this.updateSFXVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointerup", () => {
      this.draggingSFXVolume = false;
      this.draggingDAS = false;
      this.draggingARR = false;
      this.draggingARE = false;
      this.draggingLineARE = false;
      this.draggingSDF = false;
    });

    // Timing sliders (right column, aligned with master volume)
    const timingX = centerX - 300; // move timing sliders further right of audio sliders
    const timingY = centerY - 95; // so DAS slider center lines up with master volume slider
    const timingSliderWidth = 200;
    const timingSliderHeight = 10;

    // DAS slider
    this.dasLabel = this.add
      .text(timingX, timingY, "DAS (frames)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);
    const dasValue = this.getTimingFrames("timing_das_frames", 10);
    const dasSliderY = timingY + 30;

    this.dasSlider = this.add.graphics();
    this.dasSlider.fillStyle(0x333333);
    this.dasSlider.fillRect(
      timingX - timingSliderWidth / 2,
      dasSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.dasSliderFill = this.add.graphics();
    this.dasSliderFill.fillStyle(0x00ff00);
    this.dasSliderFill.fillRect(
      timingX - timingSliderWidth / 2,
      dasSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(dasValue, 1, 20),
      timingSliderHeight,
    );

    this.dasSliderKnob = this.add.graphics();
    this.dasSliderKnob.fillStyle(0xffffff);
    this.dasSliderKnob.fillCircle(
      timingX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(dasValue, 1, 20),
      dasSliderY,
      8,
    );

    this.dasText = this.add
      .text(timingX, dasSliderY + 25, `${dasValue.toFixed(1)}f`, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.dasSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        timingX - timingSliderWidth / 2,
        dasSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.dasSlider.on("pointerdown", (pointer) => {
      this.draggingDAS = true;
      this.updateDASFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: dasSliderY });
    });
    this.dasSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingDAS = true;
        this.updateDASFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: dasSliderY });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingDAS && pointer.isDown) {
        this.updateDASFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: dasSliderY });
      }
    });
    // Initial visual sync for DAS
    this.updateDASDisplay(dasValue, { x: timingX, width: timingSliderWidth, y: dasSliderY });

    // ARR slider
    const arrValue = this.getTimingFrames("timing_arr_frames", 2);
    const arrSliderY = dasSliderY + 70;
    this.arrLabel = this.add
      .text(timingX, arrSliderY - 30, "ARR (frames)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.arrSlider = this.add.graphics();
    this.arrSlider.fillStyle(0x333333);
    this.arrSlider.fillRect(
      timingX - timingSliderWidth / 2,
      arrSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.arrSliderFill = this.add.graphics();
    this.arrSliderFill.fillStyle(0x00ff00);
    this.arrSliderFill.fillRect(
      timingX - timingSliderWidth / 2,
      arrSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(arrValue, 0, 5),
      timingSliderHeight,
    );

    this.arrSliderKnob = this.add.graphics();
    this.arrSliderKnob.fillStyle(0xffffff);
    this.arrSliderKnob.fillCircle(
      timingX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(arrValue, 0, 5),
      arrSliderY,
      8,
    );

    this.arrText = this.add
      .text(timingX, arrSliderY + 25, `${arrValue.toFixed(1)}f`, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.arrSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        timingX - timingSliderWidth / 2,
        arrSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.arrSlider.on("pointerdown", (pointer) => {
      this.draggingARR = true;
      this.updateARRFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: arrSliderY });
    });
    this.arrSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingARR = true;
        this.updateARRFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: arrSliderY });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingARR && pointer.isDown) {
        this.updateARRFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: arrSliderY });
      }
    });
    this.updateARRDisplay(arrValue, { x: timingX, width: timingSliderWidth, y: arrSliderY });

    // ARE slider
    const areValue = this.getTimingFrames("timing_are_frames", 7);
    const areSliderY = arrSliderY + 70;
    this.areLabel = this.add
      .text(timingX, areSliderY - 30, "ARE (frames)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.areSlider = this.add.graphics();
    this.areSlider.fillStyle(0x333333);
    this.areSlider.fillRect(
      timingX - timingSliderWidth / 2,
      areSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.areSliderFill = this.add.graphics();
    this.areSliderFill.fillStyle(0x00ff00);
    this.areSliderFill.fillRect(
      timingX - timingSliderWidth / 2,
      areSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(areValue, 0, 60),
      timingSliderHeight,
    );

    this.areSliderKnob = this.add.graphics();
    this.areSliderKnob.fillStyle(0xffffff);
    this.areSliderKnob.fillCircle(
      timingX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(areValue, 0, 60),
      areSliderY,
      8,
    );

    this.areText = this.add
      .text(timingX, areSliderY + 25, `${areValue.toFixed(0)}f`, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.areSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        timingX - timingSliderWidth / 2,
        areSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.areSlider.on("pointerdown", (pointer) => {
      this.draggingARE = true;
      this.updateAREFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: areSliderY });
    });
    this.areSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingARE = true;
        this.updateAREFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: areSliderY });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingARE && pointer.isDown) {
        this.updateAREFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: areSliderY });
      }
    });
    this.updateAREDisplay(areValue, { x: timingX, width: timingSliderWidth, y: areSliderY });

    // Line ARE / Line Clear Delay slider
    const lineAreValue = this.getTimingFrames("timing_line_are_frames", 7);
    const lineAreX = centerX + 300;
    const lineAreSliderY = dasSliderY;
    this.lineAreLabel = this.add
      .text(lineAreX, lineAreSliderY - 30, "Line ARE / LCD (frames)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.lineAreSlider = this.add.graphics();
    this.lineAreSlider.fillStyle(0x333333);
    this.lineAreSlider.fillRect(
      lineAreX - timingSliderWidth / 2,
      lineAreSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.lineAreSliderFill = this.add.graphics();
    this.lineAreSliderFill.fillStyle(0x00ff00);
    this.lineAreSliderFill.fillRect(
      lineAreX - timingSliderWidth / 2,
      lineAreSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(lineAreValue, 0, 60),
      timingSliderHeight,
    );

    this.lineAreSliderKnob = this.add.graphics();
    this.lineAreSliderKnob.fillStyle(0xffffff);
    this.lineAreSliderKnob.fillCircle(
      lineAreX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(lineAreValue, 0, 60),
      lineAreSliderY,
      8,
    );

    this.lineAreText = this.add
      .text(lineAreX, lineAreSliderY + 25, `${lineAreValue.toFixed(0)}f`, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.lineAreSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        lineAreX - timingSliderWidth / 2,
        lineAreSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.lineAreSlider.on("pointerdown", (pointer) => {
      this.draggingLineARE = true;
      this.updateLineAREFromPointer(pointer, {
        x: lineAreX,
        width: timingSliderWidth,
        y: lineAreSliderY,
      });
    });
    this.lineAreSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingLineARE = true;
        this.updateLineAREFromPointer(pointer, {
          x: lineAreX,
          width: timingSliderWidth,
          y: lineAreSliderY,
        });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingLineARE && pointer.isDown) {
        this.updateLineAREFromPointer(pointer, {
          x: lineAreX,
          width: timingSliderWidth,
          y: lineAreSliderY,
        });
      }
    });
    this.updateLineAREDisplay(lineAreValue, {
      x: lineAreX,
      width: timingSliderWidth,
      y: lineAreSliderY,
    });

    // SDF slider (5x–40x and 20G)
    const sdfDefault = 6; // 6x default
    const sdfValue = this.getStoredTiming("timing_sdf_mult", sdfDefault);
    const sdfSliderY = lineAreSliderY + 70;
    this.sdfLabel = this.add
      .text(lineAreX, sdfSliderY - 30, "SDF (x speed)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.sdfSlider = this.add.graphics();
    this.sdfSlider.fillStyle(0x333333);
    this.sdfSlider.fillRect(
      lineAreX - timingSliderWidth / 2,
      sdfSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.sdfSliderFill = this.add.graphics();
    this.sdfSliderFill.fillStyle(0x00ff00);
    this.sdfSliderFill.fillRect(
      lineAreX - timingSliderWidth / 2,
      sdfSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(sdfValue, 5, 100),
      timingSliderHeight,
    );

    this.sdfSliderKnob = this.add.graphics();
    this.sdfSliderKnob.fillStyle(0xffffff);
    this.sdfSliderKnob.fillCircle(
      lineAreX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(sdfValue, 5, 100),
      sdfSliderY,
      8,
    );

    const sdfDisplay = this.formatSDFDisplay(sdfValue);
    this.sdfText = this.add
      .text(lineAreX, sdfSliderY + 25, sdfDisplay, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.sdfSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        lineAreX - timingSliderWidth / 2,
        sdfSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.sdfSlider.on("pointerdown", (pointer) => {
      this.draggingSDF = true;
      this.updateSDFFromPointer(pointer, { x: lineAreX, width: timingSliderWidth, y: sdfSliderY });
    });
    this.sdfSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingSDF = true;
        this.updateSDFFromPointer(pointer, { x: lineAreX, width: timingSliderWidth, y: sdfSliderY });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingSDF && pointer.isDown) {
        this.updateSDFFromPointer(pointer, { x: lineAreX, width: timingSliderWidth, y: sdfSliderY });
      }
    });
    this.updateSDFDisplay(sdfValue, { x: lineAreX, width: timingSliderWidth, y: sdfSliderY });

    const forceMRollY = sdfSliderY + 70;
    const forceMRollEnabled = this.getForceMRollEnabled();
    this.forceMRollLabel = this.add
      .text(lineAreX, forceMRollY - 24, "Force M-Roll (TGM2 Master)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.forceMRollText = this.add
      .text(lineAreX, forceMRollY, forceMRollEnabled ? "ON" : "OFF", {
        fontSize: "22px",
        fill: forceMRollEnabled ? "#00ff00" : "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();
    this.forceMRollText.on("pointerdown", () => {
      const next = !this.getForceMRollEnabled();
      localStorage.setItem("forceMRoll", next ? "true" : "false");
      this.updateForceMRollDisplay(next);
    });

    // Profile tab UI elements
    const profileLabelY = centerY - 60;
    this.profileNameLabel = this.add.text(centerX, profileLabelY, "Profile Name", {
      fontSize: "20px",
      fill: "#ffff00",
      fontFamily: "Courier New",
    }).setOrigin(0.5);

    const playerName = typeof window.achievementSystem !== "undefined"
      ? (window.achievementSystem.getPlayerName() || "Player")
      : "Player";

    this.profileNameText = this.add.text(centerX, profileLabelY + 35, playerName, {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.profileEditButton = this.add.text(centerX, profileLabelY + 75, "Edit Name", {
      fontSize: "18px",
      fill: "#00ff00",
      fontFamily: "Courier New",
    }).setOrigin(0.5).setInteractive();
    this.profileEditButton.on("pointerdown", () => this.editProfileName());
    this.profileEditButton.on("pointerover", () => this.profileEditButton.setStyle({ fill: "#ffff00" }));
    this.profileEditButton.on("pointerout", () => this.profileEditButton.setStyle({ fill: "#00ff00" }));

    // Reset to defaults button - moved down 70px
    this.resetButton = this.add
      .text(centerX, centerY + 210, "Reset to Defaults", {
        fontSize: "18px",
        fill: "#ff8800",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.resetButton.on("pointerdown", () => {
      this.resetKeybindsToDefaults();
    });

    // Reset high scores button - moved down 70px
    this.resetScoresButton = this.add
      .text(centerX, centerY + 255, "Reset High Scores", {
        fontSize: "18px",
        fill: "#ff8800",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.resetScoresButton.on("pointerdown", () => {
      this.resetHighScores();
    });

    this.settingTabObjects = {
      controls: [
        keybindsHeader,
        ...Object.values(this.keybindLabels),
        ...Object.values(this.keybindTexts),
      ],
      handling: [
        this.dasLabel,
        this.dasSlider,
        this.dasSliderFill,
        this.dasSliderKnob,
        this.dasText,
        this.arrLabel,
        this.arrSlider,
        this.arrSliderFill,
        this.arrSliderKnob,
        this.arrText,
        this.areLabel,
        this.areSlider,
        this.areSliderFill,
        this.areSliderKnob,
        this.areText,
        this.lineAreLabel,
        this.lineAreSlider,
        this.lineAreSliderFill,
        this.lineAreSliderKnob,
        this.lineAreText,
        this.sdfLabel,
        this.sdfSlider,
        this.sdfSliderFill,
        this.sdfSliderKnob,
        this.sdfText,
        this.forceMRollLabel,
        this.forceMRollText,
      ],
      rotation: [
        this.rotationText,
        this.tPieceDisplay?.container,
        this.arsResetLabel,
        this.arsResetModeText,
      ],
      audio: [
        this.mainVolumeLabel,
        this.mainVolumeSlider,
        this.mainVolumeSliderFill,
        this.mainVolumeKnob,
        this.mainVolumeText,
        this.bgmVolumeLabel,
        this.bgmVolumeSlider,
        this.bgmVolumeSliderFill,
        this.bgmVolumeKnob,
        this.bgmVolumeText,
        this.sfxVolumeLabel,
        this.sfxVolumeSlider,
        this.sfxVolumeSliderFill,
        this.sfxVolumeKnob,
        this.sfxVolumeText,
      ],
      profile: [
        this.profileNameLabel,
        this.profileNameText,
        this.profileEditButton,
      ],
    };
    this.setSettingsTab(this.activeSettingsTab);

    // Back to menu - moved down 70px
    this.backButton = this.add
      .text(centerX, centerY + 310, "Back to Menu", {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.backButton.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });

    // Setup keyboard input for keybind changes
    this.input.keyboard.on("keydown", this.onKeyDown, this);
  }

  setSettingsTab(tabKey) {
    this.activeSettingsTab = tabKey;
    this.settingsTabs.forEach((tab) => {
      tab.text.setFill(tab.key === tabKey ? "#ffff00" : "#ffffff");
    });
    Object.keys(this.settingTabObjects).forEach((key) => {
      const visible = key === tabKey;
      this.settingTabObjects[key].forEach((object) => {
        if (!object) return;
        if (typeof object.setVisible === "function") object.setVisible(visible);
        if (object.input) object.input.enabled = visible;
      });
    });
    this.updateArsResetModeVisibility(this.rotationSystem);
  }

  getCurrentKeybind(action) {
    const keybinds = this.getKeybinds();
    const keyCode = keybinds[action];

    // Create reverse mapping for key codes to names
    const reverseKeyMap = {};
    Object.keys(Phaser.Input.Keyboard.KeyCodes).forEach((key) => {
      reverseKeyMap[Phaser.Input.Keyboard.KeyCodes[key]] = key;
    });

    const keyName = reverseKeyMap[keyCode];

    const displayMap = {
      LEFT: "←",
      RIGHT: "→",
      UP: "↑",
      DOWN: "↓",
      SPACE: "Space",
      ESC: "Esc",
      ENTER: "Enter",
      SHIFT: "Shift",
      CTRL: "Ctrl",
      ALT: "Alt",
      BACKSPACE: "Backspace",
      TAB: "Tab",
      CAPSLOCK: "Caps Lock",
      NUMLOCK: "Num Lock",
      SCROLLLOCK: "Scroll Lock",
      PAUSE: "Pause",
      INSERT: "Insert",
      HOME: "Home",
      PAGEUP: "Page Up",
      PAGEDOWN: "Page Down",
      END: "End",
      DELETE: "Delete",
    };

    let displayName = displayMap[keyName] || keyName;
    if (!keyName) displayName = "Key " + keyCode;
    return displayName;
  }

  getKeybinds() {
    const defaultKeybinds = {
      moveLeft: Phaser.Input.Keyboard.KeyCodes.Z,
      moveRight: Phaser.Input.Keyboard.KeyCodes.C,
      softDrop: Phaser.Input.Keyboard.KeyCodes.S,
      rotateCW: Phaser.Input.Keyboard.KeyCodes.K,
      rotateCW2: Phaser.Input.Keyboard.KeyCodes.UP,
      rotateCCW: Phaser.Input.Keyboard.KeyCodes.SPACE,
      rotateCCW2: Phaser.Input.Keyboard.KeyCodes.SPACE,
      rotate180: Phaser.Input.Keyboard.KeyCodes.X,
      hold: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      backstep: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
      menu: Phaser.Input.Keyboard.KeyCodes.ESC, // Menu and Pause share key
      start: Phaser.Input.Keyboard.KeyCodes.ENTER,
      restart: Phaser.Input.Keyboard.KeyCodes.C,
    };

    const stored = localStorage.getItem("keybinds");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultKeybinds, ...parsed };
      } catch (e) {
        console.error("Failed to parse stored keybinds:", e);
      }
    }

    return defaultKeybinds;
  }

  isZenSandboxActive() {
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isZen = modeIdLower.includes("zen");
    if (isZen && !this.zenSandboxConfig && typeof ZenSandboxHelper !== "undefined") {
      // Lazy-load config so Zen behavior remains active even if sandbox config was not preloaded
      this.zenSandboxConfig = ZenSandboxHelper.loadConfig?.() || this.zenSandboxConfig;
      if (ZenSandboxHelper.resetRuntime) {
        ZenSandboxHelper.resetRuntime(this, this.zenSandboxConfig);
      }
    }
    return isZen;
  }

  tickZenCheese(deltaSeconds = 0) {
    if (!this.isZenSandboxActive || !this.isZenSandboxActive()) return;
    if (!this.zenSandboxConfig) return;
    if (!this.board) return;
    if (this.isPaused) return;
    const { cheeseMode, cheeseInterval, cheesePercent } = this.zenSandboxConfig;
    if (cheeseMode !== "fixed_timing") return;
    const interval = Math.max(0.1, Number(cheeseInterval) || 0.1);
    const rows = 1; // spawn one line at a time for timed injections
    const percent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
    this.zenCheeseTimer = (this.zenCheeseTimer || 0) + deltaSeconds;
    if (this.zenCheeseTimer >= interval) {
      this.board.addCheeseRows(rows, percent);
      this.playGarbageSfx?.(rows);
      this.zenCheeseTimer = 0;
    }
  }

  applyZenCheeseRows(trigger, clearedCount = 0) {
    if (!this.board || !this.zenSandboxConfig) return;
    const { cheeseMode } = this.zenSandboxConfig;
    if (cheeseMode !== "fixed_rows") return;
    this.ensureZenCheeseBaseline(trigger === "line_clear" ? clearedCount : 0);
  }

  ensureZenCheeseBaseline(clearedCount = 0) {
    if (!this.board || !this.zenSandboxConfig) return;
    const { cheeseMode, cheeseRows, cheesePercent } = this.zenSandboxConfig;
    if (cheeseMode !== "fixed_rows") return;
    // Ensure board grids exist so cheese rows can be injected (e.g., immediately on mode start)
    if (!Array.isArray(this.board.grid) || this.board.grid.length === 0) {
      const rowsCount =
        Number.isFinite(this.board.rows) && this.board.rows > 0 ? this.board.rows : 22;
      const cols = Number.isFinite(this.board.cols) && this.board.cols > 0 ? this.board.cols : 10;
      this.board.grid = Array.from({ length: rowsCount }, () => Array(cols).fill(0));
      this.board.fadeGrid = Array.from({ length: rowsCount }, () => Array(cols).fill(0));
      this.board.rows = rowsCount;
      this.board.cols = cols;
    }
    const rowsTarget = Math.max(1, Math.floor(Number(cheeseRows) || 1));
    const percent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
    const bottomGarbage = this.countBottomCheeseRows();
    const missing = Math.max(0, rowsTarget - bottomGarbage);
    // Use Board API to append rows; do not overwrite existing bottom rows
    if (missing > 0 && typeof this.board.addCheeseRows === "function") {
      this.board.addCheeseRows(missing, percent);
    }
  }

  countCheeseRows() {
    if (!this.board || !Array.isArray(this.board.grid)) return 0;
    return this.board.grid.reduce((acc, row) => {
      if (!row || row.length === 0) return acc;
      const allGarbageOrEmpty = row.every((cell) => cell === 0 || cell === 0x444444);
      const hasGarbageBlock = row.some((cell) => cell === 0x444444);
      return acc + (allGarbageOrEmpty && hasGarbageBlock ? 1 : 0);
    }, 0);
  }

  // Counts consecutive garbage rows from the bottom, stopping at the first non-garbage row.
  countBottomCheeseRows() {
    if (!this.board || !Array.isArray(this.board.grid)) return 0;
    let bottomGarbage = 0;
    for (let r = this.board.grid.length - 1; r >= 0; r--) {
      const row = this.board.grid[r];
      if (!row || row.length === 0) break;
      const allGarbageOrEmpty = row.every((cell) => cell === 0 || cell === 0x444444);
      const hasGarbageBlock = row.some((cell) => cell === 0x444444);
      if (allGarbageOrEmpty && hasGarbageBlock) {
        bottomGarbage += 1;
      } else {
        break;
      }
    }
    return bottomGarbage;
  }

  // Hard writer for fixed_rows: directly set bottom rows to garbage with a sliding hole.
  setFixedRowsCheeseBaseline(rowsTarget = 1, percent = 0) {
    if (!this.board) return;
    const rows = Math.max(1, Math.floor(Number(rowsTarget) || 1));
    const cols = Number.isFinite(this.board.cols) && this.board.cols > 0 ? this.board.cols : 10;
    if (!Array.isArray(this.board.grid) || this.board.grid.length === 0) {
      this.board.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    }
    for (let i = 0; i < rows; i++) {
      const rowIdx = this.board.grid.length - 1 - i;
      if (rowIdx < 0) break;
      if (clampedPercent > 0) {
        this.cheeseHoleShiftAccumulator += shiftChance;
        if (this.cheeseHoleShiftAccumulator >= 1) {
          this.cheeseHoleShiftAccumulator -= 1;
          let newHole = Math.floor(Math.random() * cols);
          if (newHole === this.zenCheeseHoleCol) newHole = (newHole + 1) % cols;
          this.zenCheeseHoleCol = newHole;
          if (this.board) this.board.cheeseHoleCol = this.zenCheeseHoleCol;
        }
      }
      this.board.grid[rowIdx] = Array.from({ length: cols }, (_v, c) =>
        c === this.zenCheeseHoleCol ? 0 : 0x444444,
      );
      if (Array.isArray(this.board.fadeGrid) && this.board.fadeGrid[rowIdx]) {
        this.board.fadeGrid[rowIdx] = Array(cols).fill(0);
      }
    }
  }

  playGarbageSfx(lines = 1) {
    if (!this.sound) return;
    const masterVol =
      typeof this.getMasterVolumeSetting === "function" ? this.getMasterVolumeSetting() : 1;
    const sfxVol =
      typeof this.getSFXVolumeSetting === "function" ? this.getSFXVolumeSetting() : 1;
    const volume = 1 * masterVol * sfxVol;
    try {
      // Use dedicated instance so it layers over other SFX (e.g., next-piece sounds)
      const sfx = this.sound.add("garbage", { volume, detune: 0, rate: 1 });
      sfx?.once?.("complete", () => {
        try {
          sfx.destroy();
        } catch {}
      });
      sfx?.play();
    } catch (err) {
      // ignore SFX errors
    }
  }

  handleZenTopout() {
    if (!this.isZenSandboxActive()) {
      return;
    }
    if (this.zenTopoutCooldown) {
      // If cooldown is stuck without a pending finish, clear it and proceed
      if (!this.zenTopoutPendingFinish) {
        this.zenTopoutCooldown = false;
      } else {
        // If cooldown is active but a finish is pending, force-complete to break the stall
        this.finishZenTopout("reenter_force_finish");
        return;
      }
    }
    this.zenTopoutFreezeLogged = false;
    this.zenTopoutCooldown = true;
    this.zenTopoutFreezeActive = true;
    this.zenTopoutPendingFinish = true;
    // Preempt any default GAME OVER handling while Zen recovery is in progress
    this.suppressGameOverOnce = true;
    this.zenTopoutFreezeStart = this.time?.now || Date.now();
    // Stop interacting with the current piece to avoid lock loops during the delay
    this.currentPiece = null;
    this.isGrounded = false;
    this.lockDelay = 0;
    this.lockResetCount = 0;
    this.lineClearDelayActive = false;
    this.lineClearDelayDuration = 0;
    this.pendingLineAREDelay = 0;
    this.areActive = false;
    this.lineClearPhase = false;
    this.gravityAccum = 0;

    // Delay full board reset + respawn to satisfy the 2s topout pause.
    // Fallbacks:
    // - Phaser timer (preferred)
    // - window.setTimeout (safety) to avoid softlock if timer system is paused/missing
    if (this.time && typeof this.time.delayedCall === "function") {
      this.time.delayedCall(2000, () => {
        if (typeof this.finishZenTopout === "function") {
          this.finishZenTopout("timer");
        }
      });
    } else {
      if (typeof this.finishZenTopout === "function") {
        this.finishZenTopout("no_timer");
      }
    }
    if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
      window.setTimeout(() => {
        if (this.zenTopoutPendingFinish && typeof this.finishZenTopout === "function") {
          this.finishZenTopout("window_fallback");
        }
      }, 2200);
    }
  }

  // Emergency: immediate topout recovery without relying on timers/flags
  forceZenTopoutImmediate(reason = "fallback") {
    try {
      console.warn("[ZenTopout] force immediate", { reason });
      // Clear board
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
      this.clearedLines = [];
      this.pendingPowerup = null;
      this.minoRowFadeAlpha = {};
      this.minoFadeActive = false;
      this.fadingComplete = false;
      this.gameOverFadeDoneTime = null;
      this.zenTopoutCooldown = false;
      this.zenTopoutFreezeActive = false;
      this.zenTopoutPendingFinish = false;
      this.suppressGameOverOnce = false;
      this.currentPiece = null;
      this.isGrounded = false;
      if (this.nextPieces.length < 6) this.generateNextPieces();
      this.spawnPiece();
    } catch (err) {
      try {
        console.error("[ZenTopout] force immediate error", err);
      } catch {}
      this.zenTopoutCooldown = false;
      this.zenTopoutFreezeActive = false;
      this.zenTopoutPendingFinish = false;
    }
  }

  finishZenTopout(reason = "timer") {
    if (!this.zenTopoutPendingFinish) {
      return;
    }
    try {
      this.zenTopoutPendingFinish = false;
      // Ensure GAME OVER state is cleared for Zen recovery
      this.gameOver = false;
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;

      // Clear board and reset transient states
      if (this.board) {
        if (typeof this.board.clearAll === "function") {
          this.board.clearAll();
        } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
          for (let r = 0; r < this.board.rows; r++) {
            this.board.grid[r] = Array(this.board.cols).fill(0);
            this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
          }
        }
        // Reapply fixed garbage baseline after topout
        this.ensureZenCheeseBaseline(0);
      }
      this.playSfx?.("fall");
      this.clearedLines = [];
      this.pendingPowerup = null;
      this.minoRowFadeAlpha = {};
      this.minoFadeActive = false;
      this.fadingComplete = false;
      this.gameOverFadeDoneTime = null;

      // Allow new spawns and reset cooldown
      this.zenTopoutCooldown = false;
      this.zenTopoutFreezeActive = false;
      this.suppressGameOverOnce = false;
      this.currentPiece = null;
      this.isGrounded = false;
      // Ensure next queue exists
      if (this.nextPieces.length < 6) {
        this.generateNextPieces();
      }
      // Immediately respawn a fresh piece to recover from topout
      this.spawnPiece();
    } catch (err) {
      // Hard fail-safe: reset cooldown so next update can attempt normal spawn path
      this.zenTopoutCooldown = false;
      this.zenTopoutFreezeActive = false;
      this.zenTopoutPendingFinish = false;
      this.currentPiece = null;
    }
  }

  isZenInfiniteResets() {
    return this.isZenSandboxActive() && this.zenSandboxConfig?.movementResetsInfinite;
  }

  // ... rest of the code remains the same ...
  getZenSpinMode() {
    if (!this.isZenSandboxActive()) return "standard";
    return this.zenSandboxConfig?.spinType || "standard";
  }

  getZenGravityRowsPerSecond(deltaSeconds = 0) {
    if (!this.zenSandboxConfig) return null;
    this.zenGravityTime = (this.zenGravityTime || 0) + (deltaSeconds || 0);
    const cfg = this.zenSandboxConfig;
    const mode = cfg.gravityMode || "none";
    if (mode === "none") return 0;
    if (mode === "static") {
      const rowsPerFrame = Number(cfg.gravityRowsPerFrame || 0) || 0;
      return rowsPerFrame * 60;
    }
    // time-based presets with 30s steps
    const elapsed = this.zenGravityTime || 0;
    const steps = Math.floor(elapsed / 30);
    const presets = {
      minimal: { base: 0.4, inc: 0 }, // constant gentle gravity
      slow: { base: 0.3, inc: 0.1 },
      medium: { base: 0.6, inc: 0.2 },
      fast: { base: 1.2, inc: 0.4 },
    };
    const sel = presets[mode] || presets.minimal;
    const rowsPerSecond = sel.base + steps * sel.inc;
    return Math.min(rowsPerSecond, 20); // clamp to avoid runaway
  }

  getGuidelineAttack(lines, spinInfo, isAllClear, prevBackToBack) {
    const isSpin = !!(spinInfo && spinInfo.isSpin);
    const spinType = spinInfo ? spinInfo.spinType : null;
    const isMini = spinType && spinType.includes("mini");
    // Base attack table for non-spins
    const baseTable = [0, 0, 1, 2, 4]; // 0-4 lines

    let base = 0;
    if (isSpin) {
      if (isMini) {
        base = lines === 2 ? 1 : 0; // mini double = 1, mini single = 0
      } else {
        base = 2 * lines; // tspin clears: 2x lines
      }
    } else {
      base = baseTable[lines] || 0;
    }

    const isDifficult = (lines >= 4 || (isSpin && lines > 0)) && lines > 0;
    const b2bBonus = prevBackToBack && isDifficult ? 1 : 0;
    const allClearBonus = isAllClear ? 10 : 0;

    // Combo additive table (0-indexed by combo count)
    const comboCount = Math.max(0, this.comboCount || 0);
    const comboTable = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3];
    const comboBonus = comboCount < comboTable.length ? comboTable[comboCount] : 4;

    const attack = base + b2bBonus + allClearBonus + comboBonus;

    // B2B chain bookkeeping (reuse existing rules)
    const prevChain = this.b2bChainCount ?? -1;
    let newChain = prevChain;
    let b2bBroken = false;
    if (isDifficult) {
      if (prevChain < 0) {
        newChain = 0; // first difficult clear starts chain at 0
      } else {
        newChain = b2bBonus ? prevChain + 1 : 1;
      }
    } else {
      if (lines > 0) {
        if (prevBackToBack) {
          b2bBroken = true;
        }
        newChain = -1;
      } else {
        newChain = prevChain; // no clear does not break chain
      }
    }
    this.b2bChainCount = newChain;

    return {
      attack,
      isDifficult,
      b2bMaintained: !!b2bBonus,
      b2bBroken,
      prevChain,
      newChain,
    };
  }

  startListeningForKey(action) {
    if (!this.keybindTexts[action]) return;
    if (this.listeningForKey && this.keybindTexts[this.listeningForKey]) {
      this.keybindTexts[this.listeningForKey].setText(this.getCurrentKeybind(this.listeningForKey));
      this.keybindTexts[this.listeningForKey].setStyle({ fill: "#00ff00" });
    }
    this.listeningForKey = action;
    this.keybindTexts[action].setText("Press key...");
    this.keybindTexts[action].setStyle({ fill: "#ffff00" });
  }

  onKeyDown(event) {
    if (this.listeningForKey) {
      const action = this.listeningForKey;
      const keyCode = event.keyCode;

      // Save the new keybind
      const keybinds = this.getKeybinds();
      keybinds[action] = keyCode;
      localStorage.setItem("keybinds", JSON.stringify(keybinds));

      // Update display using the same method as getCurrentKeybind
      const currentKey = this.getCurrentKeybind(action);
      this.keybindTexts[action].setText(currentKey);
      this.keybindTexts[action].setStyle({ fill: "#00ff00" });

      this.listeningForKey = null;
    }
  }

  resetKeybindsToDefaults() {
    localStorage.removeItem("keybinds");
    localStorage.removeItem("masterVolume");
    localStorage.removeItem("timing_das_frames");
    localStorage.removeItem("timing_arr_frames");
    localStorage.removeItem("timing_are_frames");
    localStorage.removeItem("timing_line_are_frames");
    localStorage.removeItem("timing_sdf_mult");
    localStorage.removeItem("startingLevel");
    localStorage.removeItem("forceMRoll");
    // Refresh all keybind displays
    Object.keys(this.keybindActions).forEach((action) => {
      const currentKey = this.getCurrentKeybind(action);
      this.keybindTexts[action].setText(currentKey);
    });
    // Reset volume display
    this.updateVolumeDisplay();
    // Reset timing displays
    this.updateDASDisplay(10, {
      x: this.dasSlider ? this.dasSlider.getBounds().centerX : 0,
      width: this.dasSlider ? this.dasSlider.getBounds().width : 200,
      y: this.dasSlider ? this.dasSlider.getBounds().centerY : 0,
    });
    this.updateARRDisplay(2, {
      x: this.arrSlider ? this.arrSlider.getBounds().centerX : 0,
      width: this.arrSlider ? this.arrSlider.getBounds().width : 200,
      y: this.arrSlider ? this.arrSlider.getBounds().centerY : 0,
    });
    this.updateAREDisplay(7, {
      x: this.areSlider ? this.areSlider.getBounds().centerX : 0,
      width: this.areSlider ? this.areSlider.getBounds().width : 200,
      y: this.areSlider ? this.areSlider.getBounds().centerY : 0,
    });
    this.updateLineAREDisplay(7, {
      x: this.lineAreSlider ? this.lineAreSlider.getBounds().centerX : 0,
      width: this.lineAreSlider ? this.lineAreSlider.getBounds().width : 200,
      y: this.lineAreSlider ? this.lineAreSlider.getBounds().centerY : 0,
    });
    this.updateSDFDisplay(6, {
      x: this.sdfSlider ? this.sdfSlider.getBounds().centerX : 0,
      width: this.sdfSlider ? this.sdfSlider.getBounds().width : 200,
      y: this.sdfSlider ? this.sdfSlider.getBounds().centerY : 0,
    });
    this.updateForceMRollDisplay(false);
  }

  getForceMRollEnabled() {
    return (localStorage.getItem("forceMRoll") || "false") === "true";
  }

  updateForceMRollDisplay(enabled = this.getForceMRollEnabled()) {
    if (!this.forceMRollText) return;
    this.forceMRollText.setText(enabled ? "ON" : "OFF");
    this.forceMRollText.setFill(enabled ? "#00ff00" : "#ffffff");
  }

  // Volume control methods
  getMasterVolume() {
    const volume = localStorage.getItem("masterVolume");
    return volume ? parseFloat(volume) : 1.0;
  }

  getBGMVolume() {
    const volume = localStorage.getItem("bgmVolume");
    return volume ? parseFloat(volume) : 1.0;
  }

  getSFXVolume() {
    const volume = localStorage.getItem("sfxVolume");
    return volume ? parseFloat(volume) : 1.0;
  }

  setMasterVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("masterVolume", clampedVolume.toString());
    this.updateMainVolumeDisplay();
    this.applyEffectiveVolumes();
  }

  setBGMVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("bgmVolume", clampedVolume.toString());
    this.updateBGMVolumeDisplay();
    this.applyEffectiveVolumes();
  }

  setSFXVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("sfxVolume", clampedVolume.toString());
    this.updateSFXVolumeDisplay();
    this.applyEffectiveVolumes();
  }

  applyEffectiveVolumes() {
    // SettingsScene adjusts the global sound manager (master only)
    const master = this.getMasterVolume();
    if (this.sound && typeof this.sound.setVolume === "function") {
      this.sound.setVolume(master);
    }
  }

  updateMainVolumeFromPointer(pointer) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX - 280; // Main slider X position
    const sliderWidth = 200;
    const sliderY = centerY - 65; // Match slider draw position

    // Calculate volume based on pointer position
    const relativeX = pointer.x - (sliderX - sliderWidth / 2);
    const volume = Math.max(0, Math.min(1, relativeX / sliderWidth));

    this.setMasterVolume(volume);
  }

  updateBGMVolumeFromPointer(pointer) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX; // BGM slider X position
    const sliderWidth = 200;
    const sliderY = centerY - 65; // Match slider draw position

    // Calculate volume based on pointer position
    const relativeX = pointer.x - (sliderX - sliderWidth / 2);
    const volume = Math.max(0, Math.min(1, relativeX / sliderWidth));

    this.setBGMVolume(volume);
  }

  updateSFXVolumeFromPointer(pointer) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX + 280; // SFX slider X position
    const sliderWidth = 200;
    const sliderY = centerY - 65; // Match slider draw position

    // Calculate volume based on pointer position
    const relativeX = pointer.x - (sliderX - sliderWidth / 2);
    const volume = Math.max(0, Math.min(1, relativeX / sliderWidth));

    this.setSFXVolume(volume);
  }

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
    return (frames / BASE_FPS) * 1000;
  }

  msToFrames(ms) {
    return (ms / 1000) * BASE_FPS;
  }

  getTimingMs(key, defaultFrames) {
    const defaultMs = this.framesToMs(defaultFrames);
    const raw = this.getStoredTiming(key, defaultMs);
    if (!Number.isFinite(raw)) return defaultMs;
    // Backward compatibility: if old frame value was stored (small number), convert to ms
    if (raw >= 0 && raw <= 120 && raw <= defaultFrames * 2) {
      // Heuristic: values in plausible frame range treated as frames
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

  clampStep(value, min, max, step) {
    const clamped = Math.min(Math.max(value, min), max);
    const stepped = Math.round(clamped / step) * step;
    return Math.min(Math.max(stepped, min), max);
  }

  timingToPct(value, min, max) {
    const clamped = Math.min(Math.max(value, min), max);
    return (clamped - min) / (max - min || 1);
  }

  formatSDFDisplay(value) {
    if (value >= 100) return "20G";
    return `${value.toFixed(0)}x`;
  }

  updateDASFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 1;
    const max = 20;
    const step = 0.1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setTimingFromFrames("timing_das_frames", value);
    this.updateDASDisplay(value, { x, width, y: slider.y });
  }

  updateDASDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 1, 20);
    if (this.dasSliderFill) {
      this.dasSliderFill.clear();
      this.dasSliderFill.fillStyle(0x00ff00);
      this.dasSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.dasSliderKnob) {
      this.dasSliderKnob.clear();
      this.dasSliderKnob.fillStyle(0xffffff);
      this.dasSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.dasText) {
      this.dasText.setText(`${value.toFixed(1)}f`);
    }
  }

  updateARRFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 0;
    const max = 5;
    const step = 0.1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setTimingFromFrames("timing_arr_frames", value);
    this.updateARRDisplay(value, { x, width, y: slider.y });
  }

  updateARRDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 0, 5);
    if (this.arrSliderFill) {
      this.arrSliderFill.clear();
      this.arrSliderFill.fillStyle(0x00ff00);
      this.arrSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.arrSliderKnob) {
      this.arrSliderKnob.clear();
      this.arrSliderKnob.fillStyle(0xffffff);
      this.arrSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.arrText) {
      this.arrText.setText(`${value.toFixed(1)}f`);
    }
  }

  updateAREFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 0;
    const max = 60;
    const step = 1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setTimingFromFrames("timing_are_frames", value);
    this.updateAREDisplay(value, { x, width, y: slider.y });
  }

  updateAREDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 0, 60);
    if (this.areSliderFill) {
      this.areSliderFill.clear();
      this.areSliderFill.fillStyle(0x00ff00);
      this.areSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.areSliderKnob) {
      this.areSliderKnob.clear();
      this.areSliderKnob.fillStyle(0xffffff);
      this.areSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.areText) {
      this.areText.setText(`${value.toFixed(0)}f`);
    }
  }

  updateLineAREFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 0;
    const max = 60;
    const step = 1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setTimingFromFrames("timing_line_are_frames", value);
    this.updateLineAREDisplay(value, { x, width, y: slider.y });
  }

  updateLineAREDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 0, 60);
    if (this.lineAreSliderFill) {
      this.lineAreSliderFill.clear();
      this.lineAreSliderFill.fillStyle(0x00ff00);
      this.lineAreSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.lineAreSliderKnob) {
      this.lineAreSliderKnob.clear();
      this.lineAreSliderKnob.fillStyle(0xffffff);
      this.lineAreSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.lineAreText) {
      this.lineAreText.setText(`${value.toFixed(0)}f`);
    }
  }

  shouldAllowAREInputs() {
    if (this.disableIhsIrsForZeroArr) return false;
    const lineAre = this.lineAreOverride || 0;
    const lineClearDelay = this.lineClearDelayOverride || 0;
    return this.areDelay > 0 || this.pendingLineAREDelay > 0 || lineAre > 0 || lineClearDelay > 0;
  }

  updateSDFFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 5;
    const max = 100; // 100 represents 20G
    const step = 1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setStoredTiming("timing_sdf_mult", value);
    this.updateSDFDisplay(value, { x, width, y: slider.y });
  }

  updateSDFDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 5, 100);
    if (this.sdfSliderFill) {
      this.sdfSliderFill.clear();
      this.sdfSliderFill.fillStyle(0x00ff00);
      this.sdfSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.sdfSliderKnob) {
      this.sdfSliderKnob.clear();
      this.sdfSliderKnob.fillStyle(0xffffff);
      this.sdfSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.sdfText) {
      this.sdfText.setText(this.formatSDFDisplay(value));
    }
  }

  updateMainVolumeDisplay() {
    const volume = this.getMasterVolume();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX - 280;
    const sliderWidth = 200;
    const sliderY = centerY - 65;

    // Update slider fill
    if (this.mainVolumeSliderFill) {
      this.mainVolumeSliderFill.clear();
      this.mainVolumeSliderFill.fillStyle(0x00ff00);
      this.mainVolumeSliderFill.fillRect(
        sliderX - sliderWidth / 2,
        sliderY - 5,
        sliderWidth * volume,
        10,
      );
    }

    // Update knob position
    if (this.mainVolumeKnob) {
      this.mainVolumeKnob.clear();
      this.mainVolumeKnob.fillStyle(0xffffff);
      this.mainVolumeKnob.fillCircle(
        sliderX - sliderWidth / 2 + sliderWidth * volume,
        sliderY,
        8,
      );
    }

    // Update text
    if (this.mainVolumeText) {
      this.mainVolumeText.setText(`${Math.round(volume * 100)}%`);
    }
  }

  updateBGMVolumeDisplay() {
    const volume = this.getBGMVolume();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX;
    const sliderWidth = 200;
    const sliderY = centerY - 65;

    // Update slider fill
    if (this.bgmVolumeSliderFill) {
      this.bgmVolumeSliderFill.clear();
      this.bgmVolumeSliderFill.fillStyle(0x00ff00);
      this.bgmVolumeSliderFill.fillRect(
        sliderX - sliderWidth / 2,
        sliderY - 5,
        sliderWidth * volume,
        10,
      );
    }

    // Update knob position
    if (this.bgmVolumeKnob) {
      this.bgmVolumeKnob.clear();
      this.bgmVolumeKnob.fillStyle(0xffffff);
      this.bgmVolumeKnob.fillCircle(
        sliderX - sliderWidth / 2 + sliderWidth * volume,
        sliderY,
        8,
      );
    }

    // Update text
    if (this.bgmVolumeText) {
      this.bgmVolumeText.setText(`${Math.round(volume * 100)}%`);
    }
  }

  updateSFXVolumeDisplay() {
    const volume = this.getSFXVolume();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX + 280;
    const sliderWidth = 200;
    const sliderY = centerY - 65;

    // Update slider fill
    if (this.sfxVolumeSliderFill) {
      this.sfxVolumeSliderFill.clear();
      this.sfxVolumeSliderFill.fillStyle(0x00ff00);
      this.sfxVolumeSliderFill.fillRect(
        sliderX - sliderWidth / 2,
        sliderY - 5,
        sliderWidth * volume,
        10,
      );
    }

    // Update knob position
    if (this.sfxVolumeKnob) {
      this.sfxVolumeKnob.clear();
      this.sfxVolumeKnob.fillStyle(0xffffff);
      this.sfxVolumeKnob.fillCircle(
        sliderX - sliderWidth / 2 + sliderWidth * volume,
        sliderY,
        8,
      );
    }

    // Update text
    if (this.sfxVolumeText) {
      this.sfxVolumeText.setText(`${Math.round(volume * 100)}%`);
    }
  }

  resetKeybindsToDefaults() {
    localStorage.removeItem("keybinds");
    localStorage.removeItem("masterVolume");
    localStorage.removeItem("bgmVolume");
    localStorage.removeItem("sfxVolume");
    // Refresh all keybind displays
    Object.keys(this.keybindActions).forEach((action) => {
      const currentKey = this.getCurrentKeybind(action);
      this.keybindTexts[action].setText(currentKey);
    });
    // updateVolumeDisplay() {
    this.updateMainVolumeDisplay();
    this.updateBGMVolumeDisplay();
    this.updateSFXVolumeDisplay();

    this.applyEffectiveVolumes();
  }

  resetHighScores() {
    // Get all mode types from MenuScene
    const modeTypes = [
      {
        name: "EASY",
        modes: [
          {
            id: "tgm2_normal",
            name: "Normal",
            description: "Score as many points as you can within 300 levels!",
          },
          {
            id: "easy_easy",
            name: "Easy",
            description: "Clear lines, light fireworks. Have fun!",
          },
        ],
      },
      {
        name: "STANDARD",
        modes: [
          {
            id: "sprint_40",
            name: "Sprint 40L",
            description: "Clear 40 lines as fast as possible",
          },
          {
            id: "sprint_100",
            name: "Sprint 100L",
            description: "Clear 100 lines as fast as possible",
          },
          { id: "ultra", name: "Ultra", description: "2-minute score attack" },
          { id: "marathon", name: "Marathon", description: "Clear 150 lines" },
          { id: "zen", name: "Zen", description: "Endless relaxed play" },
        ],
      },
      {
        name: "MASTER",
        modes: [
          {
            id: "tgm1",
            name: "TGM1",
            description:
              "The Tetris game you know and love. Scale through the grades and be a Grand Master!",
          },
          {
            id: "tgm2",
            name: "TGM2",
            description:
              "Brand new mechanics, brand new challenges! Do you have what it takes?",
          },
          {
            id: "tgm3",
            name: "TGM3",
            description: "Try to be COOL!!, or you will REGRET!! it",
          },
          { id: "tgm4", name: "TGM4", description: "Patience is key..." },
          {
            id: "tgm_plus",
            name: "TGM+",
            description: "Rising garbage mode. Master the art of survival!",
          },
        ],
      },
      {
        name: "20G",
        modes: [
          {
            id: "master_20g",
            name: "20G",
            description: "Maximum gravity from the start! Good luck!",
          },
          {
            id: "tadeath",
            name: "T.A.Death",
            description: "Difficult 20G challenge mode. Speed is key!",
          },
          {
            id: "shirase",
            name: "Shirase",
            description: "Lightning-fast speeds. Do you have what it takes?",
          },
          {
            id: "tgm4_rounds",
            name: "Rounds",
            description:
              "Brand new, unique game mechanics. Can you handle them?",
          },
        ],
      },
      {
        name: "RACE",
        modes: [
          {
            id: "asuka_easy",
            name: "Asuka Easy",
            description: "20G Tetris stacking introduction",
          },
          {
            id: "asuka_normal",
            name: "Asuka",
            description: "Race mode. Finish 1300 levels in 7 minutes.",
          },
          {
            id: "asuka_hard",
            name: "Asuka Hard",
            description: "The true test of skill and speed!",
          },
        ],
      },
      {
        name: "ALL CLEAR",
        modes: [
          {
            id: "konoha_easy",
            name: "Konoha Easy",
            description: "Easy all-clear challenge with 5 pieces!",
          },
          {
            id: "konoha_hard",
            name: "Konoha Hard",
            description: "Hard all-clear challenge with all 7 pieces!",
          },
        ],
      },
      {
        name: "PUZZLE",
        modes: [
          {
            id: "tgm3_sakura",
            name: "TGM3-Sakura",
            description: "Puzzle mode from TGM3",
          },
          {
            id: "flashpoint",
            name: "Flashpoint",
            description: "From Flashpoint.",
          },
        ],
      },
    ];

    // Clear all high scores
    modeTypes.forEach((modeType) => {
      modeType.modes.forEach((mode) => {
        localStorage.removeItem(`bestScore_${mode.id}`);
        localStorage.removeItem(`leaderboard_${mode.id}`);
      });
    });

    // Show confirmation message
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const confirmationText = this.add
      .text(centerX, centerY + 320, "High scores reset to defaults!", {
        fontSize: "16px",
        fill: "#00ff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Remove confirmation after 2 seconds
    this.time.delayedCall(2000, () => {
      confirmationText.destroy();
    });
  }

  createTPieceDisplay(centerX, centerY, system = this.rotationSystem) {
    const container = this.add.container(centerX, centerY);

    // Create T piece minos
    const minoSize = 20;
    const minos = [];

    // Get T piece shape and color based on rotation system
    const rotations =
      system === "ARS" ? SEGA_ROTATIONS.T.rotations : TETROMINOES.T.rotations;
    const color = system === "ARS" ? ARS_COLORS.T : TETROMINOES.T.color;
    const textureKey = system === "ARS" ? "mino_ars" : "mino_srs";

    // T piece shape in rotation 0 (3-wide)
    const shape = rotations[0];

    // Create mino sprites - use actual textures if available, otherwise fallback to colored rectangles
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (shape[r][c]) {
          // Center the T piece around (0,0) in the container
          const offsetX = (c - 1) * minoSize; // Center horizontally around c=1
          const offsetY = (r - 0.5) * minoSize; // Center vertically around r=0.5 (middle of the T)

          const texture = this.textures ? this.textures.get(textureKey) : null;
          const textureSource = texture && texture.source ? texture.source[0] : null;
          const hasValidTextureSource =
            !!texture && !!textureSource && !!textureSource.image;
          if (hasValidTextureSource) {
            const sprite = this.add.sprite(offsetX, offsetY, textureKey);
            sprite.setDisplaySize(minoSize, minoSize);
            sprite.setTint(color);
            minos.push(sprite);
            container.add(sprite);
          } else {
            // Fallback: create colored rectangle
            const graphics = this.add.graphics();
            graphics.fillStyle(color);
            graphics.fillRect(
              offsetX - minoSize / 2,
              offsetY - minoSize / 2,
              minoSize,
              minoSize,
            );
            minos.push(graphics);
            container.add(graphics);
          }
        }
      }
    }

    return { container, minos, rotation: 0 };
  }

  updateRotationSystemDisplay(newSystem) {
    this.rotationSystem = newSystem;

    // Rebuild T piece display to ensure correct texture/color
    if (this.tPieceDisplay && this.tPieceDisplay.container) {
      this.tPieceDisplay.container.destroy(true);
    }
    const centerX = this.tPieceX || this.cameras.main.width / 2;
    const centerY = this.tPieceY || this.cameras.main.height / 2 - 90;
    this.tPieceDisplay = this.createTPieceDisplay(centerX, centerY, newSystem);
    if (this.settingTabObjects && this.settingTabObjects.rotation) {
      this.settingTabObjects.rotation = [
        this.rotationText,
        this.tPieceDisplay?.container,
        this.arsResetLabel,
        this.arsResetModeText,
      ];
      this.tPieceDisplay.container.setVisible(this.activeSettingsTab === "rotation");
    }

    // Animate 360-degree rotation with the new shape/color
    this.tweens.add({
      targets: this.tPieceDisplay.container,
      angle: 360,
      duration: 600,
      ease: "Power2",
      onComplete: () => {
        // Reset angle to 0
        this.tPieceDisplay.container.angle = 0;
      },
    });
  }

  updateTPieceShape(tPiece, rotations, system) {
    const minoSize = 20;
    const color = system === "ARS" ? ARS_COLORS.T : TETROMINOES.T.color;
    const textureKey = system === "ARS" ? "mino_ars" : "mino_srs";

    // Get current rotation (keep same rotation index)
    const currentRotation = tPiece.rotation;
    const shape = rotations[currentRotation];

    // Clear existing minos and recreate them
    tPiece.minos.forEach((mino) => mino.destroy());
    tPiece.minos.length = 0;

    // Recreate mino sprites/graphics with new shape
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (shape[r][c]) {
          // Center the T piece around (0,0) in the container
          const offsetX = (c - 1) * minoSize; // Center horizontally around c=1
          const offsetY = (r - 0.5) * minoSize; // Center vertically around r=0.5

          const texture = this.textures ? this.textures.get(textureKey) : null;
          const textureSource = texture && texture.source ? texture.source[0] : null;
          const hasValidTextureSource =
            !!texture && !!textureSource && !!textureSource.image;
          if (hasValidTextureSource) {
            const sprite = this.add.sprite(offsetX, offsetY, textureKey);
            sprite.setDisplaySize(minoSize, minoSize);
            sprite.setTint(color);
            tPiece.minos.push(sprite);
            tPiece.container.add(sprite);
          } else {
            // Fallback: create colored rectangle
            const graphics = this.add.graphics();
            graphics.fillStyle(color);
            graphics.fillRect(
              offsetX - minoSize / 2,
              offsetY - minoSize / 2,
              minoSize,
              minoSize,
            );
            tPiece.minos.push(graphics);
            tPiece.container.add(graphics);
          }
        }
      }
    }
  }

  updateArsResetModeText(isMoveReset) {
    if (!this.arsResetModeText) return;
    this.arsResetModeText.setText(
      isMoveReset ? "Move (SRS-style)" : "Step (default)",
    );
  }

  updateArsResetModeVisibility(rotationSystem) {
    const visible = rotationSystem === "ARS" && this.activeSettingsTab === "rotation";
    if (this.arsResetModeText) this.arsResetModeText.setVisible(visible);
    if (this.arsResetLabel) this.arsResetLabel.setVisible(visible);
    if (this.arsResetModeText?.input) this.arsResetModeText.input.enabled = visible;
  }

  editProfileName() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Dark overlay background
    this.editNameOverlay = this.add.graphics();
    this.editNameOverlay.fillStyle(0x000000, 0.85);
    this.editNameOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.editNameOverlay.setDepth(10000);

    // Prompt container
    this.editNameContainer = this.add.container(centerX, centerY);
    this.editNameContainer.setDepth(10001);

    // Prompt text
    this.editNameText = this.add.text(0, -60, "Edit Profile Name", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "center",
    }).setOrigin(0.5);
    this.editNameContainer.add(this.editNameText);

    // Create HTML input for name entry
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.placeholder = "Player";
    inputElement.maxLength = 16;
    inputElement.value = typeof window.achievementSystem !== "undefined"
      ? (window.achievementSystem.getPlayerName() || "Player")
      : "Player";
    inputElement.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Courier New', monospace;
      font-size: 20px;
      padding: 10px;
      text-align: center;
      background: #222;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 4px;
      z-index: 10002;
    `;
    document.body.appendChild(inputElement);
    inputElement.focus();
    inputElement.select();

    this.editNameInputElement = inputElement;

    // Handle Enter key on the HTML input directly
    inputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.submitProfileNameEdit();
      }
    });

    // Confirm button
    this.editNameButton = this.add.text(0, 40, "Confirm", {
      fontSize: "18px",
      fill: "#00ff00",
      fontFamily: "Courier New",
      fontStyle: "bold",
    }).setOrigin(0.5).setInteractive();
    this.editNameButton.on("pointerdown", () => this.submitProfileNameEdit());
    this.editNameButton.on("pointerover", () => this.editNameButton.setStyle({ fill: "#ffff00" }));
    this.editNameButton.on("pointerout", () => this.editNameButton.setStyle({ fill: "#00ff00" }));
    this.editNameContainer.add(this.editNameButton);

    // Handle Enter key
    this.editNameEnterKey = this.input.keyboard.on("keydown-ENTER", () => this.submitProfileNameEdit());

    // Store reference for cleanup
    this.editNameActive = true;
  }

  submitProfileNameEdit() {
    if (!this.editNameActive) return;

    const name = this.editNameInputElement.value.trim();

    // Validation: name cannot be empty
    if (!name) {
      this.editNameInputElement.style.borderColor = "#ff0000";
      this.editNameInputElement.focus();
      return;
    }

    if (typeof window.achievementSystem !== "undefined") {
      window.achievementSystem.setPlayerName(name);
    }

    // Update display
    this.profileNameText.setText(name);

    // Cleanup
    this.editNameActive = false;
    this.input.keyboard.off("keydown-ENTER");
    if (this.editNameInputElement && this.editNameInputElement.parentNode) {
      this.editNameInputElement.parentNode.removeChild(this.editNameInputElement);
    }
    if (this.editNameOverlay) {
      this.editNameOverlay.destroy();
    }
    if (this.editNameContainer) {
      this.editNameContainer.destroy();
    }
  }
}

class AssetLoaderScene extends Phaser.Scene {
  constructor() {
    super({ key: "AssetLoaderScene" });
  }

  init(data) {
    this.selectedMode = data.mode || "Mode 1";
    this.gameMode = data.gameMode || null; // Store gameMode from data
    this.gameModeName = data.gameModeName || null; // Store gameModeName from data
    this.startingLevel = normalizeStartLevel(data.startingLevel, {
      maxLevel: getStartingLevelCapForMode(this.gameMode),
    });
    this.roundsDebugMedals = normalizeRoundsDebugMedalCount(data.roundsDebugMedals);
  }

  preload() {
    // Show loading text
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.loadingText = this.add
      .text(centerX, centerY, "LOADING...", {
        fontSize: "48px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const modeId = getModeInfoId(this.gameMode, this.selectedMode);
    createOrUpdateGlobalOverlay(
      this,
      buildModeInfo(modeId, this.gameMode?.getName?.() || modeId),
    );

    const ensureImageTexture = (key, url) => {
      if (this.textures.exists(key)) {
        const existingTexture = this.textures.get(key);
        const src = existingTexture && existingTexture.source ? existingTexture.source[0] : null;
        if (!src || !src.image) {
          this.textures.remove(key);
        }
      }
      if (!this.textures.exists(key)) {
        this.load.image(key, url);
      }
    };

    // Load all assets for the game
    ensureImageTexture("mino_srs", "img/mino.png");
    ensureImageTexture("mino_ars", "img/minoARS.png");
    ensureImageTexture("mono", "img/mono.png");
    ensureImageTexture("mono_ars", "img/monoARS.png");

    // Load BGM files from the correct directory paths
    try {
      // Load MP3 files from bgm directory (Phaser compatible)
      const bgmLoads = [
        ["mf1_1", "bgm/mf1_1.mp3"],
        ["mf1_2", "bgm/mf1_2.mp3"],
        ["mf1_endroll", "bgm/mf1_endroll.mp3"],
        ["mf2_3", "bgm/mf2_3.mp3"],
        ["mf2_4", "bgm/mf2_4.mp3"],
        ["mf2_endroll", "bgm/mf2_endroll.mp3"],
        ["mf3_4", "bgm/mf3_4.mp3"],
        ["mf3_6", "bgm/mf3_6.mp3"],
        ["mf4_endgame", "bgm/mf4_endgame.mp3"],
        ["mf_zen", "bgm/standard/mf_zen.mp3"],
        ["mf_std_1", "bgm/standard/mf_std_1.mp3"],
        ["mf_std_2", "bgm/standard/mf_std_2.mp3"],
        ["mf_std_3", "bgm/standard/mf_std_3.mp3"],
      ];
      bgmLoads.forEach(([key, path]) => {
        if (!this.cache.audio.exists(key)) {
          this.load.audio(key, path);
        }
      });
    } catch (error) {
      console.warn("BGM files could not be loaded from bgm directory", error);
    }

    // Load all sound effects
    const sfxLoads = [
      ["ready", "sfx/ready.wav"],
      ["go", "sfx/go.wav"],
      ["gradeup", "sfx/gradeup.wav"],
      ["complete", "sfx/complete.wav"],
      ["clear", "sfx/clear.wav"],
      ["fall", "sfx/fall.wav"],
      ["sectionchange", "sfx/sectionchange.wav"],
      ["IRS", "sfx/IRS.wav"],
      ["ground", "sfx/ground.wav"],
      ["lock", "sfx/lock.wav"],
      ["sound_s", "sfx/s.wav"],
      ["sound_z", "sfx/z.wav"],
      ["sound_t", "sfx/t.wav"],
      ["sound_j", "sfx/j.wav"],
      ["sound_l", "sfx/l.wav"],
      ["sound_o", "sfx/o.wav"],
      ["sound_i", "sfx/i.wav"],
      ["IHS", "sfx/IHS.wav"],
      ["bell", "sfx/bell.wav"],
      ["applause", "sfx/applause.wav"],
      ["combo", "sfx/combo.wav"],
      ["cool", "sfx/cool.wav"],
      ["jewelclear", "sfx/jewelclear.wav"],
      ["firework", "sfx/firework.wav"],
      ["garbage", "sfx/garbage.wav"],
      ["gameover", "sfx/gameover.wav"],
    ];
    sfxLoads.forEach(([key, path]) => {
      if (!this.cache.audio.exists(key)) {
        this.load.audio(key, path);
      }
    });

    this.load.once("complete", () => {});
  }

  create() {
    // Remove loading text and start game scene
    if (this.loadingText) {
      this.loadingText.destroy();
    }

    // Proceed to loading/ready-go scene
    this.scene.start("LoadingScreenScene", {
      mode: this.selectedMode,
      gameMode: this.gameMode,
      startingLevel: this.startingLevel,
      roundsDebugMedals: this.roundsDebugMedals,
    });
  }
}

class LoadingScreenScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadingScreenScene" });
  }

  init(data) {
    this.selectedMode = data.mode || "Mode 1";
    this.gameMode = data.gameMode || null; // Store gameMode from data
    this.startingLevel = normalizeStartLevel(data.startingLevel, {
      maxLevel: getStartingLevelCapForMode(this.gameMode),
    });
    this.roundsDebugMedals = normalizeRoundsDebugMedalCount(data.roundsDebugMedals);
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const modeId = getModeInfoId(this.gameMode, this.selectedMode);
    createOrUpdateGlobalOverlay(
      this,
      buildModeInfo(modeId, this.gameMode?.getName?.() || modeId),
    );

    // Show loading text briefly, then proceed directly to GameScene
    const loading = this.add
      .text(centerX, centerY, "LOADING...", {
        fontSize: "48px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.time.delayedCall(300, () => {
      if (loading) loading.destroy();
      this.scene.start("GameScene", {
        mode: this.selectedMode,
        gameMode: this.gameMode,
        startingLevel: this.startingLevel,
        roundsDebugMedals: this.roundsDebugMedals,
      });
    });
  }
}
