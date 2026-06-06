import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-get-random-values';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import {
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useColorScheme } from '@/components/useColorScheme';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import '@/lib/i18n';
import { SessionProvider } from '@/contexts/SessionContext';
import QueryClientWithToken from '@/components/QueryClientWithToken';
import { AuthProvider } from '@/contexts/AuthContext';
import { ApiProvider } from '@/contexts/ApiContext';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import { MemoriesProvider } from '@/features/memories/context/MemoriesContext';

export { ErrorBoundary } from 'expo-router';
export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    'jakarta-extralight': PlusJakartaSans_200ExtraLight,
    'jakarta-light': PlusJakartaSans_300Light,
    'jakarta-regular': PlusJakartaSans_400Regular,
    'jakarta-medium': PlusJakartaSans_500Medium,
    'jakarta-semibold': PlusJakartaSans_600SemiBold,
    'jakarta-bold': PlusJakartaSans_700Bold,
    'jakarta-extrabold': PlusJakartaSans_800ExtraBold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded || error) {
      setAppReady(true);
    }
  }, [loaded, error]);

  return (
    <GluestackUIProvider mode="system">
      <AppThemeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <LocalizationProvider>
            <SessionProvider>
              <QueryClientWithToken>
                <ApiProvider>
                  <AuthProvider>
                    <MemoriesProvider>
                    {!appReady || !splashAnimationFinished ? (
                      <AnimatedSplash
                        onAnimationFinish={(isCancelled) => {
                          if (!isCancelled) {
                            setSplashAnimationFinished(true);
                          }
                        }}
                      />
                    ) : (
                      <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(500)}>
                        <Stack screenOptions={{ headerShown: false }}>
                          <Stack.Screen name="(auth)" />
                          <Stack.Screen name="(tabs)" />
                          <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
                        </Stack>
                      </Animated.View>
                    )}
                    </MemoriesProvider>
                  </AuthProvider>
                </ApiProvider>
              </QueryClientWithToken>
            </SessionProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </AppThemeProvider>
    </GluestackUIProvider>
  );
}
