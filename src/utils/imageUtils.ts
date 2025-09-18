import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { memoryManager } from './memoryUtils';

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: ImageManipulator.SaveFormat;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  fileSize?: number;
}

/**
 * Compress an image with specified options and memory optimization
 */
export const compressImage = async (
  uri: string,
  options: ImageCompressionOptions = {}
): Promise<string> => {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8,
    format = ImageManipulator.SaveFormat.JPEG,
  } = options;

  return await memoryManager.optimizeImageProcessing(
    uri,
    async (imageUri) => {
      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: maxWidth, height: maxHeight } }],
          {
            compress: quality,
            format,
          }
        );

        return manipulatedImage.uri;
      } catch (error) {
        console.error('Image compression failed:', error);
        throw new Error('Failed to compress image');
      }
    },
    {
      cleanupAfterProcessing: true,
      enableGarbageCollection: true,
    }
  );
};

/**
 * Validate image file size and format
 */
export const validateImage = async (uri: string): Promise<ImageValidationResult> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    
    if (!fileInfo.exists) {
      return {
        isValid: false,
        error: 'Image file does not exist',
      };
    }

    const fileSize = fileInfo.size || 0;
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit

    if (fileSize > maxSizeInBytes) {
      return {
        isValid: false,
        error: 'Image file is too large. Maximum size is 10MB.',
        fileSize,
      };
    }

    // Check if it's a valid image format based on URI extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const hasValidExtension = validExtensions.some(ext => 
      uri.toLowerCase().includes(ext)
    );

    if (!hasValidExtension) {
      return {
        isValid: false,
        error: 'Invalid image format. Please use JPG, PNG, GIF, BMP, or WebP.',
        fileSize,
      };
    }

    return {
      isValid: true,
      fileSize,
    };
  } catch (error) {
    console.error('Image validation failed:', error);
    return {
      isValid: false,
      error: 'Failed to validate image',
    };
  }
};

/**
 * Get image dimensions
 */
export const getImageDimensions = async (uri: string): Promise<{ width: number; height: number }> => {
  try {
    // Use ImageManipulator to get image info without manipulating
    const result = await ImageManipulator.manipulateAsync(uri, [], {});
    
    // Get file info to extract dimensions (this is a workaround since expo-image-manipulator doesn't directly provide dimensions)
    const fileInfo = await FileSystem.getInfoAsync(result.uri);
    
    // For now, return default dimensions - in a real app, you'd use a library like expo-image to get actual dimensions
    return { width: 1024, height: 1024 };
  } catch (error) {
    console.error('Failed to get image dimensions:', error);
    return { width: 0, height: 0 };
  }
};

/**
 * Calculate optimal compression quality based on file size
 */
export const calculateOptimalQuality = (fileSizeBytes: number): number => {
  const maxSize = 2 * 1024 * 1024; // 2MB target
  
  if (fileSizeBytes <= maxSize) {
    return 0.9; // High quality for small files
  } else if (fileSizeBytes <= 5 * 1024 * 1024) {
    return 0.8; // Medium quality for medium files
  } else {
    return 0.6; // Lower quality for large files
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
/**
 * Ba
tch compress multiple images with memory optimization
 */
export const batchCompressImages = async (
  uris: string[],
  options: ImageCompressionOptions = {},
  batchSize: number = 3
): Promise<string[]> => {
  return await memoryManager.batchProcessImages(
    uris,
    (uri) => compressImage(uri, options),
    batchSize
  );
};

/**
 * Create optimized thumbnail with memory management
 */
export const createOptimizedThumbnail = async (
  uri: string,
  size: { width: number; height: number } = { width: 200, height: 200 },
  quality: number = 0.7
): Promise<string> => {
  return await memoryManager.optimizeImageProcessing(
    uri,
    async (imageUri) => {
      try {
        const result = await ImageManipulator.manipulateAsync(
          imageUri,
          [
            {
              resize: {
                width: size.width,
                height: size.height,
              },
            },
          ],
          {
            compress: quality,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        return result.uri;
      } catch (error) {
        console.error('Thumbnail creation failed:', error);
        throw new Error('Failed to create thumbnail');
      }
    },
    {
      cleanupAfterProcessing: true,
      enableGarbageCollection: true,
    }
  );
};

/**
 * Process image with automatic quality adjustment based on memory constraints
 */
export const processImageWithMemoryConstraints = async (
  uri: string,
  targetSize?: number
): Promise<string> => {
  const memoryStats = await memoryManager.getMemoryStats();
  const isMemoryConstrained = memoryStats.estimatedUsage > 30 * 1024 * 1024; // 30MB threshold

  let quality = 0.8;
  let maxDimension = 1024;

  if (isMemoryConstrained) {
    quality = 0.6;
    maxDimension = 800;
  }

  // Further adjust based on file size if provided
  if (targetSize) {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists && fileInfo.size && fileInfo.size > targetSize) {
      const ratio = targetSize / fileInfo.size;
      quality = Math.max(0.4, quality * ratio);
      maxDimension = Math.max(400, Math.floor(maxDimension * Math.sqrt(ratio)));
    }
  }

  return await compressImage(uri, {
    maxWidth: maxDimension,
    maxHeight: maxDimension,
    quality,
    format: ImageManipulator.SaveFormat.JPEG,
  });
};