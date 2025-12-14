import { Router } from "express";
import { DiaryController } from "../controllers/diary.controller";

const router = Router();

// GET /api/diary/month?user_id=1&year=2025&month=12
router.get("/month", DiaryController.getMonthDates);

// GET /api/diary/entry?user_id=1&entry_date=2025-12-14
router.get("/entry", DiaryController.getEntry);

// POST /api/diary/new
router.post("/new", DiaryController.createNew);

// PUT /api/diary/update/:id
router.put("/update/:id", DiaryController.updateEntry);

// DELETE /api/diary/delete/:id
router.delete("/delete/:id", DiaryController.deleteEntry);

export default router;
