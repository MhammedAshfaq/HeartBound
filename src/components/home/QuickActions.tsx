import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useTheme } from '@context/ThemeContext';
import { AppTheme } from '@utils/theme';

interface ActionItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}

const actions: ActionItem[] = [
  { icon: 'heart', label: 'Add Interaction', color: '#E91E63' },
  { icon: 'create', label: 'Write Note', color: '#9C27B0' },
  { icon: 'alarm', label: 'Set Reminder', color: '#FF9800' },
  { icon: 'gift', label: 'Send Gift', color: '#4CAF50' },
];

interface QuickActionButtonProps {
  item: ActionItem;
  index: number;
  onPress: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ item, index, onPress }) => {
  const styles = useThemedStyles(createStyles);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: item.color + '15', borderColor: item.color + '30' },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Ionicons name={item.icon} size={24} color={item.color} />
        <Text style={[styles.actionLabel, { color: item.color }]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const QuickActions: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const containerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(containerFade, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, [containerFade]);

  const handleAction = useCallback((label: string) => {
    Alert.alert(label, `Opening ${label}...`);
  }, []);

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: theme.colors.card, opacity: containerFade }]}
    >
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((item, index) => (
          <QuickActionButton
            key={item.label}
            item={item}
            index={index}
            onPress={() => handleAction(item.label)}
          />
        ))}
      </View>
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
      gap: theme.spacing.sm,
    },
    buttonWrapper: {
      flex: 1,
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      minHeight: 72,
    },
    actionLabel: {
      fontSize: 10,
      fontWeight: '600',
      marginTop: theme.spacing.sm,
      textAlign: 'center',
    },
  });
