import { Router } from "express";
import { DiaryController } from "../controllers/diary.controller";

const router = Router();

// GET /diary/month?user_id=1&year=2025&month=12
router.get("/month", DiaryController.getMonthDates);

// GET /diary/entry?user_id=1&entry_date=2025-12-14
router.get("/entry", DiaryController.getEntry);

// POST /diary/new
router.post("/new", DiaryController.createNew);

// PUT /diary/update/:id
router.put("/update/:id", DiaryController.updateEntry);

// DELETE /diary/delete/:id
router.delete("/delete/:id", DiaryController.deleteEntry);

router.get("/entries/week", DiaryController.getEntriesByDateRange);

export default router;
