import { validationResult } from "express-validator";

// Runs after express-validator's body() checks — collects any errors and stops the request if found
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};