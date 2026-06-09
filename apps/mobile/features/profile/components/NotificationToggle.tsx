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
    <View className="mb-5">
      <Text className="text-base font-bold mb-3 px-1 ml-2" style={{ color: c.text }}>
        Push Notifications
      </Text>

      <View
        className="rounded-xl"
        style={{
          backgroundColor: c.card,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...s.sm,
        }}
      >
        <View className="flex-row items-center px-4" style={{ paddingVertical: 14 }}>
          <Ionicons name="notifications-outline" size={20} color={c.text} />
          <Text style={{ color: c.text }} className="flex-1 text-sm ml-3">Enable Notifications</Text>
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
    </View>
  );
}
