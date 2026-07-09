import { useCallback, useState, useMemo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { DUMMY_PROFILE } from '@/features/profile/types/profile.types';
import type { ProfileBasicInfo } from '@/features/profile/types/profile.types';
import { useAuth } from '@/hooks/useAuth';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileTabs } from '@/features/profile/components/ProfileTabs';
import { LogoutButton } from '@/features/profile/components/LogoutButton';

const STATS = { streak: 5, score: '70%', daysTogether: 120 };
const APP_VERSION = Constants.expoConfig?.version || '1.0.0';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const { user } = useAuth();
  
  const profile = useMemo<ProfileBasicInfo>(() => {
    if (!user) return DUMMY_PROFILE;
    return {
      name: user.name || 'User',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      coverImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      phone: user.phone || '',
      email: user.email || '',
      country: user.country || 'Unknown',
      dateOfBirth: user.dateOfBirth || '',
      relationshipStatus: user.relationshipStatus || 'Single',
      isVerified: true,
      partner: user.partnerName ? {
        name: user.partnerName,
        dateOfBirth: user.partnerDob || '',
        phone: '',
        email: '',
        anniversary: user.anniversaryDate || '',
      } : null,
    };
  }, [user]);

  const handleEditProfile = useCallback(() => {
    router.push('/(modals)/edit-profile');
  }, [router]);

  const handleAIInsights = useCallback(() => {
    router.push('/(modals)/ai-insights');
  }, [router]);

  const [isScrollAtBottom, setIsScrollAtBottom] = useState(false);

  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 150;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    if (isCloseToBottom !== isScrollAtBottom) {
      setIsScrollAtBottom(isCloseToBottom);
    }
  }, [isScrollAtBottom]);

  return (
    <View style={{ backgroundColor: c.background }} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 4 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <ProfileHeader
          profile={profile}
          streak={STATS.streak}
          score={STATS.score}
          daysTogether={STATS.daysTogether}
          onEditProfile={handleEditProfile}
          onAIInsights={handleAIInsights}
        />
        <ProfileTabs profile={profile} isScrollAtBottom={isScrollAtBottom} />
        <LogoutButton />
        <Text style={{ color: c.muted }} className="text-xs text-center pb-1 mt-1">
          v{APP_VERSION}
        </Text>
      </ScrollView>
    </View>
  );
}
