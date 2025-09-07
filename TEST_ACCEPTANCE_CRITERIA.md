# Starfall Blocks - Test Plan & Acceptance Criteria
**Quality Assurance and Validation Strategy**

## 1. Acceptance Criteria

### Core Gameplay Requirements

#### AC-001: Gravity and Level Progression
**Requirement**: Game must implement authentic Tetris gravity curve with proper level advancement.

**Acceptance Criteria**:
- [ ] At level 0, gravity advances one row every ~0.8s (48 frames at 60 FPS)
- [ ] At level 9, gravity advances one row every ~0.1s (6 frames at 60 FPS)  
- [ ] At level 29, gravity advances one row every ~0.017s (1 frame at 60 FPS)
- [ ] Clearing exactly 10 lines increases level by 1
- [ ] Level progression triggers immediately when line threshold reached
- [ ] Gravity speed matches the specified frames-per-row table exactly

**Test Method**: Automated timing measurement with stopwatch validation

---

#### AC-002: Scoring System Accuracy
**Requirement**: Scoring must follow classic Tetris formula with level multipliers.

**Acceptance Criteria**:
- [ ] Single line clear = 100 × (level + 1) points
- [ ] Double line clear = 300 × (level + 1) points
- [ ] Triple line clear = 500 × (level + 1) points
- [ ] Tetris line clear = 800 × (level + 1) points
- [ ] Soft drop awards exactly 1 point per cell descended
- [ ] Hard drop awards exactly 2 points per cell descended
- [ ] No T-Spin bonuses when modern features disabled
- [ ] No back-to-back bonuses when modern features disabled

**Test Method**: Programmatic score verification with known input sequences

---

#### AC-003: Input Response System
**Requirement**: Input handling must feel responsive and predictable.

**Acceptance Criteria**:
- [ ] DAS (Delayed Auto Shift) triggers after exactly 130ms by default
- [ ] ARR (Auto Repeat Rate) repeats every 23ms after DAS triggers
- [ ] Initial keypress moves piece immediately (0-frame delay)
- [ ] Input response remains consistent across all frame rates (60fps, 120fps, 144fps)
- [ ] Direction change resets DAS timer immediately
- [ ] DAS charge persists when piece touches ground

**Test Method**: Frame-accurate input timing measurement with high-speed recording

---

#### AC-004: Lock Delay Mechanics
**Requirement**: Lock delay must prevent infinite manipulation while allowing reasonable adjustments.

**Acceptance Criteria**:
- [ ] Pieces remain active for exactly 500ms when touching ground
- [ ] Lock delay resets maximum 1 time per piece when moving horizontally
- [ ] Lock delay resets maximum 1 time per piece when rotating
- [ ] Total time on ground cannot exceed 2 seconds regardless of resets
- [ ] Piece locks immediately when time limits reached

**Test Method**: Automated test with simulated infinite movement attempts

---

#### AC-005: Game Over Conditions
**Requirement**: Game over must trigger when stack reaches spawn area.

**Acceptance Criteria**:
- [ ] Game over triggers when any locked cell occupies row -1 or -2 (spawn buffer)
- [ ] Game over triggers when new piece cannot spawn at initial position
- [ ] Game over does not trigger for pieces temporarily in spawn area during play
- [ ] Game over screen displays final score, level, and lines cleared
- [ ] Restart functionality returns to clean initial state

**Test Method**: Scripted high-stack scenarios with boundary testing

---

### Technical Performance Requirements

#### AC-006: Frame Rate Consistency
**Requirement**: Game must maintain smooth 60 FPS performance.

**Acceptance Criteria**:
- [ ] Sustains 60 FPS during normal gameplay on mid-range laptop (2019+)
- [ ] Maintains minimum 55 FPS during line clear animations
- [ ] No frame drops during high-speed gameplay (level 20+)
- [ ] Consistent frame timing with fixed-step game logic
- [ ] Performance degradation graceful on lower-end hardware

**Test Method**: Automated FPS monitoring over 30-minute sessions

---

#### AC-007: Single File Implementation
**Requirement**: Complete game must work as standalone HTML file.

