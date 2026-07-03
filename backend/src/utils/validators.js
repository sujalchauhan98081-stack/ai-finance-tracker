import { body } from "express-validator";

export const transactionValidationRules = () => {
  return [
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
};

export const userUpdateValidationRules = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email"),
  ];
};

export const passwordChangeValidationRules = () => {
  return [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ];
};