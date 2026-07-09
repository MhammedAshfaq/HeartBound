import { useCallback, useMemo, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, shadows } from '@/lib/theme';
import { DatePickerModal } from '@/features/profile/components/DatePickerModal';

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const router = useRouter();
  const toast = useToast();
  const { user, updateProfile } = useAuth();

  const initialName = useMemo(() => {
    const currentName = user?.name?.trim() ?? '';
    if (!currentName || currentName === 'User') return '';
    return currentName;
  }, [user?.name]);

  const [name, setName] = useState(initialName);
  const [dob, setDob] = useState(user?.dateOfBirth ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [partnerName, setPartnerName] = useState(user?.partnerName ?? '');
  const [anniversaryDate, setAnniversaryDate] = useState(user?.anniversaryDate ?? '');
  const [partnerDob, setPartnerDob] = useState(user?.partnerDob ?? '');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [activePicker, setActivePicker] = useState<'dob' | 'anniversary' | 'partnerDob' | null>(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const pickFrom = useCallback(async (source: 'gallery' | 'camera') => {
    const permission = source === 'gallery'
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      toast.error({ title: t('common.error'), message: t('profile.permissionRequired') });
      return;
    }

    const result = source === 'gallery'
      ? await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      try {
        await updateProfile({
          name: name.trim() || initialName || undefined,
          dateOfBirth: dob || undefined,
          avatar: uri,
          partnerName: partnerName.trim() || undefined,
          anniversaryDate: anniversaryDate || undefined,
          partnerDob: partnerDob || undefined,
        });
        toast.success({ title: 'Profile picture updated successfully' });
      } catch {
        toast.error({ title: 'Failed to update profile picture' });
      }
    }
  }, [t, toast, updateProfile, name, initialName, dob, partnerName, anniversaryDate, partnerDob]);

  const handlePickImage = useCallback(() => {
    setPhotoModalVisible(true);
  }, []);

  const validateName = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  }, []);

  const handleSave = useCallback(async () => {
    if (!validateName(name)) return;
    setLoading(true);
    try {
      await updateProfile({
        name: name.trim() || undefined,
        dateOfBirth: dob || undefined,
        avatar: avatar || undefined,
        partnerName: partnerName.trim() || undefined,
        anniversaryDate: anniversaryDate || undefined,
        partnerDob: partnerDob || undefined,
      });
      toast.success({ title: 'Profile saved' });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  }, [name, dob, avatar, partnerName, anniversaryDate, partnerDob, router, updateProfile, validateName]);

  const formattedDob = dob ? format(new Date(dob), 'MMM dd, yyyy') : '';
  const formattedAnniversary = anniversaryDate ? format(new Date(anniversaryDate), 'MMM dd, yyyy') : '';
  const formattedPartnerDob = partnerDob ? format(new Date(partnerDob), 'MMM dd, yyyy') : '';

  const handleDateSelect = useCallback((date: string) => {
    if (activePicker === 'dob') setDob(date);
    else if (activePicker === 'anniversary') setAnniversaryDate(date);
    else if (activePicker === 'partnerDob') setPartnerDob(date);
    setActivePicker(null);
  }, [activePicker]);

  const hasChanges = name !== initialName
    || dob !== (user?.dateOfBirth ?? '')
    || avatar !== (user?.avatar ?? '')
    || partnerName !== (user?.partnerName ?? '')
    || anniversaryDate !== (user?.anniversaryDate ?? '')
    || partnerDob !== (user?.partnerDob ?? '');

  const showPartnerFields = user?.relationshipStatus !== 'single';

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-3" style={{ marginTop: 20 }}>
          <Pressable onPress={() => router.back()} className="py-3">
            <Ionicons name="close" size={24} color={c.text} />
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={loading || !hasChanges}
            className="py-2.5 px-6 rounded-xl"
            style={{
              backgroundColor: hasChanges ? c.primary : c.border,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text className="text-sm font-semibold text-white">
              {loading ? 'Saving...' : t('common.save')}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerClassName="pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View className="items-center pt-10 pb-8">
            <Pressable onPress={handlePickImage} className="relative">
              <Image
                source={{ uri: (avatar || user?.avatar) ?? undefined }}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  backgroundColor: c.border,
                  borderWidth: 3,
                  borderColor: c.card,
                }}
                resizeMode="cover"
              />
              <View
                className="absolute items-center justify-center rounded-full border-2"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: c.primary,
                  borderColor: c.card,
                  bottom: -4,
                  alignSelf: 'center',
                }}
              >
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </Pressable>
          </View>

          {/* Form Card */}
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
              {/* Name */}
              <View className="px-1" style={{ paddingVertical: 10 }}>
                <Text className="text-[13px] mb-2 ml-2 font-semibold" style={{ color: c.muted }}>
                  {t('auth.fullName')}
                </Text>
                <TextInput
                  value={name}
                  onChangeText={(val) => { setName(val); if (nameError) validateName(val); }}
                  placeholder="Enter your name"
                  placeholderTextColor={c.muted}
                  style={{
                    color: c.text,
                    backgroundColor: c.surface,
                    borderColor: nameError ? c.error : c.border,
                    textAlignVertical: 'center',
                    fontSize: 16,
                  }}
                  className="rounded-lg border px-4 py-2.5 text-base"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {nameError ? (
                  <Text style={{ color: c.error }} className="mt-1.5 text-xs font-semibold">
                    {nameError}
                  </Text>
                ) : null}
              </View>

              <View className="mx-1 border-t" style={{ borderColor: c.border }} />

              {/* Date of Birth */}
              <View className="px-1" style={{ paddingVertical: 10 }}>
                <Text className="text-[13px] mb-2 ml-2 font-semibold" style={{ color: c.muted }}>
                  {t('profile.dateOfBirth')}
                </Text>
                <Pressable
                  onPress={() => setActivePicker('dob')}
                  style={{
                    backgroundColor: c.surface,
                    borderColor: c.border,
                  }}
                  className="rounded-lg border px-4 py-2.5"
                >
                  <Text style={{ color: dob ? c.text : c.muted, fontSize: 16 }}>
                    {formattedDob || 'Select date'}
                  </Text>
                </Pressable>
              </View>

              {showPartnerFields && (
                <>
                  <View className="mx-1 border-t" style={{ borderColor: c.border }} />

                  {/* Anniversary */}
                  <View className="px-1" style={{ paddingVertical: 10}}>
                    <Text className="text-[13px] mb-2 ml-2 font-semibold" style={{ color: c.muted }}>
                      {t('auth.anniversaryDate')}
                    </Text>
                    <Pressable
                      onPress={() => setActivePicker('anniversary')}
                      style={{
                        backgroundColor: c.surface,
                        borderColor: c.border,
                      }}
                      className="rounded-lg border px-4 py-2.5"
                    >
                      <Text style={{ color: anniversaryDate ? c.text : c.muted, fontSize: 16 }}>
                        {formattedAnniversary || 'Select date'}
                      </Text>
                    </Pressable>
                  </View>

                  <View className="mx-1 border-t" style={{ borderColor: c.border }} />

                  {/* Partner Name */}
                  <View className="px-1" style={{ paddingVertical: 10 }}>
                    <Text className="text-[13px] mb-2 ml-2 font-semibold" style={{ color: c.muted }}>
                      {t('auth.partnerName')}
                    </Text>
                    <TextInput
                      value={partnerName}
                      onChangeText={setPartnerName}
                      placeholder="Enter partner name"
                      placeholderTextColor={c.muted}
                      style={{
                        color: c.text,
                        backgroundColor: c.surface,
                        borderColor: c.border,
                        textAlignVertical: 'center',
                        fontSize: 16,
                      }}
                      className="rounded-lg border px-4 py-2.5 text-base"
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>

                  <View className="mx-1 border-t" style={{ borderColor: c.border }} />

                  {/* Partner DOB */}
                  <View className="px-1" style={{ paddingVertical: 10 }}>
                    <Text className="text-[13px] mb-2 ml-2 font-semibold" style={{ color: c.muted }}>
                      {t('auth.partnerDob')}
                    </Text>
                    <Pressable
                      onPress={() => setActivePicker('partnerDob')}
                      style={{
                        backgroundColor: c.surface,
                        borderColor: c.border,
                      }}
                      className="rounded-lg border px-4 py-2.5"
                    >
                      <Text style={{ color: partnerDob ? c.text : c.muted, fontSize: 16 }}>
                        {formattedPartnerDob || 'Select date'}
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={photoModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          onPress={() => setPhotoModalVisible(false)}
        >
          <View 
            style={{ backgroundColor: c.background, padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            onStartShouldSetResponder={() => true}
          >
            <Text style={{ color: c.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Profile Photo
            </Text>
            
            <Pressable 
              onPress={() => { setPhotoModalVisible(false); pickFrom('camera'); }}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.border }}
            >
              <Ionicons name="camera-outline" size={24} color={c.text} style={{ marginRight: 12 }} />
              <Text style={{ color: c.text, fontSize: 16 }}>{t('profile.camera')}</Text>
            </Pressable>

            <Pressable 
              onPress={() => { setPhotoModalVisible(false); pickFrom('gallery'); }}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}
            >
              <Ionicons name="images-outline" size={24} color={c.text} style={{ marginRight: 12 }} />
              <Text style={{ color: c.text, fontSize: 16 }}>{t('profile.gallery')}</Text>
            </Pressable>

            <Pressable 
              onPress={() => setPhotoModalVisible(false)}
              style={{ marginTop: 16, backgroundColor: c.card, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: c.text, fontSize: 16, fontWeight: '600' }}>{t('common.cancel')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <DatePickerModal
        visible={activePicker === 'dob'}
        onClose={() => setActivePicker(null)}
        onSelect={handleDateSelect}
        initialDate={dob || undefined}
        title={t('profile.dateOfBirth')}
      />
      <DatePickerModal
        visible={activePicker === 'anniversary'}
        onClose={() => setActivePicker(null)}
        onSelect={handleDateSelect}
        initialDate={anniversaryDate || undefined}
        title={t('auth.anniversaryDate')}
      />
      <DatePickerModal
        visible={activePicker === 'partnerDob'}
        onClose={() => setActivePicker(null)}
        onSelect={handleDateSelect}
        initialDate={partnerDob || undefined}
        title={t('auth.partnerDob')}
      />
    </SafeAreaView>
  );
}
