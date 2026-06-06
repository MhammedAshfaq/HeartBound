import { useCallback, useMemo, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/lib/theme';

type GenderValue = 'male' | 'female' | 'nonBinary' | 'preferNotToSay';
type RelationshipValue = 'single' | 'inRelationship' | 'married' | 'engaged';

interface ChipOption<T> {
  value: T;
  label: string;
}

function formatDobInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function isValidDob(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day &&
    parsed <= today
  );
}

export default function SetupProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const infoColor = isDark ? '#60a5fa' : '#3b82f6';
  const router = useRouter();
  const toast = useToast();
  const { user, updateProfile } = useAuth();

  const initialName = useMemo(() => {
    const currentName = user?.name?.trim() ?? '';
    if (!currentName || currentName === 'User' || currentName.endsWith(' User')) {
      return '';
    }
    return currentName;
  }, [user?.name]);

  const [name, setName] = useState(initialName);
  const [dob, setDob] = useState(user?.dateOfBirth ?? '');
  const [emailId, setEmailId] = useState(user?.email ?? '');
  const [gender, setGender] = useState<GenderValue | ''>((user?.gender as GenderValue) ?? '');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipValue | ''>((user?.relationshipStatus as RelationshipValue) ?? '');
  const [partnerId, setPartnerId] = useState(user?.partnerId ?? '');
  const [partnerName, setPartnerName] = useState(user?.partnerName ?? '');
  const [anniversaryDate, setAnniversaryDate] = useState(user?.anniversaryDate ?? '');
  const [partnerDob, setPartnerDob] = useState(user?.partnerDob ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');

  const [nameError, setNameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [relationshipError, setRelationshipError] = useState('');
  const [loading, setLoading] = useState(false);

  const showPartnerFields = relationshipStatus !== '' && relationshipStatus !== 'single';

  const clearGenderError = useCallback((value: GenderValue | '') => {
    setGender(value);
    if (genderError) setGenderError('');
  }, [genderError]);

  const clearRelationshipError = useCallback((value: RelationshipValue | '') => {
    setRelationshipStatus(value);
    if (relationshipError) setRelationshipError('');
  }, [relationshipError]);

  const genderOptions: ChipOption<GenderValue>[] = [
    { value: 'male', label: t('auth.genderMale') },
    { value: 'female', label: t('auth.genderFemale') },
    { value: 'nonBinary', label: t('auth.genderNonBinary') },
    { value: 'preferNotToSay', label: t('auth.genderPreferNotToSay') },
  ];

  const relationshipOptions: ChipOption<RelationshipValue>[] = [
    { value: 'single', label: t('auth.statusSingle') },
    { value: 'inRelationship', label: t('auth.statusInRelationship') },
    { value: 'married', label: t('auth.statusMarried') },
    { value: 'engaged', label: t('auth.statusEngaged') },
  ];

  const validateName = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setNameError(t('auth.nameRequired'));
      return false;
    }
    if (trimmed.length < 2) {
      setNameError(t('auth.nameTooShort'));
      return false;
    }
    setNameError('');
    return true;
  }, [t]);

  const validateDob = useCallback((value: string) => {
    if (!value) {
      setDobError(t('auth.dateOfBirthRequired'));
      return false;
    }
    if (!isValidDob(value)) {
      setDobError(t('auth.dateOfBirthInvalid'));
      return false;
    }
    setDobError('');
    return true;
  }, [t]);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    if (nameError) validateName(value);
  }, [nameError, validateName]);

  const handleDobChange = useCallback((value: string) => {
    const formatted = formatDobInput(value);
    setDob(formatted);
    if (dobError) validateDob(formatted);
  }, [dobError, validateDob]);

  const handleAnniversaryChange = useCallback((value: string) => {
    setAnniversaryDate(formatDobInput(value));
  }, []);

  const handlePartnerDobChange = useCallback((value: string) => {
    setPartnerDob(formatDobInput(value));
  }, []);

  const handleSave = useCallback(async () => {
    const validName = validateName(name);
    const validDob = validateDob(dob);
    const validGender = gender !== '';
    const validRelationship = relationshipStatus !== '';
    if (!validGender) setGenderError('Please select your gender');
    else setGenderError('');
    if (!validRelationship) setRelationshipError('Please select your relationship status');
    else setRelationshipError('');
    if (!validName || !validDob || !validGender || !validRelationship) return;

    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        dateOfBirth: dob,
        gender,
        relationshipStatus,
        partnerId: partnerId.trim() || undefined,
        partnerName: partnerName.trim() || undefined,
        anniversaryDate: anniversaryDate || undefined,
        partnerDob: partnerDob || undefined,
        avatar: avatar || undefined,
      });
    } catch {
    }
    router.replace('/(auth)/relationship-questions');
  }, [
    name, dob, gender, relationshipStatus,
    partnerId, partnerName, anniversaryDate, partnerDob, avatar,
    router, updateProfile, validateDob, validateName,
  ]);

  function renderChips<T extends string>(
    options: ChipOption<T>[],
    selected: T | '',
    onSelect: (value: T | '') => void,
  ) {
    return (
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(isSelected ? '' : option.value)}
              style={{
                borderColor: isSelected ? infoColor : c.border,
                backgroundColor: isSelected ? infoColor + '15' : c.surface,
              }}
              className="rounded-full border px-4 py-2.5"
            >
              <Text
                style={{ color: isSelected ? infoColor : c.muted }}
                className="text-sm font-bold"
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function renderField({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    optional,
    keyboardType,
    autoCapitalize,
    hint,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    optional?: boolean;
    keyboardType?: 'default' | 'email-address' | 'number-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    hint?: string;
  }) {
    return (
      <View className="mb-5">
        <View className="mb-1.5 flex-row items-center justify-between">
          <Text style={{ color: c.text }} className="text-sm font-bold">
            {label}
            {!optional ? <Text style={{ color: c.error }}> *</Text> : null}
          </Text>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.muted}
          style={{
            color: c.text,
            backgroundColor: c.surface,
            borderColor: error ? c.error : c.border,
          }}
          className="rounded-lg border px-4 py-3.5 text-base"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        {hint ? (
          <Text style={{ color: c.muted }} className="mt-1 text-xs leading-4">
            {hint}
          </Text>
        ) : null}
        {error ? (
          <Text style={{ color: c.error }} className="mt-1 text-xs font-semibold">
            {error}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="grow pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-8">
            {/* Header */}
            <Text style={{ color: c.text }} className="text-3xl font-extrabold tracking-tight">
              {t('auth.setupProfileTitle')}
            </Text>

            {/* Profile Picture */}
            <View className="my-8 items-center">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={avatar ? t('auth.changePhoto') : t('auth.addPhoto')}
                onPress={() => {
                  const pickFromGallery = async () => {
                    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (!permission.granted) {
                      toast.error({ title: t('common.error'), message: 'Permission to access gallery is required' });
                      return;
                    }
                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ['images'],
                      allowsEditing: true,
                      aspect: [1, 1],
                      quality: 0.8,
                    });
                    if (!result.canceled && result.assets[0]?.uri) {
                      setAvatar(result.assets[0].uri);
                    }
                  };

                  const takePhoto = async () => {
                    const permission = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permission.granted) {
                      toast.error({ title: t('common.error'), message: 'Camera permission is required' });
                      return;
                    }
                    const result = await ImagePicker.launchCameraAsync({
                      allowsEditing: true,
                      aspect: [1, 1],
                      quality: 0.8,
                    });
                    if (!result.canceled && result.assets[0]?.uri) {
                      setAvatar(result.assets[0].uri);
                    }
                  };

                  if (Platform.OS === 'ios') {
                    ActionSheetIOS.showActionSheetWithOptions(
                      {
                        options: ['Cancel', t('auth.gallery'), t('auth.camera')],
                        cancelButtonIndex: 0,
                      },
                      (index) => {
                        if (index === 1) pickFromGallery();
                        if (index === 2) takePhoto();
                      },
                    );
                  } else {
                    Alert.alert(t('auth.profilePicture'), undefined, [
                      { text: t('auth.gallery'), onPress: pickFromGallery },
                      { text: t('auth.camera'), onPress: takePhoto },
                      { text: t('common.cancel'), style: 'cancel' },
                    ]);
                  }
                }}
                className="items-center justify-center"
              >
                <View
                  style={{
                    backgroundColor: avatar ? 'transparent' : infoColor + '12',
                    borderColor: avatar ? infoColor : infoColor + '30',
                  }}
                  className="h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed"
                >
                  {avatar ? (
                    <Image source={{ uri: avatar }} className="h-full w-full rounded-full" />
                  ) : (
                    <Ionicons name="camera" size={28} color={infoColor} />
                  )}
                </View>
                <View
                  style={{ backgroundColor: infoColor, borderColor: c.background }}
                  className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2"
                >
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                </View>
              </Pressable>
              <Text style={{ color: c.muted }} className="mt-2 text-xs font-medium">
                {avatar ? t('auth.changePhoto') : t('auth.addPhoto')}
              </Text>
            </View>

            {/* Form Fields */}
            <View
              style={{ backgroundColor: c.card, borderColor: c.border }}
              className="rounded-2xl border p-5"
            >
              {/* Full Name */}
              {renderField({
                label: t('auth.fullName'),
                value: name,
                onChangeText: handleNameChange,
                placeholder: t('auth.fullNamePlaceholder'),
                error: nameError,
                autoCapitalize: 'words',
              })}

              {/* Date of Birth */}
              {renderField({
                label: t('auth.dateOfBirth'),
                value: dob,
                onChangeText: handleDobChange,
                placeholder: t('auth.dateOfBirthPlaceholder'),
                error: dobError,
                keyboardType: 'number-pad',
                hint: t('auth.dateOfBirthHint'),
              })}

              {/* Email ID */}
              {renderField({
                label: t('auth.emailId'),
                value: emailId,
                onChangeText: setEmailId,
                placeholder: t('auth.emailPlaceholder'),
                optional: true,
                keyboardType: 'email-address',
                autoCapitalize: 'none',
              })}

              {/* Gender */}
              <View className="mb-5">
                <Text style={{ color: c.text }} className="mb-1.5 text-sm font-bold">
                  {t('auth.gender')}<Text style={{ color: c.error }}> *</Text>
                </Text>
                {renderChips<GenderValue>(genderOptions, gender, clearGenderError)}
                {genderError ? (
                  <Text style={{ color: c.error }} className="mt-1 text-xs font-semibold">{genderError}</Text>
                ) : null}
              </View>

              {/* Relationship Status */}
              <View className="mb-2">
                <Text style={{ color: c.text }} className="mb-1.5 text-sm font-bold">
                  {t('auth.relationshipStatus')}<Text style={{ color: c.error }}> *</Text>
                </Text>
                {renderChips<RelationshipValue>(relationshipOptions, relationshipStatus, clearRelationshipError)}
                {relationshipError ? (
                  <Text style={{ color: c.error }} className="mt-1 text-xs font-semibold">{relationshipError}</Text>
                ) : null}
              </View>
            </View>

            {/* Partner Section */}
            {showPartnerFields ? (
              <View
                style={{ backgroundColor: c.card, borderColor: c.border }}
                className="mb-6 mt-4 rounded-2xl border p-5"
              >
                <Text style={{ color: c.text }} className="mb-4 text-lg font-bold">
                  {t('profile.partnerConnection')}
                </Text>

                {/* Partner ID */}
                {renderField({
                  label: t('auth.partnerId'),
                  value: partnerId,
                  onChangeText: setPartnerId,
                  placeholder: t('auth.partnerIdPlaceholder'),
                  optional: true,
                  autoCapitalize: 'none',
                  hint: t('auth.partnerIdHint'),
                })}

                {/* Partner Name */}
                {renderField({
                  label: t('auth.partnerName'),
                  value: partnerName,
                  onChangeText: setPartnerName,
                  placeholder: t('auth.partnerNamePlaceholder'),
                  optional: true,
                  autoCapitalize: 'words',
                })}

                {/* Anniversary Date */}
                {renderField({
                  label: t('auth.anniversaryDate'),
                  value: anniversaryDate,
                  onChangeText: handleAnniversaryChange,
                  placeholder: t('auth.anniversaryPlaceholder'),
                  optional: true,
                  keyboardType: 'number-pad',
                })}

                {/* Partner DOB */}
                {renderField({
                  label: t('auth.partnerDob'),
                  value: partnerDob,
                  onChangeText: handlePartnerDobChange,
                  placeholder: t('auth.partnerDobPlaceholder'),
                  optional: true,
                  keyboardType: 'number-pad',
                })}
              </View>
            ) : null}

            {/* Save Button */}
            <Pressable
              accessibilityRole="button"
              onPress={handleSave}
              disabled={loading}
              style={{
                backgroundColor: infoColor,
                opacity: loading ? 0.75 : 1,
              }}
              className="mt-2 min-h-[54px] items-center justify-center rounded-xl"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-extrabold tracking-wide text-white">
                  {t('common.next')}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
