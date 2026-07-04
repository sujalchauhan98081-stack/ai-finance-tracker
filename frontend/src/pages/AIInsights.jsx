import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { Lightbulb, Target, Sparkles, Send, MessageCircle } from "lucide-react";
import api from "../services/api.js";
import ChatMessage from "../components/ui/ChatMessage.jsx";

const SUGGESTED_QUESTIONS = [
  "How much did I spend on groceries this month?",
  "What's my biggest spending category?",
  "Can you help me create a monthly budget?",
  "What percentage of my income am I saving?",
];

// Skeleton loader for the insight/recommendation cards
const CardSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/6" />
  </div>
);

const AIInsights = () => {
  const [insights, setInsights] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchInsights();
    fetchRecommendations();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingMessage]);

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

  const sendMessage = async (text) => {
    const userMessage = text.trim();
    if (!userMessage) return;

    setUserInput("");
    setMessages((prev) => [
      ...prev,
      { text: userMessage, isUser: true, timestamp: Date.now() },
    ]);
    setSendingMessage(true);

    try {
      const response = await api.post("/ai/chat", { message: userMessage });
      const aiReply = response.data.data.reply;
      setMessages((prev) => [
        ...prev,
        { text: aiReply, isUser: false, timestamp: Date.now() },
      ]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(userInput);
  };

  const handleSuggestedClick = (question) => {
    sendMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            AI Financial Advisor
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Personalized insights, recommendations, and answers — powered by AI
          </p>
        </div>
      </div>

      {/* Insights & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Your Insights
            </h2>
          </div>

          <div className="p-6">
            {loadingInsights ? (
              <CardSkeleton />
            ) : insights ? (
              <div className="prose prose-sm dark:prose-invert max-w-none [&_*]:text-gray-600 dark:[&_*]:text-gray-300 [&_strong]:text-gray-800 dark:[&_strong]:text-gray-100 [&_strong]:font-semibold">
                <ReactMarkdown>{insights}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add some transactions to get personalized insights.
              </p>
            )}
          </div>
        </div>

        {/* Recommendations Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Save Money Tips
            </h2>
          </div>

          <div className="p-6">
            {loadingRecommendations ? (
              <CardSkeleton />
            ) : recommendations ? (
              <div className="prose prose-sm dark:prose-invert max-w-none [&_*]:text-gray-600 dark:[&_*]:text-gray-300 [&_strong]:text-gray-800 dark:[&_strong]:text-gray-100 [&_strong]:font-semibold">
                <ReactMarkdown>{recommendations}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add some transactions to get personalized recommendations.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[520px] md:h-[560px]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Ask Your AI Advisor
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ask about your finances, budgeting, or spending habits
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Start a conversation with your AI advisor
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-5">
                Ask anything about your money, or try one of these:
              </p>

              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestedClick(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))}

              {sendingMessage && (
                <div className="flex gap-2.5 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={sendingMessage}
            placeholder="Ask a question about your finances..."
            className="flex-1 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sendingMessage || !userInput.trim()}
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium w-10 h-10 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIInsights;
