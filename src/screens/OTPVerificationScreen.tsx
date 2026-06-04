import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OTPInput } from '@components/auth/OTPInput';
import { Loading } from '@components/common/Loading';
import { useAuth } from '@hooks/useAuth';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useScreenLayout } from '@hooks/useScreenLayout';
import { AuthStackParamList } from '@navigation/AuthNavigator';
import { AppTheme } from '@utils/theme';

type OTPRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC = () => {
  const screenLayout = useScreenLayout();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<OTPRouteProp>();
  const { loginWithOTP, sendOTP, loading } = useAuth();
  const { phone } = route.params;

  const handleOTPSubmit = async (otp: string) => {
    try {
      const response = await loginWithOTP(phone, otp);
      if (response.isNewUser) {
        navigation.replace('Onboarding');
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Quiz' }],
          })
        );
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(phone);
    } catch (error) {
      console.error('Resend OTP error:', error);
    }
  };

  return (
    <SafeAreaView style={screenLayout.safe} edges={['bottom']}>
      <View style={[screenLayout.staticContent, styles.content]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✉️</Text>
          </View>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.phoneText}>{phone}</Text>
          </Text>
          <Text style={styles.seedHint}>Use code: 987654</Text>
        </View>

        <OTPInput
          onSubmit={handleOTPSubmit}
          onResend={handleResendOTP}
          loading={loading}
        />

        <Loading visible={loading} message="Verifying..." />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    icon: {
      fontSize: 36,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    phoneText: {
      fontWeight: '700',
      color: theme.colors.primary,
    },
    seedHint: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      fontStyle: 'italic',
    },
  });
