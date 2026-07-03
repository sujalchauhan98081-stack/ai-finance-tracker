import Transaction from "../models/Transaction.js";

// @route   GET /api/analytics/summary
// @access  Private
// @desc    Get summary stats (total income, expenses, balance, count)
export const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all transactions for this user
    const transactions = await Transaction.find({ userId });

    // Calculate totals
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    res.status(200).json({
      success: true,
      data: {
        totalIncome: income,
        totalExpenses: expenses,
        balance,
        transactionCount: transactions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching summary",
      error: error.message,
    });
  }
};

// @route   GET /api/analytics/category-breakdown
// @access  Private
// @desc    Get spending breakdown by category
export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user._id;

    // MongoDB aggregation to group by category and sum amounts
    const breakdown = await Transaction.aggregate([
      { $match: { userId, type: "expense" } }, // Only expenses for pie chart
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category breakdown",
      error: error.message,
    });
  }
};

// @route   GET /api/analytics/monthly-trend
// @access  Private
// @desc    Get monthly income vs expense trend (last 12 months)
export const getMonthlyTrend = async (req, res) => {
  try {
    const userId = req.user._id;

    // MongoDB aggregation to group by year-month and type
    const trend = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Reshape into array of objects: [{ month: "Jan 2025", income: 50000, expense: 5000 }, ...]
    const monthMap = {};

    trend.forEach((item) => {
      const { year, month, type } = item._id;
      const monthKey = `${year}-${String(month).padStart(2, "0")}`;
      const monthLabel = new Date(year, month - 1).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthLabel, income: 0, expense: 0 };
      }

      monthMap[monthKey][type] = item.amount;
    });

    const data = Object.values(monthMap).slice(-12); // Last 12 months

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching monthly trend",
      error: error.message,
    });
  }
};