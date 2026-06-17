import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, shadows } from '@/lib/theme';
import { formatDate } from '@/lib/utils/formatter';
import { ProfileDetailRow } from '@/features/profile/components/ProfileDetailRow';
import type { PartnerBasic } from '@/features/profile/types/profile.types';

interface PartnerDetailsCardProps {
  partner: PartnerBasic;
}

function formatDisplayDate(value: string, fallback: string): string {
  if (!value?.trim()) return fallback;
  try {
    return formatDate(value);
  } catch {
    return value;
  }
}

export function PartnerDetailsCard({ partner }: PartnerDetailsCardProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const notSet = t('profile.notSet');

  const fields = [
    {
      icon: 'person-outline' as const,
      iconColor: '#e11d48',
      label: t('auth.fullName'),
      value: partner.name?.trim() || notSet,
    },
    {
      icon: 'calendar-outline' as const,
      iconColor: '#7c3aed',
      label: t('profile.dateOfBirth'),
      value: formatDisplayDate(partner.dateOfBirth, notSet),
    },
    {
      icon: 'mail-outline' as const,
      iconColor: '#2563eb',
      label: t('profile.email'),
      value: partner.email?.trim() || notSet,
    },
  ];

  return (
    <View className="mb-5">
      {/* ─── Section Title ─── */}
      <View className="flex-row items-center gap-2.5 px-1" style={{marginBottom:5}}>
        <View
          className="h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: '#e11d4815' }}
        >
          <Ionicons name="heart-circle" size={20} color="#e11d48" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold" style={{ color: c.text }}>
            {t('profile.partnerDetails')}
          </Text>
        </View>
      </View>

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
          />
        ))}
      </View>
    </View>
  );
}
