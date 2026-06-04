import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@screens/LoginScreen';
import { OTPVerificationScreen } from '@screens/OTPVerificationScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';
import { useTheme } from '@context/ThemeContext';

export type AuthStackParamList = {
  Login: undefined;
  OTPVerification: { phone: string };
  Onboarding: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { theme } = useTheme();

  const headerOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.text,
      headerTitleStyle: { fontWeight: '600' as const, color: theme.colors.text },
      headerShadowVisible: false,
    }),
    [theme]
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{
          headerShown: true,
          title: 'Verify OTP',
          ...headerOptions,
        }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerShown: true,
          title: 'Setup Profile',
          ...headerOptions,
        }}
      />
    </Stack.Navigator>
  );
};
