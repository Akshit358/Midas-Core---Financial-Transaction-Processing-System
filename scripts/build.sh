#!/bin/bash

# Midas Core Build Script
echo "🏗️  Building Midas Core Financial Transaction Processing System..."

# Check if Maven is available
if command -v mvn &> /dev/null; then
    echo "✅ Maven found, building with Maven..."
    mvn clean package -DskipTests
    echo "✅ Build completed successfully!"
elif command -v docker &> /dev/null; then
    echo "🐳 Maven not found, building with Docker..."
    docker build -t midas-core .
    echo "✅ Docker build completed successfully!"
else
    echo "❌ Neither Maven nor Docker found!"
    echo "Please install one of the following:"
    echo "1. Maven: brew install maven"
    echo "2. Docker: brew install docker"
    exit 1
fi

echo "🎉 Midas Core build process completed!"
echo ""
echo "To run the application:"
echo "1. Start infrastructure: docker-compose up -d"
echo "2. Run application: ./scripts/start.sh"
echo "3. Access API docs: http://localhost:8080/swagger-ui.html"
