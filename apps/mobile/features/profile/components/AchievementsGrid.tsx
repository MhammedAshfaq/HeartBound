import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { ACHIEVEMENTS } from '@/features/profile/types/profile.types';

export function AchievementsGrid() {
  const { isDark } = useTheme();
  const c = colors(isDark);

  return (
    <View className="px-6 mt-6">
      <Text style={{ color: c.text }} className="text-lg font-bold mb-3">Achievements</Text>
      <View className="flex-row flex-wrap">
        {ACHIEVEMENTS.map((achievement) => (
          <View
            key={achievement.id}
            className="w-1/3 items-center py-3"
            style={{ opacity: achievement.earned ? 1 : 0.6 }}
          >
            <Text className="text-3xl mb-1">{achievement.emoji}</Text>
            <Text
              style={{ color: achievement.earned ? c.text : c.muted }}
              className="text-xs text-center font-semibold"
              numberOfLines={2}
            >
              {achievement.label}
            </Text>
            {achievement.earned ? (
              <Ionicons name="checkmark-circle" size={14} color="#16a34a" style={{ marginTop: 2 }} />
            ) : (
              <Ionicons name="lock-closed" size={14} color={c.muted} style={{ marginTop: 2 }} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
