import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

interface NotificationItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    icon: 'heart',
    iconColor: '#E91E63',
    title: 'New memory added',
    description: 'Your partner added a new memory to your collection',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    icon: 'chatbubble-ellipses',
    iconColor: '#3b82f6',
    title: 'Daily question ready',
    description: "Today's relationship question is waiting for you",
    time: '15m ago',
    read: false,
  },
  {
    id: '3',
    icon: 'star',
    iconColor: '#FF9800',
    title: 'Streak milestone',
    description: 'You reached a 7-day streak! Keep it going',
    time: '1h ago',
    read: false,
  },
  {
    id: '4',
    icon: 'calendar',
    iconColor: '#9C27B0',
    title: 'Upcoming anniversary',
    description: 'Your anniversary is in 3 days',
    time: '3h ago',
    read: true,
  },
  {
    id: '5',
    icon: 'trophy',
    iconColor: '#FF9800',
    title: 'Achievement unlocked',
    description: 'You earned the "Communication Pro" badge',
    time: '1d ago',
    read: true,
  },
  {
    id: '6',
    icon: 'notifications',
    iconColor: '#4CAF50',
    title: 'Partner checked in',
    description: 'Your partner completed today\'s mood check-in',
    time: '2d ago',
    read: true,
  },
  {
    id: '7',
    icon: 'bulb',
    iconColor: '#FF9800',
    title: 'New suggestion available',
    description: 'Check out today\'s relationship-building suggestion',
    time: '3d ago',
    read: true,
  },
];

export default function NotificationScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const infoColor = isDark ? '#60a5fa' : '#3b82f6';
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <View style={{ backgroundColor: c.background }} className="flex-1">
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text style={{ color: c.text }} className="text-2xl font-extrabold">
              {t('tabs.notification')}
            </Text>
            {unreadCount > 0 && (
              <View style={{ backgroundColor: c.primary }} className="rounded-full px-2 py-0.5">
                <Text className="text-xs font-bold text-white">{unreadCount}</Text>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <Pressable onPress={markAllRead} accessibilityRole="button">
              <Text style={{ color: infoColor }} className="text-sm font-semibold">
                {t('notification.markAllRead')}
              </Text>
            </Pressable>
          )}
        </View>

        {/* List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-6"
        >
          {notifications.length === 0 ? (
            <View className="flex-1 items-center justify-center pt-20">
              <Ionicons name="notifications-off-outline" size={48} color={c.muted} />
              <Text style={{ color: c.muted }} className="mt-4 text-base">
                {t('notification.empty')}
              </Text>
            </View>
          ) : (
            notifications.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => markAsRead(item.id)}
                style={{
                  backgroundColor: item.read ? 'transparent' : c.primary + '08',
                  borderColor: c.border,
                }}
                className={`mb-2 rounded-2xl border p-4 ${item.read ? '' : ''}`}
              >
                <View className="flex-row items-start gap-3">
                  <View
                    style={{ backgroundColor: item.iconColor + '18' }}
                    className="mt-0.5 h-10 w-10 items-center justify-center rounded-full"
                  >
                    <Ionicons name={item.icon} size={20} color={item.iconColor} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text
                        style={{ color: c.text }}
                        className={`flex-1 text-base ${item.read ? 'font-medium' : 'font-bold'}`}
                      >
                        {item.title}
                      </Text>
                      {!item.read && (
                        <View style={{ backgroundColor: c.primary }} className="ml-2 h-2 w-2 rounded-full" />
                      )}
                    </View>
                    <Text
                      style={{ color: c.muted }}
                      className="mt-0.5 text-sm leading-5"
                    >
                      {item.description}
                    </Text>
                    <Text style={{ color: c.muted }} className="mt-1.5 text-xs font-medium opacity-60">
                      {item.time}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
