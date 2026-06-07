import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/lib/theme';
import { MOOD_EMOJIS } from '@/constants/Mood';
import { MOCK_MOOD_HISTORY } from '@/features/profile/types/profile.types';

interface RelationshipSnapshotProps {
  completed: number;
  total: number;
}

export function RelationshipSnapshot({ completed, total }: RelationshipSnapshotProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const { t } = useTranslation();
  const score = total > 0 ? Math.round((completed / total) * 100) : null;

  const latestMood = MOCK_MOOD_HISTORY.length > 0
    ? MOCK_MOOD_HISTORY[MOCK_MOOD_HISTORY.length - 1].mood
    : null;

  const cards = [
    {
      label: t('profile.score'),
      value: score !== null ? `${score}%` : '--',
      icon: 'trophy' as const,
      bg: isDark ? '#1b3a1b' : '#E8F5E9',
      iconColor: isDark ? '#66bb6a' : '#2e7d32',
      valueColor: isDark ? '#66bb6a' : '#2e7d32',
    },
    {
      label: t('profile.totalActions'),
      value: String(total),
      icon: 'checkmark-circle' as const,
      bg: isDark ? '#4a2000' : '#FFF3E0',
      iconColor: isDark ? '#ffb74d' : '#e65100',
      valueColor: isDark ? '#ffb74d' : '#e65100',
    },
    {
      label: t('profile.latestMood'),
      value: latestMood ? MOOD_EMOJIS[latestMood] ?? '--' : '--',
      icon: 'sparkles' as const,
      bg: isDark ? '#3a1545' : '#F3E5F5',
      iconColor: isDark ? '#ce93d8' : '#7b1fa2',
      valueColor: isDark ? '#ce93d8' : '#7b1fa2',
    },
  ];

  return (
    <View className="px-5 mt-2">
      <Text style={{ color: c.text }} className="text-lg font-bold mb-3">
        {t('profile.relationshipSnapshot')}
      </Text>
      <View className="flex-row gap-2.5">
        {cards.map((card) => (
          <View
            key={card.label}
            className="flex-1 rounded-2xl p-3.5 items-center"
            style={{ backgroundColor: card.bg }}
          >
            <View
              className="h-8 w-8 items-center justify-center rounded-full mb-2"
              style={{ backgroundColor: card.iconColor + '20' }}
            >
              <Ionicons name={card.icon} size={16} color={card.iconColor} />
            </View>
            <Text style={{ color: card.valueColor }} className="text-xl font-bold">
              {card.value}
            </Text>
            <Text style={{ color: card.valueColor }} className="text-[10px] font-medium mt-0.5">
              {card.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
