import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { colors, shadows } from '@/lib/theme';

const OTP_LENGTH = 6;
const MASTER_OTP = '987654';
const OTP_RESEND_TIMEOUT = 60;

export default function EmailVerificationScreen() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const router = useRouter();
  const toast = useToast();
  const { user, updateProfile } = useAuth();

  const [email, setEmail] = useState(user?.email ?? '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(OTP_RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const inputs = useRef<(TextInput | null)[]>([]);

  const isValidEmail = email.includes('@') && email.includes('.');

  useEffect(() => {
    if (!otpSent) return;
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
  }, [otpSent]);

  const handleSendOTP = useCallback(async () => {
    if (!isValidEmail) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setOtpSent(true);
    setTimer(OTP_RESEND_TIMEOUT);
    setCanResend(false);
    setLoading(false);
    toast.success({ title: 'OTP sent to ' + email });
  }, [email, isValidEmail, toast]);

  const handleResend = useCallback(async () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimer(OTP_RESEND_TIMEOUT);
    setCanResend(false);
    await new Promise((r) => setTimeout(r, 800));
    toast.success({ title: 'OTP resent to ' + email });
    inputs.current[0]?.focus();
  }, [email, toast]);

  const handleOtpChange = useCallback((text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    const otpValue = newOtp.join('');
    if (otpValue.length === OTP_LENGTH) {
      handleVerify(otpValue);
    }
  }, [otp]);

  const handleKeyPress = useCallback((e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleVerify = useCallback(async (code?: string) => {
    const otpValue = code || otp.join('');
    if (otpValue.length !== OTP_LENGTH) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    try {
      if (otpValue !== MASTER_OTP) {
        throw new Error('Invalid OTP');
      }
      await updateProfile({ name: user?.name ?? '', dateOfBirth: user?.dateOfBirth ?? '', email });
      toast.success({ title: 'Email updated successfully' });
      router.back();
    } catch {
      toast.error({ title: 'Verification failed', message: 'Invalid code, please try again' });
      setOtp(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setSaving(false);
    }
  }, [otp, email, user, updateProfile, router, toast]);

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center justify-between px-4" style={{ marginTop: 20 }}>
          <Pressable onPress={() => router.back()} className="py-3">
            <Ionicons name="close" size={24} color={c.text} />
          </Pressable>
          <Text className="text-lg font-bold" style={{ color: c.text }}>Update Email</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-8"
        >
          <View className="items-center pt-8 pb-6">
            <View className="h-16 w-16 items-center justify-center rounded-full mb-4" style={{ backgroundColor: c.primary + '18' }}>
              <Ionicons name="mail-outline" size={28} color={c.primary} />
            </View>
            <Text className="text-lg font-bold mb-1" style={{ color: c.text }}>Change your email</Text>
            <Text className="text-sm text-center leading-5 px-6" style={{ color: c.muted }}>
              Enter your new email address and verify it with a one-time code
            </Text>
          </View>

          <View className="px-4">
            <View
              className="rounded-xl"
              style={{
                backgroundColor: c.card,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                ...s.sm,
              }}
            >
              <View className="px-5" style={{ paddingVertical: 10 }}>
                <Text className="text-xs font-semibold mb-2 ml-2" style={{ color: c.muted }}>
                  Email Address
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={c.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!otpSent}
                  style={{ color: c.text, backgroundColor: c.surface, borderColor: c.border }}
                  className="rounded-lg border px-4 py-2.5 text-base"
                />
              </View>
            </View>
          </View>

          <View className="px-4" style={{ marginTop: 20 }}>
            {!otpSent ? (
              <Pressable
                onPress={handleSendOTP}
                disabled={!isValidEmail || loading}
                className="rounded-xl items-center w-full"
                style={{
                  backgroundColor: isValidEmail ? c.primary : c.border,
                  paddingVertical: 10,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <Text className="text-base font-bold text-white">
                  {loading ? 'Sending...' : 'Send OTP'}
                </Text>
              </Pressable>
            ) : (
              <>
                <View
                  className="rounded-xl mb-6"
                  style={{
                    backgroundColor: c.card,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    ...s.sm,
                  }}
                >
                  <View className="px-5" style={{ paddingVertical: 10 }}>
                    <View className="flex-row items-center justify-between mb-4">
                      <Text className="text-xs font-semibold" style={{ color: c.muted }}>
                        Enter OTP
                      </Text>
                      <Text className="text-xs" style={{ color: c.muted }}>
                        {email}
                      </Text>
                    </View>

                    <View className="flex-row justify-center gap-2 mb-4">
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={(el) => { inputs.current[index] = el; }}
                          value={digit}
                          onChangeText={(text) => handleOtpChange(text, index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          keyboardType="number-pad"
                          maxLength={1}
                          textAlign="center"
                          style={{
                            width: 48,
                            height: 54,
                            borderWidth: 2,
                            borderRadius: 12,
                            borderColor: digit ? c.primary : c.border,
                            backgroundColor: c.surface,
                            color: c.text,
                            fontSize: 22,
                            fontWeight: '600',
                          }}
                        />
                      ))}
                    </View>

                    <View className="items-center">
                      {canResend ? (
                        <Pressable onPress={handleResend}>
                          <Text className="text-sm font-semibold" style={{ color: c.primary }}>Resend OTP</Text>
                        </Pressable>
                      ) : (
                        <Text className="text-sm" style={{ color: c.muted }}>
                          Resend in {timer}s
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => handleVerify()}
                  disabled={otp.join('').length !== OTP_LENGTH || saving}
                  className="rounded-xl items-center w-full"
                  style={{
                    backgroundColor: otp.join('').length === OTP_LENGTH ? c.primary : c.border,
                    opacity: saving ? 0.6 : 1,
                    paddingVertical: 10,
                  }}
                >
                  <Text className="text-base font-bold text-white">
                    {saving ? 'Verifying...' : 'Verify & Update Email'}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal transparent visible={saving} animationType="fade">
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: c.overlay }}>
          <View
            className="items-center"
            style={{
              backgroundColor: c.card,
              borderRadius: 20,
              paddingVertical: 32,
              paddingHorizontal: 40,
              width: 220,
              ...s.lg,
            }}
          >
            <View className="h-12 w-12 items-center justify-center rounded-full mb-4" style={{ backgroundColor: c.primary + '15' }}>
              <Ionicons name="mail-outline" size={22} color={c.primary} />
            </View>
            <ActivityIndicator size="large" color={c.primary} />
            <Text className="text-base font-semibold mt-4" style={{ color: c.text }}>Verifying</Text>
            <Text className="text-xs mt-1 text-center" style={{ color: c.muted }}>Please wait a moment</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
