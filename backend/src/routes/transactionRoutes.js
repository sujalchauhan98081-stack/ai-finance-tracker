import express from "express";
import { body } from "express-validator";
import {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  exportTransactions,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { transactionValidationRules } from "../utils/validators.js";
import { exportLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Validation schema shared between POST and PUT
const transactionValidation = [
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be 'income' or 'expense'"),
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a number greater than 0"),
  body("category")
    .notEmpty()
    .withMessage("Category is required"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be under 200 characters"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
];

// All routes are protected
router.use(protect);

// POST /api/transactions — Create
router.post("/", transactionValidation, validateRequest, addTransaction);

// GET /api/transactions — Read all
router.get("/", getTransactions);

// GET /api/transactions/export/csv — Export to CSV (rate limited)
router.get("/export/csv", exportLimiter, exportTransactions("csv"));

// GET /api/transactions/export/pdf — Export to PDF (rate limited)
router.get("/export/pdf", exportLimiter, exportTransactions("pdf"));

// GET /api/transactions/:id — Read one
router.get("/:id", getTransactionById);

// PUT /api/transactions/:id — Update
router.put("/:id", transactionValidation, validateRequest, updateTransaction);

// DELETE /api/transactions/:id — Delete
router.delete("/:id", deleteTransaction);

export default router;