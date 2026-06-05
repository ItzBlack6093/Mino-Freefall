class Board {
  constructor(rows = 22, cols = 10, cellSize = 24, textureKey = "mino_srs") {
    this.rows = rows || 22;
    this.cols = cols || 10;
    this.grid = [];
    for (let i = 0; i < rows; i++) {
      this.grid[i] = Array(cols).fill(0);
    }
    this.fadeGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    this.frozenGrid = Array.from({ length: rows }, () => Array(cols).fill(false));
    this.occupancyRevision = 0;
    this.cachedOccupancySignature = "";
    this.cachedOccupancyRevision = -1;
  }

  markDirty() {
    this.occupancyRevision = (this.occupancyRevision || 0) + 1;
  }

  getOccupancySignature() {
    if (this.cachedOccupancyRevision === this.occupancyRevision) {
      return this.cachedOccupancySignature;
    }

    let signature = "";
    for (let r = 0; r < this.rows; r++) {
      const row = this.grid[r];
      for (let c = 0; c < this.cols; c++) {
        signature += row[c] ? "1" : "0";
      }
    }
    this.cachedOccupancySignature = signature;
    this.cachedOccupancyRevision = this.occupancyRevision;
    return signature;
  }

  applyMonochromeTextures(scene) {
    const textureKey =
      typeof RotationSystems !== "undefined"
        ? RotationSystems.getTextureKey(scene.rotationSystem, true)
        : scene.rotationSystem === "ARS"
          ? "mono_ars"
          : "mono";
    this.currentTextureKey = textureKey;
  }

  clearMonochromeTextures() {
    this.currentTextureKey = null;
  }

  isValidPosition(piece, x, y) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const newX = x + c;
          const newY = y + r;
          if (
            newX < 0 ||
            newX >= this.cols ||
            newY >= this.rows ||
            (newY >= 0 && this.grid[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placePiece(piece, x, y) {
    const masterPikiiFreezeAt =
      piece.tgm4MasterPikii && Number.isFinite(piece.masterPikiiFreezeAt)
        ? piece.masterPikiiFreezeAt
        : null;
    let changed = false;
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const boardX = x + c;
          const boardY = y + r;
          if (boardX < 0 || boardX >= this.cols || boardY >= this.rows) continue;
          // Valid lock-outs can leave cells above the matrix; skip writing those rows.
          if (boardY < 0) continue;
          if (piece.isPowerup && piece.powerupType) {
            this.grid[boardY][boardX] = {
              color: piece.powerupFillColor || piece.color,
              powerupType: piece.powerupType,
              borderColor: piece.powerupColors ? piece.powerupColors[piece.powerupType] : piece.color,
              originalColor: piece.baseColor || piece.color,
              ...(masterPikiiFreezeAt !== null ? { masterPikiiFreezeAt } : {}),
            };
          } else if (piece.textureKey) {
            this.grid[boardY][boardX] = {
              color: piece.textureKey.startsWith("mono") ? 0xffffff : piece.color,
              textureKey: piece.textureKey,
              ...(masterPikiiFreezeAt !== null ? { masterPikiiFreezeAt } : {}),
            };
          } else {
            this.grid[boardY][boardX] =
              masterPikiiFreezeAt !== null
                ? { color: piece.color, masterPikiiFreezeAt }
                : piece.color;
          }
          if (this.frozenGrid[boardY]?.[boardX] !== undefined) {
            this.frozenGrid[boardY][boardX] = false;
          }
          changed = true;
        }
      }
    }
    if (changed) this.markDirty();
  }

  isFrozenCell(r, c) {
    const cell = this.grid?.[r]?.[c];
    return !!(this.frozenGrid?.[r]?.[c] || cell?.pikiiFrozen);
  }

  isFrozenLine(r) {
    return Array.isArray(this.grid?.[r]) && this.grid[r].some((_cell, c) => this.isFrozenCell(r, c));
  }

  setFrozenRows(startRow, endRow, frozen = true, onlyOccupied = true) {
    if (!Array.isArray(this.frozenGrid) || this.frozenGrid.length !== this.rows) {
      this.frozenGrid = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
    }
    const start = Math.max(0, Math.floor(startRow));
    const end = Math.min(this.rows - 1, Math.floor(endRow));
    for (let r = start; r <= end; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!onlyOccupied || this.grid[r][c]) {
          this.frozenGrid[r][c] = frozen;
          if (this.grid[r][c] && typeof this.grid[r][c] === "object") {
            this.grid[r][c].pikiiFrozen = frozen;
          }
        }
      }
    }
  }

  clearFrozenRows(startRow, endRow) {
    this.setFrozenRows(startRow, endRow, false, false);
  }

  deleteBottomRow() {
    this.grid.pop();
    this.grid.unshift(Array(this.cols).fill(0));
    this.fadeGrid.pop();
    this.fadeGrid.unshift(Array(this.cols).fill(0));
    if (Array.isArray(this.frozenGrid)) {
      this.frozenGrid.pop();
      this.frozenGrid.unshift(Array(this.cols).fill(false));
    }
    this.markDirty();
  }

  clearLines() {
    const linesToClear = [];
    for (let r = 0; r < this.rows; r++) {
      if (this.grid[r].every((cell) => cell !== 0) && !this.isFrozenLine(r)) {
        linesToClear.push(r);
      }
    }
    linesToClear.forEach((line) => {
      this.grid.splice(line, 1);
      this.grid.unshift(Array(this.cols).fill(0));
      this.fadeGrid.splice(line, 1);
      this.fadeGrid.unshift(Array(this.cols).fill(0));
      if (Array.isArray(this.frozenGrid)) {
        this.frozenGrid.splice(line, 1);
        this.frozenGrid.unshift(Array(this.cols).fill(false));
      }
    });
    if (linesToClear.length > 0) this.markDirty();
    return linesToClear.length;
  }

  addCheeseRows(count = 1, cheesePercent = 0, fixedHoleCol = null) {
    // Initialize grid/fadeGrid if missing to allow early preview insertion
    const cols = Number.isFinite(this.cols) && this.cols > 0 ? this.cols : 10;
    if (!Number.isFinite(this.cols) || this.cols <= 0) {
      this.cols = cols;
    }
    const rowsCount =
      Number.isFinite(this.rows) && this.rows > 0
        ? this.rows
        : Array.isArray(this.grid)
          ? this.grid.length
          : 22;
    if (!Array.isArray(this.grid) || this.grid.length === 0) {
      this.grid = Array.from({ length: rowsCount }, () => Array(cols).fill(0));
    }
    if (!Array.isArray(this.fadeGrid) || this.fadeGrid.length === 0) {
      this.fadeGrid = Array.from({ length: rowsCount }, () => Array(cols).fill(0));
    }
    const rowsToAdd = Math.max(0, Math.floor(count));
    // cheesePercent controls how often the hole shifts: 0 = fixed column, 100 = new hole every row.
    const clampedPercent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
    const shiftChance = clampedPercent / 100;
    if (!Number.isFinite(this.cheeseHoleShiftAccumulator)) this.cheeseHoleShiftAccumulator = 0;
    // Persist hole across injections; initialize once (shared with scene if available)
    if (!Number.isInteger(this.cheeseHoleCol)) {
      const seeded =
        Number.isInteger(this.scene?.zenCheeseHoleCol) ? this.scene.zenCheeseHoleCol : Math.floor(Math.random() * cols);
      this.cheeseHoleCol = seeded % cols;
      if (this.scene) this.scene.zenCheeseHoleCol = this.cheeseHoleCol;
    }
    let holeCol = this.cheeseHoleCol;
    if (Number.isInteger(fixedHoleCol)) {
      holeCol = ((fixedHoleCol % cols) + cols) % cols;
      this.cheeseHoleCol = holeCol;
      if (this.scene) this.scene.zenCheeseHoleCol = holeCol;
    }
    for (let i = 0; i < rowsToAdd; i++) {
      // Remove top row to make space
      this.grid.shift();
      this.fadeGrid.shift();
      if (Array.isArray(this.frozenGrid)) this.frozenGrid.shift();

      // Decide hole column for this row
      if (!Number.isInteger(fixedHoleCol) && clampedPercent > 0) {
        this.cheeseHoleShiftAccumulator += shiftChance;
        if (this.cheeseHoleShiftAccumulator >= 1) {
          this.cheeseHoleShiftAccumulator -= 1;
          let newHole = Math.floor(Math.random() * cols);
          // avoid identical hole when shifting
          if (newHole === holeCol) {
            newHole = (newHole + 1) % cols;
          }
          holeCol = newHole;
          this.cheeseHoleCol = holeCol;
          if (this.scene) this.scene.zenCheeseHoleCol = holeCol;
        }
      }

      const row = [];
      for (let c = 0; c < cols; c++) {
        const isHole = c === holeCol;
        row.push(isHole ? 0 : 0x444444);
      }
      this.grid.push(row);
      this.fadeGrid.push(Array(cols).fill(0));
      if (Array.isArray(this.frozenGrid)) this.frozenGrid.push(Array(cols).fill(false));
    }
    if (rowsToAdd > 0) this.markDirty();
    // Play garbage SFX when rows are injected, but only after gameplay has started spawning pieces
    if (rowsToAdd > 0 && this.scene && this.scene.hasSpawnedPiece) {
      if (typeof this.scene.playGarbageSfx === "function") {
        this.scene.playGarbageSfx(rowsToAdd);
      } else if (this.scene.sound) {
        try {
          console.log("[SFX][Board] addCheeseRows fallback play", { rows: rowsToAdd, cheesePercent: clampedPercent });
          this.scene.sound.play("garbage", { volume: 1 });
        } catch {}
      }
    }
  }

  clearAll() {
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = Array(this.cols).fill(0);
      this.fadeGrid[r] = Array(this.cols).fill(0);
      if (Array.isArray(this.frozenGrid)) this.frozenGrid[r] = Array(this.cols).fill(false);
    }
    this.markDirty();
  }

  draw(scene, offsetX, offsetY, cellSize) {
    const hiddenRows = Math.max(0, this.rows - scene.visibleRows);
    const startRow = 0;
    const endRow = Math.min(this.rows, hiddenRows + scene.visibleRows);

    const bigBlocks = !!(scene && scene.bigBlocksActive);
    const drawCellSize = bigBlocks ? cellSize * 2 : cellSize;

    const zenActive = scene?.isZenSandboxActive && scene.isZenSandboxActive();
    for (let r = startRow; r < endRow; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) {
          let rowAlpha =
            scene.minoRowFadeAlpha && scene.minoRowFadeAlpha[r] !== undefined
              ? scene.minoRowFadeAlpha[r]
              : 1;
          if (scene.strobeActive) {
            const t = scene.creditsActive ? scene.creditsTimer || 0 : scene.currentTime || 0;
            const omega = (2 * Math.PI) / 0.5; // 0.5s cycle
            const phase = t * omega + c * 0.15 + r * 0.07;
            const strobe = 0.25 + 0.75 * (0.5 * (Math.sin(phase) + 1));
            rowAlpha *= strobe;
          }
          if (zenActive) {
            if (!scene.minoFadeActive) {
              // Outside the fade animation, use the configured stack opacity.
              rowAlpha = scene.stackAlpha || 1;
            } else {
              // During fade: clamp to the configured stack opacity, allow reaching 0
              const maxAlpha = scene.stackAlpha || 1;
              if (rowAlpha > maxAlpha) rowAlpha = maxAlpha;
              if (rowAlpha < 0) rowAlpha = 0;
            }
          } else if (rowAlpha <= 0) {
            continue;
          }
          if (!zenActive) {
            if (
              scene.fadingRollActive &&
              !scene.invisibleStackActive &&
              this.fadeGrid[r][c] > 0 &&
              (scene.creditsActive ? scene.creditsTimer || 0 : scene.currentTime || 0) >=
                this.fadeGrid[r][c]
            ) {
              continue;
            }
            if (scene.invisibleStackActive) {
              continue;
            }
          }

          const cellVal = this.grid[r][c];
          const isCellObj = cellVal && typeof cellVal === "object";
          const isPowerObj = isCellObj && !!cellVal.powerupType;
          const masterPikiiFrozen =
            isCellObj &&
            (cellVal.frozen ||
              (Number.isFinite(cellVal.masterPikiiFreezeAt) &&
                (scene?.currentTime || 0) >= cellVal.masterPikiiFreezeAt));
          const color = masterPikiiFrozen ? 0xffffff : isCellObj ? cellVal.color : cellVal;
          const textureKey = cellVal?.textureKey
            ? cellVal.textureKey
            : typeof RotationSystems !== "undefined"
              ? RotationSystems.getTextureKey(scene.rotationSystem)
              : scene.rotationSystem === "ARS"
                ? "mino_ars"
                : "mino_srs";
          // Always dim placed stack relative to active piece (even during line clears)
          const baseAlpha = zenActive
            ? rowAlpha // already set to stackAlpha outside fade, or fading value during fade
            : rowAlpha * (scene.stackAlpha || 1);
          const tintColor =
            textureKey.startsWith("mono")
              ? 0xffffff
              : color;
          const hasValidTextureSource =
            !!(scene.textures && scene.textures.exists(textureKey));
          const drawX = offsetX + c * cellSize;
          const drawY = offsetY + (r - hiddenRows) * cellSize;
          // X-ray effect: only render current sweep column (ghost still visible elsewhere)
          if (scene.xrayActive) {
            if (scene.xrayRevealCooldown > 0) {
              continue;
            }
            if (scene.xrayColumn !== c) {
              continue;
            }
          }
          const renderX = bigBlocks ? drawX - cellSize / 2 : drawX;
          const renderY = bigBlocks ? drawY - cellSize / 2 : drawY;

          if (hasValidTextureSource && !isPowerObj) {
            const sprite = scene.add.sprite(renderX, renderY, textureKey);
            sprite.setDisplaySize(drawCellSize, drawCellSize);
            sprite.setTint(tintColor);
            sprite.setAlpha(baseAlpha);
            scene.gameGroup.add(sprite);
          } else {
            const graphics = scene.add.graphics();
            const fillColor = color || 0x010101;
            graphics.fillStyle(fillColor, baseAlpha);
            graphics.fillRect(
              renderX - drawCellSize / 2,
              renderY - drawCellSize / 2,
              drawCellSize,
              drawCellSize,
            );
            if (isPowerObj && cellVal.powerupType) {
              const borderColor = cellVal.borderColor || 0xffffff;
              graphics.lineStyle(2, borderColor, baseAlpha);
              graphics.strokeRect(
                renderX - drawCellSize / 2,
                renderY - drawCellSize / 2,
                drawCellSize,
                drawCellSize,
              );
              graphics.lineStyle(3, borderColor, baseAlpha);
              graphics.fillStyle(borderColor, baseAlpha);
              const cx = drawX;
              const cy = drawY;
              if (cellVal.powerupType === "free_fall") {
                graphics.beginPath();
                graphics.moveTo(cx, cy - cellSize * 0.25);
                graphics.lineTo(cx, cy + cellSize * 0.1);
                graphics.strokePath();
                graphics.fillCircle(cx, cy + cellSize * 0.25, Math.max(1, cellSize * 0.06));
              } else if (cellVal.powerupType === "del_even") {
                const w = cellSize * 0.4;
                const h = cellSize * 0.08;
                graphics.fillRect(cx - w / 2, cy - cellSize * 0.12, w, h);
                graphics.fillRect(cx - w / 2, cy + cellSize * 0.05, w, h);
              }
            }
            scene.gameGroup.add(graphics);
          }
        }
      }
    }
  }

  // End of Board class
}

