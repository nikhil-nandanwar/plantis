import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Result {
  status: 'healthy' | 'diseased';
  confidence: number;
}

interface ResultScreenProps {
  imageUri: string;
  result: Result | null;
  onNewScan: () => void;
  onBack: () => void;
}

export default function ResultScreen({ imageUri, result, onNewScan, onBack }: ResultScreenProps) {
  if (!result) {
    return (
      <View className="flex-1 bg-green-50 justify-center items-center">
        <Text className="text-lg text-gray-600">Analyzing your plant...</Text>
      </View>
    );
  }

  const isHealthy = result.status === 'healthy';
  const confidencePercent = Math.round(result.confidence * 100);

  const getStatusMessage = () => {
    if (isHealthy) {
      return confidencePercent > 80
        ? "Great news! Your plant looks healthy 🌱"
        : "Your plant appears to be healthy, but keep monitoring it.";
    } else {
      return confidencePercent > 80
        ? "Your plant might need attention 🚨"
        : "There may be some issues with your plant. Consider getting a second opinion.";
    }
  };

  const getCareTips = () => {
    if (isHealthy) {
      return [
        "Continue providing adequate sunlight and water",
        "Maintain consistent soil moisture",
        "Regularly check for pests",
        "Ensure proper air circulation"
      ];
    } else {
      return [
        "Check soil moisture - over/under watering can cause issues",
        "Inspect for pests or diseases on other parts of the plant",
        "Ensure adequate sunlight exposure",
        "Consider repotting if roots are crowded",
        "Consult a local plant expert for specific treatment"
      ];
    }
  };

  return (
    <View className="flex-1 bg-green-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-6 px-6 rounded-b-3xl">
        <Text className="text-3xl font-bold text-white text-center">Scan Result</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Image Preview */}
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Scanned Image</Text>
          <View className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
            {/* Note: In a real app, you'd use Image component with the uri */}
            <View className="w-full h-full bg-green-100 items-center justify-center">
              <Text className="text-4xl">🌿</Text>
              <Text className="text-gray-600 mt-2">Plant Image</Text>
            </View>
          </View>
        </View>

        {/* Result Card */}
        <View className={`rounded-2xl p-6 mb-6 shadow-sm ${isHealthy ? 'bg-green-100 border border-green-200' : 'bg-orange-100 border border-orange-200'}`}>
          <View className="flex-row items-center mb-3">
            <Text className="text-3xl mr-3">{isHealthy ? '✅' : '⚠️'}</Text>
            <Text className={`text-xl font-bold ${isHealthy ? 'text-green-800' : 'text-orange-800'}`}>
              {isHealthy ? 'Healthy Leaf' : 'Diseased Leaf'}
            </Text>
          </View>

          <Text className={`text-base mb-3 ${isHealthy ? 'text-green-700' : 'text-orange-700'}`}>
            {getStatusMessage()}
          </Text>

          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600 mr-2">Confidence:</Text>
            <Text className={`text-lg font-semibold ${isHealthy ? 'text-green-800' : 'text-orange-800'}`}>
              {confidencePercent}%
            </Text>
          </View>
        </View>

        {/* Care Tips */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">💡 Care Tips</Text>
          {getCareTips().map((tip, index) => (
            <View key={index} className="flex-row items-start mb-3">
              <Text className="text-green-600 mr-3 mt-1">•</Text>
              <Text className="text-gray-700 flex-1">{tip}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-8">
          <TouchableOpacity
            className="bg-green-600 py-4 rounded-full"
            onPress={onNewScan}
          >
            <Text className="text-white text-lg font-semibold text-center">Scan Another Plant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-200 py-4 rounded-full"
            onPress={onBack}
          >
            <Text className="text-gray-700 text-lg font-semibold text-center">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}