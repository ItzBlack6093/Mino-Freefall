// PowerupMino class - Extends existing Piece system with special powerup mechanics
// Powerup minos spawn like normal pieces but activate unique effects when their lines are cleared

class PowerupMino extends Piece {
    constructor(type, powerupType = null, rotationSystem = 'SRS', initialRotation = 0) {
        // Initialize as regular piece first
        super(type, rotationSystem, initialRotation);
        
        // Store powerup type
        this.powerupType = powerupType;
        this.isPowerup = true;
        
        // Base/native color for restoration
        this.baseColor = this.color;
        // Use nonzero black so board treats it as occupied
        this.powerupFillColor = 0x010101;
        
        // Visual distinction for powerup pieces
        this.powerupColors = {
            'del_even': 0x2a7bff,  // Blue border for "="
            'free_fall': 0x00ff80 // Green border for "!"
        };
        
        // Apply powerup color if specified
        if (this.powerupType && this.powerupColors[this.powerupType]) {
            this.color = this.powerupFillColor;
        }
        
        // Store original color for restoration if needed
        this.originalColor = this.baseColor;
        
        // Powerup-specific properties
        this.powerupData = {
            // Row deletion powerup settings
            'del_even': {
                deletePattern: 'every_other', // 'every_other', 'every_third', etc.
                preserveTopRows: true, // Don't delete top 2 rows
                preserveBottomRows: true // Don't delete bottom 2 rows
            },
            // Gravity burst powerup settings
            'free_fall': {
                forceToBottom: true, // All pieces fall to bottom
                clearFilledLines: true, // Clear lines that become complete
                maxIterations: 10 // Prevent infinite loops
            }
        };
    }
    
    // Override draw method to render custom full-size powerup blocks
    draw(scene, offsetX, offsetY, cellSize, ghost = false, alpha = 1) {
        const finalAlpha = ghost ? 0.3 : alpha;
        const g = scene.add.graphics();
        let drewCell = false;
        for (let r = 0; r < this.shape.length; r++) {
            for (let c = 0; c < this.shape[r].length; c++) {
                if (!this.shape[r][c]) continue;
                const pieceY = this.y + r;
                if (pieceY < 2) continue;

                const x = offsetX + (this.x + c) * cellSize - cellSize / 2;
                const y = offsetY + (pieceY - 2) * cellSize - cellSize / 2;
                // Fill
                g.fillStyle(this.powerupFillColor, finalAlpha);
                g.fillRect(x, y, cellSize, cellSize);
                // Border by powerup type color
                const borderColor = this.powerupColors[this.powerupType] || this.baseColor;
                g.lineStyle(2, borderColor, finalAlpha);
                g.strokeRect(x, y, cellSize, cellSize);
                // Symbol
                g.lineStyle(3, borderColor, finalAlpha);
                g.fillStyle(borderColor, finalAlpha);
                if (this.powerupType === 'free_fall') {
                    // "!" center
                    const cx = x + cellSize / 2;
                    const cy = y + cellSize / 2;
                    g.beginPath();
                    g.moveTo(cx, cy - cellSize * 0.25);
                    g.lineTo(cx, cy + cellSize * 0.1);
                    g.strokePath();
                    g.fillCircle(cx, cy + cellSize * 0.25, Math.max(1, cellSize * 0.06));
                } else if (this.powerupType === 'del_even') {
                    // "=" lines
                    const cx = x + cellSize / 2;
                    const cy = y + cellSize / 2;
                    const w = cellSize * 0.4;
                    const h = cellSize * 0.08;
                    g.fillRect(cx - w / 2, cy - cellSize * 0.12, w, h);
                    g.fillRect(cx - w / 2, cy + cellSize * 0.05, w, h);
                }
                drewCell = true;
            }
        }
        if (drewCell) {
            scene.gameGroup.add(g);
        } else {
            g.destroy();
        }
    }
    
