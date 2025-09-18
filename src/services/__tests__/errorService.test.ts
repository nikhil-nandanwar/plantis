import { ErrorService, PlantisError } from '../errorService';
import { ErrorState } from '../../types';

describe('ErrorService', () => {
  describe('PlantisError', () => {
    it('should create a PlantisError with correct properties', () => {
      const error = new PlantisError(
        'NETWORK_ERROR',
        'Network failed',
        'Please check your connection',
        true,
        'NET_001'
      );

      expect(error.type).toBe('NETWORK_ERROR');
      expect(error.message).toBe('Network failed');
      expect(error.userMessage).toBe('Please check your connection');
      expect(error.retryable).toBe(true);
      expect(error.code).toBe('NET_001');
      expect(error.name).toBe('PlantisError');
    });
  });

  describe('handleError', () => {
    it('should handle PlantisError correctly', () => {
      const plantisError = new PlantisError(
        'API_ERROR',
        'API failed',
        'Service unavailable',
        true,
        'API_001'
      );

      const result = ErrorService.handleError(plantisError);

      expect(result).toEqual({
        hasError: true,
        message: 'Service unavailable',
        code: 'API_001',
        retryable: true,
      });
    });

    it('should categorize network errors', () => {
      const networkError = new Error('Network request failed');
      const result = ErrorService.handleError(networkError);

      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.retryable).toBe(true);
      expect(result.message).toContain('Network connection failed');
    });

    it('should categorize permission errors', () => {
      const permissionError = new Error('Permission denied');
      const result = ErrorService.handleError(permissionError);

      expect(result.code).toBe('PERMISSION_ERROR');
      expect(result.retryable).toBe(false);
      expect(result.message).toContain('Permission required');
    });

    it('should categorize image errors', () => {
      const imageError = new Error('Image processing failed');
      const result = ErrorService.handleError(imageError);

      expect(result.code).toBe('IMAGE_ERROR');
      expect(result.retryable).toBe(true);
      expect(result.message).toContain('issue with the image');
    });

    it('should handle unknown errors', () => {
      const unknownError = 'Some string error';
      const result = ErrorService.handleError(unknownError);

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.retryable).toBe(true);
      expect(result.message).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('error creation methods', () => {
    it('should create network error', () => {
      const error = ErrorService.createNetworkError('Connection timeout');

      expect(error.type).toBe('NETWORK_ERROR');
      expect(error.message).toBe('Connection timeout');
      expect(error.retryable).toBe(true);
    });

    it('should create permission error', () => {
      const error = ErrorService.createPermissionError('Camera');

      expect(error.type).toBe('PERMISSION_ERROR');
      expect(error.userMessage).toContain('Camera access is required');
      expect(error.retryable).toBe(false);
    });

    it('should create API error with status code', () => {
      const error = ErrorService.createAPIError(400, 'Bad request');

      expect(error.type).toBe('API_ERROR');
      expect(error.userMessage).toContain('Invalid image format');
      expect(error.code).toBe('API_ERROR_400');
    });

    it('should create storage error', () => {
      const error = ErrorService.createStorageError('save');

      expect(error.type).toBe('STORAGE_ERROR');
      expect(error.userMessage).toContain('Unable to save data');
      expect(error.retryable).toBe(true);
    });
  });
});