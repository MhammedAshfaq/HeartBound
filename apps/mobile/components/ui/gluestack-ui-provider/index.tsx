import React from 'react';
import { config } from './config';
import { View, useColorScheme as useRNColorScheme } from 'react-native';

type Mode = 'light' | 'dark' | 'system';

interface GluestackUIProviderProps {
  mode?: Mode;
  children: React.ReactNode;
}

export function GluestackUIProvider({ mode = 'system', children }: GluestackUIProviderProps) {
  const deviceScheme = useRNColorScheme();
  const colorScheme = mode === 'system' ? (deviceScheme ?? 'light') : mode;

  return (
    <View
      style={{ flex: 1 }}
      {...({ dataSet: { 'gluestack-ui-provider': 'true', 'color-scheme': colorScheme } } as any)}
    >
      {children}
    </View>
  );
}
