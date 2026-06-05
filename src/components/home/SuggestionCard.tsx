import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useTheme } from '@context/ThemeContext';
import { AppTheme } from '@utils/theme';

interface SuggestionCardProps {
  suggestion: string;
  completedToday: boolean;
  onMarkDone: () => void;
  onTryAnother: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  completedToday,
  onMarkDone,
  onTryAnother,
}) => {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
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
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleMarkDone = useCallback(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onMarkDone();
  }, [scaleAnim, onMarkDone]);

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      <View style={[styles.accentBar, { backgroundColor: theme.colors.primary }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={styles.bulbIcon}>💡</Text>
          </View>
          <Text style={styles.sectionLabel}>Today's Suggestion</Text>
        </View>

        <Text style={styles.suggestionText}>{suggestion}</Text>

        {completedToday ? (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>✅ Completed for today!</Text>
            <Text style={styles.completedSubtext}>Come back tomorrow for a new suggestion</Text>
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
                  { backgroundColor: theme.colors.primary, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Text style={styles.primaryButtonText}>Mark as Done</Text>
              </Pressable>
            </Animated.View>
            <Pressable
              onPress={onTryAnother}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: theme.colors.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                Try Another
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
      overflow: 'hidden',
      ...theme.shadows.lg,
    },
    accentBar: {
      height: 4,
    },
    content: {
      padding: theme.spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
    },
    bulbIcon: {
      fontSize: 18,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    suggestionText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      lineHeight: 26,
      marginBottom: theme.spacing.lg,
    },
    actions: {
      gap: theme.spacing.sm,
    },
    primaryButton: {
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    secondaryButton: {
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    completedContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    completedText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.success,
      marginBottom: theme.spacing.xs,
    },
    completedSubtext: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });
