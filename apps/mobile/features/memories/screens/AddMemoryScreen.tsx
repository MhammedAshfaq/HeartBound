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
import { formatDateInput, todayString, validateMemoryStep } from '@/features/memories/utils/memoryUtils';

export default function AddMemoryScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const router = useRouter();
  const toast = useToast();
  const { addMemory } = useMemories();

  const [step, setStep] = useState(1);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayString());
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState<MemoryFeeling | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');

  const handleMediaPicked = useCallback((uri: string, type: 'image' | 'video') => {
    setMediaUri(uri);
    setMediaType(type);
  }, []);

  const canGoNext = useCallback(() => {
    const result = validateMemoryStep(step, { mediaUri, title, date });
    if (step === 2) {
      if (result.errors.title) setTitleError(t(`memories.${result.errors.title}`));
      else setTitleError('');
      if (result.errors.date) setDateError(t(`memories.${result.errors.date}`));
      else setDateError('');
    }
    return result.ok;
  }, [step, mediaUri, title, date, t]);

  const handleNext = useCallback(() => {
    if (!canGoNext()) return;
    setStep((s) => Math.min(s + 1, 3));
  }, [canGoNext]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSave = useCallback(async () => {
    if (!mediaUri || !title.trim()) return;
    setSaving(true);
    try {
      await addMemory({
        mediaUri,
        mediaType: mediaType ?? 'image',
        title: title.trim(),
        description: description.trim(),
        date: date || todayString(),
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
  }, [mediaUri, mediaType, title, description, date, location, feeling, isPrivate, addMemory, t, toast, router]);

  const activeColor = isDark ? '#60a5fa' : '#3b82f6';

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: c.border }}>
        <Pressable onPress={step > 1 ? handleBack : () => router.back()} className="p-2 -ml-2">
          <Ionicons name="close" size={24} color={c.text} />
        </Pressable>
        <View className="flex-row items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: s <= step ? activeColor : c.border }}
            />
          ))}
        </View>
        <Text style={{ color: c.muted }} className="text-sm font-medium">
          {t('memories.step', { step: String(step) })}
        </Text>
      </View>

      {step === 1 && (
        <View className="flex-1 px-6 pt-8">
          <Text style={{ color: c.text }} className="text-xl font-bold mb-1">
            {t('memories.selectMedia')}
          </Text>
          <Text style={{ color: c.muted }} className="text-base mb-6">
            {t('memories.mediaSubtitle')}
          </Text>
          <MediaPicker
            mediaUri={mediaUri}
            mediaType={mediaType}
            onMediaPicked={handleMediaPicked}
            accentColor={activeColor}
          />
        </View>
      )}

      {step === 2 && (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView className="flex-1 px-6 pt-8" keyboardShouldPersistTaps="handled">
            <Text style={{ color: c.text }} className="text-xl font-bold mb-6">
              {t('memories.memoryTitle')}
            </Text>

            <Text style={{ color: c.text }} className="text-sm font-semibold mb-1.5">
              {t('memories.memoryTitle')} <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={title}
              onChangeText={(v) => { setTitle(v); setTitleError(''); }}
              placeholder={t('memories.titlePlaceholder')}
              placeholderTextColor={c.muted}
              className="rounded-xl px-4 py-3.5 text-base mb-1"
              style={{ backgroundColor: c.card, color: c.text }}
            />
            {titleError ? (
              <Text className="text-red-500 text-sm mb-3">{titleError}</Text>
            ) : (
              <View className="mb-3" />
            )}

            <Text style={{ color: c.text }} className="text-sm font-semibold mb-1.5">
              {t('memories.description')}
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={t('memories.descriptionPlaceholder')}
              placeholderTextColor={c.muted}
              multiline
              numberOfLines={4}
              className="rounded-xl px-4 py-3.5 text-base mb-4"
              style={{ backgroundColor: c.card, color: c.text, minHeight: 100, textAlignVertical: 'top' }}
            />

            <Text style={{ color: c.text }} className="text-sm font-semibold mb-1.5">
              {t('memories.date')}
            </Text>
            <TextInput
              value={date}
              onChangeText={(v) => { setDate(formatDateInput(v)); setDateError(''); }}
              placeholder={t('memories.datePlaceholder')}
              placeholderTextColor={c.muted}
              keyboardType="number-pad"
              className="rounded-xl px-4 py-3.5 text-base mb-1"
              style={{ backgroundColor: c.card, color: c.text }}
            />
            {dateError ? (
              <Text className="text-red-500 text-sm mb-3">{dateError}</Text>
            ) : (
              <View className="mb-3" />
            )}

            <Text style={{ color: c.text }} className="text-sm font-semibold mb-1.5">
              {t('memories.location')}
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder={t('memories.locationPlaceholder')}
              placeholderTextColor={c.muted}
              className="rounded-xl px-4 py-3.5 text-base mb-4"
              style={{ backgroundColor: c.card, color: c.text }}
            />

            <View className="h-20" />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {step === 3 && (
        <ScrollView className="flex-1 px-6 pt-8" keyboardShouldPersistTaps="handled">
          <Text style={{ color: c.text }} className="text-xl font-bold mb-1">
            {t('memories.howYouFelt')}
          </Text>
          <Text style={{ color: c.muted }} className="text-base mb-6">
            {t('memories.mediaSubtitle')}
          </Text>

          <MoodSelector
            value={feeling}
            onChange={setFeeling}
            accentColor={activeColor}
          />

          <Text style={{ color: c.text }} className="text-xl font-bold mb-4 mt-8">
            {t('memories.privacy')}
          </Text>

          <PrivacySelector
            value={isPrivate}
            onChange={setIsPrivate}
            accentColor={activeColor}
          />
        </ScrollView>
      )}

      <View className="px-6 py-4 border-t" style={{ borderColor: c.border }}>
        <Pressable
          onPress={step === 3 ? handleSave : handleNext}
          disabled={(step === 1 && !mediaUri) || saving}
          className="py-3.5 rounded-xl items-center"
          style={{
            backgroundColor: (step === 1 && !mediaUri) || saving ? c.border : activeColor,
            opacity: (step === 1 && !mediaUri) || saving ? 0.5 : 1,
          }}
        >
          <Text className="text-white font-bold text-base">
            {saving ? t('memories.saving') : step === 3 ? t('common.save') : t('common.next')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
