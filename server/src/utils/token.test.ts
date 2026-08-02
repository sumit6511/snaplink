import { describe, expect, it } from 'vitest';
import { generateToken, hashToken } from './token';

describe('generateToken', () => {
  it('returns a 64-char hex token and its SHA-256 hash', () => {
    const { token, hash } = generateToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).toBe(hashToken(token));
  });

  it('generates a different token on every call', () => {
    const first = generateToken();
    const second = generateToken();
    expect(first.token).not.toBe(second.token);
  });
});

describe('hashToken', () => {
  it('is deterministic for the same input', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'));
  });

  it('produces different hashes for different inputs', () => {
    expect(hashToken('abc')).not.toBe(hashToken('abd'));
  });
});
