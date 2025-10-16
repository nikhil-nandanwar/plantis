import { ScanResult } from '../types';

interface ApiResponse {
  status: 'healthy' | 'diseased';
  confidence: number;
  disease?: string;
  recommendations?: string[];
}

class PlantisApiService {
  private baseUrl = 'https://your-backend-api.com'; // Replace with actual backend URL

  /**
   * Analyzes a plant image and returns health assessment
   * @param imageUri - URI of the plant image to analyze
   * @returns Promise with scan result
   */
  async analyzePlant(imageUri: string): Promise<ScanResult> {
    try {
      // Create form data with the image
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant_image.jpg',
      } as any);

      // Make API call to backend
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      // Validate response format
      if (!result.status || typeof result.confidence !== 'number') {
        throw new Error('Invalid API response format');
      }

      return result;
    } catch (error) {
      console.error('Plant analysis API error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new PlantisApiService();