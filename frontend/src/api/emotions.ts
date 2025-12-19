import { EmotionDetails } from "../globalInterfaces";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getCategoriesWithEmotions = async () => {
  const response = await axios.get(`${API_URL}/emotions/categories`);
  return response.data;
};

export const getEmotionById = async (id: number): Promise<EmotionDetails> => {
  const res = await fetch(`${API_URL}/emotions/${id}`);
  const data = await res.json();

  if (!data.success) {
    throw new Error("Failed to load emotions");
  }

  return data.emotion;
};
