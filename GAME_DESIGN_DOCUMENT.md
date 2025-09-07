# Starfall Blocks - Game Design Document
**SNES-Style Tetris Clone**

## 1. Vision & Core Goals

### One-Liner
A faithful 16-bit Tetris homage: fast, readable, crunchy SFX, authentic gravity curve, classic scoring/levels, buttery inputs.

### Primary Goals
- **Authentic 16-bit Feel**: Faithful to Nintendo Tetris without modern twists (no T-Spins/back-to-back)
- **Single-File Demo**: HTML5 Canvas implementation - paste-and-play, 60 FPS, deterministic gameplay
- **Classic Progression**: Traditional scoring and 10-lines-per-level advancement
- **SNES-Era Aesthetics**: Crisp pixel tiles, subtle gradient blocks, scanline-style backdrop
- **Minimal Configuration**: Board size, gravity curve, DAS/ARR, keybinds at top

### Non-Goals
- Advanced multiplayer netcode
- Modern SRS with complex wall kicks
- T-Spins, back-to-back bonus, combo chains (toggles remain off by default)

## 2. Core Game Loop

1. **Spawn**: Next tetromino appears at top, centered
2. **Control**: Player shifts/rotates to place before lock delay expires
3. **Lock**: Piece locks, check/clear full lines, award points
4. **Progress**: Advance gravity by level; every 10 lines → next level
5. **Continue**: Repeat until stack reaches spawn zone → Game Over

## 3. Playfield Specifications

- **Dimensions**: 10 columns × 20 visible rows + 2 hidden buffer rows
- **Cell Size**: 16px × 16px
- **Spawn Position**: Column 3, Row -1
- **Visual Style**: Thin light inner stroke with dark outer bezel
- **No Garbage Support**: Classic Tetris only

## 4. Tetromino System

### Piece Set (Standard 7)
| Piece | Color | Shape Description |
|-------|-------|------------------|
| I | Cyan (#59CBE8) | 4-block line |
| J | Blue (#3D5AA9) | L-shape, hook left |
| L | Orange (#F99D1C) | L-shape, hook right |
| O | Yellow (#F2D94E) | 2×2 square |
| S | Green (#76C893) | Z-shape, peak left |
| T | Purple (#B084CC) | T-shape |
| Z | Red (#E86A6A) | Z-shape, peak right |

### Mechanics
- **Randomizer**: 7-bag system (shuffle all 7, then refill)
- **Rotation**: Classic Nintendo-lite (basic floor/wall kick, no complex SRS)
- **Lock Delay**: 500ms with 1 reset on ground movement
- **Hold System**: Disabled by default, once-per-drop when enabled

## 5. Control Scheme

### Default Bindings
- **Movement**: Arrow Left/Right
- **Soft Drop**: Arrow Down (1 point per cell)
- **Hard Drop**: Spacebar (2 points per cell)
- **Rotation**: X (CW), Z (CCW)
- **Hold**: C (when enabled)
- **System**: P (Pause), R (Reset)

### Input Feel
- **DAS**: 130ms (Delayed Auto Shift)
- **ARR**: 23ms (Auto Repeat Rate)
- **DAS Charge**: Persists when piece touches ground

## 6. Scoring System

### Line Clear Values
- **Single**: 100 points
- **Double**: 300 points
- **Triple**: 500 points
- **Tetris**: 800 points

### Calculation
```
Final Score = Base Points × (Current Level + 1)
```

### Movement Bonuses
- **Soft Drop**: 1 point per cell descended
- **Hard Drop**: 2 points per cell descended
- **Lock Bonus**: 0 points (authentic to original)

### Level Progression
- **Lines Per Level**: 10
- **Starting Level**: 0
- **Maximum Level**: 29
- **Level Up**: Occurs immediately when line threshold reached

## 7. Audio Design

### Sound Effects Profile
- **Engine**: Tone.js with Web Audio API fallback
- **Style**: Crunchy chiptune, authentic to 16-bit era
- **Mixing**: Master at -8dB, music ducks during SFX

### SFX Mapping
| Action | Wave | Pitch | Duration |
|--------|------|-------|----------|
| Move | Square | G4 | 30ms |
| Rotate | Triangle | Bb4 | 40ms |
| Lock | Square | E4 | 60ms |
| Line Clear | Pulse | C5 | 220ms |
| Tetris | Pulse | C4-G4-C5 arpeggio | 400ms |
| Level Up | Sawtooth | F4-A4-C5-F5 arpeggio | 500ms |
| Hard Drop | Noise | - | 60ms |
| Game Over | Triangle | E4-Eb4-D4-C#4-C4 melody | 900ms |

### Music
- **Style**: Short chiptune loop (~40 seconds)
- **Tempo**: 140 BPM
- **Behavior**: Loops seamlessly, ducks during major SFX

## 8. Visual Design

### Canvas Specifications
- **Resolution**: 480×320 pixels
- **Scaling**: Integer nearest-neighbor for pixel art
- **Layers**: Static BG → Playfield → Active Piece/Ghost → UI/HUD → Toasts

### Block Aesthetics
- **Size**: 16×16 pixels
- **Style**: Beveled with inner highlight and edge shadow
- **Ghost Piece**: 25% alpha overlay
- **Colors**: Authentic to NES/SNES palette

### UI Elements
- **Font**: PressStart2P or pixel fallback
- **Palette**: 7-color retro scheme
- **Background**: Subtle diagonal scanlines with low-contrast vignette
- **HUD Panels**: Next piece, Score, Level, Lines, Hold (optional)

## 9. Game States

1. **Boot**: Initial loading and setup
2. **Title**: Main menu with start prompt
3. **Gameplay**: Active play session
4. **Paused**: Suspended gameplay
5. **Game Over**: End screen with restart option

## 10. Notifications & Feedback

### Visual Feedback
- **Level Up**: Banner with jingle
- **Tetris**: Special fanfare
- **Line Clear**: Brief animation (300ms)
- **Game Over**: Modal card with restart prompt

### Particle Effects
- **Line Clear**: Simple star sparkle
- **Background**: Parallax starfield with subtle drift

## 11. Accessibility & Quality of Life

### Options
- **Colorblind Support**: Alternative palette option
- **Visual Toggles**: Ghost piece, next preview
- **Practice Mode**: Level -1 for slow training
- **Customization**: Key remapping via config

### Performance
- **Target**: 60 FPS on mid-range laptops
- **Optimization**: Batched draw calls, minimal GC pressure
- **Scaling**: Graceful degradation for low-end devices

## 12. Technical Requirements

### Browser Compatibility
- **Modern browsers** supporting HTML5 Canvas and Web Audio API
- **Offline capable**: Single-file implementation
- **No external dependencies** except optional Tone.js

### Performance Targets
- **60 FPS** sustained gameplay
- **<40ms** audio latency
- **Deterministic** behavior with fixed timestep
