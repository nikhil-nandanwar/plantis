import React from 'react';
import { View, Text } from 'react-native';

const tips = [
  'Ensure good lighting (natural light works best)',
  'Focus on a single leaf or small group of leaves',
  'Avoid blurry or heavily shadowed images',
  'Keep the background simple and uncluttered'
];

export default function PhotoTips() {
  return (
    <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-green-100">
      <Text className="text-lg font-semibold text-green-800 mb-4 text-center">📋 Photo Tips</Text>
      <View className="space-y-3">
        {tips.map((tip, index) => (
          <View key={index} className="flex-row items-center">
            <Text className="text-green-600 text-lg mr-3">•</Text>
            <Text className="text-gray-700 flex-1">{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
