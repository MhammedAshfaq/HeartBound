import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useScreenLayout } from '@hooks/useScreenLayout';
import { AppTheme } from '@utils/theme';
import { formatRelativeTime } from '@utils/helpers';
import { Notification, NotificationTrigger } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Daily Reminder',
    message: 'Time to check in with your partner!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    type: NotificationTrigger.TimeBased,
  },
  {
    id: '2',
    title: 'New Suggestion Available',
    message: 'We have a personalized suggestion for you today.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    type: NotificationTrigger.TimeBased,
  },
  {
    id: '3',
    title: 'Anniversary Coming Up!',
    message: 'Your anniversary is in 10 days. Start planning something special!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    type: NotificationTrigger.SpecialEvent,
  },
  {
    id: '4',
    title: 'Mood Check',
    message: 'How are you feeling today? Take a moment to log your mood.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true,
    type: NotificationTrigger.TimeBased,
  },
];

export const NotificationsScreen: React.FC = () => {
  const screenLayout = useScreenLayout();
  const styles = useThemedStyles(createStyles);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unread]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {item.type === NotificationTrigger.SpecialEvent ? '🎉' : '💝'}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{formatRelativeTime(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={screenLayout.safe} edges={['top']}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={screenLayout.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          unreadCount > 0 ? (
            <TouchableOpacity style={styles.listHeader} onPress={markAllAsRead}>
              <Text style={styles.markAllRead}>Mark all as read</Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    listHeader: {
      alignItems: 'flex-end',
      marginBottom: theme.spacing.sm,
    },
    markAllRead: {
      fontSize: 13,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    notificationItem: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    unread: {
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    icon: {
      fontSize: 20,
    },
    content: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    message: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      lineHeight: 20,
    },
    time: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
  });
