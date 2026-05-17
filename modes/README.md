# Tetris Game Modes System

This directory contains the JavaScript-based mode system for the Tetris game, implementing different game modes with unique mechanics, timing, and gravity configurations.

## Architecture

### Base Class: `BaseMode.js`
- Provides common functionality for all game modes
- Defines configuration structure and default values
- Handles gravity calculation, timing, metadata, and default lifecycle hooks
- Exposes no-op hooks for unique mode behavior, so game code can call through one interface

### Mode Manager: `ModeManager.js`
- Dynamically loads and manages game modes
- Provides caching and memory management for mode instances

### Mode Registry: `ModeRegistry.js`
- Centralizes mode IDs, class names, menu categories, descriptions, and colors
- Keeps UI metadata out of gameplay mode classes
- Provides one predictable place to add or reorder modes

### Specific Mode Implementations

#### `TGM1Mode.js`
- Classic Tetris: The Grand Master experience
- Official TGM1 gravity curve and mechanics
- Full grading system with GM requirements
- Section stops and progression

#### `Mode20G.js`
- Maximum gravity (20 rows per frame) from level 0
- Fast DAS/ARR for rapid gameplay
- Auto-hard drop on spawn
- Enhanced scoring for technical play

#### `OtherModes.js`
- **MarathonMode**: Progressive difficulty with increasing gravity
- **Sprint40Mode**: Speed-focused 40-line clear challenge
- **ZenMode**: Relaxed endless play with gentle mechanics

## Configuration Structure

Each mode defines its configuration through the `getModeConfig()` method:

```javascript
getModeConfig() {
    return {
        gravity: {
            type: 'tgm1',        // 'tgm1', 'static', 'linear', 'custom'
            value: 5120,         // For static gravity
            curve: (level) => {} // Custom function for advanced curves
        },
        das: 16/60,           // Delayed Auto Shift timing
        arr: 1/60,            // Auto Repeat Rate
        are: 30/60,           // Appearance Delay
        lockDelay: 0.5,       // Lock delay timing
        nextPieces: 1,        // Number of next pieces to show
        holdEnabled: false,   // Hold mechanics availability
        ghostEnabled: true,   // Ghost piece visibility
        rotationSystem: 'SRS', // 'SRS' or 'ARS'
        levelUpType: 'piece', // 'piece' or 'lines'
        lineClearBonus: 1,    // Score multiplier
        specialMechanics: {}  // Mode-specific features
    };
}
```

## Mode Categories

### EASY
- **Normal**: TGM1 with relaxed settings
- **Easy**: Zen-like experience

### STANDARD
- **Sprint 40L/100L**: Speed challenges
- **Ultra**: 2-minute score attack
- **Marathon**: 150-line progressive challenge
- **Zen**: Endless relaxed play

### MASTER
- **TGM1/TGM2/TGM3/TGM4**: Classic TGM series experiences

### 20G
- **20G**: Maximum gravity from start
- **T.A.Death**: Difficult 20G challenge
- **Shirase**: Lightning-fast speeds
- **Master**: Unique 20G mechanics

### RACE
- **Asuka Easy/Normal/Hard**: 20G stacking challenges

### PUZZLE
- **Konoha Easy/Hard**: All-clear challenges
- **TGM3-Sakura**: Puzzle mode
- **Flashpoint**: Special puzzle mechanics

## Gravity Types

### TGM1
Uses the official TGM1 internal gravity curve with level-based progression.

### Static
Constant gravity value regardless of level (e.g., 20G mode always uses 5120).

### Linear
Simple linear progression: `base + (level * multiplier)`

### Custom
Arbitrary function that takes level and returns gravity value.

## Integration

Modes are loaded dynamically through the `ModeManager`:

```javascript
const modeManager = getModeManager();
const gameMode = modeManager.loadMode('tgm1');
const gravitySpeed = gameMode.getGravitySpeed(currentLevel);
```

The structure follows the same split as Cambridge's `gamemode.lua` model: `BaseMode` owns default core behavior and extension hooks, `ModeRegistry` owns mode metadata, and each mode file only overrides the pieces that make that mode unique.

## Benefits

1. **Centralized Metadata**: `ModeRegistry.js` owns registration, display names, descriptions, and colors
2. **Self-Contained Logic**: Each mode contains its gameplay rules and configuration
3. **Memory Efficient**: Modes are loaded on-demand and cached
4. **Extensible**: Easy to add new modes by extending BaseMode
5. **Maintainable**: Clear separation between mode metadata, mode logic, and the game engine

## Adding New Modes

1. Create a new JavaScript file extending `BaseMode`
2. Implement `getModeConfig()` with desired settings
3. Override methods as needed for special mechanics
4. Register the mode in `ModeRegistry.js`
5. Add script include to `index.html`

## Performance

- Modes are cached after first load
- Memory usage is monitored and can be cleared
- Preloading available for commonly used modes