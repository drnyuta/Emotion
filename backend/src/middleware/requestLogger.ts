import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  logger.info({
    type: "REQUEST",
    method: req.method,
    endpoint: req.originalUrl,
    timestamp: new Date().toISOString(),
    body: req.body,
    headers: req.headers,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info({
      type: "RESPONSE",
      method: req.method,
      endpoint: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
    });
  });

  next();
}
