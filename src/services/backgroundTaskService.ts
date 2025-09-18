import { AppState, AppStateStatus } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { performanceManager } from '../utils/performanceUtils';
import { imageCacheManager } from '../utils/imageCacheUtils';
import { memoryManager } from '../utils/memoryUtils';
import { historyService } from './historyService';

/**
 * Background task service for performance optimization and cleanup
 */

const BACKGROUND_CLEANUP_TASK = 'background-cleanup-task';
const BACKGROUND_FETCH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export interface BackgroundTaskConfig {
  enablePeriodicCleanup: boolean;
  enableMemoryOptimization: boolean;
  enableCacheOptimization: boolean;
  cleanupInterval: number;
}

class BackgroundTaskService {
  private static instance: BackgroundTaskService;
  private isInitialized = false;
  private appStateSubscription: any = null;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private config: BackgroundTaskConfig = {
    enablePeriodicCleanup: true,
    enableMemoryOptimization: true,
    enableCacheOptimization: true,
    cleanupInterval: 30 * 60 * 1000, // 30 minutes
  };

  private constructor() {}

  static getInstance(): BackgroundTaskService {
    if (!BackgroundTaskService.instance) {
      BackgroundTaskService.instance = new BackgroundTaskService();
    }
    return BackgroundTaskService.instance;
  }

  /**
   * Initialize background task service
   */
  public async initialize(config?: Partial<BackgroundTaskConfig>): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Update configuration
      if (config) {
        this.config = { ...this.config, ...config };
      }

      // Register background task
      await this.registerBackgroundTask();

      // Set up app state monitoring
      this.setupAppStateMonitoring();

      // Start periodic cleanup if enabled
      if (this.config.enablePeriodicCleanup) {
        this.startPeriodicCleanup();
      }

