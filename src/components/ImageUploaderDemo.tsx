import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ImageUploader } from './ImageUploader';
import { ScanResult } from '../types';

/**
 * Demo component to test ImageUploader functionality
 * This serves as an integration test for the ImageUploader component
 */
export const ImageUploaderDemo: React.FC = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [uploadHistory, setUploadHistory] = useState<ScanResult[]>([]);

  const handleImageSelected = (imageUri: string) => {
    console.log('Image selected:', imageUri);
    setSelectedImageUri(imageUri);
  };

  const handleImageUploaded = (result: ScanResult) => {
    console.log('Image uploaded and processed:', result);
    setScanResult(result);
    setUploadHistory(prev => [result, ...prev]);
    setSelectedImageUri('');
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-text-primary mb-4 text-center">
          ImageUploader Demo
        </Text>
        
        {/* Current Status */}
        <View className="mb-6 p-4 bg-white rounded-xl shadow-sm">
          <Text className="text-lg font-semibold mb-2">Current Status:</Text>
          <Text className="text-text-secondary">
            Selected Image: {selectedImageUri ? '✅ Image selected' : '❌ No image selected'}
          </Text>
          <Text className="text-text-secondary">
            Last Result: {scanResult ? `${scanResult.status} (${Math.round(scanResult.confidence * 100)}%)` : '❌ No results yet'}
          </Text>
        </View>

        {/* ImageUploader Component */}
        <View className="mb-6">
          <ImageUploader
            onImageSelected={handleImageSelected}
            onImageUploaded={handleImageUploaded}
          />
        </View>

        {/* Last Scan Result */}
        {scanResult && (
          <View className="mb-6 p-4 bg-white rounded-xl shadow-sm">
            <Text className="text-lg font-semibold mb-2">Last Scan Result:</Text>
            <Text className="text-text-secondary">Status: {scanResult.status}</Text>
            <Text className="text-text-secondary">Confidence: {Math.round(scanResult.confidence * 100)}%</Text>
            <Text className="text-text-secondary">Date: {scanResult.timestamp.toLocaleString()}</Text>
            {scanResult.tips && scanResult.tips.length > 0 && (
              <View className="mt-2">
                <Text className="text-text-secondary font-medium">Tips:</Text>
                {scanResult.tips.map((tip, index) => (
                  <Text key={index} className="text-text-secondary ml-2">• {tip}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <View className="p-4 bg-white rounded-xl shadow-sm">
            <Text className="text-lg font-semibold mb-2">Upload History ({uploadHistory.length}):</Text>
            {uploadHistory.slice(0, 5).map((result, index) => (
              <View key={result.id} className="mb-2 p-2 bg-gray-50 rounded-lg">
                <Text className="text-sm text-text-secondary">
                  {index + 1}. {result.status} ({Math.round(result.confidence * 100)}%) - {result.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            ))}
            {uploadHistory.length > 5 && (
              <Text className="text-sm text-text-secondary italic">
                ... and {uploadHistory.length - 5} more
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};