class Piece {
  constructor(type, rotationSystem = "SRS", initialRotation = 0, textureKey = null) {
    this.type = type;
    this.rotationSystem =
      typeof RotationSystems !== "undefined"
        ? RotationSystems.normalize(rotationSystem)
        : rotationSystem;
    this.rotation = initialRotation;
    this.textureKey =
      textureKey ||
      (typeof RotationSystems !== "undefined"
        ? RotationSystems.getTextureKey(this.rotationSystem)
        : this.rotationSystem === "ARS"
          ? "mino_ars"
          : "mino_srs");
    const rotations =
      typeof RotationSystems !== "undefined"
        ? RotationSystems.getRotations(type, rotationSystem)
        : rotationSystem === "ARS"
          ? SEGA_ROTATIONS[type].rotations
          : TETROMINOES[type].rotations;
    this.shape = rotations[initialRotation].map((row) => [...row]); // Start with specified rotation
    this.color =
      typeof RotationSystems !== "undefined"
        ? RotationSystems.getColor(type, rotationSystem)
        : rotationSystem === "ARS"
          ? ARS_COLORS[type]
          : TETROMINOES[type].color;
    this.x = 3; // spawn position
    if (this.type === "O") this.x = 4; // Move O piece 1 column to the right
    this.y = 1; // Spawn at rows 18-19 from bottom (equivalent to rows 1-2 from top) - will be overridden in spawnPiece
    this.fractionalY = 0; // For fractional gravity movement
    this.rotation = initialRotation;
    // Finesse tracking (per piece)
    this.finesseInputs = {
      moves: 0, // horizontal moves (DAS start counts as 1, each tap as 1)
      rotations: 0, // rotation key presses
    };
  }

