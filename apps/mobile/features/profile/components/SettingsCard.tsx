import { useState, useCallback } from 'react';
import { Alert, View, Text, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { colors, shadows } from '@/lib/theme';
import { ConfirmationModal, ConfirmationModalOption } from '@/components/common/ConfirmationModal';
import { RelationshipStatus } from '@/constants/Enums';

const RELATIONSHIP_OPTIONS: { value: RelationshipStatus; labelKey: string }[] = [
  { value: RelationshipStatus.Single, labelKey: 'auth.statusSingle' },
  { value: RelationshipStatus.Dating, labelKey: 'auth.statusDating' },
  { value: RelationshipStatus.Married, labelKey: 'auth.statusMarried' },
  { value: RelationshipStatus.Engaged, labelKey: 'auth.statusEngaged' },
];

type SettingsRowKey = 'Account' | 'Sync Partner' | 'Relationship' | 'Notifications' | 'Privacy' | 'Activity Log';

const SETTINGS_ROWS: { icon: keyof typeof Ionicons.glyphMap; label: SettingsRowKey; route?: string; expandable?: boolean }[] = [
  { icon: 'person-outline', label: 'Account', route: '/(modals)/email-verification' },
  { icon: 'time-outline', label: 'Activity Log', route: '/(modals)/activity-logs' },
  { icon: 'link-outline', label: 'Sync Partner', expandable: true },
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
  const [expandedRow, setExpandedRow] = useState<SettingsRowKey | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.isNotificationsEnabled ?? false);
  const [partnerCodeInput, setPartnerCodeInput] = useState(user?.partnerCode ?? '');

  const isSingle = user?.relationshipStatus === 'single';
  const settingsRows = isSingle
    ? SETTINGS_ROWS.filter(row => row.label !== 'Sync Partner')
    : SETTINGS_ROWS;

  const handleThemeChange = async (mode: 'light' | 'dark' | 'system') => {
    setMode(mode);
    try {
      await updateProfile({ theme: mode });
    } catch {
      toast.error({ title: 'Failed to save theme setting' });
    }
  };

  const handleNotificationsToggle = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    try {
      await updateProfile({ isNotificationsEnabled: newValue });
    } catch {
      setNotificationsEnabled(!newValue); // revert on error
      toast.error({ title: 'Failed to update notification setting' });
    }
  };
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    message?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    options: ConfirmationModalOption[];
  } | null>(null);
  const activeColor = isDark ? '#60a5fa' : '#3b82f6';

  const isSynced = Boolean(user?.partnerCode);
  const currentStatus = (user?.relationshipStatus as RelationshipStatus) ?? '';

  const getLabel = (value: RelationshipStatus) => {
    const option = RELATIONSHIP_OPTIONS.find((o) => o.value === value);
    return option ? t(option.labelKey as any) : value;
  };

  const handleRelationshipPress = useCallback((value: RelationshipStatus) => {
    if (value === currentStatus) return;
    const label = RELATIONSHIP_OPTIONS.find((o) => o.value === value);
    setModalConfig({
      visible: true,
      title: 'Update Relationship Status',
      message: `Are you sure you want to change your status to "${label ? t(label.labelKey as any) : value}"?`,
      icon: 'heart',
      iconColor: '#ec4899',
      options: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setModalConfig(null)
        },
        {
          text: 'Update',
          onPress: async () => {
            setModalConfig(null);
            await updateProfile({
              name: user?.name ?? '',
              dateOfBirth: user?.dateOfBirth ?? '',
              relationshipStatus: value,
            });
            toast.success({ title: 'Relationship status updated' });
          },
        },
      ],
    });
  }, [currentStatus, user, updateProfile, toast, t]);

  const handleSync = useCallback(() => {
    const code = partnerCodeInput.trim();
    if (!code) {
      toast.error({ title: 'Partner code is required', message: 'Please enter a valid partner code.' });
      return;
    }
    setModalConfig({
      visible: true,
      title: 'Sync Partner',
      message: '⚠️ Please double-check the partner code before syncing. Entering a wrong code will link your account to the wrong person. Are you sure you want to continue?',
      icon: 'link',
      iconColor: activeColor,
      options: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setModalConfig(null)
        },
        {
          text: 'Yes, Sync',
          onPress: async () => {
            setModalConfig(null);
            try {
              await updateProfile({
                name: user?.name ?? '',
                dateOfBirth: user?.dateOfBirth ?? '',
                partnerCode: code,
              });
              toast.success({ title: 'Partner synced!', message: 'You are now connected with your partner.' });
              setExpandedRow(null);
            } catch {
              toast.error({ title: 'Sync failed', message: 'Please try again.' });
            }
          },
        },
      ],
    });
  }, [partnerCodeInput, user, updateProfile, toast, activeColor]);

  const handleUnsync = useCallback(() => {
    setModalConfig({
      visible: true,
      title: 'Unsync Partner',
      message: 'Are you sure you want to disconnect from your partner? This will remove your partner connection.',
      icon: 'unlink',
      iconColor: '#ef4444',
      options: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setModalConfig(null)
        },
        {
          text: 'Unsync',
          style: 'destructive',
          onPress: async () => {
            setModalConfig(null);
            try {
              await updateProfile({
                name: user?.name ?? '',
                dateOfBirth: user?.dateOfBirth ?? '',
                partnerCode: '',
              });
              setPartnerCodeInput('');
              toast.success({ title: 'Unsynced', message: 'Partner connection removed.' });
              setExpandedRow(null);
            } catch {
              toast.error({ title: 'Failed to unsync', message: 'Please try again.' });
            }
          },
        },
      ],
    });
  }, [user, updateProfile, toast]);

  return (
    <View className="mb-5">
      <Text className="text-base font-bold px-1 ml-2" style={{ color: c.text, marginBottom:5}}>
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
        {settingsRows.map((row, index) => (
          <View key={row.label}>
            {/* Separator between rows */}
            {index > 0 && (
              <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', marginHorizontal: 16 }} />
            )}

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
              <Text
                style={{ color: c.text }}
                className="flex-1 text-sm ml-4"
              >
                {row.label === 'Sync Partner' ? t('settings.syncPartner') : row.label}
                {row.label === 'Sync Partner' && isSynced && (
                  <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: '600' }}> ● Synced</Text>
                )}
              </Text>
              <Ionicons
                name={expandedRow === row.label ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={c.muted}
              />
            </Pressable>

            {/* Sync Partner Dropdown */}
            {expandedRow === row.label && row.label === 'Sync Partner' && (
              <View className="px-4 pb-4">
                <View
                  className="rounded-xl p-4"
                  style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }}
                >
                  <Text style={{ color: c.text }} className="text-sm font-bold mb-1">
                    {t('settings.syncPartnerTitle')}
                  </Text>
                  <Text style={{ color: c.muted }} className="text-xs mb-4 leading-4">
                    Enter your partner's unique code to connect your accounts and start sharing memories and insights together.
                  </Text>

                  <TextInput
                    value={partnerCodeInput}
                    onChangeText={setPartnerCodeInput}
                    placeholder={t('settings.enterPartnerCode')}
                    placeholderTextColor={c.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{
                      color: c.text,
                      backgroundColor: c.card,
                      borderColor: c.border,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      fontSize: 14,
                      marginBottom: 12,
                    }}
                  />

                  {/* Sync Button */}
                  <Pressable
                    onPress={handleSync}
                    style={{ backgroundColor: activeColor, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 10 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="link" size={16} color="#fff" />
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                        {t('settings.sync')}
                      </Text>
                    </View>
                  </Pressable>

                  {/* Unsync Button — only visible when already synced */}
                  {isSynced && (
                    <Pressable
                      onPress={handleUnsync}
                      style={{ borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#ef4444' }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="unlink" size={16} color="#ef4444" />
                        <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 14 }}>
                          {t('settings.unsync')}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>
            )}

            {/* Notifications Dropdown */}
            {expandedRow === row.label && row.expandable && row.label === 'Notifications' && (
              <View className="px-4 pb-3">
                <View
                  className="flex-row items-center rounded-xl px-4"
                  style={{ paddingVertical: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }}
                >
                  <Ionicons name="notifications-outline" size={20} color={c.text} />
                  <Text style={{ color: c.text }} className="flex-1 text-sm ml-3">
                    Enable Notifications
                  </Text>
                  <Pressable
                    onPress={handleNotificationsToggle}
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

            {/* Relationship Dropdown */}
            {expandedRow === row.label && row.expandable && row.label === 'Relationship' && (
              <View className="px-4 pb-3">
                <View
                  className="rounded-xl px-4"
                  style={{ paddingVertical: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }}
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

            {/* Privacy / Theme Dropdown */}
            {expandedRow === row.label && row.expandable && row.label === 'Privacy' && (
              <View style={{ marginBottom: 10 }} className="px-4 pb-3">
                <View
                  className="flex-row rounded-xl px-4"
                  style={{ paddingVertical: 8, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }}
                >
                  <Pressable
                    onPress={() => handleThemeChange('light')}
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
                    onPress={() => handleThemeChange('dark')}
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

      {/* Shared Confirmation Modal */}
      {modalConfig && (
        <ConfirmationModal
          visible={modalConfig.visible}
          title={modalConfig.title}
          message={modalConfig.message}
          icon={modalConfig.icon}
          iconColor={modalConfig.iconColor}
          options={modalConfig.options}
          onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        />
      )}
    </View>
  );
}
