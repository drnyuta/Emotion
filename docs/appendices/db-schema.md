# Database Schema

## Overview

| Attribute | Value |
|-----------|-------|
| **Database** | PostgreSQL |
| **Version** | 16 |
| **Total Tables** | 10 |
| **Total Indexes** | 7 |
| **Total Views** | 4 |
| **Total Triggers** | 9 |

## Entity Relationship Diagram

![DB Schema](../assets/diagrams/db_schema.png)

## Tables

### Table 1: users

Stores user account information and authentication credentials.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email (login identifier) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| timezone | VARCHAR(50) | NOT NULL | User's timezone (e.g., 'Europe/London') |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_users_email` on `email`


### Table 2: questions

Stores reflective prompts (Question of the Day) to inspire journal entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| question_text | TEXT | NOT NULL | Reflective question text |
| created_at | TIMESTAMP | DEFAULT NOW() | Question creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |


### Table 3: diary_entries

Stores user journal entries with optional question association.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| user_id | INTEGER | FK → users.id, NOT NULL | Entry owner |
| entry_date | DATE | NOT NULL | Date of journal entry (YYYY-MM-DD) |
| content | TEXT | NULLABLE | Journal entry text |
| question_id | INTEGER | FK → questions.id, NULLABLE | Optional associated question |
| created_at | TIMESTAMP | DEFAULT NOW() | Entry creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_diary_entries_user_id` on `user_id`
- `idx_diary_entries_entry_date` on `entry_date`


### Table 4: emotion_categories

Stores 6 core emotion categories based on emotion wheel psychology.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| name | VARCHAR(100) | NOT NULL | Category name (Joy, Sadness, Anger, Fear, Peace, Strength) |


### Table 5: emotions

Stores 64 specific emotions with definitions, triggers, and recommendations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| name | VARCHAR(100) | NOT NULL | Emotion name (e.g., 'Anxiety', 'Gratitude') |
| category_id | INTEGER | FK → emotion_categories.id | Parent emotion category |
| definition | TEXT | NULLABLE | Explanation of the emotion |
| triggers | JSONB | NULLABLE | Array of common triggers for this emotion |
| recommendations | JSONB | NULLABLE | Array of coping strategies and recommendations |

**JSONB Structure:**
```json
{
  "triggers": ["Workload", "Deadlines", "Change"],
  "recommendations": ["Grounding techniques", "Structured planning"]
}
```


### Table 6: entry_emotions

Junction table for many-to-many relationship between diary entries and emotions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| entry_id | INTEGER | FK → diary_entries.id, PK | Diary entry ID |
| emotion_id | INTEGER | FK → emotions.id, PK | Emotion ID |

**Primary Key:** Composite (`entry_id`, `emotion_id`)

**Indexes:**
- `idx_entry_emotions_emotion_id` on `emotion_id`


### Table 7: ai_reports

Stores AI-generated daily and weekly analysis reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| user_id | INTEGER | FK → users.id, NOT NULL | Report owner |
| entry_id | INTEGER | FK → diary_entries.id, NULLABLE | Associated entry (NULL for weekly reports) |
| report_type | VARCHAR(20) | NOT NULL | 'daily' or 'weekly' |
| report_date | DATE | NOT NULL | Report start date |
| report_end_date | DATE | NULLABLE | Report end date (for weekly reports) |
| content | JSONB | NULLABLE | AI-generated report content |
| created_at | TIMESTAMP | DEFAULT NOW() | Report creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**JSONB Structure (Daily):**
```json
{
  "detectedEmotions": [{"emotion": "Anxiety", "explanation": "..."}],
  "mainTriggers": [{"title": "Work deadlines", "description": "..."}],
  "insights": ["..."],
  "recommendations": [{"action": "...", "description": "..."}]
}
```

**JSONB Structure (Weekly):**
```json
{
  "overview": "...",
  "dominantEmotion": "Joy",
  "mainTriggers": ["..."],
  "recurringPatterns": [{"title": "...", "description": "..."}],
  "recommendations": [{"action": "...", "description": "..."}]
}
```

**Indexes:**
- `idx_ai_reports_user_date` on `(user_id, report_date)`


### Table 8: user_streaks

Tracks daily journaling streaks for gamification.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| user_id | INTEGER | FK → users.id, NOT NULL | Streak owner |
| streak_start_date | DATE | NOT NULL | Date streak began |
| streak_length | INTEGER | DEFAULT 1 | Number of consecutive days |
| created_at | TIMESTAMP | DEFAULT NOW() | Streak creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |


### Table 9: insights

Stores user-saved insights from AI reports for future reference.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| user_id | INTEGER | FK → users.id, NOT NULL | Insight owner |
| insight_text | TEXT | NOT NULL | Saved insight content |
| insight_date | DATE | NOT NULL | Date insight was saved |
| created_at | TIMESTAMP | DEFAULT NOW() | Insight creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_insights_user_date` on `(user_id, insight_date)`


