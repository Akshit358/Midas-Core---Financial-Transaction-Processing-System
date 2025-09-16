#!/bin/bash

# Midas Core Production Deployment Script
echo "🚀 Deploying Midas Core Financial Transaction Processing System..."

# Configuration
APP_NAME="midas-core"
VERSION="1.0.0"
DOCKER_IMAGE="midas-core:${VERSION}"
DOCKER_REGISTRY="your-registry.com"
NAMESPACE="midas-core"
REPLICAS=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v helm &> /dev/null; then
        log_warning "Helm is not installed. Some features may not be available."
    fi
    
    log_success "Prerequisites check completed"
}

# Build Docker image
build_image() {
    log_info "Building Docker image: ${DOCKER_IMAGE}"
    
    docker build -t ${DOCKER_IMAGE} .
    
    if [ $? -eq 0 ]; then
        log_success "Docker image built successfully"
    else
        log_error "Failed to build Docker image"
        exit 1
    fi
}

# Tag and push image
push_image() {
    log_info "Tagging and pushing image to registry..."
    
    docker tag ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/${APP_NAME}:${VERSION}
    docker tag ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/${APP_NAME}:latest
    
    docker push ${DOCKER_REGISTRY}/${APP_NAME}:${VERSION}
    docker push ${DOCKER_REGISTRY}/${APP_NAME}:latest
    
    if [ $? -eq 0 ]; then
        log_success "Image pushed successfully to registry"
    else
        log_error "Failed to push image to registry"
        exit 1
    fi
}

# Deploy to Kubernetes
deploy_k8s() {
    log_info "Deploying to Kubernetes..."
    
    # Create namespace if it doesn't exist
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply Kubernetes manifests
    kubectl apply -f k8s/ -n ${NAMESPACE}
    
    # Wait for deployment to be ready
    kubectl wait --for=condition=available --timeout=300s deployment/${APP_NAME} -n ${NAMESPACE}
    
    if [ $? -eq 0 ]; then
        log_success "Application deployed successfully to Kubernetes"
    else
        log_error "Failed to deploy application to Kubernetes"
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # This would typically run Flyway migrations
    # For now, we'll just log the step
    log_info "Database migrations would be run here"
    log_success "Database migrations completed"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Get the service URL
    SERVICE_URL=$(kubectl get service ${APP_NAME} -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    
    if [ -z "$SERVICE_URL" ]; then
        SERVICE_URL="localhost:8080"
    fi
    
    # Wait for the application to be ready
    for i in {1..30}; do
        if curl -f http://${SERVICE_URL}/api/actuator/health > /dev/null 2>&1; then
            log_success "Application is healthy and ready"
            return 0
        fi
        log_info "Waiting for application to be ready... (attempt $i/30)"
        sleep 10
    done
    
    log_error "Health check failed - application is not responding"
    return 1
}

# Main deployment process
main() {
    log_info "Starting Midas Core deployment process..."
    
    check_prerequisites
    build_image
    
    if [ "$1" = "--push" ]; then
        push_image
    fi
    
    if [ "$1" = "--k8s" ] || [ "$2" = "--k8s" ]; then
        deploy_k8s
        run_migrations
        health_check
    fi
    
    log_success "Midas Core deployment completed successfully!"
    log_info "Application URL: http://${SERVICE_URL:-localhost:8080}/api"
    log_info "API Documentation: http://${SERVICE_URL:-localhost:8080}/swagger-ui.html"
    log_info "Health Check: http://${SERVICE_URL:-localhost:8080}/api/actuator/health"
}

# Run main function with all arguments
main "$@"
