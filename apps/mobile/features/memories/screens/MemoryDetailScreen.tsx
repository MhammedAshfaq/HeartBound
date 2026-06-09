import { useMemo } from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { useMemories } from '@/features/memories/hooks/useMemories';
import { MemoryFeeling } from '@/constants/Enums';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MOOD_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  [MemoryFeeling.Happy]: 'happy-outline',
  [MemoryFeeling.Romantic]: 'heart-outline',
  [MemoryFeeling.Fun]: 'play-outline',
  [MemoryFeeling.Emotional]: 'water-outline',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function MemoryDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { memories } = useMemories();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), 4);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1, { duration: 200 });
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  const pan = Gesture.Pan()
    .minPointers(2)
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const memory = useMemo(() => memories.find((m) => m.id === id), [memories, id]);

  if (!memory) {
    return (
      <View style={{ backgroundColor: c.background }} className="flex-1 items-center justify-center">
        <Ionicons name="sad-outline" size={48} color={c.muted} />
        <Text style={{ color: c.muted }} className="mt-4 text-base">{t('common.error')}</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: '#000' }} className="flex-1">
      <GestureDetector gesture={composed}>
        <Animated.View className="flex-1 items-center justify-center" style={animatedStyle}>
          <Image
            source={{ uri: memory.mediaUri }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.6 }}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>

      <Pressable
        onPress={() => router.back()}
        className="absolute top-12 right-4 w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <Ionicons name="close" size={22} color="#fff" />
      </Pressable>

      <View
        className="absolute bottom-0 left-0 right-0 px-5 pt-5 pb-8"
        style={{ backgroundColor: isDark ? 'rgba(30,30,30,0.92)' : 'rgba(255,255,255,0.92)' }}
      >
        <Text
          style={{ color: c.text }}
          className="text-xl font-bold mb-3"
          numberOfLines={2}
        >
          {memory.title}
        </Text>

        {memory.description ? (
          <Text
            style={{ color: c.muted }}
            className="text-sm leading-5 mb-3"
            numberOfLines={2}
          >
            {memory.description}
          </Text>
        ) : null}

        <View className="flex-row flex-wrap gap-y-2">
          <View className="flex-row items-center mr-4">
            <Ionicons name="calendar-outline" size={15} color={c.muted} />
            <Text style={{ color: c.muted }} className="text-xs ml-1.5">
              {formatDate(memory.date)}
            </Text>
          </View>

          {memory.location ? (
            <View className="flex-row items-center mr-4">
              <Ionicons name="location-outline" size={15} color={c.muted} />
              <Text style={{ color: c.muted }} className="text-xs ml-1.5" numberOfLines={1}>
                {memory.location}
              </Text>
            </View>
          ) : null}

          {memory.feeling ? (
            <View className="flex-row items-center mr-4">
              <Ionicons name={MOOD_ICONS[memory.feeling] || 'ellipse-outline'} size={15} color={c.muted} />
              <Text style={{ color: c.muted }} className="text-xs ml-1.5 capitalize">
                {memory.feeling}
              </Text>
            </View>
          ) : null}

          {memory.isPrivate ? (
            <View className="flex-row items-center">
              <Ionicons name="lock-closed" size={14} color={c.muted} />
              <Text style={{ color: c.muted }} className="text-xs ml-1.5">
                {t('memories.private')}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
