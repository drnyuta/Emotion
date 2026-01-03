import { Response } from "express";
import { AIService } from "../services/ai.service";
import { AuthRequest } from "../middleware/auth";

export class AIController {
  static async chat(req: AuthRequest, res: Response) {
    try {
      const userId = String(req.user!.id); 
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          error: "message is required",
        });
      }

      const result = await AIService.chat(userId, message);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async dailyReport(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id; 
      const { entryText, selectedEmotions, entryId } = req.body;

      if (!entryText || !selectedEmotions || !entryId) {
        return res.status(400).json({
          success: false,
          error: "entryText, selectedEmotions and entryId are required",
        });
      }

      const report = await AIService.dailyAnalysis(
        entryText,
        selectedEmotions,
        userId,
        entryId
      );
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async weeklyReport(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id; 
      const { entries } = req.body;

      if (!entries) {
        return res.status(400).json({
          success: false,
          error: "entries are required",
        });
      }

      const report = await AIService.weeklyAnalysis(entries, userId);
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getAllReports(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id; 
      const { type, sort, year, month } = req.query;

      const reports = await AIService.getAllReports(userId, {
        type: type as "daily" | "weekly",
        sort: sort as "newest" | "oldest",
        year: year ? parseInt(year as string) : undefined,
        month: month ? parseInt(month as string) : undefined,
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

  static async deleteReport(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id; 

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Report ID is required",
        });
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