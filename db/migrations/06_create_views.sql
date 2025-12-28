-- VIEW: Masked users
CREATE OR REPLACE VIEW users_masked AS
SELECT id,
    LEFT(name, 1) || '****' AS name_masked,
    CONCAT('****@', SPLIT_PART(email, '@', 2)) AS email_masked,
    timezone,
    created_at,
    updated_at
FROM users;

-- VIEW: User streaks
CREATE OR REPLACE VIEW users_streaks AS
SELECT u.id AS user_id,
    u.name AS user_name,
    s.streak_start_date,
    s.streak_length
FROM user_streaks s
    JOIN users u ON s.user_id = u.id;

-- VIEW: Monthly emotion statistics with categories
CREATE OR REPLACE VIEW month_stats AS
SELECT de.user_id,
    e.name AS emotion_name,
    ec.name AS category_name,
    COUNT(*) AS count,
    DATE_TRUNC('month', de.entry_date) AS month_date
FROM diary_entries de
    JOIN entry_emotions ee ON de.id = ee.entry_id
    JOIN emotions e ON ee.emotion_id = e.id
    JOIN emotion_categories ec ON e.category_id = ec.id
GROUP BY de.user_id,
    e.name,
    ec.name,
    DATE_TRUNC('month', de.entry_date)
ORDER BY de.user_id,
    month_date DESC,
    count DESC;

-- VIEW: Weekly emotion statistics with categories
CREATE OR REPLACE VIEW week_stats AS
SELECT de.user_id,
    e.name AS emotion_name,
    ec.name AS category_name,
    COUNT(*) AS count,
    DATE_TRUNC('week', de.entry_date) AS week_date
FROM diary_entries de
    JOIN entry_emotions ee ON de.id = ee.entry_id
    JOIN emotions e ON ee.emotion_id = e.id
    JOIN emotion_categories ec ON e.category_id = ec.id
GROUP BY de.user_id,
    e.name,
    ec.name,
    DATE_TRUNC('week', de.entry_date)
ORDER BY de.user_id,
    week_date DESC,
    count DESC;

GRANT SELECT ON month_stats TO app_read;
GRANT SELECT ON week_stats TO app_read;
GRANT SELECT ON users_masked TO app_read;
GRANT SELECT ON users_streaks TO app_read;