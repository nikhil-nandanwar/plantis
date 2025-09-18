import { ImageUploadService } from '../imageUploadService';
import { APIError } from '../apiService';
import { API_CONFIG } from '../../constants/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('ImageUploadService', () => {
  let service: ImageUploadService;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    service = new ImageUploadService();
    mockFetch.mockClear();
  });

  describe('analyzeImage', () => {
    const mockImageUri = 'file:///path/to/image.jpg';

    it('should successfully analyze a healthy plant image', async () => {
      const mockResponse = {
        status: 'healthy',
        confidence: 0.92,
        tips: ['Your plant looks healthy!', 'Continue current care routine.']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.analyzeImage(mockImageUri);

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.analyze}`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: expect.any(FormData),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should successfully analyze a diseased plant image', async () => {
      const mockResponse = {
        status: 'diseased',
        confidence: 0.87,
        tips: [
          'Your plant might need attention',
          'Consider removing affected leaves',
          'Check soil moisture levels'
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.analyzeImage(mockImageUri);

      expect(result).toEqual(mockResponse);
      expect(result.status).toBe('diseased');
      expect(result.confidence).toBe(0.87);
      expect(result.tips).toHaveLength(3);
    });

    it('should handle API errors with proper error messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      } as Response);

      await expect(service.analyzeImage(mockImageUri)).rejects.toThrow(
        new APIError('Upload failed: Bad Request', 400, false)
      );
    });

    it('should handle server errors as retryable', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(service.analyzeImage(mockImageUri)).rejects.toThrow(
        new APIError('Upload failed: Internal Server Error', 500, true)
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network request failed'));

      await expect(service.analyzeImage(mockImageUri)).rejects.toThrow(
        new APIError('Image upload failed: Network request failed', undefined, true)
      );
    });

    it('should validate API response structure', async () => {
      const invalidResponse = {
        status: 'invalid_status',
        confidence: 'not_a_number',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      } as Response);

      await expect(service.analyzeImage(mockImageUri)).rejects.toThrow(
        new APIError('Invalid response format from server', undefined, false)
      );
    });

    it('should validate confidence is within valid range', async () => {
      const invalidResponse = {
        status: 'healthy',
        confidence: 1.5, // Invalid: > 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      } as Response);

      await expect(service.analyzeImage(mockImageUri)).rejects.toThrow(
        new APIError('Invalid response format from server', undefined, false)
      );
    });

    it('should handle responses with optional fields', async () => {
      const responseWithOptionals = {
        status: 'healthy',
        confidence: 0.95,
        tips: ['Great plant!'],
        error: null
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithOptionals,
      } as Response);

      const result = await service.analyzeImage(mockImageUri);

      expect(result).toEqual(responseWithOptionals);
    });

    it('should create proper FormData for image upload', async () => {
      const mockResponse = {
        status: 'healthy',
        confidence: 0.9,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await service.analyzeImage(mockImageUri);

      const callArgs = mockFetch.mock.calls[0];
      const formData = callArgs[1]?.body as FormData;

      expect(formData).toBeInstanceOf(FormData);
      // Note: In a real test environment, you might want to check FormData contents
      // but it's complex to test FormData contents in Jest
    });
  });

  describe('checkHealth', () => {
    it('should successfully check API health', async () => {
      const mockHealthResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z'
      };

      // Mock the HTTPClient request method
      const mockRequest = jest.fn().mockResolvedValue(mockHealthResponse);
      (service as any).httpClient.request = mockRequest;

      const result = await service.checkHealth();

      expect(mockRequest).toHaveBeenCalledWith(
        API_CONFIG.endpoints.health,
        { method: 'GET' }
      );
      expect(result).toEqual(mockHealthResponse);
    });

    it('should handle health check failures', async () => {
      const mockRequest = jest.fn().mockRejectedValue(new Error('Network error'));
      (service as any).httpClient.request = mockRequest;

      await expect(service.checkHealth()).rejects.toThrow(
        new APIError('Health check failed', undefined, true)
      );
    });
  });

  describe('response validation', () => {
    const service = new ImageUploadService();
    const isValidAPIResponse = (service as any).isValidAPIResponse.bind(service);

    it('should validate correct healthy response', () => {
      const validResponse = {
        status: 'healthy',
        confidence: 0.95,
        tips: ['Great plant!']
      };

      expect(isValidAPIResponse(validResponse)).toBe(true);
    });

    it('should validate correct diseased response', () => {
      const validResponse = {
        status: 'diseased',
        confidence: 0.87,
        tips: ['Needs attention', 'Check watering'],
        error: null
      };

      expect(isValidAPIResponse(validResponse)).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidResponse = {
        status: 'unknown',
        confidence: 0.95
      };

      expect(isValidAPIResponse(invalidResponse)).toBe(false);
    });

    it('should reject invalid confidence', () => {
      const invalidResponse = {
        status: 'healthy',
        confidence: -0.1
      };

      expect(isValidAPIResponse(invalidResponse)).toBe(false);
    });

    it('should reject non-array tips', () => {
      const invalidResponse = {
        status: 'healthy',
        confidence: 0.95,
        tips: 'not an array'
      };

      expect(isValidAPIResponse(invalidResponse)).toBe(false);
    });

    it('should accept response without optional fields', () => {
      const minimalResponse = {
        status: 'healthy',
        confidence: 0.95
      };

      expect(isValidAPIResponse(minimalResponse)).toBe(true);
    });

    it('should reject null response', () => {
      expect(isValidAPIResponse(null)).toBe(false);
    });

    it('should reject non-object response', () => {
      expect(isValidAPIResponse('string')).toBe(false);
      expect(isValidAPIResponse(123)).toBe(false);
      expect(isValidAPIResponse([])).toBe(false);
    });
  });
});