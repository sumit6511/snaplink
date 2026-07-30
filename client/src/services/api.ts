import axios from 'axios';

// Kept in memory only (never localStorage) so it isn't readable by an XSS
// payload; the refresh token that survives page reloads lives in an
// httpOnly cookie the browser controls, not this module.
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

// Notified when a silent refresh fails outside of the initial app-load
// bootstrap (e.g. the refresh token itself expired mid-session), so
// AuthContext can drop the user back to a logged-out state.
let onAuthFailure: (() => void) | null = null;

export function setOnAuthFailure(handler: (() => void) | null): void {
  onAuthFailure = handler;
}

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ data: { accessToken: string } }>('/api/auth/refresh', {}, { withCredentials: true })
      .then((res) => {
        const token = res.data.data.accessToken;
        setAccessToken(token);
        return token;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => original?.url?.includes(path));

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }

      onAuthFailure?.();
    }

    return Promise.reject(error);
  },
);
