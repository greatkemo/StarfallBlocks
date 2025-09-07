/* 
 * Starfall Blocks - Configuration Template
 * Place this at the top of your HTML file for easy tuning
 */

const STARFALL_CONFIG = {
  // === BOARD SETTINGS ===
  BOARD: {
    COLS: 10,                    // Standard Tetris width
    ROWS_VISIBLE: 20,            // Visible playfield height  
    ROWS_BUFFER: 2,              // Hidden spawn area
    CELL_SIZE: 16,               // Pixel size per cell
    SPAWN_COL: 3,                // Piece spawn X position
    SPAWN_ROW: -1                // Piece spawn Y position (in buffer)
  },

  // === CANVAS SETTINGS ===
  CANVAS: {
    WIDTH: 480,                  // Canvas width in pixels
    HEIGHT: 320,                 // Canvas height in pixels
    PIXEL_PERFECT: true,         // Disable image smoothing
    INTEGER_SCALING: true        // Force whole-number scaling
  },

  // === TIMING SETTINGS (milliseconds) ===
  TIMING: {
    DAS: 130,                    // Delayed Auto Shift delay
    ARR: 23,                     // Auto Repeat Rate interval
    LOCK_DELAY: 500,             // Time piece stays on ground
    ENTRY_DELAY: 150,            // Pause between pieces
    LINE_CLEAR_ANIM: 300,        // Line clear animation duration
    LEVEL_UP_BANNER: 500         // Level up notification duration
  },

  // === INPUT BINDINGS ===
  KEYS: {
    left: 'ArrowLeft',
    right: 'ArrowRight', 
    soft_drop: 'ArrowDown',
    hard_drop: 'Space',
    rotate_cw: 'KeyX',
    rotate_ccw: 'KeyZ', 
    hold: 'KeyC',
    pause: 'KeyP',
    reset: 'KeyR'
  },

  // === FEATURE TOGGLES ===
  FEATURES: {
    hold: false,                 // Enable hold function
    ghost: true,                 // Show ghost piece
    hard_drop: true,             // Enable hard drop
    next_preview: true,          // Show next piece
    lock_delay_reset: 1,         // Max lock delay resets per piece
    modern_scoring: false        // Enable T-spins/back-to-back
  },

  // === GRAVITY TABLE (frames per row at 60fps) ===
  GRAVITY_TABLE: {
    0: 48,   1: 43,   2: 38,   3: 33,   4: 28,
    5: 23,   6: 18,   7: 13,   8: 8,    9: 6,
    10: 5,   11: 5,   12: 5,   13: 4,   14: 4,
    15: 4,   16: 3,   17: 3,   18: 3,   19: 2,
    20: 2,   21: 2,   22: 2,   23: 2,   24: 2,
    25: 2,   26: 2,   27: 2,   28: 2,   29: 1
  },

  // === SCORING SYSTEM ===
  SCORING: {
    LINE_CLEAR: {
      1: 100,                    // Single
      2: 300,                    // Double  
      3: 500,                    // Triple
      4: 800                     // Tetris
    },
    MOVEMENT: {
      soft_drop_per_cell: 1,     // Points per soft drop cell
      hard_drop_per_cell: 2      // Points per hard drop cell
    },
    LEVEL_MULTIPLIER: true,      // Multiply by (level + 1)
    LINES_PER_LEVEL: 10,         // Lines to advance level
    START_LEVEL: 0,              // Starting level
    MAX_LEVEL: 29                // Maximum level
  },

  // === TETROMINO COLORS ===
  COLORS: {
    I: '#59CBE8',                // Cyan
    J: '#3D5AA9',                // Blue
    L: '#F99D1C',                // Orange
    O: '#F2D94E',                // Yellow
    S: '#76C893',                // Green
    T: '#B084CC',                // Purple
    Z: '#E86A6A',                // Red
    GHOST: '#FFFFFF40',          // Ghost piece overlay
    BORDER: '#323c39',           // Board border
    BG: '#0E0E10'                // Background
  },

  // === AUDIO CONFIGURATION ===
  AUDIO: {
    ENABLED: true,               // Master audio toggle
    MASTER_VOLUME: 0.7,          // Overall volume (0.0 - 1.0)
    SFX_VOLUME: 0.8,             // Sound effects volume
    MUSIC_VOLUME: 0.4,           // Background music volume
    
    SFX: {
      move: { wave: 'square', pitch: 'G4', duration: 30 },
      rotate: { wave: 'triangle', pitch: 'Bb4', duration: 40 },
      lock: { wave: 'square', pitch: 'E4', duration: 60 },
      line_clear: { wave: 'pulse', pitch: 'C5', duration: 220 },
      tetris: { wave: 'pulse', arpeggio: ['C4','G4','C5'], duration: 400 },
      level_up: { wave: 'sawtooth', arpeggio: ['F4','A4','C5','F5'], duration: 500 },
      hard_drop: { wave: 'noise', duration: 60 },
      game_over: { wave: 'triangle', melody: ['E4','Eb4','D4','C#4','C4'], duration: 900 }
    }
  },

  // === VISUAL EFFECTS ===
  VISUAL: {
    GHOST_ALPHA: 0.25,           // Ghost piece transparency
    BEVEL_HIGHLIGHT: '#FFFFFF30', // Block highlight color
    BEVEL_SHADOW: '#00000030',   // Block shadow color
    OUTLINE: '#00000060',        // Block outline color
    SCANLINES: true,             // Enable scanline background effect
    PARTICLES: true,             // Enable line clear particles
    PARALLAX: false              // Enable background parallax (performance impact)
  },

  // === PERFORMANCE TUNING ===
  PERFORMANCE: {
    TARGET_FPS: 60,              // Target frame rate
    MAX_PARTICLES: 20,           // Particle count limit
    DIRTY_RECT_UPDATES: true,    // Only redraw changed areas
    OBJECT_POOLING: true,        // Reuse objects to prevent GC
    AUDIO_POLYPHONY: 8           // Max concurrent sound effects
  },

  // === ACCESSIBILITY OPTIONS ===
  ACCESSIBILITY: {
    COLORBLIND_FRIENDLY: false,  // Use colorblind-safe palette
    HIGH_CONTRAST: false,        // Increase contrast for visibility
    MOTION_REDUCTION: false,     // Reduce animations and effects
    LARGE_FONTS: false           // Increase UI font sizes
  },

  // === DEBUG SETTINGS ===
  DEBUG: {
    SHOW_FPS: false,             // Display frame rate counter
    SHOW_GRID: false,            // Show board grid lines
    SHOW_COLLISION: false,       // Highlight collision areas
    SHOW_TIMERS: false,          // Display internal timers
    LOG_INPUTS: false,           // Console log input events
    DETERMINISTIC_RNG: false     // Use fixed seed for testing
  }
};

