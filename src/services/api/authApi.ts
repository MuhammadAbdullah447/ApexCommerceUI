import axios from 'axios';
import { apiClient } from './client';
import { LoginCredentials, AuthResponse } from '../../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const trimmedInput = credentials.username.trim();
    const formattedUsername = trimmedInput.includes('@')
      ? trimmedInput.split('@')[0]
      : trimmedInput;

    const response = await apiClient.post<AuthResponse>('/auth/login', {
      username: formattedUsername,
      password: credentials.password.trim(),
      expiresInMins: credentials.expiresInMins || 30,
    });

    return response.data;
  },
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data;
      if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
        return data.message;
      }
      if (error.response.status === 400 || error.response.status === 401) {
        return 'Invalid credentials. Please check your username and password.';
      }
      if (error.response.status >= 500) {
        return 'Server error. Please try again later.';
      }
    } else if (error.request) {
      return 'Network error. Please check your internet connection and try again.';
    } else if (error.message) {
      return error.message;
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};
