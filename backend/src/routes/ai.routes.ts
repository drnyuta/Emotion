import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import { apiLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/chat", apiLimiter, AIController.chat);
router.post("/daily-report", apiLimiter, AIController.dailyReport);
router.post("/weekly-report", apiLimiter, AIController.weeklyReport);

export default router;
