import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { useThemeMode } from '@/contexts/ThemeContext';
import { NewActionPayload } from '../types/action.types';
import { Button } from '@/components/common/Button';

interface AddCustomActionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: Omit<NewActionPayload, 'isCustom'>) => void;
}

export const AddCustomActionModal: React.FC<AddCustomActionModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();
  const theme = isDark ? 'dark' : 'light';
  const c = Colors[theme];
  
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      category: 'custom',
    });
    
    setTitle('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View 
              className="rounded-t-3xl p-6"
              style={{ backgroundColor: c.background }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text style={{ color: c.text }} className="text-xl font-bold">
                  {t('action.customActionTitle')}
                </Text>
                <Pressable onPress={handleClose} className="p-2 -mr-2">
                  <Ionicons name="close" size={24} color={c.muted} />
                </Pressable>
              </View>

              <TextInput
                style={{ 
                  color: c.text, 
                  backgroundColor: c.card,
                  borderColor: c.border,
                }}
                className="p-4 rounded-xl border text-base mb-6"
                placeholder={t('action.customActionPlaceholder')}
                placeholderTextColor={c.muted}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />

              <View className="flex-row space-x-3 gap-3">
                <View className="flex-1">
                  <Button 
                    title={t('common.cancel')} 
                    onPress={handleClose} 
                    variant="outline" 
                  />
                </View>
                <View className="flex-1">
                  <Button 
                    title={t('action.customActionSubmit')} 
                    onPress={handleSubmit} 
                    disabled={!title.trim()}
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
