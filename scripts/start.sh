#!/bin/bash

# Midas Core Start Script
# This script starts the Midas Core application with Docker Compose

set -e

echo "🚀 Starting Midas Core..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Midas Core started successfully!"
echo "🌐 Application: http://localhost:8080/api"
echo "📚 Swagger UI: http://localhost:8080/api/swagger-ui.html"
echo "📊 Actuator: http://localhost:8080/api/actuator"
echo "📈 Prometheus: http://localhost:9090"
echo "📊 Grafana: http://localhost:3000 (admin/admin)"
