import axiosInstance from "./axios";

export const getMonthDates = async (
  year: number,
  month: number
): Promise<string[]> => {
  const res = await axiosInstance.get("/diary/month", {
    params: {
      year,
      month,
    },
  });

  return res.data.dates;
};

export const getEntryByDate = async (date: string) => {
  const res = await axiosInstance.get("/diary/entry", {
    params: {
      entry_date: date,
    },
  });

  return res.data.entry;
};

export const createEntry = async (
  entryDate: string,
  content: string,
  questionId?: number,
  emotions?: number[]
) => {
  const res = await axiosInstance.post("/diary/new", {
    entryDate,
    content,
    questionId,
    emotions,
  });

  return res.data.entry;
};

export const updateEntry = async (
  entryId: number,
  content: string,
  questionId?: number | null,
  emotions?: number[]
) => {
  const res = await axiosInstance.put(`/diary/update/${entryId}`, {
    content,
    questionId,
    emotions,
  });

  return res.data.entry;
};

export const deleteEntry = async (entryId: number) => {
  await axiosInstance.delete(`/diary/delete/${entryId}`);
};