import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import { useThemeMode } from '@/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  loading = false 
}) => {
  const { isDark } = useThemeMode();
  const c = Colors[isDark ? 'dark' : 'light'];

  const isPrimary = variant === 'primary';
  const bgColor = isPrimary ? c.primary : 'transparent';
  const textColor = isPrimary ? '#fff' : c.primary;
  const borderColor = isPrimary ? 'transparent' : c.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-3.5 px-4 rounded-xl items-center justify-center flex-row border`}
      style={{
        backgroundColor: disabled ? c.border : bgColor,
        borderColor: disabled ? c.border : borderColor,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} className="mr-2" />
      ) : null}
      <Text style={{ color: disabled ? c.muted : textColor }} className="font-semibold text-base">
        {title}
      </Text>
    </Pressable>
  );
};
