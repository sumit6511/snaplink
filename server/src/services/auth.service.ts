import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../config/constants';
import { User, UserDocument } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { LoginInput, RegisterInput } from '../validators/auth.validator';
import { ChangePasswordInput, UpdateProfileInput } from '../validators/user.validator';

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

  return {
    user,
    accessToken: signAccessToken(user.id),
    refreshToken: signRefreshToken(user.id),
  };
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

  user.name = input.name;
  user.email = input.email;
  await user.save();

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
