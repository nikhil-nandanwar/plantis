import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ScanResult, ErrorState } from '../types';
import { ScanProcessor } from './ScanProcessor';
import { ImageUploader } from './ImageUploader';

/**
 * Demo component showcasing the complete scan processing workflow
 */
export const ScanProcessorDemo: React.FC = () => {
  const [currentImageUri, setCurrentImageUri] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const handleImageSelected = (imageUri: string) => {
    setCurrentImageUri(imageUri);
  };

  const handleImageUploaded = (result: ScanResult) => {
    // This is called from ImageUploader, but we'll handle it in ScanProcessor
    console.log('Image uploaded, starting scan process...');
    setIsScanning(true);
  };

  const handleScanComplete = (result: ScanResult) => {
    console.log('Scan completed successfully:', result);
    setScanHistory(prev => [result, ...prev]);
    setIsScanning(false);
    setCurrentImageUri('');
    
    Alert.alert(
      'Scan Complete!',
      `Your plant is ${result.status} with ${Math.round(result.confidence * 100)}% confidence.`,
      [{ text: 'OK' }]
    );
  };

  const handleScanError = (error: ErrorState) => {
    console.error('Scan failed:', error);
    setIsScanning(false);
    
    Alert.alert(
      'Scan Failed',
      error.message,
      [
        { text: 'Cancel', style: 'cancel' },
        ...(error.retryable ? [{ text: 'Retry', onPress: handleRetry }] : []),
      ]
    );
  };

  const handleRetry = () => {
    if (currentImageUri) {
      setIsScanning(true);
    }
  };

  const handleNewScan = () => {
    setCurrentImageUri('');
    setIsScanning(false);
  };

  const handleViewHistory = () => {
    Alert.alert(
      'Scan History',
      `You have ${scanHistory.length} previous scans.`,
      [{ text: 'OK' }]
    );
  };

  // Show scan processor if we have an image and are scanning
  if (currentImageUri && isScanning) {
    return (
      <ScanProcessor
        imageUri={currentImageUri}
        onScanComplete={handleScanComplete}
        onScanError={handleScanError}
        onRetry={handleRetry}
        onNewScan={handleNewScan}
        onViewHistory={handleViewHistory}
      />
    );
  }

  // Show image uploader by default
  return (
    <View className="flex-1 bg-background">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-text-primary text-center">
          Plant Disease Detection Demo
        </Text>
        <Text className="text-sm text-text-secondary text-center mt-1">
          Scan processing and results display
        </Text>
      </View>

      <ImageUploader
        onImageSelected={handleImageSelected}
        onImageUploaded={handleImageUploaded}
      />

      {/* History Summary */}
      {scanHistory.length > 0 && (
        <View className="p-4 bg-gray-50 border-t border-gray-200">
          <Text className="text-base font-semibold text-text-primary mb-2">
            Recent Scans: {scanHistory.length}
          </Text>
          <TouchableOpacity
            onPress={handleViewHistory}
            className="bg-primary-green px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium text-center">
              View History
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};