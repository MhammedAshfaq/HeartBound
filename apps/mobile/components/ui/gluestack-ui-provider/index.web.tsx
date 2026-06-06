import React, { useEffect } from 'react';

type Mode = 'light' | 'dark' | 'system';

interface GluestackUIProviderProps {
  mode?: Mode;
  children: React.ReactNode;
}

export function GluestackUIProvider({ mode = 'system', children }: GluestackUIProviderProps) {
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (mode === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      setColorScheme(mql.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) => setColorScheme(e.matches ? 'dark' : 'light');
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else {
      setColorScheme(mode);
    }
  }, [mode]);

  return (
    <div
      data-set="gluestack-ui-provider"
      data-color-scheme={colorScheme}
      style={{ display: 'flex', flex: 1 }}
    >
      {children}
    </div>
  );
}
