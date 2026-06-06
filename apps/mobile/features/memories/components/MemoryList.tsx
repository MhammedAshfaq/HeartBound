import { useCallback } from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Memory } from '@/features/memories/types/memory.types';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

interface MemoryListProps {
  memories: Memory[];
}

export function MemoryList({ memories }: MemoryListProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);

  const renderItem = useCallback(
    ({ item }: { item: Memory }) => (
      <View className="flex-row rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: c.card }}>
        <View className="w-20 h-20">
          <Image source={{ uri: item.mediaUri }} className="w-full h-full" resizeMode="cover" />
        </View>
        <View className="flex-1 px-3 py-2.5 justify-center">
          <Text style={{ color: c.text }} className="font-semibold text-sm" numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={{ color: c.muted }} className="text-xs mt-0.5">
            {item.date}
          </Text>
          {item.location ? (
            <View className="flex-row items-center gap-1 mt-1">
              <Ionicons name="location-outline" size={11} color={c.muted} />
              <Text style={{ color: c.muted }} className="text-xs" numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    ),
    [c]
  );

  return (
    <FlatList
      data={memories}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 12 }}
      renderItem={renderItem}
    />
  );
}
