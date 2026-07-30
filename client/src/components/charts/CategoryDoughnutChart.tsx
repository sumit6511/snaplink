import '@/lib/chartSetup';
import type { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '@/hooks/useTheme';
import { foldToTopN, getCategoricalPalette, getChartChrome } from '@/lib/chartTheme';
import type { Bucket } from '@/types/analytics';

interface CategoryDoughnutChartProps {
  data: Bucket[];
  maxCategories?: number;
}

export function CategoryDoughnutChart({ data, maxCategories = 5 }: CategoryDoughnutChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const palette = getCategoricalPalette(isDark);
  const chrome = getChartChrome(isDark);

  const folded = foldToTopN(data, maxCategories);

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: chrome.text, boxWidth: 10, boxHeight: 10, padding: 12 },
      },
      tooltip: {
        backgroundColor: chrome.surface,
        titleColor: chrome.text,
        bodyColor: chrome.text,
        borderColor: chrome.grid,
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  const chartData = {
    labels: folded.map((item) => item.name),
    datasets: [
      {
        data: folded.map((item) => item.count),
        backgroundColor: folded.map((_, i) => palette[i % palette.length]),
        borderColor: chrome.surface,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="h-56">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
