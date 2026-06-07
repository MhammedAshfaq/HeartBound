import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { shadows } from '@/lib/theme';

interface AIInsightsCardProps {
  streak: number;
  total: number;
}

export function AIInsightsCard({ streak, total }: AIInsightsCardProps) {
  const { isDark } = useTheme();
  const s = shadows(isDark);
  const tintBg = isDark ? '#2d1b4e' : '#F3E5F5';
  const tintText = isDark ? '#d4bfff' : '#6a1b9a';

  let content: string;
  if (total === 0) {
    content = 'Start adding actions to receive personalized insights about your relationship patterns.';
  } else if (streak > 3) {
    content = `You're on a ${streak}-day streak! Keep the momentum going — try adding a surprise action today.`;
  } else {
    content = 'Try to complete at least one action daily to build consistency and strengthen your bond.';
  }

  return (
    <View className="px-4 mt-6">
      <View className="rounded-2xl p-4" style={{ backgroundColor: tintBg, ...s.sm }}>
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons name="sparkles" size={18} color={tintText} />
          <Text style={{ color: tintText }} className="font-bold text-sm">Personalized for you</Text>
        </View>
        <Text style={{ color: tintText }} className="text-sm leading-5">{content}</Text>
      </View>
    </View>
  );
}
