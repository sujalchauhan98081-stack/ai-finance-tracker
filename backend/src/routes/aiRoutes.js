import express from "express";
import { body } from "express-validator";
import {
  getLiveInsights,
  getRecommendations,
  chatWithAI,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

// All AI routes are protected
router.use(protect);

// GET /api/ai/insights
router.get("/insights", getLiveInsights);

// GET /api/ai/recommendations
router.get("/recommendations", getRecommendations);

// POST /api/ai/chat
router.post(
  "/chat",
  body("message").notEmpty().withMessage("Message is required"),
  validateRequest,
  chatWithAI
);

export default router;