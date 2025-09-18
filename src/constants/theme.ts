// Nature-Inspired Design System for Plantis

export const COLORS = {
  // Primary Nature-Inspired Palette
  primary: {
    green: '#22c55e',
    dark: '#16a34a',
    light: '#86efac',
    lighter: '#bbf7d0',
    lightest: '#dcfce7',
  },
  
  // Secondary Nature Colors
  secondary: {
    earth: '#a3a3a3',
    earthDark: '#78716c',
    leaf: '#65a30d',
    leafDark: '#4d7c0f',
    forest: '#166534',
    sage: '#84cc16',
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },
  
  // Neutral Palette
  neutral: {
    background: '#f8fafc',
    backgroundSecondary: '#f1f5f9',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    borderLight: '#e2e8f0',
    borderMedium: '#cbd5e1',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textInverse: '#ffffff',
  },
  
  // Gradient Colors
  gradients: {
    nature: ['#22c55e', '#16a34a'],
    success: ['#10b981', '#22c55e'],
    warning: ['#f59e0b', '#eab308'],
    sunset: ['#f59e0b', '#f97316'],
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter',
    display: 'Inter',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  nature: {
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  
  spring: {
    tension: 100,
    friction: 8,
  },
} as const;

// Component-specific theme tokens
export const COMPONENTS = {
  button: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 56,
    },
    padding: {
      sm: { horizontal: 12, vertical: 6 },
      md: { horizontal: 16, vertical: 8 },
      lg: { horizontal: 24, vertical: 12 },
      xl: { horizontal: 32, vertical: 16 },
    },
  },
  
  card: {
    padding: {
      sm: 12,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: BORDER_RADIUS.lg,
  },
  
  icon: {
    size: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
      '2xl': 48,
    },
  },
  
  input: {
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    padding: { horizontal: 16, vertical: 12 },
  },
} as const;

// Nature-inspired icon mappings with enhanced variety
export const NATURE_ICONS = {
  leaf: '🌿',
  flower: '🌸',
  tree: '🌳',
  sun: '☀️',
  water: '💧',
  seed: '🌰',
  sprout: '🌱',
  camera: '📷',
  gallery: '🖼️',
  tips: '💡',
  history: '📋',
  healthy: '✅',
  diseased: '🚨',
  warning: '⚠️',
  success: '🎉',
  error: '❌',
  // Additional nature icons for enhanced theming
  plant: '🪴',
  garden: '🏡',
  butterfly: '🦋',
  bee: '🐝',
  rainbow: '🌈',
  earth: '🌍',
  mountain: '⛰️',
  forest: '🌲',
  herb: '🌿',
  blossom: '🌺',
  tulip: '🌷',
  rose: '🌹',
  sunflower: '🌻',
  mushroom: '🍄',
  cactus: '🌵',
  palm: '🌴',
  bamboo: '🎋',
  four_leaf_clover: '🍀',
  maple_leaf: '🍁',
  fallen_leaf: '🍂',
} as const;

// Accessibility
export const ACCESSIBILITY = {
  minTouchTarget: 44,
  focusRingWidth: 2,
  focusRingColor: COLORS.primary.green,
  highContrastRatio: 4.5,
} as const;

// Enhanced responsive breakpoints for better mobile experience
export const RESPONSIVE = {
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
  
  // Device-specific spacing
  spacing: {
    xs: { padding: 12, margin: 8 },
    sm: { padding: 16, margin: 12 },
    md: { padding: 20, margin: 16 },
    lg: { padding: 24, margin: 20 },
    xl: { padding: 32, margin: 24 },
  },
  
  // Typography scaling
  fontScale: {
    xs: 0.85,
    sm: 0.9,
    md: 1.0,
    lg: 1.1,
    xl: 1.2,
  },
} as const;

// Enhanced animation presets for smooth interactions
export const ANIMATION_PRESETS = {
  // Screen transitions
  screenTransition: {
    duration: 300,
    easing: 'ease-in-out',
  },
  
  // Button interactions
  buttonPress: {
    duration: 150,
    scale: 0.95,
    easing: 'ease-out',
  },
  
  // Card hover/press
  cardInteraction: {
    duration: 200,
    scale: 0.98,
    easing: 'ease-out',
  },
  
  // Loading states
  loading: {
    duration: 1000,
    easing: 'linear',
    infinite: true,
  },
  
  // Success feedback
  success: {
    duration: 600,
    scale: [1, 1.1, 1],
    easing: 'ease-out',
  },
  
  // Error shake
  error: {
    duration: 400,
    translateX: [-10, 10, -10, 10, 0],
    easing: 'ease-out',
  },
} as const;

// Export default theme object
export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  components: COMPONENTS,
  natureIcons: NATURE_ICONS,
  accessibility: ACCESSIBILITY,
  responsive: RESPONSIVE,
  animationPresets: ANIMATION_PRESETS,
} as const;

export type Theme = typeof theme;
export default theme;