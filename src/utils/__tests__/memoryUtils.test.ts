import { memoryManager, optimizeImageProcessing, batchProcessImages } from '../memoryUtils';

// Mock FileSystem
jest.mock('expo-file-system', () => ({
  cacheDirectory: '/cache/',
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: false })),
  readDirectoryAsync: jest.fn(() => Promise.resolve([])),
  deleteAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
}));

// Mock AppState
jest.mock('react-native', () => ({
  AppState: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

describe('MemoryUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('MemoryManager', () => {
    it('should configure memory management options', () => {
      expect(() => {
        memoryManager.configure({
          maxConcurrentOperations: 3,
          memoryThreshold: 100 * 1024 * 1024,
        });
      }).not.toThrow();
    });

    it('should queue operations', async () => {
      const mockOperation = jest.fn(() => Promise.resolve('result'));
      const result = await memoryManager.queueOperation(mockOperation);
      
      expect(mockOperation).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should create temp file', async () => {
      const tempPath = await memoryManager.createTempFile('test data');
      expect(typeof tempPath).toBe('string');
      expect(tempPath).toContain('temp_');
    });

    it('should cleanup temp file', async () => {
      const tempPath = await memoryManager.createTempFile('test data');
      await expect(memoryManager.cleanupTempFile(tempPath)).resolves.not.toThrow();
    });

    it('should cleanup all temp files', async () => {
      const cleanedCount = await memoryManager.cleanupAllTempFiles();
      expect(typeof cleanedCount).toBe('number');
    });

    it('should optimize image processing', async () => {
      const mockProcessor = jest.fn(() => Promise.resolve('processed'));
      const result = await memoryManager.optimizeImageProcessing(
        'test-uri',
        mockProcessor
      );
      
      expect(mockProcessor).toHaveBeenCalledWith('test-uri');
      expect(result).toBe('processed');
    });

    it('should batch process images', async () => {
      const mockProcessor = jest.fn((uri) => Promise.resolve(`processed-${uri}`));
      const uris = ['uri1', 'uri2', 'uri3'];
      
      const results = await memoryManager.batchProcessImages(uris, mockProcessor, 2);
      
      expect(results).toHaveLength(3);
      expect(results).toContain('processed-uri1');
      expect(results).toContain('processed-uri2');
      expect(results).toContain('processed-uri3');
    });

    it('should perform memory cleanup', async () => {
      await expect(memoryManager.performMemoryCleanup()).resolves.not.toThrow();
    });

    it('should get memory stats', async () => {
      const stats = await memoryManager.getMemoryStats();
      
      expect(stats).toHaveProperty('estimatedUsage');
      expect(stats).toHaveProperty('cacheSize');
      expect(stats).toHaveProperty('tempFileSize');
      expect(stats).toHaveProperty('timestamp');
    });

    it('should check memory usage acceptability', async () => {
      const isAcceptable = await memoryManager.isMemoryUsageAcceptable();
      expect(typeof isAcceptable).toBe('boolean');
    });

    it('should get queue status', () => {
      const status = memoryManager.getQueueStatus();
      
      expect(status).toHaveProperty('queueLength');
      expect(status).toHaveProperty('activeOperations');
      expect(status).toHaveProperty('maxConcurrentOperations');
    });

    it('should cleanup resources', () => {
      expect(() => memoryManager.cleanup()).not.toThrow();
    });
  });

  describe('Utility functions', () => {
    it('should optimize image processing', async () => {
      const mockProcessor = jest.fn(() => Promise.resolve('result'));
      const result = await optimizeImageProcessing('test-uri', mockProcessor);
      
      expect(mockProcessor).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should batch process images', async () => {
      const mockProcessor = jest.fn((uri) => Promise.resolve(`processed-${uri}`));
      const uris = ['uri1', 'uri2'];
      
      const results = await batchProcessImages(uris, mockProcessor);
      
      expect(results).toHaveLength(2);
      expect(mockProcessor).toHaveBeenCalledTimes(2);
    });
  });
});