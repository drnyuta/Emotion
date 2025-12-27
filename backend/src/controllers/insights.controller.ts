import { Request, Response } from "express";
import { InsightsService } from "../services/insights.service";

export class InsightsController {
  static async createInsight(req: Request, res: Response) {
    try {
      const { insightText, insightDate } = req.body;
      const userId = 1; 

      if (!insightText || !insightDate) {
        throw new Error("insightText and insightDate are required");
      }

      const insight = await InsightsService.createInsight(userId, insightText, insightDate);
      res.json({ success: true, data: insight });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getAllInsights(req: Request, res: Response) {
    try {
      const userId = 1;
      const insights = await InsightsService.getAllInsights(userId);
      res.json({ success: true, data: insights });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateInsight(req: Request, res: Response) {
    try {
      const insightId = Number(req.params.id);
      const { insightText } = req.body;
      const userId = 1;

      if (!insightText) throw new Error("insightText is required");

      const updated = await InsightsService.updateInsight(insightId, userId, insightText);
      if (!updated) return res.status(404).json({ success: false, error: "Insight not found or not yours" });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async deleteInsight(req: Request, res: Response) {
    try {
      const insightId = Number(req.params.id);
      const userId = 1;

      await InsightsService.deleteInsight(insightId, userId);
      res.json({ success: true, message: "Insight deleted" });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
