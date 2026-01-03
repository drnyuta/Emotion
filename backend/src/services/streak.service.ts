import { client } from "../database";

export interface Streak {
  id: number;
  userId: number;
  streakStartDate: string;
  streakLength: number;
  createdAt: string;
  updatedAt: string;
}

export const getCurrentStreak = async (userId: number): Promise<Streak | null> => {
  const result = await client.query(
    `SELECT id, user_id AS "userId", 
            streak_start_date::text AS "streakStartDate", 
            streak_length AS "streakLength",
            created_at AS "createdAt", 
            updated_at AS "updatedAt"
     FROM user_streaks 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] || null;
};

const hasEntryForDate = async (userId: number, date: string): Promise<boolean> => {
  const result = await client.query(
    `SELECT id FROM diary_entries 
     WHERE user_id = $1 AND entry_date::date = $2::date`,
    [userId, date]
  );

  return result.rows.length > 0;
};

const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const updateStreakOnEntry = async (userId: number, entryDate: string): Promise<Streak> => {
  const currentStreak = await getCurrentStreak(userId);

  const entryCountResult = await client.query(
    `SELECT COUNT(*) as count FROM diary_entries 
     WHERE user_id = $1 AND entry_date::date = $2::date`,
    [userId, entryDate]
  );
  const entryCount = parseInt(entryCountResult.rows[0].count);

  if (entryCount > 1) {
    return currentStreak || await createFirstStreak(userId, entryDate);
  }

  if (!currentStreak) {
    return await createFirstStreak(userId, entryDate);
  }

  const streakLastDate = new Date(currentStreak.streakStartDate);
  streakLastDate.setDate(streakLastDate.getDate() + currentStreak.streakLength - 1);
  const streakLastDateStr = streakLastDate.toISOString().split('T')[0];

  const entryDateObj = new Date(entryDate + 'T00:00:00');
  const streakLastDateObj = new Date(streakLastDateStr + 'T00:00:00');
  const daysDiff = Math.floor((entryDateObj.getTime() - streakLastDateObj.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 1) {
    const result = await client.query(
      `UPDATE user_streaks 
       SET streak_length = streak_length + 1, updated_at = NOW()
       WHERE id = $1
       RETURNING id, user_id AS "userId", 
                 streak_start_date::text AS "streakStartDate", 
                 streak_length AS "streakLength",
                 created_at AS "createdAt", 
                 updated_at AS "updatedAt"`,
      [currentStreak.id]
    );

    return result.rows[0];
  } 
  else if (daysDiff === 0) {
    return currentStreak;
  }
  else {
    return await createFirstStreak(userId, entryDate);
  }
};

const createFirstStreak = async (userId: number, entryDate: string): Promise<Streak> => {
  const result = await client.query(
    `INSERT INTO user_streaks (user_id, streak_start_date, streak_length, created_at, updated_at)
     VALUES ($1, $2, 1, NOW(), NOW())
     RETURNING id, user_id AS "userId", 
               streak_start_date::text AS "streakStartDate", 
               streak_length AS "streakLength",
               created_at AS "createdAt", 
               updated_at AS "updatedAt"`,
    [userId, entryDate]
  );

  return result.rows[0];
};

export const checkStreakStatus = async (userId: number): Promise<Streak | null> => {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  
  const currentStreak = await getCurrentStreak(userId);
  if (!currentStreak) return null;

  const hasToday = await hasEntryForDate(userId, today);
  const hasYesterday = await hasEntryForDate(userId, yesterday);

  if (!hasToday && !hasYesterday) return currentStreak;

  return currentStreak;
};

export const getStreakHistory = async (userId: number): Promise<Streak[]> => {
  const result = await client.query(
    `SELECT id, user_id AS "userId", 
            streak_start_date::text AS "streakStartDate", 
            streak_length AS "streakLength",
            created_at AS "createdAt", 
            updated_at AS "updatedAt"
     FROM user_streaks 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

export const getLongestStreak = async (userId: number): Promise<number> => {
  const result = await client.query(
    `SELECT MAX(streak_length) as max_streak 
     FROM user_streaks 
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0]?.max_streak || 0;
};
