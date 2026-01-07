import { Response } from "express";
import * as DiaryService from "../services/diary.service";
import { AuthRequest } from "../middleware/auth";

export class DiaryController {
  static async getMonthDates(req: AuthRequest, res: Response) {
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

      const rows = await DiaryService.getDatesWithEntries(userId, year, month);
      const dates = rows.map((r: any) => r.entry_date);

      res.json({ success: true, dates });
    } catch (err: any) {
      console.error("Error in getMonthDates:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getEntry(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const entryDate = req.query.entry_date as string;

      if (!entryDate) {
        return res.status(400).json({
          success: false,
          error: "entry_date is required",
        });
      }

      const entry = await DiaryService.getEntryByDate(userId, entryDate);
      res.json({ success: true, entry });
    } catch (err: any) {
      console.error("Error in getEntry:", err); 
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getEntriesByDateRange(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: "startDate and endDate are required",
        });
      }

      const entries = await DiaryService.getEntriesByDateRange(
        userId,
        startDate,
        endDate
      );

      res.json({ success: true, entries });
    } catch (err: any) {
      console.error("Error in getEntriesByDateRange:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async createNew(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id; 
      const { entryDate, content, questionId, emotions } = req.body;

      if (!entryDate || !content || !emotions) {
        return res.status(400).json({
          success: false,
          error: "entryDate, content and emotions are required",
        });
      }

      if (!Array.isArray(emotions)) {
        return res.status(400).json({
          success: false,
          error: "emotions must be an array",
        });
      }

      const entry = await DiaryService.createEntry(
        userId,
        entryDate,
        content,
        questionId,
        emotions
      );
      res.json({ success: true, entry });
    } catch (err: any) {
      console.error("Error in createNew:", err); 
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateEntry(req: AuthRequest, res: Response) {
    try {
      const entryId = Number(req.params.id);
      const userId = req.user!.id; 
      const { content, questionId, emotions } = req.body;

      if (!entryId) {
        return res.status(400).json({
          success: false,
          error: "entryId is required",
        });
      }

      const updatedEntry = await DiaryService.updateEntry(
        entryId,
        userId,
        content,
        questionId ?? null,
        emotions
      );

      if (!updatedEntry) {
        return res.status(404).json({
          success: false,
          error: "Entry not found or does not belong to you",
        });
      }

      res.json({ success: true, entry: updatedEntry });
    } catch (err: any) {
      console.error("Error in updateEntry:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async deleteEntry(req: AuthRequest, res: Response) {
    try {
      const entryId = Number(req.params.id);
      const userId = req.user!.id; 

      if (!entryId) {
        return res.status(400).json({
          success: false,
          error: "entryId is required",
        });
      }
      await DiaryService.deleteEntry(entryId);

      res.json({ success: true, message: "Entry deleted" });
    } catch (err: any) {
      console.error("Error in deleteEntry:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  }
}