# Docker Deployment Guide

This guide explains how to deploy the Real Estate CRM application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd real-estate-crm
```

### 2. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and configure:

- **Database**: PostgreSQL connection details (Neon DB or local)
- **JWT**: Secret key for authentication
- **Email**: Gmail SMTP credentials (use App Password)
- **Application**: Company details and contact information

### 3. Build and Run

Start all services:

```bash
docker-compose up -d
```

This will:
- Build the backend Spring Boot application
- Build the frontend React application
- Start both services with proper networking
- Configure health checks

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## Docker Commands

### Start Services

```bash
# Start in detached mode
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up -d backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild Services

```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Check Service Status

```bash
docker-compose ps
```

## Production Deployment

### 1. Environment Configuration

For production, ensure:

- Strong JWT secret (64+ characters)
- Secure database credentials
- Valid email SMTP credentials
- HTTPS enabled (use reverse proxy like Nginx/Traefik)

### 2. Use Production Compose File

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_JPA_SHOW_SQL: false
    # Add resource limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

Run with:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. SSL/TLS Configuration

Use a reverse proxy (Nginx, Traefik, or Caddy) for HTTPS:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Backend Not Starting

Check logs:
```bash
docker-compose logs backend
```

Common issues:
- Database connection failed: Verify DATABASE_URL, USERNAME, PASSWORD
- Port already in use: Change port mapping in docker-compose.yml
- Out of memory: Increase Docker memory limit

### Frontend Not Loading

Check logs:
```bash
docker-compose logs frontend
```

Common issues:
- API connection failed: Verify VITE_API_BASE_URL
- Build failed: Check Node.js version compatibility
- Nginx errors: Verify nginx.conf syntax

### Database Connection Issues

Test database connectivity:
```bash
docker-compose exec backend sh
wget --spider http://localhost:8080/actuator/health
```

### Health Check Failures

View health status:
```bash
docker inspect realestatecrm-backend | grep Health
```

## Monitoring

### Container Stats

```bash
docker stats
```

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:5173/health
```

## Backup and Restore

### Database Backup

```bash
# Export data (if using local PostgreSQL)
docker-compose exec postgres pg_dump -U username dbname > backup.sql
```

### Application Logs

```bash
# Export logs
docker-compose logs > application.log
```

## Scaling

Scale services horizontally:

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3
```

Note: Requires load balancer configuration.

## Security Best Practices

1. **Never commit .env files** - Use .env.example as template
2. **Use strong secrets** - Generate random JWT_SECRET
3. **Enable HTTPS** - Use reverse proxy with SSL
4. **Regular updates** - Keep Docker images updated
5. **Resource limits** - Set CPU and memory limits
6. **Network isolation** - Use Docker networks
7. **Non-root user** - Backend runs as non-root user
8. **Health checks** - Monitor service health

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push
        run: |
          docker-compose build
          docker-compose push
      
      - name: Deploy to server
        run: |
          ssh user@server 'cd /app && docker-compose pull && docker-compose up -d'
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review environment variables
- Verify network connectivity
- Check Docker resources (memory, disk space)
