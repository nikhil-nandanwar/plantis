import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';
import { PermissionState } from '../types';
import { ErrorService } from './errorService';

/**
 * Service for handling app permissions with comprehensive error handling
 */
export class PermissionService {
  private static instance: PermissionService;
  private permissionState: PermissionState = {
    camera: 'undetermined',
    mediaLibrary: 'undetermined',
  };

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  /**
   * Initialize permission service by checking current permissions
   */
  async initialize(): Promise<void> {
    await this.checkAllPermissions();
  }

  /**
   * Get current permission state
   */
  getPermissionState(): PermissionState {
    return { ...this.permissionState };
  }

  /**
   * Request camera permission with user-friendly error handling
   */
  async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      this.permissionState.camera = status;

      if (status === 'granted') {
        return true;
      }

      if (status === 'denied') {
        this.showCameraPermissionError();
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      ErrorService.showErrorAlert(
        ErrorService.handleError(ErrorService.createPermissionError('Camera'))
      );
      return false;
    }
  }

  /**
   * Request media library permission with user-friendly error handling
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      this.permissionState.mediaLibrary = status;

      if (status === 'granted') {
        return true;
      }

      if (status === 'denied') {
        this.showMediaLibraryPermissionError();
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      ErrorService.showErrorAlert(
        ErrorService.handleError(ErrorService.createPermissionError('Media Library'))
      );
      return false;
    }
  }

  /**
   * Check if camera permission is granted
   */
  async hasCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      this.permissionState.camera = status;
      return status === 'granted';
    } catch (error) {
      console.error('Error checking camera permission:', error);
      return false;
    }
  }

  /**
   * Check if media library permission is granted
   */
  async hasMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      this.permissionState.mediaLibrary = status;
      return status === 'granted';
    } catch (error) {
      console.error('Error checking media library permission:', error);
      return false;
    }
  }

  /**
   * Check all permissions and update state
   */
  async checkAllPermissions(): Promise<void> {
    await Promise.all([
      this.hasCameraPermission(),
      this.hasMediaLibraryPermission(),
    ]);
  }

  /**
   * Request camera permission or show settings redirect if previously denied
   */
  async ensureCameraPermission(): Promise<boolean> {
    const hasPermission = await this.hasCameraPermission();
    
    if (hasPermission) {
      return true;
    }

    if (this.permissionState.camera === 'denied') {
      this.showCameraPermissionError();
      return false;
    }

    return await this.requestCameraPermission();
  }

  /**
   * Request media library permission or show settings redirect if previously denied
   */
  async ensureMediaLibraryPermission(): Promise<boolean> {
    const hasPermission = await this.hasMediaLibraryPermission();
    
    if (hasPermission) {
      return true;
    }

    if (this.permissionState.mediaLibrary === 'denied') {
      this.showMediaLibraryPermissionError();
      return false;
    }

    return await this.requestMediaLibraryPermission();
  }

  /**
   * Show camera permission error with settings redirect
   */
  private showCameraPermissionError(): void {
    ErrorService.showPermissionError(
      'Camera Permission Required',
      'Plantis needs camera access to take photos of your plants. Please enable camera permission in your device settings.',
    );
  }

  /**
   * Show media library permission error with settings redirect
   */
  private showMediaLibraryPermissionError(): void {
    ErrorService.showPermissionError(
      'Photo Library Permission Required',
      'Plantis needs photo library access to select images from your gallery. Please enable photo library permission in your device settings.',
    );
  }

  /**
   * Show general permission error for multiple permissions
   */
  showGeneralPermissionError(): void {
    Alert.alert(
      'Permissions Required',
      'Plantis needs camera and photo library access to analyze your plant images. Please enable these permissions in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => {
            Linking.openSettings().catch(() => {
              Alert.alert('Error', 'Unable to open settings. Please open settings manually and enable camera and photo library permissions for Plantis.');
            });
          }
        },
      ]
    );
  }

  /**
   * Check if all required permissions are granted
   */
  async hasAllRequiredPermissions(): Promise<boolean> {
    const [hasCamera, hasMediaLibrary] = await Promise.all([
      this.hasCameraPermission(),
      this.hasMediaLibraryPermission(),
    ]);

    return hasCamera && hasMediaLibrary;
  }

  /**
   * Request all required permissions
   */
  async requestAllPermissions(): Promise<boolean> {
    const [cameraGranted, mediaLibraryGranted] = await Promise.all([
      this.requestCameraPermission(),
      this.requestMediaLibraryPermission(),
    ]);

    return cameraGranted && mediaLibraryGranted;
  }
}

// Export singleton instance
export const permissionService = PermissionService.getInstance();