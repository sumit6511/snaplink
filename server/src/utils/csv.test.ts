import { describe, expect, it } from 'vitest';
import { toCsv } from './csv';

interface Row {
  name: string;
  count: number;
}

describe('toCsv', () => {
  it('renders a header row and one row per item', () => {
    const csv = toCsv<Row>(
      [
        { name: 'Alice', count: 3 },
        { name: 'Bob', count: 5 },
      ],
      [
        { header: 'Name', value: (r) => r.name },
        { header: 'Count', value: (r) => r.count },
      ],
    );

    expect(csv).toBe('Name,Count\r\nAlice,3\r\nBob,5\r\n');
  });

  it('quotes and escapes cells containing commas, quotes, or newlines', () => {
    const csv = toCsv<Row>(
      [{ name: 'Smith, "The Boss"\nJr.', count: 1 }],
      [
        { header: 'Name', value: (r) => r.name },
        { header: 'Count', value: (r) => r.count },
      ],
    );

    expect(csv).toBe('Name,Count\r\n"Smith, ""The Boss""\nJr.",1\r\n');
  });

  it('renders null/undefined values as an empty cell', () => {
    const csv = toCsv<{ note: string | null }>(
      [{ note: null }],
      [{ header: 'Note', value: (r) => r.note }],
    );

    expect(csv).toBe('Note\r\n\r\n');
  });

  it('neutralizes formula-injection payloads by prefixing a leading quote', () => {
    const csv = toCsv<{ value: string }>(
      [
        { value: '=cmd|/c calc' },
        { value: '+1+1' },
        { value: '-1+1' },
        { value: '@SUM(1)' },
        { value: 'normal text' },
      ],
      [{ header: 'Value', value: (r) => r.value }],
    );

    const lines = csv.trim().split('\r\n');
    expect(lines).toEqual(['Value', "'=cmd|/c calc", "'+1+1", "'-1+1", "'@SUM(1)", 'normal text']);
  });

  it('still CSV-quotes a formula-guarded cell that also contains a comma', () => {
    const csv = toCsv<{ value: string }>(
      [{ value: '@SUM(1,1)' }],
      [{ header: 'Value', value: (r) => r.value }],
    );

    expect(csv).toBe(`Value\r\n"'@SUM(1,1)"\r\n`);
  });
});
