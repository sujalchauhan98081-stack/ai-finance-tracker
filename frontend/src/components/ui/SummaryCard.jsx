const SummaryCard = ({ icon, label, value, color = "indigo" }) => {
  const colorMap = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300",
  };

  return (
    <div className={`rounded-xl p-6 ${colorMap[color]} border border-opacity-20`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default SummaryCard;