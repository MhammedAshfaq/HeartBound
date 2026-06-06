import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

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

export default function UpcomingList() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (mockEvents.length === 0) {
    return (
      <Animated.View style={[styles.emptyContainer, { backgroundColor: c.card, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, s.sm]}>
        <Text style={styles.emptyIcon}>💡</Text>
        <Text style={[styles.emptyText, { color: c.muted }]}>No upcoming plans — plan something special</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: c.card, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, s.sm]}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>Upcoming</Text>
      {mockEvents.map((event, index) => (
        <View key={index} style={styles.eventItem}>
          <View style={styles.eventRow}>
            <Text style={styles.eventIcon}>{event.icon}</Text>
            <View style={styles.eventText}>
              <Text style={[styles.eventTitle, { color: c.text }]}>{event.title}</Text>
              <Text style={[styles.eventSubtitle, { color: c.muted }]}>{event.subtitle}</Text>
            </View>
            <View style={[styles.eventDot, { backgroundColor: event.color }]} />
          </View>
          {index < mockEvents.length - 1 && <View style={[styles.separator, { backgroundColor: c.border }]} />}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  eventItem: { gap: 0 },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  eventIcon: {
    fontSize: 22,
    marginRight: spacing.md,
    width: 32,
    textAlign: 'center',
  },
  eventText: { flex: 1 },
  eventTitle: { fontSize: 15, fontWeight: '600' },
  eventSubtitle: { fontSize: 13, marginTop: 2 },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
  separator: {
    height: 1,
    opacity: 0.5,
    marginLeft: 48,
  },
  emptyContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 32, marginBottom: spacing.sm },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
