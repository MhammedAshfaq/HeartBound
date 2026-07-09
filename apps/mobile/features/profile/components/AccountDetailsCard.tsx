import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, shadows } from '@/lib/theme';
import { formatDate } from '@/lib/utils/formatter';
import { ProfileDetailRow } from '@/features/profile/components/ProfileDetailRow';
import type { ProfileBasicInfo } from '@/features/profile/types/profile.types';

interface AccountDetailsCardProps {
  profile: ProfileBasicInfo;
}

function formatDisplayDate(value: string, fallback: string): string {
  if (!value?.trim()) return fallback;
  try {
    return formatDate(value);
  } catch {
    return value;
  }
}

export function AccountDetailsCard({ profile }: AccountDetailsCardProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const notSet = t('profile.notSet');

  const fields = [
    {
      icon: 'mail-outline' as const,
      iconColor: '#2563eb',
      label: t('profile.email'),
      value: profile.email?.trim() || notSet,
    },
    {
      icon: 'call-outline' as const,
      iconColor: '#0891b2',
      label: t('profile.phone'),
      value: profile.phone?.trim() || notSet,
    },
    {
      icon: 'calendar-outline' as const,
      iconColor: '#7c3aed',
      label: t('profile.dateOfBirth'),
      value: formatDisplayDate(profile.dateOfBirth, notSet),
    },
    {
      icon: 'globe-outline' as const,
      iconColor: '#059669',
      label: t('profile.country'),
      value: profile.country?.trim() || notSet,
    },
    {
      icon: 'heart-outline' as const,
      iconColor: '#e11d48',
      label: t('profile.status'),
      value: profile.relationshipStatus?.trim() || notSet,
      badge: true,
    },
    ...(profile.relationshipStatus?.toLowerCase() !== 'single' ? [{
      icon: 'heart-circle' as const,
      iconColor: '#db2777',
      label: t('profile.anniversary'),
      value: profile.partner?.anniversary?.trim()
        ? formatDisplayDate(profile.partner.anniversary, notSet)
        : notSet,
    }] : []),
  ];

  return (
    <View className="mb-5">
      <Text className="text-base font-bold px-1 ml-2" style={{ color: c.text, marginBottom:5 }}>
        {t('profile.about')}
      </Text>

      <View
        className="rounded-xl"
        style={{
          backgroundColor: c.card,
          paddingVertical: 14,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...s.sm,
        }}
      >
        {fields.map((field) => (
          <ProfileDetailRow
            key={field.label}
            icon={field.icon}
            iconColor={field.iconColor}
            label={field.label}
            value={field.value}
            badge={field.badge}
          />
        ))}
      </View>
    </View>
  );
}
