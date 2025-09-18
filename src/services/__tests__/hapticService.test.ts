import { HapticService } from '../hapticService';
import * as Haptics from 'expo-haptics';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

describe('HapticService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('impact feedback', () => {
    it('should call light impact feedback', () => {
      HapticService.light();
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('should call medium impact feedback', () => {
      HapticService.medium();
      expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
    });

    it('should call heavy impact feedback', () => {
      HapticService.heavy();
      expect(Haptics.impactAsync).toHaveBeenCalledWith('heavy');
    });
  });

  describe('notification feedback', () => {
    it('should call success notification feedback', () => {
      HapticService.success();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
    });

    it('should call warning notification feedback', () => {
      HapticService.warning();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith('warning');
    });

    it('should call error notification feedback', () => {
      HapticService.error();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith('error');
    });
  });

  describe('selection feedback', () => {
    it('should call selection feedback', () => {
      HapticService.selection();
      expect(Haptics.selectionAsync).toHaveBeenCalled();
    });
  });

  describe('custom patterns', () => {
    it('should call scan complete pattern', async () => {
      jest.useFakeTimers();
      
      HapticService.scanComplete();
      
      expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
      
      // Fast forward time to trigger the second haptic
      jest.advanceTimersByTime(100);
      
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(2);
      
      jest.useRealTimers();
    });

    it('should call scan start feedback', () => {
      HapticService.scanStart();
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('should call progress milestone feedback', () => {
      HapticService.progressMilestone();
      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });
  });

  describe('error handling', () => {
    it('should handle haptic errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(new Error('Haptic not available'));

      expect(() => HapticService.light()).not.toThrow();
      
      // Wait for the promise to resolve
      return new Promise(resolve => {
        setTimeout(() => {
          expect(consoleSpy).toHaveBeenCalledWith('Haptic feedback not available:', expect.any(Error));
          consoleSpy.mockRestore();
          resolve(undefined);
        }, 0);
      });
    });
  });
});