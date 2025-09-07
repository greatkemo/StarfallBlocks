# Starfall Blocks - SNES-Style Tetris Clone
**🎮 A complete, production-ready Tetris implementation with Docker deployment**

This is a fully implemented SNES-style Tetris clone built with HTML5 Canvas and vanilla JavaScript, containerized with Docker for easy deployment.

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
git clone <repository-url>
cd StarfallBlocks
./run.sh
```
Open `http://localhost:8080` in your browser.

### Option 2: Direct File
Simply open `starfall-blocks.html` in any modern browser.

## ✨ Features

### Authentic Gameplay
- **7-bag randomizer** for fair piece distribution
- **Classic SNES gravity curves** across 30 levels
- **DAS/ARR input handling** (130ms/23ms timing)
- **Lock delay with reset limit** for authentic feel
- **Ghost piece preview** and **hard drop**
- **Traditional scoring system** with level multipliers

### Modern Polish  
- **Pixel-perfect retro graphics** with scanline effects
- **Chiptune audio system** using Web Audio API
- **Responsive zoom controls** (50%-300% scaling)
- **Mobile-friendly design** with touch support
- **Smooth 60 FPS performance**

### Technical Excellence
- **Single-file implementation** - complete game in one HTML file
- **Docker containerization** with nginx for production deployment
- **Zero external dependencies** (optional Google Fonts)
- **Cross-browser compatibility**

## 🎮 Controls

| Action | Key |
|--------|-----|
| Move | ← → Arrow Keys |
| Soft Drop | ↓ Down Arrow |  
| Hard Drop | Space Bar |
| Rotate | X (CW), Z (CCW) |
| Pause | P |
| Reset | R |
| Zoom | + / - |

## 📁 Project Structure

```
StarfallBlocks/
├── starfall-blocks.html    # 🎯 Complete game (single file)
├── Dockerfile             # 🐳 Container configuration
├── nginx.conf             # 🌐 Web server setup
├── docker-compose.yml     # 📦 Compose configuration
├── run.sh                 # 🚀 Quick start script
└── README.md              # 📖 This file
```

## 🔧 Technical Implementation

### Game Engine
- **HTML5 Canvas** with 480×360 resolution  
- **Fixed timestep game loop** at 60 FPS
- **Modular architecture**: Input → Gravity → Board → Renderer
- **Authentic Tetris mechanics** including wall kicks

### Configuration System
```javascript
BOARD: { COLS: 10, ROWS_VISIBLE: 20, CELL_SIZE: 16 }
TIMING: { DAS: 130, ARR: 23, LOCK_DELAY: 500 }
GRAVITY_TABLE: { 0: 48, 1: 43, ..., 29: 1 } // frames per drop
```

### Docker Deployment
- **nginx:alpine** base image (minimal footprint)
- **Production-ready** configuration
- **Port 8080** mapping with hot-reload support

## 🎯 Game Mechanics

### Scoring
- **Single**: 100 × (level + 1)
- **Double**: 300 × (level + 1)  
- **Triple**: 500 × (level + 1)
- **Tetris**: 800 × (level + 1)
- **Soft Drop**: 1 point per cell
- **Hard Drop**: 2 points per cell

### Progression
- **Level up** every 10 lines cleared
- **Gravity increases** following authentic SNES curve
- **Maximum level 29** (1 frame per drop = ~60 drops/second)

## 🎨 Visual Design

- **SNES-authentic color palette**
- **Bevel-effect blocks** with highlights and shadows
- **Subtle scanlines** for CRT monitor feel
- **Clean HUD** with score, level, lines, and next piece
- **Responsive scaling** maintains pixel-perfect rendering

## 🔊 Audio System

- **Web Audio API** chiptune sounds
- **Square wave synthesis** for authentic 8-bit feel
- **Sound effects**: Move, rotate, lock, line clear, Tetris, level up, game over
- **Graceful degradation** if audio unavailable

## 🧪 Development & Testing

The game has been thoroughly tested for:
- ✅ **Gameplay accuracy** - matches SNES Tetris behavior
- ✅ **Performance** - 60 FPS on mid-range hardware
- ✅ **Cross-browser compatibility** - Chrome, Firefox, Safari, Edge
- ✅ **Mobile responsiveness** - works on phones and tablets
- ✅ **Docker deployment** - production-ready containerization

## 🎮 Browser Compatibility

- **Modern browsers** with HTML5 Canvas support
- **Web Audio API** for sound (optional)
- **Mobile browsers** with touch controls
- **Works offline** - no internet required after loading

## 🚢 Production Deployment

The Docker container is production-ready:
```bash
docker build -t starfall-blocks .
docker run -d -p 80:80 starfall-blocks  # Production port
```

## 📝 License

Open source - feel free to modify and distribute.

---

**🌟 This is a complete, playable implementation ready for production use!**
