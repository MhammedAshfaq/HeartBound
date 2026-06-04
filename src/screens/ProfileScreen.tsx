import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';
import { useAppSelector } from '@store/hooks';
import { useTheme } from '@context/ThemeContext';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useScreenLayout } from '@hooks/useScreenLayout';
import { ColorMode } from '@store/slices/settingsSlice';
import { AppTheme } from '@utils/theme';
import { formatDate } from '@utils/helpers';
import { differenceInMonths } from 'date-fns';

const relationshipTypeLabels: Record<string, string> = {
  dating: 'Dating',
  married: 'Married',
  engaged: 'Engaged',
  long_term: 'Long Term',
};

const loveLanguages = [
  'Words of Affirmation',
  'Quality Time',
  'Receiving Gifts',
  'Acts of Service',
  'Physical Touch',
];

const getDuration = (anniversary: Date): string => {
  const months = differenceInMonths(new Date(), new Date(anniversary));
  if (months < 1) return 'Less than a month';
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  let result = '';
  if (years > 0) result += `${years}y `;
  if (remaining > 0) result += `${remaining}m`;
  return result.trim();
};

const COLOR_MODE_OPTIONS: { mode: ColorMode; label: string }[] = [
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
  { mode: 'system', label: 'System' },
];

export const ProfileScreen: React.FC = () => {
  const screenLayout = useScreenLayout();
  const styles = useThemedStyles(createStyles);
  const { theme, colorMode, setColorMode } = useTheme();
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { partner } = useAppSelector((state) => state.partner);
  const { relationshipDetails } = useAppSelector((state) => state.user);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              })
            );
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  const duration = useMemo(() => {
    if (relationshipDetails?.anniversary) {
      return getDuration(new Date(relationshipDetails.anniversary));
    }
    return null;
  }, [relationshipDetails]);

  return (
    <SafeAreaView style={screenLayout.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.meta}>
              {user?.age ? `${user.age} years old` : ''}
              {user?.age && user?.email ? '  ·  ' : ''}
              {user?.email || ''}
            </Text>
          </View>
        </View>

        <Card title="❤️ Relationship Info">
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <Text style={styles.rowValue}>
              {relationshipDetails?.type
                ? relationshipTypeLabels[relationshipDetails.type] || relationshipDetails.type
                : 'Not set'}
            </Text>
          </View>
          {relationshipDetails?.anniversary && (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Anniversary</Text>
                <Text style={styles.rowValue}>
                  {formatDate(new Date(relationshipDetails.anniversary))}
                </Text>
              </View>
              {duration && (
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Together for</Text>
                  <Text style={styles.rowValueHighlight}>
                    {duration} ❤️
                  </Text>
                </View>
              )}
            </>
          )}
        </Card>

        <Card title="👩‍❤️‍👨 Partner Details">
          {partner ? (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Name</Text>
                <Text style={styles.rowValue}>{partner.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Birthday</Text>
                <TouchableOpacity onPress={() => Alert.alert('Coming Soon')}>
                  <Text style={styles.rowValueLink}>Add birthday 🎂</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Interests</Text>
                <TouchableOpacity onPress={() => Alert.alert('Coming Soon')}>
                  <Text style={styles.rowValueLink}>Add interests</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.loveLanguageSection}>
                <Text style={styles.sectionLabel}>Love Language</Text>
                <View style={styles.chipRow}>
                  {loveLanguages.map((ll) => (
                    <TouchableOpacity
                      key={ll}
                      style={styles.chip}
                      onPress={() => Alert.alert(ll)}
                    >
                      <Text style={styles.chipText}>{ll}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <TouchableOpacity onPress={() => Alert.alert('Coming Soon')}>
              <Text style={styles.placeholder}>
                No partner connected yet. Tap to add.
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        <Card title="📊 Insights">
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>75%</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Engagement</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Day Streak 🔥</Text>
            </View>
          </View>
        </Card>

        <Card title="🎨 Appearance">
          <View style={styles.themeOptions}>
            {COLOR_MODE_OPTIONS.map(({ mode, label }) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeOption,
                  colorMode === mode && styles.themeOptionActive,
                ]}
                onPress={() => setColorMode(mode)}
              >
                <Text
                  style={[
                    styles.themeOptionText,
                    colorMode === mode && styles.themeOptionTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card title="🧠 Preferences">
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.rowLabel}>Notification Frequency</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Medium</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.rowLabel}>Preferred Activity Type</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Messages</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.rowLabel}>Best Time to Notify</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Evening</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        </Card>

        <Card title="🔔 Notifications">
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primaryLight,
              }}
              thumbColor={
                notificationsEnabled
                  ? theme.colors.primary
                  : theme.colors.switchThumbOff
              }
            />
          </View>
        </Card>

        <Card title="🎁 Gift Settings">
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.rowLabel}>Budget Range</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>$20 – $100</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.rowLabel}>Favorite Categories</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Flowers, Tech</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.rowLabel}>Wishlist</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>3 items</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        </Card>

        <Card title="⚙️ Account">
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Coming Soon')}
          >
            <Text style={styles.rowLabel}>Change Phone / Email</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <Text style={styles.sectionLabel}>Linked Accounts</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Google</Text>
            <Text style={styles.linkBadgeActive}>Connected</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Facebook</Text>
            <Text style={styles.linkBadge}>Connect</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Apple</Text>
            <Text style={styles.linkBadge}>Connect</Text>
          </View>
        </Card>

        <View style={styles.logoutContainer}>
          <Button
            title="🚪  Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  themeOption: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  themeOptionActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  themeOptionTextActive: {
    color: theme.colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  meta: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rowLabel: {
    fontSize: 15,
    color: theme.colors.text,
    flex: 1,
  },
  rowValue: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  rowValueHighlight: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  rowValueLink: {
    fontSize: 15,
    color: theme.colors.primary,
  },
  arrow: {
    fontSize: 22,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  loveLanguageSection: {
    marginTop: theme.spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
  },
  chipText: {
    fontSize: 13,
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  linkBadge: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  linkBadgeActive: {
    fontSize: 13,
    color: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.success,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  placeholder: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
    fontStyle: 'italic',
  },
  logoutContainer: {
    marginTop: theme.spacing.lg,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textSecondary,
    paddingVertical: theme.spacing.lg,
  },
  });
