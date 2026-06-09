import { useMemo, useCallback } from 'react';
import { View, Text, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { colors, shadows } from '@/lib/theme';
import { useMemories } from '@/features/memories/hooks/useMemories';
import type { Memory } from '@/features/memories/types/memory.types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 32;
const GAP = 8;
const THUMB_SIZE = (SCREEN_WIDTH - PADDING - GAP * 3) / 4;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateHeader(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function DayMemoriesScreen() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const { memories } = useMemories();

  const dayMemories = useMemo(
    () => memories.filter((m) => m.date === date),
    [memories, date],
  );

  const handleImagePress = useCallback(
    (memory: Memory) => {
      router.push(`/(modals)/memory-detail?id=${memory.id}`);
    },
    [router],
  );

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <View className="flex-row items-center border-b" style={{ borderColor: c.border, paddingHorizontal: 10, paddingVertical: 10 }}>
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color={c.text} />
        </Pressable>
        <Text style={{ color: c.text }} className="flex-1 text-lg font-bold text-center mr-8" numberOfLines={1}>
          {date ? formatDateHeader(date) : 'Memories'}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="p-4">
        {dayMemories.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="images-outline" size={48} color={c.muted} />
            <Text style={{ color: c.muted }} className="text-base mt-3">No memories for this day</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap" style={{ gap: GAP }}>
            {dayMemories.map((memory) => (
              <Pressable
                key={memory.id}
                onPress={() => handleImagePress(memory)}
                style={{ width: THUMB_SIZE }}
              >
                <View
                  style={{
                    width: THUMB_SIZE,
                    height: THUMB_SIZE,
                    borderRadius: 12,
                    backgroundColor: c.surface,
                    ...s.sm,
                  }}
                  className="overflow-hidden"
                >
                  <Image
                    source={{ uri: memory.mediaUri }}
                    style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  style={{ color: c.text }}
                  className="text-xs mt-1.5"
                  numberOfLines={1}
                >
                  {memory.title}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
