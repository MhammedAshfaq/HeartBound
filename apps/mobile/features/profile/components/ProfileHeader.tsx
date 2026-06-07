import { useCallback } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/useToast';
import { colors, shadows } from '@/lib/theme';
import type { ProfileBasicInfo } from '@/features/profile/types/profile.types';

interface Props {
  profile: ProfileBasicInfo;
  onAvatarChange?: (uri: string) => void;
  onEditProfile?: () => void;
}

type ThemeColors = ReturnType<typeof colors>;
type ThemeShadows = ReturnType<typeof shadows>;

/* ------------------ Shared UI ------------------ */

function ValueRow({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: ThemeColors;
}) {
  return (
    <View className="flex-row items-center px-4 py-3.5">
      <View
        className="h-7 w-7 items-center justify-center rounded-lg mr-3"
        style={{ backgroundColor: color.primary + '14' }}
      >
        <Ionicons name={icon} size={14} color={color.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-[10px]" style={{ color: color.muted }}>
          {label}
        </Text>
        <Text className="text-sm" style={{ color: color.text }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function SectionCard({
  title,
  children,
  color,
  shadow,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  color: ThemeColors;
  shadow: ThemeShadows;
  icon?: React.ReactNode;
}) {
  return (
    <View
      className="rounded-2xl overflow-hidden mb-4"
      style={{ backgroundColor: color.card, ...shadow.sm }}
    >
      <View className="flex-row items-center gap-2 px-4 pt-4 pb-1">
        {icon}
        <Text className="text-base font-bold" style={{ color: color.text }}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function QuickStat({
  value,
  label,
  icon,
  accent,
}: {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
}) {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);

  return (
    <View
      className="flex-1 rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: c.card,
        borderColor: c.border,
        ...s.sm,
      }}
    >
      <View className="items-center py-3.5 px-2">
        <View
          className="h-9 w-9 items-center justify-center rounded-full mb-2"
          style={{ backgroundColor: accent + '18' }}
        >
          <Ionicons name={icon} size={16} color={accent} />
        </View>
        <Text className="text-xl font-extrabold" style={{ color: c.text }}>
          {value}
        </Text>
        <Text className="text-[11px] font-medium mt-0.5 text-center" style={{ color: c.muted }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

/* ------------------ Main Component ------------------ */

export function ProfileHeader({ profile, onAvatarChange, onEditProfile }: Props) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const toast = useToast();

  const pickImage = useCallback(async (kind: 'gallery' | 'camera') => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1] as [number, number],
    };

    let result: ImagePicker.ImagePickerResult;

    if (kind === 'gallery') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.error({ title: 'Permission required', message: 'Gallery access is needed to choose a photo' });
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        toast.error({ title: 'Permission required', message: 'Camera access is needed to take a photo' });
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled && result.assets[0]) {
      onAvatarChange?.(result.assets[0].uri);
    }
  }, [onAvatarChange, toast]);

  const handleCameraPress = useCallback(() => {
    Alert.alert(
      t('profile.changePhoto'),
      '',
      [
        { text: t('profile.gallery'), onPress: () => pickImage('gallery') },
        { text: t('profile.camera'), onPress: () => pickImage('camera') },
        { text: t('common.cancel'), style: 'cancel' },
      ],
    );
  }, [t, pickImage]);

  return (
    <View className="px-4 pt-1">
      {/* ─── Avatar + Name ─── */}
      <View className="items-center mb-3">
        <View className="relative mb-2" style={{ width: 112, height: 112 }}>
          <Image
            source={{ uri: profile.avatar }}
            style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: c.border }}
            resizeMode="cover"
          />
          <Pressable
            onPress={handleCameraPress}
            className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2"
            style={{
              backgroundColor: c.primary,
              borderColor: c.background,
            }}
          >
            <Ionicons name="camera" size={16} color="#fff" />
          </Pressable>
        </View>
        <Text className="text-2xl font-extrabold" style={{ color: c.text }}>
          {profile.name}
        </Text>
        <Pressable
          onPress={onEditProfile}
          className="flex-row items-center justify-center gap-1.5 mt-3 px-6 py-2.5 rounded-xl"
          style={{ backgroundColor: c.primary }}
        >
          <Text className="text-sm font-semibold" style={{ color: '#fff' }}>
            {t('profile.editProfile')}
          </Text>
        </Pressable>
      </View>

      {/* ─── 3 Stat Cards ─── */}
      <View className="flex-row gap-2.5 mb-4">
        <QuickStat
          value="5"
          label={t('profile.streak')}
          icon="flame"
          accent="#e65100"
        />
        <QuickStat
          value="70%"
          label={t('profile.score')}
          icon="trophy"
          accent="#2e7d32"
        />
        <QuickStat
          value="120"
          label={t('profile.daysTogether')}
          icon="calendar"
          accent="#7b1fa2"
        />
      </View>

      {/* ─── User Info Card ─── */}
      <SectionCard title={t('profile.account')} color={c} shadow={s}>
        <ValueRow icon="mail-outline" label={t('profile.email')} value={profile.email} color={c} />
        <ValueRow icon="call-outline" label={t('profile.phone')} value={profile.phone} color={c} />
        <ValueRow icon="calendar-outline" label={t('profile.dateOfBirth')} value={profile.dateOfBirth} color={c} />
        <ValueRow icon="heart-outline" label={t('profile.status')} value={profile.relationshipStatus} color={c} />
      </SectionCard>

      {/* ─── Partner Info Card ─── */}
      {profile.partner && (
        <SectionCard
          title={t('profile.partnerDetails')}
          color={c}
          shadow={s}
          icon={<Ionicons name="heart-circle" size={18} color="#e11d48" />}
        >
          <ValueRow icon="person-outline" label={t('auth.fullName')} value={profile.partner.name} color={c} />
          <ValueRow icon="calendar-outline" label={t('profile.dateOfBirth')} value={profile.partner.dateOfBirth} color={c} />
          <ValueRow icon="mail-outline" label={t('profile.email')} value={profile.partner.email} color={c} />
          <ValueRow icon="heart-circle" label={t('profile.anniversary')} value={profile.partner.anniversary} color={c} />
        </SectionCard>
      )}
    </View>
  );
}
