import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { User } from '../models/User.model';
import { startTestDb, stopTestDb } from '../test/dbMemoryServer';
import { generateToken } from '../utils/token';
import {
  requestPasswordReset,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from './auth.service';

const HOUR_MS = 60 * 60 * 1000;

beforeAll(async () => {
  await startTestDb();
});

afterAll(async () => {
  await stopTestDb();
});

afterEach(async () => {
  await User.deleteMany({});
});

async function createUser() {
  return User.create({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'password123',
  });
}

describe('requestPasswordReset', () => {
  it('does nothing (and does not throw) for an email that has no account', async () => {
    await expect(requestPasswordReset('nobody@example.com')).resolves.toBeUndefined();
  });

  it('sets a hashed, expiring reset token on the matching user', async () => {
    const user = await createUser();
    await requestPasswordReset(user.email);

    const updated = await User.findById(user._id).select(
      '+passwordResetTokenHash +passwordResetExpires',
    );
    expect(updated?.passwordResetTokenHash).toBeTruthy();
    expect(updated?.passwordResetExpires?.getTime()).toBeGreaterThan(Date.now());
  });
});

describe('resetPassword', () => {
  it('rejects an unknown token', async () => {
    await expect(resetPassword('not-a-real-token', 'newpassword123')).rejects.toThrow(
      /invalid or has expired/,
    );
  });

  it('rejects a token that has expired', async () => {
    const user = await createUser();
    const { token, hash } = generateToken();
    user.passwordResetTokenHash = hash;
    user.passwordResetExpires = new Date(Date.now() - HOUR_MS);
    await user.save();

    await expect(resetPassword(token, 'newpassword123')).rejects.toThrow(/invalid or has expired/);
  });

  it('updates the password and clears the token for a valid, unexpired token', async () => {
    const user = await createUser();
    const { token, hash } = generateToken();
    user.passwordResetTokenHash = hash;
    user.passwordResetExpires = new Date(Date.now() + HOUR_MS);
    await user.save();

    await resetPassword(token, 'newpassword123');

    const updated = await User.findById(user._id).select(
      '+password +passwordResetTokenHash +passwordResetExpires',
    );
    expect(await updated!.comparePassword('newpassword123')).toBe(true);
    expect(updated?.passwordResetTokenHash).toBeUndefined();
    expect(updated?.passwordResetExpires).toBeUndefined();
  });

  it('cannot be replayed after use', async () => {
    const user = await createUser();
    const { token, hash } = generateToken();
    user.passwordResetTokenHash = hash;
    user.passwordResetExpires = new Date(Date.now() + HOUR_MS);
    await user.save();

    await resetPassword(token, 'newpassword123');

    await expect(resetPassword(token, 'anotherpassword123')).rejects.toThrow(
      /invalid or has expired/,
    );
  });
});

describe('verifyEmail', () => {
  it('rejects an unknown token', async () => {
    await expect(verifyEmail('not-a-real-token')).rejects.toThrow(/invalid or has expired/);
  });

  it('rejects a token that has expired', async () => {
    const user = await createUser();
    const { token, hash } = generateToken();
    user.emailVerificationTokenHash = hash;
    user.emailVerificationExpires = new Date(Date.now() - HOUR_MS);
    await user.save();

    await expect(verifyEmail(token)).rejects.toThrow(/invalid or has expired/);
  });

  it('marks the user verified and clears the token for a valid token', async () => {
    const user = await createUser();
    const { token, hash } = generateToken();
    user.emailVerificationTokenHash = hash;
    user.emailVerificationExpires = new Date(Date.now() + HOUR_MS);
    await user.save();

    await verifyEmail(token);

    const updated = await User.findById(user._id).select(
      '+emailVerificationTokenHash +emailVerificationExpires',
    );
    expect(updated?.emailVerified).toBe(true);
    expect(updated?.emailVerificationTokenHash).toBeUndefined();
    expect(updated?.emailVerificationExpires).toBeUndefined();
  });
});

describe('resendVerificationEmail', () => {
  it('issues a fresh verification token for an unverified user', async () => {
    const user = await createUser();
    await resendVerificationEmail(user.id);

    const updated = await User.findById(user._id).select('+emailVerificationTokenHash');
    expect(updated?.emailVerificationTokenHash).toBeTruthy();
  });

  it('rejects if the email is already verified', async () => {
    const user = await createUser();
    const { token, hash } = generateToken();
    user.emailVerificationTokenHash = hash;
    user.emailVerificationExpires = new Date(Date.now() + HOUR_MS);
    await user.save();
    await verifyEmail(token);

    await expect(resendVerificationEmail(user.id)).rejects.toThrow(/already verified/);
  });
});
