import axiosInstance from "./axios";

export interface EmotionStat {
  emotionName: string;
  categoryName: string;
  count: number;
}

export const getMonthlyEmotionStats = async (
  year: number,
  month: number
): Promise<EmotionStat[]> => {
  const res = await axiosInstance.get("/analytics/monthly", {
    params: {
      year,
      month,
    },
  });

  return res.data.stats;
};

export const getWeeklyEmotionStats = async (
  year: number,
  week: number
): Promise<EmotionStat[]> => {
  const res = await axiosInstance.get("/analytics/weekly", {
    params: {
      year,
      week,
    },
  });

  return res.data.stats;
};