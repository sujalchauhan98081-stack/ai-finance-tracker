import express from "express";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All analytics routes are protected
router.use(protect);

// GET /api/analytics/summary
router.get("/summary", getSummary);

// GET /api/analytics/category-breakdown
router.get("/category-breakdown", getCategoryBreakdown);

// GET /api/analytics/monthly-trend
router.get("/monthly-trend", getMonthlyTrend);

export default router;