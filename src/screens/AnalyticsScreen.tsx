import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@components/common/Card';
import { theme } from '@utils/theme';
import { AnalyticsMetrics } from '../types';

const MOCK_METRICS: AnalyticsMetrics = {
  interactionScore: 78,
  completionRate: 85,
  moodTrends: [],
  streakDays: 5,
  totalSuggestions: 42,
};

type Period = 'week' | 'month' | 'year';

export const AnalyticsScreen: React.FC = () => {
  const [period, setPeriod] = useState<Period>('week');
  const metrics = MOCK_METRICS;

  const moodData = [
    { day: 'Mon', mood: 'Happy' },
    { day: 'Tue', mood: 'Excited' },
    { day: 'Wed', mood: 'Neutral' },
    { day: 'Thu', mood: 'Happy' },
    { day: 'Fri', mood: 'Stressed' },
    { day: 'Sat', mood: 'Happy' },
    { day: 'Sun', mood: 'Excited' },
  ];

  const suggestionsByType = [
    { type: 'Activities', count: 15 },
    { type: 'Messages', count: 12 },
    { type: 'Date Nights', count: 8 },
    { type: 'Gifts', count: 5 },
    { type: 'Compliments', count: 10 },
  ];

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={[styles.periodText, period === p && styles.periodTextActive]}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{metrics.interactionScore}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{metrics.completionRate}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{metrics.streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{metrics.totalSuggestions}</Text>
          <Text style={styles.statLabel}>Suggestions</Text>
        </Card>
      </View>

      <Card title="Mood Trends" style={styles.chartCard}>
        <View style={styles.moodChart}>
          {moodData.map((item, index) => (
            <View key={index} style={styles.moodBar}>
              <View style={styles.moodIndicator}>
                <Text style={styles.moodEmoji}>
                  {item.mood === 'Happy'
                    ? '😊'
                    : item.mood === 'Excited'
                    ? '🤩'
                    : item.mood === 'Neutral'
                    ? '😐'
                    : '😫'}
                </Text>
              </View>
              <Text style={styles.moodDay}>{item.day}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card title="Suggestions by Type" style={styles.typeCard}>
        {suggestionsByType.map((item, index) => (
          <View key={index} style={styles.typeRow}>
            <Text style={styles.typeLabel}>{item.type}</Text>
            <View style={styles.typeBarContainer}>
              <View
                style={[
                  styles.typeBar,
                  { width: `${(item.count / 15) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.typeCount}>{item.count}</Text>
          </View>
        ))}
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
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 16,
    color: theme.colors.primaryLight,
    marginTop: theme.spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: theme.spacing.lg,
  },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
  },
  moodBar: {
    alignItems: 'center',
  },
  moodIndicator: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodDay: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  typeCard: {
    marginBottom: theme.spacing.lg,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  typeLabel: {
    width: 100,
    fontSize: 14,
    color: theme.colors.text,
  },
  typeBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    marginHorizontal: theme.spacing.md,
  },
  typeBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  typeCount: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'right',
  },
});
