import { View, Text } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

export default function GamesScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);

  return (
    <View style={{ backgroundColor: c.background }} className="flex-1 items-center justify-center px-6">
      <Text style={{ color: c.muted }} className="text-center text-base">
        {t('games.placeholder')}
      </Text>
    </View>
  );
}
