import React from 'react';
import { View, Text, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { useThemeMode } from '@/contexts/ThemeContext';
import { Button } from '@/components/common/Button';

export interface ConfirmationModalOption {
  text: string;
  style?: 'cancel' | 'default' | 'destructive';
  onPress?: () => void;
}

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message?: string;
  options: ConfirmationModalOption[];
  onClose?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  options,
  onClose,
  icon,
  iconColor,
}) => {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();
  const theme = isDark ? 'dark' : 'light';
  const c = Colors[theme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center p-5" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableWithoutFeedback>
            <View
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: c.background,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5
              }}
            >
              {icon && (
                <View className="items-center mb-4">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: iconColor ? `${iconColor}20` : `${c.primary}20` }}
                  >
                    <Ionicons name={icon} size={32} color={iconColor || c.primary} />
                  </View>
                </View>
              )}

              <Text style={{ color: c.text }} className="text-xl font-bold text-center mb-2">
                {title}
              </Text>

              {message && (
                <Text style={{ color: c.muted }} className="text-base text-center mb-8 leading-6">
                  {message}
                </Text>
              )}

              <View className="space-y-3 gap-3">
                {options.map((option, index) => {
                  const isDestructive = option.style === 'destructive';
                  const isCancel = option.style === 'cancel';

                  return (
                    <Button
                      key={index}
                      title={option.text}
                      onPress={() => {
                        option.onPress?.();
                        if (isCancel && onClose) {
                          onClose();
                        }
                      }}
                      variant={isCancel ? 'outline' : 'primary'}
                      style={
                        isDestructive
                          ? { backgroundColor: '#ef4444', borderColor: '#ef4444' }
                          : undefined
                      }
                    />
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
