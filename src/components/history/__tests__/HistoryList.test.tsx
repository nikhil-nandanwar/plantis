import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { HistoryList } from '../HistoryList';
import { historyService } from '../../../services/historyService';
import { ScanResult } from '../../../types';

// Mock the history service
jest.mock('../../../services/historyService', () => ({
  historyService: {
    getAllScanResults: jest.fn(),
    getResultsByStatus: jest.fn(),
    deleteScanResult: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockHistoryService = historyService as jest.Mocked<typeof historyService>;

describe('HistoryList', () => {
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

  const mockOnItemPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('loading state', () => {
    it('should show loading indicator initially', async () => {
      mockHistoryService.getAllScanResults.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      expect(getByText('Loading history...')).toBeTruthy();
    });
  });

  describe('empty state', () => {
    it('should show empty state when no scans exist', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(getByText('No Scans Yet')).toBeTruthy();
        expect(getByText('Start scanning your plants to see your history here!')).toBeTruthy();
      });
    });

    it('should show filtered empty state', async () => {
      mockHistoryService.getResultsByStatus.mockResolvedValue([]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} filterStatus="healthy" />
      );

      await waitFor(() => {
        expect(getByText('No healthy plants found in your history.')).toBeTruthy();
      });
    });
  });

  describe('scan results display', () => {
    it('should display scan results correctly', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([mockScanResult, mockScanResult2]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(getByText('🌱 Healthy')).toBeTruthy();
        expect(getByText('🚨 Diseased')).toBeTruthy();
        expect(getByText('Confidence: 95%')).toBeTruthy();
        expect(getByText('Confidence: 87%')).toBeTruthy();
      });
    });

    it('should handle item press', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([mockScanResult]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        const healthyItem = getByText('🌱 Healthy');
        fireEvent.press(healthyItem.parent!);
      });

      expect(mockOnItemPress).toHaveBeenCalledWith(mockScanResult);
    });

    it('should show delete confirmation on long press', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([mockScanResult]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        const healthyItem = getByText('🌱 Healthy');
        fireEvent(healthyItem.parent!, 'longPress');
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Scan Result',
        'Are you sure you want to delete this scan result?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Delete' }),
        ])
      );
    });
  });

  describe('filtering', () => {
    it('should filter by healthy status', async () => {
      mockHistoryService.getResultsByStatus.mockResolvedValue([mockScanResult]);

      render(
        <HistoryList onItemPress={mockOnItemPress} filterStatus="healthy" />
      );

      await waitFor(() => {
        expect(mockHistoryService.getResultsByStatus).toHaveBeenCalledWith('healthy');
      });
    });

    it('should filter by diseased status', async () => {
      mockHistoryService.getResultsByStatus.mockResolvedValue([mockScanResult2]);

      render(
        <HistoryList onItemPress={mockOnItemPress} filterStatus="diseased" />
      );

      await waitFor(() => {
        expect(mockHistoryService.getResultsByStatus).toHaveBeenCalledWith('diseased');
      });
    });

    it('should show all results when filter is "all"', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([mockScanResult, mockScanResult2]);

      render(
        <HistoryList onItemPress={mockOnItemPress} filterStatus="all" />
      );

      await waitFor(() => {
        expect(mockHistoryService.getAllScanResults).toHaveBeenCalled();
        expect(mockHistoryService.getResultsByStatus).not.toHaveBeenCalled();
      });
    });
  });

  describe('refresh functionality', () => {
    it('should refresh data when refreshTrigger changes', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([mockScanResult]);

      const { rerender } = render(
        <HistoryList onItemPress={mockOnItemPress} refreshTrigger={0} />
      );

      await waitFor(() => {
        expect(mockHistoryService.getAllScanResults).toHaveBeenCalledTimes(1);
      });

      // Change refresh trigger
      rerender(
        <HistoryList onItemPress={mockOnItemPress} refreshTrigger={1} />
      );

      await waitFor(() => {
        expect(mockHistoryService.getAllScanResults).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('error handling', () => {
    it('should show error state when loading fails', async () => {
      mockHistoryService.getAllScanResults.mockRejectedValue(new Error('Storage error'));

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(getByText('Unable to Load History')).toBeTruthy();
        expect(getByText('Failed to load scan history')).toBeTruthy();
      });
    });

    it('should allow retry after error', async () => {
      mockHistoryService.getAllScanResults
        .mockRejectedValueOnce(new Error('Storage error'))
        .mockResolvedValueOnce([mockScanResult]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(getByText('Try Again')).toBeTruthy();
      });

      fireEvent.press(getByText('Try Again'));

      await waitFor(() => {
        expect(getByText('🌱 Healthy')).toBeTruthy();
      });
    });
  });

  describe('date formatting', () => {
    it('should format recent dates correctly', async () => {
      const recentScanResult = {
        ...mockScanResult,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      };

      mockHistoryService.getAllScanResults.mockResolvedValue([recentScanResult]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(getByText('Just now')).toBeTruthy();
      });
    });

    it('should format hours ago correctly', async () => {
      const hoursScanResult = {
        ...mockScanResult,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      };

      mockHistoryService.getAllScanResults.mockResolvedValue([hoursScanResult]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(getByText('2h ago')).toBeTruthy();
      });
    });

    it('should format yesterday correctly', async () => {
      const yesterdayScanResult = {
        ...mockScanResult,
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
      };

      mockHistoryService.getAllScanResults.mockResolvedValue([yesterdayScanResult]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(getByText('Yesterday')).toBeTruthy();
      });
    });
  });

  describe('plant type display', () => {
    it('should show plant type when available', async () => {
      const scanWithPlantType = {
        ...mockScanResult,
        plantType: 'Rose',
      };

      mockHistoryService.getAllScanResults.mockResolvedValue([scanWithPlantType]);

      const { getByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(getByText('Plant: Rose')).toBeTruthy();
      });
    });

    it('should not show plant type section when not available', async () => {
      mockHistoryService.getAllScanResults.mockResolvedValue([mockScanResult]);

      const { queryByText } = render(
        <HistoryList onItemPress={mockOnItemPress} />
      );

      await waitFor(() => {
        expect(queryByText(/Plant:/)).toBeNull();
      });
    });
  });
});