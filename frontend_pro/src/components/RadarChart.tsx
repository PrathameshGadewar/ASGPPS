
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ score = 65 }: { score?: number }) {
  const data = {
    labels: ['Python', 'DSA', 'System Design', 'ML/DL', 'Cloud', 'Soft Skills'],
    datasets: [
      {
        label: 'Your Current Skills',
        data: [score, score-10, score-20, score+5, score-15, score+10],
        backgroundColor: 'rgba(0, 240, 255, 0.2)',
        borderColor: '#00f0ff',
        borderWidth: 2,
        pointBackgroundColor: '#00f0ff',
      },
      {
        label: 'Industry Standard',
        data: [90, 85, 80, 80, 75, 85],
        backgroundColor: 'rgba(138, 43, 226, 0.2)',
        borderColor: '#8a2be2',
        borderWidth: 2,
        pointBackgroundColor: '#8a2be2',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#a1a1aa', font: { size: 12 } },
        ticks: { display: false, max: 100, min: 0 }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#fafafa' }
      }
    }
  };

  return <Radar data={data} options={options} />;
}
