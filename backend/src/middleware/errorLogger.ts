import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";

export function errorLogger(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({
    type: "ERROR",
    message: err.message,
    stack: err.stack,
    endpoint: req.originalUrl,
    body: req.body,
    status: res.statusCode,
  });

  next(err);
}
