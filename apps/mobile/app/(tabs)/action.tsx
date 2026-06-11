import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useActions } from '@/features/actions/hooks/useActions';
import { ActionCard } from '@/features/actions/components/ActionCard';
import { AddCustomActionModal } from '@/features/actions/components/AddCustomActionModal';
import { Button } from '@/components/common/Button';

export default function ActionScreen() {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();
  const theme = isDark ? 'dark' : 'light';
  const c = Colors[theme];
  
  const { actions, isLoading, refreshSuggestions, markAsCompleted, addCustomAction } = useActions();
  const [modalVisible, setModalVisible] = useState(false);

  const completedActions = actions.filter((a) => a.isCompleted);
  const pendingActions = actions.filter((a) => !a.isCompleted);

  if (isLoading && actions.length === 0) {
    return (
      <View style={{ backgroundColor: c.background }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mt-6 mb-8">
          <Text style={{ color: c.text }} className="text-3xl font-bold mb-2">
            {t('action.title')}
          </Text>
          <Text style={{ color: c.muted }} className="text-base">
            {t('action.subtitle')}
          </Text>
        </View>

        {/* Completed Section (Pinned at top) */}
        {completedActions.length > 0 && (
          <View className="mb-6">
            <Text style={{ color: c.text }} className="text-lg font-bold mb-4">
              {t('action.completedToday')}
            </Text>
            {completedActions.map((task) => (
              <ActionCard key={task.id} task={task} />
            ))}
          </View>
        )}

        {/* Suggestions Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ color: c.text }} className="text-lg font-bold">
              {t('action.ideasForYou')}
            </Text>
          </View>

          {pendingActions.length === 0 ? (
            <View 
              className="py-12 items-center justify-center rounded-2xl border border-dashed"
              style={{ borderColor: c.border }}
            >
              <Text style={{ color: c.muted }} className="text-center mb-4">
                You've completed all ideas!
              </Text>
              <Button 
                title={t('action.refresh')} 
                onPress={refreshSuggestions} 
                variant="outline" 
              />
            </View>
          ) : (
            pendingActions.map((task) => (
              <ActionCard 
                key={task.id} 
                task={task} 
                onMarkDone={markAsCompleted} 
              />
            ))
          )}
        </View>

        {/* Footer Actions */}
        <View className="space-y-4 mb-10 gap-3 pb-8">
          <Button 
            title={t('action.addCustom')} 
            onPress={() => setModalVisible(true)} 
          />
          {pendingActions.length > 0 && (
            <Button 
              title={t('action.refresh')} 
              onPress={refreshSuggestions} 
              variant="outline" 
            />
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <AddCustomActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addCustomAction}
      />
    </SafeAreaView>
  );
}
