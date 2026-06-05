import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useScreenLayout } from '@hooks/useScreenLayout';
import { useTheme } from '@context/ThemeContext';
import { AppTheme } from '@utils/theme';
import { getMoodEmoji } from '@utils/helpers';
import { StatCard } from '@components/home/StatCard';
import { SuggestionCard } from '@components/home/SuggestionCard';
import { QuickActions } from '@components/home/QuickActions';
import { MoodSelector } from '@components/home/MoodSelector';
import { UpcomingList } from '@components/home/UpcomingList';
import { MoodType } from '../types';

const MESSAGES = [
  "Small actions build strong relationships 💛",
  "You're doing great — keep going 👏",
  "Love is in the little things 🌸",
  "Every moment counts — make it special ✨",
  "Your effort makes a difference 💪",
];

const MOCK_SUGGESTIONS = [
  "Send a thoughtful message to your partner ❤️",
  "Plan a surprise date night this weekend 🌙",
  "Write down three things you appreciate about them 📝",
  "Cook their favorite meal together 🍳",
  "Give them a genuine compliment today 💛",
  "Watch a movie they've been wanting to see 🎬",
  "Take a walk together and talk about your dreams 🌅",
  "Send a voice note saying 'I love you' 🎵",
  "Do one of their chores without being asked ✨",
  "Plan a future trip together, even just in conversation ✈️",
];

export const HomeScreen: React.FC = () => {
  const screenLayout = useScreenLayout();
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  const [greetingIndex, setGreetingIndex] = useState(0);
  const [currentSuggestion, setCurrentSuggestion] = useState(
    () => MOCK_SUGGESTIONS[Math.floor(Math.random() * MOCK_SUGGESTIONS.length)]
  );
  const [streak, setStreak] = useState(5);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [completedToday, setCompletedToday] = useState(false);

  const messageOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(messageOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
      setGreetingIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [messageOpacity]);

  const handleMarkDone = useCallback(() => {
    if (!completedToday) {
      setStreak((s) => s + 1);
      setCompletedToday(true);
    }
  }, [completedToday]);

  const handleTryAnother = useCallback(() => {
    const remaining = MOCK_SUGGESTIONS.filter((s) => s !== currentSuggestion);
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentSuggestion(next);
  }, [currentSuggestion]);

  const handleMoodSelect = useCallback((mood: MoodType) => {
    setSelectedMood(mood);
  }, []);

  return (
    <SafeAreaView style={screenLayout.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Animated.Text style={[styles.dynamicMessage, { opacity: messageOpacity }]}>
              {MESSAGES[greetingIndex]}
            </Animated.Text>
          </View>
          <View style={[styles.moodCircle, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={styles.moodEmoji}>
              {selectedMood ? getMoodEmoji(selectedMood) : '😊'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            value="75%"
            label="Relationship Score"
            subtitle="Strong connection 💛"
            accentColor={theme.colors.primary}
          />
          <StatCard
            value={streak}
            label="Day Streak"
            subtitle={completedToday ? 'Completed today ✅' : 'Keep it going!'}
            accentColor={theme.colors.secondary}
          />
        </View>

        <SuggestionCard
          suggestion={currentSuggestion}
          completedToday={completedToday}
          onMarkDone={handleMarkDone}
          onTryAnother={handleTryAnother}
        />

        <QuickActions />

        <MoodSelector
          selectedMood={selectedMood}
          onMoodSelect={handleMoodSelect}
        />

        <UpcomingList />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.lg,
    },
    headerLeft: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    greeting: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    dynamicMessage: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    moodCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    moodEmoji: {
      fontSize: 26,
    },
    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
  });
