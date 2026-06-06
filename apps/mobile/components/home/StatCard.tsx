import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

interface StatCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
  accentColor?: string;
}

export default function StatCard({ value, label, subtitle, accentColor }: StatCardProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);

  return (
    <View style={[styles.card, { backgroundColor: c.card }, s.sm]}>
      {accentColor && <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />}
      <Text style={[styles.value, accentColor && { color: accentColor }]}>{value}</Text>
      <Text style={[styles.label, { color: c.muted }]}>{label}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: c.muted }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    paddingTop: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  accentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.8,
  },
});
