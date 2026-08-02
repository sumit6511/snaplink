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

// Expired links already stop redirecting immediately (redirect.service checks
// isExpired), so this only controls how long their data sticks around for the
// owner to still see analytics on a recently-expired link before it's purged.
export const LINK_EXPIRY_GRACE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;

export const PASSWORD_RESET_EXPIRY_MS = 60 * 60 * 1000;
export const EMAIL_VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;
