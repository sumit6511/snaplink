import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sendMock = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

beforeEach(() => {
  vi.resetModules();
  sendMock.mockReset();
});

afterEach(() => {
  vi.doUnmock('../config/env');
});

async function loadWithApiKey(apiKey: string) {
  vi.doMock('../config/env', () => ({
    env: { RESEND_API_KEY: apiKey, EMAIL_FROM: 'SnapLink <onboarding@resend.dev>' },
    isProduction: false,
  }));
  return import('./email.service');
}

describe('sendPasswordResetEmail / sendVerificationEmail', () => {
  it('without RESEND_API_KEY configured, logs instead of calling Resend', async () => {
    const { logger } = await import('../config/logger');
    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => logger);

    const { sendPasswordResetEmail } = await loadWithApiKey('');
    await sendPasswordResetEmail('ada@example.com', 'https://app.example.com/reset?token=abc');

    expect(sendMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://app.example.com/reset?token=abc'),
    );
  });

  it('with RESEND_API_KEY configured, sends via Resend with the right fields', async () => {
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });

    const { sendVerificationEmail } = await loadWithApiKey('test-key');
    await sendVerificationEmail('grace@example.com', 'https://app.example.com/verify?token=xyz');

    expect(sendMock).toHaveBeenCalledTimes(1);
    const call = sendMock.mock.calls[0][0];
    expect(call.to).toBe('grace@example.com');
    expect(call.from).toBe('SnapLink <onboarding@resend.dev>');
    expect(call.subject).toBe('Verify your SnapLink email address');
    expect(call.html).toContain('https://app.example.com/verify?token=xyz');
  });

  it('logs an error (without throwing) when Resend returns an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'Invalid `to` field' } });
    const { logger } = await import('../config/logger');
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => logger);

    const { sendPasswordResetEmail } = await loadWithApiKey('test-key');
    await expect(
      sendPasswordResetEmail('bad@invalid', 'https://app.example.com/reset?token=abc'),
    ).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid `to` field'));
  });
});
