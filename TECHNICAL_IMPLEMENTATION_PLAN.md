# Starfall Blocks - Technical Implementation Plan
**Single-File HTML5 Canvas + Vanilla JS Architecture**

## 1. Architecture Overview

### File Structure
```
starfall-blocks.html (single file containing)
├── HTML structure
├── CSS styling
├── JavaScript modules (inline)
└── Configuration JSON
```

### Core Modules

#### 1. Configuration (`CONFIG`)
```javascript
const CONFIG = {
  // Board dimensions
  BOARD: { COLS: 10, ROWS_VISIBLE: 20, ROWS_BUFFER: 2, CELL_SIZE: 16 },
  
  // Timing (in milliseconds at 60fps)
  TIMING: { 
    DAS: 130, ARR: 23, LOCK_DELAY: 500, ENTRY_DELAY: 150,
    LINE_CLEAR_ANIMATION: 300, FRAME_TIME: 16.67 
  },
  
  // Input mappings
  KEYS: {
    left: 'ArrowLeft', right: 'ArrowRight', soft_drop: 'ArrowDown',
    hard_drop: 'Space', rotate_cw: 'KeyX', rotate_ccw: 'KeyZ',
    hold: 'KeyC', pause: 'KeyP', reset: 'KeyR'
  },
  
  // Feature toggles
  FEATURES: { hold: false, ghost: true, hard_drop: true },
  
  // Gravity table and scoring
  GRAVITY_TABLE: { /* frames per row by level */ },
  SCORING: { /* line clear values and multipliers */ }
};
```

#### 2. RNG and 7-Bag System (`rng7bag.js`)
```javascript
class SevenBag {
  constructor(seed = Date.now()) {
    this.rng = new LCG(seed); // Linear Congruential Generator
    this.bag = [];
    this.refill();
  }
  
  refill() {
    this.bag = ['I','J','L','O','S','T','Z'];
    this.shuffle();
  }
  
  next() {
    if (this.bag.length === 0) this.refill();
    return this.bag.pop();
  }
  
  shuffle() {
    // Fisher-Yates with seeded RNG
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng.next() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }
}
```

#### 3. Input System (`input.js`)
```javascript
class InputHandler {
  constructor() {
    this.keys = new Set();
    this.dasTimer = 0;
    this.arrTimer = 0;
    this.dasCharged = false;
    this.lastDirection = null;
    
    this.bindEvents();
  }
  
  update(dt) {
    this.updateDAS(dt);
    this.updateARR(dt);
  }
  
  updateDAS(dt) {
    const leftHeld = this.keys.has(CONFIG.KEYS.left);
    const rightHeld = this.keys.has(CONFIG.KEYS.right);
    
    if (leftHeld || rightHeld) {
      const direction = leftHeld ? 'left' : 'right';
      
      if (direction !== this.lastDirection) {
        this.dasTimer = 0;
        this.dasCharged = false;
        this.lastDirection = direction;
        return { move: direction, initial: true };
      }
      
      this.dasTimer += dt;
      if (!this.dasCharged && this.dasTimer >= CONFIG.TIMING.DAS) {
        this.dasCharged = true;
        this.arrTimer = 0;
        return { move: direction, das: true };
      }
    } else {
      this.reset();
    }
    
    return null;
  }
  
  updateARR(dt) {
    if (!this.dasCharged) return null;
    
    this.arrTimer += dt;
    if (this.arrTimer >= CONFIG.TIMING.ARR) {
      this.arrTimer = 0;
      return { move: this.lastDirection, arr: true };
    }
    
    return null;
  }
}
```

