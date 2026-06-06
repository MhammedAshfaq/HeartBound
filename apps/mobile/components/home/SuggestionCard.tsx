import { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

interface SuggestionCardProps {
  suggestion: string;
  completedToday: boolean;
  onMarkDone: () => void;
  onTryAnother: () => void;
}

export default function SuggestionCard({
  suggestion,
  completedToday,
  onMarkDone,
  onTryAnother,
}: SuggestionCardProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const handleMarkDone = useCallback(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onMarkDone();
  }, [scaleAnim, onMarkDone]);

  return (
    <Animated.View style={[styles.container, { backgroundColor: c.card, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, s.lg]}>
      <View style={[styles.accentBar, { backgroundColor: c.primary }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, { backgroundColor: c.primary + '20' }]}>
            <Text style={styles.bulbIcon}>💡</Text>
          </View>
          <Text style={[styles.sectionLabel, { color: c.muted }]}>Today's Suggestion</Text>
        </View>

        <Text style={[styles.suggestionText, { color: c.text }]}>{suggestion}</Text>

        {completedToday ? (
          <View style={styles.completedContainer}>
            <Text style={[styles.completedText, { color: c.success }]}>✅ Completed for today!</Text>
            <Text style={[styles.completedSubtext, { color: c.muted }]}>Come back tomorrow for a new suggestion</Text>
          </View>
        ) : (
          <View style={styles.actions}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Pressable
                onPress={handleMarkDone}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: c.primary, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Text style={styles.primaryButtonText}>Mark as Done</Text>
              </Pressable>
            </Animated.View>
            <Pressable
              onPress={onTryAnother}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: c.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: c.primary }]}>Try Another</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  accentBar: { height: 4 },
  content: { padding: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  bulbIcon: { fontSize: 18 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  actions: { gap: spacing.sm },
  primaryButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '600' },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  completedSubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
});
