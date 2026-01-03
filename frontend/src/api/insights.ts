import { Insight } from "../globalInterfaces";
import axiosInstance from "./axios";

export const createInsight = async (
  insightText: string,
  insightDate: string
): Promise<Insight> => {
  const response = await axiosInstance.post("/insights/new", {
    insightText,
    insightDate,
  });

  if (!response.data.success) {
    throw new Error("Failed to create insight");
  }

  return response.data.data;
};

export const getAllInsights = async (): Promise<Insight[]> => {
  const response = await axiosInstance.get("/insights");

  if (!response.data.success) {
    throw new Error("Failed to load insights");
  }

  return response.data.data;
};

export const getInsightById = async (insightId: number): Promise<Insight> => {
  const response = await axiosInstance.get(`/insights/${insightId}`);

  if (!response.data.success) {
    throw new Error("Failed to load insight");
  }

  return response.data.data;
};

export const updateInsight = async (
  insightId: number,
  insightText: string
): Promise<Insight> => {
  const response = await axiosInstance.put(`/insights/${insightId}`, {
    insightText,
  });

  if (!response.data.success) {
    throw new Error("Failed to update insight");
  }

  return response.data.data;
};

export const deleteInsight = async (insightId: number): Promise<void> => {
  const response = await axiosInstance.delete(`/insights/${insightId}`);

  if (!response.data.success) {
    throw new Error("Failed to delete insight");
  }
};