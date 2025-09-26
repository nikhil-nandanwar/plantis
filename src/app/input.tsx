import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export default function Input() {
  const router = useRouter();
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
        // Navigate to output page with the image URI
        router.push({
          pathname: '/output',
          params: { imageUri: compressedUri }
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture/select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-green-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-6 px-6 rounded-b-3xl">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="absolute left-6 top-12 z-10"
        >
          <Text className="text-white text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white text-center">🌱 Plant Scanner</Text>
        <Text className="text-white text-center mt-2 opacity-90">Upload Your Plant Image</Text>
      </View>

      {/* Main Content */}
      <View className="px-6 pt-8">
        <Text className="text-2xl font-semibold text-green-800 text-center mb-2">
          Check Your Plant's Health
        </Text>
        <Text className="text-gray-600 text-center mb-8 leading-6">
          Upload a clear photo of a plant leaf for instant AI analysis. Make sure the leaf is well-lit and the image is sharp for best results.
        </Text>

        {/* Tips Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-green-100">
          <Text className="text-lg font-semibold text-green-800 mb-4 text-center">📋 Photo Tips</Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Text className="text-green-600 text-lg mr-3">•</Text>
              <Text className="text-gray-700 flex-1">Ensure good lighting (natural light works best)</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-green-600 text-lg mr-3">•</Text>
              <Text className="text-gray-700 flex-1">Focus on a single leaf or small group of leaves</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-green-600 text-lg mr-3">•</Text>
              <Text className="text-gray-700 flex-1">Avoid blurry or heavily shadowed images</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-green-600 text-lg mr-3">•</Text>
              <Text className="text-gray-700 flex-1">Keep the background simple and uncluttered</Text>
            </View>
          </View>
        </View>

        {/* Upload Options */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-white rounded-2xl p-6 flex-row items-center shadow-sm border border-green-100"
            onPress={() => pickImage(true)}
            disabled={isLoading}
          >
            <View className="bg-green-100 rounded-full p-3 mr-4">
              <Text className="text-3xl">📷</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Take Photo</Text>
              <Text className="text-gray-600">Capture a new image with camera</Text>
            </View>
            <Text className="text-green-600 text-2xl">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-2xl p-6 flex-row items-center shadow-sm border border-green-100"
            onPress={() => pickImage(false)}
            disabled={isLoading}
          >
            <View className="bg-green-100 rounded-full p-3 mr-4">
              <Text className="text-3xl">🖼️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Choose from Gallery</Text>
              <Text className="text-gray-600">Select an existing photo</Text>
            </View>
            <Text className="text-green-600 text-2xl">→</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Options */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-green-100 rounded-2xl p-4 flex-row items-center justify-center"
            onPress={() => router.push('/introduction')}
          >
            <Text className="text-2xl mr-3">ℹ️</Text>
            <Text className="text-lg font-semibold text-green-800">Learn How It Works</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-50 rounded-2xl p-4 flex-row items-center justify-center border border-blue-100"
            onPress={() => Alert.alert('Coming Soon', 'Scan history feature will be available soon!')}
          >
            <Text className="text-2xl mr-3">📚</Text>
            <Text className="text-lg font-semibold text-blue-800">View Scan History</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View className="items-center bg-white rounded-2xl p-6 shadow-sm">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-gray-600 mt-3 text-center">Processing image...</Text>
            <Text className="text-gray-500 text-sm mt-1 text-center">This may take a few seconds</Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}