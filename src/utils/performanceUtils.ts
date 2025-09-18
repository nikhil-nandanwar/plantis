import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Performance monitoring and optimization utilities
 */

export interface PerformanceMetrics {
  memoryUsage: number;
  cacheSize: number;
  historyCount: number;
  lastCleanup: Date;
  appStartTime: Date;
}

export interface CacheStats {
  totalSize: number;
  itemCount: number;
  oldestItem: Date | null;
  newestItem: Date | null;
}

class PerformanceManager {
  private static instance: PerformanceManager;
  private metrics: PerformanceMetrics;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private memoryWarningThreshold = 100 * 1024 * 1024; // 100MB
  private appStateSubscription: any = null;

  private constructor() {
    this.metrics = {
      memoryUsage: 0,
      cacheSize: 0,
      historyCount: 0,
      lastCleanup: new Date(),
      appStartTime: new Date(),
    };
    this.initializePerformanceMonitoring();
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Monitor app state changes for cleanup
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );

    // Start periodic cleanup
    this.startPeriodicCleanup();
  }

  /**
   * Handle app state changes for background cleanup
   */
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (nextAppState === 'background') {
      this.performBackgroundCleanup();
    } else if (nextAppState === 'active') {
      this.updateMetrics();
    }
  }

  /**
   * Start periodic cleanup tasks
   */
  private startPeriodicCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.performPeriodicCleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Stop periodic cleanup
   */
  public stopPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  /**
   * Update performance metrics
   */
  public async updateMetrics(): Promise<PerformanceMetrics> {
    try {
      const cacheStats = await this.getCacheStats();
      const historyCount = await this.getHistoryCount();

      this.metrics = {
        ...this.metrics,
        cacheSize: cacheStats.totalSize,
        historyCount,
        memoryUsage: await this.estimateMemoryUsage(),
      };

      return this.metrics;
    } catch (error) {
      console.error('Failed to update performance metrics:', error);
      return this.metrics;
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Estimate current memory usage
   */
  private async estimateMemoryUsage(): Promise<number> {
    try {
      // This is an estimation based on cache and storage usage
      const cacheStats = await this.getCacheStats();
      const storageData = await AsyncStorage.getAllKeys();
      
      let totalSize = cacheStats.totalSize;
      
      // Estimate AsyncStorage usage
      for (const key of storageData) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length * 2; // Rough estimate for UTF-16
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to estimate memory usage:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  private async getCacheStats(): Promise<CacheStats> {
    try {
      const cacheDir = `${FileSystem.cacheDirectory}images/`;
      const cacheExists = await FileSystem.getInfoAsync(cacheDir);
      
      if (!cacheExists.exists) {
        return {
          totalSize: 0,
          itemCount: 0,
          oldestItem: null,
          newestItem: null,
        };
      }

      const files = await FileSystem.readDirectoryAsync(cacheDir);
      let totalSize = 0;
      let oldestItem: Date | null = null;
      let newestItem: Date | null = null;

      for (const file of files) {
        const filePath = `${cacheDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
          
          const modificationTime = new Date(fileInfo.modificationTime || 0);
          if (!oldestItem || modificationTime < oldestItem) {
            oldestItem = modificationTime;
          }
          if (!newestItem || modificationTime > newestItem) {
            newestItem = modificationTime;
          }
        }
      }

      return {
        totalSize,
        itemCount: files.length,
        oldestItem,
        newestItem,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalSize: 0,
        itemCount: 0,
        oldestItem: null,
        newestItem: null,
      };
    }
  }

  /**
   * Get history count from storage
   */
  private async getHistoryCount(): Promise<number> {
    try {
      const historyData = await AsyncStorage.getItem('@plantis_scan_history');
      if (!historyData) return 0;
      
      const history = JSON.parse(historyData);
      return Array.isArray(history) ? history.length : 0;
    } catch (error) {
      console.error('Failed to get history count:', error);
      return 0;
    }
  }

  /**
   * Perform background cleanup when app goes to background
   */
  public async performBackgroundCleanup(): Promise<void> {
    try {
      console.log('Performing background cleanup...');
      
      // Clear temporary files
      await this.clearTemporaryFiles();
      
      // Clean old cache entries
      await this.cleanOldCacheEntries();
      
      // Update metrics
      await this.updateMetrics();
      
      this.metrics.lastCleanup = new Date();
      console.log('Background cleanup completed');
    } catch (error) {
      console.error('Background cleanup failed:', error);
    }
  }

  /**
   * Perform periodic cleanup tasks
   */
  public async performPeriodicCleanup(): Promise<void> {
    try {
      const metrics = await this.updateMetrics();
      
      // Check if cleanup is needed
      if (this.shouldPerformCleanup(metrics)) {
        console.log('Performing periodic cleanup...');
        
        await this.cleanOldCacheEntries();
        await this.optimizeStorage();
        
        this.metrics.lastCleanup = new Date();
        console.log('Periodic cleanup completed');
      }
    } catch (error) {
      console.error('Periodic cleanup failed:', error);
    }
  }

  /**
   * Check if cleanup should be performed
   */
  private shouldPerformCleanup(metrics: PerformanceMetrics): boolean {
    const timeSinceLastCleanup = Date.now() - metrics.lastCleanup.getTime();
    const oneHour = 60 * 60 * 1000;
    
    return (
      timeSinceLastCleanup > oneHour ||
      metrics.cacheSize > 50 * 1024 * 1024 || // 50MB cache limit
      metrics.memoryUsage > this.memoryWarningThreshold
    );
  }

  /**
   * Clear temporary files
   */
  private async clearTemporaryFiles(): Promise<void> {
    try {
      const tempDir = `${FileSystem.cacheDirectory}temp/`;
      const tempExists = await FileSystem.getInfoAsync(tempDir);
      
      if (tempExists.exists) {
        await FileSystem.deleteAsync(tempDir, { idempotent: true });
        await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to clear temporary files:', error);
    }
  }

  /**
   * Clean old cache entries
   */
  private async cleanOldCacheEntries(): Promise<void> {
    try {
      const cacheDir = `${FileSystem.cacheDirectory}images/`;
      const cacheExists = await FileSystem.getInfoAsync(cacheDir);
      
      if (!cacheExists.exists) return;

      const files = await FileSystem.readDirectoryAsync(cacheDir);
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      for (const file of files) {
        const filePath = `${cacheDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        if (fileInfo.exists && fileInfo.modificationTime) {
          const age = now - fileInfo.modificationTime;
          if (age > maxAge) {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
          }
        }
      }
    } catch (error) {
      console.error('Failed to clean old cache entries:', error);
    }
  }

  /**
   * Optimize storage by removing redundant data
   */
  private async optimizeStorage(): Promise<void> {
    try {
      // Clean up AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove: string[] = [];
      
      for (const key of keys) {
        if (key.startsWith('@plantis_temp_') || key.startsWith('@plantis_cache_')) {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            try {
              const data = JSON.parse(value);
              if (data.timestamp && Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
                keysToRemove.push(key);
              }
            } catch {
              // Invalid JSON, remove it
              keysToRemove.push(key);
            }
          }
        }
      }
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        console.log(`Removed ${keysToRemove.length} expired storage entries`);
      }
    } catch (error) {
      console.error('Failed to optimize storage:', error);
    }
  }

  /**
   * Force garbage collection (if available)
   */
  public forceGarbageCollection(): void {
    try {
      // In React Native, we can't directly trigger GC, but we can help by clearing references
      if (global.gc) {
        global.gc();
      }
    } catch (error) {
      // GC not available, ignore
    }
  }

  /**
   * Get performance report
   */
  public async getPerformanceReport(): Promise<{
    metrics: PerformanceMetrics;
    cacheStats: CacheStats;
    recommendations: string[];
  }> {
    const metrics = await this.updateMetrics();
    const cacheStats = await this.getCacheStats();
    const recommendations: string[] = [];

    // Generate recommendations
    if (metrics.cacheSize > 50 * 1024 * 1024) {
      recommendations.push('Cache size is large. Consider clearing old cached images.');
    }
    
    if (metrics.historyCount > 100) {
      recommendations.push('History has many items. Consider archiving old scan results.');
    }
    
    if (metrics.memoryUsage > this.memoryWarningThreshold) {
      recommendations.push('Memory usage is high. Consider restarting the app.');
    }

    const timeSinceLastCleanup = Date.now() - metrics.lastCleanup.getTime();
    if (timeSinceLastCleanup > 24 * 60 * 60 * 1000) {
      recommendations.push('Last cleanup was over 24 hours ago. Consider running cleanup.');
    }

    return {
      metrics,
      cacheStats,
      recommendations,
    };
  }
}

// Export singleton instance
export const performanceManager = PerformanceManager.getInstance();

// Utility functions
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};