import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import {
  ActionCategory,
  ACTION_CATEGORY_META,
  MOCK_ACTIONS,
} from '@/features/profile/types/profile.types';

interface ActivityInsightsProps {
  completed: number;
  total: number;
  streak: number;
}

function getMostActiveCategory(): { emoji: string; label: string } {
  if (MOCK_ACTIONS.length === 0) {
    return ACTION_CATEGORY_META[ActionCategory.Communication];
  }
  const counts: Record<string, number> = {};
  for (const action of MOCK_ACTIONS) {
    counts[action.category] = (counts[action.category] ?? 0) + 1;
  }
  const top = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];
  return ACTION_CATEGORY_META[top?.[0] as ActionCategory] ?? ACTION_CATEGORY_META[ActionCategory.Communication];
}

export function ActivityInsights({ completed, total, streak }: ActivityInsightsProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const topCategory = getMostActiveCategory();

  return (
    <View className="px-6 mt-6">
      <Text style={{ color: c.text }} className="text-lg font-bold mb-3">Activity Insights</Text>
      <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: c.card }}>
        <InsightRow
          icon="checkmark-circle"
          iconColor="#16a34a"
          label="Actions Completed"
          value={`${completed} of ${total}`}
        />
        <View style={{ borderColor: c.border }} className="border-t" />
        <InsightRow
          icon="trending-up"
          iconColor="#f59e0b"
          label="Most Active Category"
          value={`${topCategory.emoji} ${topCategory.label}`}
        />
        <View style={{ borderColor: c.border }} className="border-t" />
        <InsightRow
          icon="flame"
          iconColor="#ff6b35"
          label="Consistency"
          value={streak > 0 ? `${streak}-day streak 🔥` : 'Start your streak!'}
        />
      </View>
    </View>
  );
}

function InsightRow({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
}) {
  const { isDark } = useTheme();
  const c = colors(isDark);

  return (
    <View className="flex-row items-center px-4 py-3.5">
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={{ color: c.text }} className="flex-1 text-sm ml-3">{label}</Text>
      <Text style={{ color: c.text }} className="text-sm font-semibold">{value}</Text>
    </View>
  );
}