  getRotatedShape() {
    const rotations =
      typeof RotationSystems !== "undefined"
        ? RotationSystems.getRotations(this.type, this.rotationSystem)
        : this.rotationSystem === "ARS"
          ? SEGA_ROTATIONS[this.type].rotations
          : TETROMINOES[this.type].rotations;
    return rotations[this.rotation] || rotations[0]; // Fallback to first rotation
  }

  rotate(board, direction, rotationSystem = "SRS") {
    if (typeof RotationSystems !== "undefined") {
      return RotationSystems.rotatePiece(this, board, direction, rotationSystem);
    }
    const rotations =
      rotationSystem === "ARS"
        ? SEGA_ROTATIONS[this.type].rotations
        : TETROMINOES[this.type].rotations;
    const rotationStates = rotations.length;
    const newRotation =
      (this.rotation + direction + rotationStates) % rotationStates; // Proper cycling
    const newShape = rotations[newRotation];

    if (rotationSystem === "ARS") {
      // ARS (Arika Rotation System) implementation
      return this.rotateARS(board, direction, newRotation, newShape);
    } else {
      // SRS (Super Rotation System) implementation
      return this.rotateSRS(board, direction, newRotation, newShape);
    }
  }

  rotateARS(board, direction, newRotation, newShape) {
    if (this.type === "I") {
      // I-piece uses special ARS kick table with wall and floor kicks (TGM3 Classic)
      const isCW = direction === 1;
      const kickTable = isCW ? ARS_KICKS.I_CW : ARS_KICKS.I_CCW;
      const kickTableIndex = this.rotation;

      for (let i = 0; i < kickTable[kickTableIndex].length; i++) {
        const kick = kickTable[kickTableIndex][i];
        const newX = this.x + kick[0];
        const newY = this.y + kick[1];
        if (board.isValidPosition({ shape: newShape }, newX, newY)) {
          this.x = newX;
          this.y = newY;
          this.shape = newShape.map((row) => [...row]);
          this.rotation = newRotation;
          return true;
        }
      }
    } else if (this.type === "O") {
      // O-piece: no kicks in ARS
      if (board.isValidPosition({ shape: newShape }, this.x, this.y)) {
        this.shape = newShape.map((row) => [...row]);
        this.rotation = newRotation;
        return true;
      }
    } else {
      // JLSTZ use ARS kick tables (TGM3 Classic ordering)
      const isCW = direction === 1;
      const kickTable = isCW ? ARS_KICKS.JLSTZ_CW : ARS_KICKS.JLSTZ_CCW;
      const table = kickTable[this.rotation];
      for (let i = 0; i < table.length; i++) {
        const kick = table[i];
        const newX = this.x + kick[0];
        const newY = this.y + kick[1];
        if (board.isValidPosition({ shape: newShape }, newX, newY)) {
          this.x = newX;
          this.y = newY;
          this.shape = newShape.map((row) => [...row]);
          this.rotation = newRotation;
          return true;
        }
      }
    }

    return false;
  }

