import { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

interface ActionItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  bgLight: string;
  bgDark: string;
}

const actions: ActionItem[] = [
  { icon: 'checkbox', label: 'Action', color: '#9C27B0', bgLight: '#F3E5F5', bgDark: '#3A1545' },
  { icon: 'heart', label: 'Memory', color: '#E91E63', bgLight: '#FCE4EC', bgDark: '#4A1528' },
  { icon: 'notifications', label: 'Notification', color: '#4CAF50', bgLight: '#E8F5E9', bgDark: '#1B3A1B' },
  { icon: 'person', label: 'Profile', color: '#FF9800', bgLight: '#FFF3E0', bgDark: '#4A2E00' },
];

interface QuickActionButtonProps {
  item: ActionItem;
  index: number;
  isDark: boolean;
  onPress: () => void;
}

function QuickActionButton({ item, index, isDark, onPress }: QuickActionButtonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowStyle = shadows(isDark).sm;
  const bgColor = isDark ? item.bgDark : item.bgLight;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 300 + index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: 300 + index * 80, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const onPressIn = () => {
    Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: bgColor, opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
        shadowStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.pressable}
      >
        <Ionicons name={item.icon} size={24} color={item.color} />
        <Text style={[styles.label, { color: item.color }]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function QuickActions() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const router = useRouter();
  const containerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(containerFade, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }).start();
  }, [containerFade]);

  const handleAction = useCallback((label: string) => {
    switch (label) {
      case 'Action': router.navigate('/(tabs)/action'); break;
      case 'Memory': router.navigate('/(tabs)/memories'); break;
      case 'Notification': router.navigate('/(tabs)/notification'); break;
      case 'Profile': router.navigate('/(tabs)/profile'); break;
    }
  }, [router]);

  return (
    <Animated.View style={[styles.container, { opacity: containerFade }]}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((item, index) => (
          <QuickActionButton
            key={item.label}
            item={item}
            index={index}
            isDark={isDark}
            onPress={() => handleAction(item.label)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: borderRadius.lg,
    minHeight: 88,
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
