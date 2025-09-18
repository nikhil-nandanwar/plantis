import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface NatureIconProps extends ViewProps {
  name: 'leaf' | 'flower' | 'tree' | 'sun' | 'water' | 'seed' | 'sprout' | 'camera' | 'gallery' | 'tips' | 'history' | 'healthy' | 'diseased' | 'warning' | 'success' | 'error' | 'plant' | 'garden' | 'butterfly' | 'bee' | 'rainbow' | 'earth' | 'mountain' | 'forest' | 'herb' | 'blossom' | 'tulip' | 'rose' | 'sunflower' | 'mushroom' | 'cactus' | 'palm' | 'bamboo' | 'four_leaf_clover' | 'maple_leaf' | 'fallen_leaf';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'contained' | 'outlined' | 'soft';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'info';
  animated?: boolean;
  animationType?: 'pulse' | 'bounce' | 'float' | 'glow' | 'wiggle' | 'rotate';
}

export const NatureIcon: React.FC<NatureIconProps> = ({
  name,
  size = 'md',
  variant = 'default',
  color = 'primary',
  animated = false,
  animationType = 'pulse',
  className = '',
  ...props
}) => {
  const getIcon = () => {
    switch (name) {
      case 'leaf':
        return '🌿';
      case 'flower':
        return '🌸';
      case 'tree':
        return '🌳';
      case 'sun':
        return '☀️';
      case 'water':
        return '💧';
      case 'seed':
        return '🌰';
      case 'sprout':
        return '🌱';
      case 'camera':
        return '📷';
      case 'gallery':
        return '🖼️';
      case 'tips':
        return '💡';
      case 'history':
        return '📋';
      case 'healthy':
        return '✅';
      case 'diseased':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '🎉';
      case 'error':
        return '❌';
      case 'plant':
        return '🪴';
      case 'garden':
        return '🏡';
      case 'butterfly':
        return '🦋';
      case 'bee':
        return '🐝';
      case 'rainbow':
        return '🌈';
      case 'earth':
        return '🌍';
      case 'mountain':
        return '⛰️';
      case 'forest':
        return '🌲';
      case 'herb':
        return '🌿';
      case 'blossom':
        return '🌺';
      case 'tulip':
        return '🌷';
      case 'rose':
        return '🌹';
      case 'sunflower':
        return '🌻';
      case 'mushroom':
        return '🍄';
      case 'cactus':
        return '🌵';
      case 'palm':
        return '🌴';
      case 'bamboo':
        return '🎋';
      case 'four_leaf_clover':
        return '🍀';
      case 'maple_leaf':
        return '🍁';
      case 'fallen_leaf':
        return '🍂';
      default:
        return '🌿';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return 'w-4 h-4 text-xs';
      case 'sm':
        return 'w-6 h-6 text-sm';
      case 'md':
        return 'w-8 h-8 text-base';
      case 'lg':
        return 'w-12 h-12 text-xl';
      case 'xl':
        return 'w-16 h-16 text-2xl';
      case '2xl':
        return 'w-20 h-20 text-4xl';
      default:
        return 'w-8 h-8 text-base';
    }
  };

  const getVariantStyles = () => {
    const baseColor = getColorStyles();
    
    switch (variant) {
      case 'contained':
        return `${baseColor.bg} ${baseColor.border} border rounded-full shadow-soft`;
      case 'outlined':
        return `bg-transparent ${baseColor.border} border-2 rounded-full`;
      case 'soft':
        return `${baseColor.bg} border-0 rounded-full opacity-80`;
      case 'default':
        return 'bg-transparent';
      default:
        return 'bg-transparent';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-lightest',
          border: 'border-primary-green',
          text: 'text-primary-green'
        };
      case 'success':
        return {
          bg: 'bg-success-light',
          border: 'border-success-green',
          text: 'text-success-green'
        };
      case 'warning':
        return {
          bg: 'bg-warning-light',
          border: 'border-warning-orange',
          text: 'text-warning-orange'
        };
      case 'error':
        return {
          bg: 'bg-error-light',
          border: 'border-error-red',
          text: 'text-error-red'
        };
      case 'info':
        return {
          bg: 'bg-info-light',
          border: 'border-info-blue',
          text: 'text-info-blue'
        };
      case 'neutral':
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-text-secondary'
        };
      default:
        return {
          bg: 'bg-primary-lightest',
          border: 'border-primary-green',
          text: 'text-primary-green'
        };
    }
  };

  const getAnimationStyles = () => {
    if (!animated) return '';
    
    switch (animationType) {
      case 'pulse':
        return 'animate-pulse-soft';
      case 'bounce':
        return 'animate-bounce-gentle';
      case 'float':
        return 'animate-float';
      case 'glow':
        return 'animate-glow';
      case 'wiggle':
        return 'animate-wiggle';
      case 'rotate':
        return 'animate-rotate-slow';
      default:
        return 'animate-pulse-soft';
    }
  };

  return (
    <View
      {...props}
      className={`
        ${getSizeStyles()}
        ${getVariantStyles()}
        ${getAnimationStyles()}
        justify-center items-center
        transition-all duration-200 ease-in-out
        ${className}
      `}
    >
      <Text className={`${getSizeStyles().split(' ').find(c => c.startsWith('text-'))} select-none`}>
        {getIcon()}
      </Text>
    </View>
  );
};