import { Request, Response } from "express";
import * as DiaryService from "../services/diary.service";
import { client } from "../database";

export class DiaryController {
  static async getMonthDates(req: Request, res: Response) {
    try {
      const userId = Number(req.query.user_id);
      const year = Number(req.query.year);
      const month = Number(req.query.month);

      if (!userId || !year || !month)
        throw new Error("user_id, year and month are required");

      const rows = await DiaryService.getDatesWithEntries(userId, year, month);
      const dates = rows.map((r: any) =>
        r.entry_date.toLocaleDateString("en-CA")
      );

      res.json({ success: true, dates });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getEntry(req: Request, res: Response) {
    try {
      const userId = Number(req.query.user_id);
      const entryDate = req.query.entry_date as string;

      if (!userId || !entryDate)
        throw new Error("user_id and entry_date are required");

      const entry = await DiaryService.getEntryByDate(userId, entryDate);
      res.json({ success: true, entry });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async createNew(req: Request, res: Response) {
    try {
      const { userId, entryDate, content, questionId, emotions } = req.body;
      if (!userId || !entryDate || !content || !emotions)
        throw new Error("userId, entryDate, content and emotions are required");

      if (!Array.isArray(emotions))
        throw new Error("emotions must be an array");
      
      const entry = await DiaryService.createEntry(
        userId,
        entryDate,
        content,
        questionId,
        emotions
      );
      res.json({ success: true, entry });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateEntry(req: Request, res: Response) {
    try {
      const entryId = Number(req.params.id);
      const userId = Number(req.body.userId);
      const { content, questionId, emotions } = req.body;

      if (!entryId || !userId) {
        return res
          .status(400)
          .json({ success: false, error: "entryId and userId are required" });
      }

      const updatedEntry = await DiaryService.updateEntry(
        entryId,
        userId,
        content,
        questionId ?? null,
        emotions
      );

      res.json({ success: true, entry: updatedEntry });
    } catch (err: any) {
      console.error("Error in updateEntry:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async deleteEntry(req: Request, res: Response) {
    try {
      const entryId = Number(req.params.id);
      if (!entryId) throw new Error("entryId is required");

      await DiaryService.deleteEntry(entryId);
      res.json({ success: true, message: "Entry deleted" });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getCategoriesWithEmotions(req: Request, res: Response) {
    try {
      const categories = await DiaryService.getCategoriesWithEmotions();
      res.json({ success: true, categories });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
