import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Share } from 'react-native';
import { HistoryItemDetail } from '../HistoryItemDetail';
import { historyService } from '../../../services/historyService';
import { ScanResult } from '../../../types';

// Mock the history service
jest.mock('../../../services/historyService', () => ({
  historyService: {
    deleteScanResult: jest.fn(),
  },
}));

// Mock Alert and Share
jest.spyOn(Alert, 'alert');
jest.spyOn(Share, 'share');

const mockHistoryService = historyService as jest.Mocked<typeof historyService>;

describe('HistoryItemDetail', () => {
  const mockHealthyScanResult: ScanResult = {
    id: 'test-id-1',
    imageUri: 'file://test-image.jpg',
    status: 'healthy',
    confidence: 0.95,
    timestamp: new Date('2024-01-15T10:30:00Z'),
    tips: ['Keep up the good work!', 'Continue current care routine.'],
    plantType: 'Rose',
  };

  const mockDiseasedScanResult: ScanResult = {
    id: 'test-id-2',
    imageUri: 'file://test-image-2.jpg',
    status: 'diseased',
    confidence: 0.87,
    timestamp: new Date('2024-01-14T09:15:00Z'),
    tips: ['Check for overwatering', 'Improve drainage'],
  };

  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('healthy plant display', () => {
    it('should display healthy plant information correctly', () => {
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Scan Details')).toBeTruthy();
      expect(getByText('🌱')).toBeTruthy();
      expect(getByText('Healthy Plant')).toBeTruthy();
      expect(getByText('95%')).toBeTruthy();
      expect(getByText('Great news! Your plant looks very healthy! 🌟')).toBeTruthy();
    });

    it('should display healthy plant tips', () => {
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('💡 Care Tips')).toBeTruthy();
      expect(getByText('Keep up the good work!')).toBeTruthy();
      expect(getByText('Continue current care routine.')).toBeTruthy();
    });
  });

  describe('diseased plant display', () => {
    it('should display diseased plant information correctly', () => {
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockDiseasedScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('🚨')).toBeTruthy();
      expect(getByText('Needs Attention')).toBeTruthy();
      expect(getByText('87%')).toBeTruthy();
      expect(getByText('Your plant might need some care. 🔍')).toBeTruthy();
    });

    it('should display diseased plant tips', () => {
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockDiseasedScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Check for overwatering')).toBeTruthy();
      expect(getByText('Improve drainage')).toBeTruthy();
    });
  });

  describe('scan information display', () => {
    it('should display scan information correctly', () => {
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Scan Information')).toBeTruthy();
      expect(getByText('Monday, January 15, 2024 at 10:30 AM')).toBeTruthy();
      expect(getByText('test-id-...')).toBeTruthy();
      expect(getByText('Rose')).toBeTruthy();
    });

    it('should not show plant type when not available', () => {
      const scanWithoutPlantType = { ...mockHealthyScanResult, plantType: undefined };
      
      const { queryByText } = render(
        <HistoryItemDetail
          scanResult={scanWithoutPlantType}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(queryByText('Plant Type:')).toBeNull();
    });
  });

  describe('confidence level messages', () => {
    it('should show high confidence message for healthy plants', () => {
      const highConfidenceHealthy = { ...mockHealthyScanResult, confidence: 0.95 };
      
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={highConfidenceHealthy}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Great news! Your plant looks very healthy! 🌟')).toBeTruthy();
    });

    it('should show medium confidence message for healthy plants', () => {
      const mediumConfidenceHealthy = { ...mockHealthyScanResult, confidence: 0.75 };
      
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mediumConfidenceHealthy}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Your plant appears to be healthy! 🌱')).toBeTruthy();
    });

    it('should show low confidence message for healthy plants', () => {
      const lowConfidenceHealthy = { ...mockHealthyScanResult, confidence: 0.65 };
      
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={lowConfidenceHealthy}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Your plant seems healthy, but keep monitoring it. 👀')).toBeTruthy();
    });

    it('should show high confidence message for diseased plants', () => {
      const highConfidenceDiseased = { ...mockDiseasedScanResult, confidence: 0.95 };
      
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={highConfidenceDiseased}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Your plant needs immediate attention! 🚨')).toBeTruthy();
    });

    it('should show low confidence message for diseased plants', () => {
      const lowConfidenceDiseased = { ...mockDiseasedScanResult, confidence: 0.65 };
      
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={lowConfidenceDiseased}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Keep an eye on your plant - there might be early signs of issues. 👁️')).toBeTruthy();
    });
  });

  describe('navigation and actions', () => {
    it('should call onClose when back button is pressed', () => {
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('←'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when "Back to History" button is pressed', () => {
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('Back to History'));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('share functionality', () => {
    it('should share scan result when share button is pressed', async () => {
      (Share.share as jest.Mock).mockResolvedValue({ action: 'sharedAction' });

      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('📤'));

      await waitFor(() => {
        expect(Share.share).toHaveBeenCalledWith({
          message: expect.stringContaining('Plant Health Scan Result 🌿'),
          title: 'Plant Health Scan Result',
        });
      });
    });

    it('should handle share errors gracefully', async () => {
      (Share.share as jest.Mock).mockRejectedValue(new Error('Share failed'));

      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('📤'));

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Failed to share scan result:', expect.any(Error));
      });
    });
  });

  describe('delete functionality', () => {
    it('should show delete confirmation when delete button is pressed', () => {
      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('🗑️'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Scan Result',
        'Are you sure you want to delete this scan result? This action cannot be undone.',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Delete' }),
        ])
      );
    });

    it('should delete scan result when confirmed', async () => {
      mockHistoryService.deleteScanResult.mockResolvedValue(true);

      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('🗑️'));

      // Simulate pressing Delete in the alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteAction = alertCall[2].find((action: any) => action.text === 'Delete');
      await deleteAction.onPress();

      await waitFor(() => {
        expect(mockHistoryService.deleteScanResult).toHaveBeenCalledWith('test-id-1');
        expect(mockOnDelete).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should handle delete failure', async () => {
      mockHistoryService.deleteScanResult.mockResolvedValue(false);

      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('🗑️'));

      // Simulate pressing Delete in the alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteAction = alertCall[2].find((action: any) => action.text === 'Delete');
      await deleteAction.onPress();

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to delete scan result');
      });
    });

    it('should handle delete error', async () => {
      mockHistoryService.deleteScanResult.mockRejectedValue(new Error('Delete error'));

      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('🗑️'));

      // Simulate pressing Delete in the alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteAction = alertCall[2].find((action: any) => action.text === 'Delete');
      await deleteAction.onPress();

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to delete scan result');
      });
    });

    it('should show loading state during delete', async () => {
      mockHistoryService.deleteScanResult.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(true), 100))
      );

      const { getByText } = render(
        <HistoryItemDetail
          scanResult={mockHealthyScanResult}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.press(getByText('🗑️'));

      // Simulate pressing Delete in the alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteAction = alertCall[2].find((action: any) => action.text === 'Delete');
      deleteAction.onPress();

      // Should show loading state
      expect(getByText('⏳')).toBeTruthy();
    });
  });

  describe('tips section', () => {
    it('should not show tips section when no tips are available', () => {
      const scanWithoutTips = { ...mockHealthyScanResult, tips: undefined };
      
      const { queryByText } = render(
        <HistoryItemDetail
          scanResult={scanWithoutTips}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(queryByText('💡 Care Tips')).toBeNull();
    });

    it('should not show tips section when tips array is empty', () => {
      const scanWithEmptyTips = { ...mockHealthyScanResult, tips: [] };
      
      const { queryByText } = render(
        <HistoryItemDetail
          scanResult={scanWithEmptyTips}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(queryByText('💡 Care Tips')).toBeNull();
    });
  });
});