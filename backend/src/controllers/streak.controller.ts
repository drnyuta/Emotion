import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as StreakService from "../services/streak.service";

export class StreakController {
  static async getCurrentStreak(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const streak = await StreakService.getCurrentStreak(userId);
      
      if (!streak) {
        return res.json({
          success: true,
          streak: null,
          message: "No streak yet. Create your first diary entry!",
        });
      }

      res.json({
        success: true,
        streak,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async getStreakHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const history = await StreakService.getStreakHistory(userId);

      res.json({
        success: true,
        history,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async getLongestStreak(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const longestStreak = await StreakService.getLongestStreak(userId);

      res.json({
        success: true,
        longestStreak,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
  
  static async checkStreakStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const streak = await StreakService.checkStreakStatus(userId);

      res.json({
        success: true,
        streak,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
}