      this.isInitialized = true;
      console.log('Background task service initialized');
    } catch (error) {
      console.error('Failed to initialize background task service:', error);
    }
  }

  /**
   * Register background fetch task
   */
  private async registerBackgroundTask(): Promise<void> {
    try {
      // Define the background task
      TaskManager.defineTask(BACKGROUND_CLEANUP_TASK, async () => {
        try {
          console.log('Running background cleanup task...');
          await this.performBackgroundCleanup();
          return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (error) {
          console.error('Background cleanup task failed:', error);
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }
      });

      // Register background fetch
      const status = await BackgroundFetch.getStatusAsync();
      if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_CLEANUP_TASK, {
          minimumInterval: BACKGROUND_FETCH_INTERVAL,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log('Background fetch registered successfully');
      } else {
        console.warn('Background fetch not available:', status);
      }
    } catch (error) {
      console.error('Failed to register background task:', error);
    }
  }

  /**
   * Set up app state monitoring
   */
  private setupAppStateMonitoring(): void {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );
  }

  /**
   * Handle app state changes
   */
  private async handleAppStateChange(nextAppState: AppStateStatus): Promise<void> {
    if (nextAppState === 'background') {
      console.log('App went to background, performing cleanup...');
      await this.performBackgroundCleanup();
    } else if (nextAppState === 'active') {
      console.log('App became active, updating performance metrics...');
      await performanceManager.updateMetrics();
    }
  }

  /**
   * Start periodic cleanup
   */
  private startPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(async () => {
      try {
        console.log('Running periodic cleanup...');
        await this.performPeriodicCleanup();
      } catch (error) {
        console.error('Periodic cleanup failed:', error);
      }
    }, this.config.cleanupInterval);
  }

  /**
   * Perform background cleanup tasks
   */
  public async performBackgroundCleanup(): Promise<void> {
    try {
      const tasks: Promise<any>[] = [];

      // Performance manager cleanup
      tasks.push(performanceManager.performBackgroundCleanup());

      // Memory optimization
      if (this.config.enableMemoryOptimization) {
        tasks.push(memoryManager.performMemoryCleanup());
      }

      // Cache optimization
      if (this.config.enableCacheOptimization) {
        tasks.push(imageCacheManager.clearExpiredCache());
      }

      // History cleanup
      tasks.push(historyService.performCleanup());

      await Promise.allSettled(tasks);
      console.log('Background cleanup completed');
    } catch (error) {
      console.error('Background cleanup failed:', error);
    }
  }

  /**
   * Perform periodic cleanup (less aggressive than background cleanup)
   */
  public async performPeriodicCleanup(): Promise<void> {
    try {
      const memoryStats = await memoryManager.getMemoryStats();
      const cacheStats = await imageCacheManager.getCacheStats();

      // Only perform cleanup if needed
      const needsCleanup = 
        memoryStats.estimatedUsage > 50 * 1024 * 1024 || // 50MB
        cacheStats.totalSize > 30 * 1024 * 1024; // 30MB

      if (needsCleanup) {
        console.log('Performing needed periodic cleanup...');
        
        const tasks: Promise<any>[] = [];

        // Clear expired cache
        tasks.push(imageCacheManager.clearExpiredCache());

        // Optimize cache if too large
        if (cacheStats.totalSize > 50 * 1024 * 1024) {
          tasks.push(imageCacheManager.optimizeCache(30 * 1024 * 1024));
        }

        // Memory cleanup if usage is high
        if (memoryStats.estimatedUsage > 50 * 1024 * 1024) {
          tasks.push(memoryManager.performMemoryCleanup());
        }

        await Promise.allSettled(tasks);
        console.log('Periodic cleanup completed');
      }
    } catch (error) {
      console.error('Periodic cleanup failed:', error);
    }
  }

  /**
   * Force immediate cleanup
   */
  public async forceCleanup(): Promise<void> {
    console.log('Forcing immediate cleanup...');
    await this.performBackgroundCleanup();
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<BackgroundTaskConfig>): void {
    this.config = { ...this.config, ...config };

    // Restart periodic cleanup with new interval
    if (this.config.enablePeriodicCleanup && this.cleanupInterval) {
      this.startPeriodicCleanup();
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): BackgroundTaskConfig {
    return { ...this.config };
  }

  /**
   * Get service status
   */
  public async getStatus(): Promise<{
    isInitialized: boolean;
    backgroundFetchStatus: string;
    lastCleanup: Date | null;
    config: BackgroundTaskConfig;
  }> {
    let backgroundFetchStatus = 'Unknown';
    try {
      const status = await BackgroundFetch.getStatusAsync();
      backgroundFetchStatus = this.getBackgroundFetchStatusString(status);
    } catch (error) {
      backgroundFetchStatus = 'Error';
    }

    const metrics = performanceManager.getMetrics();

    return {
      isInitialized: this.isInitialized,
      backgroundFetchStatus,
      lastCleanup: metrics.lastCleanup,
      config: this.config,
    };
  }

  /**
   * Convert background fetch status to string
   */
  private getBackgroundFetchStatusString(status: BackgroundFetch.BackgroundFetchStatus): string {
    switch (status) {
      case BackgroundFetch.BackgroundFetchStatus.Available:
        return 'Available';
      case BackgroundFetch.BackgroundFetchStatus.Denied:
        return 'Denied';
      case BackgroundFetch.BackgroundFetchStatus.Restricted:
        return 'Restricted';
      default:
        return 'Unknown';
    }
  }

  /**
   * Stop background tasks and cleanup
   */
  public async stop(): Promise<void> {
    try {
      // Unregister background fetch
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_CLEANUP_TASK);

      // Clear periodic cleanup
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }

      // Remove app state listener
      if (this.appStateSubscription) {
        this.appStateSubscription.remove();
        this.appStateSubscription = null;
      }

      // Stop performance manager
      performanceManager.stopPeriodicCleanup();

      // Cleanup memory manager
      memoryManager.cleanup();

      this.isInitialized = false;
      console.log('Background task service stopped');
    } catch (error) {
      console.error('Failed to stop background task service:', error);
    }
  }
}

// Export singleton instance
export const backgroundTaskService = BackgroundTaskService.getInstance();

// Utility functions
export const initializeBackgroundTasks = async (config?: Partial<BackgroundTaskConfig>): Promise<void> => {
  await backgroundTaskService.initialize(config);
};

export const performImmediateCleanup = async (): Promise<void> => {
  await backgroundTaskService.forceCleanup();
};