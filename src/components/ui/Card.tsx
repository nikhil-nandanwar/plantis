import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'soft' | 'gradient' | 'glass';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  shadow = false,
  interactive = false,
  children,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return 'bg-surface border border-border-light';
      case 'elevated':
        return 'bg-surface-elevated shadow-medium';
      case 'outlined':
        return 'bg-surface border-2 border-border-medium';
      case 'soft':
        return 'bg-primary-lightest border border-primary-light';
      case 'gradient':
        return 'gradient-nature border-0';
      case 'glass':
        return 'backdrop-soft border border-white/20';
      default:
        return 'bg-surface border border-border-light';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'xs':
        return 'p-2';
      case 'sm':
        return 'p-3';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      default:
        return 'p-4';
    }
  };

  const getRoundedStyles = () => {
    switch (rounded) {
      case 'sm':
        return 'rounded-lg';
      case 'md':
        return 'rounded-xl';
      case 'lg':
        return 'rounded-2xl';
      case 'xl':
        return 'rounded-3xl';
      case '2xl':
        return 'rounded-3xl';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-2xl';
    }
  };

  const getShadowStyles = () => {
    if (!shadow) return '';
    
    switch (variant) {
      case 'elevated':
        return 'shadow-strong';
      case 'gradient':
        return 'shadow-nature';
      default:
        return 'shadow-medium';
    }
  };

  const getInteractiveStyles = () => {
    return interactive ? 'hover-lift press-scale transition-all duration-200 ease-out' : '';
  };

  return (
    <View
      {...props}
      className={`
        ${getRoundedStyles()}
        ${getVariantStyles()}
        ${getPaddingStyles()}
        ${getShadowStyles()}
        ${getInteractiveStyles()}
        ${className}
      `}
    >
      {children}
    </View>
  );
};