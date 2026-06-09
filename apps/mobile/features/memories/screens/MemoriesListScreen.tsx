import { useCallback, useMemo } from 'react';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { MemoryGalleryRow } from '@/features/memories/components/MemoryGalleryRow';
import { useMemories } from '@/features/memories/hooks/useMemories';
import type { Memory } from '@/features/memories/types/memory.types';

function groupByDate(memories: Memory[]): [string, Memory[]][] {
  const map = new Map<string, Memory[]>();
  for (const mem of memories) {
    const existing = map.get(mem.date) ?? [];
    existing.push(mem);
    map.set(mem.date, existing);
  }
  return Array.from(map.entries()).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
  );
}

export default function MemoriesListScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const router = useRouter();
  const { memories, refresh } = useMemories();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const grouped = useMemo(() => groupByDate(memories), [memories]);

  const handleImagePress = useCallback(
    (memory: Memory) => {
      router.push(`/(modals)/memory-detail?id=${memory.id}`);
    },
    [router],
  );

  const handleMorePress = useCallback(
    (date: string) => {
      router.push(`/(modals)/day-memories?date=${date}`);
    },
    [router],
  );

  const header = (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-3 mb-4">
      <Text style={{ color: c.text }} className="text-2xl font-bold">
        {t('memories.title')}
      </Text>
      <Link href="/(modals)/add-memory" asChild>
        <Pressable
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: c.card }}
        >
          <Ionicons name="add" size={24} color={c.text} />
        </Pressable>
      </Link>
    </View>
  );

  if (memories.length === 0) {
    return (
      <View style={{ backgroundColor: c.background }} className="flex-1">
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="images-outline" size={64} color={c.muted} />
          <Text style={{ color: c.muted }} className="text-center text-base mt-4">
            {t('memories.noMemories')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: c.background }} className="flex-1">
      {header}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
        {grouped.map(([date, dateMemories]) => (
          <MemoryGalleryRow
            key={date}
            date={date}
            memories={dateMemories}
            onImagePress={handleImagePress}
            onMorePress={handleMorePress}
          />
        ))}
      </ScrollView>
    </View>
  );
}
