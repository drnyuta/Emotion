import { Router } from "express";
import { EmotionController } from "../controllers/emotion.controller";

const router = Router();

// GET /diary/categories
router.get("/categories", EmotionController.getCategoriesWithEmotions);

// GET /emotions/:id
router.get("/:id", EmotionController.getEmotionById);

export default router;