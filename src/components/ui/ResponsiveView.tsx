import React from 'react';
import { View, ViewProps, Dimensions } from 'react-native';
import { responsive } from '../../utils/responsive';

interface ResponsiveViewProps extends ViewProps {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  children: React.ReactNode;
}

export const ResponsiveView: React.FC<ResponsiveViewProps> = ({
  xs,
  sm,
  md,
  lg,
  xl,
  children,
  className = '',
  ...props
}) => {
  const deviceType = responsive.isTablet() ? 'lg' : responsive.isSmallDevice() ? 'xs' : 'md';
  
  const getResponsiveStyles = () => {
    switch (deviceType) {
      case 'xs':
        return xs || className;
      case 'sm':
        return sm || xs || className;
      case 'md':
        return md || sm || xs || className;
      case 'lg':
        return lg || md || sm || xs || className;
      case 'xl':
        return xl || lg || md || sm || xs || className;
      default:
        return className;
    }
  };

  return (
    <View
      {...props}
      className={getResponsiveStyles()}
    >
      {children}
    </View>
  );
};