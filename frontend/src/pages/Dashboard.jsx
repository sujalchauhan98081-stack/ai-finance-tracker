import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
      // Fetch all three analytics endpoints in parallel
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

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your financial overview at a glance
        </p>
      </div>

      {/* Summary Cards Grid */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        {categoryData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Spending by Category
            </h2>
            <div className="relative h-64">
              <PieChart data={categoryData} isDark={isDark} />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center h-80">
            <p className="text-gray-400 dark:text-gray-500">
              No expense data yet
            </p>
          </div>
        )}

        {/* Line Chart */}
        {monthlyData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Income vs Expense Trend
            </h2>
            <div className="relative h-64">
              <LineChart data={monthlyData} isDark={isDark} />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center h-80">
            <p className="text-gray-400 dark:text-gray-500">
              No trend data yet
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