import { EmotionDetails } from "../globalInterfaces";
import axiosInstance from "./axios";

export const getCategoriesWithEmotions = async () => {
  const response = await axiosInstance.get("/emotions/categories");
  return response.data;
};

export const getEmotionById = async (id: number): Promise<EmotionDetails> => {
  const response = await axiosInstance.get(`/emotions/${id}`);

  if (!response.data.success) {
    throw new Error("Failed to load emotions");
  }

  return response.data.emotion;
};