#!/bin/bash

# Quick Start Script for Fight&Flight Studio with Docker

echo "🚀 Starting Fight&Flight Studio with Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Build and start containers
echo "📦 Building and starting containers..."
docker-compose up -d --build

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if containers are running
if [ "$(docker-compose ps -q app)" ]; then
    echo ""
    echo "✅ Application container is running"
else
    echo ""
    echo "❌ Application container failed to start"
    docker-compose logs app
    exit 1
fi

if [ "$(docker-compose ps -q mongodb)" ]; then
    echo "✅ MongoDB container is running"
else
    echo "❌ MongoDB container failed to start"
    docker-compose logs mongodb
    exit 1
fi

# Populate initial data
echo ""
echo "📊 Setting up initial data..."
echo "Creating test users..."
docker-compose exec -T app node scripts/create-test-users.js

echo "Populating classes..."
docker-compose exec -T app node scripts/populate-classes.js

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Application is running at: http://localhost:3001"
echo "🗄️  MongoDB is running at: localhost:27017"
echo ""
echo "📝 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop: docker-compose down"
echo "  - Restart: docker-compose restart"
echo ""
