import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { colors, shadows } from '@/lib/theme';

export function AppearanceSelector() {
  const { isDark, setMode } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const activeColor = isDark ? '#60a5fa' : '#3b82f6';

  const options = [
    { mode: 'light' as const, icon: 'sunny' as const, label: 'Light' },
    { mode: 'dark' as const, icon: 'moon' as const, label: 'Dark' },
  ];

  return (
    <View className="px-4 mt-6">
      <Text style={{ color: c.text }} className="text-lg font-bold mb-3">Appearance</Text>
      <View className="flex-row gap-3">
        {options.map((option) => {
          const selected = option.mode === 'dark' ? isDark : !isDark;
          return (
            <Pressable
              key={option.mode}
              onPress={() => setMode(option.mode)}
              className="flex-1 flex-row items-center gap-2 rounded-2xl px-4 py-3.5"
              style={{ backgroundColor: c.card, ...s.sm }}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={selected ? activeColor : c.text}
              />
              <View className="w-5 h-5 rounded-full border-2 items-center justify-center"
                style={{ borderColor: selected ? activeColor : c.muted }}
              >
                {selected && <View className="w-3 h-3 rounded-full" style={{ backgroundColor: activeColor }} />}
              </View>
              <Text style={{ color: selected ? activeColor : c.text }} className="text-sm font-semibold">
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
