import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { useSuggestions } from '@hooks/useSuggestions';
import { useMood } from '@hooks/useMood';
import { theme } from '@utils/theme';
import { getMoodEmoji, daysUntilAnniversary } from '@utils/helpers';
import { MoodType, DayType, SuggestionType } from '../types';

export const HomeScreen: React.FC = () => {
  const { current, acceptSuggestion, completeSuggestion, skipSuggestion, fetchDailySuggestion } =
    useSuggestions();
  const { current: currentMood, logMood, fetchMoodHistory } = useMood();

  useEffect(() => {
    fetchDailySuggestion(currentMood || MoodType.Neutral, DayType.Weekday);
    fetchMoodHistory(7);
  }, []);

  const moods: MoodType[] = [
    MoodType.Happy,
    MoodType.Excited,
    MoodType.Neutral,
    MoodType.Stressed,
    MoodType.Sad,
    MoodType.Angry,
  ];

  const relationshipScore = 75;
  const streakDays = 5;
  const daysUntil = daysUntilAnniversary(new Date('2025-06-15'));

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.subtitle}>Let's strengthen your bond today</Text>
        </View>
        <TouchableOpacity style={styles.moodButton}>
          <Text style={styles.moodEmoji}>
            {currentMood ? getMoodEmoji(currentMood) : '😊'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{relationshipScore}%</Text>
          <Text style={styles.statLabel}>Relationship Score</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </Card>
      </View>

      <Card title="Today's Suggestion" style={styles.suggestionCard}>
        {current ? (
          <>
            <Text style={styles.suggestionTitle}>{current.title}</Text>
            <Text style={styles.suggestionDescription}>{current.description}</Text>
            <View style={styles.suggestionActions}>
              <Button
                title="Accept"
                onPress={() => acceptSuggestion(current.id)}
                style={styles.suggestionButton}
              />
              <Button
                title="Done"
                onPress={() => completeSuggestion(current.id)}
                variant="secondary"
                style={styles.suggestionButton}
              />
              <Button
                title="Skip"
                onPress={() => skipSuggestion(current.id)}
                variant="text"
                style={styles.suggestionButton}
              />
            </View>
          </>
        ) : (
          <Text style={styles.noSuggestion}>Loading suggestion...</Text>
        )}
      </Card>

      <Card title="How are you feeling?" style={styles.moodCard}>
        <View style={styles.moodSelector}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodOption,
                currentMood === mood && styles.moodOptionSelected,
              ]}
              onPress={() => logMood(mood)}
            >
              <Text style={styles.moodOptionEmoji}>{getMoodEmoji(mood)}</Text>
              <Text style={styles.moodOptionLabel}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card title="Upcoming" style={styles.upcomingCard}>
        <View style={styles.upcomingItem}>
          <Text style={styles.upcomingIcon}>🎉</Text>
          <View style={styles.upcomingText}>
            <Text style={styles.upcomingTitle}>Anniversary</Text>
            <Text style={styles.upcomingSubtitle}>
              {daysUntil} days away
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 28,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  suggestionCard: {
    marginBottom: theme.spacing.lg,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  suggestionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  suggestionActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  suggestionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
  },
  noSuggestion: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
  moodCard: {
    marginBottom: theme.spacing.lg,
  },
  moodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  moodOption: {
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    minWidth: 70,
  },
  moodOptionSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  moodOptionEmoji: {
    fontSize: 28,
    marginBottom: theme.spacing.xs,
  },
  moodOptionLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  upcomingCard: {
    marginBottom: theme.spacing.lg,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  upcomingIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  upcomingText: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  upcomingSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