  rotateSRS(board, direction, newRotation, newShape) {
    const isCW = direction === 1;

    // Select kick tables based on piece type; O-piece has no kicks
    if (this.type === "O") {
      if (board.isValidPosition({ shape: newShape }, this.x, this.y)) {
        this.shape = newShape.map((row) => [...row]);
        this.rotation = newRotation;
        return true;
      }
      return false;
    }

    const kicks =
      this.type === "I"
        ? isCW
          ? SRS_KICKS.I_CW
          : SRS_KICKS.I_CCW
        : isCW
          ? SRS_KICKS.JLSTZ_CW
          : SRS_KICKS.JLSTZ_CCW;

    const kickTable = kicks[this.rotation];

    for (let i = 0; i < kickTable.length; i++) {
      const kick = kickTable[i];
      const newX = this.x + kick[0];
      const newY = this.y + kick[1];
      if (board.isValidPosition({ shape: newShape }, newX, newY)) {
        this.x = newX;
        this.y = newY;
        this.shape = newShape.map((row) => [...row]);
        this.rotation = newRotation;
        return true;
      }
    }
    return false;
  }

  move(board, dx, dy) {
    const newX = this.x + dx;
    const newY = this.y + dy;
    if (board.isValidPosition(this, newX, newY)) {
      this.x = newX;
      this.y = newY;
      this.fractionalY = this.y; // Reset fractional tracking
      return true;
    }
    return false;
  }

