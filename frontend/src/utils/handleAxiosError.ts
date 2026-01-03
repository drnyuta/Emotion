import axios from "axios";

export function handleAxiosError(error: unknown, fallback: string): never {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.error || fallback);
  }

  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw new Error(fallback);
}
