/**
 * API Services exports
 */

export { HTTPClient, APIError } from './apiService';
export { ImageUploadService, imageUploadService } from './imageUploadService';
export { ScanService, scanService } from './scanService';
export { HistoryService, historyService } from './historyService';
export { HapticService } from './hapticService';
export { ErrorService, PlantisError } from './errorService';
export { NetworkService, networkService } from './networkService';
export { QueueService, queueService } from './queueService';
export { PermissionService, permissionService } from './permissionService';
export { InitializationService, initializeServices, isServicesInitialized } from './initializationService';
export { backgroundTaskService, initializeBackgroundTasks, performImmediateCleanup } from './backgroundTaskService';
export { 
  MockImageUploadService, 
  mockImageUploadService, 
  mockApiResponses 
} from './__mocks__/mockApiService';

// Environment-based service selection
const isDevelopment = process.env.NODE_ENV === 'development';
const useMockAPI = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';

// Export the appropriate service based on environment
export const apiService = (isDevelopment && useMockAPI) 
  ? require('./__mocks__/mockApiService').mockImageUploadService
  : require('./imageUploadService').imageUploadService;