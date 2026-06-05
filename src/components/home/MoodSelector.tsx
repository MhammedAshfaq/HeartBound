import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Animated, Keyboard } from 'react-native';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useTheme } from '@context/ThemeContext';
import { AppTheme } from '@utils/theme';
import { getMoodEmoji } from '@utils/helpers';
import { MoodType } from '../../types';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
}

interface MoodItem {
  mood: MoodType;
  label: string;
  color: string;
}

const moods: MoodItem[] = [
  { mood: MoodType.Happy, label: 'Happy', color: '#4CAF50' },
  { mood: MoodType.Excited, label: 'Excited', color: '#FF9800' },
  { mood: MoodType.Neutral, label: 'Neutral', color: '#9E9E9E' },
  { mood: MoodType.Stressed, label: 'Stressed', color: '#F44336' },
  { mood: MoodType.Sad, label: 'Sad', color: '#2196F3' },
  { mood: MoodType.Angry, label: 'Angry', color: '#E91E63' },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const containerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(containerFade, {
      toValue: 1,
      duration: 500,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, [containerFade]);

  const handleMoodPress = useCallback(
    (mood: MoodType) => {
      onMoodSelect(mood);
      setNote('');
      setNoteSaved(false);
      setShowFeedback(true);
      feedbackOpacity.setValue(0);
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(feedbackOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowFeedback(false));
      }, 3000);
    },
    [onMoodSelect, feedbackOpacity]
  );

  const handleSaveNote = useCallback(() => {
    if (note.trim()) {
      Keyboard.dismiss();
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    }
  }, [note]);

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: theme.colors.card, opacity: containerFade }]}
    >
      <Text style={styles.sectionTitle}>How are you feeling?</Text>

      <View style={styles.grid}>
        {moods.map((item) => {
          const isSelected = selectedMood === item.mood;
          return (
            <Pressable
              key={item.mood}
              onPress={() => handleMoodPress(item.mood)}
              style={({ pressed }) => [
                styles.moodOption,
                isSelected && { backgroundColor: item.color + '20', borderColor: item.color },
                pressed && !isSelected && { backgroundColor: theme.colors.border },
              ]}
            >
              <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  isSelected && { color: item.color, fontWeight: '700' },
                ]}
              >
                {item.label}
              </Text>
              {isSelected && <Text style={[styles.checkmark, { color: item.color }]}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      {showFeedback && selectedMood && (
        <Animated.View style={[styles.feedbackContainer, { opacity: feedbackOpacity }]}>
          <Text style={styles.feedbackText}>
            Thanks for sharing {getMoodEmoji(selectedMood)} We're here for you!
          </Text>
        </Animated.View>
      )}

      {selectedMood && (
        <View style={styles.noteContainer}>
          {noteSaved ? (
            <View style={styles.noteSavedBanner}>
              <Text style={styles.noteSavedText}>Note saved ✓</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={[styles.noteInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="Add a note (optional)..."
                placeholderTextColor={theme.colors.textSecondary}
                value={note}
                onChangeText={setNote}
                multiline
              />
              <Pressable
                onPress={handleSaveNote}
                style={({ pressed }) => [
                  styles.saveButton,
                  {
                    backgroundColor: theme.colors.primary,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text style={styles.saveButtonText}>Save Note</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    moodOption: {
      width: '30%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      position: 'relative',
    },
    moodEmoji: {
      fontSize: 24,
      marginBottom: theme.spacing.xs,
    },
    moodLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
      fontWeight: '500',
    },
    checkmark: {
      position: 'absolute',
      top: 4,
      right: 6,
      fontSize: 12,
      fontWeight: 'bold',
    },
    feedbackContainer: {
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.success + '15',
      borderRadius: theme.borderRadius.md,
    },
    feedbackText: {
      fontSize: 14,
      color: theme.colors.success,
      fontWeight: '600',
      textAlign: 'center',
    },
    noteContainer: {
      marginTop: theme.spacing.md,
    },
    noteInput: {
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 14,
      minHeight: 60,
      textAlignVertical: 'top',
    },
    saveButton: {
      marginTop: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    noteSavedBanner: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.success + '15',
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    noteSavedText: {
      fontSize: 14,
      color: theme.colors.success,
      fontWeight: '600',
    },
  });
