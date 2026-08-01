import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatNumber } from './format';

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatDate', () => {
  it('formats an ISO string as a medium date', () => {
    expect(formatDate('2026-01-15T10:00:00.000Z')).toBe('Jan 15, 2026');
  });

  it('accepts a Date instance', () => {
    expect(formatDate(new Date('2026-01-15T10:00:00.000Z'))).toBe('Jan 15, 2026');
  });
});

describe('formatDateTime', () => {
  it('includes both date and time', () => {
    const result = formatDateTime('2026-01-15T10:00:00.000Z');
    expect(result).toContain('Jan 15, 2026');
    // Exact clock time depends on the runner's local timezone, so just
    // assert the shape rather than a specific hour.
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)?/i);
  });
});
