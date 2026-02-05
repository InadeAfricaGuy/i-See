import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import {
  loginThunk,
  logoutThunk,
  refreshTokenThunk,
  autoLoginThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
} from '../thunks/authThunks';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  passwordResetSent: boolean;
  passwordResetSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  passwordResetSent: false,
  passwordResetSuccess: false,
};

/**
 * Authentication slice
 * Manages user authentication state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken?: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    clearPasswordResetFlags: state => {
      state.passwordResetSent = false;
      state.passwordResetSuccess = false;
    },
  },
  extraReducers: builder => {
    // Login
    builder.addCase(loginThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload || 'Login failed';
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Refresh Token
    builder.addCase(refreshTokenThunk.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    });
    builder.addCase(refreshTokenThunk.rejected, state => {
      // Token refresh failed, log user out
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });

    // Auto Login
    builder.addCase(autoLoginThunk.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(autoLoginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(autoLoginThunk.rejected, state => {
      state.isLoading = false;
      state.isAuthenticated = false;
    });

    // Forgot Password
    builder.addCase(forgotPasswordThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
      state.passwordResetSent = false;
    });
    builder.addCase(forgotPasswordThunk.fulfilled, state => {
      state.isLoading = false;
      state.passwordResetSent = true;
      state.error = null;
    });
    builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to send reset email';
      state.passwordResetSent = false;
    });

    // Reset Password
    builder.addCase(resetPasswordThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
      state.passwordResetSuccess = false;
    });
    builder.addCase(resetPasswordThunk.fulfilled, state => {
      state.isLoading = false;
      state.passwordResetSuccess = true;
      state.error = null;
    });
    builder.addCase(resetPasswordThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to reset password';
      state.passwordResetSuccess = false;
    });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  clearPasswordResetFlags,
} = authSlice.actions;
export default authSlice.reducer;
