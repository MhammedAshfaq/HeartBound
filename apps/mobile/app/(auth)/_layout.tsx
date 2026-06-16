import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

export default function AuthLayout() {
  const { isDark } = useTheme();
  const c = colors(isDark);

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
