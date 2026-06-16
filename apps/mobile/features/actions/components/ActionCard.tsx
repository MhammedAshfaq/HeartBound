import React from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { useThemeMode } from '@/contexts/ThemeContext';
import { ActionTask } from '../types/action.types';

interface ActionCardProps {
  task: ActionTask;
  onMarkDone?: (id: string) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ task, onMarkDone }) => {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();
  const theme = isDark ? 'dark' : 'light';
  const c = Colors[theme];

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'gift':
        return { name: 'gift', color: '#f43f5e', bg: '#ffe4e6' }; // rose
      case 'service':
        return { name: 'hand-left', color: '#8b5cf6', bg: '#ede9fe' }; // violet
      case 'words':
        return { name: 'chatbubble-ellipses', color: '#0ea5e9', bg: '#e0f2fe' }; // sky
      case 'time':
        return { name: 'time', color: '#f59e0b', bg: '#fef3c7' }; // amber
      case 'custom':
        return { name: 'star', color: '#ec4899', bg: '#fce7f3' }; // pink
      default:
        return { name: 'heart', color: '#f43f5e', bg: '#ffe4e6' };
    }
  };

  const iconInfo = getIconForCategory(task.category);

  // If completed, show a simpler, checked-off version that feels rewarding
  if (task.isCompleted) {
    return (
      <View
        className="flex-row items-center p-4 mb-3 rounded-2xl border"
        style={{
          backgroundColor: isDark ? '#1a1f1c' : '#f0fdf4',
          borderColor: isDark ? '#14532d' : '#bbf7d0',
          shadowColor: '#22c55e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
          marginBottom: 12,
        }}
      >
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-2"
          style={{ backgroundColor: isDark ? '#166534' : '#dcfce7' }}
        >
          <Ionicons name="checkmark-done" size={20} color={isDark ? '#4ade80' : '#16a34a'} />
        </View>
        <View className="flex-1 ml-1">
          <Text
            style={{ color: isDark ? '#f0fdf4' : '#14532d' }}
            className="text-base font-bold"
          >
            {task.title}
          </Text>
          <Text
            style={{ color: isDark ? '#86efac' : '#22c55e' }}
            className="text-xs mt-1 font-medium"
          >
            {t('action.completedToday')}
          </Text>
        </View>
      </View>
    );
  }

  // Active suggestion card
  return (
    <View
      className="p-4 mb-4 rounded-3xl border shadow-sm"
      style={{
        backgroundColor: isDark ? '#1c1917' : '#ffffff',
        borderColor: isDark ? '#292524' : '#f5f5f4',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2
      }}
    >
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-2 shadow-sm"
          style={{ backgroundColor: isDark ? '#292524' : iconInfo.bg }}
        >
          <Ionicons name={iconInfo.name as any} size={20} color={iconInfo.color} />
        </View>
        <View className="flex-1 justify-center ml-1 pr-2">
          <Text
            style={{ color: c.text }}
            className="text-mg font-bold leading-6 tracking-tight"
          >
            {task.title}
          </Text>
          {task.description && (
            <Text
              style={{ color: c.muted }}
              className="text-sm mt-1 leading-5"
            >
              {task.description}
            </Text>
          )}
        </View>

        {onMarkDone && (
          <Pressable
            onPress={() => onMarkDone(task.id)}
            className="w-12 h-12 rounded-full items-center justify-center border shadow-sm"
            style={({ pressed }) => [
              {
                backgroundColor: isDark ? '#2a1215' : '#fff1f2',
                borderColor: isDark ? '#4c1d24' : '#ffe4e6',
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.9 : 1 }]
              }
            ]}
          >
            <Ionicons name="heart-outline" size={24} color="#f43f5e" />
          </Pressable>
        )}
      </View>
    </View>
  );
};
