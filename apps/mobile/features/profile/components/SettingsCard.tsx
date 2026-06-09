import { useState, useCallback } from 'react';
import { Alert, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { colors, shadows } from '@/lib/theme';

type RelationshipValue = 'single' | 'inRelationship' | 'married' | 'engaged';

const RELATIONSHIP_OPTIONS: { value: RelationshipValue; labelKey: string }[] = [
  { value: 'single', labelKey: 'auth.statusSingle' },
  { value: 'inRelationship', labelKey: 'auth.statusInRelationship' },
  { value: 'married', labelKey: 'auth.statusMarried' },
  { value: 'engaged', labelKey: 'auth.statusEngaged' },
];

const SETTINGS_ROWS: { icon: keyof typeof Ionicons.glyphMap; label: string; route?: string; expandable?: boolean }[] = [
  { icon: 'person-outline', label: 'Account', route: '/(modals)/email-verification' },
  { icon: 'heart-outline', label: 'Relationship', expandable: true },
  { icon: 'notifications-outline', label: 'Notifications', expandable: true },
  { icon: 'shield-outline', label: 'Privacy', expandable: true },
];

export function SettingsCard() {
  const { t } = useTranslation();
  const { isDark, setMode } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const router = useRouter();
  const toast = useToast();
  const { user, updateProfile } = useAuth();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const activeColor = isDark ? '#60a5fa' : '#3b82f6';

  const currentStatus = (user?.relationshipStatus as RelationshipValue) ?? '';

  const getLabel = (value: RelationshipValue) => {
    const option = RELATIONSHIP_OPTIONS.find((o) => o.value === value);
    return option ? t(option.labelKey as any) : value;
  };

  const handleRelationshipPress = useCallback((value: RelationshipValue) => {
    if (value === currentStatus) return;
    const label = RELATIONSHIP_OPTIONS.find((o) => o.value === value);
    Alert.alert(
      'Update Relationship Status',
      `Are you sure you want to change your status to "${label ? t(label.labelKey as any) : value}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            await updateProfile({
              name: user?.name ?? '',
              dateOfBirth: user?.dateOfBirth ?? '',
              relationshipStatus: value,
            });
            toast.success({ title: 'Relationship status updated' });
          },
        },
      ],
    );
  }, [currentStatus, user, updateProfile, toast, t]);

  return (
    <View className="mb-5">
      <Text className="text-base font-bold mb-3 px-1 ml-2" style={{ color: c.text }}>
        {t('profile.settings')}
      </Text>

      <View
        className="rounded-xl"
        style={{
          backgroundColor: c.card,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...s.sm,
        }}
      >
        {SETTINGS_ROWS.map((row) => (
          <View key={row.label}>
            <Pressable
              onPress={() => {
                if (row.expandable) {
                  setExpandedRow(expandedRow === row.label ? null : row.label);
                } else if (row.route) {
                  router.push(row.route as any);
                }
              }}
              className="flex-row items-center px-4"
              style={{ paddingVertical: 14 }}
            >
              <Ionicons name={row.icon} size={20} color={c.text} style={{ marginRight: 5 }} />
              <Text style={{ color: c.text }} className="flex-1 text-sm ml-4">{row.label}</Text>
              <Ionicons
                name={expandedRow === row.label ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={c.muted}
              />
            </Pressable>

            {expandedRow === row.label && row.expandable && row.label === 'Notifications' && (
              <View className="px-4 pb-3">
                <View
                  className="flex-row items-center rounded-xl px-4"
                  style={{
                    paddingVertical: 12,
                    backgroundColor: c.surface,
                    borderWidth: 1,
                    borderColor: c.border,
                  }}
                >
                  <Ionicons name="notifications-outline" size={20} color={c.text} />
                  <Text style={{ color: c.text }} className="flex-1 text-sm ml-3">
                    Enable Notifications
                  </Text>
                  <Pressable
                    onPress={() => setNotificationsEnabled((prev) => !prev)}
                    style={{
                      width: 48,
                      height: 28,
                      backgroundColor: notificationsEnabled ? activeColor : c.border,
                      justifyContent: 'center',
                      paddingHorizontal: 2,
                    }}
                    className="rounded-full"
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: '#fff',
                        alignSelf: notificationsEnabled ? 'flex-end' : 'flex-start',
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            )}

            {expandedRow === row.label && row.expandable && row.label === 'Relationship' && (
              <View className="px-4 pb-3">
                <View
                  className="rounded-xl px-4"
                  style={{
                    paddingVertical: 12,
                    backgroundColor: c.surface,
                    borderWidth: 1,
                    borderColor: c.border,
                  }}
                >
                  <Text className="text-xs font-semibold mb-3 ml-1" style={{ color: c.muted }}>
                    Current Status
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {RELATIONSHIP_OPTIONS.map((option) => {
                      const isSelected = currentStatus === option.value;
                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => handleRelationshipPress(option.value)}
                          style={{
                            borderColor: isSelected ? c.primary : c.border,
                            backgroundColor: isSelected ? c.primary + '15' : c.surface,
                          }}
                          className="rounded-xl border px-4 py-2.5"
                        >
                          <Text style={{ color: isSelected ? c.primary : c.muted }} className="text-sm font-bold">
                            {getLabel(option.value)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {expandedRow === row.label && row.expandable && row.label === 'Privacy' && (
              <View className="px-4 pb-3 mb-3">
                <View
                  className="flex-row rounded-xl px-4"
                  style={{
                    paddingVertical: 8,
                    backgroundColor: c.surface,
                    borderWidth: 1,
                    borderColor: c.border,
                  }}
                >
                  <Pressable
                    onPress={() => setMode('light')}
                    className="flex-row flex-1 items-center gap-2 rounded-xl px-3 py-3.5"
                    style={{ backgroundColor: !isDark ? activeColor + '12' : 'transparent' }}
                  >
                    <Ionicons name="sunny" size={20} color={!isDark ? activeColor : c.text} />
                    <View
                      className="w-5 h-5 rounded-full border-2 items-center justify-center"
                      style={{ borderColor: !isDark ? activeColor : c.muted }}
                    >
                      {!isDark && <View className="w-3 h-3 rounded-full" style={{ backgroundColor: activeColor }} />}
                    </View>
                    <Text style={{ color: !isDark ? activeColor : c.text }} className="text-sm font-semibold">Light</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setMode('dark')}
                    className="flex-row flex-1 items-center gap-2 rounded-xl px-3 py-3.5"
                    style={{ backgroundColor: isDark ? activeColor + '12' : 'transparent' }}
                  >
                    <Ionicons name="moon" size={20} color={isDark ? activeColor : c.text} />
                    <View
                      className="w-5 h-5 rounded-full border-2 items-center justify-center"
                      style={{ borderColor: isDark ? activeColor : c.muted }}
                    >
                      {isDark && <View className="w-3 h-3 rounded-full" style={{ backgroundColor: activeColor }} />}
                    </View>
                    <Text style={{ color: isDark ? activeColor : c.text }} className="text-sm font-semibold">Dark</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
