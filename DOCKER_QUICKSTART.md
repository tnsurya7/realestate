# Docker Quick Start Guide

Get the Real Estate CRM running in minutes with Docker!

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Git installed

## Quick Start (3 Steps)

### Step 1: Clone and Configure

```bash
# Clone the repository
git clone <your-repo-url>
cd real-estate-crm

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

### Step 2: Start the Application

```bash
# Build and start all services
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

## Default Credentials

After first startup, use these credentials to login:

- **Email**: admin@realestatecrm.com (from your .env)
- **Password**: Admin@123 (from your .env)

## Common Commands

```bash
# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild after code changes
docker-compose up -d --build

# Check service status
docker-compose ps
```

## Troubleshooting

### Backend won't start?

Check database connection:
```bash
docker-compose logs backend | grep -i error
```

Verify your `.env` file has correct:
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

### Frontend can't connect to backend?

Verify `VITE_API_BASE_URL` in `.env` points to:
- `http://localhost:8080` (for local development)
- Your production backend URL (for production)

### Port already in use?

Change ports in `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Change 8080 to 8081
```

## Production Deployment

For production deployment with SSL, monitoring, and scaling, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md).

## Need Help?

- Check logs: `docker-compose logs -f`
- Verify environment: `docker-compose config`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down -v && docker-compose up -d`
