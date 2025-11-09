import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useImagePicker } from '../hooks/useImagePicker';
import PageHeader from '../components/ui/PageHeader';
import PhotoTips from '../components/ui/PhotoTips';
import axios from 'axios';

export default function Input() {
  const router = useRouter();
  const { pickImage, isLoading } = useImagePicker();

  const handleCall = async (link: string, uri: string) => {
    try {
      const formData = new FormData();

      if (uri.startsWith("blob:")) {
        // For web: convert blob URL to actual Blob
        const blob = await fetch(uri).then(res => res.blob());
        formData.append("image", blob, "image.jpg");
      } else {
        // For mobile (Android/iOS): send file directly
        formData.append("image", {
          uri,
          name: "image.jpg",
          type: "image/jpeg",
        } as any);
      }

      const response = await axios.post(link, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Server response:", response.data);

      router.push({
        pathname: '/output',
        params: { result: JSON.stringify(response.data) },
      })
    } catch (err) {
      console.error("❌ handleCall input.tsx", err);
    }
  };


  const handleImagePick = async (fromCamera: boolean) => {
    const uri = await pickImage(fromCamera);
    if (uri) {
      handleCall("http://192.168.249.157:5000/predict", uri);
      router.push({
        pathname: '/output',
        params: { imageUri: uri }
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-green-50">
      <PageHeader
        icon="🌱"
        title="Plant Scanner"
        subtitle="Upload Your Plant Image"
        showBack
      />

      <View className="px-6 pt-8">
        <Text className="text-2xl font-semibold text-green-800 text-center mb-2">
          Check Your Plant's Health
        </Text>
        <Text className="text-gray-600 text-center mb-8 leading-6">
          Upload a clear photo of a plant leaf for instant AI analysis. Make sure the leaf is well-lit and the image is sharp for best results.
        </Text>

        <PhotoTips />

        {/* Upload Options */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-white rounded-2xl p-6 flex-row items-center shadow-sm border border-green-100"
            onPress={() => handleImagePick(true)}
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
            onPress={() => handleImagePick(false)}
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
            onPress={() => router.push('/')}
          >
            <Text className="text-2xl mr-3">🏠</Text>
            <Text className="text-lg font-semibold text-green-800">Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-50 rounded-2xl p-4 flex-row items-center justify-center border border-blue-100"
            onPress={() => router.push('/history')}
          >
            <Text className="text-2xl mr-3">📚</Text>
            <Text className="text-lg font-semibold text-blue-800">View Scan History</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View className="items-center bg-white rounded-2xl p-6 shadow-sm">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-graty-600 mt-3 text-center">Processing image...</Text>
            <Text className="text-gray-500 text-sm mt-1 text-center">This may take a few seconds</Text>
          </View>
        )}

        <View className="h-8" />
      </View>
    </ScrollView>
  );
}