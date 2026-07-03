import Transaction from "../models/Transaction.js";
import { getGroqClient } from "../utils/groqClient.js";

const buildTransactionContext = (transactions) => {
  if (transactions.length === 0) return "No transactions recorded yet.";

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const byCategory = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }
  });

  const categoryBreakdown = Object.entries(byCategory)
    .map(([cat, amount]) => `${cat}: ₹${amount.toFixed(0)}`)
    .join(", ");

  return `
Total Income: ₹${totalIncome.toFixed(0)}
Total Expenses: ₹${totalExpenses.toFixed(0)}
Balance: ₹${(totalIncome - totalExpenses).toFixed(0)}
Spending by Category: ${categoryBreakdown || "No expenses yet"}
Total Transactions: ${transactions.length}
  `;
};

export const getLiveInsights = async (req, res) => {
  try {
    const groq = await getGroqClient();
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    const context = buildTransactionContext(transactions);

    const message = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // Updated model
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a financial advisor. Based on this user's transaction data, provide 2-3 key insights about their spending habits:

${context}

Format your response as a numbered list. Keep each insight concise (1-2 sentences).`,
        },
      ],
    });

    const insights = message.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        insights,
        transactionCount: transactions.length,
      },
    });
  } catch (error) {
    console.error("❌ ERROR in getLiveInsights:", error.message);
    res.status(500).json({
      success: false,
      message: "Error generating insights",
      error: error.message,
    });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const groq = await getGroqClient();
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    const context = buildTransactionContext(transactions);

    const message = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // Updated model
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a financial advisor. Based on this user's spending data, suggest 3 specific, actionable ways they can save money:

${context}

For each recommendation:
1. Identify the spending category
2. Suggest a specific action
3. Estimate potential monthly savings

Keep each recommendation to 1-2 sentences.`,
        },
      ],
    });

    const recommendations = message.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: { recommendations },
    });
  } catch (error) {
    console.error("❌ ERROR in getRecommendations:", error.message);
    res.status(500).json({
      success: false,
      message: "Error generating recommendations",
      error: error.message,
    });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const groq = await getGroqClient();
    const userId = req.user._id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(50);

    const context = buildTransactionContext(transactions);

    const aiMessage = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // Updated model
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are a helpful financial advisor chatbot. The user has the following transaction history:

${context}

User's question: "${message}"

Answer concisely in 1-2 sentences. If the user asks about their specific numbers, use the data above.`,
        },
      ],
    });

    const reply = aiMessage.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: { reply },
    });
  } catch (error) {
    console.error("❌ ERROR in chatWithAI:", error.message);
    res.status(500).json({
      success: false,
      message: "Error processing chat message",
      error: error.message,
    });
  }
};