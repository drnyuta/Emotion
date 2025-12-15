import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getCategoriesWithEmotions = async () => {
  const response = await axios.get(`${API_URL}/diary/categories`);
  return response.data;
};
