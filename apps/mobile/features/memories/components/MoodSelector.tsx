import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { MemoryFeeling } from '@/constants/Enums';
import type { MoodOption } from '@/features/memories/types/memory.types';

interface MoodSelectorProps {
  value: MemoryFeeling | null;
  onChange: (feeling: MemoryFeeling) => void;
  accentColor?: string;
}

const FEELINGS: MoodOption[] = [
  { value: MemoryFeeling.Happy, labelKey: 'memories.feelingHappy', icon: 'happy-outline' },
  { value: MemoryFeeling.Romantic, labelKey: 'memories.feelingRomantic', icon: 'heart-outline' },
  { value: MemoryFeeling.Fun, labelKey: 'memories.feelingFun', icon: 'play-outline' },
  { value: MemoryFeeling.Emotional, labelKey: 'memories.feelingEmotional', icon: 'water-outline' },
];

export function MoodSelector({ value, onChange, accentColor }: MoodSelectorProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const activeColor = accentColor ?? (isDark ? '#60a5fa' : '#3b82f6');

  return (
    <View className="flex-row flex-wrap gap-3">
      {FEELINGS.map((feeling) => {
        const selected = value === feeling.value;
        return (
          <Pressable
            key={feeling.value}
            onPress={() => onChange(feeling.value)}
            className="flex-row items-center gap-2 py-3 px-5 rounded-xl"
            style={{ backgroundColor: selected ? activeColor : c.card }}
          >
            <Ionicons
              name={feeling.icon}
              size={20}
              color={selected ? '#fff' : c.text}
            />
            <Text
              style={{ color: selected ? '#fff' : c.text }}
              className="font-semibold text-base"
            >
              {t(feeling.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
