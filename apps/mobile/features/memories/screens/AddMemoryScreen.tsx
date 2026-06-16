import { useCallback, useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { colors } from '@/lib/theme';
import { MemoryFeeling } from '@/constants/Enums';
import { useMemories } from '@/features/memories/hooks/useMemories';
import { MediaPicker } from '@/features/memories/components/MediaPicker';
import { MoodSelector } from '@/features/memories/components/MoodSelector';
import { PrivacySelector } from '@/features/memories/components/PrivacySelector';
import { todayString } from '@/features/memories/utils/memoryUtils';

export default function AddMemoryScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const router = useRouter();
  const toast = useToast();
  const { addMemory } = useMemories();

  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState<MemoryFeeling | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleMediaPicked = useCallback((uri: string, type: 'image' | 'video') => {
    setMediaUri(uri);
    setMediaType(type);
    setMediaError('');
  }, []);

  const handleSave = useCallback(async () => {
    let hasError = false;

    if (!mediaUri) {
      setMediaError(t('memories.mediaRequired'));
      hasError = true;
    } else {
      setMediaError('');
    }

    if (!title.trim()) {
      setTitleError(t('memories.titleRequired'));
      hasError = true;
    } else {
      setTitleError('');
    }

    if (hasError) return;

    setSaving(true);
    try {
      await addMemory({
        mediaUri: mediaUri!,
        mediaType: mediaType ?? 'image',
        title: title.trim(),
        description: description.trim(),
        date: todayString(),
        location: location.trim(),
        feeling,
        isPrivate,
      });
      toast.success({ title: t('memories.saved') });
      router.back();
    } catch {
      toast.error({ title: t('common.error') });
    } finally {
      setSaving(false);
    }
  }, [mediaUri, mediaType, title, description, location, feeling, isPrivate, addMemory, t, toast, router, setMediaError]);

  const activeColor = isDark ? '#60a5fa' : '#3b82f6';

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b" style={{ borderColor: c.border, paddingHorizontal: 10, paddingVertical: 10 }}>
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="close" size={24} color={c.text} />
        </Pressable>
        <Text style={{ color: c.text }} className="text-lg font-bold">
          {t('memories.addMemory')}
        </Text>
        {/* Spacer to balance header */}
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Media Picker Section */}
          <Text style={{ color: c.text, marginBottom: 5 }} className="text-sm font-semibold">
            {t('memories.selectMedia')} <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ height: mediaUri ? 220 : 140 }} className="w-full">
            <MediaPicker
              mediaUri={mediaUri}
              mediaType={mediaType}
              onMediaPicked={handleMediaPicked}
              accentColor={activeColor}
            />
          </View>
          {mediaError ? (
            <Text style={{ marginBottom: 10, color: '#ef4444' }} className="text-sm">{mediaError}</Text>
          ) : (
            <View style={{ marginBottom: 15 }} />
          )}

          {/* Title Field */}
          <Text style={{ color: c.text, marginBottom: 5 }} className="text-sm font-semibold">
            {t('memories.memoryTitle')} <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={(v) => { setTitle(v); setTitleError(''); }}
            placeholder={t('memories.titlePlaceholder')}
            placeholderTextColor={c.muted}
            className="rounded-xl text-base"
            style={{ backgroundColor: c.card, color: c.text, paddingHorizontal: 10, paddingVertical: 12, marginBottom: 15 }}
          />
          {titleError ? (
            <Text style={{ marginBottom: 15 }} className="text-red-500 text-sm">{titleError}</Text>
          ) : (
            <View style={{ marginBottom: 15 }} />
          )}

          {/* Description Field */}
          <Text style={{ color: c.text, marginBottom: 5 }} className="text-sm font-semibold">
            {t('memories.description')}
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('memories.descriptionPlaceholder')}
            placeholderTextColor={c.muted}
            multiline
            numberOfLines={4}
            className="rounded-xl text-base"
            style={{ backgroundColor: c.card, color: c.text, minHeight: 100, textAlignVertical: 'top', paddingHorizontal: 10, paddingVertical: 10, marginBottom: 15 }}
          />

          {/* Date is created automatically on save */}

          {/* Location Field */}
          <Text style={{ color: c.text, marginBottom: 5 }} className="text-sm font-semibold">
            {t('memories.location')}
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder={t('memories.locationPlaceholder')}
            placeholderTextColor={c.muted}
            className="rounded-xl text-base"
            style={{ backgroundColor: c.card, color: c.text, paddingHorizontal: 10, paddingVertical: 12, marginBottom: 15 }}
          />

          {/* Mood Selector Section */}
          <Text style={{ color: c.text, marginBottom: 5 }} className="text-sm font-semibold">
            {t('memories.howYouFelt')}
          </Text>
          <View>
            <MoodSelector
              value={feeling}
              onChange={setFeeling}
              accentColor={activeColor}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button Container */}
      <View className="px-6 py-4 border-t pb-8" style={{ borderColor: c.border }}>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className="py-3.5 rounded-xl items-center"
          style={{
            backgroundColor: saving ? c.border : activeColor,
            opacity: saving ? 0.5 : 1,
          }}
        >
          <Text className="text-white font-bold text-base">
            {saving ? t('memories.saving') : t('common.save')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView >
  );
}
