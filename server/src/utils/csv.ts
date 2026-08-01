export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number | boolean | null | undefined;
}

// A cell starting with =, +, -, or @ can be interpreted as a formula by
// Excel/Sheets when the export is opened — since these cells come from
// user-controlled data (link titles, URLs), an attacker could plant a
// formula that reaches out to an external URL or worse the moment someone
// opens their own export. Prefixing with a single quote neutralizes it
// while staying human-readable.
const FORMULA_TRIGGER_CHARS = new Set(['=', '+', '-', '@', '\t', '\r']);

function escapeCell(raw: string): string {
  const guarded = FORMULA_TRIGGER_CHARS.has(raw[0]) ? `'${raw}` : raw;

  if (!/[",\n\r]/.test(guarded)) return guarded;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const headerLine = columns.map((col) => escapeCell(col.header)).join(',');
  const bodyLines = rows.map((row) =>
    columns.map((col) => escapeCell(String(col.value(row) ?? ''))).join(','),
  );

  return [headerLine, ...bodyLines].map((line) => `${line}\r\n`).join('');
}
