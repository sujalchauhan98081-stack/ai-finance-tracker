import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import ChatMessage from "../components/ui/ChatMessage.jsx";

const AIInsights = () => {
  const [insights, setInsights] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch insights and recommendations on mount
  useEffect(() => {
    fetchInsights();
    fetchRecommendations();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchInsights = async () => {
    try {
      const response = await api.get("/ai/insights");
      setInsights(response.data.data.insights);
    } catch (error) {
      toast.error("Failed to load insights");
      setInsights("Unable to generate insights at this time.");
    } finally {
      setLoadingInsights(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get("/ai/recommendations");
      setRecommendations(response.data.data.recommendations);
    } catch (error) {
      toast.error("Failed to load recommendations");
      setRecommendations("Unable to generate recommendations at this time.");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput(""); // Clear input immediately for better UX
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setSendingMessage(true);

    try {
      const response = await api.post("/ai/chat", { message: userMessage });
      const aiReply = response.data.data.reply;
      setMessages((prev) => [...prev, { text: aiReply, isUser: false }]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          AI Financial Advisor
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Get personalized insights, recommendations, and answers powered by AI
        </p>
      </div>

      {/* Insights & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            💡 Your Insights
          </h2>

          {loadingInsights ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400 dark:text-gray-500">Analyzing your spending...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights ? (
                <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {insights}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Add some transactions to get personalized insights.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recommendations Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            🎯 Save Money Tips
          </h2>

          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400 dark:text-gray-500">Generating recommendations...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations ? (
                <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {recommendations}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Add some transactions to get personalized recommendations.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-96 md:h-[500px]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            💬 Ask Your AI Advisor
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ask questions about your finances, budgeting, or spending habits
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-center">
              <div>
                <p className="text-sm">Start a conversation with your AI advisor!</p>
                <p className="text-xs mt-2">Try asking: "How much did I spend on food?"</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex gap-2"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={sendingMessage}
            placeholder="Ask a question..."
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sendingMessage || !userInput.trim()}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-4 py-2 transition-colors text-sm"
          >
            {sendingMessage ? "..." : "Send"}
          </button>
        </form>
      </div>

      {/* Example Questions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💬 Try asking:
        </p>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>How much did I spend on groceries this month?</li>
          <li>What's my biggest spending category?</li>
          <li>Can you help me create a monthly budget?</li>
          <li>What percentage of my income am I saving?</li>
        </ul>
      </div>
    </div>
  );
};

export default AIInsights;