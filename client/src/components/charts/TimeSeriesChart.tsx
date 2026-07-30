import '@/lib/chartSetup';
import type { ChartOptions } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useTheme } from '@/hooks/useTheme';
import { getChartChrome, getSequentialColor } from '@/lib/chartTheme';

interface TimeSeriesChartProps {
  labels: string[];
  values: number[];
  type?: 'line' | 'bar';
  formatLabel?: (label: string) => string;
}

export function TimeSeriesChart({
  labels,
  values,
  type = 'line',
  formatLabel,
}: TimeSeriesChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const color = getSequentialColor(isDark);
  const chrome = getChartChrome(isDark);

  const sharedScales = {
    x: {
      grid: { display: false },
      ticks: { color: chrome.mutedText, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
    },
    y: {
      beginAtZero: true,
      grid: { color: chrome.grid },
      ticks: { color: chrome.mutedText, precision: 0 },
    },
  };

  const sharedTooltip = {
    backgroundColor: chrome.surface,
    titleColor: chrome.text,
    bodyColor: chrome.text,
    borderColor: chrome.grid,
    borderWidth: 1,
    padding: 10,
    displayColors: false,
  };

  return (
    <div className="h-64">
      {type === 'line' ? (
        <Line
          data={{
            labels,
            datasets: [
              {
                data: values,
                borderColor: color,
                backgroundColor: `${color}1a`,
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: chrome.surface,
                pointHoverBorderWidth: 2,
              },
            ],
          }}
          options={
            {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  ...sharedTooltip,
                  callbacks: {
                    title: (items) => (formatLabel ? formatLabel(items[0].label) : items[0].label),
                  },
                },
              },
              scales: sharedScales,
            } satisfies ChartOptions<'line'>
          }
        />
      ) : (
        <Bar
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: color,
                borderRadius: 4,
                maxBarThickness: 24,
              },
            ],
          }}
          options={
            {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  ...sharedTooltip,
                  callbacks: {
                    title: (items) => (formatLabel ? formatLabel(items[0].label) : items[0].label),
                  },
                },
              },
              scales: sharedScales,
            } satisfies ChartOptions<'bar'>
          }
        />
      )}
    </div>
  );
}
