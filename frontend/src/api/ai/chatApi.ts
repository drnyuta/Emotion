import axios from "axios";

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
