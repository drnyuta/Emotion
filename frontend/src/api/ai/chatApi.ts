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
    const response = await axios.post<ApiResponse>(`${API_URL}/chat`, {
      userId,
      message,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.error || "Ошибка API");
    }

    if (typeof data.result === "string") {
      return data.result;
    } else if (data.result.crisis) {
      return data.result.message;
    } else {
      return "Неизвестный ответ от ИИ";
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      let message: string;
      switch (error.response.status) {
        case 429:
          message = "Превышен лимит запросов";
          break;
        case 503:
          message = "Сервис недоступен";
          break;
        case 504:
          message = "Превышено время ожидания";
          break;
        default:
          message = `Ошибка сервера: ${error.response.status}`;
      }
      throw new Error(message);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Неизвестная ошибка");
  }
}
