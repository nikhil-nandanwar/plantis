import React from 'react';
import { View, ViewProps } from 'react-native';

interface GradientBackgroundProps extends ViewProps {
  variant?: 'primary' | 'success' | 'warning' | 'subtle';
  direction?: 'vertical' | 'horizontal' | 'diagonal';
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  variant = 'primary',
  direction = 'vertical',
  children,
  className = '',
  ...props
}) => {
  // Note: For a more sophisticated gradient, you might want to use react-native-linear-gradient
  // For now, we'll use a solid color with opacity variations to simulate gradients
  
  const getGradientStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-green';
      case 'success':
        return 'bg-success-green';
      case 'warning':
        return 'bg-warning-orange';
      case 'subtle':
        return 'bg-primary-lightest';
      default:
        return 'bg-primary-green';
    }
  };

  return (
    <View
      {...props}
      className={`
        ${getGradientStyles()}
        ${className}
      `}
    >
      {/* Overlay for gradient effect */}
      <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
      {children}
    </View>
  );
};