#### 4. Tetromino System (`piece.js`)
```javascript
class Tetromino {
  constructor(type, x = 3, y = -1) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.cells = this.getCells();
  }
  
  getCells() {
    const shapes = TETROMINO_SHAPES[this.type];
    return shapes[this.rotation];
  }
  
  rotate(direction, board) {
    const newRotation = (this.rotation + direction) % 4;
    const newCells = TETROMINO_SHAPES[this.type][newRotation];
    
    // Test rotation with basic kicks
    const kickTests = this.getKickTests(direction);
    
    for (const [dx, dy] of kickTests) {
      if (board.isValidPosition(newCells, this.x + dx, this.y + dy)) {
        this.rotation = newRotation;
        this.cells = newCells;
        this.x += dx;
        this.y += dy;
        return true;
      }
    }
    
    return false; // Rotation failed
  }
  
  getKickTests(direction) {
    // Basic Nintendo-style kicks: try original position, then left, right, up
    return [[0, 0], [-1, 0], [1, 0], [0, -1]];
  }
}

const TETROMINO_SHAPES = {
  I: [
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]], // Vertical
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // Horizontal
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]], // Vertical (alt)
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]]  // Horizontal (alt)
  ],
  // ... other pieces
};
```

#### 5. Board System (`board.js`)
```javascript
class Board {
  constructor() {
    this.grid = Array(CONFIG.BOARD.ROWS_VISIBLE + CONFIG.BOARD.ROWS_BUFFER)
      .fill(null)
      .map(() => Array(CONFIG.BOARD.COLS).fill(0));
    this.clearingLines = [];
    this.clearAnimation = 0;
  }
  
  isValidPosition(cells, x, y) {
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        if (cells[row][col]) {
          const boardX = x + col;
          const boardY = y + row;
          
          // Check bounds
          if (boardX < 0 || boardX >= CONFIG.BOARD.COLS || 
              boardY >= this.grid.length) {
            return false;
          }
          
          // Check collision (skip negative Y for spawn area)
          if (boardY >= 0 && this.grid[boardY][boardX]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  lockPiece(piece) {
    for (let row = 0; row < piece.cells.length; row++) {
      for (let col = 0; col < piece.cells[row].length; col++) {
        if (piece.cells[row][col]) {
          const boardY = piece.y + row;
          const boardX = piece.x + col;
          
          if (boardY >= 0) {
            this.grid[boardY][boardX] = piece.type;
          }
        }
      }
    }
  }
  
  checkLines() {
    const fullLines = [];
    
    for (let y = 0; y < this.grid.length; y++) {
      if (this.grid[y].every(cell => cell !== 0)) {
        fullLines.push(y);
      }
    }
    
    return fullLines;
  }
  
  clearLines(lines) {
    // Sort lines from bottom to top
    lines.sort((a, b) => b - a);
    
    for (const lineY of lines) {
      this.grid.splice(lineY, 1);
      this.grid.unshift(Array(CONFIG.BOARD.COLS).fill(0));
    }
    
    return lines.length;
  }
}
```

#### 6. Gravity and Timing (`gravity.js`)
```javascript
class GravitySystem {
  constructor() {
    this.gravityTimer = 0;
    this.lockTimer = 0;
    this.lockResetCount = 0;
    this.isLocking = false;
    this.entryDelayTimer = 0;
  }
  
  update(dt, level, piece, board) {
    const gravityFrames = CONFIG.GRAVITY_TABLE[Math.min(level, 29)];
    const gravityTime = gravityFrames * CONFIG.TIMING.FRAME_TIME;
    
    this.gravityTimer += dt;
    
    // Natural gravity drop
    if (this.gravityTimer >= gravityTime) {
      this.gravityTimer = 0;
      
      if (board.isValidPosition(piece.cells, piece.x, piece.y + 1)) {
        piece.y++;
      } else {
        this.startLocking();
      }
    }
    
    // Lock delay handling
    if (this.isLocking) {
      this.lockTimer += dt;
      
      if (this.lockTimer >= CONFIG.TIMING.LOCK_DELAY) {
        return { shouldLock: true };
      }
    }
    
    return { shouldLock: false };
  }
  
  startLocking() {
    if (!this.isLocking) {
      this.isLocking = true;
      this.lockTimer = 0;
    }
  }
  
  resetLock() {
    if (this.lockResetCount < 1) { // Limit resets
      this.lockTimer = 0;
      this.lockResetCount++;
    }
  }
  
  finishLock() {
    this.isLocking = false;
    this.lockTimer = 0;
    this.lockResetCount = 0;
  }
}
```

