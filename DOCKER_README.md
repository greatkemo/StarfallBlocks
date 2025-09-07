# 🎮 Starfall Blocks - Docker Container

**Ready-to-run SNES-style Tetris clone in Docker**

## 🚀 Quick Start

### Option 1: One-Command Launch
```bash
./run.sh
```

### Option 2: Manual Docker Commands
```bash
# Build the image
docker build -t starfall-blocks .

# Run the container
docker run -d --name starfall-blocks-game -p 8080:80 starfall-blocks
```

### Option 3: Docker Compose
```bash
docker-compose up -d
```

## 🎯 Access the Game

Once running, open your browser to:
**http://localhost:8080**

## 🎮 Game Controls

| Action | Key |
|--------|-----|
| Move Left/Right | ← → |
| Soft Drop | ↓ |
| Hard Drop | SPACE |
| Rotate | X / Z |
| Pause | P |
| Reset | R |

## ⚙️ Container Management

```bash
# Check if running
docker ps | grep starfall-blocks

# View logs
docker logs starfall-blocks-game

# Stop the game
docker stop starfall-blocks-game

# Restart the game
docker start starfall-blocks-game

# Remove container
docker rm starfall-blocks-game

# Remove image
docker rmi starfall-blocks
```

## 🔧 Configuration

The game includes several preset configurations:

- **Classic NES**: Authentic Nintendo Tetris feel
- **Modern**: Guideline-style responsive controls  
- **Beginner**: Slower, more forgiving gameplay
- **Expert**: Fast-paced for skilled players

Edit `starfall-blocks.html` and rebuild to customize settings.

## 📦 What's Included

- **Complete Tetris Implementation**: All standard features
- **SNES Aesthetics**: Pixel-perfect 16-bit graphics
- **Web Audio**: Chiptune sound effects and music
- **60 FPS Performance**: Smooth, responsive gameplay
- **Mobile Responsive**: Works on desktop and mobile
- **Offline Capable**: No internet required after loading

## 🏗️ Container Details

- **Base Image**: nginx:alpine (~6MB)
- **Port**: 80 (mapped to 8080 on host)
- **Volume**: Optional development mount
- **Restart Policy**: unless-stopped

## 🎯 Game Features

✅ **Authentic Tetris Gameplay**  
✅ **7-Bag Randomizer**  
✅ **Classic Scoring System**  
✅ **Level Progression (10 lines/level)**  
✅ **Ghost Piece**  
✅ **Hard Drop**  
✅ **Lock Delay with Reset Limit**  
✅ **DAS/ARR Input Handling**  
✅ **Chiptune Audio**  
✅ **Pause/Resume**  

## 🐛 Troubleshooting

### Container won't start
```bash
docker logs starfall-blocks-game
```

### Port 8080 already in use
```bash
# Use different port
docker run -d --name starfall-blocks-game -p 9080:80 starfall-blocks
# Then access at http://localhost:9080
```

### Audio not working
- Click anywhere in the game to enable audio (browser autoplay policy)
- Check browser console for audio errors

### Performance issues
- Close other browser tabs
- Disable browser extensions
- Check if hardware acceleration is enabled

## 🎮 Ready to Play!

Your SNES-style Tetris clone is now containerized and ready to run anywhere Docker is available. Enjoy the authentic 16-bit puzzle experience!
