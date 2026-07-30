export const BCRYPT_SALT_ROUNDS = 12;

// Browser-side hint for cookie expiry only; the server always trusts the
// JWT's own `exp` claim (JWT_REFRESH_EXPIRES_IN) as the source of truth.
// Keep this in sync with that env var if you change it.
export const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_COOKIE_NAME = 'snaplink_refresh_token';

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100,
};
