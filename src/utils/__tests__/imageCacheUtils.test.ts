import { imageCacheManager, getCachedThumbnail, preloadThumbnails } from '../imageCacheUtils';

// Mock FileSystem
jest.mock('expo-file-system', () => ({
  cacheDirectory: '/cache/',
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: false })),
  readDirectoryAsync: jest.fn(() => Promise.resolve([])),
  deleteAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  moveAsync: jest.fn(),
  downloadAsync: jest.fn(() => Promise.resolve({ uri: '/cache/downloaded.jpg' })),
}));

// Mock Crypto
jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(() => Promise.resolve('mock-hash')),
  CryptoDigestAlgorithm: {
    MD5: 'md5',
  },
}));

// Mock ImageManipulator
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(() => Promise.resolve({ uri: '/cache/processed.jpg' })),
  SaveFormat: {
    JPEG: 'jpeg',
  },
}));

describe('ImageCacheUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ImageCacheManager', () => {
    it('should check if image is cached', async () => {
      const isCached = await imageCacheManager.isCached('test-uri');
      expect(typeof isCached).toBe('boolean');
    });

    it('should get cached image', async () => {
      const cachedImage = await imageCacheManager.getCachedImage('test-uri');
      expect(cachedImage).toBeNull(); // Since mock returns exists: false
    });

    it('should cache image', async () => {
      const cachedPath = await imageCacheManager.cacheImage('test-uri');
      expect(typeof cachedPath).toBe('string');
    });

    it('should get thumbnail', async () => {
      const thumbnail = await imageCacheManager.getThumbnail('test-uri');
      expect(typeof thumbnail).toBe('string');
    });

    it('should preload images', async () => {
      const uris = ['uri1', 'uri2', 'uri3'];
      await expect(imageCacheManager.preloadImages(uris)).resolves.not.toThrow();
    });

    it('should clear expired cache', async () => {
      const clearedCount = await imageCacheManager.clearExpiredCache();
      expect(typeof clearedCount).toBe('number');
    });

    it('should get cache stats', async () => {
      const stats = await imageCacheManager.getCacheStats();
      
      expect(stats).toHaveProperty('totalSize');
      expect(stats).toHaveProperty('fileCount');
      expect(stats).toHaveProperty('oldestFile');
      expect(stats).toHaveProperty('newestFile');
    });

    it('should optimize cache', async () => {
      const removedCount = await imageCacheManager.optimizeCache();
      expect(typeof removedCount).toBe('number');
    });

    it('should clear all cache', async () => {
      await expect(imageCacheManager.clearAllCache()).resolves.not.toThrow();
    });
  });

  describe('Utility functions', () => {
    it('should get cached thumbnail', async () => {
      const thumbnail = await getCachedThumbnail('test-uri');
      expect(typeof thumbnail).toBe('string');
    });

    it('should preload thumbnails', async () => {
      const uris = ['uri1', 'uri2'];
      await expect(preloadThumbnails(uris)).resolves.not.toThrow();
    });
  });
});