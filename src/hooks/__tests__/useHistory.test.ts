import { renderHook, act } from '@testing-library/react-native';
import { useHistory } from '../useHistory';
import { historyService } from '../../services/historyService';
import { ScanResult } from '../../types';

// Mock the history service
jest.mock('../../services/historyService', () => ({
  historyService: {
    getAllScanResults: jest.fn(),
    getHistoryCount: jest.fn(),
    saveScanResult: jest.fn(),
    deleteScanResult: jest.fn(),
    clearAllHistory: jest.fn(),
    performCleanup: jest.fn(),
    getResultsByStatus: jest.fn(),
    getScanResultById: jest.fn(),
  },
}));

const mockHistoryService = historyService as jest.Mocked<typeof historyService>;

describe('useHistory', () => {
  const mockScanResult: ScanResult = {
    id: 'test-id-1',
    imageUri: 'file://test-image.jpg',
    status: 'healthy',
    confidence: 0.95,
    timestamp: new Date('2024-01-15T10:00:00Z'),
    tips: ['Keep up the good work!'],
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
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('initial state and loading', () => {
    it('should initialize with loading state', () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([]);
      mockHistoryService.getHistoryCount.mockResolvedValue(0);

      const { result } = renderHook(() => useHistory());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.scanResults).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.historyCount).toBe(0);
    });

    it('should load initial history data', async () => {
      const mockResults = [mockScanResult, mockScanResult2];
      mockHistoryService.getAllScanResults.mockResolvedValue(mockResults);
      mockHistoryService.getHistoryCount.mockResolvedValue(2);

      const { result } = renderHook(() => useHistory());

      // Wait for the effect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.scanResults).toEqual(mockResults);
      expect(result.current.historyCount).toBe(2);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading errors', async () => {
      mockHistoryService.getAllScanResults.mockRejectedValue(new Error('Storage error'));
      mockHistoryService.getHistoryCount.mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useHistory());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Failed to load scan history');
      expect(result.current.scanResults).toEqual([]);
    });
  });

  describe('refreshHistory', () => {
    it('should refresh history data', async () => {
      const initialResults = [mockScanResult];
      const updatedResults = [mockScanResult, mockScanResult2];
      
      mockHistoryService.getAllScanResults
        .mockResolvedValueOnce(initialResults)
        .mockResolvedValueOnce(updatedResults);
      mockHistoryService.getHistoryCount
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2);

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.scanResults).toEqual(initialResults);

      // Refresh history
      await act(async () => {
        await result.current.refreshHistory();
      });

      expect(result.current.scanResults).toEqual(updatedResults);
      expect(result.current.historyCount).toBe(2);
    });
  });

  describe('addScanResult', () => {
    it('should add new scan result', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([]);
      mockHistoryService.getHistoryCount.mockResolvedValue(0);
      mockHistoryService.saveScanResult.mockResolvedValue();

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Add scan result
      await act(async () => {
        await result.current.addScanResult(mockScanResult);
      });

      expect(mockHistoryService.saveScanResult).toHaveBeenCalledWith(mockScanResult);
      expect(result.current.scanResults).toEqual([mockScanResult]);
      expect(result.current.historyCount).toBe(1);
    });

    it('should handle add errors', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([]);
      mockHistoryService.getHistoryCount.mockResolvedValue(0);
      mockHistoryService.saveScanResult.mockRejectedValue(new Error('Save error'));

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Try to add scan result
      await act(async () => {
        await expect(result.current.addScanResult(mockScanResult))
          .rejects.toThrow('Failed to save scan result');
      });
    });
  });

  describe('deleteScanResult', () => {
    it('should delete scan result', async () => {
      const initialResults = [mockScanResult, mockScanResult2];
      mockHistoryService.getAllScanResults.mockResolvedValue(initialResults);
      mockHistoryService.getHistoryCount.mockResolvedValue(2);
      mockHistoryService.deleteScanResult.mockResolvedValue(true);

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Delete scan result
      let deleteResult: boolean;
      await act(async () => {
        deleteResult = await result.current.deleteScanResult('test-id-1');
      });

      expect(deleteResult!).toBe(true);
      expect(mockHistoryService.deleteScanResult).toHaveBeenCalledWith('test-id-1');
      expect(result.current.scanResults).toEqual([mockScanResult2]);
      expect(result.current.historyCount).toBe(1);
    });

    it('should handle delete failures', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([mockScanResult]);
      mockHistoryService.getHistoryCount.mockResolvedValue(1);
      mockHistoryService.deleteScanResult.mockResolvedValue(false);

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Try to delete scan result
      let deleteResult: boolean;
      await act(async () => {
        deleteResult = await result.current.deleteScanResult('test-id-1');
      });

      expect(deleteResult!).toBe(false);
      expect(result.current.scanResults).toEqual([mockScanResult]); // Should remain unchanged
    });
  });

  describe('clearAllHistory', () => {
    it('should clear all history', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([mockScanResult]);
      mockHistoryService.getHistoryCount.mockResolvedValue(1);
      mockHistoryService.clearAllHistory.mockResolvedValue();

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Clear all history
      await act(async () => {
        await result.current.clearAllHistory();
      });

      expect(mockHistoryService.clearAllHistory).toHaveBeenCalled();
      expect(result.current.scanResults).toEqual([]);
      expect(result.current.historyCount).toBe(0);
    });
  });

  describe('performCleanup', () => {
    it('should perform cleanup and refresh history', async () => {
      const initialResults = [mockScanResult, mockScanResult2];
      const cleanedResults = [mockScanResult];
      
      mockHistoryService.getAllScanResults
        .mockResolvedValueOnce(initialResults)
        .mockResolvedValueOnce(cleanedResults);
      mockHistoryService.getHistoryCount
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1);
      mockHistoryService.performCleanup.mockResolvedValue({
        removedCount: 1,
        totalSize: 1024,
      });

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Perform cleanup
      let cleanupResult: { removedCount: number; totalSize: number };
      await act(async () => {
        cleanupResult = await result.current.performCleanup();
      });

      expect(cleanupResult!).toEqual({ removedCount: 1, totalSize: 1024 });
      expect(result.current.scanResults).toEqual(cleanedResults);
      expect(result.current.historyCount).toBe(1);
    });
  });

  describe('getResultsByStatus', () => {
    it('should get results by status', async () => {
      const healthyResults = [mockScanResult];
      mockHistoryService.getAllScanResults.mockResolvedValue([]);
      mockHistoryService.getHistoryCount.mockResolvedValue(0);
      mockHistoryService.getResultsByStatus.mockResolvedValue(healthyResults);

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Get results by status
      let statusResults: ScanResult[];
      await act(async () => {
        statusResults = await result.current.getResultsByStatus('healthy');
      });

      expect(statusResults!).toEqual(healthyResults);
      expect(mockHistoryService.getResultsByStatus).toHaveBeenCalledWith('healthy');
    });
  });

  describe('getScanResultById', () => {
    it('should get scan result by ID', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([]);
      mockHistoryService.getHistoryCount.mockResolvedValue(0);
      mockHistoryService.getScanResultById.mockResolvedValue(mockScanResult);

      const { result } = renderHook(() => useHistory());

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Get scan result by ID
      let scanResult: ScanResult | null;
      await act(async () => {
        scanResult = await result.current.getScanResultById('test-id-1');
      });

      expect(scanResult!).toEqual(mockScanResult);
      expect(mockHistoryService.getScanResultById).toHaveBeenCalledWith('test-id-1');
    });
  });
});