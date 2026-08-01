import { z } from 'zod';

export const MAX_BULK_IMPORT_URLS = 50;

export const bulkImportSchema = z.object({
  urlsText: z.string().trim().min(1, 'Paste at least one URL'),
});

export type BulkImportFormValues = z.infer<typeof bulkImportSchema>;

// Matches the backend's restriction to http(s) — Zod's plain .url() would
// otherwise also accept javascript:/data: URIs.
function isHttpUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export function parseBulkImportUrls(urlsText: string): string[] {
  return urlsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function validateBulkImportUrls(urls: string[]): string | null {
  if (urls.length === 0) return 'Paste at least one URL';
  if (urls.length > MAX_BULK_IMPORT_URLS) {
    return `Import at most ${MAX_BULK_IMPORT_URLS} URLs at a time (found ${urls.length})`;
  }
  const invalid = urls.find((url) => !isHttpUrl(url));
  if (invalid) return `Not a valid http:// or https:// URL: ${invalid}`;
  return null;
}
