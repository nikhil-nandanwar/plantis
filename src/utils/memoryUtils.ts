import { AppState, AppStateStatus } from 'react-native';
import * as FileSystem from 'expo-file-system';

/**
 * Memory optimization utilities for efficient image processing and resource management
 */

export interface MemoryStats {
  estimatedUsage: number;
  cacheSize: number;
  tempFileSize: number;
  timestamp: Date;
}

export interface ProcessingOptions {
  maxConcurrentOperations?: number;
  memoryThreshold?: number;
  enableGarbageCollection?: boolean;
  cleanupAfterProcessing?: boolean;
}

class MemoryManager {
  private static instance: MemoryManager;
  private processingQueue: Array<() => Promise<any>> = [];
  private activeOperations = 0;
  private maxConcurrentOperations = 2;
  private memoryThreshold = 50 * 1024 * 1024; // 50MB
  private tempFiles: Set<string> = new Set();
  private appStateSubscription: any = null;

  private constructor() {
    this.initializeMemoryManagement();
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Initialize memory management
   */
  private initializeMemoryManagement(): void {
    // Monitor app state for cleanup
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );
  }

  /**
   * Handle app state changes
   */
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (nextAppState === 'background') {
      this.performMemoryCleanup();
    }
  }

  /**
   * Configure memory management options
   */
  public configure(options: ProcessingOptions): void {
    if (options.maxConcurrentOperations) {
      this.maxConcurrentOperations = options.maxConcurrentOperations;
    }
    if (options.memoryThreshold) {
      this.memoryThreshold = options.memoryThreshold;
    }
  }

  /**
   * Queue an image processing operation
   */
  public async queueOperation<T>(
    operation: () => Promise<T>,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedOperation = async () => {
        try {
          this.activeOperations++;
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeOperations--;
          this.processQueue();
        }
      };

      if (priority === 'high') {
        this.processingQueue.unshift(wrappedOperation);
      } else {
        this.processingQueue.push(wrappedOperation);
      }

      this.processQueue();
    });
  }

  /**
   * Process the operation queue
   */
  private processQueue(): void {
    while (
      this.activeOperations < this.maxConcurrentOperations &&
      this.processingQueue.length > 0
    ) {
      const operation = this.processingQueue.shift();
      if (operation) {
        operation();
      }
    }
  }

  /**
   * Create a temporary file and track it for cleanup
   */
  public async createTempFile(
    data: string | ArrayBuffer,
    extension: string = '.tmp'
  ): Promise<string> {
    const tempDir = `${FileSystem.cacheDirectory}temp/`;
    
    // Ensure temp directory exists
    const dirInfo = await FileSystem.getInfoAsync(tempDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
    }

    const fileName = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${extension}`;
    const filePath = `${tempDir}${fileName}`;

    if (typeof data === 'string') {
      await FileSystem.writeAsStringAsync(filePath, data);
    } else {
      // For ArrayBuffer, we need to convert to base64
      const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
      await FileSystem.writeAsStringAsync(filePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    this.tempFiles.add(filePath);
    return filePath;
  }

  /**
   * Clean up a specific temporary file
   */
  public async cleanupTempFile(filePath: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      }
      this.tempFiles.delete(filePath);
    } catch (error) {
      console.warn('Failed to cleanup temp file:', filePath, error);
    }
  }

  /**
   * Clean up all temporary files
   */
  public async cleanupAllTempFiles(): Promise<number> {
    let cleanedCount = 0;
    const tempFilesArray = Array.from(this.tempFiles);

    for (const filePath of tempFilesArray) {
      try {
        await this.cleanupTempFile(filePath);
        cleanedCount++;
      } catch (error) {
        console.warn('Failed to cleanup temp file:', filePath, error);
      }
    }

    // Also clean the entire temp directory
    try {
      const tempDir = `${FileSystem.cacheDirectory}temp/`;
      const dirInfo = await FileSystem.getInfoAsync(tempDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(tempDir, { idempotent: true });
        await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
      }
    } catch (error) {
      console.warn('Failed to clean temp directory:', error);
    }

    this.tempFiles.clear();
    return cleanedCount;
  }

  /**
   * Optimize image processing with memory constraints
   */
  public async optimizeImageProcessing<T>(
    imageUri: string,
    processor: (uri: string) => Promise<T>,
    options: ProcessingOptions = {}
  ): Promise<T> {
    const {
      enableGarbageCollection = true,
      cleanupAfterProcessing = true,
    } = options;

    try {
      // Check memory before processing
      const memoryStats = await this.getMemoryStats();
      if (memoryStats.estimatedUsage > this.memoryThreshold) {
        await this.performMemoryCleanup();
      }

      // Queue the processing operation
      const result = await this.queueOperation(
        () => processor(imageUri),
        'high'
      );

      // Cleanup after processing
      if (cleanupAfterProcessing) {
        await this.performMemoryCleanup();
      }

      // Force garbage collection if enabled
      if (enableGarbageCollection) {
        this.forceGarbageCollection();
      }

      return result;
    } catch (error) {
      // Ensure cleanup even on error
      if (cleanupAfterProcessing) {
        await this.performMemoryCleanup();
      }
      throw error;
    }
  }

  /**
   * Batch process images with memory optimization
   */
  public async batchProcessImages<T>(
    imageUris: string[],
    processor: (uri: string) => Promise<T>,
    batchSize: number = 3
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < imageUris.length; i += batchSize) {
      const batch = imageUris.slice(i, i + batchSize);
      
      // Process batch
      const batchPromises = batch.map(uri =>
        this.optimizeImageProcessing(uri, processor)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Collect successful results
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.warn('Batch processing failed for item:', result.reason);
        }
      });

      // Cleanup between batches
      if (i + batchSize < imageUris.length) {
        await this.performMemoryCleanup();
        
        // Small delay to allow memory to stabilize
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Perform comprehensive memory cleanup
   */
  public async performMemoryCleanup(): Promise<void> {
    try {
      // Clean temporary files
      await this.cleanupAllTempFiles();

      // Force garbage collection
      this.forceGarbageCollection();

      // Clear any cached data that's not essential
      await this.clearNonEssentialCache();

    } catch (error) {
      console.error('Memory cleanup failed:', error);
    }
  }

  /**
   * Clear non-essential cached data
   */
  private async clearNonEssentialCache(): Promise<void> {
    try {
      // Clear old processed images from cache
      const cacheDir = `${FileSystem.cacheDirectory}processed/`;
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      
      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(cacheDir);
        const now = Date.now();
        const maxAge = 60 * 60 * 1000; // 1 hour

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
      }
    } catch (error) {
      console.warn('Failed to clear non-essential cache:', error);
    }
  }

  /**
   * Force garbage collection
   */
  private forceGarbageCollection(): void {
    try {
      if (global.gc) {
        global.gc();
      }
    } catch (error) {
      // GC not available, ignore
    }
  }

  /**
   * Get current memory statistics
   */
  public async getMemoryStats(): Promise<MemoryStats> {
    try {
      let cacheSize = 0;
      let tempFileSize = 0;

      // Calculate cache size
      const cacheDir = `${FileSystem.cacheDirectory}images/`;
      const cacheDirInfo = await FileSystem.getInfoAsync(cacheDir);
      if (cacheDirInfo.exists) {
        const cacheFiles = await FileSystem.readDirectoryAsync(cacheDir);
        for (const file of cacheFiles) {
          const fileInfo = await FileSystem.getInfoAsync(`${cacheDir}${file}`);
          if (fileInfo.exists && fileInfo.size) {
            cacheSize += fileInfo.size;
          }
        }
      }

      // Calculate temp file size
      const tempDir = `${FileSystem.cacheDirectory}temp/`;
      const tempDirInfo = await FileSystem.getInfoAsync(tempDir);
      if (tempDirInfo.exists) {
        const tempFiles = await FileSystem.readDirectoryAsync(tempDir);
        for (const file of tempFiles) {
          const fileInfo = await FileSystem.getInfoAsync(`${tempDir}${file}`);
          if (fileInfo.exists && fileInfo.size) {
            tempFileSize += fileInfo.size;
          }
        }
      }

      const estimatedUsage = cacheSize + tempFileSize;

      return {
        estimatedUsage,
        cacheSize,
        tempFileSize,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Failed to get memory stats:', error);
      return {
        estimatedUsage: 0,
        cacheSize: 0,
        tempFileSize: 0,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Check if memory usage is within acceptable limits
   */
  public async isMemoryUsageAcceptable(): Promise<boolean> {
    const stats = await this.getMemoryStats();
    return stats.estimatedUsage < this.memoryThreshold;
  }

  /**
   * Get processing queue status
   */
  public getQueueStatus(): {
    queueLength: number;
    activeOperations: number;
    maxConcurrentOperations: number;
  } {
    return {
      queueLength: this.processingQueue.length,
      activeOperations: this.activeOperations,
      maxConcurrentOperations: this.maxConcurrentOperations,
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    
    this.cleanupAllTempFiles();
    this.processingQueue = [];
  }
}

// Export singleton instance
export const memoryManager = MemoryManager.getInstance();

// Utility functions
export const optimizeImageProcessing = async <T>(
  imageUri: string,
  processor: (uri: string) => Promise<T>,
  options?: ProcessingOptions
): Promise<T> => {
  return await memoryManager.optimizeImageProcessing(imageUri, processor, options);
};

export const batchProcessImages = async <T>(
  imageUris: string[],
  processor: (uri: string) => Promise<T>,
  batchSize?: number
): Promise<T[]> => {
  return await memoryManager.batchProcessImages(imageUris, processor, batchSize);
};