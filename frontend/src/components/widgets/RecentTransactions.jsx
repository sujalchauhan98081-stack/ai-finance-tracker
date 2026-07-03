import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api.js";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const response = await api.get("/transactions?limit=5");
      setTransactions(response.data.data);
    } catch (error) {
      toast.error("Failed to load recent transactions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
        <p className="text-gray-400 dark:text-gray-500 text-center py-4">
          Loading transactions...
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
        <p className="text-gray-400 dark:text-gray-500 text-center py-4">
          No transactions yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Recent Transactions
        </h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {transactions.map((txn) => (
          <div
            key={txn._id}
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {txn.category}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(txn.date).toLocaleDateString()}
              </p>
            </div>

            <p
              className={`font-semibold text-sm ${
                txn.type === "income"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {txn.type === "income" ? "+" : "-"}₹{txn.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;