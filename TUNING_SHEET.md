# Starfall Blocks - Tuning Sheet
**Game Balance and Progression Tables**

## 1. Gravity Progression Table

### Frames Per Row by Level (60 FPS)
| Level | Frames/Row | Time/Row (ms) | Speed Description |
|-------|------------|---------------|-------------------|
| 0     | 48         | 800           | Leisurely (beginner) |
| 1     | 43         | 717           | Comfortable |
| 2     | 38         | 633           | Steady |
| 3     | 33         | 550           | Picking up |
| 4     | 28         | 467           | Moderate |
| 5     | 23         | 383           | Quick |
| 6     | 18         | 300           | Fast |
| 7     | 13         | 217           | Very fast |
| 8     | 8          | 133           | Intense |
| 9     | 6          | 100           | Frantic |
| 10    | 5          | 83            | Hyper |
| 11-12 | 5          | 83            | Sustained hyper |
| 13-15 | 4          | 67            | Expert |
| 16-18 | 3          | 50            | Master |
| 19-28 | 2          | 33            | Grandmaster |
| 29+   | 1          | 17            | Death mode |

### Gravity Curve Analysis
- **Levels 0-9**: Smooth acceleration curve for learning
- **Levels 10-12**: Brief plateau to consolidate skills  
- **Levels 13+**: Steep ramp for expert challenge
- **Level 29**: Maximum speed - 1 frame per row (60 Hz)

## 2. Scoring System

### Base Line Clear Values
| Clear Type | Base Points | Level 0 Score | Level 9 Score | Level 19 Score |
|------------|-------------|---------------|---------------|----------------|
| Single     | 100         | 100           | 1,000         | 2,000          |
| Double     | 300         | 300           | 3,000         | 6,000          |
| Triple     | 500         | 500           | 5,000         | 10,000         |
| Tetris     | 800         | 800           | 8,000         | 16,000         |

### Scoring Formula
```
Final Score = Base Points × (Current Level + 1)
```

### Movement Scoring
| Action | Points Per Cell | Risk/Reward Balance |
|--------|-----------------|---------------------|
| Soft Drop | 1 | Low risk, consistent points |
| Hard Drop | 2 | Commitment bonus |
| Lock Delay | 0 | No cheese/exploitation |

### Example Score Progression
| Game Event | Level | Calculation | Running Total |
|------------|-------|-------------|---------------|
| Start      | 0     | -           | 0             |
| Tetris     | 0     | 800 × 1     | 800           |
| Double     | 1     | 300 × 2     | 1,400         |
| Soft Drop (3 cells) | 1 | 3 × 1 | 1,403         |
| Tetris     | 2     | 800 × 3     | 3,803         |
| Level Up   | 3     | -           | 3,803         |

## 3. Level Progression

### Lines Required Per Level
| Level Range | Lines to Clear | Cumulative Lines | Time Estimate |
|-------------|----------------|------------------|---------------|
| 0 → 1       | 10             | 10               | 2-3 min       |
| 1 → 2       | 10             | 20               | 1.5-2 min     |
| 2 → 3       | 10             | 30               | 1-1.5 min     |
| 3 → 4       | 10             | 40               | 45s-1 min     |
| 4 → 5       | 10             | 50               | 30-45s        |
| 5 → 6       | 10             | 60               | 20-30s        |
| 6 → 7       | 10             | 70               | 15-20s        |
| 7 → 8       | 10             | 80               | 10-15s        |
| 8 → 9       | 10             | 90               | 8-12s         |
| 9 → 10      | 10             | 100              | 6-10s         |

### Progression Curve
- **Early Levels (0-4)**: Generous time for pattern recognition
- **Mid Levels (5-9)**: Steady acceleration, skill building
- **High Levels (10+)**: Survival mode, reaction-based

## 4. Timing Configuration

### Input Response Timing
| Parameter | Value (ms) | Description |
|-----------|------------|-------------|
| DAS (Delayed Auto Shift) | 130 | Initial delay before auto-repeat |
| ARR (Auto Repeat Rate) | 23 | Time between auto-repeat moves |
| Lock Delay | 500 | Time piece stays active on ground |
| Entry Delay | 150 | Pause between pieces |

