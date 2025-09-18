import { performanceManager, formatBytes, formatDuration } from '../performanceUtils';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock FileSystem
jest.mock('expo-file-system', () => ({
  cacheDirectory: '/cache/',
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: false })),
  readDirectoryAsync: jest.fn(() => Promise.resolve([])),
  deleteAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
}));

// Mock AppState
jest.mock('react-native', () => ({
  AppState: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

describe('PerformanceUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatBytes(1536)).toBe('1.5 KB');
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(formatDuration(1000)).toBe('1s');
      expect(formatDuration(60000)).toBe('1m 0s');
      expect(formatDuration(3600000)).toBe('1h 0m');
      expect(formatDuration(86400000)).toBe('1d 0h');
      expect(formatDuration(90000)).toBe('1m 30s');
    });
  });

  describe('PerformanceManager', () => {
    it('should initialize with default metrics', () => {
      const metrics = performanceManager.getMetrics();
      
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('cacheSize');
      expect(metrics).toHaveProperty('historyCount');
      expect(metrics).toHaveProperty('lastCleanup');
      expect(metrics).toHaveProperty('appStartTime');
    });

    it('should update metrics', async () => {
      const initialMetrics = performanceManager.getMetrics();
      const updatedMetrics = await performanceManager.updateMetrics();
      
      expect(updatedMetrics).toHaveProperty('memoryUsage');
      expect(updatedMetrics).toHaveProperty('cacheSize');
      expect(updatedMetrics).toHaveProperty('historyCount');
    });

    it('should perform background cleanup', async () => {
      await expect(performanceManager.performBackgroundCleanup()).resolves.not.toThrow();
    });

    it('should generate performance report', async () => {
      const report = await performanceManager.getPerformanceReport();
      
      expect(report).toHaveProperty('metrics');
      expect(report).toHaveProperty('cacheStats');
      expect(report).toHaveProperty('recommendations');
      expect(Array.isArray(report.recommendations)).toBe(true);
    });

    it('should stop periodic cleanup', () => {
      expect(() => performanceManager.stopPeriodicCleanup()).not.toThrow();
    });
  });
});