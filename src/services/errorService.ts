import { ErrorState, ErrorType, AppError } from '../types';
import { Alert, Linking } from 'react-native';

/**
 * Custom error class for application-specific errors
 */
export class PlantisError extends Error implements AppError {
  public type: ErrorType;
  public code?: string;
  public retryable: boolean;
  public userMessage: string;

  constructor(
    type: ErrorType,
    message: string,
    userMessage: string,
    retryable: boolean = false,
    code?: string
  ) {
    super(message);
    this.name = 'PlantisError';
    this.type = type;
    this.userMessage = userMessage;
    this.retryable = retryable;
    this.code = code;
  }
}

/**
 * Service for handling application errors with user-friendly messages
 */
export class ErrorService {
  /**
   * Converts any error to a standardized ErrorState
   */
  static handleError(error: unknown): ErrorState {
    if (error instanceof PlantisError) {
      return {
        hasError: true,
        message: error.userMessage,
        code: error.code || error.type,
        retryable: error.retryable,
      };
    }

    if (error instanceof Error) {
      return this.categorizeError(error);
    }

    return {
      hasError: true,
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
      retryable: true,
    };
  }

  /**
   * Categorizes generic errors into specific error types
   */
  private static categorizeError(error: Error): ErrorState {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('network') || 
        message.includes('fetch') || 
        message.includes('connection') ||
        message.includes('timeout')) {
      return {
        hasError: true,
        message: 'Network connection failed. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
        retryable: true,
      };
    }

    // Permission errors
    if (message.includes('permission') || 
        message.includes('denied') || 
        message.includes('unauthorized')) {
      return {
        hasError: true,
        message: 'Permission required. Please check your app permissions in device settings.',
        code: 'PERMISSION_ERROR',
        retryable: false,
      };
    }

    // Image processing errors
    if (message.includes('image') || 
        message.includes('photo') || 
        message.includes('camera')) {
      return {
        hasError: true,
        message: 'There was an issue with the image. Please try taking a new photo.',
        code: 'IMAGE_ERROR',
        retryable: true,
      };
    }

    // Storage errors
    if (message.includes('storage') || 
        message.includes('save') || 
        message.includes('load')) {
      return {
        hasError: true,
        message: 'Unable to save or load data. Please check your device storage.',
        code: 'STORAGE_ERROR',
        retryable: true,
      };
    }

    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
      retryable: true,
    };
  }

  /**
   * Shows an error alert with retry option
   */
  static showErrorAlert(
    errorState: ErrorState,
    onRetry?: () => void,
    onCancel?: () => void
  ): void {
    const buttons = [];

    if (onCancel) {
      buttons.push({ text: 'Cancel', style: 'cancel' as const, onPress: onCancel });
    }

    if (errorState.retryable && onRetry) {
      buttons.push({ text: 'Retry', onPress: onRetry });
    } else {
      buttons.push({ text: 'OK', onPress: onCancel });
    }

    Alert.alert(
      'Error',
      errorState.message,
      buttons
    );
  }

  /**
   * Shows permission error with settings redirect
   */
  static showPermissionError(
    title: string,
    message: string,
    onCancel?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { 
          text: 'Open Settings', 
          onPress: () => {
            Linking.openSettings().catch(() => {
              Alert.alert('Error', 'Unable to open settings. Please open settings manually.');
            });
          }
        },
      ]
    );
  }

  /**
   * Creates specific error types for common scenarios
   */
  static createNetworkError(message?: string): PlantisError {
    return new PlantisError(
      'NETWORK_ERROR',
      message || 'Network request failed',
      'Network connection failed. Please check your internet connection and try again.',
      true,
      'NETWORK_ERROR'
    );
  }

  static createPermissionError(permission: string): PlantisError {
    return new PlantisError(
      'PERMISSION_ERROR',
      `${permission} permission denied`,
      `${permission} access is required. Please enable it in your device settings.`,
      false,
      'PERMISSION_ERROR'
    );
  }

  static createImageError(message?: string): PlantisError {
    return new PlantisError(
      'IMAGE_ERROR',
      message || 'Image processing failed',
      'There was an issue with the image. Please try taking a new photo or selecting a different image.',
      true,
      'IMAGE_ERROR'
    );
  }

  static createAPIError(statusCode?: number, message?: string): PlantisError {
    let userMessage = 'Analysis service is temporarily unavailable. Please try again.';
    
    if (statusCode) {
      switch (statusCode) {
        case 400:
          userMessage = 'Invalid image format. Please ensure you\'re uploading a clear photo of a plant leaf.';
          break;
        case 413:
          userMessage = 'Image file is too large. Please try compressing the image or taking a new photo.';
          break;
        case 429:
          userMessage = 'Too many requests. Please wait a moment before trying again.';
          break;
        case 500:
        case 502:
        case 503:
          userMessage = 'Our analysis service is temporarily unavailable. Please try again in a few moments.';
          break;
      }
    }

    return new PlantisError(
      'API_ERROR',
      message || `API error ${statusCode}`,
      userMessage,
      true,
      `API_ERROR_${statusCode}`
    );
  }

  static createStorageError(operation: string): PlantisError {
    return new PlantisError(
      'STORAGE_ERROR',
      `Storage ${operation} failed`,
      `Unable to ${operation} data. Please check your device storage and try again.`,
      true,
      'STORAGE_ERROR'
    );
  }
}