//components/admin/AnalyticsChart.tsx

'use client';

import { useEffect, useState } from 'react';
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
} from 'chart.js';
import { apiGet } from '@/lib/api';

// Daftarkan komponen-komponen yang akan digunakan oleh Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  data: number[];
}

const AnalyticsChart = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiGet('admin/analytics');
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading analytics chart...</div>;
  }

  if (!chartData || chartData.labels.length === 0) {
    return <div className="text-center p-8">No registration data available to display.</div>;
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Pendaftar Baru per Hari',
        data: chartData.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tren Pendaftaran Harian',
      },
    },
  };

  return (
    <div className="relative h-96">
      <Line options={options} data={data} />
    </div>
  );
};

export default AnalyticsChart;