#### 7. Audio System (`audio.js`)
```javascript
class AudioSystem {
  constructor() {
    this.context = null;
    this.initialized = false;
    this.sfxBus = null;
    this.musicBus = null;
  }
  
  async init() {
    if (this.initialized) return;
    
    try {
      // Try Tone.js if available, fallback to Web Audio API
      if (typeof Tone !== 'undefined') {
        await this.initToneJS();
      } else {
        await this.initWebAudio();
      }
      this.initialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }
  
  async initToneJS() {
    await Tone.start();
    this.context = Tone.context;
    
    // Create SFX synths
    this.sfxSynths = {
      square: new Tone.Synth({ oscillator: { type: 'square' } }),
      triangle: new Tone.Synth({ oscillator: { type: 'triangle' } }),
      pulse: new Tone.Synth({ oscillator: { type: 'pulse' } }),
      sawtooth: new Tone.Synth({ oscillator: { type: 'sawtooth' } }),
      noise: new Tone.NoiseSynth()
    };
    
    // Connect to master
    Object.values(this.sfxSynths).forEach(synth => {
      synth.toDestination();
    });
  }
  
  playSFX(event) {
    if (!this.initialized) return;
    
    const sfxConfig = CONFIG.AUDIO.SFX[event];
    if (!sfxConfig) return;
    
    const synth = this.sfxSynths[sfxConfig.wave];
    if (!synth) return;
    
    if (sfxConfig.arpeggio) {
      // Play arpeggio for complex sounds
      sfxConfig.arpeggio.forEach((note, i) => {
        const delay = i * 0.1;
        synth.triggerAttackRelease(note, sfxConfig.ms / 1000, '+' + delay);
      });
    } else {
      synth.triggerAttackRelease(
        sfxConfig.pitch, 
        sfxConfig.ms / 1000
      );
    }
  }
}
```

