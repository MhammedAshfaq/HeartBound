import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { MOCK_MEMORIES } from '@/features/profile/types/profile.types';

export function FavoriteMoments() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const favorites = MOCK_MEMORIES.filter((m) => m.isFavorite);

  return (
    <View className="px-6 mt-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text style={{ color: c.text }} className="text-lg font-bold">Favorite Moments</Text>
        <Pressable onPress={() => Alert.alert('Coming Soon')}>
          <Text style={{ color: c.primary }} className="text-sm font-semibold">View all</Text>
        </Pressable>
      </View>

      {favorites.length === 0 ? (
        <View className="rounded-2xl py-8 items-center" style={{ backgroundColor: c.card }}>
          <Ionicons name="images-outline" size={32} color={c.muted} />
          <Text style={{ color: c.muted }} className="text-sm mt-2">No favorite moments yet</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {favorites.map((memory) => (
            <View
              key={memory.id}
              className="w-36 h-40 rounded-2xl mr-3 p-3 justify-between"
              style={{ backgroundColor: c.card }}
            >
              <View className="flex-1 items-center justify-center">
                <Ionicons name="heart" size={28} color="#e11d48" />
              </View>
              <View>
                <Text style={{ color: c.text }} className="text-sm font-semibold" numberOfLines={1}>
                  {memory.title}
                </Text>
                <Text style={{ color: c.muted }} className="text-xs mt-0.5">{memory.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
