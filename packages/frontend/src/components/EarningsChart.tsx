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
        },
      ],
    }),
    [data]
  );

  const options = React.useMemo(
    () => ({
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }),
    []
  );

  return <Line data={chartData} options={options} />;
};

export default EarningsChart;
