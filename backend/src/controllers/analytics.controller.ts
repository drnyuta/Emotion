import * as AnalyticsService from "../services/analytics.service";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";

export class AnalyticsController {
  static async getMonthlyEmotionStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const year = Number(req.query.year);
      const month = Number(req.query.month);

      if (!year || !month) {
        return res.status(400).json({
          success: false,
          error: "year and month are required",
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

  static async getWeeklyEmotionStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id; 
      const year = Number(req.query.year);
      const week = Number(req.query.week);

      if (!year || !week) {
        return res.status(400).json({
          success: false,
          error: "year and week are required",
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