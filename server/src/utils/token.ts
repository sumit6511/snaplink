import { randomBytes, createHash } from 'node:crypto';

export interface GeneratedToken {
  token: string;
  hash: string;
}

// The raw token goes into the emailed link; only its hash is ever stored,
// so a DB leak can't be replayed as a working reset/verification link.
export function generateToken(): GeneratedToken {
  const token = randomBytes(32).toString('hex');
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
