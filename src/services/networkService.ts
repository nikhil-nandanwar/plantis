import { NetworkState } from '../types';

/**
 * Service for monitoring network connectivity
 * Note: This is a simplified implementation. In a production app,
 * you would use @react-native-community/netinfo for more robust network detection
 */
export class NetworkService {
  private static instance: NetworkService;
  private networkState: NetworkState = {
    isConnected: true,
    isInternetReachable: null,
    type: null,
  };
  private listeners: ((state: NetworkState) => void)[] = [];

  static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  /**
   * Initialize network monitoring
   */
  initialize(): void {
    this.checkConnectivity();
    
    // Check connectivity periodically
    setInterval(() => {
      this.checkConnectivity();
    }, 5000);
  }

  /**
   * Get current network state
   */
  getNetworkState(): NetworkState {
    return { ...this.networkState };
  }

  /**
   * Check if device is connected to internet
   */
  isConnected(): boolean {
    return this.networkState.isConnected;
  }

  /**
   * Add listener for network state changes
   */
  addListener(listener: (state: NetworkState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Check connectivity by attempting to reach a reliable endpoint
   */
  private async checkConnectivity(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });

      clearTimeout(timeoutId);

      const newState: NetworkState = {
        isConnected: response.ok,
        isInternetReachable: response.ok,
        type: 'unknown', // Would be determined by NetInfo in production
      };

      this.updateNetworkState(newState);
    } catch (error) {
      const newState: NetworkState = {
        isConnected: false,
        isInternetReachable: false,
        type: null,
      };

      this.updateNetworkState(newState);
    }
  }

  /**
   * Update network state and notify listeners
   */
  private updateNetworkState(newState: NetworkState): void {
    const hasChanged = 
      this.networkState.isConnected !== newState.isConnected ||
      this.networkState.isInternetReachable !== newState.isInternetReachable;

    if (hasChanged) {
      this.networkState = newState;
      this.notifyListeners();
    }
  }

  /**
   * Notify all listeners of network state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getNetworkState());
      } catch (error) {
        console.error('Error in network state listener:', error);
      }
    });
  }

  /**
   * Wait for network connection to be restored
   */
  async waitForConnection(timeoutMs: number = 30000): Promise<boolean> {
    if (this.isConnected()) {
      return true;
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, timeoutMs);

      const unsubscribe = this.addListener((state) => {
        if (state.isConnected) {
          clearTimeout(timeout);
          unsubscribe();
          resolve(true);
        }
      });
    });
  }
}

// Export singleton instance
export const networkService = NetworkService.getInstance();