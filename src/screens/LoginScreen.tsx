import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from '@components/auth/LoginForm';
import { Loading } from '@components/common/Loading';
import { useAuth } from '@hooks/useAuth';
import { useAppDispatch } from '@store/hooks';
import { setCredentials, setOnboardingComplete } from '@store/slices/authSlice';
import { theme } from '@utils/theme';
import { AuthStackParamList } from '@navigation/AuthNavigator';
import { Gender } from '../types';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useAppDispatch();
  const { sendOTP, loading } = useAuth();

  const handleSendOTP = async (phone: string) => {
    try {
      await sendOTP(phone);
      navigation.navigate('OTPVerification', { phone });
    } catch (error) {
      console.error('Send OTP error:', error);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      dispatch(
        setCredentials({
          user: {
            id: `social-${provider}-mock-id`,
            name: '',
            age: 0,
            gender: Gender.OTHER,
          },
          token: `${provider}-mock-token`,
        })
      );
      dispatch(setOnboardingComplete(true));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Quiz' }],
        })
      );
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <LoginForm
          onSendOTP={handleSendOTP}
          onSocialLogin={handleSocialLogin}
          loading={loading}
        />
        <Loading visible={loading} message="Sending OTP..." />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
});
