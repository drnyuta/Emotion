import { Streak } from "../globalInterfaces";
import axiosInstance  from "./axios";

export const getCurrentStreak = async (): Promise<Streak | null> => {
  const res = await axiosInstance.get("/streak/current");
  return res.data.streak;
};

export const getLongestStreak = async (): Promise<number> => {
  const res = await axiosInstance.get("/streak/longest");
  return res.data.longestStreak;
};
