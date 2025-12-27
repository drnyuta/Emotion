import { Request, Response } from "express";
import { AIService } from "../services/ai.service";
import { SortOption } from "../types";

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
      const { entryText, selectedEmotions, entryId } = req.body;
      const result = await AIService.dailyAnalysis(
        entryText,
        selectedEmotions,
        1,
        entryId
      );
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async weeklyReport(req: Request, res: Response) {
    try {
      const { entries } = req.body;
      const result = await AIService.weeklyAnalysis(entries, 1);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getAllReports(req: Request, res: Response) {
    try {
      const userId = 1;
      const { type, sort } = req.query;

      if (!userId) {
        throw new Error("userId is required");
      }

      const reports = await AIService.getAllReports(userId, {
        type: type as "daily" | "weekly",
        sort: sort as SortOption,
      });

      res.json({
        success: true,
        data: reports,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async deleteReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = 1;

      if (!id) {
        throw new Error("Report ID is required");
      }

      await AIService.deleteReport(parseInt(id), userId);

      res.json({
        success: true,
        message: "Report deleted successfully",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
}
