import { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { colors, shadows } from '@/lib/theme';

interface Question {
  key: string;
  options: string[];
}

const questions: Question[] = [
  {
    key: 'q1',
    options: ['less6', '6to1', '1to3', '3to5', 'more5'],
  },
  {
    key: 'q2',
    options: ['affirmation', 'qualityTime', 'gifts', 'actsOfService', 'physicalTouch'],
  },
  {
    key: 'q3',
    options: ['weekly', 'biweekly', 'monthly', 'rarely', 'never'],
  },
  {
    key: 'q4',
    options: ['communication', 'trust', 'sharedInterests', 'mutualRespect', 'emotionalSupport'],
  },
  {
    key: 'q5',
    options: ['travelling', 'cooking', 'movies', 'outdoor', 'talking'],
  },
];

const QUESTION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  q1: 'hourglass-outline',
  q2: 'heart-outline',
  q3: 'wine-outline',
  q4: 'shield-checkmark-outline',
  q5: 'sparkles-outline',
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function RelationshipQuestionsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const infoColor = isDark ? '#60a5fa' : '#3b82f6';
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();

  // Animation values for smooth card transition
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const activeQuestion = questions[currentIndex];
  const selectedOption = answers[activeQuestion.key];
  const allAnswered = questions.every((q) => answers[q.key]);

  const transitionTo = (newIndex: number) => {
    // Slide left and fade out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(newIndex);
      // Reset position to right and slide in
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleSelect = (questionKey: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: option }));
    // Auto-advance with a slight delay so user can see selection feedback
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        transitionTo(currentIndex + 1);
      }, 350);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      transitionTo(currentIndex - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      transitionTo(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!allAnswered) return;
    setLoading(true);
    try {
      // Mark profile as completed in backend — triggers home redirect via auth guard
      await updateProfile({ profileCompleter: true } as any);
      router.replace('/(tabs)');
    } catch (err) {
      console.warn('[MCQ] Failed to mark profile complete:', err);
      // Still navigate even if backend call fails to not block the user
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentIndex + 1) / questions.length;

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Top Header Bar */}
        <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="w-10 h-10 items-center justify-center rounded-full border"
            style={{ borderColor: c.border, backgroundColor: c.card }}
          >
            <Ionicons name="arrow-back" size={20} color={c.text} />
          </Pressable>
          <Text style={{ color: c.text }} className="text-sm font-extrabold">
            {t('questions.title')}
          </Text>
          <Text style={{ color: infoColor }} className="text-sm font-bold">
            {currentIndex + 1} / {questions.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="px-6 py-2">
          <View
            style={{ height: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: 3 }}
            className="overflow-hidden w-full"
          >
            <View
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                backgroundColor: infoColor,
                borderRadius: 3,
              }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerClassName="grow px-6 pt-4 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Subtitle */}
          <Text style={{ color: c.muted }} className="text-xs text-center mb-6 leading-5">
            {t('questions.subtitle')}
          </Text>

          {/* Animated Question Card */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
            className="flex-1"
          >
            <View
              style={{ backgroundColor: c.card, borderColor: c.border, ...s.md }}
              className="rounded-3xl border p-6 mb-6"
            >
              {/* Animated Icon Circle */}
              <View className="items-center mb-4">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center border-2 border-dashed"
                  style={{ borderColor: infoColor + '30', backgroundColor: infoColor + '12' }}
                >
                  <Ionicons name={QUESTION_ICONS[activeQuestion.key]} size={28} color={infoColor} />
                </View>
              </View>

              {/* Question Text */}
              <Text style={{ color: c.text }} className="mb-6 text-lg font-extrabold text-center leading-6 px-2">
                {t(`questions.${activeQuestion.key}`)}
              </Text>

              {/* Options */}
              <View className="gap-3">
                {activeQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => handleSelect(activeQuestion.key, option)}
                      style={{
                        borderColor: isSelected ? infoColor : c.border,
                        backgroundColor: isSelected ? infoColor + '10' : c.surface,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      className="rounded-2xl px-4 py-4"
                    >
                      <View className="flex-row items-center gap-3">
                        {/* Option Letter Badge */}
                        <View
                          style={{
                            borderColor: isSelected ? infoColor : c.border,
                            backgroundColor: isSelected ? infoColor : 'transparent',
                            borderWidth: 1.5,
                          }}
                          className="h-8 w-8 items-center justify-center rounded-full"
                        >
                          <Text
                            style={{
                              color: isSelected ? '#fff' : c.muted,
                              fontSize: 12,
                              fontWeight: '700',
                            }}
                          >
                            {OPTION_LETTERS[idx]}
                          </Text>
                        </View>

                        {/* Option Label */}
                        <Text
                          style={{ color: isSelected ? c.text : c.text }}
                          className={`flex-1 text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}
                        >
                          {t(`questions.${option}`)}
                        </Text>

                        {/* Radio indicator */}
                        <View
                          style={{
                            borderColor: isSelected ? infoColor : c.muted,
                          }}
                          className="h-5 w-5 items-center justify-center rounded-full border-2"
                        >
                          {isSelected ? (
                            <View style={{ backgroundColor: infoColor }} className="h-2.5 w-2.5 rounded-full" />
                          ) : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-4 mt-auto">
            {currentIndex > 0 ? (
              <Pressable
                onPress={handleBack}
                style={{ borderColor: c.border, backgroundColor: c.card }}
                className="flex-1 min-h-[54px] items-center justify-center rounded-2xl border flex-row gap-2"
              >
                <Ionicons name="chevron-back" size={18} color={c.text} />
                <Text style={{ color: c.text }} className="text-sm font-bold">
                  Back
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={handleNext}
              disabled={loading || !selectedOption}
              style={{
                backgroundColor: infoColor,
                opacity: loading || !selectedOption ? 0.5 : 1,
              }}
              className="flex-1 min-h-[54px] items-center justify-center rounded-2xl flex-row gap-2"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-sm font-extrabold tracking-wide text-white">
                    {currentIndex === questions.length - 1 ? t('common.done') : t('common.next')}
                  </Text>
                  {currentIndex !== questions.length - 1 && (
                    <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                  )}
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
