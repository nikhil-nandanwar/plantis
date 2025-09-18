import { APIResponse } from '../types';
import { HTTPClient, APIError } from './apiService';
import { API_CONFIG } from '../constants/api';

/**
 * Service for handling image uploads and plant disease analysis
 */
export class ImageUploadService {
  private httpClient: HTTPClient;

  constructor() {
    this.httpClient = new HTTPClient();
  }

  /**
   * Uploads an image for plant disease analysis
   */
  async analyzeImage(imageUri: string): Promise<APIResponse> {
    try {
      // Create FormData for image upload
      const formData = new FormData();
      
      // For React Native, we need to format the image data properly
      const imageData = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant-leaf.jpg'
      } as any;

      formData.append('image', imageData);

      // Make the API request with FormData
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.analyze}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new APIError(
          `Upload failed: ${response.statusText}`,
          response.status,
          response.status >= 500
        );
      }

      const result = await response.json();
      
      // Validate response structure
      if (!this.isValidAPIResponse(result)) {
        throw new APIError('Invalid response format from server', undefined, false);
      }

      return result as APIResponse;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Handle other errors
      if (error instanceof Error) {
        throw new APIError(
          `Image upload failed: ${error.message}`,
          undefined,
          true
        );
      }

      throw new APIError('Unknown error during image upload', undefined, false);
    }
  }

  /**
   * Checks API health status
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.httpClient.request<{ status: string; timestamp: string }>(
        API_CONFIG.endpoints.health,
        { method: 'GET' }
      );
      return response;
    } catch (error) {
      throw new APIError('Health check failed', undefined, true);
    }
  }

  /**
   * Validates the structure of an API response
   */
  private isValidAPIResponse(response: any): response is APIResponse {
    return (
      typeof response === 'object' &&
      response !== null &&
      typeof response.status === 'string' &&
      (response.status === 'healthy' || response.status === 'diseased') &&
      typeof response.confidence === 'number' &&
      response.confidence >= 0 &&
      response.confidence <= 1 &&
      (response.tips === undefined || Array.isArray(response.tips)) &&
      (response.error === undefined || response.error === null || typeof response.error === 'string')
    );
  }
}

// Export singleton instance
export const imageUploadService = new ImageUploadService();