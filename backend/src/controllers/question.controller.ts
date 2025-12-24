import * as QuestionService from "../services/question.service";
import { Request, Response } from "express";

export class QuestionController {
  static async getAllQuestions(req: Request, res: Response) {
    try {
      const questions = await QuestionService.getAllQuestions();
      res.json({ success: true, questions });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getQuestionById(req: Request, res: Response) {
    try {
      const question = await QuestionService.getQuestionById(
        Number(req.params.id)
      );
      res.json({ success: true, question });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  }
}
