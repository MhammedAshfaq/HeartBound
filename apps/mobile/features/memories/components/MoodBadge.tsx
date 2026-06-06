import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MemoryFeeling } from '@/constants/Enums';

interface MoodBadgeProps {
  feeling: MemoryFeeling | null;
}

const MOOD_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  [MemoryFeeling.Happy]: 'happy-outline',
  [MemoryFeeling.Romantic]: 'heart-outline',
  [MemoryFeeling.Fun]: 'play-outline',
  [MemoryFeeling.Emotional]: 'water-outline',
};

export function MoodBadge({ feeling }: MoodBadgeProps) {
  if (!feeling) return null;

  const icon = MOOD_ICONS[feeling] ?? 'help-outline';

  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name={icon} size={14} color='#fff' />
      <Text className="text-white text-xs capitalize">{feeling}</Text>
    </View>
  );
}
