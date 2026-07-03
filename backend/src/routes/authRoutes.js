import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// POST /api/auth/register
router.post("/register", registerValidation, validateRequest, registerUser);

// POST /api/auth/login
router.post("/login", loginValidation, validateRequest, loginUser);

// GET /api/auth/me  (protected)
router.get("/me", protect, getCurrentUser);

export default router;