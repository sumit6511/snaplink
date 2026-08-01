import { describe, expect, it } from 'vitest';
import { parseBulkImportUrls, validateBulkImportUrls } from './bulkImport';

describe('parseBulkImportUrls', () => {
  it('splits on newlines and trims each line', () => {
    expect(parseBulkImportUrls('https://a.com \n https://b.com')).toEqual([
      'https://a.com',
      'https://b.com',
    ]);
  });

  it('drops blank lines', () => {
    expect(parseBulkImportUrls('https://a.com\n\n\nhttps://b.com\n')).toEqual([
      'https://a.com',
      'https://b.com',
    ]);
  });
});

describe('validateBulkImportUrls', () => {
  it('accepts a non-empty list of valid http(s) URLs', () => {
    expect(validateBulkImportUrls(['https://a.com', 'http://b.com'])).toBeNull();
  });

  it('rejects an empty list', () => {
    expect(validateBulkImportUrls([])).toMatch(/at least one/i);
  });

  it('rejects a list over the max size', () => {
    const urls = Array.from({ length: 51 }, (_, i) => `https://example.com/${i}`);
    expect(validateBulkImportUrls(urls)).toMatch(/at most 50/i);
  });

  it('rejects a non-http(s) URL, naming the offending line', () => {
    expect(validateBulkImportUrls(['https://a.com', 'javascript:alert(1)'])).toMatch(
      /javascript:alert\(1\)/,
    );
  });
});
