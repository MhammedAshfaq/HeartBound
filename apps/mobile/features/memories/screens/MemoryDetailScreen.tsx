import { useMemo, useState, useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors, shadows } from '@/lib/theme';
import { useMemories } from '@/features/memories/hooks/useMemories';
import { MemoryFeeling } from '@/constants/Enums';
import { Button } from '@/components/common/Button';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';


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
  const s = shadows(isDark);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { memories, deleteMemory } = useMemories();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);

  const memory = useMemo(() => memories.find((m) => m.id === id), [memories, id]);

  useEffect(() => {
    if (memory?.mediaUri) {
      Image.getSize(
        memory.mediaUri,
        (width, height) => {
          if (width && height) {
            // Clamp aspect ratio between 0.75 (3:4 portrait) and 1.77 (16:9 landscape) to keep layout neat
            const ratio = width / height;
            setAspectRatio(Math.min(Math.max(ratio, 0.75), 1.77));
          }
        },
        () => {
          // Fallback to 1.0 (square) on error
          setAspectRatio(1);
        }
      );
    }
  }, [memory?.mediaUri]);

  if (!memory) {
    return (
      <View style={{ backgroundColor: c.background }} className="flex-1 items-center justify-center">
        <Ionicons name="sad-outline" size={48} color={c.muted} />
        <Text style={{ color: c.muted }} className="mt-4 text-base">{t('common.error')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ─── Header ─── */}
        <View className="flex-row items-center justify-between px-4 py-2 mt-2">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="close" size={26} color={c.text} />
          </Pressable>
        </View>

      {/* ─── Image Card ─── */}
      <View className="rounded-2xl overflow-hidden mt-2 shadow-sm" style={{ backgroundColor: c.card, marginHorizontal: 10 }}>
        <View style={{ width: '100%', aspectRatio, backgroundColor: c.card }}>
          {/* Ambient Blurred Background Image to fill borders elegantly */}
          <Image
            source={{ uri: memory.mediaUri }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.35 }}
            blurRadius={20}
            resizeMode="cover"
          />
          {/* Centered Main Image */}
          <Image
            source={{ uri: memory.mediaUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* ─── Metadata Card ─── */}
      <View className="mt-4 rounded-xl" style={{ backgroundColor: c.card, ...s.sm , marginHorizontal: 10}}>
        <View className="p-5">
          <View className="flex-row justify-between items-start">
            <Text
              style={{ color: c.text }}
              className="text-xl font-bold flex-1 mr-3"
              numberOfLines={2}
            >
              {memory.title}
            </Text>
            <View className="flex-row items-center rounded-full">
              <Text className="text-xs font-semibold ml-1.5" style={{ color: c.text }}>
                {formatDate(memory.date)}
              </Text>
            </View>
          </View>

          {memory.description ? (
            <Text
              style={{ color: c.muted }}
              className="text-sm leading-5 mt-3"
            >
              {memory.description}
            </Text>
          ) : null}

          {(memory.location || memory.feeling) ? (
            <View className="flex-row flex-wrap gap-2 mt-4">
              {memory.location ? (
                <View className="flex-row items-center rounded-lg" style={{ backgroundColor: c.primary + '14', paddingVertical: 8, paddingHorizontal: 10 }}>
                  <Ionicons name="location-outline" size={13} color={c.primary} style={{marginRight:2}}/>
                  <Text style={{ color: c.primary }} className="text-xs font-semibold ml-1.5">
                    {memory.location}
                  </Text>
                </View>
              ) : null}
              {memory.feeling ? (
                <View className="flex-row items-center rounded-lg" style={{ backgroundColor: c.primary + '14',paddingVertical: 8, paddingHorizontal: 10 }}>
                  <Ionicons name={MOOD_ICONS[memory.feeling] || 'ellipse-outline'} size={13} color={c.primary} style={{marginRight:2}} />
                  <Text style={{ color: c.primary }} className="text-xs font-semibold ml-1.5 capitalize">
                    {memory.feeling}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      <View className="flex-row gap-4 px-3 mt-4">
        <View className="flex-1">
          <Button 
            title={t('common.edit') || 'Edit'} 
            onPress={() => router.push({ pathname: '/(modals)/edit-memory', params: { id } })}
            variant="outline"
          />
        </View>
        <View className="flex-1">
          <Button 
            title={t('common.delete') || 'Delete'} 
            onPress={() => setDeleteModalVisible(true)}
            style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
          />
        </View>
      </View>

      <View className="h-8" />
      </ScrollView>

      <ConfirmationModal
        visible={deleteModalVisible}
        title={t('common.delete') || 'Delete'}
        message={t('memories.deleteConfirm') || 'Are you sure you want to delete this memory?'}
        icon="trash"
        iconColor="#ef4444"
        options={[
          { 
            text: t('common.cancel') || 'Cancel', 
            style: 'cancel',
            onPress: () => setDeleteModalVisible(false)
          },
          { 
            text: t('common.delete') || 'Delete', 
            style: 'destructive',
            onPress: async () => {
              setDeleteModalVisible(false);
              await deleteMemory(id);
              router.back();
            }
          }
        ]}
        onClose={() => setDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
}
