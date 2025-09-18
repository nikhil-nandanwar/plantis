import { APIResponse } from '../../types';

/**
 * Mock API responses for development and testing
 */
export const mockApiResponses = {
  healthyLeaf: {
    status: 'healthy' as const,
    confidence: 0.92,
    tips: [
      'Your plant looks healthy! 🌱',
      'Continue your current care routine.',
      'Ensure adequate sunlight and water drainage.',
      'Monitor for any changes in leaf color or texture.'
    ]
  },

  diseasedLeaf: {
    status: 'diseased' as const,
    confidence: 0.87,
    tips: [
      'Your plant might need attention 🚨',
      'Consider removing affected leaves to prevent spread.',
      'Ensure proper air circulation around the plant.',
      'Check soil moisture - overwatering can cause fungal issues.',
      'Consider using organic fungicide if symptoms persist.'
    ]
  },

  lowConfidenceHealthy: {
    status: 'healthy' as const,
    confidence: 0.65,
    tips: [
      'Your plant appears healthy, but the image quality could be better.',
      'Try taking a clearer photo in good lighting for more accurate results.',
      'Focus on a single leaf with visible details.'
    ]
  },

  lowConfidenceDiseased: {
    status: 'diseased' as const,
    confidence: 0.58,
    tips: [
      'Possible disease detected, but confidence is low.',
      'Please retake the photo with better lighting and focus.',
      'If symptoms persist, consult with a plant care expert.',
      'Monitor the plant closely for any changes.'
    ]
  }
};

/**
 * Mock API service for development and testing
 */
export class MockImageUploadService {
  private delay: number;
  private shouldFail: boolean;
  private failureRate: number;

  constructor(options: { delay?: number; shouldFail?: boolean; failureRate?: number } = {}) {
    this.delay = options.delay || 2000;
    this.shouldFail = options.shouldFail || false;
    this.failureRate = options.failureRate || 0;
  }

  /**
   * Mock image analysis with simulated delay and random responses
   */
  async analyzeImage(imageUri: string): Promise<APIResponse> {
    // Simulate network delay
    await this.sleep(this.delay);

    // Simulate random failures
    if (this.shouldFail || Math.random() < this.failureRate) {
      throw new Error('Mock API failure for testing');
    }

    // Return random mock response
    const responses = Object.values(mockApiResponses);
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      ...randomResponse,
      // Add some randomness to confidence
      confidence: Math.max(0.5, Math.min(1.0, randomResponse.confidence + (Math.random() - 0.5) * 0.2))
    };
  }

  /**
   * Mock health check
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    await this.sleep(500);
    
    if (this.shouldFail) {
      throw new Error('Mock health check failure');
    }

    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Configure mock behavior
   */
  setMockBehavior(options: { delay?: number; shouldFail?: boolean; failureRate?: number }) {
    if (options.delay !== undefined) this.delay = options.delay;
    if (options.shouldFail !== undefined) this.shouldFail = options.shouldFail;
    if (options.failureRate !== undefined) this.failureRate = options.failureRate;
  }

  /**
   * Get a specific mock response by type
   */
  getMockResponse(type: keyof typeof mockApiResponses): APIResponse {
    return { ...mockApiResponses[type] };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance for development
export const mockImageUploadService = new MockImageUploadService();