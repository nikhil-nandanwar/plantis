import { networkService } from './networkService';
import { queueService } from './queueService';
import { permissionService } from './permissionService';

/**
 * Service to initialize all error handling and core services
 */
export class InitializationService {
  private static initialized = false;

  /**
   * Initialize all core services
   */
  static async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      console.log('Initializing Plantis services...');

      // Initialize network monitoring
      networkService.initialize();
      console.log('✓ Network service initialized');

      // Initialize queue service
      await queueService.initialize();
      console.log('✓ Queue service initialized');

      // Initialize permission service
      await permissionService.initialize();
      console.log('✓ Permission service initialized');

      this.initialized = true;
      console.log('✓ All services initialized successfully');

    } catch (error) {
      console.error('Failed to initialize services:', error);
      throw error;
    }
  }

  /**
   * Check if services are initialized
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset initialization state (for testing)
   */
  static reset(): void {
    this.initialized = false;
  }
}

// Export singleton methods
export const initializeServices = InitializationService.initialize;
export const isServicesInitialized = InitializationService.isInitialized;