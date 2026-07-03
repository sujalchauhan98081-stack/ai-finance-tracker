import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import Modal from "../components/ui/Modal.jsx";
import TransactionForm from "../components/ui/TransactionForm.jsx";
import FilterBar from "../components/ui/FilterBar.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filter and search states
  const [filters, setFilters] = useState({ type: "", category: "", startDate: "", endDate: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters/search change
  }, [filters, searchQuery]);

  useEffect(() => {
    fetchTransactions();
  }, [filters, searchQuery, currentPage]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.category) params.append("category", filters.category);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      params.append("page", currentPage);
      params.append("limit", 10);

      const response = await api.get(`/transactions?${params.toString()}`);
      let data = response.data.data;

      // Client-side search (since backend doesn't have full-text search yet)
      if (searchQuery) {
        data = data.filter((t) =>
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setTransactions(data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to load transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, formData);
        toast.success("Transaction updated");
      } else {
        await api.post("/transactions", formData);
        toast.success("Transaction added");
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
      await fetchTransactions();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      await fetchTransactions();
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleExport = async (format) => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.category) params.append("category", filters.category);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/transactions/export/${format}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error(`Failed to export ${format.toUpperCase()}`);
        return;
      }

      // Get the file blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export transactions");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Transactions</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            📥 CSV
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            📄 PDF
          </button>
          <button
            onClick={handleOpenAddModal}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 transition-colors"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionForm
          onSubmit={handleFormSubmit}
          initialData={editingTransaction}
          isLoading={submitting}
        />
      </Modal>

      {/* Transactions List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height="h-12" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr
                    key={txn._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${txn.type === "income"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          }`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{txn.category}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${txn.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                        }`}
                    >
                      {txn.type === "income" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 truncate">
                      {txn.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 flex justify-end">
                      <button
                        onClick={() => handleEdit(txn)}
                        className="text-sm px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(txn._id)}
                        className="text-sm px-2 py-1 rounded bg-red-100 hover:bg-red-200 dark:bg-red-900/40 text-red-600 dark:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2 p-4">
            {transactions.map((txn) => (
              <div
                key={txn._id}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{txn.category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${txn.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {txn.type === "income" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                  </p>
                </div>
                {txn.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300">{txn.description}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(txn)}
                    className="flex-1 text-xs py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(txn._id)}
                    className="flex-1 text-xs py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.pages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Transactions;