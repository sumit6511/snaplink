import bcrypt from 'bcryptjs';
import {
  BCRYPT_SALT_ROUNDS,
  EMAIL_VERIFICATION_EXPIRY_MS,
  PASSWORD_RESET_EXPIRY_MS,
} from '../config/constants';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { User, UserDocument } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateToken, hashToken } from '../utils/token';
import { LoginInput, RegisterInput } from '../validators/auth.validator';
import { ChangePasswordInput, UpdateProfileInput } from '../validators/user.validator';
import { sendPasswordResetEmail, sendVerificationEmail } from './email.service';

interface AuthResult {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}

// A hash with no matching plaintext, compared against when no user is found
// so a login attempt always pays bcrypt's cost. Without this, "no such
// user" returns near-instantly while a real password check takes ~100ms,
// letting an attacker enumerate registered emails purely from response time.
const DUMMY_HASH = bcrypt.hashSync('snaplink-dummy-password-for-timing-safety', BCRYPT_SALT_ROUNDS);

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await User.findOne({ email: input.email }).lean();
  if (existing) {
    throw AppError.conflict('An account with this email already exists');
  }

  const user = await User.create(input);

  // Best-effort: a slow/unreachable email provider shouldn't fail account
  // creation itself, so this is fire-and-forget with its own error handling.
  void issueEmailVerification(user).catch((err) => {
    logger.error(`Failed to send verification email to ${user.email}: ${err}`);
  });

  return {
    user,
    accessToken: signAccessToken(user.id),
    refreshToken: signRefreshToken(user.id),
  };
}

async function issueEmailVerification(user: UserDocument): Promise<void> {
  const { token, hash } = generateToken();
  user.emailVerificationTokenHash = hash;
  user.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY_MS);
  await user.save();

  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;
  await sendVerificationEmail(user.email, verifyUrl);
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email: input.email }).select('+password');

  const isMatch = user
    ? await user.comparePassword(input.password)
    : await bcrypt.compare(input.password, DUMMY_HASH);

  if (!user || !isMatch) {
    throw AppError.unauthorized('Invalid email or password');
  }

  return {
    user,
    accessToken: signAccessToken(user.id),
    refreshToken: signRefreshToken(user.id),
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw AppError.unauthorized('Invalid or expired session. Please log in again.');
  }

  const user = await User.findById(payload.sub).lean();
  if (!user) {
    throw AppError.unauthorized('User no longer exists');
  }

  return { accessToken: signAccessToken(payload.sub) };
}

export async function getUserProfile(userId: string): Promise<UserDocument> {
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }
  return user;
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UserDocument> {
  const emailOwner = await User.findOne({ email: input.email }).select('_id').lean();
  if (emailOwner && emailOwner._id.toString() !== userId) {
    throw AppError.conflict('An account with this email already exists');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }

  const emailChanged = input.email !== user.email;

  user.name = input.name;
  user.email = input.email;

  // A verified badge on an address nobody's proven ownership of yet would be
  // misleading, so changing email re-requires verification of the new one.
  if (emailChanged) {
    user.emailVerified = false;
  }
  await user.save();

  if (emailChanged) {
    issueEmailVerification(user).catch((err) => {
      logger.error(`Failed to send verification email to ${user.email}: ${err}`);
    });
  }

  return user;
}

export async function changeUserPassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<void> {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw AppError.notFound('User not found');
  }

  const isMatch = await user.comparePassword(input.currentPassword);
  if (!isMatch) {
    throw AppError.badRequest('Current password is incorrect');
  }

  user.password = input.newPassword;
  await user.save();
}

// Always resolves without indicating whether the address is registered —
// same anti-enumeration rationale as the timing-safe DUMMY_HASH login path.
export async function requestPasswordReset(email: string): Promise<void> {
  const user = await User.findOne({ email });
  if (!user) return;

  const { token, hash } = generateToken();
  user.passwordResetTokenHash = hash;
  user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MS);
  await user.save();

  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetUrl);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw AppError.badRequest('This password reset link is invalid or has expired');
  }

  user.password = newPassword;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
}

export async function verifyEmail(token: string): Promise<void> {
  const user = await User.findOne({
    emailVerificationTokenHash: hashToken(token),
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw AppError.badRequest('This verification link is invalid or has expired');
  }

  user.emailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
}

export async function resendVerificationEmail(userId: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }
  if (user.emailVerified) {
    throw AppError.badRequest('Email is already verified');
  }

  await issueEmailVerification(user);
}
