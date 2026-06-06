import { Platform } from 'react-native';
import Colors from '@/constants/Colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

export function shadows(isDark: boolean) {
  const opacity = isDark ? 0.35 : 0.1;
  return {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: opacity,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.5 : 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  };
}

export function colors(isDark: boolean) {
  return Colors[isDark ? 'dark' : 'light'];
}

export function appTheme(isDark: boolean) {
  return {
    spacing,
    borderRadius,
    colors: colors(isDark),
    shadows: shadows(isDark),
    isDark,
  };
}
