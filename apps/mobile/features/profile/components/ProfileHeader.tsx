import { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Share,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { colors, shadows } from '@/lib/theme';
import { Badge } from '@/components/ui/Badge';
import type { ProfileBasicInfo } from '@/features/profile/types/profile.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COVER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.34);
const COVER_GRADIENT_HEIGHT = Math.round(COVER_HEIGHT * 0.55);
const CARD_OVERLAP = 56;
const AVATAR_SIZE = 56;
const VERIFIED_BADGE_SIZE = 16;
const PROFILE_CARD_RADIUS = 10;

interface Props {
  profile: ProfileBasicInfo;
  streak: number;
  score: string;
  daysTogether: number;
  onEditProfile?: () => void;
  onAIInsights?: () => void;
}

function StatColumn({
  value,
  label,
  icon,
  iconBg,
}: {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
}) {
  const { isDark } = useTheme();
  const c = colors(isDark);

  return (
    <View className="flex-1 items-center py-3">
      <Text className="text-base font-bold" style={{ color: c.text }}>
        {value}
      </Text>
      <Text className="text-xs mt-0.5" style={{ color: c.muted }}>
        {label}
      </Text>
      <View
        className="items-center justify-center mt-2"
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: iconBg + '18',
        }}
      >
        <Ionicons name={icon} size={14} color={iconBg} />
      </View>
    </View>
  );
}

function VerifiedBadge({ color }: { color: string }) {
  return (
    <View
      className="items-center justify-center rounded-full ml-2"
      style={{
        width: VERIFIED_BADGE_SIZE,
        height: VERIFIED_BADGE_SIZE,
        backgroundColor: color,
      }}
    >
      <Ionicons name="checkmark" size={12} color="#fff" />
    </View>
  );
}

export function ProfileHeader({
  profile,
  streak,
  score,
  daysTogether,
  onEditProfile,
  onAIInsights,
}: Props) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);

  const handleShareProfile = useCallback(async () => {
    try {
      await Share.share({
        message: `${t('profile.shareProfileMessage')} — ${profile.name}`,
      });
    } catch {
      // User dismissed share sheet
    }
  }, [t, profile.name]);

  const handleAIInsights = useCallback(() => {
    onAIInsights?.();
  }, [onAIInsights]);

  // Keep cover and avatar consistent (matches reference design)
  const coverUri = profile.avatar;
  const statusText = profile.relationshipStatus?.trim() || t('profile.notSet');

  return (
    <View>
      {/* Cover background */}
      <View style={{ height: COVER_HEIGHT, width: SCREEN_WIDTH }}>
        <Image
          source={{ uri: coverUri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <View
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}
        />
        <Svg
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: COVER_GRADIENT_HEIGHT,
          }}
          width={SCREEN_WIDTH}
          height={COVER_GRADIENT_HEIGHT}
        >
          <Defs>
            <SvgLinearGradient id="profileCoverGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#000000" stopOpacity="0" />
              <Stop offset="0.5" stopColor="#000000" stopOpacity="0.28" />
              <Stop offset="1" stopColor={c.background} stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={SCREEN_WIDTH}
            height={COVER_GRADIENT_HEIGHT}
            fill="url(#profileCoverGradient)"
          />
        </Svg>
      </View>

      {/* Floating profile card */}
      <View className="px-4" style={{ marginTop: -CARD_OVERLAP }}>
        <View
          style={{
            backgroundColor: c.card,
            borderRadius: PROFILE_CARD_RADIUS,
            ...s.md,
          }}
        >
          <View
            style={{
              borderRadius: PROFILE_CARD_RADIUS,
              overflow: 'hidden',
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
          {/* Avatar + name row */}
          <View className="flex-row items-center">
            <View className="relative">
              <Image
                source={{ uri: profile.avatar }}
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE / 2,
                  backgroundColor: c.border,
                  borderWidth: 2,
                  borderColor: c.primary,
                }}
                resizeMode="cover"
              />
              <View
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
                style={{
                  backgroundColor: c.success,
                  borderColor: c.card,
                }}
              />
            </View>

            <View className="flex-1 ml-5 justify-center">
              <View className="flex-row items-center ml-2">
                <Text
                  className="text-lg font-bold mr-1.5"
                  style={{ color: c.text }}
                  numberOfLines={1}
                >
                  {profile.name}
                </Text>
                {(profile.isVerified ?? true) && <VerifiedBadge color={c.primary} />}
              </View>
              <Badge color={c.primary} className="mt-2 ml-2">
                {statusText}
              </Badge>
            </View>
          </View>

          {/* Stats row */}
          <View className="flex-row mt-4 mb-4">
            <StatColumn
              value={String(streak)}
              label={t('profile.streak')}
              icon="flame"
              iconBg="#f97316"
            />
            <StatColumn
              value={score}
              label={t('profile.score')}
              icon="trophy"
              iconBg="#2563eb"
            />
            <StatColumn
              value={String(daysTogether)}
              label={t('profile.daysTogether')}
              icon="calendar"
              iconBg="#7c3aed"
            />
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3 mt-5">
            <Pressable
              onPress={onEditProfile}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl border"
              style={{ borderColor: c.primary, backgroundColor: c.card }}
            >
              <Ionicons name="create-outline" size={16} color={c.primary} />
              <Text className="text-sm font-semibold ml-2" style={{ color: c.primary }}>
                {t('profile.editProfile')}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAIInsights}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl"
              style={{ backgroundColor: c.primary }}
            >
              <Ionicons name="sparkles-outline" size={16} color="#fff" />
              <Text className="text-sm font-semibold text-white ml-2">
                {t('profile.aiInsights')}
              </Text>
            </Pressable>
          </View>
          </View>
        </View>
      </View>
    </View>
  );
}