/* 
 * PRESET CONFIGURATIONS
 * Uncomment one of these to quickly apply different play styles
 */

// CLASSIC NES TETRIS FEEL
// Object.assign(STARFALL_CONFIG.TIMING, { DAS: 160, ARR: 50, LOCK_DELAY: 1000 });
// Object.assign(STARFALL_CONFIG.FEATURES, { hard_drop: false, hold: false });

// MODERN GUIDELINE TETRIS FEEL  
// Object.assign(STARFALL_CONFIG.TIMING, { DAS: 100, ARR: 16, LOCK_DELAY: 500 });
// Object.assign(STARFALL_CONFIG.FEATURES, { hard_drop: true, hold: true, modern_scoring: true });

// BEGINNER FRIENDLY
// Object.assign(STARFALL_CONFIG.TIMING, { DAS: 200, ARR: 40, LOCK_DELAY: 800 });
// Object.assign(STARFALL_CONFIG.SCORING, { START_LEVEL: -1, LINES_PER_LEVEL: 15 });

// EXPERT/SPEED PLAYER
// Object.assign(STARFALL_CONFIG.TIMING, { DAS: 80, ARR: 16, LOCK_DELAY: 300 });
// Object.assign(STARFALL_CONFIG.SCORING, { START_LEVEL: 5, LINES_PER_LEVEL: 8 });

// HIGH PERFORMANCE (for slower devices)
// Object.assign(STARFALL_CONFIG.VISUAL, { SCANLINES: false, PARTICLES: false, PARALLAX: false });
// Object.assign(STARFALL_CONFIG.PERFORMANCE, { MAX_PARTICLES: 5, AUDIO_POLYPHONY: 4 });

// ACCESSIBILITY MODE
// Object.assign(STARFALL_CONFIG.ACCESSIBILITY, { 
//   COLORBLIND_FRIENDLY: true, HIGH_CONTRAST: true, MOTION_REDUCTION: true 
// });

/*
 * HOW TO USE:
 * 1. Copy this configuration to the top of your HTML file
 * 2. Adjust values to taste - all settings are live-tunable
 * 3. Uncomment preset configurations for quick setup
 * 4. Add new presets for different audiences/hardware
 * 
 * TUNING TIPS:
 * - Lower DAS = more responsive, higher = more forgiving
 * - Lower ARR = faster movement, higher = more controlled  
 * - Longer LOCK_DELAY = easier placement, shorter = more challenging
 * - Adjust GRAVITY_TABLE for custom difficulty curves
 * - Toggle FEATURES for different rule sets (NES vs modern)
 */
