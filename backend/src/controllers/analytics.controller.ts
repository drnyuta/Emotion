import * as AnalyticsService from "../services/analytics.service";
import { Request, Response } from "express";

export class AnalyticsController {
  static async getMonthlyEmotionStats(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);
      const year = Number(req.query.year);
      const month = Number(req.query.month);

      if (!userId || !year || !month) {
        return res.status(400).json({
          success: false,
          error: "user_id, year, and month are required",
        });
      }

      const stats = await AnalyticsService.getMonthlyEmotionStats(
        userId,
        year,
        month
      );

      res.json({ success: true, stats });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getWeeklyEmotionStats(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);
      const year = Number(req.query.year);
      const week = Number(req.query.week);

      if (!userId || !year || !week) {
        return res.status(400).json({
          success: false,
          error: "user_id, year, and week are required",
        });
      }

      const stats = await AnalyticsService.getWeeklyEmotionStats(
        userId,
        year,
        week
      );

      res.json({ success: true, stats });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}