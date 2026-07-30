// Categorical palette + chart chrome from the dataviz skill's validated
// reference instance (references/palette.md) — an 8-hue, fixed-order set
// that passes the CVD/contrast checks in both light and dark mode. Used
// as-is (no custom hues), which keeps it correct without re-validating.
export const CATEGORICAL_LIGHT = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#e87ba4', // magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
];

export const CATEGORICAL_DARK = [
  '#3987e5',
  '#d95926',
  '#199e70',
  '#c98500',
  '#d55181',
  '#008300',
  '#9085e9',
  '#e66767',
];

// Single-hue sequential ramp (blue), used for the app's own single-series
// charts (daily/monthly clicks, country ranking) — matches SnapLink's
// brand blue rather than the reference's default, which a lone hue is free
// to do since the categorical CVD checks only apply to multi-series charts.
export const SEQUENTIAL_LIGHT = '#2563eb';
export const SEQUENTIAL_DARK = '#3987e5';

export interface ChartChrome {
  text: string;
  mutedText: string;
  grid: string;
  surface: string;
}

export const CHART_CHROME_LIGHT: ChartChrome = {
  text: '#0b0b0b',
  mutedText: '#898781',
  grid: '#e1e0d9',
  surface: '#fcfcfb',
};

export const CHART_CHROME_DARK: ChartChrome = {
  text: '#ffffff',
  mutedText: '#898781',
  grid: '#2c2c2a',
  surface: '#1a1a19',
};

export function getCategoricalPalette(isDark: boolean): string[] {
  return isDark ? CATEGORICAL_DARK : CATEGORICAL_LIGHT;
}

export function getSequentialColor(isDark: boolean): string {
  return isDark ? SEQUENTIAL_DARK : SEQUENTIAL_LIGHT;
}

export function getChartChrome(isDark: boolean): ChartChrome {
  return isDark ? CHART_CHROME_DARK : CHART_CHROME_LIGHT;
}

/**
 * Folds a ranked {name, count} list down to a soft cap, bucketing the tail
 * into "Other" so categorical charts never try to seat 20+ series.
 */
export function foldToTopN<T extends { name: string; count: number }>(
  items: T[],
  n: number,
): { name: string; count: number }[] {
  if (items.length <= n) return items;
  const top = items.slice(0, n);
  const rest = items.slice(n).reduce((sum, item) => sum + item.count, 0);
  return [...top, { name: 'Other', count: rest }];
}
