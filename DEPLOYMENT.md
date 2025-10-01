# 🚀 Midas Core 2.0 - Deployment Guide

## 📋 Prerequisites

Before deploying Midas Core 2.0, ensure you have the following installed:

- **Java 21+** (OpenJDK recommended)
- **Node.js 18+** and npm 8+
- **Docker** and Docker Compose
- **PostgreSQL 15+**
- **Redis 7+**
- **Apache Kafka 3.5+**

## 🔧 Local Development Setup

### 1. Backend Setup

```bash
# Navigate to project root
cd Midas-Core---Financial-Transaction-Processing-System

# Build the application
./mvnw clean install

# Start with Docker Compose (includes all dependencies)
docker-compose up -d

# Run the application
./mvnw spring-boot:run
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## 🌐 GitHub Sync

### Option 1: Using Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to [GitHub Settings](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`, `write:packages`
   - Copy the token

2. **Push to GitHub:**
   ```bash
   # Use the provided script
   ./push-to-github.sh
   
   # Or manually
   git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/Akshit358/Midas-Core---Financial-Transaction-Processing-System.git main
   ```

### Option 2: Using SSH

1. **Generate SSH key:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add to GitHub:**
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Add to GitHub: Settings → SSH and GPG keys

3. **Change remote URL:**
   ```bash
   git remote set-url origin git@github.com:Akshit358/Midas-Core---Financial-Transaction-Processing-System.git
   git push origin main
   ```

## 🐳 Docker Deployment

### 1. Build Images

```bash
# Build backend image
docker build -t midas-core-backend .

# Build frontend image
docker build -t midas-core-frontend ./frontend
```

### 2. Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Production Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: midascore
      POSTGRES_USER: midascore
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
    ports:
      - "9092:9092"

  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=jdbc:postgresql://postgres:5432/midascore
      - REDIS_HOST=redis
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
    depends_on:
      - postgres
      - redis
      - kafka

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
    depends_on:
      - backend

volumes:
  postgres_data:
```

## ☸️ Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl create namespace midas-core
```

### 2. Apply Manifests

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/ -n midas-core

# Check deployment status
kubectl get pods -n midas-core
kubectl get services -n midas-core
```

### 3. Access the Application

```bash
# Get service URLs
kubectl get ingress -n midas-core

# Port forward for local access
kubectl port-forward svc/midas-core-frontend 3000:80 -n midas-core
kubectl port-forward svc/midas-core-backend 8080:80 -n midas-core
```

## ☁️ Cloud Deployment

### AWS Deployment

```bash
# Using AWS CLI
aws eks create-cluster --name midas-core-cluster --role-arn arn:aws:iam::ACCOUNT:role/EKSClusterRole

# Deploy with Helm
helm install midas-core ./helm-chart --namespace midas-core
```

### Azure Deployment

```bash
# Create AKS cluster
az aks create --resource-group midas-core-rg --name midas-core-cluster --node-count 3

# Deploy application
kubectl apply -f k8s/ -n midas-core
```

### Google Cloud Deployment

```bash
# Create GKE cluster
gcloud container clusters create midas-core-cluster --num-nodes=3

# Deploy application
kubectl apply -f k8s/ -n midas-core
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Database
DATABASE_URL=jdbc:postgresql://your-db-host:5432/midascore
DATABASE_USERNAME=midascore
DATABASE_PASSWORD=your_secure_password

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Kafka
KAFKA_BOOTSTRAP_SERVERS=your-kafka-host:9092
KAFKA_TOPIC_TRANSACTIONS=transactions
KAFKA_TOPIC_EVENTS=events

# AI/ML
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-4
FRAUD_DETECTION_ENABLED=true

# Blockchain
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_key
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_private_key

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Monitoring
PROMETHEUS_ENDPOINT=http://prometheus:9090
GRAFANA_ENDPOINT=http://grafana:3000
```

## 📊 Monitoring & Observability

### 1. Prometheus Metrics

```bash
# Access metrics endpoint
curl http://localhost:8080/actuator/prometheus
```

### 2. Grafana Dashboard

```bash
# Access Grafana
open http://localhost:3000

# Default credentials: admin/admin
```

### 3. Health Checks

```bash
# Application health
curl http://localhost:8080/actuator/health

# Liveness probe
curl http://localhost:8080/actuator/health/liveness

# Readiness probe
curl http://localhost:8080/actuator/health/readiness
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup

```bash
# Generate SSL certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Configure in application.yml
server:
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: your_password
```

### 2. Firewall Configuration

```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 8080  # Backend API
ufw allow 3000  # Frontend
```

### 3. Database Security

```sql
-- Create dedicated user
CREATE USER midascore WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE midascore TO midascore;
GRANT USAGE ON SCHEMA public TO midascore;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO midascore;
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy Midas Core 2.0

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
      - run: ./mvnw test
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t midas-core-backend .
      - run: docker build -t midas-core-frontend ./frontend
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          kubectl apply -f k8s/ -n midas-core
```

## 📝 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check port usage
   lsof -i :8080
   lsof -i :3000
   ```

2. **Database connection issues:**
   ```bash
   # Test database connection
   psql -h localhost -U midascore -d midascore
   ```

3. **Memory issues:**
   ```bash
   # Increase JVM memory
   export JAVA_OPTS="-Xmx2g -Xms1g"
   ```

4. **Docker issues:**
   ```bash
   # Clean up Docker
   docker system prune -a
   ```

### Logs

```bash
# Application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Kubernetes logs
kubectl logs -f deployment/midas-core-backend -n midas-core
kubectl logs -f deployment/midas-core-frontend -n midas-core
```

## 📞 Support

For deployment issues:

- **Documentation**: [docs.midascore.com](https://docs.midascore.com)
- **GitHub Issues**: [github.com/midascore/platform/issues](https://github.com/midascore/platform/issues)
- **Discord**: [discord.gg/midascore](https://discord.gg/midascore)
- **Email**: support@midascore.com

---

**🎉 Congratulations! Your Midas Core 2.0 platform is ready for deployment!**
