import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PrivacyBadgeProps {
  isPrivate: boolean;
}

export function PrivacyBadge({ isPrivate }: PrivacyBadgeProps) {
  if (!isPrivate) return null;

  return (
    <View className="absolute top-2 right-2 bg-black/40 rounded-full p-1.5">
      <Ionicons name="lock-closed" size={14} color="#fff" />
    </View>
  );
}
