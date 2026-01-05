# Criterion: Containerization

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-01-04

### Context

The Emotion Diary application requires a consistent, reproducible development environment that works across different operating systems (Windows, macOS, Linux) and machines. The application stack includes a Node.js backend, React frontend, and PostgreSQL database, each with specific dependencies and configuration requirements. Developers need to quickly set up the entire stack locally without manually installing multiple tools, and the deployment environment should mirror local development to minimize "works on my machine" issues.

### Decision

Implement **Docker containerization** with **Docker Compose** for orchestrating multiple services. Use multi-stage builds to optimize image sizes, separate development and production configurations, and implement role-based database initialization scripts. Each service (backend, frontend, PostgreSQL) runs in its own container with defined resource limits and health checks.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| Manual local setup (Node.js + PostgreSQL installed) | No Docker overhead, direct access to logs | Inconsistent environments, difficult onboarding, version conflicts | Team members have different OS setups; manual setup error-prone |
| Kubernetes (K8s) | Production-grade orchestration, scaling, auto-healing | Steep learning curve, overkill for local dev, complex configuration | MVP doesn't require orchestration; Docker Compose sufficient |

### Consequences

**Positive:**
- **Environment Consistency:** Docker ensures identical setup on all machines (dev, staging, production)
- **Fast Onboarding:** New developers run `docker-compose up` and have full stack ready in minutes
- **Isolated Services:** Each service runs in its own container; dependency conflicts eliminated
- **Production Parity:** Local Docker setup mirrors Railway production deployment
- **Easy Database Reset:** `docker-compose down -v` instantly resets database for testing
- **Multi-Stage Builds:** Separate build and runtime stages reduce final image sizes (frontend: 30-50 MB)
- **Automated Initialization:** Database migrations run automatically on container startup

**Negative:**
- **Resource Overhead:** Docker Desktop uses ~2-4 GB RAM; backend container alone uses 1.5 GB
- **Long Initial Build:** Cold build for backend takes ~19 minutes due to npm dependency installation
- **Windows Performance:** Docker Desktop on Windows slower than Linux/macOS native
- **Storage Usage:** Images consume ~600 MB total disk space

**Neutral:**
- Requires Docker Desktop installed (additional software dependency)
- Network bridge complexity for inter-container communication

## Implementation Details

### Docker Structure

```
project/
├── backend/
│   ├── Dockerfile              # Production backend image
│   ├── Dockerfile.dev          # Development backend image (hot reload)
│   └── .dockerignore           # Exclude node_modules, logs
├── frontend/
│   ├── Dockerfile              # Production frontend image (multi-stage)
│   ├── Dockerfile.dev          # Development frontend image (Vite dev server)
│   ├── nginx.conf              # Nginx configuration for production
│   └── .dockerignore
├── postgres/
│   └── init-scripts/           # Database initialization SQL scripts
│       ├── 02_create_tables.sql
│       ├── 03_insert_seed_data.sql
│       ├── 04_create_indexes.sql
│       ├── 05_create_roles_and_privileges.sql
│       ├── 06_create_views.sql
│       ├── 07_create_triggers.sql
│       └── 08_password_reset_tokens_table.sql
├── docker-compose.yml          # Base configuration (shared services)
├── docker-compose.dev.yml      # Development overrides (hot reload, volume mounts)
├── docker-compose.prod.yml     # Production overrides (optimized builds)
└── .env.example                # Environment variables template
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **Multi-Stage Builds** | Separate build and runtime stages reduce image size (frontend: 50 MB vs 300+ MB with source) |
| **node:20-slim Base Image** | Smaller attack surface, security patches, compatible with TypeScript, 200-300 MB vs 1+ GB for full node image |
| **nginx:stable-alpine for Frontend** | Lightweight (5 MB), production-grade web server, optimized caching for static files |
| **Separate Dev/Prod Dockerfiles** | Dev includes hot reload, source maps, verbose logging; Prod optimized for size and performance |
| **Non-Root User (nodeuser)** | Security best practice; prevents privilege escalation attacks |
| **Volume Mounts in Dev** | Code changes reflected instantly without rebuilding; improves developer experience |
| **Health Checks** | Docker monitors service health; restarts unhealthy containers automatically |

### Docker Images

#### Backend Image

**Base Image:** `node:20-slim`  
**Final Size:** ~200-300 MB (production)  
**Build Strategy:** Multi-stage build

```dockerfile
# Stage 1: Builder
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim
RUN useradd -m -s /bin/bash nodeuser
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER nodeuser
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

