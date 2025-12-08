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
      let message: string;

      switch (error.response.status) {
        case 400:
          message = "Bad request. Please check your message.";
          break;
        case 429:
          message = "Rate limit exceeded. Please try again later.";
          break;
        case 503:
          message = "Service unavailable. Please try again later.";
          break;
        case 504:
          message = "Request timed out. Please try again.";
          break;
        default:
          message = `Server error: ${error.response.status}`;
      }

      throw new Error(message);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unknown error");
  }
}
