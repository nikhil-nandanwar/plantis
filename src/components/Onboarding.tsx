import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const handleGetStarted = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  return (
    <View className="flex-1 bg-green-50 justify-center items-center px-6">
      {/* Plantis Logo */}
      <View className="mb-8">
        <Text className="text-6xl">🌱</Text>
        <Text className="text-3xl font-bold text-green-800 text-center mt-2">Plantis</Text>
      </View>

      {/* Welcome Text */}
      <Text className="text-xl text-green-700 text-center mb-4">
        Welcome to Plantis!
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8 leading-6">
        Discover the health of your plants with AI-powered leaf analysis.
        Simply upload a photo of a plant leaf and get instant results.
      </Text>

      {/* Features */}
      <View className="w-full mb-8">
        <View className="flex-row items-center mb-4">
          <Text className="text-2xl mr-3">📷</Text>
          <Text className="text-base text-gray-700">Take photos or choose from gallery</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Text className="text-2xl mr-3">🤖</Text>
          <Text className="text-base text-gray-700">AI analyzes leaf health</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Text className="text-2xl mr-3">💚</Text>
          <Text className="text-base text-gray-700">Get care tips and recommendations</Text>
        </View>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        className="bg-green-600 px-8 py-4 rounded-full w-full max-w-xs"
        onPress={handleGetStarted}
      >
        <Text className="text-white text-lg font-semibold text-center">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}