    // Draw small indicator to show this is a powerup piece
    drawPowerupIndicator(sprite, cellSize) {
        if (!this.powerupType) return;
        
        // Create a small indicator in the corner of the piece
        const indicatorSize = Math.max(2, Math.floor(cellSize * 0.2));
        const indicatorX = sprite.x - cellSize/2 + indicatorSize/2 + 1;
        const indicatorY = sprite.y - cellSize/2 + indicatorSize/2 + 1;
        
        // Use graphics to draw the indicator
        const graphics = sprite.scene.add.graphics();
        
        // Draw background circle
        graphics.fillStyle(0x000000, 0.8);
        graphics.fillCircle(indicatorX, indicatorY, indicatorSize/2);
        
        // Draw powerup-specific symbol
        switch (this.powerupType) {
            case 'del_even':
                // "=" symbol with blue border
                graphics.lineStyle(2, this.powerupColors.del_even, 1);
                graphics.strokeRect(
                    indicatorX - indicatorSize / 2,
                    indicatorY - indicatorSize / 2,
                    indicatorSize,
                    indicatorSize
                );
                graphics.lineStyle(2, 0xffffff, 1);
                graphics.beginPath();
                graphics.moveTo(indicatorX - 2, indicatorY - 2);
                graphics.lineTo(indicatorX + 2, indicatorY - 2);
                graphics.moveTo(indicatorX - 2, indicatorY + 2);
                graphics.lineTo(indicatorX + 2, indicatorY + 2);
                graphics.strokePath();
                break;

            case 'free_fall':
                // "!" symbol with green border
                graphics.lineStyle(2, this.powerupColors.free_fall, 1);
                graphics.strokeRect(
                    indicatorX - indicatorSize / 2,
                    indicatorY - indicatorSize / 2,
                    indicatorSize,
                    indicatorSize
                );
                graphics.lineStyle(2, 0xffffff, 1);
                graphics.beginPath();
                graphics.moveTo(indicatorX, indicatorY - 2);
                graphics.lineTo(indicatorX, indicatorY + 2);
                graphics.strokePath();
                graphics.fillStyle(0xffffff, 1);
                graphics.fillCircle(indicatorX, indicatorY + 3, 1);
                break;
        }
        
        // Add to game group for cleanup
        sprite.scene.gameGroup.add(graphics);
    }
    
    // Get powerup effect data
    getPowerupData() {
        return this.powerupData[this.powerupType] || null;
    }
    
    // Check if this piece contains powerup minos (for line clear detection)
    containsPowerupCells() {
        return this.isPowerup && this.powerupType !== null;
    }
    
    // Get the positions of powerup cells in this piece
    getPowerupCellPositions() {
        if (!this.isPowerup || !this.powerupType) return [];
        
        const positions = [];
        for (let r = 0; r < this.shape.length; r++) {
            for (let c = 0; c < this.shape[r].length; c++) {
                if (this.shape[r][c]) {
                    positions.push({
                        x: this.x + c,
                        y: this.y + r,
                        boardX: this.x + c,
                        boardY: this.y + r,
                        powerupType: this.powerupType,
                        originalColor: this.baseColor,
                    });
                }
            }
        }
        return positions;
    }
    
    // Create a regular powerup piece (for spawning)
    static createRandomPowerupPiece(rotationSystem = 'SRS', powerupType = null) {
        // Choose powerup type if not specified
        if (!powerupType) {
            const powerupTypes = ['del_even', 'free_fall'];
            powerupType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        }
        
        // Choose random piece type
        const pieceTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
        
        // Create and return powerup piece
        return new PowerupMino(randomType, powerupType, rotationSystem);
    }
    
    // Create a specific powerup piece
    static createPowerupPiece(type, powerupType, rotationSystem = 'SRS') {
        return new PowerupMino(type, powerupType, rotationSystem);
    }
    
    // Check if piece should be a powerup (based on spawn rate)
    static shouldBePowerup(spawnRate = 0.05) {
        return Math.random() < spawnRate;
    }
}

// Powerup effect handler
class PowerupEffectHandler {
    constructor(gameScene) {
        this.gameScene = gameScene;
        this.activeEffects = [];
    }
    
    // Execute powerup by type (simplified entry point)
    executePowerupByType(powerupType) {
        switch (powerupType) {
            case 'del_even':
                this.executeDeleteRowsEffect();
                break;
            case 'free_fall':
                this.executeFreeFallEffect();
                break;
        }
    }
    
    // Delete every other row effect (sync, bottom-up)
    executeDeleteRowsEffect() {
        const rowsToDelete = [];
        const rows = this.gameScene.board.rows;
        for (let r = 0; r < rows; r++) {
            if (r % 2 === 0) rowsToDelete.push(r);
        }
        if (rowsToDelete.length === 0) return;

        this.deleteRows(rowsToDelete);
        this.playPowerupEffectSound('del_even');
    }
    
    // Free fall effect with shake then gravity + line clear
    executeFreeFallEffect() {
        const doGravity = () => {
            this.applyColumnGravity();
            const newLines = this.findFilledLines();
            if (newLines.length > 0) {
                this.clearLines(newLines);
                this.playPowerupEffectSound('free_fall');
            }
        };
        this.shakePlayfield(doGravity);
    }

    // Simple downward shake twice, then callback
    shakePlayfield(onComplete) {
        const scene = this.gameScene;
        const targets = [];
        if (scene.gameGroup) targets.push(scene.gameGroup);
        if (scene.playfieldBorder) targets.push(scene.playfieldBorder);
        if (!targets.length) {
            if (onComplete) onComplete();
            return;
        }
        const timeline = scene.tweens.createTimeline();
        targets.forEach((t) => {
            timeline.add({
                targets: t,
                y: '+=6',
                duration: 70,
                yoyo: true,
                repeat: 1,
                ease: 'Sine.easeInOut',
            });
        });
        timeline.setCallback('onComplete', () => {
            if (onComplete) onComplete();
        });
        timeline.play();
    }
    
