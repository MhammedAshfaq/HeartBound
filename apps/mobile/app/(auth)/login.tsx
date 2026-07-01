import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { colors, spacing, borderRadius } from '@/lib/theme';
import { Images } from '@/constants/Images';
import type { Country } from '@/types/common.types';
import { useCountries } from '@/hooks/useCountries';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';

let DynamicGoogleButton: any = null;
try {
  const { NativeModules } = require('react-native');
  const isAvailable = !!NativeModules.RNGoogleSignin || !!(global as any).__turboModuleProxy?.('RNGoogleSignin');
  if (isAvailable) {
    DynamicGoogleButton = require('@react-native-google-signin/google-signin').GoogleSigninButton;
  }
} catch (e) {
  // Silent catch
}

interface GoogleButtonWrapperProps {
  onPress: () => void;
  fallbackStyle: any;
}

function GoogleButtonWrapper({ onPress, fallbackStyle }: GoogleButtonWrapperProps) {
  return (
    <TouchableOpacity
      style={fallbackStyle}
      onPress={onPress}
    >
      <Ionicons name="logo-google" size={24} color="#DB4437" />
    </TouchableOpacity>
  );
}

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { sendOTP, loginWithOAuth } = useAuth();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const toast = useToast();
  const fieldHeight = 56;
  const { data: countriesList = [], isLoading, isError, error, refetch } = useCountries();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Keep selected country in sync when the dynamic country list loads
  useEffect(() => {
    if (countriesList.length > 0 && selectedCountry) {
      const currentCode = selectedCountry.code;
      const found = countriesList.find((c) => c.code === currentCode);
      if (found) {
        setSelectedCountry(found);
      }
    }
  }, [countriesList]);

  // Show toast notification if API fails
  useEffect(() => {
    if (isError && error) {
      toast.error({
        title: t('auth.connectionError', { defaultValue: 'Connection Error' }),
        message: getErrorMessage(error),
      });
    }
  }, [isError, error, t, toast]);

  // Dismiss all toasts on mount
  useEffect(() => {
    toast.dismiss();
  }, [toast]);

  const validatePhone = useCallback((value: string) => {
    if (!value) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!/^\d{8,15}$/.test(value)) {
      setPhoneError('Invalid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    const sanitizedPhone = value.replace(/\D/g, '').slice(0, 15);
    setPhone(sanitizedPhone);
    if (phoneError) validatePhone(sanitizedPhone);
  }, [phoneError, validatePhone]);
  const handleSendOTP = useCallback(async () => {
    toast.dismiss();
    if (!validatePhone(phone)) return;
    const fullPhone = `${selectedCountry?.dialCode}${phone}`;
    setLoading(true);
    try {
      await sendOTP(fullPhone, selectedCountry?.code);
      router.push({
        pathname: '/(auth)/otp-verification',
        params: {
          phone: fullPhone,
          country: selectedCountry?.name || '',
          countryCode: selectedCountry?.code || '',
        },
      });
    } catch (err: any) {
      const message = getErrorMessage(err);
      toast.error({ title: 'Failed to send OTP', message });
    } finally {
      setLoading(false);
    }
  }, [phone, selectedCountry, validatePhone, sendOTP, router, toast]);
  const handleSocialLogin = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    toast.dismiss();
    setLoading(true);
    console.log(provider, '------- provider ------');
    try {
      await loginWithOAuth(provider);
      router.replace('/(auth)/setup-profile');
    } catch (err: any) {
      const message = getErrorMessage(err);
      toast.error({ title: `${provider} login failed`, message });
    } finally {
      setLoading(false);
    }
  }, [loginWithOAuth, router, toast]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={Images.logo}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.title, { color: c.primary }]}>{t('auth.appTitle')}</Text>
            <Text style={[styles.subtitle, { color: c.muted }]}>{t('auth.appSubtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.phoneRow}>
              <TouchableOpacity
                style={[
                  styles.countryPicker,
                  {
                    height: fieldHeight,
                    borderColor: phoneError ? c.error : c.border,
                    backgroundColor: c.card,
                  },
                ]}
                onPress={() => setPickerVisible(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={c.primary} />
                ) : (
                  <>
                    <Text style={styles.countryFlag}>{selectedCountry?.flag || '🏳️'}</Text>
                    {selectedCountry?.dialCode ? (
                      <Text style={[styles.countryCode, { color: c.text }]}>{selectedCountry.dialCode}</Text>
                    ) : null}
                    <Ionicons name="chevron-down" size={16} color={c.muted} />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.phoneInputContainer}>
                <TextInput
                  style={[
                    styles.phoneInput,
                    {
                      height: fieldHeight,
                      color: c.text,
                      borderColor: phoneError ? c.error : c.border,
                      backgroundColor: c.card,
                    },
                  ]}
                  placeholder={t('auth.phonePlaceholder')}
                  placeholderTextColor={c.muted}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  maxLength={15}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
                {phoneError ? (
                  <Text style={[styles.errorText, { color: c.error }]}>{phoneError}</Text>
                ) : null}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.sendOTPButton, { backgroundColor: c.primary, opacity: loading ? 0.7 : 1 }]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sendOTPText}>{t('auth.sendOTP')}</Text>
              )}
            </TouchableOpacity>

            <Text style={[styles.termsText, { color: c.muted }]}>{t('auth.termsText')}</Text>
          </View>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: c.border }]} />
            <Text style={[styles.dividerText, { color: c.muted }]}>{t('auth.orDivider')}</Text>
            <View style={[styles.dividerLine, { backgroundColor: c.border }]} />
          </View>

          <View style={styles.socialRow}>
            <GoogleButtonWrapper
              onPress={() => handleSocialLogin('google')}
              fallbackStyle={[styles.socialButton, { borderColor: c.border, backgroundColor: c.card }]}
            />
            <TouchableOpacity
              style={[styles.socialButton, { borderColor: c.border, backgroundColor: c.card }]}
              onPress={() => handleSocialLogin('apple')}
            >
              <Ionicons name="logo-apple" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { borderColor: c.border, backgroundColor: c.card }]}
              onPress={() => handleSocialLogin('facebook')}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal visible={pickerVisible} transparent animationType="slide">
          <TouchableOpacity
            style={[styles.modalOverlay, { backgroundColor: c.overlay }]}
            activeOpacity={1}
            onPress={() => setPickerVisible(false)}
          >
            <View style={[styles.modalContainer, { backgroundColor: c.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: c.border }]}>
                <Text style={[styles.modalTitle, { color: c.text }]}>{t('auth.selectCountry')}</Text>
                <TouchableOpacity onPress={() => setPickerVisible(false)}>
                  <Ionicons name="close" size={24} color={c.text} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={countriesList}
                keyExtractor={(item) => item.code}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    {isError ? (
                      <>
                        <Text style={[styles.emptyText, { color: c.error }]}>
                          {getErrorMessage(error)}
                        </Text>
                        <TouchableOpacity
                          style={[styles.retryButton, { backgroundColor: c.primary }]}
                          onPress={() => refetch()}
                        >
                          <Text style={styles.retryText}>{t('common.retry', { defaultValue: 'Retry' })}</Text>
                        </TouchableOpacity>
                      </>
                    ) : isLoading ? (
                      <ActivityIndicator size="large" color={c.primary} style={{ marginTop: 20 }} />
                    ) : (
                      <Text style={[styles.emptyText, { color: c.muted }]}>
                        {t('auth.noCountriesFound', { defaultValue: 'No countries available' })}
                      </Text>
                    )}
                  </View>
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.countryItem,
                      item.code === selectedCountry?.code && { backgroundColor: c.primary + '15' },
                    ]}
                    onPress={() => {
                      setSelectedCountry(item);
                      setPickerVisible(false);
                    }}
                  >
                    <Text style={styles.countryItemFlag}>{item.flag}</Text>
                    <Text style={[styles.countryItemName, { color: c.text }]}>{item.name}</Text>
                    <Text style={[styles.countryItemDial, { color: c.muted }]}>{item.dialCode}</Text>
                    {item.code === selectedCountry?.code && (
                      <Ionicons name="checkmark" size={20} color={c.primary} />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.countryList}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
  },
  form: {
    gap: spacing.sm,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: -spacing.xs,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'stretch',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    justifyContent: 'center',
    minWidth: 85,
  },
  countryFlag: {
    fontSize: 22,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  sendOTPButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: spacing.sm,
  },
  sendOTPText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  countryList: {
    paddingBottom: spacing.xl,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  countryItemFlag: {
    fontSize: 26,
  },
  countryItemName: {
    flex: 1,
    fontSize: 16,
  },
  countryItemDial: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
