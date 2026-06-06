import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/lib/theme';

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

export default function RelationshipQuestionsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const c = colors(isDark);
  const infoColor = isDark ? '#60a5fa' : '#3b82f6';
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const allAnswered = questions.every((q) => answers[q.key]);

  const handleSelect = (questionKey: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: option }));
  };

  const handleFinish = async () => {
    if (!allAnswered) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch {
    }
    router.replace('/(tabs)');
  };

  function renderQuestion(question: Question) {
    const selected = answers[question.key];

    return (
      <View
        key={question.key}
        style={{ backgroundColor: c.card, borderColor: c.border }}
        className="mb-4 rounded-2xl border p-5"
      >
        <Text style={{ color: c.text }} className="mb-3 text-base font-bold leading-5">
          {t(`questions.${question.key}`)}
        </Text>
        <View className="gap-2.5">
          {question.options.map((option) => {
            const isSelected = selected === option;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => handleSelect(question.key, option)}
                style={{
                  borderColor: isSelected ? infoColor : c.border,
                  backgroundColor: isSelected ? infoColor + '12' : c.surface,
                }}
                className="rounded-xl border px-4 py-3.5"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{
                      borderColor: isSelected ? infoColor : c.muted,
                      backgroundColor: isSelected ? infoColor : 'transparent',
                    }}
                    className="h-5 w-5 items-center justify-center rounded-full border-2"
                  >
                    {isSelected ? (
                      <View className="h-2 w-2 rounded-full bg-white" />
                    ) : null}
                  </View>
                  <Text
                    style={{ color: isSelected ? infoColor : c.text }}
                    className={`flex-1 text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}
                  >
                    {t(`questions.${option}`)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="grow pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-8">
            <Text style={{ color: c.text }} className="mb-1 text-3xl font-extrabold tracking-tight">
              {t('questions.title')}
            </Text>
            <Text style={{ color: c.muted }} className="mb-6 text-sm leading-5">
              {t('questions.subtitle')}
            </Text>

            {questions.map((q) => renderQuestion(q))}

            <Pressable
              accessibilityRole="button"
              onPress={handleFinish}
              disabled={loading || !allAnswered}
              style={{
                backgroundColor: infoColor,
                opacity: loading || !allAnswered ? 0.5 : 1,
              }}
              className="mt-2 min-h-[54px] items-center justify-center rounded-xl"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-extrabold tracking-wide text-white">
                  {t('common.done')}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
