# Docker Setup for Fight&Flight Studio

This guide explains how to run the Fight&Flight Studio application using Docker.

## Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.x or higher

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker-compose down -v
```

The application will be available at:
- **Application**: http://localhost:3001
- **MongoDB**: localhost:27017

### 2. Initial Setup

After starting the containers, populate the database with initial data:

```bash
# Create admin user
docker-compose exec app node scripts/create-admin.js

# Create test users
docker-compose exec app node scripts/create-test-users.js

# Populate sample classes
docker-compose exec app node scripts/populate-classes.js

# Populate sample data
docker-compose exec app node scripts/populate-sample-data.js
```

## Manual Docker Build

If you want to build the Docker image manually without compose:

```bash
# Build the image
docker build -t fightflight-app .

# Run MongoDB
docker run -d --name fightflight-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7.0

# Run the application
docker run -d --name fightflight-app \
  -p 3001:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/fight-flight-studio \
  --link fightflight-mongodb:mongodb \
  fightflight-app
```

## Environment Variables

Copy `.env.docker` to `.env` and configure your environment variables:

```bash
cp .env.docker .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: MongoDB connection string
- `NEXT_PUBLIC_API_URL`: Public API URL
- Add payment gateway keys and other secrets

## Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Execute Commands in Container
```bash
# Open shell in app container
docker-compose exec app sh

# Run Node scripts
docker-compose exec app node scripts/your-script.js
```

### Database Management
```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh fight-flight-studio

# Backup database
docker-compose exec mongodb mongodump --out=/data/backup

# Restore database
docker-compose exec mongodb mongorestore /data/backup
```

### Rebuild After Code Changes
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

For production deployment:

1. Update `docker-compose.yml` with production configurations
2. Set strong MongoDB credentials
3. Configure proper volume mounts for data persistence
4. Use Docker secrets for sensitive data
5. Set up proper networking and firewall rules
6. Configure SSL/TLS certificates
7. Set up monitoring and logging

### Production Docker Compose Example

```yaml
services:
  mongodb:
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: your_secure_password
      
  app:
    environment:
      - MONGODB_URI=mongodb://admin:your_secure_password@mongodb:27017/fight-flight-studio?authSource=admin
      - NODE_ENV=production
```

## Troubleshooting

### Container won't start
```bash
# Check container logs
docker-compose logs app

# Check container status
docker-compose ps
```

### MongoDB connection issues
```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test MongoDB connection
docker-compose exec mongodb mongosh
```

### Application not accessible
```bash
# Check port binding
docker ps

# Verify container networking
docker network inspect fightflight-network
```

### Reset Everything
```bash
# Stop and remove everything including volumes
docker-compose down -v

# Remove all images
docker rmi $(docker images -q fightflight*)

# Start fresh
docker-compose up -d --build
```

## Health Checks

The MongoDB service includes health checks. You can verify status:

```bash
docker-compose ps
```

Healthy services will show "healthy" in the status column.

## Volume Management

Data is persisted in Docker volumes:
- `mongodb_data`: Database files
- `mongodb_config`: MongoDB configuration
- `./logs`: Application logs (bind mount)
- `./uploads`: User uploads (bind mount)

View volumes:
```bash
docker volume ls
```

## Performance Optimization

1. **Multi-stage builds**: Dockerfile uses multi-stage builds to minimize image size
2. **Layer caching**: Dependencies are cached separately from application code
3. **Non-root user**: App runs as non-root user for security
4. **Health checks**: Ensures services are ready before dependent services start

## Security Notes

1. Never commit `.env` files with secrets to version control
2. Use Docker secrets for production deployments
3. Run containers as non-root users
4. Keep Docker and images up to date
5. Scan images for vulnerabilities: `docker scan fightflight-app`
6. Use private registries for production images

## Next Steps

- Configure environment variables in `.env`
- Set up continuous deployment with Docker
- Configure reverse proxy (nginx/traefik) for SSL
- Set up monitoring with Prometheus/Grafana
- Configure automated backups
