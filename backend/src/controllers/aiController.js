import Transaction from "../models/Transaction.js";
import { getGroqClient } from "../utils/groqClient.js";

// Model recommendation (as of July 2026): openai/gpt-oss-120b
// Groq deprecated the Llama 3.x and Qwen3 32B models in June 2026.
const AI_MODEL = "openai/gpt-oss-120b";

const formatINR = (amount) =>
  Math.round(amount).toLocaleString("en-IN");

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
    .map(([cat, amount]) => `${cat}: ₹${formatINR(amount)}`)
    .join(", ");

  return `
Total Income: ₹${formatINR(totalIncome)}
Total Expenses: ₹${formatINR(totalExpenses)}
Balance: ₹${formatINR(totalIncome - totalExpenses)}
Spending by Category: ${categoryBreakdown || "No expenses yet"}
Total Transactions: ${transactions.length}
  `;
};

// @route   GET /api/ai/insights
// @access  Private
export const getLiveInsights = async (req, res) => {
  try {
    const groq = await getGroqClient();
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    const context = buildTransactionContext(transactions);

    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      max_completion_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a financial advisor. Based on this user's transaction data, provide 2-3 key insights about their spending habits:

${context}

Format your response as a numbered list. Bold the key takeaway at the start of each point. Use Indian comma formatting for all rupee amounts (e.g. ₹5,11,601). Keep each insight concise (1-2 sentences).`,
        },
      ],
    });

    const insights = completion.choices[0].message.content;

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

// @route   GET /api/ai/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
  try {
    const groq = await getGroqClient();
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    const context = buildTransactionContext(transactions);

    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      max_completion_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a financial advisor. Based on this user's spending data, suggest 3 specific, actionable ways they can save money:

${context}

For each recommendation:
1. Identify the spending category
2. Suggest a specific action
3. Estimate potential monthly savings

Format your response as a numbered list. Bold the spending category at the start of each point. Use Indian comma formatting for all rupee amounts (e.g. ₹5,11,601). Keep each recommendation to 1-2 sentences.`,
        },
      ],
    });

    const recommendations = completion.choices[0].message.content;

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

// @route   POST /api/ai/chat
// @access  Private
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

    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      max_completion_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are a helpful financial advisor chatbot. The user has the following transaction history:

${context}

User's question: "${message}"

Answer concisely in 1-2 sentences. Use Indian comma formatting for all rupee amounts (e.g. ₹5,11,601). If the user asks about their specific numbers, use the data above.`,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

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