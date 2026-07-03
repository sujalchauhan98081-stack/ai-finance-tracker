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
          "#ec4899",
          "#f59e0b",
          "#8b5cf6",
          "#06b6d4",
          "#10b981",
          "#6366f1",
          "#ef4444",
          "#14b8a6",
        ],

        borderColor: isDark ? "#1f2937" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "right",

        labels: {
          color: isDark ? "#d1d5db" : "#374151",

          font: {
            size: 11,
          },

          padding: 10,
          boxWidth: 12,
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

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[300px] h-[300px] md:w-[350px] md:h-[350px]">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;