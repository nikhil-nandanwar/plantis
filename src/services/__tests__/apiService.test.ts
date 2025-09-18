import { HTTPClient, APIError } from '../apiService';
import { API_CONFIG } from '../../constants/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('HTTPClient', () => {
  let httpClient: HTTPClient;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    // Create HTTPClient with shorter timeout and fewer retries for testing
    const testConfig = {
      ...API_CONFIG,
      timeout: 1000,
      maxRetries: 1
    };
    httpClient = new HTTPClient(testConfig);
    mockFetch.mockClear();
  });

  describe('successful requests', () => {
    it('should make a successful GET request', async () => {
      const mockResponse = { data: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await httpClient.request('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/test`,
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should make a successful POST request with custom headers', async () => {
      const mockResponse = { success: true };
      const requestBody = { test: 'data' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await httpClient.request('/test', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Authorization': 'Bearer token',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/test`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should throw APIError for HTTP 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(httpClient.request('/test')).rejects.toThrow(
        new APIError('HTTP 404: Not Found', 404, false)
      );
    });

    it('should throw APIError for HTTP 500 after retries', async () => {
      // Mock all retry attempts to fail
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      const error = await httpClient.request('/test').catch(e => e) as APIError;
      
      expect(error).toBeInstanceOf(APIError);
      expect(error.statusCode).toBe(500);
      expect(error.retryable).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it('should not retry non-retryable errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      const error = await httpClient.request('/test').catch(e => e) as APIError;
      
      expect(error).toBeInstanceOf(APIError);
      expect(error.statusCode).toBe(404);
      expect(error.retryable).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries
    });

    it('should handle network errors with retries', async () => {
      // Mock all attempts to fail with network error
      mockFetch.mockRejectedValue(new Error('Network request failed'));

      const error = await httpClient.request('/test').catch(e => e) as APIError;
      
      expect(error).toBeInstanceOf(APIError);
      expect(error.retryable).toBe(true);
      expect(error.message).toContain('Network request failed');
      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });
  });

  describe('utility methods', () => {
    it('should calculate exponential backoff correctly', () => {
      const httpClient = new HTTPClient();
      
      // Access private method for testing
      const calculateRetryDelay = (httpClient as any).calculateRetryDelay.bind(httpClient);
      
      expect(calculateRetryDelay(0)).toBe(1000);
      expect(calculateRetryDelay(1)).toBe(2000);
      expect(calculateRetryDelay(2)).toBe(4000);
      expect(calculateRetryDelay(10)).toBe(10000); // Max cap
    });

    it('should identify retryable status codes correctly', () => {
      const httpClient = new HTTPClient();
      
      // Access private method for testing
      const isRetryableError = (httpClient as any).isRetryableError.bind(httpClient);
      
      expect(isRetryableError(500)).toBe(true);
      expect(isRetryableError(502)).toBe(true);
      expect(isRetryableError(503)).toBe(true);
      expect(isRetryableError(429)).toBe(true);
      expect(isRetryableError(408)).toBe(true);
      
      expect(isRetryableError(400)).toBe(false);
      expect(isRetryableError(401)).toBe(false);
      expect(isRetryableError(404)).toBe(false);
    });
  });
});

describe('APIError', () => {
  it('should create error with message only', () => {
    const error = new APIError('Test error');
    
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('APIError');
    expect(error.statusCode).toBeUndefined();
    expect(error.retryable).toBe(false);
  });

  it('should create error with all properties', () => {
    const error = new APIError('Test error', 500, true);
    
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('APIError');
    expect(error.statusCode).toBe(500);
    expect(error.retryable).toBe(true);
  });
});