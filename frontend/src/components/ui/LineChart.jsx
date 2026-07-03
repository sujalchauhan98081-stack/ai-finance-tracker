import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data, isDark }) => {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Income",
        data: data.map((item) => item.income),
        borderColor: "#10b981", // emerald
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#10b981",
        pointBorderColor: isDark ? "#1f2937" : "#ffffff",
        pointBorderWidth: 2,
      },
      {
        label: "Expense",
        data: data.map((item) => item.expense),
        borderColor: "#ef4444", // red
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: isDark ? "#1f2937" : "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#d1d5db" : "#374151",
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "rgba(0,0,0,0.8)",
        titleColor: isDark ? "#f3f4f6" : "#ffffff",
        bodyColor: isDark ? "#f3f4f6" : "#ffffff",
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ₹${value.toFixed(0)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? "rgba(75, 85, 99, 0.2)" : "rgba(200, 200, 200, 0.1)",
        },
        ticks: {
          color: isDark ? "#d1d5db" : "#6b7280",
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: isDark ? "rgba(75, 85, 99, 0.2)" : "rgba(200, 200, 200, 0.1)",
        },
        ticks: {
          color: isDark ? "#d1d5db" : "#6b7280",
          font: { size: 11 },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;