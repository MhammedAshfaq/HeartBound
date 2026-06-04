import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { AppTheme } from '@utils/theme';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: AppTheme) => T
): T {
  const { theme } = useTheme();
  return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
}
