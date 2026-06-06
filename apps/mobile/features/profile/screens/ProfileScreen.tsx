import { useEffect, useRef } from 'react';
import { ScrollView, View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { RelationshipSnapshot } from '@/features/profile/components/RelationshipSnapshot';
import { FavoriteMoments } from '@/features/profile/components/FavoriteMoments';
import { ActivityInsights } from '@/features/profile/components/ActivityInsights';
import { AIInsightsCard } from '@/features/profile/components/AIInsightsCard';
import { AchievementsGrid } from '@/features/profile/components/AchievementsGrid';
import { SettingsCard } from '@/features/profile/components/SettingsCard';
import { AppearanceSelector } from '@/features/profile/components/AppearanceSelector';
import { NotificationToggle } from '@/features/profile/components/NotificationToggle';
import { LogoutButton } from '@/features/profile/components/LogoutButton';

const STATS = { completed: 42, total: 60, streak: 5 };

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader
            name={user?.name ?? 'User'}
            partnerName={user?.partnerName}
            anniversaryDate={user?.anniversaryDate}
            streak={STATS.streak}
            completedActionsCount={5}
            statsCompleted={STATS.completed}
          />

          <View className="h-6" />

          <RelationshipSnapshot completed={STATS.completed} total={STATS.total} />

          <FavoriteMoments />

          <ActivityInsights
            completed={STATS.completed}
            total={STATS.total}
            streak={STATS.streak}
          />

          <AIInsightsCard streak={STATS.streak} total={STATS.total} />

          <AchievementsGrid />

          <SettingsCard />

          <AppearanceSelector />

          <NotificationToggle />

          <LogoutButton />

          <View className="items-center pt-6 pb-4">
            <Text style={{ color: c.muted }} className="text-xs">Relationship Care v1.0.0</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