  playGroundSound(scene) {
    if (scene && scene.sound && typeof scene.playSfx === "function") {
      scene.playSfx("ground", 0.4);
    }
  }

  isTouchingGround(board) {
    // Check if piece is touching the ground (bottom of stack or matrix bottom)
    // This checks if any part of the piece is at the bottom row or on top of existing blocks
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          const boardX = this.x + c;
          const boardY = this.y + r;

          // Check if at bottom of matrix
          if (boardY >= board.rows - 1) {
            return true;
          }

          // Check if block below is occupied (touching stack)
          if (boardY + 1 >= 0 && board.grid[boardY + 1][boardX]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  moveFractional(board, dx, dy) {
    // For fractional movements, we need to track sub-pixel positions
    if (!this.fractionalY) {
      this.fractionalY = this.y;
    }

    this.fractionalY += dy;

    // Only move when we've accumulated a full row
    if (this.fractionalY >= this.y + 1) {
      if (this.move(board, 0, 1)) {
        this.y = Math.floor(this.fractionalY);
        return true;
      }
      return false;
    }
    return true; // Still moving fractionally
  }

  canMoveDown(board) {
    return board.isValidPosition(this, this.x, this.y + 1);
  }

  hardDrop(board) {
    while (this.move(board, 0, 1)) {}
  }

  draw(scene, offsetX, offsetY, cellSize, ghost = false, alpha = 1, useBigBlocks = true, renderOptions = {}) {
    const finalAlpha = ghost ? 0.3 : alpha;
    const bigBlocks = useBigBlocks && !!(scene && scene.bigBlocksActive);
    const drawCellSize = bigBlocks ? cellSize * 2 : cellSize;
    const hiddenRows = Math.max(0, (scene?.board?.rows || 0) - (scene?.visibleRows || 0));
    const minimumBoardY =
      renderOptions.minimumBoardY !== undefined ? renderOptions.minimumBoardY : hiddenRows;
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          const pieceY = this.y + r;
          if (pieceY >= minimumBoardY) {
            const textureKey =
              this.textureKey ||
              (typeof RotationSystems !== "undefined"
                ? RotationSystems.getTextureKey(scene?.rotationSystem || this.rotationSystem)
                : scene.rotationSystem === "ARS" || this.rotationSystem === "ARS"
                  ? "mino_ars"
                  : "mino_srs");
            const tintColor =
              textureKey.startsWith("mono")
                ? 0xffffff
                : this.color;
            const hasValidTextureSource =
              !!(scene.textures && scene.textures.exists(textureKey));
            const drawX = offsetX + (this.x + c) * cellSize;
            const drawY = offsetY + (pieceY - hiddenRows) * cellSize;
            const renderX = bigBlocks ? drawX - cellSize / 2 : drawX;
            const renderY = bigBlocks ? drawY - cellSize / 2 : drawY;
            if (hasValidTextureSource) {
              const sprite = scene.add.sprite(
                renderX,
                renderY,
                textureKey,
              );
              sprite.setDisplaySize(drawCellSize, drawCellSize);
              sprite.setTint(tintColor);
              sprite.setAlpha(finalAlpha);
              scene.gameGroup.add(sprite);
            } else {
              const graphics = scene.add.graphics();
              const fillColor =
                textureKey.startsWith("mono")
                  ? 0xffffff
                  : this.color;
              graphics.fillStyle(fillColor, finalAlpha);
              graphics.fillRect(
                renderX - drawCellSize / 2,
                renderY - drawCellSize / 2,
                drawCellSize,
                drawCellSize,
              );
              scene.gameGroup.add(graphics);
            }
          }
        }
      }
    }
  }

  getGhostPosition(board) {
    const ghost = new Piece(this.type, this.rotationSystem, this.rotation, this.textureKey);
    ghost.shape = this.shape.map((row) => [...row]);
    ghost.x = this.x;
    ghost.y = this.y;
    ghost.hardDrop(board);
    return ghost;
  }
}

