import { useMemo } from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { colors, shadows } from '@/lib/theme';
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

interface MemoryGalleryRowProps {
  date: string;
  memories: Memory[];
  onImagePress: (memory: Memory) => void;
  onMorePress: (date: string) => void;
}

export function MemoryGalleryRow({ date, memories, onImagePress, onMorePress }: MemoryGalleryRowProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const count = memories.length;
  const displayMemories = useMemo(() => memories.slice(0, 4), [memories]);
  const hasMore = count > 4;
  const moreCount = count - 4;

  return (
    <View style={{ marginBottom: 20 }}>
      <View className="flex-row items-center justify-between px-4 mb-2">
        <Text style={{ color: c.text }} className="text-sm font-semibold">
          {formatDateHeader(date)}
        </Text>
        <Text style={{ color: c.muted }} className="text-xs">
          {count} {count === 1 ? 'memory' : 'memories'}
        </Text>
      </View>

      <View className="px-4 flex-row" style={{ gap: GAP }}>
        {displayMemories.map((memory, index) => {
          const isLastWithMore = hasMore && index === 3;
          return (
            <Pressable
              key={memory.id}
              onPress={() => (isLastWithMore ? onMorePress(date) : onImagePress(memory))}
              style={{ width: THUMB_SIZE }}
            >
              <View
                style={{
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  borderRadius: 8,
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
                {isLastWithMore && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 8,
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text className="text-white text-sm">+{moreCount}</Text>
                    <Text className="text-white text-xs font-bold">More</Text>
                  </View>
                )}
              </View>
              <Text
                style={{ color: c.text }}
                className="text-xs mt-1.5"
                numberOfLines={1}
              >
                {memory.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
