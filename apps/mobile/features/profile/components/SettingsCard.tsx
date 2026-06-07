import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { colors, shadows } from '@/lib/theme';

const SETTINGS_ROWS = [
  { icon: 'person-outline' as const, label: 'Account' },
  { icon: 'heart-outline' as const, label: 'Relationship' },
  { icon: 'notifications-outline' as const, label: 'Notifications' },
  { icon: 'shield-outline' as const, label: 'Privacy' },
];

export function SettingsCard() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);

  return (
    <View className="px-4 mt-6">
      <Text style={{ color: c.text }} className="text-lg font-bold mb-3">Settings</Text>
      <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: c.card, ...s.sm }}>
        {SETTINGS_ROWS.map((row) => (
          <Pressable
            key={row.label}
            onPress={() => Alert.alert('Coming Soon')}
            className="flex-row items-center px-4 py-3.5"
          >
            <Ionicons name={row.icon} size={20} color={c.text} />
            <Text style={{ color: c.text }} className="flex-1 text-sm ml-3">{row.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={c.muted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
