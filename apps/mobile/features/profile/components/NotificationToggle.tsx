import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { colors, shadows } from '@/lib/theme';

export function NotificationToggle() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const [enabled, setEnabled] = useState(false);
  const activeColor = isDark ? '#60a5fa' : '#3b82f6';

  return (
    <View className="px-4 mt-6">
      <View className="rounded-2xl flex-row items-center px-4 py-3.5" style={{ backgroundColor: c.card, ...s.sm }}>
        <Ionicons name="notifications-outline" size={20} color={c.text} />
        <Text style={{ color: c.text }} className="flex-1 text-sm ml-3">Push Notifications</Text>
        <Pressable
          onPress={() => setEnabled((prev) => !prev)}
          className="rounded-full px-0.5"
          style={{
            width: 48,
            height: 28,
            backgroundColor: enabled ? activeColor : c.border,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#fff',
              alignSelf: enabled ? 'flex-end' : 'flex-start',
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}