#### 8. Renderer (`renderer.js`)
```javascript
class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false; // Pixel art
    
    this.setupCanvas();
  }
  
  setupCanvas() {
    this.canvas.width = CONFIG.CANVAS.WIDTH;
    this.canvas.height = CONFIG.CANVAS.HEIGHT;
    this.canvas.style.imageRendering = 'pixelated';
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  drawBackground() {
    // Starfield background with scanlines
    this.ctx.fillStyle = '#0E0E10';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Subtle scanlines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    for (let y = 0; y < this.canvas.height; y += 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }
  
  drawBoard(board) {
    const offsetX = 100; // Center the board
    const offsetY = 20;
    
    // Draw border
    this.ctx.strokeStyle = '#323c39';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      offsetX - 2, 
      offsetY - 2, 
      CONFIG.BOARD.COLS * CONFIG.BOARD.CELL_SIZE + 4,
      CONFIG.BOARD.ROWS_VISIBLE * CONFIG.BOARD.CELL_SIZE + 4
    );
    
    // Draw cells
    for (let y = 0; y < CONFIG.BOARD.ROWS_VISIBLE; y++) {
      for (let x = 0; x < CONFIG.BOARD.COLS; x++) {
        const cell = board.grid[y + CONFIG.BOARD.ROWS_BUFFER][x];
        if (cell) {
          this.drawBlock(
            offsetX + x * CONFIG.BOARD.CELL_SIZE,
            offsetY + y * CONFIG.BOARD.CELL_SIZE,
            CONFIG.COLORS[cell]
          );
        }
      }
    }
  }
  
  drawBlock(x, y, color) {
    const size = CONFIG.BOARD.CELL_SIZE;
    
    // Main block
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);
    
    // Bevel effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x, y, size, 2); // Top highlight
    this.ctx.fillRect(x, y, 2, size); // Left highlight
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(x, y + size - 2, size, 2); // Bottom shadow
    this.ctx.fillRect(x + size - 2, y, 2, size); // Right shadow
    
    // Border
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, size, size);
  }
  
  drawHUD(gameState) {
    const hudX = 300;
    const hudY = 40;
    
    this.ctx.fillStyle = '#f4f4f4';
    this.ctx.font = '8px PressStart2P, monospace';
    
    // Score
    this.ctx.fillText('SCORE', hudX, hudY);
    this.ctx.fillText(gameState.score.toString().padStart(6, '0'), hudX, hudY + 16);
    
    // Level
    this.ctx.fillText('LEVEL', hudX, hudY + 40);
    this.ctx.fillText(gameState.level.toString().padStart(2, '0'), hudX, hudY + 56);
    
    // Lines
    this.ctx.fillText('LINES', hudX, hudY + 80);
    this.ctx.fillText(gameState.lines.toString().padStart(3, '0'), hudX, hudY + 96);
    
    // Next piece
    this.ctx.fillText('NEXT', hudX, hudY + 120);
    this.drawNextPiece(hudX, hudY + 140, gameState.nextPiece);
  }
  
  drawNextPiece(x, y, pieceType) {
    const cells = TETROMINO_SHAPES[pieceType][0];
    const color = CONFIG.COLORS[pieceType];
    
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        if (cells[row][col]) {
          this.drawBlock(
            x + col * CONFIG.BOARD.CELL_SIZE,
            y + row * CONFIG.BOARD.CELL_SIZE,
            color
          );
        }
      }
    }
  }
}
```

