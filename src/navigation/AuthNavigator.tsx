import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@screens/LoginScreen';
import { OTPVerificationScreen } from '@screens/OTPVerificationScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';
import { theme } from '@utils/theme';

export type AuthStackParamList = {
  Login: undefined;
  OTPVerification: { phone: string };
  Onboarding: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const headerOptions = {
  headerStyle: { backgroundColor: theme.colors.surface },
  headerTintColor: theme.colors.text,
  headerTitleStyle: { fontWeight: '600' as const },
  headerShadowVisible: false,
};

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
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
