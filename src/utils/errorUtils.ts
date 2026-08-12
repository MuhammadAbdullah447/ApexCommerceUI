import axios from 'axios';

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data;
      if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
        return data.message;
      }
      const status = error.response.status;
      if (status === 400) return 'Bad request. Please check your inputs.';
      if (status === 401 || status === 403) return 'Unauthorized access. Please log in again.';
      if (status === 404) return 'The requested resource was not found.';
      if (status >= 500) return 'Server error. Please try again later.';
    } else if (error.request) {
      return 'Network error. Please check your internet connection.';
    } else if (error.message) {
      return error.message;
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};
