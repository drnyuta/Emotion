import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";

const router = Router();

// GET /questions
router.get("/", QuestionController.getAllQuestions);

// GET /questions/:id
router.get("/:id", QuestionController.getQuestionById);

export default router;
