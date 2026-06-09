import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
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
}

export function ProfileTabs({ profile }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);

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
        {activeTab === 'partner' && profile.partner && <PartnerDetailsCard partner={profile.partner} />}
        {activeTab === 'partner' && !profile.partner && (
          <View className="rounded-3xl py-8 items-center" style={{ backgroundColor: c.card }}>
            <Text style={{ color: c.muted }} className="text-sm">
              {t('profile.notSet')}
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
