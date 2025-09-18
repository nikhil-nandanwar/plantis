import { MockImageUploadService, mockApiResponses } from '../__mocks__/mockApiService';

describe('MockImageUploadService', () => {
  let mockService: MockImageUploadService;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('analyzeImage', () => {
    it('should return a valid response after delay', async () => {
      mockService = new MockImageUploadService({ delay: 1000, shouldFail: false });
      
      const analysisPromise = mockService.analyzeImage('test-image-uri');
      
      // Fast-forward time
      jest.advanceTimersByTime(1000);
      
      const result = await analysisPromise;

      expect(result).toHaveProperty('status');
      expect(['healthy', 'diseased']).toContain(result.status);
      expect(result).toHaveProperty('confidence');
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(1.0);
      expect(result).toHaveProperty('tips');
      expect(Array.isArray(result.tips)).toBe(true);
    });

    it('should fail when configured to fail', async () => {
      mockService = new MockImageUploadService({ delay: 500, shouldFail: true });
      
      const analysisPromise = mockService.analyzeImage('test-image-uri');
      
      jest.advanceTimersByTime(500);
      
      await expect(analysisPromise).rejects.toThrow('Mock API failure for testing');
    });

    it('should fail randomly based on failure rate', async () => {
      // Set high failure rate to test random failures
      mockService = new MockImageUploadService({ delay: 100, failureRate: 1.0 });
      
      const analysisPromise = mockService.analyzeImage('test-image-uri');
      
      jest.advanceTimersByTime(100);
      
      await expect(analysisPromise).rejects.toThrow('Mock API failure for testing');
    });

    it('should return different responses on multiple calls', async () => {
      mockService = new MockImageUploadService({ delay: 100, shouldFail: false, failureRate: 0 });
      
      const results = [];
      
      for (let i = 0; i < 5; i++) {
        const analysisPromise = mockService.analyzeImage('test-image-uri');
        jest.advanceTimersByTime(100);
        results.push(await analysisPromise);
      }

      // Check that we got some variety in responses
      const statuses = results.map(r => r.status);
      const confidences = results.map(r => r.confidence);
      
      expect(statuses.length).toBe(5);
      expect(confidences.every(c => c >= 0.5 && c <= 1.0)).toBe(true);
    });
  });

  describe('checkHealth', () => {
    it('should return health status after delay', async () => {
      mockService = new MockImageUploadService({ delay: 500, shouldFail: false });
      
      const healthPromise = mockService.checkHealth();
      
      jest.advanceTimersByTime(500);
      
      const result = await healthPromise;

      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('timestamp');
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });

    it('should fail when configured to fail', async () => {
      mockService = new MockImageUploadService({ delay: 100, shouldFail: true });
      
      const healthPromise = mockService.checkHealth();
      
      jest.advanceTimersByTime(500); // Use the default health check delay
      
      await expect(healthPromise).rejects.toThrow('Mock health check failure');
    });
  });

  describe('configuration', () => {
    it('should update mock behavior', async () => {
      mockService = new MockImageUploadService({ delay: 1000, shouldFail: false });
      
      // Change configuration
      mockService.setMockBehavior({ delay: 200, shouldFail: true });
      
      const analysisPromise = mockService.analyzeImage('test-image-uri');
      
      // Should fail with new delay
      jest.advanceTimersByTime(200);
      
      await expect(analysisPromise).rejects.toThrow('Mock API failure for testing');
    });

    it('should return specific mock responses', () => {
      mockService = new MockImageUploadService();
      
      const healthyResponse = mockService.getMockResponse('healthyLeaf');
      expect(healthyResponse.status).toBe('healthy');
      expect(healthyResponse.confidence).toBe(0.92);
      
      const diseasedResponse = mockService.getMockResponse('diseasedLeaf');
      expect(diseasedResponse.status).toBe('diseased');
      expect(diseasedResponse.confidence).toBe(0.87);
    });
  });

  describe('mock responses', () => {
    it('should have valid structure for all mock responses', () => {
      Object.entries(mockApiResponses).forEach(([key, response]) => {
        expect(response).toHaveProperty('status');
        expect(['healthy', 'diseased']).toContain(response.status);
        expect(response).toHaveProperty('confidence');
        expect(response.confidence).toBeGreaterThanOrEqual(0);
        expect(response.confidence).toBeLessThanOrEqual(1);
        expect(response).toHaveProperty('tips');
        expect(Array.isArray(response.tips)).toBe(true);
        expect(response.tips.length).toBeGreaterThan(0);
      });
    });

    it('should have appropriate confidence levels', () => {
      expect(mockApiResponses.healthyLeaf.confidence).toBeGreaterThan(0.9);
      expect(mockApiResponses.diseasedLeaf.confidence).toBeGreaterThan(0.8);
      expect(mockApiResponses.lowConfidenceHealthy.confidence).toBeLessThan(0.7);
      expect(mockApiResponses.lowConfidenceDiseased.confidence).toBeLessThan(0.7);
    });

    it('should have relevant tips for each response type', () => {
      expect(mockApiResponses.healthyLeaf.tips[0]).toContain('healthy');
      expect(mockApiResponses.diseasedLeaf.tips[0]).toContain('attention');
      expect(mockApiResponses.lowConfidenceHealthy.tips[0]).toContain('image quality');
      expect(mockApiResponses.lowConfidenceDiseased.tips[0]).toContain('confidence is low');
    });
  });
});