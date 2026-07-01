import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

export default function AuthLayout() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      const currentScreen = segments[segments.length - 1];
      
      if (user.profileCompleter) {
        // User completed profile, route to home tabs
        router.replace('/(tabs)');
      } else {
        // User has not completed profile, direct to setup-profile if not already in the setup flow
        const inSetupFlow = currentScreen === 'setup-profile' || currentScreen === 'relationship-questions';
        if (!inSetupFlow) {
          router.replace('/(auth)/setup-profile');
        }
      }
    }
  }, [isAuthenticated, user, isLoading, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="otp-verification" options={{ title: 'OTP Verification' }} />
      <Stack.Screen name="setup-profile" options={{ title: 'Setup Profile' }} />
      <Stack.Screen name="relationship-questions" options={{ title: 'Relationship Questions' }} />
    </Stack>
  );
}
