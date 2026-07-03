import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for fast queries filtering by user
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Transaction type (income/expense) is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        // Expense categories
        "Food & Dining",
        "Shopping",
        "Transportation",
        "Utilities",
        "Entertainment",
        "Healthcare",
        "Education",
        "Groceries",
        "Other Expense",
        // Income categories
        "Salary",
        "Freelance",
        "Investment",
        "Bonus",
        "Other Income",
      ],
      index:true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index:true,
    },
  },
  { timestamps: true }
);

// Compound index for common query patterns
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;