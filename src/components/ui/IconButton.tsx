import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { NatureIcon } from './NatureIcon';

interface IconButtonProps extends TouchableOpacityProps {
  icon: 'leaf' | 'flower' | 'tree' | 'sun' | 'water' | 'seed' | 'sprout' | 'camera' | 'gallery' | 'tips' | 'history' | 'healthy' | 'diseased' | 'warning' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'contained' | 'outlined';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'contained',
  color = 'primary',
  className = '',
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      className={`${className}`}
    >
      <NatureIcon
        name={icon}
        size={size}
        variant={variant}
        color={color}
      />
    </TouchableOpacity>
  );
};