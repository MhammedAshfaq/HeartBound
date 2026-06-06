import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { differenceInMonths, format, parse } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';


interface ProfileHeaderProps {
  name: string;
  avatar?: string;
  partnerName?: string;
  anniversaryDate?: string;
  streak: number;
  completedActionsCount: number;
  statsCompleted: number;
}

export function ProfileHeader({
  name,
  partnerName,
  anniversaryDate,
  streak,
  completedActionsCount,
  statsCompleted,
}: ProfileHeaderProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const initial = (name ?? 'User').charAt(0).toUpperCase();

  let durationStr = '';
  if (anniversaryDate) {
    try {
      const parsed = parse(anniversaryDate, 'yyyy-MM-dd', new Date());
      const months = differenceInMonths(new Date(), parsed);
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      durationStr = `${years}y ${remainingMonths}m`;
    } catch {
      durationStr = '';
    }
  }

  return (
    <View className="items-center px-6 pt-6 pb-4">
      <View className="w-16 h-16 rounded-full items-center justify-center mb-3" style={{ backgroundColor: c.primary }}>
        <Text className="text-2xl font-bold text-white">{initial}</Text>
      </View>

      <Text style={{ color: c.text }} className="text-xl font-bold">{name}</Text>

      {partnerName ? (
        <View className="flex-row items-center gap-1 mt-1">
          <Ionicons name="heart" size={14} color="#e11d48" />
          <Text className="text-sm" style={{ color: '#e11d48' }}>{partnerName}</Text>
        </View>
      ) : (
        <Text className="text-sm italic mt-1" style={{ color: c.muted }}>Connect with your partner</Text>
      )}

      {anniversaryDate && durationStr ? (
        <View className="flex-row items-center gap-1 mt-1">
          <Text style={{ color: c.muted }} className="text-xs">
            Together since {format(parse(anniversaryDate, 'yyyy-MM-dd', new Date()), 'MMM yyyy')} · {durationStr}
          </Text>
        </View>
      ) : null}

      <View className="flex-row items-center justify-around w-full mt-4">
        <View className="items-center">
          <View className="flex-row items-center gap-1">
            <Ionicons name="heart" size={16} color="#e11d48" />
            <Text style={{ color: c.text }} className="text-lg font-bold">{streak}</Text>
          </View>
          <Text style={{ color: c.muted }} className="text-xs">day streak</Text>
        </View>
        <View className="items-center">
          <View className="flex-row items-center gap-1">
            <Ionicons name="sparkles" size={16} color="#f59e0b" />
            <Text style={{ color: c.text }} className="text-lg font-bold">{completedActionsCount}</Text>
          </View>
          <Text style={{ color: c.muted }} className="text-xs">moments</Text>
        </View>
        <View className="items-center">
          <View className="flex-row items-center gap-1">
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text style={{ color: c.text }} className="text-lg font-bold">{statsCompleted}</Text>
          </View>
          <Text style={{ color: c.muted }} className="text-xs">actions done</Text>
        </View>
      </View>
    </View>
  );
}
