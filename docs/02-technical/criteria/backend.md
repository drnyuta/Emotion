# Criterion: Backend

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-01-05

### Context

The Emotion Diary application requires backend to handle user authentication, journal entry management, emotion tracking, AI integration for analysis, and analytics generation. The backend must support RESTful API endpoints consumed by the React frontend, securely manage user data in PostgreSQL, integrate with external AI services (Google Gemini), send password reset emails, and provide comprehensive API documentation. The solution must be scalable, maintainable by a solo developer, and deployable via Docker with minimal DevOps overhead.

### Decision

Implement a **Node.js 20 + Express.js** backend using **TypeScript** for type safety, following a **layered architecture** (routes → controllers → services → repositories) with clear separation of concerns. Use **JWT for authentication**, **bcrypt for password hashing**, **Nodemailer for email**, **Swagger for API documentation**, and integrate **Google Gemini API** for AI features. The backend is containerized with Docker and deployed on Railway with PostgreSQL database.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| Python + FastAPI | Modern async framework, type hints, auto-generated docs | Requires learning new language, smaller ecosystem for emotion tracking | Developer more experienced with Node.js, JavaScript full-stack advantage |
| NestJS (Node.js framework) | Structured architecture, built-in TypeScript, DI pattern | Steeper learning curve, more boilerplate, overkill for MVP | Express simpler for small team, less overhead |

### Consequences

**Positive:**
- **Full-Stack JavaScript:** Shared language with frontend reduces context switching
- **Async I/O:** Node.js event loop handles concurrent AI API calls and database queries efficiently
- **Rich Ecosystem:** npm provides libraries for auth (JWT), validation, email, AI integration
- **Type Safety:** TypeScript prevents runtime errors; improves maintainability for solo developer
- **Simple Deployment:** Express runs in Docker container, Railway handles scaling and HTTPS
- **API Documentation:** Swagger auto-generates interactive API docs from YAML spec
- **Maintainability:** Layered architecture keeps concerns separated, easy to test and extend

**Negative:**
- **Single-Threaded:** Node.js less suitable for CPU-intensive tasks (not relevant for I/O-bound app)
- **Callback Hell Risk:** Async code can become complex (mitigated with async/await)
- **TypeScript Overhead:** Requires compilation step, type definitions can be verbose

**Neutral:**
- No built-in ORM; raw SQL queries with node-postgres (acceptable for MVP)

## Implementation Details

### Project Structure

```
backend/
├── src/
│   ├── constants/              # Application constants
│   │   ├── system.prompt.ts    # AI system prompt
│   ├── controllers/            # Request handlers (route logic)
│   │   ├── ai.controller.ts    # AI chat, daily/weekly reports
│   │   ├── analytics.controller.ts  # Emotion statistics
│   │   ├── auth.controller.ts       # Login, register, password reset
│   │   ├── diary.controller.ts      # CRUD for journal entries
│   │   ├── emotion.controller.ts    # Emotion categories, details
│   │   ├── insights.controller.ts   # User insights CRUD
│   │   ├── question.controller.ts   # Question of the Day
│   │   └── streak.controller.ts     # Journaling streaks
│   ├── errors/                 # Custom error classes
│   │   └── ValidationError.ts  # Input validation errors
│   ├── middleware/             # Express middleware
│   │   ├── auth.ts             # JWT authentication
│   │   ├── errorLogger.ts      # Error logging
│   │   └── requestLogger.ts    # Request logging
│   ├── repositories/           # Database access layer
│   ├── routes/                 # API route definitions
│   │   ├── ai.routes.ts        # /ai/*
│   │   ├── analytics.routes.ts # /analytics/*
│   │   ├── auth.routes.ts      # /auth/*
│   │   ├── diary.ts            # /diary/*
│   │   ├── emotion.ts          # /emotions/*
│   │   ├── insights.ts         # /insights/*
│   │   ├── question.ts         # /questions/*
│   │   └── streak.ts           # /streak/*
│   ├── services/               # Business logic layer
│   │   ├── ai.service.ts       # Gemini API integration
│   │   ├── analytics.service.ts     # Emotion stats calculations
│   │   ├── auth.service.ts     # Auth logic, JWT, bcrypt
│   │   ├── diary.service.ts    # Journal entry logic
│   │   ├── emotion.service.ts  # Emotion queries
│   │   ├── insights.service.ts # Insights logic
│   │   ├── promptBuilder.ts    # AI prompt templates
│   │   ├── question.service.ts # Question queries
│   │   └── streak.service.ts   # Streak calculation logic
│   ├── utils/                  # Utility functions
│   │   ├── cleanAiJson.ts      # Parse AI JSON responses
│   │   ├── logger.ts           # Structured logging
│   │   └── validation.ts       # Input validators (gibberish, etc.)
│   ├── app.ts                  # Express app configuration
│   ├── database.ts             # PostgreSQL connection
│   ├── server.ts               # Server entry point
│   └── testData.txt            # AI test cases
├── dist/                       # Compiled JavaScript (generated)
├── logs/                       # Application logs
├── node_modules/               # Dependencies
├── .dockerignore               # Docker ignore patterns
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore patterns
├── Dockerfile                  # Production Docker image
├── Dockerfile.dev              # Development Docker image
├── package.json                # Dependencies and scripts
├── package-lock.json           # Dependency lock file
├── swagger.yaml                # API documentation
└── tsconfig.json               # TypeScript configuration
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **Layered Architecture** | Routes → Controllers → Services separates concerns; easier to test, maintain, extend |
| **TypeScript** | Type safety prevents runtime errors; shared types with frontend; better IDE support |
| **JWT Authentication** | Stateless tokens scale well; no server-side session storage; works with SPA architecture |
| **bcrypt Password Hashing** | Industry-standard; automatic salting; adjustable complexity (10 salt rounds) |
| **node-postgres (pg)** | Native PostgreSQL driver; parameterized queries prevent SQL injection; connection pooling |
| **Google Gemini API** | Fast response times (2.0 Flash); generous free tier; strong NLP for emotion analysis |
| **Swagger/OpenAPI** | Auto-generated interactive API docs; easy frontend-backend contract validation |
| **Nodemailer + SMTP** | Send password reset emails; supports Gmail, custom SMTP; well-documented |
| **Express Middleware Pattern** | Modular request processing (auth, logging, error handling); composable and testable |
| **Environment Variables** | Secrets (JWT_SECRET, DB credentials, API keys) never committed to Git |

### Code Examples

**Layered Architecture Example (Diary Entry Creation):**

```typescript
// routes/diary.ts
import { Router } from 'express';
import { DiaryController } from '../controllers/diary.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/new', authMiddleware, DiaryController.createNew);

