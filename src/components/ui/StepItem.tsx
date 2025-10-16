import React from 'react';
import { View, Text } from 'react-native';

interface StepItemProps {
  number: number;
  description: string;
}

export default function StepItem({ number, description }: StepItemProps) {
  return (
    <View className="flex-row items-center">
      <View className="bg-green-600 rounded-full w-8 h-8 items-center justify-center mr-4">
        <Text className="text-white font-bold">{number}</Text>
      </View>
      <Text className="text-gray-700 flex-1">{description}</Text>
    </View>
  );
}
