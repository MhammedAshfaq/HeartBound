import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

interface ProfileDetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
  badge?: boolean;
}

export function ProfileDetailRow({
  icon,
  iconColor,
  label,
  value,
  badge = false,
}: ProfileDetailRowProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);

  return (
    <View className="flex-row items-center px-4" style={{ paddingVertical: 7 }}>
      <View
        className="items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: iconColor + '12',
          marginRight: 10,
        }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      <View className="flex-1 min-w-0">
        <Text
          className="text-[13px] mb-0.5"
          style={{ color: c.muted }}
        >
          {label}
        </Text>
        {badge ? (
          <Badge color={iconColor} size="sm">
            {value}
          </Badge>
        ) : (
          <Text
            className="text-[15px] font-semibold leading-5"
            style={{ color: c.text }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {value}
          </Text>
        )}
      </View>
    </View>
  );
}
