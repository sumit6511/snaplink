import { describe, expect, it } from 'vitest';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth';

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'ada@example.com', password: 'password123' });
    expect(result.success).toBe(true);
  });

  it('lowercases and trims the email', () => {
    const result = loginSchema.safeParse({ email: '  Ada@Example.com  ', password: 'x' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('ada@example.com');
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'x' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'ada@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  it('accepts valid, matching input', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects a password with no digit', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: 'onlyletters',
      confirmPassword: 'onlyletters',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password with no letter', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: '12345678',
      confirmPassword: '12345678',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: 'ab1',
      confirmPassword: 'ab1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords, flagging confirmPassword specifically', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'different1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmPassword']);
    }
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'ada@example.com' }).success).toBe(true);
  });

  it('lowercases and trims the email', () => {
    const result = forgotPasswordSchema.safeParse({ email: '  Ada@Example.com  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('ada@example.com');
  });

  it('rejects an invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  const valid = { newPassword: 'newpassword1', confirmNewPassword: 'newpassword1' };

  it('accepts valid, matching input', () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a password with no digit', () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: 'onlyletters',
      confirmNewPassword: 'onlyletters',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'ab1', confirmNewPassword: 'ab1' });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords, flagging confirmNewPassword specifically', () => {
    const result = resetPasswordSchema.safeParse({ ...valid, confirmNewPassword: 'different1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmNewPassword']);
    }
  });
});
