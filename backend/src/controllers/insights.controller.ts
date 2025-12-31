import { Response } from "express";
import { InsightsService } from "../services/insights.service";
import { AuthRequest } from "../middleware/auth";

export class InsightsController {
  static async createInsight(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id; 
      const { insightText, insightDate } = req.body;

      if (!insightText || !insightDate) {
        return res.status(400).json({
          success: false,
          error: "insightText and insightDate are required",
        });
      }

      const insight = await InsightsService.createInsight(
        userId,
        insightText,
        insightDate
      );
      res.json({ success: true, data: insight });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getAllInsights(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const insights = await InsightsService.getAllInsights(userId);
      res.json({ success: true, data: insights });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateInsight(req: AuthRequest, res: Response) {
    try {
      const insightId = Number(req.params.id);
      const userId = req.user!.id;
      const { insightText } = req.body;

      if (!insightText) {
        return res.status(400).json({
          success: false,
          error: "insightText is required",
        });
      }

      const updated = await InsightsService.updateInsight(
        insightId,
        userId,
        insightText
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: "Insight not found or does not belong to you",
        });
      }

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async deleteInsight(req: AuthRequest, res: Response) {
    try {
      const insightId = Number(req.params.id);
      const userId = req.user!.id; 

      await InsightsService.deleteInsight(insightId, userId);
      res.json({ success: true, message: "Insight deleted" });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}