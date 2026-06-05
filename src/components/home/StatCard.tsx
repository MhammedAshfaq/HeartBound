import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { AppTheme } from '@utils/theme';

interface StatCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, subtitle, accentColor }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      {accentColor && <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />}
      <Text style={[styles.value, accentColor && { color: accentColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      alignItems: 'center',
      overflow: 'hidden',
      ...theme.shadows.sm,
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
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    label: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      opacity: 0.8,
    },
  });