    // Process powerup effects when lines are cleared
    processPowerupEffects(clearedLines, powerupCells) {
        if (!powerupCells || powerupCells.length === 0) {
            return; // No powerup minos in cleared lines
        }
        
        // Group powerup cells by type
        const powerupsByType = {};
        powerupCells.forEach(cell => {
            if (!powerupsByType[cell.powerupType]) {
                powerupsByType[cell.powerupType] = [];
            }
            powerupsByType[cell.powerupType].push(cell);
        });
        
        // Execute each type of powerup
        Object.keys(powerupsByType).forEach(powerupType => {
            this.executePowerupByType(powerupType);
        });
    }
    
    // Apply gravity column by column
    applyColumnGravity() {
        const rows = this.gameScene.board.rows;
        const cols = this.gameScene.board.cols;
        
        for (let col = 0; col < cols; col++) {
            // Extract column
            const column = [];
            for (let row = 0; row < rows; row++) {
                column.push(this.gameScene.board.grid[row][col]);
            }
            
            // Remove empty spaces (gravity)
            const compactedColumn = column.filter(cell => cell !== 0);
            
            // Fill column from bottom
            const newColumn = Array(rows).fill(0);
            for (let i = 0; i < compactedColumn.length; i++) {
                newColumn[rows - 1 - i] = compactedColumn[compactedColumn.length - 1 - i];
            }
            
            // Put column back
            for (let row = 0; row < rows; row++) {
                this.gameScene.board.grid[row][col] = newColumn[row];
            }
        }
    }
    
    // Find all filled lines in the board
    findFilledLines() {
        const filledLines = [];
        for (let r = 0; r < this.gameScene.board.rows; r++) {
            if (this.gameScene.board.grid[r].every(cell => cell !== 0)) {
                filledLines.push(r);
            }
        }
        return filledLines;
    }
    
    // Delete specific rows
    deleteRows(rowsToDelete) {
        const newGrid = [];
        const clearedSet = new Set(rowsToDelete);
        
        // Add all non-deleted rows to new grid
        for (let r = 0; r < this.gameScene.board.rows; r++) {
            if (!clearedSet.has(r)) {
                newGrid.push(this.gameScene.board.grid[r]);
            }
        }
        
        // Add empty rows at the top to maintain grid size
        const emptyRowsNeeded = rowsToDelete.length;
        for (let i = 0; i < emptyRowsNeeded; i++) {
            newGrid.unshift(Array(this.gameScene.board.cols).fill(0));
        }
        
        // Replace the entire grid
        this.gameScene.board.grid = newGrid;
    }
    
    // Clear specific lines (similar to existing clear logic)
    clearLines(linesToClear) {
        const newGrid = [];
        const clearedSet = new Set(linesToClear);
        
        // Add all non-cleared rows to new grid
        for (let r = 0; r < this.gameScene.board.rows; r++) {
            if (!clearedSet.has(r)) {
                newGrid.push(this.gameScene.board.grid[r]);
            }
        }
        
        // Add empty rows at the top to maintain grid size
        const emptyRowsNeeded = linesToClear.length;
        for (let i = 0; i < emptyRowsNeeded; i++) {
            newGrid.unshift(Array(this.gameScene.board.cols).fill(0));
        }
        
        this.gameScene.board.grid = newGrid;
    }
    
    // Play powerup-specific sound effects
    playPowerupEffectSound(powerupType) {
        if (!this.gameScene.sound) return;
        
        // Create different sound effects for each powerup type
        const soundKey = `powerup_${powerupType}`;
        let sound;
        
        try {
            // Try to load custom powerup sound, fallback to existing sounds
            if (this.gameScene.sound.get(soundKey)) {
                sound = this.gameScene.sound.add(soundKey, { volume: 0.8 });
            } else {
                // Fallback to existing sounds
                switch (powerupType) {
                    case 'del_even':
                        sound = this.gameScene.sound.add('clear', { volume: 0.8 });
                        break;
                    case 'free_fall':
                        sound = this.gameScene.sound.add('fall', { volume: 0.8 });
                        break;
                }
            }
            
            if (sound) {
                sound.play();
            }
        } catch (error) {
            console.warn(`Powerup sound effect failed for ${powerupType}:`, error);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PowerupMino, PowerupEffectHandler };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.PowerupMino = PowerupMino;
    window.PowerupEffectHandler = PowerupEffectHandler;
}