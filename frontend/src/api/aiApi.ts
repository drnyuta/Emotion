import axiosInstance from "./axios";
import { Report } from "../globalInterfaces";
import { handleAxiosError } from "../utils/handleAxiosError";

interface CrisisResponse {
  crisis: boolean;
  message: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  result?: T;
  data?: T;
  report?: T;
  error?: string;
}

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const response = await axiosInstance.post<ApiResponse<string | CrisisResponse>>(
      "/ai/chat",
      { message }
    );

    const data = response.data;

    if (!data.success) {
      throw new Error(data.error || "API error");
    }

    if (typeof data.result === "string") {
      return data.result;
    }

    if (data.result?.crisis) {
      return data.result.message;
    }

    return "Unknown response from AI";
  } catch (error: unknown) {
    handleAxiosError(error, "Failed to send chat message");
  }
}

export interface GetReportsParams {
  type?: "daily" | "weekly";
  sort?: "newest" | "oldest";
  year?: number;
  month?: number;
}

export async function getAllReports(
  params?: GetReportsParams
): Promise<Report[]> {
  try {
    const response = await axiosInstance.get<ApiResponse<Report[]>>(
      "/ai/reports",
      { params }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch reports");
    }

    return response.data.data ?? [];
  } catch (error: unknown) {
    handleAxiosError(error, "Failed to fetch reports");
  }
}

export async function deleteReport(reportId: number): Promise<void> {
  try {
    const response = await axiosInstance.delete<ApiResponse>(
      `/ai/reports/${reportId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete report");
    }
  } catch (error: unknown) {
    handleAxiosError(error, "Failed to delete report");
  }
}

export interface DailyReportParams {
  entryText: string;
  selectedEmotions: string[];
  entryId: number;
}

export async function generateDailyReport(
  params: DailyReportParams
): Promise<Report> {
  try {
    const response = await axiosInstance.post<ApiResponse<Report>>(
      "/ai/daily-report",
      params
    );

    if (!response.data.success || !response.data.report) {
      throw new Error(
        response.data.error || "Failed to generate daily report"
      );
    }

    return response.data.report;
  } catch (error: unknown) {
    handleAxiosError(error, "Failed to generate daily report");
  }
}

export interface WeeklyEntry {
  date: string;
  text: string;
  emotions: string[];
}

export interface WeeklyReportParams {
  entries: WeeklyEntry[];
}

export async function generateWeeklyReport(
  params: WeeklyReportParams
): Promise<Report> {
  try {
    const response = await axiosInstance.post<ApiResponse<Report>>(
      "/ai/weekly-report",
      params
    );

    if (!response.data.success || !response.data.report) {
      throw new Error(
        response.data.error || "Failed to generate weekly report"
      );
    }

    return response.data.report;
  } catch (error: unknown) {
    handleAxiosError(error, "Failed to generate weekly report");
  }
}
