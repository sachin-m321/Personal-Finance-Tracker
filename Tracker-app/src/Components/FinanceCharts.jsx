import { Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function FinanceCharts({ transactions }) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const pieData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [income, expenses],
        backgroundColor: ["#27845c", "#e87565"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [income, expenses],
        backgroundColor: ["#27845c", "#e87565"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label || context.dataset.label}: ${formatMoney(
              context.raw
            )}`,
        },
      },
    },
  };

  return (
    <div className="row g-3 finance-charts">
      <div className="col-12 col-lg-6">
        <div className="content-card chart-card h-100">
          <h5 className="chart-title">Income vs Expenses</h5>
          <p className="chart-description">
            Compare your total income and spending.
          </p>

          <div className="chart-container">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-6">
        <div className="content-card chart-card h-100">
          <h5 className="chart-title">Financial Overview</h5>
          <p className="chart-description">
            View your income and expenses side by side.
          </p>

          <div className="chart-container">
            <Bar
              data={barData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₹${value}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}