import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMonthDates = async (
  userId: number,
  year: number,
  month: number
): Promise<string[]> => {
  const res = await axios.get(`${API_URL}/diary/month`, {
    params: {
      user_id: userId,
      year,
      month,
    },
  });

  return res.data.dates; 
};

export const getEntryByDate = async (
  userId: number,
  date: string
) => {
  const res = await axios.get(`${API_URL}/diary/entry`, {
    params: {
      user_id: userId,
      entry_date: date,
    },
  });

  return res.data.entry; 
};
