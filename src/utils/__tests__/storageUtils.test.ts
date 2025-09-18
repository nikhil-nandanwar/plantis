import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveScanResult,
  getScanHistory,
  getScanResultById,
  deleteScanResult,
  clearScanHistory,
  getScanHistoryCount,
  saveUserPreferences,
  getUserPreferences,
  isFirstTimeUser,
  markOnboardingComplete,
  getStorageStats,
} from '../storageUtils';
import { ScanResult, UserPreferences } from '../../types';

// Mock AsyncStorage
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('storageUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.clear();
  });

  const mockScanResult: ScanResult = {
    id: 'test-id-1',
    imageUri: 'file://test-image.jpg',
    status: 'healthy',
    confidence: 0.95,
    timestamp: new Date('2023-01-01T10:00:00Z'),
    tips: ['Keep up the good work!'],
  };

  const mockScanResult2: ScanResult = {
    id: 'test-id-2',
    imageUri: 'file://test-image-2.jpg',
    status: 'diseased',
    confidence: 0.85,
    timestamp: new Date('2023-01-02T10:00:00Z'),
    tips: ['Water more frequently'],
  };

  describe('saveScanResult', () => {
    it('should save scan result to empty history', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      await saveScanResult(mockScanResult);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis:scan_history',
        JSON.stringify([mockScanResult])
      );
    });

    it('should add scan result to existing history', async () => {
      const existingHistory = [mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingHistory));
      mockAsyncStorage.setItem.mockResolvedValue();

      await saveScanResult(mockScanResult);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis:scan_history',
        JSON.stringify([mockScanResult, mockScanResult2])
      );
    });

    it('should limit history to maximum items', async () => {
      // Create 100 existing items
      const existingHistory = Array.from({ length: 100 }, (_, i) => ({
        ...mockScanResult,
        id: `test-id-${i}`,
      }));
      
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingHistory));
      mockAsyncStorage.setItem.mockResolvedValue();

      await saveScanResult(mockScanResult);

      const savedData = JSON.parse(
        (mockAsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData).toHaveLength(100); // Should still be 100, not 101
      expect(savedData[0]).toEqual({
        ...mockScanResult,
        timestamp: mockScanResult.timestamp.toISOString()
      }); // New item should be first, timestamp will be serialized as string
    });

    it('should throw error when save fails', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      await expect(saveScanResult(mockScanResult)).rejects.toThrow('Failed to save scan result: Storage error');
    });
  });

  describe('getScanHistory', () => {
    it('should return empty array when no history exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getScanHistory();

      expect(result).toEqual([]);
    });

    it('should return parsed history with Date objects', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const result = await getScanHistory();

      expect(result).toHaveLength(2);
      expect(result[0].timestamp).toBeInstanceOf(Date);
      expect(result[1].timestamp).toBeInstanceOf(Date);
    });

    it('should return empty array on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await getScanHistory();

      expect(result).toEqual([]);
    });
  });

  describe('getScanResultById', () => {
    it('should return scan result when found', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const result = await getScanResultById('test-id-1');

      expect(result).toEqual(expect.objectContaining({
        id: 'test-id-1',
        status: 'healthy',
      }));
    });

    it('should return null when not found', async () => {
      const historyData = [mockScanResult];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const result = await getScanResultById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await getScanResultById('test-id-1');

      expect(result).toBeNull();
    });
  });

  describe('deleteScanResult', () => {
    it('should delete scan result when found', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await deleteScanResult('test-id-1');

      expect(result).toBe(true);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis:scan_history',
        JSON.stringify([mockScanResult2])
      );
    });

    it('should return false when not found', async () => {
      const historyData = [mockScanResult];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const result = await deleteScanResult('non-existent-id');

      expect(result).toBe(false);
      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('clearScanHistory', () => {
    it('should remove scan history', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await clearScanHistory();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('@plantis:scan_history');
    });
  });

  describe('getScanHistoryCount', () => {
    it('should return correct count', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(historyData));

      const result = await getScanHistoryCount();

      expect(result).toBe(2);
    });

    it('should return 0 on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await getScanHistoryCount();

      expect(result).toBe(0);
    });
  });

  describe('saveUserPreferences', () => {
    it('should save user preferences', async () => {
      const preferences: UserPreferences = {
        isFirstTime: false,
        notificationsEnabled: true,
        imageQuality: 'high',
      };
      mockAsyncStorage.setItem.mockResolvedValue();

      await saveUserPreferences(preferences);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis:user_preferences',
        JSON.stringify(preferences)
      );
    });
  });

  describe('getUserPreferences', () => {
    it('should return saved preferences', async () => {
      const preferences: UserPreferences = {
        isFirstTime: false,
        notificationsEnabled: false,
        imageQuality: 'low',
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(preferences));

      const result = await getUserPreferences();

      expect(result).toEqual(preferences);
    });

    it('should return and save default preferences when none exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await getUserPreferences();

      expect(result).toEqual({
        isFirstTime: true,
        notificationsEnabled: true,
        imageQuality: 'medium',
      });
      expect(mockAsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should return defaults on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await getUserPreferences();

      expect(result).toEqual({
        isFirstTime: true,
        notificationsEnabled: true,
        imageQuality: 'medium',
      });
    });
  });

  describe('isFirstTimeUser', () => {
    it('should return true for first time user', async () => {
      const preferences: UserPreferences = {
        isFirstTime: true,
        notificationsEnabled: true,
        imageQuality: 'medium',
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(preferences));

      const result = await isFirstTimeUser();

      expect(result).toBe(true);
    });

    it('should return false for returning user', async () => {
      const preferences: UserPreferences = {
        isFirstTime: false,
        notificationsEnabled: true,
        imageQuality: 'medium',
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(preferences));

      const result = await isFirstTimeUser();

      expect(result).toBe(false);
    });
  });

  describe('markOnboardingComplete', () => {
    it('should update isFirstTime to false', async () => {
      const preferences: UserPreferences = {
        isFirstTime: true,
        notificationsEnabled: true,
        imageQuality: 'medium',
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(preferences));
      mockAsyncStorage.setItem.mockResolvedValue();

      await markOnboardingComplete();

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantis:user_preferences',
        JSON.stringify({
          ...preferences,
          isFirstTime: false,
        })
      );
    });
  });

  describe('getStorageStats', () => {
    it('should return storage statistics', async () => {
      const historyData = [mockScanResult, mockScanResult2];
      const preferencesData = { isFirstTime: false };
      
      mockAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(historyData)) // for history
        .mockResolvedValueOnce(JSON.stringify(historyData)) // for count
        .mockResolvedValueOnce(JSON.stringify(preferencesData)); // for preferences

      const result = await getStorageStats();

      expect(result.historyCount).toBe(2);
      expect(result.estimatedSize).toMatch(/\d+KB/);
    });

    it('should return default stats on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await getStorageStats();

      expect(result).toEqual({
        historyCount: 0,
        estimatedSize: '0KB',
      });
    });
  });
});