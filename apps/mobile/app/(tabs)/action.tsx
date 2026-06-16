import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
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
  const isFocused = useIsFocused();

  const { actions, isLoading, refreshSuggestions, markAsCompleted, addCustomAction } = useActions();
  const [modalVisible, setModalVisible] = useState(false);

  const completedActions = actions.filter((a) => a.isCompleted);
  const pendingActions = actions.filter((a) => !a.isCompleted);

  if (isLoading && actions.length === 0) {
    return (
      <View style={{ backgroundColor: c.background }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f43f5e" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: isDark ? '#0c0a09' : '#f8fafc', flex: 1 }}>
      {isFocused && <StatusBar barStyle="light-content" />}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        bounces={false}
      >
        {/* Rich Header Background */}
        <View
          className="pt-16 pb-12 px-6 rounded-b-[40px] shadow-sm relative overflow-hidden"
          style={{ backgroundColor: '#f43f5e' }}
        >
          {/* Decorative background circles */}
          <View className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white opacity-10" />
          <View className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black opacity-10" />

          <SafeAreaView>
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="sparkles" size={24} color="#fff" />
              </View>
            </View>
            <Text className="text-4xl font-extrabold text-white tracking-tight mb-2 mt-2 shadow-sm">
              {t('action.title')}
            </Text>
            <Text className="text-rose-100 text-lg font-medium">
              {t('action.subtitle')}
            </Text>
          </SafeAreaView>
        </View>

        <View className="px-5 pt-6">
          {/* Completed Section (Pinned at top) */}
          {completedActions.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-5">
                <Ionicons name="trophy" size={20} color="#f59e0b" className="mr-2" />
                <Text style={{ color: c.text }} className="text-xl font-bold ml-2">
                  {t('action.completedToday')}
                </Text>
                <View className="ml-3 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-full">
                  <Text className="text-amber-600 dark:text-amber-400 font-bold text-xs">
                    {completedActions.length}
                  </Text>
                </View>
              </View>
              {completedActions.map((task) => (
                <ActionCard key={task.id} task={task} />
              ))}
            </View>
          )}

          {/* Suggestions Section */}
          <View className="mb-8">
            <View className="flex-row justify-between items-end mb-5">
              <Text style={{ color: c.text }} className="text-xl font-bold">
                {t('action.ideasForYou')}
              </Text>
            </View>

            {pendingActions.length === 0 ? (
              <View
                className="py-16 px-6 items-center justify-center rounded-3xl border-2 border-dashed"
                style={{ borderColor: isDark ? '#3f3f46' : '#cbd5e1', backgroundColor: isDark ? '#18181b' : '#f1f5f9' }}
              >
                <View className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 items-center justify-center mb-4">
                  <Ionicons name="star" size={32} color="#f43f5e" />
                </View>
                <Text style={{ color: c.text }} className="text-xl font-bold text-center mb-2">
                  All done for now!
                </Text>
                <Text style={{ color: c.muted }} className="text-center mb-6 leading-5">
                  You've completed all suggested acts of kindness today. Keep the romance alive!
                </Text>
                <Button
                  title={t('action.refresh')}
                  onPress={refreshSuggestions}
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
          <View className="space-y-4 gap-4 pb-4">
            <Button
              title={t('action.addCustom')}
              onPress={() => setModalVisible(true)}
              variant="outline"
            />
            {pendingActions.length > 0 && (
              <Button
                title={t('action.refresh')}
                onPress={refreshSuggestions}
                variant="outline"
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <AddCustomActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addCustomAction}
      />
    </View>
  );
}
