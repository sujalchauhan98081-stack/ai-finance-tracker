const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search by description..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
  );
};

export default SearchBar;