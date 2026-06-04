import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setColorMode, ColorMode } from '@store/slices/settingsSlice';
import { AppTheme, createAppTheme } from '@utils/theme';

interface ThemeContextValue {
  theme: AppTheme;
  isDark: boolean;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const colorMode = useAppSelector((state) => state.settings.colorMode);
  const systemScheme = useColorScheme();

  const isDark =
    colorMode === 'system' ? systemScheme === 'dark' : colorMode === 'dark';

  const theme = useMemo(() => createAppTheme(isDark), [isDark]);

  const handleSetColorMode = useCallback(
    (mode: ColorMode) => {
      dispatch(setColorMode(mode));
    },
    [dispatch]
  );

  const value = useMemo(
    () => ({
      theme,
      isDark,
      colorMode,
      setColorMode: handleSetColorMode,
    }),
    [theme, isDark, colorMode, handleSetColorMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
