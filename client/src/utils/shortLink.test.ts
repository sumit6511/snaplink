import { afterEach, describe, expect, it, vi } from 'vitest';
import { getShortUrl, getShortUrlDisplay } from './shortLink';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getShortUrl', () => {
  it('prefers the custom alias over the short code', () => {
    vi.stubEnv('VITE_BACKEND_URL', 'https://api.snaplink.test');
    expect(getShortUrl({ shortCode: 'abc1234', customAlias: 'my-alias' })).toBe(
      'https://api.snaplink.test/my-alias',
    );
  });

  it('falls back to the short code when there is no alias', () => {
    vi.stubEnv('VITE_BACKEND_URL', 'https://api.snaplink.test');
    expect(getShortUrl({ shortCode: 'abc1234' })).toBe('https://api.snaplink.test/abc1234');
  });

  it('falls back to window.location.origin when VITE_BACKEND_URL is unset', () => {
    vi.stubEnv('VITE_BACKEND_URL', undefined);
    expect(getShortUrl({ shortCode: 'abc1234' })).toBe(`${window.location.origin}/abc1234`);
  });
});

describe('getShortUrlDisplay', () => {
  it('strips the protocol for compact display', () => {
    vi.stubEnv('VITE_BACKEND_URL', 'https://api.snaplink.test');
    expect(getShortUrlDisplay({ shortCode: 'abc1234' })).toBe('api.snaplink.test/abc1234');
  });
});
