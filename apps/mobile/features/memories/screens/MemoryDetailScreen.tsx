import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { useMemories } from '@/features/memories/hooks/useMemories';
import { MemoryFeeling } from '@/constants/Enums';

const MOOD_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  [MemoryFeeling.Happy]: 'happy-outline',
  [MemoryFeeling.Romantic]: 'heart-outline',
  [MemoryFeeling.Fun]: 'play-outline',
  [MemoryFeeling.Emotional]: 'water-outline',
};

export default function MemoryDetailScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { memories } = useMemories();

  const memory = memories.find((m) => m.id === id);

  if (!memory) {
    return (
      <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1 items-center justify-center">
        <Ionicons name="sad-outline" size={48} color={c.muted} />
        <Text style={{ color: c.muted }} className="mt-4 text-base">{t('common.error')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderColor: c.border }}>
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color={c.text} />
        </Pressable>
        <Text style={{ color: c.text }} className="flex-1 text-lg font-bold text-center mr-8">
          {memory.title}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="w-full aspect-video">
          <Image source={{ uri: memory.mediaUri }} className="w-full h-full" resizeMode="cover" />
        </View>

        <View className="px-4 py-6">
          <Text style={{ color: c.text }} className="text-2xl font-bold mb-2">
            {memory.title}
          </Text>

          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={16} color={c.muted} />
              <Text style={{ color: c.muted }} className="text-sm">{memory.date}</Text>
            </View>
            {memory.location ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="location-outline" size={16} color={c.muted} />
                <Text style={{ color: c.muted }} className="text-sm">{memory.location}</Text>
              </View>
            ) : null}
          </View>

          {memory.feeling ? (
            <View className="flex-row items-center gap-2 mb-4">
              <View className="flex-row items-center gap-1 py-1.5 px-3 rounded-full" style={{ backgroundColor: c.card }}>
                <Ionicons name={MOOD_ICONS[memory.feeling]} size={16} color={c.text} />
                <Text style={{ color: c.text }} className="text-sm capitalize">{memory.feeling}</Text>
              </View>
              {memory.isPrivate ? (
                <View className="flex-row items-center gap-1 py-1.5 px-3 rounded-full" style={{ backgroundColor: c.card }}>
                  <Ionicons name="lock-closed" size={14} color={c.muted} />
                  <Text style={{ color: c.muted }} className="text-sm">{t('memories.private')}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {memory.description ? (
            <Text style={{ color: c.text }} className="text-base leading-6">
              {memory.description}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
