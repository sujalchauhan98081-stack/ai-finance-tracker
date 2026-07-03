import Transaction from "../models/Transaction.js";
import { validationResult } from "express-validator";

import User from "../models/User.js";

import { generateCSV, generatePDF } from "../utils/exportHelper.js";

// @route   POST /api/transactions
// @access  Private
// @desc    Create a new transaction
export const addTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { type, amount, category, description, date } = req.body;
    const userId = req.user._id; // Attached by authMiddleware

    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      category,
      description,
      date: date || new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding transaction",
      error: error.message,
    });
  }
};

// @route   GET /api/transactions
// @access  Private
// @desc    Get all transactions for the logged-in user
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Query params for filtering
    const { type, category, startDate, endDate, limit = 50, page = 1 } = req.query;

    // Build dynamic filter object
    let filter = { userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch both transactions and count for pagination info
    // Use .lean() for read-only queries (faster, returns plain objects)
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 }) // Newest first
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};

// @route   GET /api/transactions/:id
// @access  Private
// @desc    Get a single transaction (ownership check)
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Ownership check — only the transaction's owner can view it
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this transaction",
      });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transaction",
      error: error.message,
    });
  }
};

// @route   PUT /api/transactions/:id
// @access  Private
// @desc    Update a transaction (ownership check)
export const updateTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Ownership check
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this transaction",
      });
    }

    // Update allowed fields (don't allow changing the userId)
    const { type, amount, category, description, date } = req.body;
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, amount, category, description, date },
      { new: true, runValidators: true } // new: true returns updated doc; runValidators: true re-checks model constraints
    );

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating transaction",
      error: error.message,
    });
  }
};

// @route   DELETE /api/transactions/:id
// @access  Private
// @desc    Delete a transaction (ownership check)
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Ownership check
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this transaction",
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting transaction",
      error: error.message,
    });
  }
};



// @route   GET /api/transactions/export/csv or /pdf
// @access  Private
// @desc    Export transactions to CSV or PDF
export const exportTransactions = (format) => {
  return async (req, res) => {
    try {
      const userId = req.user._id;

      // Apply same filters as regular getTransactions
      const { type, category, startDate, endDate } = req.query;

      let filter = { userId };
      if (type) filter.type = type;
      if (category) filter.category = category;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(filter).sort({ date: -1 });

      if (format === "csv") {
        const csv = generateCSV(transactions);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="transactions.csv"');
        res.send(csv);
      } else if (format === "pdf") {
        const user = await User.findById(userId);
        const pdf = await generatePDF(transactions, user.name);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="transactions.pdf"');
        res.send(pdf);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error exporting to ${format}`,
        error: error.message,
      });
    }
  };
};