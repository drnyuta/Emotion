# Technology Stack

## Stack Overview

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| **Frontend Framework** | React | 19.2.0 | Industry-standard SPA framework with excellent ecosystem, component reusability, and strong TypeScript support, familiar to developer |
| **Programming Language** | TypeScript | 5.9.3 | Type safety catches errors at compile time, improved IDE autocomplete, better maintainability, easier refactoring |
| **UI Framework** | Ant Design | 6.1.0 | Enterprise-grade React UI library with comprehensive component set, built-in internationalization, consistent design language, responsive grid system, and excellent TypeScript support |
| **Backend Runtime** | Node.js | 20 LTS | Asynchronous I/O ideal for API-heavy application, JavaScript across full stack, excellent npm ecosystem, active LTS support |
| **Backend Framework** | Express.js | 5.1.0 | Minimal, unopinionated framework perfect for REST APIs, extensive middleware ecosystem, battle-tested and stable |
| **Database** | PostgreSQL | 16 | ACID compliance ensures data integrity, powerful query capabilities for analytics, JSON support for flexible data, excellent documentation |
| **Database Client** | node-postgres (pg) | 8.16.3 | Native PostgreSQL driver for Node.js, supports parameterized queries (SQL injection prevention), connection pooling |
| **Authentication** | jsonwebtoken (JWT) | 9.0.3 | Stateless authentication suitable for SPA architecture, industry standard, easy to implement and verify |
| **Password Hashing** | bcrypt | 6 | Industry-standard password hashing with automatic salting, adjustable complexity (salt rounds), resistant to rainbow table attacks |
| **AI Integration** | Gemini | gemini-2.5-flash | Advanced natural language understanding for emotion detection, high-quality report generation, reliable API with good documentation |
| **Deployment (Frontend)** | Vercel | - | Optimized for React applications, automatic deployments from Git, global CDN, excellent performance, generous free tier |
| **Deployment (Backend + DB)** | Railway | - | Integrated PostgreSQL hosting, simple Docker-based deployments, automatic HTTPS, environment variable management, affordable pricing |
| **Containerization** | Docker + Docker Compose | 28.0.4 | Consistent development environment, easy local PostgreSQL setup, matches production deployment model |

## Key Technology Decisions

### Decision 1: React + TypeScript for Frontend

**Context:** Need to build a responsive, interactive single-page application with complex state management (user sessions, journal entries, analytics data) while ensuring code maintainability as a solo developer.

**Decision:** Use React with TypeScript instead of vanilla JavaScript or other frameworks.

**Rationale:**
- **Component Reusability:** React's component model allows building reusable UI elements (emotion selectors, chart components, modals)
- **Type Safety:** TypeScript catches errors during development, preventing runtime bugs in production
- **Strong Ecosystem:** Access to mature libraries (React Router, Context API, testing utilities)
- **Developer Familiarity:** React is the most widely used frontend framework, making it easier to find solutions and examples
- **Maintainability:** TypeScript's type system makes refactoring safer and code self-documenting

**Trade-offs:**
- **Pros:** Reduced bugs, better IDE support, large community, excellent documentation, proven track record
- **Cons:** Requires build step, slightly larger bundle size than minimalist alternatives

### Decision 2: Node.js + Express for Backend

**Context:** Need to create RESTful API with authentication, database operations, and external AI API integration while maintaining consistency with frontend technology.

**Decision:** Use Node.js with Express framework and TypeScript.

**Rationale:**
- **Full-Stack JavaScript:** Avoid context switching between languages; share types and utilities between frontend and backend
- **Async I/O:** Node's event-driven architecture handles concurrent AI API calls and database queries efficiently
- **Minimal Boilerplate:** Express is unopinionated, allowing flexible project structure without framework constraints
- **NPM Ecosystem:** Access to thousands of packages for authentication (jsonwebtoken), validation (express-validator), CORS, etc.
- **Development Speed:** Rapid prototyping and iteration suitable for academic project timeline

**Trade-offs:**
- **Pros:** Fast development, shared language with frontend, excellent async support, mature ecosystem
- **Cons:** Single-threaded (less relevant for I/O-bound operations), not as performant as compiled languages for CPU-intensive tasks

