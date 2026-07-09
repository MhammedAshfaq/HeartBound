import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Animated, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';
import { MOOD_EMOJIS } from '@/constants/Mood';
import { useTodayFeeling, useSubmitFeeling } from '@/hooks/useFeelings';

type MoodType = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'stressed';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
}

interface MoodOption {
  mood: MoodType;
  label: string;
  emoji: string;
  color: string;
}

const moodPalette: Record<MoodType, string> = {
  happy: '#22C55E',
  excited: '#F97316',
  neutral: '#64748B',
  stressed: '#EF4444',
  sad: '#3B82F6',
  angry: '#EC4899',
};

function MoodTile({
  item,
  selected,
  onPress,
  isDark,
  borderColor,
  textColor,
  backgroundColor,
}: {
  item: MoodOption;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
  borderColor: string;
  textColor: string;
  backgroundColor: string;
}) {
  const tileShadow = shadows(isDark).sm;

  return (
    <Animated.View
      style={[
        styles.moodTileShell,
        selected && styles.moodTileShellSelected,
        { 
          borderColor: selected ? item.color : borderColor,
          backgroundColor: backgroundColor 
        },
        tileShadow,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.moodTile,
          {
            backgroundColor: selected ? item.color + '18' : 'transparent',
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.emojiBadge,
            {
              backgroundColor: selected ? item.color + '24' : item.color + '14',
              borderColor: selected ? item.color : item.color + '20',
            },
          ]}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>

        <Text
          style={[
            styles.moodLabel,
            {
              color: selected ? item.color : textColor,
            },
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const c = colors(isDark);
  const s = shadows(isDark);
  const [note, setNote] = useState('');
  const containerFade = useRef(new Animated.Value(0)).current;
  const savedOpacity = useRef(new Animated.Value(0)).current;

  const { data: todayFeeling, isLoading } = useTodayFeeling();
  const submitFeeling = useSubmitFeeling();

  useEffect(() => {
    Animated.timing(containerFade, { toValue: 1, duration: 500, delay: 350, useNativeDriver: true }).start();
  }, [containerFade]);

  const moods: MoodOption[] = [
    { mood: 'happy', label: t('home.moods.happy'), emoji: MOOD_EMOJIS.happy, color: moodPalette.happy },
    { mood: 'excited', label: t('home.moods.excited'), emoji: MOOD_EMOJIS.excited, color: moodPalette.excited },
    { mood: 'neutral', label: t('home.moods.neutral'), emoji: MOOD_EMOJIS.neutral, color: moodPalette.neutral },
    { mood: 'stressed', label: t('home.moods.stressed'), emoji: MOOD_EMOJIS.stressed, color: moodPalette.stressed },
    { mood: 'sad', label: t('home.moods.sad'), emoji: MOOD_EMOJIS.sad, color: moodPalette.sad },
    { mood: 'angry', label: t('home.moods.angry'), emoji: MOOD_EMOJIS.angry, color: moodPalette.angry },
  ];

  const selectedMoodConfig = moods.find((item) => item.mood === selectedMood) ?? null;

  const handleMoodPress = useCallback(
    (mood: MoodType) => {
      onMoodSelect(mood);
      savedOpacity.setValue(0);
    },
    [onMoodSelect, savedOpacity],
  );

  const handleSaveCheckIn = useCallback(() => {
    if (!selectedMoodConfig) return;

    Keyboard.dismiss();

    submitFeeling.mutate(
      { emoji: selectedMoodConfig.emoji, note },
      {
        onSuccess: () => {
          setNote('');
          savedOpacity.setValue(0);
          Animated.sequence([
            Animated.timing(savedOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.delay(1800),
            Animated.timing(savedOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
          ]).start();
        },
      }
    );
  }, [savedOpacity, selectedMoodConfig, submitFeeling, note]);

  // If we have a submitted feeling from today, we determine the matched mood config.
  // We match against either the emoji itself or the label (case-insensitive) just in case.
  const submittedMoodConfig = todayFeeling
    ? moods.find(
        (m) =>
          m.emoji === todayFeeling.emoji ||
          m.label.toLowerCase() === todayFeeling.emoji.toLowerCase() ||
          m.mood.toLowerCase() === todayFeeling.emoji.toLowerCase(),
      )
    : null;

  const isSubmitted = !!todayFeeling;
  // If submitted, use the submitted mood, else use the actively selected one
  const displayMoodConfig = isSubmitted ? submittedMoodConfig : selectedMoodConfig;
  const displayNote = isSubmitted ? (todayFeeling.note || '') : note;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: c.card, opacity: containerFade },
        s.lg,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.headerAccent, { backgroundColor: c.primary + '18' }]} />
        <View style={styles.headerCopy}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>{t('home.moodQuestion')}</Text>
          <Text style={[styles.sectionSubtitle, { color: c.muted }]}>
            {isSubmitted ? 'You\'ve shared your feeling today!' : t('home.moodSubtitle')}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        {moods.map((item) => (
          <View key={item.mood} style={styles.gridItem}>
            <MoodTile
              item={item}
              selected={displayMoodConfig?.mood === item.mood}
              onPress={() => {
                if (!isSubmitted) handleMoodPress(item.mood);
              }}
              isDark={isDark}
              borderColor={c.border}
              textColor={c.muted}
              backgroundColor={c.card}
            />
          </View>
        ))}
      </View>

      <View
        style={[
          styles.composer,
          {
            backgroundColor: c.surface,
            borderColor: c.border,
          },
        ]}
      >
        <View style={styles.composerHeader}>
          <Text style={[styles.composerLabel, { color: c.text }]}>{t('home.noteLabel')}</Text>
          <Text style={[styles.composerHint, { color: c.muted }]}>
            {displayMoodConfig ? `${t('home.selectedMood')} · ${displayMoodConfig.label}` : t('home.moodHelper')}
          </Text>
        </View>

        {displayMoodConfig ? (
          <View
            style={[
              styles.selectedMoodPill,
              {
                backgroundColor: displayMoodConfig.color + '18',
                borderColor: displayMoodConfig.color + '30',
              },
            ]}
          >
            <Text style={[styles.selectedMoodText, { color: displayMoodConfig.color }]}>
              {displayMoodConfig.label}
            </Text>
          </View>
        ) : null}

        <TextInput
          style={[
            styles.noteInput,
            {
              color: c.text,
              borderColor: c.border,
              backgroundColor: isSubmitted ? c.surface : c.card,
              opacity: isSubmitted ? 0.7 : 1,
            },
          ]}
          placeholder={t('home.notePlaceholder')}
          placeholderTextColor={c.muted}
          value={displayNote}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
          editable={!isSubmitted}
        />

        {!isSubmitted && (
          <Pressable
            accessibilityRole="button"
            disabled={!displayMoodConfig || submitFeeling.isPending}
            onPress={handleSaveCheckIn}
            style={({ pressed }) => [
              styles.saveButtonPressable,
              pressed && displayMoodConfig && styles.saveButtonPressed,
            ]}
          >
            <View
              style={[
                styles.saveButtonSurface,
                {
                  backgroundColor: displayMoodConfig && !submitFeeling.isPending ? c.primary : c.border,
                  borderColor: displayMoodConfig && !submitFeeling.isPending ? c.primary : c.border,
                },
              ]}
            >
              <Text style={styles.saveButtonText}>
                {submitFeeling.isPending ? 'Submitting...' : t('home.submit')}
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerAccent: {
    width: 12,
    height: 48,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.sm,
  },
  gridItem: {
    width: '33.333%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  moodTileShell: {
    borderRadius: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodTileShellSelected: {
    transform: [{ translateY: -1 }],
  },
  moodTile: {
    minHeight: 104,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBadge: {
    width: 44,
    height: 44,
    borderRadius: spacing.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  emoji: {
    fontSize: 22,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  composer: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  composerHeader: {
    marginBottom: spacing.sm,
  },
  composerLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  composerHint: {
    fontSize: 12,
    lineHeight: 17,
  },
  selectedMoodPill: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.sm,
  },
  selectedMoodText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    minHeight: 92,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  saveButtonPressable: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  saveButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  saveButtonSurface: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    width: '100%',
  },
  saveButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  savedBanner: {
    alignItems: 'center',
  },
  savedText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
