import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from 'chart.js';
import type { Earnings } from '../data/dashboardData';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

interface Props {
  data: Earnings[];
}

export function EarningsOverviewChart({ data }: Props) {
  const chartData = React.useMemo(() => ({
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Earnings',
        data: data.map(d => d.earnings),
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30,64,175,0.3)',
        tension: 0.4,
        fill: true,
      },
    ],
  }), [data]);

  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { tooltip: { intersect: false } },
    scales: { y: { beginAtZero: true } },
  }), []);

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}
