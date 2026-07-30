import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '@/services/auth.service';
import { refreshAccessToken, setAccessToken, setOnAuthFailure } from '@/services/api';
import type { User } from '@/types/user';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    setOnAuthFailure(() => {
      setUser(null);
      setStatus('unauthenticated');
    });
    return () => setOnAuthFailure(null);
  }, []);

  useEffect(() => {
    (async () => {
      const token = await refreshAccessToken();
      if (!token) {
        setStatus('unauthenticated');
        return;
      }
      try {
        const profile = await authService.getProfileRequest();
        setUser(profile);
        setStatus('authenticated');
      } catch {
        setAccessToken(null);
        setStatus('unauthenticated');
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      async login(email, password) {
        const { user: loggedInUser, accessToken } = await authService.loginRequest({
          email,
          password,
        });
        setAccessToken(accessToken);
        setUser(loggedInUser);
        setStatus('authenticated');
      },
      async register(name, email, password) {
        const { user: registeredUser, accessToken } = await authService.registerRequest({
          name,
          email,
          password,
        });
        setAccessToken(accessToken);
        setUser(registeredUser);
        setStatus('authenticated');
      },
      async logout() {
        await authService.logoutRequest().catch(() => {});
        setAccessToken(null);
        setUser(null);
        setStatus('unauthenticated');
      },
    }),
    [user, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook are meant to live together
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
