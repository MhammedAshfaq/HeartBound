import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { AppTheme } from '@utils/theme';

interface UpcomingEvent {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

const mockEvents: UpcomingEvent[] = [
  { icon: '📞', title: 'Call your partner', subtitle: 'Today 8 PM', color: '#4CAF50' },
  { icon: '🎉', title: 'Anniversary', subtitle: 'June 10 ❤️', color: '#E91E63' },
];

export const UpcomingList: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (mockEvents.length === 0) {
    return (
      <Animated.View
        style={[styles.emptyContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.emptyIcon}>💡</Text>
        <Text style={styles.emptyText}>No upcoming plans — plan something special</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.sectionTitle}>Upcoming</Text>
      {mockEvents.map((event, index) => (
        <View key={index} style={styles.eventItem}>
          <View style={styles.eventRow}>
            <Text style={styles.eventIcon}>{event.icon}</Text>
            <View style={styles.eventText}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
            </View>
            <View style={[styles.eventDot, { backgroundColor: event.color }]} />
          </View>
          {index < mockEvents.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </Animated.View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
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
    eventItem: {
      gap: 0,
    },
    eventRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    eventIcon: {
      fontSize: 22,
      marginRight: theme.spacing.md,
      width: 32,
      textAlign: 'center',
    },
    eventText: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
    },
    eventSubtitle: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    eventDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: theme.spacing.sm,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      opacity: 0.5,
      marginLeft: 48,
    },
    emptyContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    emptyIcon: {
      fontSize: 32,
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
