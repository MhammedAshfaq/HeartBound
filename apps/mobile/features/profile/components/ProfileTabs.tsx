import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/lib/theme';
import { AccountDetailsCard } from '@/features/profile/components/AccountDetailsCard';
import { PartnerDetailsCard } from '@/features/profile/components/PartnerDetailsCard';
import { SettingsCard } from '@/features/profile/components/SettingsCard';
import type { ProfileBasicInfo } from '@/features/profile/types/profile.types';

type Tab = 'about' | 'partner' | 'settings';

interface ProfileTabsProps {
  profile: ProfileBasicInfo;
  isScrollAtBottom?: boolean;
}

export function ProfileTabs({ profile, isScrollAtBottom }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);

  const isSingle = profile.relationshipStatus === 'single';

  const tabs: { key: Tab; label: string }[] = [
    { key: 'about', label: t('profile.account') },
    { key: 'partner', label: t('profile.partnerDetails') },
    { key: 'settings', label: t('profile.settings') },
  ];

  return (
    <View className="px-4 mt-4">
      <View className="flex-row rounded-xl p-1" style={{ backgroundColor: c.card }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className="flex-1 py-2.5 items-center rounded-lg"
              style={{ backgroundColor: isActive ? c.primary : 'transparent' }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: isActive ? '#fff' : c.muted }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-4">
        {activeTab === 'about' && <AccountDetailsCard profile={profile} />}
        {activeTab === 'partner' && profile.partner && !isSingle && <PartnerDetailsCard partner={profile.partner} />}
        {activeTab === 'partner' && (!profile.partner || isSingle) && (
          <View
            className="rounded-xl items-center justify-center mb-5"
            style={{
              backgroundColor: c.card,
              paddingVertical: 48,
              paddingHorizontal: 24,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            }}
          >
            <View
              className="h-16 w-16 items-center justify-center rounded-full mb-4"
              style={{ backgroundColor: c.primary + '10' }}
            >
              <Ionicons name={isSingle ? "person-outline" : "heart-dislike-outline"} size={32} color={c.primary} style={{ opacity: 0.8 }} />
            </View>
            <Text style={{ color: c.text }} className="text-base font-semibold mb-1.5">
              {isSingle ? 'No Partner Details' : 'No Partner Synced'}
            </Text>
            <Text style={{ color: c.muted }} className="text-sm text-center leading-5 px-4">
              {isSingle 
                ? 'Your relationship status is currently set to Single.' 
                : 'Partner details have not been synced yet.'}
            </Text>
          </View>
        )}
        {activeTab === 'settings' && (
          <View>
            <SettingsCard />
          </View>
        )}
      </View>
    </View>
  );
}
