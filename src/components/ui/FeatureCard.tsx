import React from 'react';
import { View, Text } from 'react-native';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
      <View className="flex-row items-center mb-3">
        <Text className="text-3xl mr-4">{icon}</Text>
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      </View>
      <Text className="text-gray-600 leading-5">{description}</Text>
    </View>
  );
}
