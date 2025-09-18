import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-success-light border-success-green text-success-green';
      case 'warning':
        return 'bg-warning-light border-warning-orange text-warning-orange';
      case 'error':
        return 'bg-error-light border-error-red text-error-red';
      case 'info':
        return 'bg-info-light border-info-blue text-info-blue';
      case 'primary':
        return 'bg-primary-lightest border-primary-green text-primary-green';
      case 'neutral':
        return 'bg-gray-100 border-gray-300 text-text-secondary';
      default:
        return 'bg-gray-100 border-gray-300 text-text-secondary';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 rounded-md';
      case 'md':
        return 'px-3 py-1.5 rounded-lg';
      case 'lg':
        return 'px-4 py-2 rounded-xl';
      default:
        return 'px-3 py-1.5 rounded-lg';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <View
      {...props}
      className={`
        border
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
    >
      <Text className={`font-medium ${getTextSizeStyles()}`}>
        {children}
      </Text>
    </View>
  );
};