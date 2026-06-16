import { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { colors } from '@/lib/theme';
import { MemoryFeeling } from '@/constants/Enums';
import { useMemories } from '@/features/memories/hooks/useMemories';
import { MoodSelector } from '@/features/memories/components/MoodSelector';

export default function EditMemoryScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { memories, updateMemory } = useMemories();

  const memory = memories.find((m) => m.id === id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState<MemoryFeeling | null>(null);
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (memory) {
      setTitle(memory.title || '');
      setDescription(memory.description || '');
      setLocation(memory.location || '');
      setFeeling((memory.feeling as MemoryFeeling) || null);
    }
  }, [memory]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setTitleError(t('memories.titleRequired'));
      return;
    }
    setSaving(true);
    try {
      await updateMemory(id, {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        feeling: feeling || undefined,
      });
      toast.success({ title: t('memories.saved') || 'Memory updated!' });
      router.back();
    } catch {
      toast.error({ title: t('common.error') });
    } finally {
      setSaving(false);
    }
  }, [title, description, location, feeling, id, updateMemory, t, toast, router]);

  const activeColor = isDark ? '#60a5fa' : '#3b82f6';

  if (!memory) {
    return (
      <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1 items-center justify-center">
        <Text style={{ color: c.muted }}>Memory not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b"
        style={{ borderColor: c.border, paddingHorizontal: 10, paddingVertical: 10 }}
      >
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="close" size={24} color={c.text} />
        </Pressable>
        <Text style={{ color: c.text }} className="text-lg font-bold">
          {t('common.edit') || 'Edit Memory'}
        </Text>
        {/* Spacer to balance header */}
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          className="flex-1 px-6 pt-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title Field */}
          <Text style={{ color: c.text, marginBottom: 3 }} className="text-sm font-semibold">
            {t('memories.memoryTitle')} <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={(v) => { setTitle(v); setTitleError(''); }}
            placeholder={t('memories.titlePlaceholder')}
            placeholderTextColor={c.muted}
            className="rounded-xl px-4 py-3.5 text-base"
            style={{ backgroundColor: c.card, color: c.text, borderWidth: 1, borderColor: titleError ? '#ef4444' : c.border }}
          />
          {titleError ? (
            <Text style={{ color: '#ef4444' }} className="text-sm">{titleError}</Text>
          ) : (
            <View />
          )}

          {/* Description Field */}
          <Text style={{ color: c.text, marginTop: 12, marginBottom: 3 }} className="text-sm font-semibold">
            {t('memories.description')}
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('memories.descriptionPlaceholder')}
            placeholderTextColor={c.muted}
            multiline
            numberOfLines={4}
            className="rounded-xl px-4 py-3.5 text-base"
            style={{
              backgroundColor: c.card,
              color: c.text,
              minHeight: 100,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: c.border,
            }}
          />

          {/* Location Field */}
          <Text style={{ color: c.text, marginTop: 12, marginBottom: 3 }} className="text-sm font-semibold">
            {t('memories.location')}
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder={t('memories.locationPlaceholder')}
            placeholderTextColor={c.muted}
            className="rounded-xl px-4 py-3.5 text-base"
            style={{ backgroundColor: c.card, color: c.text, borderWidth: 1, borderColor: c.border }}
          />

          {/* Mood Selector */}
          <Text style={{ color: c.text, marginBottom: 5, marginTop: 12 }} className="text-sm font-semibold">
            {t('memories.howYouFelt')}
          </Text>
          <View className="mb-10">
            <MoodSelector
              value={feeling}
              onChange={setFeeling}
              accentColor={activeColor}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View className="px-6 py-4 border-t pb-8" style={{ borderColor: c.border }}>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className="py-3.5 rounded-xl items-center"
          style={{ backgroundColor: saving ? c.border : activeColor, opacity: saving ? 0.5 : 1 }}
        >
          <Text className="text-white font-bold text-base">
            {saving ? (t('memories.saving') || 'Saving...') : (t('common.save') || 'Save')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
