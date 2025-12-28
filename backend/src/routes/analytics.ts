import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/monthly", AnalyticsController.getMonthlyEmotionStats);
router.get("/weekly", AnalyticsController.getWeeklyEmotionStats);

export default router;