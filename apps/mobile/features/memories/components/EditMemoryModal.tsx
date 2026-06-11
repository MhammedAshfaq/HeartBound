import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { useThemeMode } from '@/contexts/ThemeContext';
import { Memory } from '@/features/memories/types/memory.types';
import { MemoryFeeling } from '@/constants/Enums';
import { MoodSelector } from '@/features/memories/components/MoodSelector';
import { Button } from '@/components/common/Button';

interface EditMemoryModalProps {
  visible: boolean;
  memory: Memory;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Memory>) => Promise<void>;
}

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  visible,
  memory,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();
  const theme = isDark ? 'dark' : 'light';
  const c = Colors[theme];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState<MemoryFeeling | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && memory) {
      setTitle(memory.title || '');
      setDescription(memory.description || '');
      setLocation(memory.location || '');
      setFeeling(memory.feeling || null);
    }
  }, [visible, memory]);

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave(memory.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        feeling: feeling || undefined,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const activeColor = isDark ? '#60a5fa' : '#3b82f6';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center p-5" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View 
            className="rounded-3xl w-full h-[85%]"
            style={{ backgroundColor: c.background }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-4 border-b" style={{ borderColor: c.border }}>
              <Pressable onPress={onClose} className="p-2 -ml-2">
                <Ionicons name="close" size={24} color={c.text} />
              </Pressable>
              <Text style={{ color: c.text }} className="text-lg font-bold">
                {t('common.edit') || 'Edit Memory'}
              </Text>
              <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
              {/* Title Field */}
              <Text style={{ color: c.text }} className="text-sm font-semibold mb-1.5">
                {t('memories.memoryTitle')} <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={t('memories.titlePlaceholder')}
                placeholderTextColor={c.muted}
                className="rounded-xl px-4 py-3.5 text-base mb-4"
                style={{ backgroundColor: c.card, color: c.text, borderWidth: 1, borderColor: c.border }}
              />

              {/* Description Field */}
              <Text style={{ color: c.text }} className="text-sm font-semibold mb-1.5">
                {t('memories.description')}
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t('memories.descriptionPlaceholder')}
                placeholderTextColor={c.muted}
                multiline
                numberOfLines={4}
                className="rounded-xl px-4 py-3.5 text-base mb-4"
                style={{ backgroundColor: c.card, color: c.text, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: c.border }}
              />

              {/* Location Field */}
              <Text style={{ color: c.text }} className="text-sm font-semibold mb-1.5">
                {t('memories.location')}
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder={t('memories.locationPlaceholder')}
                placeholderTextColor={c.muted}
                className="rounded-xl px-4 py-3.5 text-base mb-6"
                style={{ backgroundColor: c.card, color: c.text, borderWidth: 1, borderColor: c.border }}
              />

              {/* Mood Selector Section */}
              <Text style={{ color: c.text }} className="text-sm font-semibold mb-3">
                {t('memories.howYouFelt')}
              </Text>
              <View className="mb-8">
                <MoodSelector
                  value={feeling}
                  onChange={setFeeling}
                  accentColor={activeColor}
                />
              </View>
            </ScrollView>

            <View className="px-6 py-4 border-t pb-8" style={{ borderColor: c.border }}>
              <Button 
                title={saving ? (t('memories.saving') || 'Saving...') : (t('common.save') || 'Save')} 
                onPress={handleSave} 
                disabled={saving || !title.trim()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
