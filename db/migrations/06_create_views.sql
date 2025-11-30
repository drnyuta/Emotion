-- VIEW: Masked users
CREATE OR REPLACE VIEW users_masked AS
SELECT
    id,
    LEFT(name, 1) || '****' AS name_masked,
    CONCAT('****@', SPLIT_PART(email,'@',2)) AS email_masked,
    timezone,
    created_at,
    updated_at
FROM users;

-- VIEW: Weekly emotion statistics per user
CREATE OR REPLACE VIEW week_stats AS
SELECT
    de.user_id,
    e.category_id,
    e.name AS emotion_name,
    COUNT(*) AS count
FROM diary_entries de
JOIN entry_emotions ee ON de.id = ee.entry_id
JOIN emotions e ON ee.emotion_id = e.id
WHERE de.entry_date >= NOW() - INTERVAL '7 days'
GROUP BY de.user_id, e.category_id, e.name
ORDER BY de.user_id, e.category_id, e.name;

-- VIEW: User streaks
CREATE OR REPLACE VIEW users_streaks AS
SELECT
    u.id AS user_id,
    u.name AS user_name,
    s.streak_start_date,
    s.streak_length
FROM user_streaks s
JOIN users u ON s.user_id = u.id;

-- VIEW: Weekly emotion statistics by category
CREATE OR REPLACE VIEW week_category_stats AS
SELECT
    de.user_id,
    ec.name AS category_name,
    COUNT(*) AS count
FROM diary_entries de
JOIN entry_emotions ee ON de.id = ee.entry_id
JOIN emotions e ON ee.emotion_id = e.id
JOIN emotion_categories ec ON e.category_id = ec.id
WHERE de.entry_date >= NOW() - INTERVAL '7 days'
GROUP BY de.user_id, ec.name
ORDER BY de.user_id, ec.name;

GRANT SELECT ON users_masked TO app_read;
GRANT SELECT ON week_stats TO app_read;
GRANT SELECT ON users_streaks TO app_read;
GRANT SELECT ON week_category_stats TO app_read;
