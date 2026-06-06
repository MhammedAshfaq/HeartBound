import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
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
  const score = total > 0 ? Math.round((completed / total) * 100) : null;

  const latestMood = MOCK_MOOD_HISTORY.length > 0
    ? MOCK_MOOD_HISTORY[MOCK_MOOD_HISTORY.length - 1].mood
    : null;

  const cards = [
    {
      label: 'Score',
      value: score !== null ? `${score}%` : '--',
      bg: '#FFF0F0',
      textColor: '#d32f2f',
    },
    {
      label: 'Total Actions',
      value: String(total),
      bg: '#FFF8E1',
      textColor: '#f57f17',
    },
    {
      label: 'Latest Mood',
      value: latestMood ? MOOD_EMOJIS[latestMood] ?? '--' : '--',
      bg: '#F3E5F5',
      textColor: '#7b1fa2',
    },
  ];

  return (
    <View className="px-6">
      <Text style={{ color: c.text }} className="text-lg font-bold mb-3">Relationship Snapshot</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
        {cards.map((card) => (
          <View
            key={card.label}
            className="rounded-2xl px-5 py-4 mr-3 min-w-[120px]"
            style={{ backgroundColor: card.bg }}
          >
            <Text style={{ color: card.textColor }} className="text-2xl font-bold">{card.value}</Text>
            <Text style={{ color: card.textColor }} className="text-sm mt-1">{card.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