**Acceptance Criteria**:
- [ ] Runs offline without internet connection
- [ ] No external file dependencies (except optional Tone.js CDN)
- [ ] Self-contained HTML file under 500KB
- [ ] Works when opened directly in browser (file:// protocol)
- [ ] Compatible with modern browsers (Chrome 80+, Firefox 75+, Safari 13+)

**Test Method**: Offline testing with network disabled

---

#### AC-008: Audio System Requirements
**Requirement**: Audio must enhance gameplay without blocking functionality.

**Acceptance Criteria**:
- [ ] SFX play with <40ms perceived latency from action
- [ ] Audio works after user interaction (handles autoplay restrictions)
- [ ] Game remains fully playable when audio fails or disabled
- [ ] No audio crackling or distortion during sustained play
- [ ] Music loops seamlessly without gaps or pops

**Test Method**: Audio latency measurement with oscilloscope, subjective testing

---

### User Experience Requirements

#### AC-009: Visual Quality Standards
**Requirement**: Graphics must maintain pixel-perfect 16-bit aesthetic.

**Acceptance Criteria**:
- [ ] All sprites render crisp without blur or aliasing
- [ ] Integer scaling maintains pixel art integrity at all resolutions
- [ ] Colors match specified palette exactly
- [ ] Ghost piece visible at 25% opacity
- [ ] Smooth animations at 60 FPS (line clear, level up banners)

**Test Method**: Visual comparison against reference images, pixel-level inspection

---

#### AC-010: Accessibility Compliance
**Requirement**: Game must be playable by users with common accessibility needs.

**Acceptance Criteria**:
- [ ] Colorblind-friendly palette option available
- [ ] All controls remappable via configuration
- [ ] Ghost piece toggle for visual clarity
- [ ] Pause functionality works immediately
- [ ] Clear visual feedback for all game state changes

**Test Method**: Accessibility audit with screen readers and colorblind simulation

---

## 2. Test Plan Structure

### Unit Tests

#### Test Suite 1: Piece Rotation Logic
```javascript
describe('Tetromino Rotation', () => {
  test('I-piece 4-state rotation cycle', () => {
    const piece = new Tetromino('I');
    // Test all 4 rotation states return to original
    piece.rotate(1); piece.rotate(1); piece.rotate(1); piece.rotate(1);
    expect(piece.rotation).toBe(0);
  });
  
  test('Wall kick resolution', () => {
    const board = new Board();
    const piece = new Tetromino('T', 0, 5); // Against left wall
    expect(piece.rotate(1, board)).toBe(true); // Should kick right
  });
  
  test('Failed rotation returns false', () => {
    const board = new Board();
    board.grid[5][4] = 'I'; // Block rotation space
    const piece = new Tetromino('T', 3, 5);
    expect(piece.rotate(1, board)).toBe(false);
  });
});
```

#### Test Suite 2: Collision Detection
```javascript
describe('Collision System', () => {
  test('Boundary collision detection', () => {
    const board = new Board();
    const piece = new Tetromino('I', -1, 0); // Off left edge
    expect(board.isValidPosition(piece.cells, piece.x, piece.y)).toBe(false);
  });
  
  test('Piece-to-piece collision', () => {
    const board = new Board();
    board.grid[19][5] = 'I'; // Occupied cell
    const piece = new Tetromino('O', 4, 18); // Overlapping position
    expect(board.isValidPosition(piece.cells, piece.x, piece.y)).toBe(false);
  });
});
```

#### Test Suite 3: Line Clear Detection
```javascript
describe('Line Clearing', () => {
  test('Single line clear detection', () => {
    const board = new Board();
    // Fill bottom row except one cell
    for (let x = 0; x < 9; x++) board.grid[19][x] = 'I';
    board.grid[19][9] = 'T'; // Complete the line
    
    const lines = board.checkLines();
    expect(lines).toEqual([19]);
  });
  
  test('Multiple line clear (Tetris)', () => {
    const board = new Board();
    // Fill bottom 4 rows completely
    for (let y = 16; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        board.grid[y][x] = 'I';
      }
    }
    
    const lines = board.checkLines();
    expect(lines).toEqual([16, 17, 18, 19]);
  });
});
```

#### Test Suite 4: Scoring Mathematics
```javascript
describe('Scoring System', () => {
  test('Base scoring values', () => {
    expect(calculateScore(1, 0)).toBe(100); // Single at level 0
    expect(calculateScore(2, 0)).toBe(300); // Double at level 0
    expect(calculateScore(4, 0)).toBe(800); // Tetris at level 0
  });
  
  test('Level multiplier application', () => {
    expect(calculateScore(4, 9)).toBe(8000); // Tetris at level 9
    expect(calculateScore(1, 19)).toBe(2000); // Single at level 19
  });
  
  test('Soft drop scoring', () => {
    const score = calculateSoftDropScore(5); // 5 cells
    expect(score).toBe(5);
  });
});
```

---

### Integration Tests

#### Test Suite 5: Input Timing Validation
```javascript
describe('DAS/ARR Integration', () => {
  test('DAS timing accuracy', async () => {
    const input = new InputHandler();
    const startTime = performance.now();
    
    // Simulate key press
    input.keys.add('ArrowLeft');
    
    // Wait for DAS to trigger
    while (performance.now() - startTime < 130) {
      input.update(16.67);
      await sleep(16.67);
    }
    
    input.update(16.67);
    expect(input.dasCharged).toBe(true);
  });
  
  test('ARR consistency', async () => {
    const input = new InputHandler();
    input.dasCharged = true;
    input.lastDirection = 'left';
    
    let arrTriggers = 0;
    const startTime = performance.now();
    
    while (performance.now() - startTime < 200) {
      const result = input.updateARR(16.67);
      if (result?.arr) arrTriggers++;
      await sleep(16.67);
    }
    
    // Should trigger approximately every 23ms
    expect(arrTriggers).toBeGreaterThan(7);
    expect(arrTriggers).toBeLessThan(10);
  });
});
```

#### Test Suite 6: Gravity System Integration
```javascript
describe('Gravity and Lock Timing', () => {
  test('Gravity progression accuracy', () => {
    const gravity = new GravitySystem();
    const frames = [];
    
    // Test multiple levels
    for (let level = 0; level < 10; level++) {
      const expectedFrames = CONFIG.GRAVITY_TABLE[level];
      const measuredFrames = measureGravityFrames(gravity, level);
      expect(measuredFrames).toBe(expectedFrames);
    }
  });
  
  test('Lock delay with movement reset', () => {
    const gravity = new GravitySystem();
    gravity.startLocking();
    
    // Advance time partway through lock delay
    gravity.update(250, 0, mockPiece, mockBoard);
    expect(gravity.isLocking).toBe(true);
    
    // Reset with movement
    gravity.resetLock();
    expect(gravity.lockTimer).toBe(0);
    
    // Should still be locking but timer reset
    expect(gravity.isLocking).toBe(true);
  });
});
```

---

### Manual Testing Procedures

#### Test Procedure 1: Input Feel Validation
**Duration**: 15 minutes per tester  
**Participants**: 5 players of varying skill levels

**Steps**:
1. Play 3 games at level 0-2 (beginner speed)
2. Play 3 games at level 7-9 (intermediate speed)  
3. Play 1 game at level 15+ (expert speed)
4. Rate input responsiveness (1-10 scale)
5. Note any "sticky" or "floaty" sensations

**Success Criteria**: Average rating ≥ 8.0, no reports of control issues

#### Test Procedure 2: Audio Latency Assessment
**Duration**: 10 minutes  
**Equipment**: Audio measurement tools

**Steps**:
1. Record gameplay with high-speed camera
2. Measure time between input action and SFX start
3. Test all major sound effects (move, rotate, lock, clear)
4. Verify audio-visual synchronization

**Success Criteria**: All SFX latency <40ms, no perceived desync

#### Test Procedure 3: Cross-Browser Compatibility
**Duration**: 2 hours  
**Platforms**: Windows, macOS, Linux

**Test Matrix**:
| Browser | Version | Platform | Status |
|---------|---------|----------|--------|
| Chrome | Latest | Windows 10 | ✓ |
| Chrome | Latest | macOS | ✓ |
| Firefox | Latest | Windows 10 | ✓ |
| Firefox | Latest | Linux | ✓ |
| Safari | Latest | macOS | ✓ |
| Edge | Latest | Windows 10 | ✓ |

**Success Criteria**: Full functionality on all listed configurations

---

### Performance Testing

#### Test Procedure 4: Sustained Performance Soak
**Duration**: 30 minutes continuous play  
**Metrics**: FPS, memory usage, audio glitches

**Monitoring**:
- Frame rate logged every second
- Memory usage tracked for leaks
- Audio dropout detection
- Input lag measurement

**Success Criteria**:
- FPS never drops below 55
- Memory usage stable (no leaks)
- Zero audio glitches
- Input lag remains <30ms

#### Test Procedure 5: High-Speed Gameplay Stress
**Duration**: 10 minutes at level 20+  
**Focus**: System stability under maximum stress

**Steps**:
1. Use save state to start at level 20
2. Play aggressively with rapid inputs
3. Monitor for frame skips or timing drift
4. Verify deterministic behavior

**Success Criteria**: No timing drift, stable 60 FPS, deterministic piece placement

---

### Automated Testing Infrastructure

#### Continuous Integration Pipeline
```yaml
test_pipeline:
  unit_tests:
    - piece_rotation_tests
    - collision_detection_tests  
    - scoring_math_tests
    - line_clear_tests
  
  integration_tests:
    - input_timing_tests
    - gravity_progression_tests
    - audio_system_tests
  
  performance_tests:
    - fps_benchmark_30min
    - memory_leak_detection
    - load_time_measurement
  
  compatibility_tests:
    - browser_matrix_validation
    - mobile_responsiveness_check
```

#### Test Data Generation
```javascript
// Generate deterministic test scenarios
const TEST_SCENARIOS = {
  scoring: generateScoringTestCases(),
  rotation: generateRotationTestCases(), 
  collision: generateCollisionTestCases(),
  endgame: generateGameOverScenarios()
};
```

### Definition of Done

A feature is considered complete when:
- [ ] All unit tests pass
- [ ] Integration tests validate timing accuracy
- [ ] Manual testing confirms expected user experience
- [ ] Performance benchmarks meet targets  
- [ ] Cross-browser compatibility verified
- [ ] Code review approved
- [ ] Documentation updated

### Release Readiness Checklist

- [ ] All P0 and P1 acceptance criteria met
- [ ] Performance targets achieved on test hardware
- [ ] Audio works across browser autoplay policies
- [ ] Visual quality matches pixel-perfect standards
- [ ] Input feel validated by external testers
- [ ] No critical bugs in issue tracker
- [ ] Single-file build under size limit
- [ ] Offline functionality verified

This comprehensive test plan ensures Starfall Blocks delivers an authentic, high-quality Tetris experience that meets modern web standards while preserving classic 16-bit gameplay feel.
