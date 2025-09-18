import { ScanService } from '../scanService';
import { imageUploadService } from '../imageUploadService';
import { APIResponse } from '../../types';

// Mock the imageUploadService
jest.mock('../imageUploadService');
const mockImageUploadService = imageUploadService as jest.Mocked<typeof imageUploadService>;

// Mock fetch for image validation
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ScanService', () => {
  let scanService: ScanService;

  beforeEach(() => {
    scanService = new ScanService();
    jest.clearAllMocks();
  });

  describe('performScan', () => {
    const mockImageUri = 'test-image-uri';
    const mockApiResponse: APIResponse = {
      status: 'healthy',
      confidence: 0.95,
      tips: ['Your plant looks healthy!'],
    };

    beforeEach(() => {
      // Mock successful image validation
      mockFetch.mockResolvedValue({
        ok: true,
      } as Response);

      // Mock successful API response
      mockImageUploadService.analyzeImage.mockResolvedValue(mockApiResponse);
    });

    it('successfully performs a scan', async () => {
      const mockOnProgress = jest.fn();
      
      const result = await scanService.performScan(mockImageUri, mockOnProgress);

      expect(result.result).toBeDefined();
      expect(result.error).toBeUndefined();
      expect(result.result?.status).toBe('healthy');
      expect(result.result?.confidence).toBe(0.95);
      expect(mockOnProgress).toHaveBeenCalledWith(1.0, 'Complete!');
    });

    it('calls progress callback with correct values', async () => {
      const mockOnProgress = jest.fn();
      
      await scanService.performScan(mockImageUri, mockOnProgress);

      expect(mockOnProgress).toHaveBeenCalledWith(0.1, 'Validating image...');
      expect(mockOnProgress).toHaveBeenCalledWith(0.3, 'Preparing image for analysis...');
      expect(mockOnProgress).toHaveBeenCalledWith(0.5, 'Analyzing plant health...');
      expect(mockOnProgress).toHaveBeenCalledWith(0.8, 'Processing results...');
      expect(mockOnProgress).toHaveBeenCalledWith(1.0, 'Complete!');
    });

    it('handles image validation failure', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
      } as Response);

      const result = await scanService.performScan(mockImageUri);

      expect(result.error).toBeDefined();
      expect(result.result).toBeUndefined();
      expect(result.error?.message).toContain('Image file is not accessible');
    });

    it('handles API service failure', async () => {
      mockImageUploadService.analyzeImage.mockRejectedValue(
        new Error('Network error')
      );

      const result = await scanService.performScan(mockImageUri);

      expect(result.error).toBeDefined();
      expect(result.result).toBeUndefined();
      expect(result.error?.retryable).toBe(true);
    });

    it('handles empty image URI', async () => {
      const result = await scanService.performScan('');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('No image provided');
    });

    it('creates scan result with default tips for healthy plants', async () => {
      const responseWithoutTips: APIResponse = {
        status: 'healthy',
        confidence: 0.9,
      };
      mockImageUploadService.analyzeImage.mockResolvedValue(responseWithoutTips);

      const result = await scanService.performScan(mockImageUri);

      expect(result.result?.tips).toBeDefined();
      expect(result.result?.tips).toContain('Your plant looks healthy! Continue current care routine.');
    });

    it('creates scan result with default tips for diseased plants', async () => {
      const responseWithoutTips: APIResponse = {
        status: 'diseased',
        confidence: 0.8,
      };
      mockImageUploadService.analyzeImage.mockResolvedValue(responseWithoutTips);

      const result = await scanService.performScan(mockImageUri);

      expect(result.result?.tips).toBeDefined();
      expect(result.result?.tips).toContain('Consider adjusting watering schedule - overwatering is a common cause of plant diseases.');
    });
  });

  describe('cancelCurrentScan', () => {
    it('cancels current scan operation', () => {
      // This is mainly for coverage, as the actual cancellation logic
      // would need more complex implementation with AbortController
      expect(() => scanService.cancelCurrentScan()).not.toThrow();
    });
  });
});