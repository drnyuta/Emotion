import { Insight } from "../globalInterfaces";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const createInsight = async (
  userId: number,
  insightText: string,
  insightDate: string
): Promise<Insight> => {
  const response = await axios.post(`${API_URL}/insights/new`, {
    userId,
    insightText,
    insightDate,
  });

  if (!response.data.success) {
    throw new Error("Failed to create insight");
  }

  return response.data.data;
};

export const getAllInsights = async (userId: number): Promise<Insight[]> => {
  const response = await axios.get(`${API_URL}/insights`, {
    params: { userId },
  });

  if (!response.data.success) {
    throw new Error("Failed to load insights");
  }

  return response.data.data;
};

export const getInsightById = async (insightId: number): Promise<Insight> => {
  const response = await axios.get(`${API_URL}/insights/${insightId}`);

  if (!response.data.success) {
    throw new Error("Failed to load insight");
  }

  return response.data.data;
};

export const updateInsight = async (
  insightId: number,
  userId: number,
  insightText: string
): Promise<Insight> => {
  const response = await axios.put(`${API_URL}/insights/${insightId}`, {
    userId,
    insightText,
  });

  if (!response.data.success) {
    throw new Error("Failed to update insight");
  }

  return response.data.data;
};

export const deleteInsight = async (
  insightId: number,
  userId: number
): Promise<void> => {
  const response = await axios.delete(`${API_URL}/insights/${insightId}`, {
    params: { userId },
  });

  if (!response.data.success) {
    throw new Error("Failed to delete insight");
  }
};      