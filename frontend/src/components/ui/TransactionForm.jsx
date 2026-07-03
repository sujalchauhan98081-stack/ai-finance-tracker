import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CATEGORIES = {
  expense: ["Food & Dining", "Shopping", "Transportation", "Utilities", "Entertainment", "Healthcare", "Education", "Groceries", "Other Expense"],
  income: ["Salary", "Freelance", "Investment", "Bonus", "Other Income"],
};

const TransactionForm = ({ onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "Food & Dining",
    description: "",
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
  });

  const [errors, setErrors] = useState({});

  // If editing, populate form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description || "",
        date: new Date(initialData.date).toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  // When type changes, reset category to the first option of that type
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: CATEGORIES[newType][0],
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
      toast.error(message);
    }
  };

  const availableCategories = CATEGORIES[formData.type];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleTypeChange}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          className={`w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            errors.amount ? "border-red-400" : "border-gray-200 dark:border-gray-700"
          }`}
          placeholder="0.00"
        />
        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            errors.category ? "border-red-400" : "border-gray-200 dark:border-gray-700"
          }`}
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            errors.date ? "border-red-400" : "border-gray-200 dark:border-gray-700"
          }`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Add notes..."
          rows="3"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 transition-colors"
      >
        {isLoading ? "Saving..." : initialData ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;