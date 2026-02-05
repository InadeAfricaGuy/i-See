import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../../utils/constants';
import { storageService } from '../storageService';

// Module-level state for token refresh to prevent race conditions across instances
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * API Client service
 * Handles all HTTP requests to the backend API
 * Implemented as singleton to ensure consistent token refresh behavior
 */
class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token to requests
    this.client.interceptors.request.use(
      async config => {
        const token = await storageService.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // Skip retry for refresh endpoint to prevent infinite loop
        if (originalRequest.url?.includes('/auth/refresh')) {
          return Promise.reject(error);
        }

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            // Wait for the refresh to complete
            return new Promise(resolve => {
              refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const refreshToken = await storageService.getRefreshToken();
            
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh token endpoint using the same client
            const response = await this.client.post('/auth/refresh', {
              refreshToken,
            });

            const { token: newToken, refreshToken: newRefreshToken } = response.data;

            // Save new tokens
            await storageService.saveAuthToken(newToken);
            await storageService.saveRefreshToken(newRefreshToken);

            // Update the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry all queued requests with new token
            refreshSubscribers.forEach(callback => callback(newToken));
            refreshSubscribers = [];

            isRefreshing = false;

            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and logout user
            // Note: In production, this should trigger navigation to login screen
            // The app's navigation/auth context should listen for this state change
            isRefreshing = false;
            refreshSubscribers = [];
            await storageService.clearAll();
            
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (error.response) {
          // Server responded with error status
          console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
          // Request made but no response
          console.error('Network Error:', error.message);
        } else {
          // Something else happened
          console.error('Error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get singleton instance of ApiClient
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance();
