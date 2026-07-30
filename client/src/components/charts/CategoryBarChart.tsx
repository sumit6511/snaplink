import '@/lib/chartSetup';
import type { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@/hooks/useTheme';
import { foldToTopN, getChartChrome, getSequentialColor } from '@/lib/chartTheme';
import type { Bucket } from '@/types/analytics';

interface CategoryBarChartProps {
  data: Bucket[];
  maxCategories?: number;
}

// A single metric ranked across named categories (e.g. clicks per country)
// is nominal-categorical-with-one-series: every bar takes the same hue —
// color would otherwise just re-encode what the bar length already shows.
export function CategoryBarChart({ data, maxCategories = 8 }: CategoryBarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const color = getSequentialColor(isDark);
  const chrome = getChartChrome(isDark);

  const folded = foldToTopN(data, maxCategories);

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: chrome.surface,
        titleColor: chrome.text,
        bodyColor: chrome.text,
        borderColor: chrome.grid,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: chrome.grid },
        ticks: { color: chrome.mutedText, precision: 0 },
      },
      y: {
        grid: { display: false },
        ticks: { color: chrome.text },
      },
    },
  };

  const chartData = {
    labels: folded.map((item) => item.name),
    datasets: [
      {
        data: folded.map((item) => item.count),
        backgroundColor: color,
        borderRadius: 4,
        maxBarThickness: 20,
      },
    ],
  };

  const height = Math.max(160, folded.length * 36);

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
