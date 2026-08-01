import { CookieOptions, Request, Response } from 'express';
import { REFRESH_TOKEN_COOKIE_MAX_AGE_MS, REFRESH_TOKEN_COOKIE_NAME } from '../config/constants';
import { isProduction } from '../config/env';
import * as authService from '../services/auth.service';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  // Frontend and API are on different domains in production (Vercel vs
  // Render), so the browser treats every API call as cross-site — a
  // `strict` (or `lax`) cookie would simply never be sent back, silently
  // breaking refresh/logout. `none` requires `secure: true`, which is why
  // this stays tied to the same isProduction check as the line above;
  // locally, both run on localhost (same site), so `strict` is fine there.
  sameSite: isProduction ? 'none' : 'strict',
  path: '/api/auth',
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
};

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, refreshCookieOptions);
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ success: true, data: { user, accessToken } });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);
  setRefreshCookie(res, refreshToken);
  res.status(200).json({ success: true, data: { user, accessToken } });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
  if (!token) {
    throw AppError.unauthorized('No refresh session found. Please log in.');
  }

  const { accessToken } = await authService.refreshAccessToken(token);
  res.status(200).json({ success: true, data: { accessToken } });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
