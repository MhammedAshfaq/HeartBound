import { useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { spacing } from '@utils/theme';

/** Horizontal screen inset (16). */
export const screenPadding = spacing.md;

/** Bottom inset above tab bar (16). */
export const screenScrollBottomPadding = spacing.md;

export function useScreenLayout() {
  const { theme } = useTheme();

  return useMemo(() => {
    const screenContentPadding: ViewStyle = {
      padding: screenPadding,
    };

    const screenScrollContentPadding: ViewStyle = {
      padding: screenPadding,
      paddingBottom: screenScrollBottomPadding,
    };

    const listContent: ViewStyle = {
      paddingHorizontal: screenPadding,
      paddingTop: theme.spacing.md,
      paddingBottom: screenScrollBottomPadding,
    };

    return {
      screenContentPadding,
      screenScrollContentPadding,
      listContent,
      safe: {
        flex: 1,
        backgroundColor: theme.colors.background,
      } as ViewStyle,
      safeSurface: {
        flex: 1,
        backgroundColor: theme.colors.surface,
      } as ViewStyle,
      scrollContent: {
        padding: screenPadding,
        paddingBottom: screenScrollBottomPadding,
      } as ViewStyle,
      staticContent: StyleSheet.flatten([
        { flex: 1 },
        screenContentPadding,
      ]) as ViewStyle,
    };
  }, [theme]);
}
