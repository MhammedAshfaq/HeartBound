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
    <View className="mb-5">
      <Text className="text-base font-bold mb-3 px-1 ml-2" style={{ color: c.text }}>
        Appearance
      </Text>

      <View
        className="rounded-xl"
        style={{
          backgroundColor: c.card,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...s.sm,
        }}
      >
        <View className="flex-row gap-3 px-4" style={{ paddingVertical: 14 }}>
          {options.map((option) => {
            const selected = option.mode === 'dark' ? isDark : !isDark;
            return (
              <Pressable
                key={option.mode}
                onPress={() => setMode(option.mode)}
                className="flex-1 flex-row items-center gap-2 rounded-xl px-4 py-3.5"
                style={{ backgroundColor: selected ? activeColor + '12' : 'transparent' }}
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
    </View>
  );
}
