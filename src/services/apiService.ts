import { APIResponse, APIConfig } from '../types';
import { API_CONFIG } from '../constants/api';

/**
 * Custom error class for API-related errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * HTTP client with error handling and retry logic
 */
export class HTTPClient {
  private config: APIConfig;

  constructor(config: APIConfig = API_CONFIG) {
    this.config = config;
  }

  /**
   * Makes an HTTP request with retry logic
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    
    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const isRetryable = this.isRetryableError(response.status);
        
        if (isRetryable && retryCount < this.config.maxRetries) {
          const delay = this.calculateRetryDelay(retryCount);
          await this.sleep(delay);
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          isRetryable
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof Error) {
        const isNetworkError = error.name === 'AbortError' || 
                              error.message.includes('Network request failed') ||
                              error.message.includes('fetch');
        
        if (isNetworkError && retryCount < this.config.maxRetries) {
          const delay = this.calculateRetryDelay(retryCount);
          await this.sleep(delay);
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        throw new APIError(
          error.message,
          undefined,
          isNetworkError
        );
      }

      throw new APIError('Unknown error occurred', undefined, false);
    }
  }

  /**
   * Determines if an HTTP status code indicates a retryable error
   */
  private isRetryableError(statusCode: number): boolean {
    return statusCode >= 500 || statusCode === 429 || statusCode === 408;
  }

  /**
   * Calculates exponential backoff delay
   */
  private calculateRetryDelay(retryCount: number): number {
    return Math.min(1000 * Math.pow(2, retryCount), 10000);
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}