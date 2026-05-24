import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { QuizAnswers } from '../types';
import { setQuizAnswers, completeQuiz, resetQuiz } from '@store/slices/quizSlice';

export const useQuiz = () => {
  const dispatch = useAppDispatch();
  const { answers, isComplete } = useAppSelector((state) => state.quiz);

  const saveAnswers = useCallback(
    (data: QuizAnswers) => {
      dispatch(setQuizAnswers(data));
    },
    [dispatch]
  );

  const finishQuiz = useCallback(() => {
    dispatch(completeQuiz());
  }, [dispatch]);

  const clearQuiz = useCallback(() => {
    dispatch(resetQuiz());
  }, [dispatch]);

  return {
    answers,
    isComplete,
    saveAnswers,
    finishQuiz,
    clearQuiz,
  };
};
