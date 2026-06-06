import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

interface PrivacySelectorProps {
  value: boolean;
  onChange: (isPrivate: boolean) => void;
  accentColor?: string;
}

export function PrivacySelector({ value, onChange, accentColor }: PrivacySelectorProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const activeColor = accentColor ?? (isDark ? '#60a5fa' : '#3b82f6');

  return (
    <View>
      <Pressable
        onPress={() => onChange(true)}
        className="flex-row items-center gap-3 py-4 px-4 rounded-xl mb-3"
        style={{ backgroundColor: c.card }}
      >
        <View
          className="w-6 h-6 rounded-full border-2 items-center justify-center"
          style={{ borderColor: value ? activeColor : c.border }}
        >
          {value && <View className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: activeColor }} />}
        </View>
        <View className="flex-1">
          <Text style={{ color: c.text }} className="font-semibold text-base">
            {t('memories.private')}
          </Text>
          <Text style={{ color: c.muted }} className="text-sm">
            {t('memories.privateDesc')}
          </Text>
        </View>
        <Ionicons name="lock-closed-outline" size={22} color={value ? activeColor : c.muted} />
      </Pressable>

      <Pressable
        onPress={() => onChange(false)}
        className="flex-row items-center gap-3 py-4 px-4 rounded-xl"
        style={{ backgroundColor: c.card }}
      >
        <View
          className="w-6 h-6 rounded-full border-2 items-center justify-center"
          style={{ borderColor: !value ? activeColor : c.border }}
        >
          {!value && <View className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: activeColor }} />}
        </View>
        <View className="flex-1">
          <Text style={{ color: c.text }} className="font-semibold text-base">
            {t('memories.shared')}
          </Text>
          <Text style={{ color: c.muted }} className="text-sm">
            {t('memories.sharedDesc')}
          </Text>
        </View>
        <Ionicons name="people-outline" size={22} color={!value ? activeColor : c.muted} />
      </Pressable>
    </View>
  );
}
