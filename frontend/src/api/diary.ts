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

export const getEntryByDate = async (userId: number, date: string) => {
  const res = await axios.get(`${API_URL}/diary/entry`, {
    params: {
      user_id: userId,
      entry_date: date,
    },
  });

  return res.data.entry;
};

export const createEntry = async (
  userId: number,
  entryDate: string,
  content: string,
  questionId?: number,
  emotions?: number[]
) => {
  const res = await axios.post(`${API_URL}/diary/new`, {
    userId,
    entryDate,
    content,
    questionId,
    emotions,
  });

  return res.data.entry;
};

export const updateEntry = async (
  entryId: number,
  userId: number,
  content: string,
  questionId?: number | null,
  emotions?: number[]
) => {
  const res = await axios.put(`${API_URL}/diary/update/${entryId}`, {
    entry_id: entryId,
    user_id: userId,
    content,
    question_id: questionId,
    emotions,
  });

  return res.data.entry;
};

export const deleteEntry = async (entryId: number) => {
  await axios.delete(`${API_URL}/diary/delete/${entryId}`, {
    params: {
      entry_id: entryId,
    },
  });
};