### Table 10: password_reset_tokens

Stores temporary tokens for password reset functionality.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PK | Primary key |
| user_id | INTEGER | FK → users.id, NOT NULL, ON DELETE CASCADE | Token owner |
| token | VARCHAR(255) | NOT NULL | Reset token (hashed) |
| expires_at | TIMESTAMP | NOT NULL | Token expiration time |
| created_at | TIMESTAMP | DEFAULT NOW() | Token creation timestamp |

**Indexes:**
- `idx_password_reset_token` on `token`
- `idx_password_reset_user_id` on `user_id`


## Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| users → diary_entries | One-to-Many | One user can have many journal entries |
| users → ai_reports | One-to-Many | One user can have many AI reports |
| users → user_streaks | One-to-Many | One user can have multiple streak records |
| users → insights | One-to-Many | One user can save many insights |
| users → password_reset_tokens | One-to-Many | One user can have multiple reset tokens (historical) |
| questions → diary_entries | One-to-Many | One question can be used in many entries |
| diary_entries ↔ emotions | Many-to-Many | Entries can have multiple emotions; emotions can be in multiple entries (via entry_emotions) |
| emotion_categories → emotions | One-to-Many | One category contains many specific emotions |
| diary_entries → ai_reports | One-to-One | Daily reports reference one specific entry |

## Migrations

| Version | Script | Description | Date |
|---------|--------|-------------|------|
| 001 | `01_init_database.sql` | Create emotion_diary database | 2024-11-01 |
| 002 | `02_create_tables.sql` | Create all 10 tables with constraints | 2024-11-01 |
| 003 | `03_insert_seed_data.sql` | Seed emotions, questions, test users with entries | 2024-11-01 |
| 004 | `04_create_indexes.sql` | Create performance indexes | 2024-11-05 |
| 005 | `05_create_roles_and_privileges.sql` | Set up RBAC (admin, app_write, app_read) | 2024-11-10 |
| 006 | `06_create_views.sql` | Create analytical views | 2024-11-15 |
| 007 | `07_create_triggers.sql` | Implement updated_at triggers | 2024-11-20 |
| 008 | `08_password_reset_tokens_table.sql` | Add password reset functionality | 2024-12-01 |

**Migration Execution:**
```bash
# Run all migrations in order
psql -U postgres -d emotion_diary -f db/migrations/01_init_database.sql
psql -U postgres -d emotion_diary -f db/migrations/02_create_tables.sql
psql -U postgres -d emotion_diary -f db/migrations/03_insert_seed_data.sql
# ... continue for all scripts
```

**Docker Initialization:**
Migrations are automatically executed when PostgreSQL container starts via `docker-compose up`. Scripts in `postgres/init-scripts/` are run in alphabetical order.


## Seeding

### Running Seed Script

**Via Docker:**
Seed data is automatically inserted on first container startup via `03_insert_seed_data.sql`.

**Manual Execution:**
```bash
# Connect to database
psql -U postgres -d emotion_diary

# Run seed script
\i db/migrations/03_insert_seed_data.sql
```

**Verify Seeding:**
```sql
-- Check user count
SELECT COUNT(*) FROM users; -- Expected: 3

-- Check emotion count
SELECT COUNT(*) FROM emotions; -- Expected: 64

-- Check entry count per user
SELECT user_id, COUNT(*) FROM diary_entries GROUP BY user_id;
-- Expected: Alice (14), Bob (2)
```
