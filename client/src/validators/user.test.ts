import { describe, expect, it } from 'vitest';
import { changePasswordSchema, updateProfileSchema } from './user';

describe('updateProfileSchema', () => {
  it('accepts a valid name and email', () => {
    const result = updateProfileSchema.safeParse({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('lowercases and trims the email', () => {
    const result = updateProfileSchema.safeParse({
      name: 'Ada Lovelace',
      email: '  Ada@Example.com  ',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('ada@example.com');
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = updateProfileSchema.safeParse({ name: 'A', email: 'ada@example.com' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = updateProfileSchema.safeParse({ name: 'Ada Lovelace', email: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});

describe('changePasswordSchema', () => {
  const valid = {
    currentPassword: 'oldpassword1',
    newPassword: 'newpassword1',
    confirmNewPassword: 'newpassword1',
  };

  it('accepts valid, matching input', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an empty current password', () => {
    const result = changePasswordSchema.safeParse({ ...valid, currentPassword: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a new password with no digit', () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      newPassword: 'onlyletters',
      confirmNewPassword: 'onlyletters',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a new password shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      newPassword: 'ab1',
      confirmNewPassword: 'ab1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched new passwords, flagging confirmNewPassword specifically', () => {
    const result = changePasswordSchema.safeParse({ ...valid, confirmNewPassword: 'different1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmNewPassword']);
    }
  });
});
