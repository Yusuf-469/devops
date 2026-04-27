#!/bin/bash

# HEALIX Docker Build Script

set -e

echo "🚀 Building HEALIX Docker Image..."

# Build production image
docker build -t healix:latest .

echo "✅ Build complete!"
echo ""
echo "📋 Available commands:"
echo "  docker run -p 8080:80 healix:latest                    # Run production container"
echo "  docker-compose up dev                                 # Run development with hot reload"
echo "  docker-compose up                                      # Run production locally"
echo ""
echo "🌐 Access at: http://localhost:8080 (production) or http://localhost:3000 (dev)"
echo ""
echo "📤 To push to Docker Hub:"
echo "  docker tag healix:latest your-username/healix:latest"
echo "  docker push your-username/healix:latest"