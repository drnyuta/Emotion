import { client } from "../database";

export interface EmotionStat {
  emotionName: string;
  categoryName: string;
  count: number;
}

export const getMonthlyEmotionStats = async (
  userId: number,
  year: number,
  month: number
): Promise<EmotionStat[]> => {
  const res = await client.query(
    `SELECT 
      emotion_name,
      category_name,
      count
    FROM month_stats
    WHERE user_id = $1
      AND EXTRACT(YEAR FROM month_date) = $2
      AND EXTRACT(MONTH FROM month_date) = $3
    ORDER BY count DESC`,
    [userId, year, month]
  );

  return res.rows.map(row => ({
    emotionName: row.emotion_name,
    categoryName: row.category_name,
    count: parseInt(row.count)
  }));
};

export const getWeeklyEmotionStats = async (
  userId: number,
  year: number,
  week: number
): Promise<EmotionStat[]> => {
  const res = await client.query(
    `SELECT 
      emotion_name,
      category_name,
      count
    FROM week_stats
    WHERE user_id = $1
      AND EXTRACT(YEAR FROM week_date) = $2
      AND EXTRACT(WEEK FROM week_date) = $3
    ORDER BY count DESC`,
    [userId, year, week]
  );

  return res.rows.map(row => ({
    emotionName: row.emotion_name,
    categoryName: row.category_name,
    count: parseInt(row.count)
  }));
};