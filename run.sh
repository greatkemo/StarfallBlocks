#!/bin/bash

# Starfall Blocks - Docker Build and Run Script
# SNES-Style Tetris Clone

set -e

echo "🎮 Starfall Blocks - Docker Deployment"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image
echo "🏗️  Building Docker image..."
docker build -t starfall-blocks .

# Stop and remove existing container if it exists
if docker ps -a --format 'table {{.Names}}' | grep -q '^starfall-blocks-game$'; then
    echo "🛑 Stopping existing container..."
    docker stop starfall-blocks-game || true
    docker rm starfall-blocks-game || true
fi

# Run the container
echo "🚀 Starting Starfall Blocks..."
docker run -d \
    --name starfall-blocks-game \
    -p 8080:80 \
    --restart unless-stopped \
    starfall-blocks

# Wait a moment for container to start
sleep 2

# Check if container is running
if docker ps --format 'table {{.Names}}' | grep -q '^starfall-blocks-game$'; then
    echo "✅ Starfall Blocks is now running!"
    echo ""
    echo "🎯 Game URL: http://localhost:8080"
    echo "🔧 Container: starfall-blocks-game"
    echo ""
    echo "Controls:"
    echo "  ← → : Move pieces"
    echo "  ↓   : Soft drop"
    echo "  SPACE : Hard drop"
    echo "  X/Z : Rotate"
    echo "  P   : Pause"
    echo "  R   : Reset"
    echo ""
    echo "Commands:"
    echo "  docker logs starfall-blocks-game  # View logs"
    echo "  docker stop starfall-blocks-game  # Stop game"
    echo "  docker start starfall-blocks-game # Start game"
    echo "  docker rm starfall-blocks-game    # Remove container"
    echo ""
    echo "🎮 Have fun playing!"
    
    # Try to open browser (macOS/Linux)
    if command -v open > /dev/null 2>&1; then
        echo "🌐 Opening browser..."
        open http://localhost:8080
    elif command -v xdg-open > /dev/null 2>&1; then
        echo "🌐 Opening browser..."
        xdg-open http://localhost:8080
    fi
else
    echo "❌ Failed to start container. Checking logs..."
    docker logs starfall-blocks-game
    exit 1
fi
