import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { colors, spacing, borderRadius } from '@/lib/theme';

const OTP_LENGTH = 6;
const MASTER_OTP = '987654';
const OTP_RESEND_TIMEOUT = 60;

export default function OTPVerificationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { sendOTP } = useAuth();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const toast = useToast();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const submitRef = useRef<((code: string) => void) | undefined>(undefined);

  const handleChange = useCallback((text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    const otpValue = newOtp.join('');
    if (otpValue.length === OTP_LENGTH) {
      submitRef.current?.(otpValue);
    }
  }, [otp]);

  const handleKeyPress = useCallback((e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleSubmit = useCallback(async (code: string) => {
    if (code.length !== OTP_LENGTH) return;
    setLoading(true);
    try {
      if (code === MASTER_OTP) {
        router.replace('/(auth)/setup-profile');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch {
      toast.error({ title: 'Verification failed', message: 'Invalid code, please try again' });
      setOtp(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  const handleResend = useCallback(async () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimer(OTP_RESEND_TIMEOUT);
    setCanResend(false);
    try {
      // await sendOTP(phone); // MVP: No backend
      toast.success({ title: 'OTP resent' });
    } catch {
      toast.error({ title: 'Failed to resend OTP' });
    }
    inputs.current[0]?.focus();
  }, [phone, sendOTP, toast]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: c.primary + '20' }]}>
            <Text style={styles.icon}>✉️</Text>
          </View>
          <Text style={[styles.title, { color: c.text }]}>{t('auth.otpVerification')}</Text>
          <Text style={[styles.subtitle, { color: c.muted }]}>
            {t('auth.enterOTP')}{'\n'}
            <Text style={[styles.phoneText, { color: c.primary }]}>{phone}</Text>
          </Text>
          <Text style={[styles.seedHint, { color: c.muted }]}>{t('auth.seedHint')}</Text>
        </View>

        <View style={styles.otpContainer}>
          <View style={styles.inputsRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => { inputs.current[index] = el; }}
                style={[
                  styles.otpInput,
                  { borderColor: c.border, backgroundColor: c.card, color: c.text },
                ]}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={[styles.resendText, { color: c.primary }]}>{t('auth.resendOTP')}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.timerText, { color: c.muted }]}>
                {t('auth.resendIn')} {timer}{t('auth.seconds')}
              </Text>
            )}
          </View>
        </View>
      </View>

      <Modal transparent visible={loading}>
        <View style={[styles.loadingOverlay, { backgroundColor: c.overlay }]}>
          <View style={[styles.loadingBox, { backgroundColor: c.card }]}>
            <ActivityIndicator size="large" color={c.primary} />
            <Text style={[styles.loadingText, { color: c.text }]}>{t('auth.verifying')}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneText: {
    fontWeight: '700',
  },
  seedHint: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  otpContainer: {
    marginVertical: spacing.lg,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    fontSize: 24,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
