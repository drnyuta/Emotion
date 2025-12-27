import axios from "axios";
import { Report } from "../globalInterfaces";

const API_URL = import.meta.env.VITE_API_URL;

interface CrisisResponse {
  crisis: boolean;
  message: string;
}

interface ApiResponse {
  success: boolean;
  result: string | CrisisResponse;
  error?: string;
}

export async function sendChatMessage(
  userId: string,
  message: string
): Promise<string> {
  try {
    const response = await axios.post<ApiResponse>(`${API_URL}/ai/chat`, {
      userId,
      message,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.error || "API error");
    }

    if (typeof data.result === "string") {
      return data.result;
    } else if (data.result.crisis) {
      return data.result.message;
    } else {
      return "Unknown response from AI";
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const serverError = (error.response.data as ApiResponse)?.error;
      throw new Error(serverError || "Unknown error");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unknown error");
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
    const response = await axios.get(
      `${API_URL}/ai/reports`,
      { params }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch reports");
    }

    return response.data.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const serverError = (error.response.data as ApiResponse)?.error;
      throw new Error(serverError || "Failed to fetch reports");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unknown error");
  }
}

export async function deleteReport(reportId: number): Promise<void> {
  try {
    const response = await axios.delete(`${API_URL}/ai/reports/${reportId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete report");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const serverError = (error.response.data as ApiResponse)?.error;
      throw new Error(serverError || "Failed to delete report");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unknown error");
  }
}

export interface DailyReportParams {
  entryText: string;
  selectedEmotions: string[];
  entryId: number;
}

export async function generateDailyReport(params: DailyReportParams) {
  try {
    const response = await axios.post(`${API_URL}/ai/daily-report`, params);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to generate daily report");
    }

    return response.data.report;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const serverError = (error.response.data as ApiResponse)?.error;
      throw new Error(serverError || "Failed to generate daily report");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unknown error");
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

export async function generateWeeklyReport(params: WeeklyReportParams) {
  try {
    const response = await axios.post(`${API_URL}/ai/weekly-report`, params);

    if (!response.data.success) {
      throw new Error(
        response.data.error || "Failed to generate weekly report"
      );
    }

    return response.data.report;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const serverError = (error.response.data as ApiResponse)?.error;
      throw new Error(serverError || "Failed to generate weekly report");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unknown error");
  }
}
