import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, shadows } from '@/lib/theme';

type RelationshipValue = 'single' | 'inRelationship' | 'married' | 'engaged';

const RELATIONSHIP_OPTIONS: { value: RelationshipValue; labelKey: string }[] = [
  { value: 'single', labelKey: 'auth.statusSingle' },
  { value: 'inRelationship', labelKey: 'auth.statusInRelationship' },
  { value: 'married', labelKey: 'auth.statusMarried' },
  { value: 'engaged', labelKey: 'auth.statusEngaged' },
];

export default function RelationshipStatusScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const router = useRouter();
  const toast = useToast();
  const { user, updateProfile } = useAuth();

  const [selected, setSelected] = useState<RelationshipValue | ''>(
    (user?.relationshipStatus as RelationshipValue) ?? '',
  );
  const [saving, setSaving] = useState(false);

  const currentStatus = (user?.relationshipStatus as RelationshipValue) ?? '';

  const getLabel = (value: RelationshipValue) => {
    const option = RELATIONSHIP_OPTIONS.find((o) => o.value === value);
    return option ? t(option.labelKey as any) : value;
  };

  const handleConfirm = useCallback(async () => {
    if (!selected || selected === currentStatus) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      await updateProfile({
        name: user?.name ?? '',
        dateOfBirth: user?.dateOfBirth ?? '',
        relationshipStatus: selected,
      });
      toast.success({ title: 'Relationship status updated' });
      router.back();
    } catch {
      toast.error({ title: 'Failed to update status' });
    } finally {
      setSaving(false);
    }
  }, [selected, currentStatus, user, updateProfile, router, toast]);

  const handlePress = useCallback((value: RelationshipValue) => {
    if (value === currentStatus) return;
    setSelected(value);
  }, [currentStatus]);

  const handleUpdate = useCallback(() => {
    if (!selected || selected === currentStatus) return;
    Alert.alert(
      'Update Relationship Status',
      `Are you sure you want to change your status to "${getLabel(selected)}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: handleConfirm },
      ],
    );
  }, [selected, currentStatus, handleConfirm, getLabel]);

  const hasChanges = selected !== '' && selected !== currentStatus;

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <View className="flex-row items-center justify-between px-4" style={{ marginTop: 20 }}>
        <Pressable onPress={() => router.back()} className="py-3">
          <Ionicons name="close" size={24} color={c.text} />
        </Pressable>
        <Text className="text-lg font-bold" style={{ color: c.text }}>Relationship Status</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      >
        <View className="items-center pt-8 pb-6">
          <View className="h-16 w-16 items-center justify-center rounded-full mb-4" style={{ backgroundColor: c.primary + '18' }}>
            <Ionicons name="heart-outline" size={28} color={c.primary} />
          </View>
          <Text className="text-lg font-bold mb-1" style={{ color: c.text }}>Relationship Status</Text>
          <Text className="text-sm text-center leading-5 px-6" style={{ color: c.muted }}>
            Update your relationship status below
          </Text>
        </View>

        <View className="px-4">
          <View
            className="rounded-xl"
            style={{
              backgroundColor: c.card,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              ...shadows(isDark).sm,
            }}
          >
            <View className="px-5" style={{ paddingVertical: 10 }}>
              <Text className="text-xs font-semibold mb-4 ml-1" style={{ color: c.muted }}>
                Current Status
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {RELATIONSHIP_OPTIONS.map((option) => {
                  const isSelected = selected === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => handlePress(option.value)}
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
        </View>

        <View className="px-4" style={{ marginTop: 40 }}>
          <Pressable
            onPress={handleUpdate}
            disabled={!hasChanges || saving}
            className="rounded-lg items-center w-full"
            style={{
              backgroundColor: hasChanges ? c.primary : c.border,
              paddingVertical: 10,
              opacity: saving ? 0.6 : 1,
            }}
          >
            <Text className="text-base font-bold text-white">
              {saving ? 'Updating...' : 'Update Status'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