function normalizeStartLevel(value, options = {}) {
  const maxLevel =
    typeof options.maxLevel === "number" && Number.isFinite(options.maxLevel)
      ? options.maxLevel
      : 1200;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  const snapped = Math.round(parsed / 100) * 100;
  return Math.max(0, Math.min(maxLevel, snapped));
}

function getModeGravityLevelCap(mode) {
  if (!mode) return null;
  if (typeof mode.getGravityLevelCap === "function") {
    const cap = Number(mode.getGravityLevelCap());
    if (Number.isFinite(cap)) return cap;
  }
  if (typeof mode.getConfig === "function") {
    const config = mode.getConfig();
    const cap = Number(config?.gravityLevelCap);
    if (Number.isFinite(cap)) return cap;
  }
  return null;
}

function getModeDisplayLevelCap(mode) {
  if (!mode) return null;
  if (typeof mode.getDisplayLevelCap === "function") {
    const cap = Number(mode.getDisplayLevelCap());
    if (Number.isFinite(cap)) return cap;
  }
  return getModeGravityLevelCap(mode);
}

function getStartingLevelCapForMode(mode) {
  const displayCap = getModeDisplayLevelCap(mode);
  if (displayCap !== null) return Math.max(0, Math.floor(displayCap));
  return 1200;
}

function getConfiguredStartingLevel(maxLevel = 1200) {
  return normalizeStartLevel(localStorage.getItem("startingLevel"), { maxLevel });
}

function normalizeRoundsDebugMedalCount(value, maxCount = 99) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(maxCount, Math.floor(parsed)));
}
