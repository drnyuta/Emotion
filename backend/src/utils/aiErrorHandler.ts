import { RateLimitError, ServiceUnavailableError, TimeoutError, AIError } from "../errors/ai.error";

export function handleAIError(error: Error): never {
  const msg = error.message.toLowerCase();

  if (msg.includes("rate")) throw new RateLimitError();
  if (msg.includes("503")) throw new ServiceUnavailableError();
  if (msg.includes("timeout")) throw new TimeoutError();

  throw new AIError(error.message);
}
