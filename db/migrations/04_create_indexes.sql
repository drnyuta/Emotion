CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_diary_entries_user_id ON diary_entries(user_id);

CREATE INDEX idx_diary_entries_entry_date ON diary_entries(entry_date);

CREATE INDEX idx_insights_user_date ON insights(user_id, insight_date);

CREATE INDEX idx_ai_reports_user_date ON ai_reports(user_id, report_date);

CREATE INDEX idx_entry_emotions_emotion_id ON entry_emotions(emotion_id);
