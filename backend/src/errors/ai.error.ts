export class AIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "AIError";
    this.statusCode = statusCode;
  }
}   

export class RateLimitError extends AIError {
  constructor() {
    super("AI rate limit exceeded. Try again later.", 429);
    this.name = "RateLimitError";
  }
}

export class ServiceUnavailableError extends AIError {
  constructor() {
    super("AI service temporarily unavailable.", 503);
    this.name = "ServiceUnavailableError";
  }
}

export class TimeoutError extends AIError {
  constructor() {
    super("AI request timed out. Please try again.", 504);
    this.name = "TimeoutError";
  }
}
