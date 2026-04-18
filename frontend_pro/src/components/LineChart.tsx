
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LineChart({ data }: { data: any }) {
  if (!data) return null;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.datasets[0].label,
        data: data.datasets[0].data,
        borderColor: '#8a2be2',
        backgroundColor: 'rgba(138, 43, 226, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8a2be2',
      },
      {
        label: data.datasets[1].label,
        data: data.datasets[1].data,
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00f0ff',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#a1a1aa' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#a1a1aa' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#fafafa', font: { size: 12 } }
      },
      tooltip: {
        backgroundColor: 'rgba(9, 9, 11, 0.9)',
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
