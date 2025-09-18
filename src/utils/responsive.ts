import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Screen size breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// Device type detection
export const getDeviceType = () => {
  if (SCREEN_WIDTH < BREAKPOINTS.sm) return 'xs';
  if (SCREEN_WIDTH < BREAKPOINTS.md) return 'sm';
  if (SCREEN_WIDTH < BREAKPOINTS.lg) return 'md';
  if (SCREEN_WIDTH < BREAKPOINTS.xl) return 'lg';
  return 'xl';
};

// Responsive dimensions
export const responsive = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  
  // Responsive width based on percentage
  wp: (percentage: number) => (SCREEN_WIDTH * percentage) / 100,
  
  // Responsive height based on percentage
  hp: (percentage: number) => (SCREEN_HEIGHT * percentage) / 100,
  
  // Responsive font size
  fontSize: (size: number) => {
    const scale = SCREEN_WIDTH / 375; // Base on iPhone X width
    const newSize = size * scale;
    return Math.max(12, PixelRatio.roundToNearestPixel(newSize));
  },
  
  // Responsive spacing
  spacing: (size: number) => {
    const scale = SCREEN_WIDTH / 375;
    return Math.max(4, PixelRatio.roundToNearestPixel(size * scale));
  },
  
  // Check if device is tablet
  isTablet: () => SCREEN_WIDTH >= BREAKPOINTS.md,
  
  // Check if device is small
  isSmallDevice: () => SCREEN_WIDTH < BREAKPOINTS.sm,
  
  // Get responsive padding
  getPadding: () => {
    const deviceType = getDeviceType();
    switch (deviceType) {
      case 'xs':
        return 16;
      case 'sm':
        return 20;
      case 'md':
        return 24;
      case 'lg':
      case 'xl':
        return 32;
      default:
        return 20;
    }
  },
  
  // Get responsive margin
  getMargin: () => {
    const deviceType = getDeviceType();
    switch (deviceType) {
      case 'xs':
        return 12;
      case 'sm':
        return 16;
      case 'md':
        return 20;
      case 'lg':
      case 'xl':
        return 24;
      default:
        return 16;
    }
  },
  
  // Get responsive border radius
  getBorderRadius: () => {
    const deviceType = getDeviceType();
    switch (deviceType) {
      case 'xs':
        return 12;
      case 'sm':
        return 16;
      case 'md':
      case 'lg':
      case 'xl':
        return 20;
      default:
        return 16;
    }
  },
};

// Responsive style helpers
export const responsiveStyles = {
  container: {
    paddingHorizontal: responsive.getPadding(),
    paddingVertical: responsive.getMargin(),
  },
  
  card: {
    borderRadius: responsive.getBorderRadius(),
    padding: responsive.getPadding(),
  },
  
  button: {
    paddingHorizontal: responsive.spacing(24),
    paddingVertical: responsive.spacing(12),
    borderRadius: responsive.getBorderRadius() * 0.75,
  },
  
  icon: {
    small: responsive.spacing(16),
    medium: responsive.spacing(24),
    large: responsive.spacing(32),
    xlarge: responsive.spacing(48),
  },
};

export default responsive;