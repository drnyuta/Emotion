import * as EmotionService from "../services/emotion.service";
import { Request, Response } from "express";

export class EmotionController {
  static async getCategoriesWithEmotions(req: Request, res: Response) {
    try {
      const categories = await EmotionService.getCategoriesWithEmotions();
      res.json({ success: true, categories });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
