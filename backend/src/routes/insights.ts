import express from "express";
import { InsightsController } from "../controllers/insights.controller";

const router = express.Router();

router.post("/new", InsightsController.createInsight);
router.get("/", InsightsController.getAllInsights);
router.put("/:id", InsightsController.updateInsight);
router.delete("/:id", InsightsController.deleteInsight);

export default router;
