import * as Haptics from 'expo-haptics';

/**
 * Service for providing haptic feedback throughout the app
 */
export class HapticService {
  /**
   * Light haptic feedback for button taps and interactions
   */
  static light(): void {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Medium haptic feedback for important actions
   */
  static medium(): void {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Heavy haptic feedback for critical actions
   */
  static heavy(): void {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Success haptic feedback for positive outcomes
   */
  static success(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Warning haptic feedback for cautionary actions
   */
  static warning(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Error haptic feedback for failed actions
   */
  static error(): void {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Selection haptic feedback for picker/selector changes
   */
  static selection(): void {
    try {
      Haptics.selectionAsync();
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Custom haptic pattern for scan completion
   */
  static scanComplete(): void {
    try {
      // Double tap pattern for scan completion
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 100);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Custom haptic pattern for scan start
   */
  static scanStart(): void {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Custom haptic pattern for progress milestones
   */
  static progressMilestone(): void {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }
}