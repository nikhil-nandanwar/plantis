import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

interface BackButtonProps {
  onPress?: () => void;
  className?: string;
}

export default function BackButton({ onPress, className = "absolute left-6 top-12 z-10" }: BackButtonProps) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className={className}>
      <Text className="text-white text-2xl">←</Text>
    </TouchableOpacity>
  );
}
