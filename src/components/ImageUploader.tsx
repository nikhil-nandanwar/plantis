import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScanResult, ErrorState } from '../types';
import { compressImage, validateImage, calculateOptimalQuality } from '../utils/imageUtils';
import { HapticService } from '../services/hapticService';
import { permissionService } from '../services/permissionService';
import { networkService } from '../services/networkService';
import { queueService } from '../services/queueService';
import { ErrorService } from '../services/errorService';
import { Typography } from './ui';
import { ErrorDisplay } from './ErrorDisplay';
import { NetworkStatus } from './NetworkStatus';

interface ImageUploaderProps {
  onImageSelected: (imageUri: string) => void;
  onImageUploaded: (result: ScanResult) => void;
  onError?: (error: ErrorState) => void;
}

interface ImagePreviewState {
  uri: string;
  isVisible: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onImageUploaded,
  onError,
}) => {
  const [imagePreview, setImagePreview] = useState<ImagePreviewState>({
    uri: '',
    isVisible: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '', retryable: false });

  // Clear any existing errors
  const clearError = () => {
    setError({ hasError: false, message: '', retryable: false });
  };

  // Handle errors with user feedback
  const handleError = (error: unknown) => {
    const errorState = ErrorService.handleError(error);
    setError(errorState);
    onError?.(errorState);
  };

  // Process and validate image with comprehensive error handling
  const processImage = async (uri: string): Promise<string> => {
    try {
      // First validate the image
      const validation = await validateImage(uri);
      if (!validation.isValid) {
        throw ErrorService.createImageError(validation.error || 'Invalid image file');
      }

      // Calculate optimal quality based on file size
      const quality = validation.fileSize ? calculateOptimalQuality(validation.fileSize) : 0.8;

      // Compress the image
      const compressedUri = await compressImage(uri, {
        maxWidth: 1024,
        maxHeight: 1024,
        quality,
      });

      return compressedUri;
    } catch (error) {
      console.error('Image processing failed:', error);
      if (error instanceof Error) {
        throw ErrorService.createImageError(error.message);
      }
      throw ErrorService.createImageError('Failed to process image');
    }
  };

  // Handle camera capture with comprehensive error handling
  const handleCameraCapture = async () => {
    HapticService.light();
    clearError();

    try {
      const hasPermission = await permissionService.ensureCameraPermission();
      if (!hasPermission) {
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setImagePreview({ uri: imageUri, isVisible: true });
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error('Camera capture error:', error);
      handleError(ErrorService.createImageError('Failed to capture image. Please try again.'));
    }
  };

  // Handle gallery selection with comprehensive error handling
  const handleGallerySelection = async () => {
    HapticService.light();
    clearError();

    try {
      const hasPermission = await permissionService.ensureMediaLibraryPermission();
      if (!hasPermission) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setImagePreview({ uri: imageUri, isVisible: true });
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error('Gallery selection error:', error);
      handleError(ErrorService.createImageError('Failed to select image. Please try again.'));
    }
  };

  // Handle retake/reselect
  const handleRetake = () => {
    HapticService.light();
    setImagePreview({ uri: '', isVisible: false });
  };

  // Handle proceed with analysis with offline queue support
  const handleProceed = async () => {
    if (!imagePreview.uri) return;

    HapticService.medium();
    setIsProcessing(true);
    clearError();

    try {
      // Process and compress image
      const processedUri = await processImage(imagePreview.uri);
      
      // Check network connectivity
      if (!networkService.isConnected()) {
        // Add to offline queue
        const queueId = await queueService.addToQueue(processedUri);
        
        // Show offline message
        Alert.alert(
          'Offline Mode',
          'Your scan has been queued and will be processed when you\'re back online.',
          [{ text: 'OK' }]
        );
        
        setImagePreview({ uri: '', isVisible: false });
        return;
      }

      // Create a mock scan result for now (will be replaced with actual API call in later tasks)
      const mockResult: ScanResult = {
        id: Date.now().toString(),
        imageUri: processedUri,
        status: 'healthy',
        confidence: 0.95,
        timestamp: new Date(),
        tips: ['Your plant looks healthy! Continue current care routine.'],
      };

      onImageUploaded(mockResult);
      setImagePreview({ uri: '', isVisible: false });
    } catch (error) {
      console.error('Image processing error:', error);
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (imagePreview.isVisible) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center p-4">
          <Typography variant="h3" weight="bold" align="center" className="mb-4">
            Preview Your Image
          </Typography>
          
          <View className="w-80 h-80 rounded-2xl overflow-hidden mb-6 shadow-nature border-2 border-primary-light">
            <Image
              source={{ uri: imagePreview.uri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={handleRetake}
              disabled={isProcessing}
              className="bg-white border-2 border-primary-green px-6 py-3 rounded-xl press-scale hover-lift"
              activeOpacity={0.8}
            >
              <Text className="text-primary-green font-semibold text-base">
                Retake
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleProceed}
              disabled={isProcessing}
              className="bg-primary-green px-6 py-3 rounded-xl shadow-nature press-scale"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">
                {isProcessing ? 'Processing...' : 'Analyze Plant'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      {/* Network Status */}
      <NetworkStatus className="absolute top-4 left-4 right-4 z-10" />

      <Typography variant="h2" weight="bold" align="center" className="mb-2">
        Capture Your Plant
      </Typography>
      <Typography variant="body1" color="secondary" align="center" className="mb-8 max-w-sm">
        Take a photo or select from gallery to analyze your plant's health
      </Typography>

      {/* Error Display */}
      {error.hasError && (
        <ErrorDisplay
          error={error}
          onRetry={clearError}
          onDismiss={clearError}
          compact
          className="mb-4 w-full max-w-sm"
        />
      )}

      <View className="gap-4 w-full max-w-sm">
        <TouchableOpacity
          onPress={handleCameraCapture}
          className="bg-primary-green px-6 py-4 rounded-xl flex-row items-center justify-center gap-3 shadow-nature press-scale"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-lg">📷</Text>
          <Text className="text-white font-semibold text-base">
            Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGallerySelection}
          className="bg-white border-2 border-primary-green px-6 py-4 rounded-xl flex-row items-center justify-center gap-3 press-scale hover-lift"
          activeOpacity={0.8}
        >
          <Text className="text-primary-green font-semibold text-lg">🖼️</Text>
          <Text className="text-primary-green font-semibold text-base">
            Choose from Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};