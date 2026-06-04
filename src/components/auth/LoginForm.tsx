import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { phoneSchema } from '@utils/validation';
import { countries, Country } from '@utils/countries';
import { useTheme } from '@context/ThemeContext';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { AppTheme } from '@utils/theme';
import { screenPadding } from '@hooks/useScreenLayout';

interface LoginFormProps {
  onSendOTP: (phone: string) => void;
  onSocialLogin: (provider: 'google' | 'apple' | 'facebook') => void;
  loading?: boolean;
}

interface LoginFormData {
  phone: string;
}

interface SocialButtonConfig {
  provider: 'google' | 'apple' | 'facebook';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const SOCIAL_BUTTONS: SocialButtonConfig[] = [
  {
    provider: 'google',
    icon: 'logo-google',
    color: '#DB4437',
  },
  {
    provider: 'apple',
    icon: 'logo-apple',
    color: '#000000',
  },
  {
    provider: 'facebook',
    icon: 'logo-facebook',
    color: '#1877F2',
  },
];

export const LoginForm: React.FC<LoginFormProps> = ({
  onSendOTP,
  onSocialLogin,
  loading = false,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === 'IN') || countries[0]
  );
  const [pickerVisible, setPickerVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(phoneSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    const fullPhone = `${selectedCountry.dialCode}${data.phone}`;
    onSendOTP(fullPhone);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="heart" size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Relationship Care</Text>
          <Text style={styles.subtitle}>Nurture your connection every day</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity
              style={[styles.countryPicker, errors.phone && styles.countryPickerError]}
              onPress={() => setPickerVisible(true)}
            >
              <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
              <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Enter phone number"
                  value={value}
                  onChangeText={onChange}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  containerStyle={styles.phoneInputContainer}
                />
              )}
            />
          </View>

          <Button
            title="Send OTP"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.loginButton}
          />

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          {SOCIAL_BUTTONS.map((btn) => (
            <TouchableOpacity
              key={btn.provider}
              style={styles.socialIconButton}
              onPress={() => onSocialLogin(btn.provider)}
            >
              <Ionicons
                name={btn.icon}
                size={24}
                color={btn.provider === 'apple' ? theme.colors.text : btn.color}
              />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <Modal visible={pickerVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setPickerVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    item.code === selectedCountry.code && styles.countryItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setPickerVisible(false);
                  }}
                >
                  <Text style={styles.countryItemFlag}>{item.flag}</Text>
                  <Text style={styles.countryItemName}>{item.name}</Text>
                  <Text style={styles.countryItemDial}>{item.dialCode}</Text>
                  {item.code === selectedCountry.code && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.countryList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    padding: screenPadding,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
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
  },
  form: {
    gap: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: -theme.spacing.xs,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: theme.colors.surface,
    marginTop: 22,
  },
  countryPickerError: {
    borderColor: theme.colors.error,
  },
  countryFlag: {
    fontSize: 22,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  phoneInputContainer: {
    flex: 1,
    marginTop: 22,
  },
  loginButton: {
    marginTop: theme.spacing.sm,
  },
  termsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: theme.spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  socialIconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  countryList: {
    paddingBottom: theme.spacing.xl,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: screenPadding,
    gap: 12,
  },
  countryItemSelected: {
    backgroundColor: theme.colors.primaryLight,
  },
  countryItemFlag: {
    fontSize: 26,
  },
  countryItemName: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  countryItemDial: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  });
