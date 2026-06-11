import React from 'react';
import { View, Text, Pressable } from 'react-native';
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
        return 'gift-outline';
      case 'service':
        return 'hand-left-outline';
      case 'words':
        return 'chatbubble-outline';
      case 'time':
        return 'time-outline';
      case 'custom':
        return 'star-outline';
      default:
        return 'checkmark-circle-outline';
    }
  };

  if (task.isCompleted) {
    return (
      <View 
        className="flex-row items-center p-4 mb-3 rounded-2xl"
        style={{ backgroundColor: c.card, opacity: 0.8 }}
      >
        <View 
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${c.success}20` }}
        >
          <Ionicons name="checkmark-circle" size={24} color={c.success} />
        </View>
        <View className="flex-1">
          <Text 
            style={{ color: c.text }} 
            className="text-base font-semibold"
          >
            {task.title}
          </Text>
          <Text 
            style={{ color: c.muted }} 
            className="text-xs mt-1"
          >
            {t('action.completedToday')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View 
      className="p-4 mb-4 rounded-2xl border"
      style={{ backgroundColor: c.card, borderColor: c.border }}
    >
      <View className="flex-row items-start mb-3">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${c.primary}15` }}
        >
          <Ionicons name={getIconForCategory(task.category)} size={20} color={c.primary} />
        </View>
        <View className="flex-1">
          <Text 
            style={{ color: c.text }} 
            className="text-base font-semibold leading-6"
          >
            {task.title}
          </Text>
          {task.description && (
            <Text 
              style={{ color: c.muted }} 
              className="text-sm mt-1"
            >
              {task.description}
            </Text>
          )}
        </View>
      </View>
      
      {onMarkDone && (
        <Pressable
          onPress={() => onMarkDone(task.id)}
          className="py-3 rounded-xl items-center justify-center flex-row"
          style={{ backgroundColor: `${c.primary}15` }}
        >
          <Text style={{ color: c.primary }} className="font-semibold text-sm">
            {t('action.markDone')}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
