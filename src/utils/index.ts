/**
 * Utility functions for Plantis app
 */

// Image utilities
export {
  compressImage,
  validateImage,
  calculateOptimalQuality,
  getImageDimensions,
  formatFileSize,
  type ImageCompressionOptions,
  type ImageValidationResult,
} from './imageUtils';

// Storage utilities
export {
  saveScanResult,
  getScanHistory,
  getScanResultById,
  deleteScanResult,
  clearScanHistory,
  getScanHistoryCount,
  saveUserPreferences,
  getUserPreferences,
  isFirstTimeUser,
  markOnboardingComplete,
  getStorageStats,
} from './storageUtils';

// ID utilities
export {
  generateUniqueId,
  generateUUID,
  generateShortId,
} from './idUtils';

// Responsive utilities
export {
  responsive,
  responsiveStyles,
  getDeviceType,
  BREAKPOINTS,
} from './responsive';

// Performance utilities
export {
  performanceManager,
  formatBytes,
  formatDuration,
  type PerformanceMetrics,
  type CacheStats,
} from './performanceUtils';

// Image cache utilities
export {
  imageCacheManager,
  preloadThumbnails,
  getCachedThumbnail,
  type CachedImage,
  type CacheOptions,
} from './imageCacheUtils';

// Memory utilities
export {
  memoryManager,
  optimizeImageProcessing,
  batchProcessImages,
  type MemoryStats,
  type ProcessingOptions,
} from './memoryUtils';