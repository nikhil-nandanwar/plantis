import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueuedScan, ScanResult, ErrorState } from '../types';
import { generateUniqueId } from '../utils/idUtils';
import { networkService } from './networkService';
import { scanService } from './scanService';
import { ErrorService } from './errorService';

const QUEUE_STORAGE_KEY = '@plantis_scan_queue';
const MAX_QUEUE_SIZE = 50;
const MAX_RETRY_COUNT = 3;

/**
 * Service for managing offline scan queue
 */
export class QueueService {
  private static instance: QueueService;
  private queue: QueuedScan[] = [];
  private isProcessing = false;
  private listeners: ((queue: QueuedScan[]) => void)[] = [];

  static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  /**
   * Initialize the queue service
   */
  async initialize(): Promise<void> {
    await this.loadQueue();
    this.setupNetworkListener();
  }

  /**
   * Add a scan to the queue
   */
  async addToQueue(imageUri: string): Promise<string> {
    const queuedScan: QueuedScan = {
      id: generateUniqueId(),
      imageUri,
      timestamp: new Date(),
      retryCount: 0,
    };

    // Remove oldest items if queue is full
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      this.queue.shift();
    }

    this.queue.push(queuedScan);
    await this.saveQueue();
    this.notifyListeners();

    // Try to process immediately if online
    if (networkService.isConnected()) {
      this.processQueue();
    }

    return queuedScan.id;
  }

  /**
   * Get current queue
   */
  getQueue(): QueuedScan[] {
    return [...this.queue];
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear the entire queue
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
    this.notifyListeners();
  }

  /**
   * Remove specific item from queue
   */
  async removeFromQueue(scanId: string): Promise<void> {
    const index = this.queue.findIndex(scan => scan.id === scanId);
    if (index > -1) {
      this.queue.splice(index, 1);
      await this.saveQueue();
      this.notifyListeners();
    }
  }

  /**
   * Add listener for queue changes
   */
  addListener(listener: (queue: QueuedScan[]) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Process all items in the queue
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    if (!networkService.isConnected()) {
      console.log('Cannot process queue: no network connection');
      return;
    }

    this.isProcessing = true;

    try {
      const itemsToProcess = [...this.queue];
      
      for (const queuedScan of itemsToProcess) {
        try {
          await this.processSingleScan(queuedScan);
        } catch (error) {
          console.error(`Failed to process queued scan ${queuedScan.id}:`, error);
          await this.handleFailedScan(queuedScan, error);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a single queued scan
   */
  private async processSingleScan(queuedScan: QueuedScan): Promise<void> {
    const result = await scanService.performScan(queuedScan.imageUri);
    
    if (result.result) {
      // Success - remove from queue
      await this.removeFromQueue(queuedScan.id);
      console.log(`Successfully processed queued scan ${queuedScan.id}`);
    } else if (result.error) {
      throw new Error(result.error.message);
    }
  }

  /**
   * Handle failed scan processing
   */
  private async handleFailedScan(queuedScan: QueuedScan, error: unknown): Promise<void> {
    const errorState = ErrorService.handleError(error);
    
    if (errorState.retryable && queuedScan.retryCount < MAX_RETRY_COUNT) {
      // Increment retry count and keep in queue
      const index = this.queue.findIndex(scan => scan.id === queuedScan.id);
      if (index > -1) {
        this.queue[index].retryCount++;
        await this.saveQueue();
        this.notifyListeners();
      }
    } else {
      // Max retries reached or non-retryable error - remove from queue
      await this.removeFromQueue(queuedScan.id);
      console.error(`Removing failed scan ${queuedScan.id} from queue after ${queuedScan.retryCount} retries`);
    }
  }

  /**
   * Setup network listener to process queue when connection is restored
   */
  private setupNetworkListener(): void {
    networkService.addListener((networkState) => {
      if (networkState.isConnected && this.queue.length > 0) {
        console.log('Network restored, processing queued scans...');
        setTimeout(() => this.processQueue(), 1000); // Small delay to ensure connection is stable
      }
    });
  }

  /**
   * Load queue from storage
   */
  private async loadQueue(): Promise<void> {
    try {
      const queueData = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (queueData) {
        const parsedQueue = JSON.parse(queueData);
        this.queue = parsedQueue.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load scan queue:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save scan queue:', error);
      throw ErrorService.createStorageError('save queue');
    }
  }

  /**
   * Notify all listeners of queue changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getQueue());
      } catch (error) {
        console.error('Error in queue listener:', error);
      }
    });
  }
}

// Export singleton instance
export const queueService = QueueService.getInstance();