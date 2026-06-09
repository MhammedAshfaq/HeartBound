import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color: string;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeStyles = {
  sm: { view: 'px-3 py-1 rounded-lg', text: 'text-sm font-semibold' },
  md: { view: 'px-4 py-2.5 rounded-lg', text: 'text-[13px] font-semibold' },
};

export function Badge({ children, color, size = 'md', className = '' }: BadgeProps) {
  const s = sizeStyles[size];
  return (
    <View
      className={`self-start ${s.view} ${className}`}
      style={{ backgroundColor: color + '14' }}
    >
      <Text className={s.text} style={{ color }} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}
