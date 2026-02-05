import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/api/authApi';
import { storageService } from '../../services/storageService';

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
 * Login thunk
 * Handles user login and token storage
 */
export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      // Store tokens securely
      await storageService.saveAuthToken(response.token);
      await storageService.saveRefreshToken(response.refreshToken);
      await storageService.saveUserData(response.user);
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Logout thunk
 * Handles user logout and cleanup
 */
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error: any) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      await storageService.clearAll();
    }
  }
);

/**
 * Refresh token thunk
 * Handles token refresh
 */
export const refreshTokenThunk = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = await storageService.getRefreshToken();
      
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }
      
      const response = await authApi.refreshToken(refreshToken);
      
      // Update stored tokens
      await storageService.saveAuthToken(response.token);
      await storageService.saveRefreshToken(response.refreshToken);
      await storageService.saveUserData(response.user);
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Token refresh failed';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Auto login thunk
 * Restores authentication state from stored tokens
 */
export const autoLoginThunk = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>(
  'auth/autoLogin',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storageService.getAuthToken();
      const refreshToken = await storageService.getRefreshToken();
      const userData = await storageService.getUserData();
      
      if (!token || !refreshToken || !userData) {
        return rejectWithValue('No stored authentication data');
      }
      
      // Return stored data
      // In a real app, you might want to verify the token with the server
      return {
        user: userData,
        token,
        refreshToken,
      };
    } catch (error: any) {
      return rejectWithValue('Auto login failed');
    }
  }
);

/**
 * Forgot password thunk
 * Sends password reset email
 */
export const forgotPasswordThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      await authApi.forgotPassword(email);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Reset password thunk
 * Resets password with token
 */
export const resetPasswordThunk = createAsyncThunk<
  void,
  { token: string; newPassword: string },
  { rejectValue: string }
>(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      await authApi.resetPassword(token, newPassword);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      return rejectWithValue(errorMessage);
    }
  }
);
