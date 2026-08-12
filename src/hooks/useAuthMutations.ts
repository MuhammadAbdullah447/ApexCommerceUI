import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api/authApi';
import { LoginCredentials, AuthResponse } from '../types/auth';

export const useLoginMutation = () => {
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
  });
};