### Animation Timing
| Effect | Duration (ms) | Purpose |
|--------|---------------|---------|
| Line Clear Animation | 300 | Visual feedback satisfaction |
| Level Up Banner | 500 | Achievement celebration |
| Tetris Fanfare | 400 | Special accomplishment |
| Game Over Fade | 900 | Graceful conclusion |

### Input Feel Tuning
| Scenario | DAS Behavior | ARR Behavior |
|----------|--------------|--------------|
| Initial Press | Immediate move | - |
| Hold (< 130ms) | No repeat | - |
| Hold (> 130ms) | Begin repeat | Every 23ms |
| Ground Contact | DAS preserved | Continue repeat |
| Direction Change | Reset DAS | Reset ARR |

## 5. Audio Timing and Mixing

### SFX Duration Table
| Sound Effect | Duration (ms) | Wave Type | Pitch/Notes |
|--------------|---------------|-----------|-------------|
| Move/Shift   | 30            | Square    | G4          |
| Rotate       | 40            | Triangle  | Bb4         |
| Lock         | 60            | Square    | E4          |
| Line Clear   | 220           | Pulse     | C5          |
| Tetris       | 400           | Pulse     | C4-G4-C5    |
| Level Up     | 500           | Sawtooth  | F4-A4-C5-F5 |
| Hard Drop    | 60            | Noise     | -           |
| Game Over    | 900           | Triangle  | E4-Eb4-D4-C#4-C4 |

### Audio Mix Levels
| Audio Type | dB Level | Purpose |
|------------|----------|---------|
| Master | -8 | Headroom for dynamics |
| SFX Bus | -12 | Clear but not overwhelming |
| Music Bus | -16 | Background, ducks for SFX |

## 6. Performance Tuning

### Frame Rate Targets
| Scenario | Target FPS | Minimum FPS | Optimization Level |
|----------|------------|-------------|-------------------|
| Normal Play | 60 | 55 | Standard |
| High Speed (L20+) | 60 | 58 | Critical |
| Line Clear Animation | 60 | 50 | Acceptable |
| Game Over | 60 | 30 | Relaxed |

### Rendering Optimization Thresholds
| Element | Draw Calls/Frame | CPU Budget (ms) |
|---------|------------------|-----------------|
| Background | 1 | 1.0 |
| Board Grid | 1 | 2.0 |
| Active Piece | 1 | 0.5 |
| Ghost Piece | 1 | 0.5 |
| HUD Elements | 4 | 1.5 |
| Particles | 10 max | 2.0 |
| **Total** | **18 max** | **7.5** |

## 7. Difficulty Scaling

### Player Skill Milestones
| Level Range | Skill Focus | Success Rate Target |
|-------------|-------------|-------------------|
| 0-2 | Basic controls, piece recognition | 95% completion |
| 3-5 | Stacking strategy, efficiency | 80% completion |
| 6-8 | Speed building, quick decisions | 60% completion |
| 9-12 | Advanced techniques, consistency | 40% completion |
| 13-18 | Expert reflexes, pattern memory | 20% completion |
| 19+ | Survival, pure reaction | 5% completion |

### Balancing Knobs for Testing
| Parameter | Default | Min | Max | Impact |
|-----------|---------|-----|-----|--------|
| DAS | 130ms | 80ms | 200ms | Input responsiveness |
| ARR | 23ms | 10ms | 50ms | Movement speed |
| Lock Delay | 500ms | 200ms | 1000ms | Difficulty adjustment |
| Lines/Level | 10 | 5 | 20 | Progression speed |

## 8. Score Benchmarks

### Target Scores by Level
| Level Reached | Low Score | Average Score | High Score |
|---------------|-----------|---------------|------------|
| 5 | 5,000 | 12,000 | 25,000 |
| 10 | 20,000 | 50,000 | 100,000 |
| 15 | 75,000 | 150,000 | 300,000 |
| 20 | 200,000 | 400,000 | 800,000 |
| 25 | 500,000 | 1,000,000 | 2,000,000 |

### Scoring Distribution Analysis
- **70% of score** should come from Tetris clears
- **20% of score** should come from Double/Triple clears
- **10% of score** should come from Singles and soft/hard drops

This balancing encourages efficient play while maintaining multiple valid strategies.
