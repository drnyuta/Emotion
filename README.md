# Emotion

## Vision Statement

The “Emotion Diary” project envisions a world where technology helps individuals understand and regulate their emotions through conscious self-reflection.

It is a web-based emotional journaling platform powered by AI analysis that helps users track mood dynamics, recognize emotional patterns, and develop emotional intelligence (EQ).

The system combines daily journaling, emotion recognition, and personalized insights to make self-reflection an accessible, evidence-based, and engaging part of everyday life.

## Local Development Setup

### 1. Clone the repository:

```bash
git clone <repo_url>
cd Emotion
```

### 2. Create local **.env** files in backend/, frontend/, and globally based on **.env.example**
Set all variables with your own secure passwords

### 3. **Important:** Before starting, replace all placeholder passwords in SQL script **05_create_roles_and_privileges** with your own secure passwords:

```bash
CREATE ROLE admin LOGIN PASSWORD '<AdminPassword>';
CREATE ROLE app_write LOGIN PASSWORD '<WritePassword>';
CREATE ROLE app_read LOGIN PASSWORD '<ReadPassword>';
```

### 4. Start the containers:

**dev version:**

```bash
# Start development containers
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Start with rebuild
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Start in detached mode (background)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

```

**prod version:**

```bash
# Start production containers with rebuild
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Stop production containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

```

### 5. Access services:

Backend: http://localhost:5000

Frontend: http://localhost:5173

Swagger docs: http://localhost:5000/api-docs

**Check backend health:**

curl http://localhost:5000/health

Expected response: OK

### 6. Useful commands:

```bash
# Stop all containers
docker-compose down

# View logs of all containers
docker-compose logs -f

# View logs of a specific container
docker logs emotion-backend-dev -f
docker logs postgres -f

# Stop and remove all containers, networks, and volumes (WARNING: will delete DB data!)
docker-compose down -v

# List running containers
docker ps
```