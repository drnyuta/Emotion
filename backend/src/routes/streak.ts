import { Router } from "express";
import { StreakController } from "../controllers/streak.controller";

const router = Router();

// GET /streaks/current
router.get("/current", StreakController.getCurrentStreak);

// GET /streaks/history
router.get("/history", StreakController.getStreakHistory);

// GET /streaks/longest
router.get("/longest", StreakController.getLongestStreak);

// POST /streaks/check
router.post("/check", StreakController.checkStreakStatus);

export default router;
