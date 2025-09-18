import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueueService } from '../queueService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock other services
jest.mock('../networkService', () => ({
  networkService: {
    isConnected: jest.fn(() => true),
    addListener: jest.fn(() => () => {}),
  },
}));

jest.mock('../scanService', () => ({
  scanService: {
    performScan: jest.fn(),
  },
}));

describe('QueueService', () => {
  let queueService: QueueService;

  beforeEach(async () => {
    queueService = QueueService.getInstance();
    jest.clearAllMocks();
    
    // Mock empty storage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    
    await queueService.initialize();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = QueueService.getInstance();
      const instance2 = QueueService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('queue management', () => {
    it('should add item to queue', async () => {
      const imageUri = 'file://test.jpg';
      const scanId = await queueService.addToQueue(imageUri);

      expect(typeof scanId).toBe('string');
      expect(queueService.getQueueSize()).toBe(1);
      
      const queue = queueService.getQueue();
      expect(queue[0].imageUri).toBe(imageUri);
      expect(queue[0].retryCount).toBe(0);
    });

    it('should remove item from queue', async () => {
      const imageUri = 'file://test.jpg';
      const scanId = await queueService.addToQueue(imageUri);
      
      await queueService.removeFromQueue(scanId);
      
      expect(queueService.getQueueSize()).toBe(0);
    });

    it('should clear entire queue', async () => {
      await queueService.addToQueue('file://test1.jpg');
      await queueService.addToQueue('file://test2.jpg');
      
      expect(queueService.getQueueSize()).toBe(2);
      
      await queueService.clearQueue();
      
      expect(queueService.getQueueSize()).toBe(0);
    });

    it('should limit queue size', async () => {
      // Add more items than max queue size (50)
      for (let i = 0; i < 52; i++) {
        await queueService.addToQueue(`file://test${i}.jpg`);
      }
      
      expect(queueService.getQueueSize()).toBe(50);
    });
  });

  describe('listeners', () => {
    it('should add and notify listeners', async () => {
      const listener = jest.fn();
      const unsubscribe = queueService.addListener(listener);

      await queueService.addToQueue('file://test.jpg');

      expect(listener).toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe('persistence', () => {
    it('should save queue to storage', async () => {
      await queueService.addToQueue('file://test.jpg');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis_scan_queue',
        expect.any(String)
      );
    });

    it('should load queue from storage', async () => {
      const mockQueue = [{
        id: 'test-id',
        imageUri: 'file://test.jpg',
        timestamp: new Date().toISOString(),
        retryCount: 0,
      }];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockQueue)
      );

      const newQueueService = QueueService.getInstance();
      await newQueueService.initialize();

      expect(newQueueService.getQueueSize()).toBe(1);
    });
  });
});