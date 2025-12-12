-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- QUESTIONS
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- DIARY ENTRIES
CREATE TABLE diary_entries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    entry_date DATE NOT NULL,
    content TEXT,
    question_id INT REFERENCES questions(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- EMOTION CATEGORIES
CREATE TABLE emotion_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- EMOTIONS
CREATE TABLE emotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES emotion_categories(id),
    definition TEXT,
    triggers JSONB,
    recommendations JSONB
);

-- MANY-TO-MANY BETWEEN DIARY ENTRIES AND EMOTIONS
CREATE TABLE entry_emotions (
    entry_id INT REFERENCES diary_entries(id),
    emotion_id INT REFERENCES emotions(id),
    PRIMARY KEY (entry_id, emotion_id)
);

-- AI REPORTS
CREATE TABLE ai_reports (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    entry_id INT REFERENCES diary_entries(id), -- NULL for weekly
    report_type VARCHAR(20) NOT NULL, -- 'daily' or 'weekly'
    report_date DATE NOT NULL,
    report_end_date DATE,
    content JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- USER STREAKS
CREATE TABLE user_streaks (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    streak_start_date DATE NOT NULL,
    streak_length INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- INSIGHTS
CREATE TABLE insights (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    insight_text TEXT NOT NULL,
    insight_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
