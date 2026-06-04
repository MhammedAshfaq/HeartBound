export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
  caption: {
    fontSize: 11,
    fontWeight: 'normal' as const,
    lineHeight: 14,
  },
} as const;

const brandColors = {
  primary: '#E91E63',
  primaryDark: '#C2185B',
  secondary: '#9C27B0',
  secondaryDark: '#7B1FA2',
  secondaryLight: '#E1BEE7',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  onPrimary: '#FFFFFF',
} as const;

export const lightColors = {
  ...brandColors,
  primaryLight: '#F8BBD0',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  switchThumbOff: '#f4f3f4',
} as const;

export const darkColors = {
  ...brandColors,
  primaryLight: '#3D2430',
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#424242',
  overlay: 'rgba(0, 0, 0, 0.7)',
  switchThumbOff: '#6B6B6B',
} as const;

export type ThemeColors = typeof lightColors;

function createShadows(isDark: boolean) {
  const shadowOpacity = isDark ? 0.35 : 0.1;
  const mdOpacity = isDark ? 0.4 : 0.15;
  const lgOpacity = isDark ? 0.5 : 0.2;

  return {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: mdOpacity,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: lgOpacity,
      shadowRadius: 8,
      elevation: 8,
    },
  };
}

export function createAppTheme(isDark: boolean) {
  return {
    spacing,
    borderRadius,
    typography,
    colors: isDark ? darkColors : lightColors,
    shadows: createShadows(isDark),
    isDark,
  };
}

export type AppTheme = ReturnType<typeof createAppTheme>;

/** @deprecated Use `useTheme()` from ThemeContext for reactive colors */
export const theme = createAppTheme(false);

export type Theme = AppTheme;
