import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  clearPasswordResetFlags,
  AuthState,
} from '../authSlice';
import { User } from '../../../types';

describe('authSlice', () => {
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

  const mockUser: User = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'client',
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('loginStart', () => {
    it('should set isLoading to true and clear error', () => {
      const previousState: AuthState = {
        ...initialState,
        error: 'Previous error',
      };

      const state = authReducer(previousState, loginStart());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess', () => {
    it('should set user, token, and refreshToken on successful login', () => {
      const token = 'test-token-123';
      const refreshToken = 'test-refresh-token-123';
      const state = authReducer(
        initialState,
        loginSuccess({ user: mockUser, token, refreshToken })
      );

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(token);
      expect(state.refreshToken).toBe(refreshToken);
      expect(state.error).toBeNull();
    });

    it('should clear previous error on successful login', () => {
      const previousState: AuthState = {
        ...initialState,
        error: 'Previous error',
      };
      const token = 'test-token-123';

      const state = authReducer(
        previousState,
        loginSuccess({ user: mockUser, token })
      );

      expect(state.error).toBeNull();
    });
  });

  describe('loginFailure', () => {
    it('should set error and clear authentication on login failure', () => {
      const errorMessage = 'Invalid credentials';
      const state = authReducer(initialState, loginFailure(errorMessage));

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should clear user and token on login failure', () => {
      const previousState: AuthState = {
        ...initialState,
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
      };
      const errorMessage = 'Session expired';

      const state = authReducer(previousState, loginFailure(errorMessage));

      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logout', () => {
    it('should clear all authentication state', () => {
      const authenticatedState: AuthState = {
        user: mockUser,
        token: 'test-token-123',
        refreshToken: 'test-refresh-token-123',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        passwordResetSent: false,
        passwordResetSuccess: false,
      };

      const state = authReducer(authenticatedState, logout());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should work correctly when already logged out', () => {
      const state = authReducer(initialState, logout());

      expect(state).toEqual(initialState);
    });
  });

  describe('clearError', () => {
    it('should clear the error state', () => {
      const previousState: AuthState = {
        ...initialState,
        error: 'Some error',
      };

      const state = authReducer(previousState, clearError());

      expect(state.error).toBeNull();
    });
  });

  describe('clearPasswordResetFlags', () => {
    it('should clear password reset flags', () => {
      const previousState: AuthState = {
        ...initialState,
        passwordResetSent: true,
        passwordResetSuccess: true,
      };

      const state = authReducer(previousState, clearPasswordResetFlags());

      expect(state.passwordResetSent).toBe(false);
      expect(state.passwordResetSuccess).toBe(false);
    });
  });
});
