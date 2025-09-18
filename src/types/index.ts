/**
 * Core data models for Plantis app
 */

export interface ScanResult {
    id: string;
    imageUri: string;
    status: 'healthy' | 'diseased';
    confidence: number;
    timestamp: Date;
    tips?: string[];
    plantType?: string;
}

export interface APIResponse {
    status: 'healthy' | 'diseased';
    confidence: number;
    tips?: string[];
    error?: string;
}

export interface UserPreferences {
    isFirstTime: boolean;
    notificationsEnabled: boolean;
    imageQuality: 'low' | 'medium' | 'high';
}

export interface ImageUploadOptions {
    quality: number;
    allowsEditing: boolean;
    aspect: [number, number];
    base64?: boolean;
}

export interface APIConfig {
    baseURL: string;
    endpoints: {
        analyze: string;
        health: string;
    };
    timeout: number;
    maxRetries: number;
}

export interface LoadingState {
    isLoading: boolean;
    message: string;
    progress?: number;
}

export interface ErrorState {
    hasError: boolean;
    message: string;
    code?: string;
    retryable: boolean;
}

export interface NetworkState {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: string | null;
}

export interface QueuedScan {
    id: string;
    imageUri: string;
    timestamp: Date;
    retryCount: number;
}

export interface PermissionState {
    camera: 'granted' | 'denied' | 'undetermined';
    mediaLibrary: 'granted' | 'denied' | 'undetermined';
}

export type ErrorType = 
    | 'NETWORK_ERROR'
    | 'PERMISSION_ERROR'
    | 'API_ERROR'
    | 'IMAGE_ERROR'
    | 'STORAGE_ERROR'
    | 'UNKNOWN_ERROR';

export interface AppError extends Error {
    type: ErrorType;
    code?: string;
    retryable: boolean;
    userMessage: string;
}

// Re-export tips types
export * from './tips';