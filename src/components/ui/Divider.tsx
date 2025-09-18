import React from 'react';
import { View, ViewProps } from 'react-native';

interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: 'light' | 'medium' | 'dark';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'light',
  spacing = 'md',
  className = '',
  ...props
}) => {
  const getOrientationStyles = () => {
    return orientation === 'horizontal' ? 'w-full h-px' : 'w-px h-full';
  };

  const getColorStyles = () => {
    switch (color) {
      case 'light':
        return 'bg-border-light';
      case 'medium':
        return 'bg-border-medium';
      case 'dark':
        return 'bg-text-tertiary';
      default:
        return 'bg-border-light';
    }
  };

  const getSpacingStyles = () => {
    if (orientation === 'horizontal') {
      switch (spacing) {
        case 'none':
          return '';
        case 'sm':
          return 'my-2';
        case 'md':
          return 'my-4';
        case 'lg':
          return 'my-6';
        default:
          return 'my-4';
      }
    } else {
      switch (spacing) {
        case 'none':
          return '';
        case 'sm':
          return 'mx-2';
        case 'md':
          return 'mx-4';
        case 'lg':
          return 'mx-6';
        default:
          return 'mx-4';
      }
    }
  };

  return (
    <View
      {...props}
      className={`
        ${getOrientationStyles()}
        ${getColorStyles()}
        ${getSpacingStyles()}
        ${className}
      `}
    />
  );
};