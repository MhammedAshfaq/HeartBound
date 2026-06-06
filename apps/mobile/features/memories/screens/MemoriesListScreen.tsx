import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { MemoryGrid } from '@/features/memories/components/MemoryGrid';
import { useMemories } from '@/features/memories/hooks/useMemories';

export default function MemoriesListScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const { memories, refresh } = useMemories();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const header = (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
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
      <MemoryGrid memories={memories} />
    </View>
  );
}
