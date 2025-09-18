import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from '../../constants/theme';

interface ThemeContextType {
  theme: Theme;
  colors: typeof theme.colors;
  spacing: typeof theme.spacing;
  typography: typeof theme.typography;
  animations: typeof theme.animations;
  responsive: typeof theme.responsive;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const contextValue: ThemeContextType = {
    theme,
    colors: theme.colors,
    spacing: theme.spacing,
    typography: theme.typography,
    animations: theme.animations,
    responsive: theme.responsive,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for accessing specific theme values
export const useColors = () => {
  const { colors } = useTheme();
  return colors;
};

export const useSpacing = () => {
  const { spacing } = useTheme();
  return spacing;
};

export const useTypography = () => {
  const { typography } = useTheme();
  return typography;
};

export const useAnimations = () => {
  const { animations } = useTheme();
  return animations;
};

export const useResponsive = () => {
  const { responsive } = useTheme();
  return responsive;
};