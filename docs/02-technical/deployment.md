# Deployment & DevOps

## Infrastructure

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Internet / Users                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌───────────────────────┐   ┌────────────────────────┐
    │  Vercel CDN (Global)  │   │   Railway Platform     │
    │                       │   │                        │
    │  ┌─────────────────┐  │   │  ┌──────────────────┐  │
    │  │   Frontend SPA  │  │   │  │  Backend API     │  │
    │  │   (React Build) │  │   │  │  (Node.js)       │  │
    │  │                 │  │   │  │                  │  │
    │  │  - Static HTML  │  │   │  │  Port: 8080      │  │
    │  │  - JS Bundles   │  │   │  │  Env: production │  │
    │  │  - CSS Assets   │  │   │  └────────┬─────────┘  │
    │  └─────────────────┘  │   │           │            │
    │         │             │   │           │            │
    │         │ API Calls   │   │           │ SQL        │
    │         └─────────────┼───┼───────────┤            │
    └───────────────────────┘   │           │            │
                                │           ▼            │
                                │  ┌──────────────────┐  │
                                │  │   PostgreSQL DB  │  │
                                │  │                  │  │
                                │  │  - User data     │  │
                                │  │  - Entries       │  │
                                │  │  - Reports       │  │
                                │  │  Port: 5432      │  │
                                │  └──────────────────┘  │
                                └────────────────────────┘
                                           │
                                           │ HTTPS
                                           ▼
                                ┌──────────────────────┐
                                │   External AI API    │
                                │  (Google Gemini)     │
                                └──────────────────────┘
```

### Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| **Development** | `localhost:5173` (Frontend)<br>`localhost:5000` (Backend) | `dev` | Local development with Docker Compose |
| **Production** | `emotion-diary.vercel.app` (Frontend)<br>`emotion-api.railway.app` (Backend) | `main` | Live production environment for users |

## CI/CD Pipeline:
This project does not implement an automated CI/CD pipeline. Deployments are handled manually:

- Frontend (Vercel): Automatic deployment triggered by pushing to **main** branch via GitHub integration
- Backend (Railway): Automatic deployment triggered by pushing to **main** branch via GitHub integration
- Local Development: Manual Docker Compose commands for building and running containers

## Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | Yes | `5000` |
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXX` |
| `DATABASE_HOST` | PostgreSQL database host | Yes | `localhost` (local) / `railway-host` (prod) / `db` (docker) |
| `DATABASE_PORT` | PostgreSQL database port | Yes | `5432` |
| `DATABASE_USER` | Database user for application | Yes | `app_write` |
| `DATABASE_PASSWORD` | Database user password | Yes | `***` (stored in secrets) |
| `DATABASE_NAME` | Database name | Yes | `emotion_diary` |
| `JWT_SECRET` | Secret key for JWT signing | Yes | `***` (stored in secrets) |
| `JWT_EXPIRES_IN` | JWT token expiration time | Yes | `7d` |
| `SMTP_HOST` | SMTP server for password reset emails | Yes | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | Yes | `587` |
| `SMTP_USER` | SMTP user email | Yes | `your_email@gmail.com` |
| `SMTP_PASSWORD` | SMTP user password | Yes | `***` (stored in secrets) |
| `APP_NAME` | Application name for emails | Yes | `Emotion Diary` |
| `FRONTEND_URL` | Frontend URL for CORS configuration | Yes | `http://localhost:5173` (dev) / `https://emotion-diary.vercel.app` (prod) |
| `SUPERUSER_PASSWORD` | PostgreSQL superuser password | Yes | *** |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `http://localhost:5000` (dev) / `https://emotion-api.railway.app` (prod) |

**Secrets Management:**
- **Local Development:** `.env` files in backend/frontend directories (gitignored)
- **Production:** Railway dashboard for backend secrets, Vercel dashboard for frontend secrets
- **Never commit** `.env` files to Git; use `.env.example` as template

## How to Run Locally

### Prerequisites

