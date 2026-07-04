import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Wallet, PieChart as PieChartIcon, TrendingUp, PlusCircle } from "lucide-react";
import api from "../services/api.js";
import { useTheme } from "../context/ThemeContext.jsx";
import SummaryCard from "../components/ui/SummaryCard.jsx";
import PieChart from "../components/ui/PieChart.jsx";
import LineChart from "../components/ui/LineChart.jsx";
import RecentTransactions from "../components/widgets/RecentTransactions.jsx";

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const [summaryRes, categoryRes, monthlyRes] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/analytics/category-breakdown"),
        api.get("/analytics/monthly-trend"),
      ]);

      setSummary(summaryRes.data.data);
      setCategoryData(categoryRes.data.data);
      setMonthlyData(monthlyRes.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 dark:text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  // First-time / no-data state: nothing to show yet, guide the user to add their first transaction
  if (summary && summary.transactionCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-5 shadow-sm">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Welcome to your Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
          You haven't added any transactions yet. Add your first one to see
          your spending breakdown, trends, and AI insights come to life.
        </p>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Your First Transaction
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your financial overview at a glance
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard
            icon="💰"
            label="Total Income"
            value={`₹${summary.totalIncome.toFixed(0)}`}
            color="green"
          />

          <SummaryCard
            icon="💸"
            label="Total Expenses"
            value={`₹${summary.totalExpenses.toFixed(0)}`}
            color="red"
          />

          <SummaryCard
            icon="💳"
            label="Balance"
            value={`₹${summary.balance.toFixed(0)}`}
            color={summary.balance >= 0 ? "green" : "red"}
          />

          <SummaryCard
            icon="📊"
            label="Transactions"
            value={summary.transactionCount}
            color="blue"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Pie Chart */}
        {categoryData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Spending by Category
            </h2>

            <div className="h-[320px] flex items-center justify-center">
              <PieChart data={categoryData} isDark={isDark} />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center h-72 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              <PieChartIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No expense data yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Add an expense to see your category breakdown
            </p>
          </div>
        )}

        {/* Line Chart */}
        {monthlyData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Income vs Expense Trend
            </h2>

            <div className="h-[320px]">
              <LineChart data={monthlyData} isDark={isDark} />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center h-72 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No trend data yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Trends will appear once you have transactions across months
            </p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default Dashboard;
