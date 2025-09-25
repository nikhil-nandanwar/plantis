import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UploadScreenProps {
  onImageSelected: (imageUri: string) => void;
  onHistoryPress: () => void;
}

export default function UploadScreen({ onImageSelected, onHistoryPress }: UploadScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    return cameraPermission.granted && libraryPermission.granted;
  };

  const compressImage = async (uri: string) => {
    const manipulatedImage = await manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: SaveFormat.JPEG }
    );
    return manipulatedImage.uri;
  };

  const pickImage = async (fromCamera: boolean) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera and photo library permissions are required to use this feature.');
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (fromCamera) {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        const compressedUri = await compressImage(result.assets[0].uri);
        onImageSelected(compressedUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture/select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-green-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-6 px-6 rounded-b-3xl">
        <Text className="text-3xl font-bold text-white text-center">🌱 Plantis</Text>
        <Text className="text-white text-center mt-2">Plant Health Scanner</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-semibold text-green-800 text-center mb-2">
          Check Your Plant's Health
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Upload a clear photo of a plant leaf for instant AI analysis
        </Text>

        {/* Upload Options */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-white rounded-2xl p-6 flex-row items-center shadow-sm border border-green-100"
            onPress={() => pickImage(true)}
            disabled={isLoading}
          >
            <Text className="text-4xl mr-4">📷</Text>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Take Photo</Text>
              <Text className="text-gray-600">Capture a new image with camera</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-2xl p-6 flex-row items-center shadow-sm border border-green-100"
            onPress={() => pickImage(false)}
            disabled={isLoading}
          >
            <Text className="text-4xl mr-4">🖼️</Text>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Choose from Gallery</Text>
              <Text className="text-gray-600">Select an existing photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* History Button */}
        <TouchableOpacity
          className="bg-green-100 rounded-2xl p-4 flex-row items-center justify-center mb-8"
          onPress={onHistoryPress}
        >
          <Text className="text-2xl mr-3">📚</Text>
          <Text className="text-lg font-semibold text-green-800">View Scan History</Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {isLoading && (
          <View className="items-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-gray-600 mt-2">Processing image...</Text>
          </View>
        )}
      </View>
    </View>
  );
}