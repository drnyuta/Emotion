import { Router } from "express";
import { EmotionController } from "../controllers/emotion.controller";

const router = Router();

// GET /diary/categories
router.get("/categories", EmotionController.getCategoriesWithEmotions);