import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  alignment: number;
  missing: number;
}

export default function PieChart({ alignment, missing }: PieChartProps) {
  const data = {
    labels: ['Alignment', 'Missing Factors'],
    datasets: [
      {
        data: [alignment, missing],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)', // Emerald - Alignment
          'rgba(244, 63, 94, 0.8)',  // Rose - Missing
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(244, 63, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#e4e4e7',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
      }
    },
    maintainAspectRatio: false,
  };

  return <Pie data={data} options={options} />;
}
