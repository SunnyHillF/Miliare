import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export interface EarningsPoint {
  month: string;
  earnings: number;
}

interface EarningsChartProps {
  data: EarningsPoint[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  const chartData = React.useMemo(
    () => ({
      labels: data.map((d) => d.month),
      datasets: [
        {
          label: 'Earnings',
          data: data.map((d) => d.earnings),
          borderColor: '#1e40af',
          backgroundColor: 'rgba(30, 64, 175, 0.2)',
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#1e40af',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    }),
    [data]
  );

  const options = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            font: {
              size: 12,
            },
            callback: function(value: any) {
              return '$' + value.toLocaleString();
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#1e40af',
          borderWidth: 1,
          callbacks: {
            label: function(context: any) {
              return 'Earnings: $' + context.parsed.y.toLocaleString();
            },
          },
        },
      },
    }),
    []
  );

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EarningsChart;
