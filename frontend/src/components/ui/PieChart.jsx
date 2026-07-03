import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, isDark }) => {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: [
          "#ec4899", // pink
          "#f59e0b", // amber
          "#8b5cf6", // violet
          "#06b6d4", // cyan
          "#10b981", // emerald
          "#6366f1", // indigo
          "#ef4444", // red
          "#14b8a6", // teal
        ],
        borderColor: isDark ? "#1f2937" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#d1d5db" : "#374151",
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ₹${value.toFixed(0)}`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;