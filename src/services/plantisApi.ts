import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

interface ApiResponse {
  status: 'healthy' | 'diseased';
  confidence: number;
}

class PlantisApiService {
  private baseUrl = 'https://your-backend-api.com'; // Replace with actual backend URL

  async analyzePlant(imageUri: string): Promise<ApiResponse> {
    try {
      // Compress image before sending
      const compressedImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: compressedImage.uri,
        type: 'image/jpeg',
        name: 'plant_image.jpg',
      } as any);

      // Make API call
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      // Validate response
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

export default new PlantisApiService();