import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { colors, spacing, borderRadius } from '@/lib/theme';
import { Images } from '@/constants/Images';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const c = colors(isDark);

  const handleNext = useCallback(() => {
    router.push('/(auth)/login');
  }, [router]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: c.card, borderColor: c.border }]}>
            <Image
              source={Images.logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: c.text }]}>
            {t('onboarding.title')}
          </Text>
          <Text style={[styles.subtitle, { color: c.muted }]}>
            {t('onboarding.subtitle')}
          </Text>
        </View>

        {/* Feature Cards Section */}
        <View style={styles.featuresContainer}>
          {/* Card 1: Smart Suggestions */}
          <View style={[styles.featureCard, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="sparkles" size={24} color="#f43f5e" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: c.text }]}>
                {t('onboarding.card1Title')}
              </Text>
              <Text style={[styles.featureDescription, { color: c.muted }]}>
                {t('onboarding.card1Desc')}
              </Text>
            </View>
          </View>

          {/* Card 2: Cherished Memories */}
          <View style={[styles.featureCard, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="heart" size={24} color="#3b82f6" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: c.text }]}>
                {t('onboarding.card2Title')}
              </Text>
              <Text style={[styles.featureDescription, { color: c.muted }]}>
                {t('onboarding.card2Desc')}
              </Text>
            </View>
          </View>

          {/* Card 3: Relationship Health */}
          <View style={[styles.featureCard, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="analytics" size={24} color="#a855f7" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: c.text }]}>
                {t('onboarding.card3Title')}
              </Text>
              <Text style={[styles.featureDescription, { color: c.muted }]}>
                {t('onboarding.card3Desc')}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button Section */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: c.primary }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t('onboarding.getStarted')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontFamily: 'jakarta-bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'jakarta-regular',
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'jakarta-semibold',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: 'jakarta-regular',
    lineHeight: 18,
  },
  footer: {
    marginTop: spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'jakarta-semibold',
  },
  buttonIcon: {
    marginLeft: spacing.xs,
  },
});
