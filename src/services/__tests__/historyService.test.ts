import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryService } from '../historyService';
import { ScanResult } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('HistoryService', () => {
  let historyService: HistoryService;
  
  const mockScanResult: ScanResult = {
    id: 'test-id-1',
    imageUri: 'file://test-image.jpg',
    status: 'healthy',
    confidence: 0.95,
    timestamp: new Date('2024-01-15T10:00:00Z'),
    tips: ['Keep up the good work!'],
    plantType: 'Rose',
  };

  const mockScanResult2: ScanResult = {
    id: 'test-id-2',
    imageUri: 'file://test-image-2.jpg',
    status: 'diseased',
    confidence: 0.87,
    timestamp: new Date('2024-01-14T09:00:00Z'),
    tips: ['Check for overwatering'],
  };

  beforeEach(() => {
    historyService = new HistoryService();
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('saveScanResult', () => {
    it('should save a new scan result to empty history', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      await historyService.saveScanResult(mockScanResult);

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@plantis_scan_history');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis_scan_history',
        JSON.stringify([mockScanResult])
      );
    });

    it('should add new scan result to existing history', async () => {
      const existingHistory = [mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingHistory));
      mockAsyncStorage.setItem.mockResolvedValue();

      await historyService.saveScanResult(mockScanResult);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis_scan_history',
        JSON.stringify([mockScanResult, mockScanResult2])
      );
    });

    it('should limit history to maximum items', async () => {
      // Create 100 existing items
      const existingHistory = Array.from({ length: 100 }, (_, i) => ({
        ...mockScanResult,
        id: `test-id-${i}`,
        timestamp: new Date(`2024-01-${String(i + 1).padStart(2, '0')}T10:00:00Z`),
      }));
      
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingHistory));
      mockAsyncStorage.setItem.mockResolvedValue();

      await historyService.saveScanResult(mockScanResult);

      const savedData = JSON.parse(
        (mockAsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData).toHaveLength(100); // Should still be 100 (max limit)
      expect(savedData[0]).toEqual(mockScanResult); // New item should be first
    });

    it('should handle save errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      await expect(historyService.saveScanResult(mockScanResult))
        .rejects.toThrow('Failed to save scan result to history');
    });
  });

  describe('getAllScanResults', () => {
    it('should return empty array when no history exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const results = await historyService.getAllScanResults();

      expect(results).toEqual([]);
    });

    it('should return parsed and sorted scan results', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const results = await historyService.getAllScanResults();

      expect(results).toHaveLength(2);
      expect(results[0].timestamp).toBeInstanceOf(Date);
      expect(results[0].timestamp.getTime()).toBeGreaterThan(results[1].timestamp.getTime());
    });

    it('should handle retrieval errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const results = await historyService.getAllScanResults();

      expect(results).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getScanResultById', () => {
    it('should return scan result by ID', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const result = await historyService.getScanResultById('test-id-1');

      expect(result).toEqual(expect.objectContaining({
        id: 'test-id-1',
        status: 'healthy',
      }));
    });

    it('should return null for non-existent ID', async () => {
      const historyData = [mockScanResult];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const result = await historyService.getScanResultById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('deleteScanResult', () => {
    it('should delete scan result by ID', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));
      mockAsyncStorage.setItem.mockResolvedValue();

      const success = await historyService.deleteScanResult('test-id-1');

      expect(success).toBe(true);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis_scan_history',
        JSON.stringify([mockScanResult2])
      );
    });

    it('should handle deletion errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const success = await historyService.deleteScanResult('test-id-1');

      expect(success).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearAllHistory', () => {
    it('should clear all history', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await historyService.clearAllHistory();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('@plantis_scan_history');
    });

    it('should handle clear errors', async () => {
      mockAsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));

      await expect(historyService.clearAllHistory())
        .rejects.toThrow('Failed to clear scan history');
    });
  });

  describe('getHistoryCount', () => {
    it('should return correct history count', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const count = await historyService.getHistoryCount();

      expect(count).toBe(2);
    });

    it('should return 0 for empty history', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const count = await historyService.getHistoryCount();

      expect(count).toBe(0);
    });
  });

  describe('performCleanup', () => {
    it('should remove expired entries', async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 35); // 35 days ago (expired)
      
      const expiredResult = {
        ...mockScanResult,
        id: 'expired-id',
        timestamp: oldDate,
      };
      
      const historyData = [mockScanResult, expiredResult];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await historyService.performCleanup();

      expect(result.removedCount).toBe(1);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis_scan_history',
        JSON.stringify([mockScanResult])
      );
    });

    it('should limit to max items even if not expired', async () => {
      // Create 101 recent items
      const recentHistory = Array.from({ length: 101 }, (_, i) => ({
        ...mockScanResult,
        id: `recent-id-${i}`,
        timestamp: new Date(), // All recent
      }));
      
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(recentHistory));
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await historyService.performCleanup();

      expect(result.removedCount).toBe(1); // Should remove 1 item to get to 100
    });
  });

  describe('getResultsByStatus', () => {
    it('should filter results by healthy status', async () => {
      const historyData = [mockScanResult, mockScanResult2]; // healthy and diseased
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const results = await historyService.getResultsByStatus('healthy');

      expect(results).toHaveLength(1);
      expect(results[0].status).toBe('healthy');
    });

    it('should filter results by diseased status', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const results = await historyService.getResultsByStatus('diseased');

      expect(results).toHaveLength(1);
      expect(results[0].status).toBe('diseased');
    });
  });

  describe('getResultsByDateRange', () => {
    it('should filter results by date range', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const startDate = new Date('2024-01-14T00:00:00Z');
      const endDate = new Date('2024-01-14T23:59:59Z');

      const results = await historyService.getResultsByDateRange(startDate, endDate);

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('test-id-2');
    });
  });

  describe('exportHistory', () => {
    it('should export history as JSON string', async () => {
      const historyData = [mockScanResult];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const exported = await historyService.exportHistory();

      expect(typeof exported).toBe('string');
      expect(JSON.parse(exported)).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'test-id-1' })
      ]));
    });
  });

  describe('importHistory', () => {
    it('should import valid history data', async () => {
      const importData = JSON.stringify([mockScanResult]);
      mockAsyncStorage.setItem.mockResolvedValue();

      const count = await historyService.importHistory(importData);

      expect(count).toBe(1);
      expect(mockAsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should handle invalid import data', async () => {
      const invalidData = 'invalid json';

      await expect(historyService.importHistory(invalidData))
        .rejects.toThrow('Failed to import history data');
    });

    it('should filter out invalid scan results during import', async () => {
      const mixedData = JSON.stringify([
        mockScanResult, // valid
        { id: 'incomplete' }, // invalid - missing required fields
        mockScanResult2, // valid
      ]);
      mockAsyncStorage.setItem.mockResolvedValue();

      const count = await historyService.importHistory(mixedData);

      expect(count).toBe(2); // Only valid results imported
    });
  });
});