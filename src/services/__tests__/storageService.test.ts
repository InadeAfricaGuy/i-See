import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from '../storageService';
import { STORAGE_KEYS } from '../../utils/constants';
import { User } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('storageService', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAuthToken', () => {
    it('should save auth token successfully', async () => {
      const token = 'test-token-123';
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await storageService.saveAuthToken(token);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.AUTH_TOKEN,
        token
      );
    });

    it('should throw error when save fails', async () => {
      const token = 'test-token-123';
      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValueOnce(error);

      await expect(storageService.saveAuthToken(token)).rejects.toThrow(error);
    });
  });

  describe('getAuthToken', () => {
    it('should get auth token successfully', async () => {
      const token = 'test-token-123';
      mockAsyncStorage.getItem.mockResolvedValueOnce(token);

      const result = await storageService.getAuthToken();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN);
      expect(result).toBe(token);
    });

    it('should return null when no token exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await storageService.getAuthToken();

      expect(result).toBeNull();
    });

    it('should return null when get fails', async () => {
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await storageService.getAuthToken();

      expect(result).toBeNull();
    });
  });

  describe('removeAuthToken', () => {
    it('should remove auth token successfully', async () => {
      mockAsyncStorage.removeItem.mockResolvedValueOnce(undefined);

      await storageService.removeAuthToken();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.AUTH_TOKEN
      );
    });

    it('should throw error when remove fails', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.removeItem.mockRejectedValueOnce(error);

      await expect(storageService.removeAuthToken()).rejects.toThrow(error);
    });
  });

  describe('saveUserData', () => {
    it('should save user data successfully', async () => {
      const userData: User = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'client',
      };
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await storageService.saveUserData(userData);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
    });

    it('should throw error when save fails', async () => {
      const userData: User = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'client',
      };
      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValueOnce(error);

      await expect(storageService.saveUserData(userData)).rejects.toThrow(error);
    });
  });

  describe('getUserData', () => {
    it('should get user data successfully', async () => {
      const userData: User = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'client',
      };
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(userData));

      const result = await storageService.getUserData();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.USER_DATA);
      expect(result).toEqual(userData);
    });

    it('should return null when no user data exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await storageService.getUserData();

      expect(result).toBeNull();
    });

    it('should return null when get fails', async () => {
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await storageService.getUserData();

      expect(result).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should clear all storage successfully', async () => {
      mockAsyncStorage.clear.mockResolvedValueOnce(undefined);

      await storageService.clearAll();

      expect(mockAsyncStorage.clear).toHaveBeenCalled();
    });

    it('should throw error when clear fails', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.clear.mockRejectedValueOnce(error);

      await expect(storageService.clearAll()).rejects.toThrow(error);
    });
  });
});
