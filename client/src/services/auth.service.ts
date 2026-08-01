import { api } from '@/services/api';
import type { User } from '@/types/user';

interface AuthResponse {
  user: User;
  accessToken: string;
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<{ data: AuthResponse }>('/auth/register', payload);
  return data.data;
}

export async function loginRequest(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<{ data: AuthResponse }>('/auth/login', payload);
  return data.data;
}

export async function logoutRequest(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getProfileRequest(): Promise<User> {
  const { data } = await api.get<{ data: { user: User } }>('/user/profile');
  return data.data.user;
}

export async function updateProfileRequest(payload: {
  name: string;
  email: string;
}): Promise<User> {
  const { data } = await api.put<{ data: { user: User } }>('/user/profile', payload);
  return data.data.user;
}

export async function changePasswordRequest(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await api.put('/user/password', payload);
}
