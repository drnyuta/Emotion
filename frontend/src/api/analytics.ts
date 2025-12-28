import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
  const res = await axios.get(`${API_URL}/analytics/monthly`, {
    params: {
      userId,
      year,
      month,
    },
  });

  return res.data.stats;
};

export const getWeeklyEmotionStats = async (
  userId: number,
  year: number,
  week: number
): Promise<EmotionStat[]> => {
  const res = await axios.get(`${API_URL}/analytics/weekly`, {
    params: {
      userId,
      year,
      week,
    },
  });

  return res.data.stats;
};