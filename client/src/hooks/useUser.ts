import { useMutation } from '@tanstack/react-query';
import { changePasswordRequest, updateProfileRequest } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

export function useUpdateProfile() {
  const { updateUser } = useAuth();
  return useMutation({
    mutationFn: (input: { name: string; email: string }) => updateProfileRequest(input),
    onSuccess: (user) => updateUser(user),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      changePasswordRequest(input),
  });
}
