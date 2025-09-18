import { ScanResult, APIResponse, ErrorState } from '../types';
import { imageUploadService } from './imageUploadService';
import { APIError } from './apiService';
import { generateUniqueId } from '../utils/idUtils';

/**
 * Enhanced service for handling plant disease scanning with comprehensive error handling
 */
export class ScanService {
  private currentScanId: string | null = null;

  /**
   * Performs a complete plant disease scan with error handling and retry logic
   */
  async performScan(
    imageUri: string,
    onProgress?: (progress: number, message: string) => void
  ): Promise<{ result?: ScanResult; error?: ErrorState }> {
    this.currentScanId = generateUniqueId();
    
    try {
      // Step 1: Validate image
      onProgress?.(0.1, 'Validating image...');
      await this.validateImageForScan(imageUri);

      // Step 2: Prepare for upload
      onProgress?.(0.3, 'Preparing image for analysis...');
      await this.delay(500); // Small delay for UX

      // Step 3: Upload and analyze
      onProgress?.(0.5, 'Analyzing plant health...');
      const apiResponse = await imageUploadService.analyzeImage(imageUri);

      // Step 4: Process results
      onProgress?.(0.8, 'Processing results...');
      await this.delay(300); // Small delay for UX

      // Step 5: Create scan result
      onProgress?.(1.0, 'Complete!');
      const scanResult = this.createScanResult(imageUri, apiResponse);

      return { result: scanResult };

    } catch (error) {
      console.error('Scan failed:', error);
      
      const errorState = this.handleScanError(error);
      return { error: errorState };
    } finally {
      this.currentScanId = null;
    }
  }

  /**
   * Cancels the current scan operation
   */
  cancelCurrentScan(): void {
    if (this.currentScanId) {
      console.log(`Cancelling scan: ${this.currentScanId}`);
      this.currentScanId = null;
    }
  }

  /**
   * Validates image before sending for analysis
   */
  private async validateImageForScan(imageUri: string): Promise<void> {
    if (!imageUri) {
      throw new Error('No image provided for analysis');
    }

    // Check if image URI is accessible
    try {
      const response = await fetch(imageUri, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('Image file is not accessible');
      }
    } catch (error) {
      throw new Error('Failed to access image file');
    }
  }

  /**
   * Creates a ScanResult from API response
   */
  private createScanResult(imageUri: string, apiResponse: APIResponse): ScanResult {
    return {
      id: this.currentScanId || generateUniqueId(),
      imageUri,
      status: apiResponse.status,
      confidence: apiResponse.confidence,
      timestamp: new Date(),
      tips: apiResponse.tips || this.getDefaultTips(apiResponse.status),
      plantType: undefined, // Will be enhanced in future versions
    };
  }

  /**
   * Provides default tips based on plant status
   */
  private getDefaultTips(status: 'healthy' | 'diseased'): string[] {
    if (status === 'healthy') {
      return [
        'Your plant looks healthy! Continue current care routine.',
        'Ensure adequate sunlight and water drainage.',
        'Monitor regularly for any changes in leaf color or texture.',
      ];
    } else {
      return [
        'Consider adjusting watering schedule - overwatering is a common cause of plant diseases.',
        'Check for proper drainage in your plant pot.',
        'Ensure your plant has adequate air circulation.',
        'Remove any affected leaves to prevent spread.',
        'Consider consulting a plant care specialist if symptoms persist.',
      ];
    }
  }

  /**
   * Handles different types of scan errors and returns appropriate ErrorState
   */
  private handleScanError(error: unknown): ErrorState {
    if (error instanceof APIError) {
      return this.handleAPIError(error);
    }

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('Network request failed') || 
          error.message.includes('fetch')) {
        return {
          hasError: true,
          message: 'Network connection failed. Please check your internet connection and try again.',
          code: 'NETWORK_ERROR',
          retryable: true,
        };
      }

      if (error.message.includes('image') || error.message.includes('Image')) {
        return {
          hasError: true,
          message: 'There was an issue with the image. Please try taking a new photo or selecting a different image.',
          code: 'IMAGE_ERROR',
          retryable: true,
        };
      }

      return {
        hasError: true,
        message: error.message,
        code: 'UNKNOWN_ERROR',
        retryable: true,
      };
    }

    // Fallback for unknown errors
    return {
      hasError: true,
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
      retryable: true,
    };
  }

  /**
   * Handles API-specific errors
   */
  private handleAPIError(error: APIError): ErrorState {
    if (error.statusCode) {
      switch (error.statusCode) {
        case 400:
          return {
            hasError: true,
            message: 'Invalid image format. Please ensure you\'re uploading a clear photo of a plant leaf.',
            code: 'INVALID_IMAGE',
            retryable: true,
          };

        case 413:
          return {
            hasError: true,
            message: 'Image file is too large. Please try compressing the image or taking a new photo.',
            code: 'FILE_TOO_LARGE',
            retryable: true,
          };

        case 429:
          return {
            hasError: true,
            message: 'Too many requests. Please wait a moment before trying again.',
            code: 'RATE_LIMITED',
            retryable: true,
          };

        case 500:
        case 502:
        case 503:
          return {
            hasError: true,
            message: 'Our analysis service is temporarily unavailable. Please try again in a few moments.',
            code: 'SERVER_ERROR',
            retryable: true,
          };

        default:
          return {
            hasError: true,
            message: `Analysis failed (Error ${error.statusCode}). Please try again.`,
            code: 'API_ERROR',
            retryable: error.retryable,
          };
      }
    }

    return {
      hasError: true,
      message: error.message || 'Failed to analyze image. Please try again.',
      code: 'API_ERROR',
      retryable: error.retryable,
    };
  }

  /**
   * Utility function to add delays for better UX
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const scanService = new ScanService();