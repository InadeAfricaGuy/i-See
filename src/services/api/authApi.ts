import { apiClient } from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

/**
 * Authentication API service
 */
export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<void> => {
    return apiClient.post<void>('/auth/forgot-password', { email });
  },
};
