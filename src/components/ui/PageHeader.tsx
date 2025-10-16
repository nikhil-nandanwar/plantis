import React from 'react';
import { View, Text } from 'react-native';
import BackButton from './BackButton';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function PageHeader({ title, subtitle, icon, showBack = false, onBack }: PageHeaderProps) {
  return (
    <View className="bg-green-600 pt-12 pb-6 px-6 rounded-b-3xl">
      {showBack && <BackButton onPress={onBack} />}
      {icon && <Text className="text-4xl text-center mb-2">{icon}</Text>}
      <Text className="text-3xl font-bold text-white text-center">{title}</Text>
      {subtitle && <Text className="text-white text-center mt-2 opacity-90">{subtitle}</Text>}
    </View>
  );
}
