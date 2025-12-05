import { Request, Response } from "express";
import { AIService } from "../services/ai.service";

export class AIController {
  static async chat(req: Request, res: Response) {
    try {
      const { userId, message } = req.body;
      if (!userId) {
        throw new Error("userId is required");
      }
      const result = await AIService.chat(userId, message);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async dailyReport(req: Request, res: Response) {
    try {
      const { entryText, selectedEmotions } = req.body;
      const result = await AIService.dailyAnalysis(entryText, selectedEmotions);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async weeklyReport(req: Request, res: Response) {
    try {
      const { entries } = req.body;
      const result = await AIService.weeklyAnalysis(entries);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
