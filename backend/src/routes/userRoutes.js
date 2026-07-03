import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  userUpdateValidationRules,
  passwordChangeValidationRules,
} from "../utils/validators.js";

const router = express.Router();

// All user routes are protected
router.use(protect);

// GET /api/users/profile
router.get("/profile", getUserProfile);

// PUT /api/users/profile
router.put("/profile", userUpdateValidationRules(), validateRequest, updateUserProfile);

// PUT /api/users/change-password
router.put(
  "/change-password",
  passwordChangeValidationRules(),
  validateRequest,
  changePassword
);

export default router;