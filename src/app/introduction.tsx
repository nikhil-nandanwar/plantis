import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Introduction() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-green-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-8 px-6 rounded-b-3xl">
        <Text className="text-4xl font-bold text-white text-center">🌱</Text>
        <Text className="text-3xl font-bold text-white text-center mt-2">Welcome to Plantis</Text>
        <Text className="text-white text-center mt-2 opacity-90">Your AI Plant Health Companion</Text>
      </View>

      {/* Main Content */}
      <View className="px-6 pt-8">
        {/* Introduction Text */}
        <Text className="text-2xl font-semibold text-green-800 text-center mb-4">
          Discover Plant Health with AI
        </Text>
        <Text className="text-base text-gray-600 text-center mb-8 leading-6">
          Plantis uses advanced artificial intelligence to analyze your plant leaves and provide 
          instant health assessments. Whether you're a gardening enthusiast or a professional botanist, 
          our app helps you keep your plants thriving.
        </Text>

        {/* Features Section */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-green-800 mb-6 text-center">
            What You Can Do
          </Text>
          
          <View className="space-y-4">
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <View className="flex-row items-center mb-3">
                <Text className="text-3xl mr-4">📷</Text>
                <Text className="text-lg font-semibold text-gray-800">Smart Image Analysis</Text>
              </View>
              <Text className="text-gray-600 leading-5">
                Simply take a photo of any plant leaf or upload from your gallery. Our AI instantly analyzes the image.
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <View className="flex-row items-center mb-3">
                <Text className="text-3xl mr-4">🤖</Text>
                <Text className="text-lg font-semibold text-gray-800">AI-Powered Detection</Text>
              </View>
              <Text className="text-gray-600 leading-5">
                Advanced machine learning algorithms detect diseases, nutrient deficiencies, and overall plant health.
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <View className="flex-row items-center mb-3">
                <Text className="text-3xl mr-4">💚</Text>
                <Text className="text-lg font-semibold text-gray-800">Expert Recommendations</Text>
              </View>
              <Text className="text-gray-600 leading-5">
                Get personalized care tips, treatment suggestions, and preventive measures for your plants.
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <View className="flex-row items-center mb-3">
                <Text className="text-3xl mr-4">📚</Text>
                <Text className="text-lg font-semibold text-gray-800">Scan History</Text>
              </View>
              <Text className="text-gray-600 leading-5">
                Keep track of all your plant scans and monitor their health progress over time.
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-green-800 mb-6 text-center">
            How It Works
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="bg-green-600 rounded-full w-8 h-8 items-center justify-center mr-4">
                <Text className="text-white font-bold">1</Text>
              </View>
              <Text className="text-gray-700 flex-1">Capture or upload a clear photo of a plant leaf</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="bg-green-600 rounded-full w-8 h-8 items-center justify-center mr-4">
                <Text className="text-white font-bold">2</Text>
              </View>
              <Text className="text-gray-700 flex-1">Our AI analyzes the image for health indicators</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="bg-green-600 rounded-full w-8 h-8 items-center justify-center mr-4">
                <Text className="text-white font-bold">3</Text>
              </View>
              <Text className="text-gray-700 flex-1">Receive instant results with care recommendations</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-green-600 px-8 py-4 rounded-full"
            onPress={() => router.push('/input')}
          >
            <Text className="text-white text-lg font-semibold text-center">Start Scanning Plants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-100 px-8 py-4 rounded-full border border-green-200"
            onPress={() => router.push('/')}
          >
            <Text className="text-green-700 text-lg font-semibold text-center">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}