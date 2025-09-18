import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { HapticService } from '../../services/hapticService';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'soft';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  gradient?: boolean;
  hapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = false,
  shadow = false,
  gradient = false,
  hapticFeedback = true,
  hapticType = 'light',
  disabled,
  children,
  className = '',
  onPress,
  ...props
}) => {
  const getVariantStyles = () => {
    const baseGradient = gradient ? 'gradient-nature' : '';
    
    switch (variant) {
      case 'primary':
        return `${gradient ? baseGradient : 'bg-primary-green'} border-primary-green active:bg-primary-dark`;
      case 'secondary':
        return 'bg-sage-green border-sage-green active:bg-leaf-green';
      case 'success':
        return 'bg-success-green border-success-green active:bg-green-600';
      case 'outline':
        return 'bg-transparent border-primary-green active:bg-primary-lightest hover:bg-primary-lightest/50';
      case 'ghost':
        return 'bg-transparent border-transparent active:bg-primary-lightest hover:bg-primary-lightest/30';
      case 'soft':
        return 'bg-primary-lightest border-primary-lightest active:bg-primary-light';
      case 'danger':
        return 'bg-error-red border-error-red active:bg-red-600';
      default:
        return `${gradient ? baseGradient : 'bg-primary-green'} border-primary-green active:bg-primary-dark`;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'danger':
        return 'text-text-inverse';
      case 'outline':
      case 'ghost':
        return 'text-primary-green';
      case 'soft':
        return 'text-primary-dark';
      default:
        return 'text-text-inverse';
    }
  };

  const getSizeStyles = () => {
    const borderRadius = rounded ? 'rounded-full' : getRoundedStyles();
    
    switch (size) {
      case 'xs':
        return `px-2 py-1 ${borderRadius}`;
      case 'sm':
        return `px-3 py-2 ${borderRadius}`;
      case 'md':
        return `px-4 py-3 ${borderRadius}`;
      case 'lg':
        return `px-6 py-4 ${borderRadius}`;
      case 'xl':
        return `px-8 py-5 ${borderRadius}`;
      default:
        return `px-4 py-3 ${borderRadius}`;
    }
  };

  const getRoundedStyles = () => {
    switch (size) {
      case 'xs':
        return 'rounded-md';
      case 'sm':
        return 'rounded-lg';
      case 'md':
        return 'rounded-xl';
      case 'lg':
        return 'rounded-xl';
      case 'xl':
        return 'rounded-2xl';
      default:
        return 'rounded-xl';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'xs':
        return 'text-xs font-medium';
      case 'sm':
        return 'text-sm font-medium';
      case 'md':
        return 'text-base font-semibold';
      case 'lg':
        return 'text-lg font-semibold';
      case 'xl':
        return 'text-xl font-bold';
      default:
        return 'text-base font-semibold';
    }
  };

  const getShadowStyles = () => {
    if (!shadow) return '';
    
    switch (variant) {
      case 'primary':
      case 'success':
        return 'shadow-nature';
      case 'danger':
        return 'shadow-strong';
      default:
        return 'shadow-medium';
    }
  };

  const isDisabled = disabled || loading;

  const handlePress = (event: any) => {
    if (hapticFeedback && !isDisabled) {
      switch (hapticType) {
        case 'light':
          HapticService.light();
          break;
        case 'medium':
          HapticService.medium();
          break;
        case 'heavy':
          HapticService.heavy();
          break;
        case 'success':
          HapticService.success();
          break;
        case 'warning':
          HapticService.warning();
          break;
        case 'error':
          HapticService.error();
          break;
        default:
          HapticService.light();
      }
    }
    onPress?.(event);
  };

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      onPress={handlePress}
      className={`
        border-2 flex-row items-center justify-center
        transition-all duration-200 ease-in-out
        press-scale focus-nature
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${getShadowStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : 'hover-lift'}
        ${className}
      `}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#22c55e' : '#ffffff'}
          className="mr-2"
        />
      )}
      
      {leftIcon && !loading && (
        <Text className="text-lg mr-2">{leftIcon}</Text>
      )}
      
      <Text className={`${getTextStyles()} ${getTextSizeStyles()}`}>
        {children}
      </Text>
      
      {rightIcon && (
        <Text className="text-lg ml-2">{rightIcon}</Text>
      )}
    </TouchableOpacity>
  );
};