#### 9. Game State Manager (`game.js`)
```javascript
class Game {
  constructor() {
    this.state = 'title';
    this.score = 0;
    this.level = 0;
    this.lines = 0;
    this.board = new Board();
    this.sevenBag = new SevenBag();
    this.currentPiece = null;
    this.nextPiece = null;
    this.heldPiece = null;
    this.canHold = true;
    
    this.gravity = new GravitySystem();
    this.input = new InputHandler();
    this.audio = new AudioSystem();
    this.renderer = new Renderer(document.getElementById('gameCanvas'));
    
    this.lastTime = 0;
    this.accumulator = 0;
  }
  
  async init() {
    await this.audio.init();
    this.newGame();
    this.gameLoop();
  }
  
  newGame() {
    this.state = 'gameplay';
    this.score = 0;
    this.level = 0;
    this.lines = 0;
    this.board = new Board();
    this.sevenBag = new SevenBag();
    this.spawnNext();
  }
  
  spawnNext() {
    if (!this.nextPiece) {
      this.nextPiece = this.sevenBag.next();
    }
    
    this.currentPiece = new Tetromino(this.nextPiece);
    this.nextPiece = this.sevenBag.next();
    this.canHold = true;
    
    // Check game over
    if (!this.board.isValidPosition(
      this.currentPiece.cells, 
      this.currentPiece.x, 
      this.currentPiece.y
    )) {
      this.gameOver();
    }
  }
  
  update(dt) {
    if (this.state !== 'gameplay') return;
    
    // Handle input
    const movement = this.input.update(dt);
    if (movement) {
      this.handleMovement(movement);
    }
    
    // Update gravity
    const gravityResult = this.gravity.update(
      dt, this.level, this.currentPiece, this.board
    );
    
    if (gravityResult.shouldLock) {
      this.lockPiece();
    }
  }
  
  handleMovement(movement) {
    const piece = this.currentPiece;
    const dx = movement.move === 'left' ? -1 : 1;
    
    if (this.board.isValidPosition(piece.cells, piece.x + dx, piece.y)) {
      piece.x += dx;
      this.audio.playSFX('move');
      
      // Reset lock timer if on ground
      if (!this.board.isValidPosition(piece.cells, piece.x, piece.y + 1)) {
        this.gravity.resetLock();
      }
    }
  }
  
  lockPiece() {
    this.board.lockPiece(this.currentPiece);
    this.audio.playSFX('lock');
    
    const clearedLines = this.board.checkLines();
    if (clearedLines.length > 0) {
      this.clearLines(clearedLines);
    }
    
    this.gravity.finishLock();
    
    setTimeout(() => {
      this.spawnNext();
    }, CONFIG.TIMING.ENTRY_DELAY);
  }
  
  clearLines(lines) {
    const count = lines.length;
    this.lines += count;
    
    // Award points
    const basePoints = [0, 100, 300, 500, 800][count];
    const points = basePoints * (this.level + 1);
    this.score += points;
    
    // Check level up
    const newLevel = Math.floor(this.lines / 10);
    if (newLevel > this.level) {
      this.level = newLevel;
      this.audio.playSFX('level_up');
    }
    
    // Play appropriate sound
    if (count === 4) {
      this.audio.playSFX('tetris');
    } else {
      this.audio.playSFX('line_clear');
    }
    
    this.board.clearLines(lines);
  }
  
  gameLoop() {
    const currentTime = performance.now();
    const dt = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Fixed timestep accumulator
    this.accumulator += dt;
    
    while (this.accumulator >= CONFIG.TIMING.FRAME_TIME) {
      this.update(CONFIG.TIMING.FRAME_TIME);
      this.accumulator -= CONFIG.TIMING.FRAME_TIME;
    }
    
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
  
  render() {
    this.renderer.clear();
    this.renderer.drawBackground();
    this.renderer.drawBoard(this.board);
    this.renderer.drawPiece(this.currentPiece);
    this.renderer.drawGhost(this.currentPiece, this.board);
    this.renderer.drawHUD(this);
  }
}
```

## 2. Main Integration

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Starfall Blocks</title>
    <style>
        body { 
            margin: 0; padding: 20px; 
            background: #0E0E10; 
            display: flex; justify-content: center; 
            font-family: 'PressStart2P', monospace;
        }
        canvas { 
            border: 2px solid #323c39; 
            image-rendering: pixelated; 
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script src="https://unpkg.com/tone@latest/build/Tone.js"></script>
    <script>
        // All JavaScript modules inline here
        // ... (configuration, classes, and initialization)
        
        // Start game
        const game = new Game();
        game.init();
    </script>
</body>
</html>
```

## 3. Performance Optimizations

### Rendering Optimizations
- **Batch Draw Calls**: Group similar operations
- **Dirty Rectangle Updates**: Only redraw changed areas
- **Object Pooling**: Reuse particle and effect objects
- **Integer Scaling**: Avoid subpixel rendering

### Memory Management
- **Minimal Allocations**: Reuse arrays and objects in hot paths
- **Efficient Collision**: Early exit collision detection
- **Audio Pooling**: Limit concurrent SFX instances

### Deterministic Behavior
- **Fixed Timestep**: 16.67ms accumulator for consistent physics
- **Seeded RNG**: Reproducible random sequences
- **State Validation**: Frame-perfect lock timing

## 4. Testing Strategy

### Automated Tests
- **Unit Tests**: Rotation logic, collision detection, scoring math
- **Integration Tests**: DAS/ARR timing, gravity progression
- **Performance Tests**: 60 FPS sustained over 30 minutes

### Manual Validation
- **Input Feel**: Human testing at different levels
- **Audio Latency**: Subjective timing verification
- **Visual Quality**: Pixel-perfect scaling verification

This architecture provides a solid foundation for a faithful SNES-style Tetris implementation with modern web standards and authentic 16-bit feel.
