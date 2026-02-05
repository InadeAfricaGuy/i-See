import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { loginThunk, logoutThunk, forgotPasswordThunk } from '../authThunks';
import { authApi } from '../../../services/api/authApi';
import { storageService } from '../../../services/storageService';

// Mock the services
jest.mock('../../../services/api/authApi');
jest.mock('../../../services/storageService');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Auth Thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginThunk', () => {
    it('should dispatch fulfilled action on successful login', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'client',
        },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
      };

      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);
      (storageService.saveAuthToken as jest.Mock).mockResolvedValue(undefined);
      (storageService.saveRefreshToken as jest.Mock).mockResolvedValue(undefined);
      (storageService.saveUserData as jest.Mock).mockResolvedValue(undefined);

      const store = mockStore({});
      const credentials = { email: 'test@example.com', password: 'password123' };

      await store.dispatch(loginThunk(credentials) as any);

      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/login/pending');
      expect(actions[1].type).toBe('auth/login/fulfilled');
      expect(actions[1].payload).toEqual(mockResponse);

      expect(authApi.login).toHaveBeenCalledWith(credentials);
      expect(storageService.saveAuthToken).toHaveBeenCalledWith('test-token');
      expect(storageService.saveRefreshToken).toHaveBeenCalledWith('test-refresh-token');
      expect(storageService.saveUserData).toHaveBeenCalledWith(mockResponse.user);
    });

    it('should dispatch rejected action on login failure', async () => {
      const errorMessage = 'Invalid credentials';
      (authApi.login as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const store = mockStore({});
      const credentials = { email: 'test@example.com', password: 'wrong' };

      await store.dispatch(loginThunk(credentials) as any);

      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/login/pending');
      expect(actions[1].type).toBe('auth/login/rejected');
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('logoutThunk', () => {
    it('should dispatch fulfilled action and clear storage', async () => {
      (authApi.logout as jest.Mock).mockResolvedValue(undefined);
      (storageService.clearAll as jest.Mock).mockResolvedValue(undefined);

      const store = mockStore({});

      await store.dispatch(logoutThunk() as any);

      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/logout/pending');
      expect(actions[1].type).toBe('auth/logout/fulfilled');

      expect(authApi.logout).toHaveBeenCalled();
      expect(storageService.clearAll).toHaveBeenCalled();
    });

    it('should clear storage even if API call fails', async () => {
      (authApi.logout as jest.Mock).mockRejectedValue(new Error('API error'));
      (storageService.clearAll as jest.Mock).mockResolvedValue(undefined);

      const store = mockStore({});

      await store.dispatch(logoutThunk() as any);

      const actions = store.getActions();
      expect(actions[1].type).toBe('auth/logout/fulfilled');
      expect(storageService.clearAll).toHaveBeenCalled();
    });
  });

  describe('forgotPasswordThunk', () => {
    it('should dispatch fulfilled action on success', async () => {
      (authApi.forgotPassword as jest.Mock).mockResolvedValue(undefined);

      const store = mockStore({});
      const email = 'test@example.com';

      await store.dispatch(forgotPasswordThunk(email) as any);

      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/forgotPassword/pending');
      expect(actions[1].type).toBe('auth/forgotPassword/fulfilled');

      expect(authApi.forgotPassword).toHaveBeenCalledWith(email);
    });

    it('should dispatch rejected action on failure', async () => {
      const errorMessage = 'Email not found';
      (authApi.forgotPassword as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const store = mockStore({});
      const email = 'nonexistent@example.com';

      await store.dispatch(forgotPasswordThunk(email) as any);

      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/forgotPassword/pending');
      expect(actions[1].type).toBe('auth/forgotPassword/rejected');
      expect(actions[1].payload).toBe(errorMessage);
    });
  });
});
