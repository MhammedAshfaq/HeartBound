import { memo } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Memory } from '@/features/memories/types/memory.types';
import { PrivacyBadge } from '@/features/memories/components/PrivacyBadge';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

interface MemoryCardProps {
  memory: Memory;
  onPress?: (memory: Memory) => void;
}

export const MemoryCard = memo(function MemoryCard({ memory, onPress }: MemoryCardProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);

  return (
    <Pressable
      onPress={() => onPress?.(memory)}
      className="flex-1 rounded-2xl overflow-hidden"
      style={{ backgroundColor: c.card }}
    >
      <View className="w-full aspect-square">
        <Image source={{ uri: memory.mediaUri }} className="w-full h-full" resizeMode="cover" />
        <PrivacyBadge isPrivate={memory.isPrivate} />
      </View>
      <View className="px-3 py-2.5">
        <Text style={{ color: c.text }} className="font-semibold text-sm" numberOfLines={1}>
          {memory.title}
        </Text>
        <Text style={{ color: c.muted }} className="text-xs mt-0.5">
          {memory.date}
        </Text>
        {memory.location ? (
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="location-outline" size={11} color={c.muted} />
            <Text style={{ color: c.muted }} className="text-xs" numberOfLines={1}>
              {memory.location}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});
