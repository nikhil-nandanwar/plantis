import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'warning' | 'error';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'primary',
  weight,
  align = 'left',
  children,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return 'text-4xl leading-tight font-bold';
      case 'h2':
        return 'text-3xl leading-tight font-bold';
      case 'h3':
        return 'text-2xl leading-tight font-semibold';
      case 'h4':
        return 'text-xl leading-tight font-semibold';
      case 'body1':
        return 'text-base leading-relaxed';
      case 'body2':
        return 'text-sm leading-relaxed';
      case 'caption':
        return 'text-xs leading-normal';
      case 'overline':
        return 'text-xs leading-normal uppercase tracking-wider';
      default:
        return 'text-base leading-relaxed';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return 'text-text-primary';
      case 'secondary':
        return 'text-text-secondary';
      case 'tertiary':
        return 'text-text-tertiary';
      case 'inverse':
        return 'text-text-inverse';
      case 'success':
        return 'text-success-green';
      case 'warning':
        return 'text-warning-orange';
      case 'error':
        return 'text-error-red';
      default:
        return 'text-text-primary';
    }
  };

  const getWeightStyles = () => {
    if (!weight) return '';
    
    switch (weight) {
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      default:
        return '';
    }
  };

  const getAlignStyles = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <Text
      {...props}
      className={`
        ${getVariantStyles()}
        ${getColorStyles()}
        ${getWeightStyles()}
        ${getAlignStyles()}
        ${className}
      `}
    >
      {children}
    </Text>
  );
};