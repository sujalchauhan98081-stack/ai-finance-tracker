const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 space-y-3 md:space-y-0 md:flex md:gap-3">
      {/* Type filter */}
      <select
        name="type"
        value={filters.type || ""}
        onChange={handleChange}
        className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category filter */}
      <select
        name="category"
        value={filters.category || ""}
        onChange={handleChange}
        className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All Categories</option>
        <option value="Food & Dining">Food & Dining</option>
        <option value="Shopping">Shopping</option>
        <option value="Transportation">Transportation</option>
        <option value="Utilities">Utilities</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Education">Education</option>
        <option value="Groceries">Groceries</option>
        <option value="Salary">Salary</option>
        <option value="Freelance">Freelance</option>
        <option value="Investment">Investment</option>
        <option value="Bonus">Bonus</option>
      </select>

      {/* Date range */}
      <input
        type="date"
        name="startDate"
        value={filters.startDate || ""}
        onChange={handleChange}
        className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <input
        type="date"
        name="endDate"
        value={filters.endDate || ""}
        onChange={handleChange}
        className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Clear filters */}
      <button
        onClick={() => onFilterChange({ type: "", category: "", startDate: "", endDate: "" })}
        className="rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 text-sm font-medium transition-colors"
      >
        Clear
      </button>
    </div>
  );
};

export default FilterBar;