export default router;
```

```typescript
// controllers/diary.controller.ts
import { Response } from 'express';
import * as DiaryService from '../services/diary.service';
import { AuthRequest } from '../middleware/auth';

export class DiaryController {
  static async createNew(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { entryDate, content, questionId, emotions } = req.body;

      if (!entryDate || !content || !emotions) {
        return res.status(400).json({
          success: false,
          error: 'entryDate, content and emotions are required',
        });
      }

      const entry = await DiaryService.createEntry(
        userId, entryDate, content, questionId, emotions
      );
      
      res.json({ success: true, entry });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
```

```typescript
// services/diary.service.ts
import pool from '../database';

export async function createEntry(
  userId: number,
  entryDate: string,
  content: string,
  questionId: number | null,
  emotions: number[]
) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert entry
    const entryResult = await client.query(
      `INSERT INTO diary_entries (user_id, entry_date, content, question_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, entryDate, content, questionId]
    );
    
    const entry = entryResult.rows[0];
    
    // Link emotions
    for (const emotionId of emotions) {
      await client.query(
        `INSERT INTO entry_emotions (entry_id, emotion_id) VALUES ($1, $2)`,
        [entry.id, emotionId]
      );
    }
    
    await client.query('COMMIT');
    return entry;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | RESTful API architecture | ✅ | Express routes follow REST conventions (GET, POST, PUT, DELETE) |
| 2 | Authentication and authorization | ✅ | JWT-based auth; authMiddleware protects routes; bcrypt password hashing |
| 3 | Database integration (CRUD operations) | ✅ | node-postgres for PostgreSQL; CRUD for entries, emotions, insights, reports |
| 4 | Input validation and error handling | ✅ | Request validation in controllers; try-catch blocks; structured error responses |
| 5 | Business logic separation (services layer) | ✅ | Controllers delegate to services (DiaryService, AIService, etc.) |
| 6 | External API integration | ✅ | Google Gemini API for AI analysis; Nodemailer for email |
| 7 | Logging and monitoring | ✅ | Winston-based logger; request/error logging middleware |
| 8 | API documentation | ✅ | Swagger/OpenAPI YAML spec at /api-docs endpoint |
| 9 | Environment configuration | ✅ | dotenv for env variables; .env.example template provided |
| 10 | TypeScript for type safety | ✅ | Full TypeScript backend; strict mode enabled; shared types |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| No rate limiting on most endpoints | Vulnerable to abuse, DoS attacks | Implement express-rate-limit on all endpoints |
| Raw SQL queries (no ORM) | More verbose code, potential for SQL injection if not careful | Migrate to Prisma or TypeORM for type-safe queries |
| No caching layer | Repeated database queries for same data (e.g., emotion categories) | Implement Redis caching for frequently accessed data |
| Single-server deployment | No horizontal scaling; single point of failure | Deploy multiple instances behind load balancer |
| Synchronous AI calls | API blocks while waiting for Gemini response (up to 10 sec) | Implement job queue (Bull/Redis) for async processing |
| No request validation library | Manual validation in each controller | Use Joi or Zod for schema-based validation |
| Logs not centralized | Hard to debug across Docker containers | Integrate with logging service (Logtail, Datadog) |
| No API versioning | Breaking changes affect all clients | Implement /v1/ prefix for future-proofing |

## References

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)