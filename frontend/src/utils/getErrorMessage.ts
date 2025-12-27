import axios from "axios";

export function getErrorMessage(error: unknown, defaultMessage = "An error occurred"): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { error?: string })?.error || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}