- [Node.js 20 LTS+](https://nodejs.org/)
- [Docker Desktop](https://docker.com/products/docker-desktop/) (includes Docker Compose ≥ 2.x)
- [Git](https://git-scm.com/)
- Code editor (VS Code recommended)

**Minimum System Requirements:**
- RAM: 4 GB
- CPU: 2 cores
- Disk space: 2 GB free

### Setup Steps

#### 1. Clone the repository

```bash
git clone https://github.com/drnyuta/Emotion.git
cd Emotion
```

#### 2. Create environment files

Create `.env` files in `backend/`, `frontend/`, and root directory based on `.env.example` templates.

**Backend `.env`:**
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key

DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=app_write
DATABASE_PASSWORD=your_app_write_password
DATABASE_NAME=emotion_diary

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_smtp_password
APP_NAME=Emotion Diary

FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000
```

**Root directoty `.env`:**
```env
SUPERUSER_PASSWORD=jjfjnBHBHbjbj
DATABASE_NAME=emotion_diary
```

#### 3. **IMPORTANT:** Update SQL initialization script

Before starting Docker, replace placeholder passwords in `postgres/init-scripts/05_create_roles_and_privileges.sql`:

```sql
CREATE ROLE admin LOGIN PASSWORD '<AdminPassword>';  -- Replace with your admin password
CREATE ROLE app_write LOGIN PASSWORD '<WritePassword>';  -- Must match DATABASE_PASSWORD in backend .env
CREATE ROLE app_read LOGIN PASSWORD '<ReadPassword>';  -- Replace with your read password
```

#### 4. Start Docker containers

**Development mode**:

```bash
# Start development containers
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Start with rebuild (if Dockerfile changed)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Start in detached mode (background)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

**Production mode** (optimized build):

```bash
# Start production containers with rebuild
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Stop production containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

**Build Performance:**
- **Cold build** (first time, no cache): Backend ~19 minutes, Frontend ~1-2 minutes
- **Warm build** (with cache): Backend ~10-25 seconds, Frontend ~10 seconds

**Resource Usage:**
- PostgreSQL: ~391 MB RAM, 2-4% CPU
- Backend: ~1.5 GB RAM, 1-5% CPU
- Frontend (dev): ~508 MB RAM, <10% CPU

### Verify Installation

After starting the containers:

1. **Frontend:** Open [http://localhost:5173](http://localhost:5173)
   - You should see the login/register page
   - UI should be responsive and styled correctly

2. **Backend Health:** Visit [http://localhost:5000/health](http://localhost:5000/health)
   - Expected response: `OK`

3. **API Documentation:** Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
   - Swagger UI should display all available endpoints

4. **Database Connection:** Check backend container logs
   - Look for: `Connected to PostgreSQL` or similar message

**Useful commands:**

```bash
# Build and run all services
docker-compose up --build

# Stop all containers
docker-compose down

# View logs of all containers
docker-compose logs -f

# View logs of a specific container
docker logs emotion-backend-dev -f
docker logs postgres -f

# Stop and remove all containers, networks, and volumes
# WARNING: This will delete database data!
docker-compose down -v

# List running containers
docker ps

# Restart a specific service
docker-compose restart backend
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 5432 already in use | Stop existing PostgreSQL: `docker stop postgres` or change port in docker-compose.yml |
| Port 5000 already in use | Change PORT in backend/.env to 5001 and update VITE_API_URL in frontend/.env |
| Database connection refused | Ensure Docker is running: `docker ps` should show postgres container. Ensure that DATABASE_HOST=db in backend/.env |
| CORS errors in browser | Check FRONTEND_URL in backend/.env matches your frontend URL |
| TypeScript compilation errors | Delete node_modules in containers: `docker-compose down -v && docker-compose up --build` |
| SQL role errors on startup | Verify passwords in `05_create_roles_and_privileges.sql` match backend .env |
| Build takes too long | First build is slow (~19 min for backend); subsequent builds use cache (~10-25 sec) |

## Monitoring & Logging

| Aspect | Tool | Access |
|--------|------|--------|
| **Application Logs** | Docker logs / Railway logs | `docker-compose logs -f` or Railway dashboard → Logs |
| **Error Tracking** | Console logging (MVP) | Backend logs via `docker logs emotion-backend-dev -f` |
| **Database Monitoring** | Docker stats / Railway metrics | `docker stats postgres` or Railway dashboard → Metrics |
| **Uptime** | Manual checks (MVP) | Backend health endpoint: `/health` |
| **Performance** | Browser DevTools / Docker stats | Chrome DevTools → Network/Performance tabs |
