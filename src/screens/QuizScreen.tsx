import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Button } from '@components/common/Button';
import { useQuiz } from '@hooks/useQuiz';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useScreenLayout } from '@hooks/useScreenLayout';
import { AppTheme } from '@utils/theme';
import { QUIZ_QUESTIONS } from '@utils/constants';
import { QuizAnswers } from '../types';

export const QuizScreen: React.FC = () => {
  const screenLayout = useScreenLayout();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation<any>();
  const { isComplete, saveAnswers, finishQuiz } = useQuiz();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isComplete) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      );
    }
  }, [isComplete]);

  const current = QUIZ_QUESTIONS[step];
  const isLast = step === QUIZ_QUESTIONS.length - 1;
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      const quizData: QuizAnswers = {
        loveExpression: answers.loveExpression || '',
        partnerPreference: answers.partnerPreference || '',
        interactionFrequency: answers.interactionFrequency || '',
        goal: answers.goal || '',
        dailyTime: answers.dailyTime || '',
      };
      saveAnswers(quizData);
      finishQuiz();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      );
    } else {
      setStep((s) => s + 1);
    }
  };

  const selected = answers[current?.id] || null;

  return (
    <SafeAreaView style={screenLayout.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.stepCount}>
            {step + 1} / {QUIZ_QUESTIONS.length}
          </Text>
        </View>

        {current && (
          <>
            <Text style={styles.question}>{current.question}</Text>

            <View style={styles.options}>
              {current.options.map((option) => {
                const isSelected = selected === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionRadio}>
                      {isSelected && <View style={styles.optionRadioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isLast ? 'Complete' : 'Next'}
          onPress={handleNext}
          disabled={!selected}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  stepCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    lineHeight: 30,
  },
  options: {
    gap: theme.spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  optionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  nextButton: {
    height: 52,
  },
  });
