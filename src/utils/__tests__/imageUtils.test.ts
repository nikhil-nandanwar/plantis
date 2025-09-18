import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import {
  compressImage,
  validateImage,
  getImageDimensions,
  calculateOptimalQuality,
  formatFileSize,
} from '../imageUtils';

// Mock expo-image-manipulator
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: {
    JPEG: 'jpeg',
    PNG: 'png',
  },
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  getInfoAsync: jest.fn(),
}));

describe('imageUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('compressImage', () => {
    it('compresses image with default options', async () => {
      const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock;
      mockManipulate.mockResolvedValue({ uri: 'compressed-uri' });

      const result = await compressImage('test-uri');

      expect(mockManipulate).toHaveBeenCalledWith(
        'test-uri',
        [{ resize: { width: 1024, height: 1024 } }],
        {
          compress: 0.8,
          format: 'jpeg',
        }
      );
      expect(result).toBe('compressed-uri');
    });

    it('compresses image with custom options', async () => {
      const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock;
      mockManipulate.mockResolvedValue({ uri: 'compressed-uri' });

      const options = {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.6,
        format: ImageManipulator.SaveFormat.PNG,
      };

      const result = await compressImage('test-uri', options);

      expect(mockManipulate).toHaveBeenCalledWith(
        'test-uri',
        [{ resize: { width: 512, height: 512 } }],
        {
          compress: 0.6,
          format: 'png',
        }
      );
      expect(result).toBe('compressed-uri');
    });

    it('throws error when compression fails', async () => {
      const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock;
      mockManipulate.mockRejectedValue(new Error('Compression failed'));

      await expect(compressImage('test-uri')).rejects.toThrow('Failed to compress image');
    });
  });

  describe('validateImage', () => {
    it('validates image successfully', async () => {
      const mockGetInfo = FileSystem.getInfoAsync as jest.Mock;
      mockGetInfo.mockResolvedValue({
        exists: true,
        size: 1024000, // 1MB
      });

      const result = await validateImage('test-image.jpg');

      expect(result).toEqual({
        isValid: true,
        fileSize: 1024000,
      });
    });

    it('rejects non-existent file', async () => {
      const mockGetInfo = FileSystem.getInfoAsync as jest.Mock;
      mockGetInfo.mockResolvedValue({
        exists: false,
      });

      const result = await validateImage('test-image.jpg');

      expect(result).toEqual({
        isValid: false,
        error: 'Image file does not exist',
      });
    });

    it('rejects file that is too large', async () => {
      const mockGetInfo = FileSystem.getInfoAsync as jest.Mock;
      mockGetInfo.mockResolvedValue({
        exists: true,
        size: 15 * 1024 * 1024, // 15MB
      });

      const result = await validateImage('test-image.jpg');

      expect(result).toEqual({
        isValid: false,
        error: 'Image file is too large. Maximum size is 10MB.',
        fileSize: 15 * 1024 * 1024,
      });
    });

    it('rejects invalid file extension', async () => {
      const mockGetInfo = FileSystem.getInfoAsync as jest.Mock;
      mockGetInfo.mockResolvedValue({
        exists: true,
        size: 1024000,
      });

      const result = await validateImage('test-file.txt');

      expect(result).toEqual({
        isValid: false,
        error: 'Invalid image format. Please use JPG, PNG, GIF, BMP, or WebP.',
        fileSize: 1024000,
      });
    });

    it('accepts various valid image extensions', async () => {
      const mockGetInfo = FileSystem.getInfoAsync as jest.Mock;
      mockGetInfo.mockResolvedValue({
        exists: true,
        size: 1024000,
      });

      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      
      for (const ext of validExtensions) {
        const result = await validateImage(`test-image${ext}`);
        expect(result.isValid).toBe(true);
      }
    });

    it('handles validation errors gracefully', async () => {
      const mockGetInfo = FileSystem.getInfoAsync as jest.Mock;
      mockGetInfo.mockRejectedValue(new Error('File system error'));

      const result = await validateImage('test-image.jpg');

      expect(result).toEqual({
        isValid: false,
        error: 'Failed to validate image',
      });
    });
  });

  describe('getImageDimensions', () => {
    it('returns default dimensions when successful', async () => {
      const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock;
      mockManipulate.mockResolvedValue({ uri: 'processed-uri' });

      const mockGetInfo = FileSystem.getInfoAsync as jest.Mock;
      mockGetInfo.mockResolvedValue({ exists: true });

      const result = await getImageDimensions('test-uri');

      expect(result).toEqual({ width: 1024, height: 1024 });
    });

    it('returns zero dimensions on error', async () => {
      const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock;
      mockManipulate.mockRejectedValue(new Error('Failed to process'));

      const result = await getImageDimensions('test-uri');

      expect(result).toEqual({ width: 0, height: 0 });
    });
  });

  describe('calculateOptimalQuality', () => {
    it('returns high quality for small files', () => {
      const result = calculateOptimalQuality(1024 * 1024); // 1MB
      expect(result).toBe(0.9);
    });

    it('returns medium quality for medium files', () => {
      const result = calculateOptimalQuality(3 * 1024 * 1024); // 3MB
      expect(result).toBe(0.8);
    });

    it('returns low quality for large files', () => {
      const result = calculateOptimalQuality(10 * 1024 * 1024); // 10MB
      expect(result).toBe(0.6);
    });

    it('returns high quality for files at 2MB threshold', () => {
      const result = calculateOptimalQuality(2 * 1024 * 1024); // 2MB
      expect(result).toBe(0.9);
    });

    it('returns medium quality for files at 5MB threshold', () => {
      const result = calculateOptimalQuality(5 * 1024 * 1024); // 5MB
      expect(result).toBe(0.8);
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(512)).toBe('512 Bytes');
      expect(formatFileSize(1023)).toBe('1023 Bytes');
    });

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1024 * 1023)).toBe('1023 KB');
    });

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
      expect(formatFileSize(1024 * 1024 * 1023)).toBe('1023 MB');
    });

    it('formats gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });
  });
});