**Optimizations:**
- Only production dependencies installed (`npm ci --only=production`)
- No source TypeScript files in final image
- Non-root user `nodeuser` for security
- No `node_modules` copied from host (prevents permission issues)

#### Frontend Image

**Base Image:** Build stage: `node:20-slim`, Runtime: `nginx:stable-alpine`  
**Final Size:** ~30-50 MB (production)  
**Build Strategy:** Multi-stage build

```dockerfile
# Stage 1: Build React app
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Optimizations:**
- Only static build files in final image (HTML, JS, CSS)
- No source code or node_modules included
- Nginx optimized for caching and compression
- Alpine Linux base (~5 MB) for minimal footprint

#### PostgreSQL Image

**Base Image:** `postgres:15`  
**Final Size:** ~400 MB (official image)  
**Initialization:** Automatic SQL script execution

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${SUPERUSER_PASSWORD}
      POSTGRES_DB: emotion_diary
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
```

**Optimizations:**
- External volume for data persistence
- Init scripts run automatically on first startup (alphabetical order)
- No unnecessary PostgreSQL extensions installed

### Docker Compose Configuration

**Base Configuration (`docker-compose.yml`):**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${SUPERUSER_PASSWORD}
      POSTGRES_DB: emotion_diary
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: emotion-backend
    environment:
      PORT: ${PORT}
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: ${DATABASE_USER}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
      DATABASE_NAME: ${DATABASE_NAME}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "5000:5000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: emotion-frontend
    environment:
      VITE_API_URL: ${VITE_API_URL}
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Development Override (`docker-compose.dev.yml`):**
```yaml
services:
  backend:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend/src:/app/src
      - ./backend/package.json:/app/package.json
    command: npm run dev
    
  frontend:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
    command: npm run dev
    ports:
      - "5173:5173"
```

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Dockerfile for each service | ✅ | Separate Dockerfiles for backend, frontend (dev + prod variants) |
| 2 | Multi-stage builds for optimization | ✅ | Frontend: builder → nginx; Backend: builder → runtime |
| 3 | Docker Compose orchestration | ✅ | `docker-compose.yml` + dev/prod overrides |
| 4 | Environment variable configuration | ✅ | `.env.example` template, variables passed to containers |
| 5 | Volume mounts for data persistence | ✅ | Named volume `postgres_data` for database |
| 6 | Service dependencies and health checks | ✅ | Backend depends on PostgreSQL health check |
| 7 | Separate dev and production configs | ✅ | `docker-compose.dev.yml` and `docker-compose.prod.yml` |
| 8 | Non-root user for security | ✅ | Backend uses `nodeuser` (UID 1000) |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| Long cold build time (19 min) | Slow first-time setup; CI/CD builds slow | Use Docker layer caching in CI; pre-built base images with dependencies |
| High backend memory usage (1.5 GB) | Not suitable for low-memory systems | Optimize Node.js memory limits with `--max-old-space-size`; use Alpine Node image |
| Windows Docker Desktop performance | Slower than Linux/macOS; higher resource usage | Use WSL2 backend; consider Linux VM for development |
| No automatic container updates | Security patches require manual rebuild | Implement Watchtower or Renovate Bot for automated updates |
| Single-host only | Cannot scale across multiple machines | Migrate to Kubernetes or Docker Swarm for multi-host orchestration |

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Multi-Stage Builds Best Practices](https://docs.docker.com/build/building/multi-stage/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)