import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { ActivityLogsList } from '@/features/profile/components/ActivityLogsList';

export default function ActivityLogsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const c = colors(isDark);

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Activity Log',
          headerStyle: {
            backgroundColor: c.background,
          },
          headerTitleStyle: {
            color: c.text,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-2">
              <Ionicons name="arrow-back" size={24} color={c.text} />
            </Pressable>
          ),
        }}
      />
      
      <ActivityLogsList />
    </View>
  );
}
