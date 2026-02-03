import { API_BASE_URL, API_TIMEOUT } from '../../../utils/constants';

// Mock axios before importing anything that uses it
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn((onFulfilled) => {
        // Store the interceptor function if needed
        return 0;
      }),
    },
    response: {
      use: jest.fn((onFulfilled, onRejected) => {
        // Store the interceptor functions if needed
        return 0;
      }),
    },
  },
};

const mockAxiosCreate = jest.fn(() => mockAxiosInstance);

jest.mock('axios', () => ({
  create: mockAxiosCreate,
  default: {
    create: mockAxiosCreate,
  },
}));

describe('apiClient', () => {
  let apiClient: any;

  beforeAll(() => {
    // Import after mocks are set up
    apiClient = require('../apiClient').apiClient;
  });

  beforeEach(() => {
    // Clear only the HTTP method mocks, not the interceptor setup mocks
    mockAxiosInstance.get.mockClear();
    mockAxiosInstance.post.mockClear();
    mockAxiosInstance.put.mockClear();
    mockAxiosInstance.delete.mockClear();
  });

  describe('initialization', () => {
    it('should create axios instance with correct config', () => {
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: API_BASE_URL,
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup request interceptor', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('should setup response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should make GET request and return data', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = { data: mockData };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.get('/test');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });

    it('should make GET request with config', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = { data: mockData };
      const config = { params: { page: 1 } };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.get('/test', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', config);
      expect(result).toEqual(mockData);
    });
  });

  describe('post', () => {
    it('should make POST request and return data', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = { data: mockData };
      const postData = { name: 'Test' };
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.post('/test', postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/test',
        postData,
        undefined
      );
      expect(result).toEqual(mockData);
    });

    it('should make POST request with config', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = { data: mockData };
      const postData = { name: 'Test' };
      const config = { headers: { 'X-Custom': 'value' } };
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.post('/test', postData, config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', postData, config);
      expect(result).toEqual(mockData);
    });
  });

  describe('put', () => {
    it('should make PUT request and return data', async () => {
      const mockData = { id: 1, name: 'Updated' };
      const mockResponse = { data: mockData };
      const putData = { name: 'Updated' };
      mockAxiosInstance.put.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.put('/test/1', putData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/test/1',
        putData,
        undefined
      );
      expect(result).toEqual(mockData);
    });

    it('should make PUT request with config', async () => {
      const mockData = { id: 1, name: 'Updated' };
      const mockResponse = { data: mockData };
      const putData = { name: 'Updated' };
      const config = { headers: { 'X-Custom': 'value' } };
      mockAxiosInstance.put.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.put('/test/1', putData, config);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', putData, config);
      expect(result).toEqual(mockData);
    });
  });

  describe('delete', () => {
    it('should make DELETE request and return data', async () => {
      const mockData = { success: true };
      const mockResponse = { data: mockData };
      mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.delete('/test/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
      expect(result).toEqual(mockData);
    });

    it('should make DELETE request with config', async () => {
      const mockData = { success: true };
      const mockResponse = { data: mockData };
      const config = { headers: { 'X-Custom': 'value' } };
      mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

      const result = await apiClient.delete('/test/1', config);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', config);
      expect(result).toEqual(mockData);
    });
  });
});
