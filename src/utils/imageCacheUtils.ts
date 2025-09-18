import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import { ImageCompressionOptions } from './imageUtils';

/**
 * Image caching utilities for optimized thumbnail storage and retrieval
 */

export interface CachedImage {
  uri: string;
  localPath: string;
  size: number;
  timestamp: Date;
  originalUri: string;
}

export interface CacheOptions {
  maxAge?: number; // in milliseconds
  maxSize?: number; // in bytes
  quality?: number; // 0-1 for compression
  thumbnailSize?: { width: number; height: number };
}

class ImageCacheManager {
  private static instance: ImageCacheManager;
  private cacheDir: string;
  private readonly DEFAULT_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly DEFAULT_MAX_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly DEFAULT_THUMBNAIL_SIZE = { width: 200, height: 200 };

  private constructor() {
    this.cacheDir = `${FileSystem.cacheDirectory}images/`;
    this.initializeCache();
  }

  static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager();
    }
    return ImageCacheManager.instance;
  }

  /**
   * Initialize cache directory
   */
  private async initializeCache(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to initialize image cache:', error);
    }
  }

  /**
   * Generate cache key from URI
   */
  private async generateCacheKey(uri: string, options?: CacheOptions): Promise<string> {
    const optionsString = JSON.stringify(options || {});
    const combined = `${uri}_${optionsString}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.MD5,
      combined
    );
    return hash;
  }

  /**
   * Get cached image path
   */
  private getCachedImagePath(cacheKey: string): string {
    return `${this.cacheDir}${cacheKey}.jpg`;
  }

  /**
   * Check if image is cached and valid
   */
  public async isCached(uri: string, options?: CacheOptions): Promise<boolean> {
    try {
      const cacheKey = await this.generateCacheKey(uri, options);
      const cachedPath = this.getCachedImagePath(cacheKey);
      const fileInfo = await FileSystem.getInfoAsync(cachedPath);
      
      if (!fileInfo.exists) {
        return false;
      }

      // Check if cache is expired
      const maxAge = options?.maxAge || this.DEFAULT_MAX_AGE;
      const now = Date.now();
      const fileAge = now - (fileInfo.modificationTime || 0);
      
      return fileAge < maxAge;
    } catch (error) {
      console.error('Failed to check cache status:', error);
      return false;
    }
  }

  /**
   * Get cached image URI
   */
  public async getCachedImage(uri: string, options?: CacheOptions): Promise<string | null> {
    try {
      const isImageCached = await this.isCached(uri, options);
      if (!isImageCached) {
        return null;
      }

      const cacheKey = await this.generateCacheKey(uri, options);
      const cachedPath = this.getCachedImagePath(cacheKey);
      return cachedPath;
    } catch (error) {
      console.error('Failed to get cached image:', error);
      return null;
    }
  }

  /**
   * Cache an image with optional thumbnail generation
   */
  public async cacheImage(
    uri: string, 
    options?: CacheOptions
  ): Promise<string> {
    try {
      const cacheKey = await this.generateCacheKey(uri, options);
      const cachedPath = this.getCachedImagePath(cacheKey);
      
      // Check if already cached and valid
      const isImageCached = await this.isCached(uri, options);
      if (isImageCached) {
        return cachedPath;
      }

      // Ensure cache directory exists
      await this.initializeCache();

      // Download and process image
      let processedUri = uri;
      
      // If it's a remote URI, download it first
      if (uri.startsWith('http')) {
        const downloadResult = await FileSystem.downloadAsync(
          uri,
          `${this.cacheDir}temp_${cacheKey}.jpg`
        );
        processedUri = downloadResult.uri;
      }

      // Create thumbnail if requested
      if (options?.thumbnailSize) {
        const { ImageManipulator } = await import('expo-image-manipulator');
        const thumbnailResult = await ImageManipulator.manipulateAsync(
          processedUri,
          [
            {
              resize: {
                width: options.thumbnailSize.width,
                height: options.thumbnailSize.height,
              },
            },
          ],
          {
            compress: options.quality || 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );
        processedUri = thumbnailResult.uri;
      }

      // Move to final cache location
      await FileSystem.moveAsync({
        from: processedUri,
        to: cachedPath,
      });

      // Clean up temp file if it was downloaded
      if (uri.startsWith('http')) {
        const tempPath = `${this.cacheDir}temp_${cacheKey}.jpg`;
        const tempExists = await FileSystem.getInfoAsync(tempPath);
        if (tempExists.exists) {
          await FileSystem.deleteAsync(tempPath, { idempotent: true });
        }
      }

      return cachedPath;
    } catch (error) {
      console.error('Failed to cache image:', error);
      throw new Error('Failed to cache image');
    }
  }

  /**
   * Get or create cached thumbnail
   */
  public async getThumbnail(
    uri: string,
    size: { width: number; height: number } = this.DEFAULT_THUMBNAIL_SIZE,
    quality: number = 0.7
  ): Promise<string> {
    const options: CacheOptions = {
      thumbnailSize: size,
      quality,
      maxAge: this.DEFAULT_MAX_AGE,
    };

    try {
      // Check if thumbnail is already cached
      const cachedThumbnail = await this.getCachedImage(uri, options);
      if (cachedThumbnail) {
        return cachedThumbnail;
      }

      // Create and cache thumbnail
      return await this.cacheImage(uri, options);
    } catch (error) {
      console.error('Failed to get thumbnail:', error);
      // Return original URI as fallback
      return uri;
    }
  }

  /**
   * Preload images for better performance
   */
  public async preloadImages(uris: string[], options?: CacheOptions): Promise<void> {
    try {
      const cachePromises = uris.map(uri => 
        this.cacheImage(uri, options).catch(error => {
          console.warn(`Failed to preload image ${uri}:`, error);
          return null;
        })
      );

      await Promise.allSettled(cachePromises);
    } catch (error) {
      console.error('Failed to preload images:', error);
    }
  }

  /**
   * Clear expired cache entries
   */
  public async clearExpiredCache(): Promise<number> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.cacheDir);
      const now = Date.now();
      let clearedCount = 0;

      for (const file of files) {
        const filePath = `${this.cacheDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        if (fileInfo.exists && fileInfo.modificationTime) {
          const age = now - fileInfo.modificationTime;
          if (age > this.DEFAULT_MAX_AGE) {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
            clearedCount++;
          }
        }
      }

      return clearedCount;
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
      return 0;
    }
  }

  /**
   * Clear all cached images
   */
  public async clearAllCache(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.cacheDir, { idempotent: true });
        await this.initializeCache();
      }
    } catch (error) {
      console.error('Failed to clear all cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  public async getCacheStats(): Promise<{
    totalSize: number;
    fileCount: number;
    oldestFile: Date | null;
    newestFile: Date | null;
  }> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.cacheDir);
      let totalSize = 0;
      let oldestFile: Date | null = null;
      let newestFile: Date | null = null;

      for (const file of files) {
        const filePath = `${this.cacheDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
          
          const modTime = new Date(fileInfo.modificationTime || 0);
          if (!oldestFile || modTime < oldestFile) {
            oldestFile = modTime;
          }
          if (!newestFile || modTime > newestFile) {
            newestFile = modTime;
          }
        }
      }

      return {
        totalSize,
        fileCount: files.length,
        oldestFile,
        newestFile,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalSize: 0,
        fileCount: 0,
        oldestFile: null,
        newestFile: null,
      };
    }
  }

  /**
   * Optimize cache by removing least recently used items
   */
  public async optimizeCache(targetSize?: number): Promise<number> {
    try {
      const maxSize = targetSize || this.DEFAULT_MAX_SIZE;
      const stats = await this.getCacheStats();
      
      if (stats.totalSize <= maxSize) {
        return 0; // No optimization needed
      }

      const files = await FileSystem.readDirectoryAsync(this.cacheDir);
      const fileInfos: Array<{ path: string; size: number; modTime: number }> = [];

      // Get file info for all cached files
      for (const file of files) {
        const filePath = `${this.cacheDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        if (fileInfo.exists && fileInfo.size && fileInfo.modificationTime) {
          fileInfos.push({
            path: filePath,
            size: fileInfo.size,
            modTime: fileInfo.modificationTime,
          });
        }
      }

      // Sort by modification time (oldest first)
      fileInfos.sort((a, b) => a.modTime - b.modTime);

      let currentSize = stats.totalSize;
      let removedCount = 0;

      // Remove oldest files until we're under the target size
      for (const fileInfo of fileInfos) {
        if (currentSize <= maxSize) {
          break;
        }

        await FileSystem.deleteAsync(fileInfo.path, { idempotent: true });
        currentSize -= fileInfo.size;
        removedCount++;
      }

      return removedCount;
    } catch (error) {
      console.error('Failed to optimize cache:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const imageCacheManager = ImageCacheManager.getInstance();

// Utility functions
export const preloadThumbnails = async (
  imageUris: string[],
  size: { width: number; height: number } = { width: 200, height: 200 }
): Promise<void> => {
  const options: CacheOptions = {
    thumbnailSize: size,
    quality: 0.7,
  };

  await imageCacheManager.preloadImages(imageUris, options);
};

export const getCachedThumbnail = async (
  uri: string,
  size: { width: number; height: number } = { width: 200, height: 200 }
): Promise<string> => {
  return await imageCacheManager.getThumbnail(uri, size);
};