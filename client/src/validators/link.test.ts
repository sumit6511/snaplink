import { describe, expect, it } from 'vitest';
import { linkFormSchema } from './link';

describe('linkFormSchema', () => {
  it('accepts a valid https URL with no optional fields', () => {
    const result = linkFormSchema.safeParse({
      originalUrl: 'https://example.com/some/path',
      customAlias: '',
      title: '',
      expiresAt: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepts http (not just https)', () => {
    const result = linkFormSchema.safeParse({ originalUrl: 'http://example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects a non-http(s) scheme like javascript:', () => {
    const result = linkFormSchema.safeParse({ originalUrl: 'javascript:alert(1)' });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed URL', () => {
    const result = linkFormSchema.safeParse({ originalUrl: 'not a url' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty URL', () => {
    const result = linkFormSchema.safeParse({ originalUrl: '' });
    expect(result.success).toBe(false);
  });

  it('accepts a valid custom alias', () => {
    const result = linkFormSchema.safeParse({
      originalUrl: 'https://example.com',
      customAlias: 'my-alias_123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an alias shorter than 3 characters', () => {
    const result = linkFormSchema.safeParse({
      originalUrl: 'https://example.com',
      customAlias: 'ab',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an alias with disallowed characters', () => {
    const result = linkFormSchema.safeParse({
      originalUrl: 'https://example.com',
      customAlias: 'not a valid alias!',
    });
    expect(result.success).toBe(false);
  });
});
