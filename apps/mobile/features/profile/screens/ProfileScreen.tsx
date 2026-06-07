import { useRef, useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, Animated, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/lib/theme';
import { DUMMY_PROFILE } from '@/features/profile/types/profile.types';
import type { ProfileBasicInfo } from '@/features/profile/types/profile.types';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { FavoriteMoments } from '@/features/profile/components/FavoriteMoments';
import { ActivityInsights } from '@/features/profile/components/ActivityInsights';
import { AIInsightsCard } from '@/features/profile/components/AIInsightsCard';
import { AchievementsGrid } from '@/features/profile/components/AchievementsGrid';
import { SettingsCard } from '@/features/profile/components/SettingsCard';
import { AppearanceSelector } from '@/features/profile/components/AppearanceSelector';
import { NotificationToggle } from '@/features/profile/components/NotificationToggle';
import { LogoutButton } from '@/features/profile/components/LogoutButton';

const STATS = { completed: 42, total: 60, streak: 5 };

function AnimatedSection({ children, delay }: { children: React.ReactNode; delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, delay]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const [profile, setProfile] = useState<ProfileBasicInfo>(DUMMY_PROFILE);

  const handleAvatarChange = useCallback((uri: string) => {
    setProfile((prev) => ({ ...prev, avatar: uri }));
  }, []);

  const handleEditProfile = useCallback(() => {
    Alert.alert(t('profile.edit'), t('profile.editProfileHint'));
  }, [t]);

  return (
    <View style={{ backgroundColor: c.background }} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 4 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader profile={profile} onAvatarChange={handleAvatarChange} onEditProfile={handleEditProfile} />

        <View className="h-1" />

        <AnimatedSection delay={100}>
          <FavoriteMoments />
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <ActivityInsights
            completed={STATS.completed}
            total={STATS.total}
            streak={STATS.streak}
          />
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <AIInsightsCard streak={STATS.streak} total={STATS.total} />
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <AchievementsGrid />
        </AnimatedSection>

        <AnimatedSection delay={500}>
          <SettingsCard />
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <AppearanceSelector />
        </AnimatedSection>

        <AnimatedSection delay={700}>
          <NotificationToggle />
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <LogoutButton />
        </AnimatedSection>

        <Text style={{ color: c.muted }} className="text-xs text-center pb-1">
          {t('profile.appVersion')}
        </Text>
      </ScrollView>
    </View>
  );
}