### Decision 3: PostgreSQL for Database

**Context:** Need reliable storage for structured data (users, journal entries, emotions) with support for complex analytics queries (emotion frequency, time-based filtering) and data integrity.

**Decision:** Use PostgreSQL as the primary database.

**Rationale:**
- **Relational Model:** Natural fit for structured data with clear relationships (users → entries → emotions → reports)
- **ACID Compliance:** Ensures data consistency and prevents data loss (critical for journal entries)
- **Advanced Querying:** Supports complex analytics (GROUP BY, window functions, CTEs) needed for emotion statistics
- **JSON Support:** Flexible storage for AI report data structure while maintaining relational model
- **Free Tier Availability:** Railway provides managed PostgreSQL with automatic backups

**Trade-offs:**
- **Pros:** Data integrity, powerful queries, battle-tested reliability, excellent documentation
- **Cons:** More rigid schema than NoSQL (less relevant with proper planning), requires migrations for schema changes

### Decision 4: Railway for Backend + Database Hosting

**Context:** Need simple, cost-effective deployment solution for Node.js backend and PostgreSQL database that minimizes DevOps complexity for solo developer.

**Decision:** Deploy backend and database on Railway platform.

**Rationale:**
- **Integrated PostgreSQL:** Managed database with automatic backups, no manual setup required
- **Docker Support:** Seamless deployment of containerized backend application
- **Environment Variables:** Built-in secrets management without additional tools
- **Automatic HTTPS:** SSL certificates provisioned automatically
- **Simple Pricing:** Generous free tier sufficient for MVP, straightforward paid plans for scaling

**Trade-offs:**
- **Pros:** Minimal DevOps overhead, quick setup, integrated monitoring, automatic deployments
- **Cons:** Less control than self-hosted solution, potential vendor lock-in (mitigated by Docker portability)

### Decision 5: Vercel for Frontend Hosting

**Context:** Need fast, reliable hosting for React SPA with automatic deployments and global distribution.

**Decision:** Deploy frontend on Vercel platform.

**Rationale:**
- **Optimized for React:** Built by Next.js creators, excellent support for React applications
- **Global CDN:** Fast content delivery worldwide improves user experience
- **Git Integration:** Automatic deployments on push to main branch, preview deployments for branches
- **Zero Configuration:** Works out-of-the-box with Create React App and Vite projects
- **Free Tier:** More than sufficient for academic project with limited user base

**Trade-offs:**
- **Pros:** Exceptional performance, zero DevOps, preview environments, analytics included
- **Cons:** Primarily optimized for Next.js (less relevant for CRA), limited backend capabilities (not needed)

## Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **IDE** | Visual Studio Code | Extensions: ESLint, Prettier, TypeScript, Tailwind IntelliSense, GitLens |
| **Version Control** | Git + GitHub | Branching strategy: feature branches → dev → main, conventional commits for clear history |
| **Package Manager** | npm | Lock file committed for reproducible builds, scripts for common tasks (dev, build, test) |
| **Linting** | ESLint + Prettier | ESLint enforces code quality rules, Prettier formats code consistently |
| **API Testing** | Postman | Manual API testing during development, saved collections for common requests |
| **Documentation** | Swagger | API documentation generated from YAML spec, accessible at /api-docs endpoint |
| **Database Tools** | pgAdmin | Visual database management, query testing, schema visualization |
| **Design** | Figma | UI mockups and prototypes, component library for consistency |

## External Services & APIs

| Service | Purpose | Pricing Model |
|---------|---------|---------------|
| **Google Gemini API** | AI-powered emotion detection from journal text; generates weekly/daily analysis reports with insights and recommendations | Free tier: 1,500 requests/day, paid: $0.30 per 1M input tokens, $2.50 per 1M output tokens (Gemini 2.5 Flash) |
| **Railway** | Backend API hosting (Node.js container) and managed PostgreSQL database with automatic backups | Free tier: $5 credit/month; paid: ~$10-20/month for production workload |
| **Vercel** | Frontend hosting with global CDN, automatic HTTPS, and Git-based deployments | Free tier: unlimited projects; paid: $20/month for team features (not needed for MVP) |
| **GitHub** | Git repository hosting, version control, and collaboration | Free for public repositories |