import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  setCurrentSuggestion,
  acceptSuggestion as acceptAction,
  completeSuggestion as completeAction,
  skipSuggestion as skipAction,
  setLoading,
} from '@store/slices/suggestionSlice';
import { suggestionService } from '@services/suggestionService';
import { DayType, MoodType, SuggestionType } from '../types';

export const useSuggestions = () => {
  const dispatch = useAppDispatch();
  const { current, history, accepted, completed, loading } = useAppSelector(
    (state) => state.suggestion
  );

  const fetchDailySuggestion = useCallback(
    async (mood: MoodType, dayType: DayType) => {
      try {
        dispatch(setLoading(true));
        const suggestion = await suggestionService.getDailySuggestion({
          userBehavior: {},
          mood,
          dayType,
        });
        dispatch(setCurrentSuggestion(suggestion));
        return suggestion;
      } catch (err: any) {
        throw err;
      }
    },
    [dispatch]
  );

  const fetchSuggestionsByType = useCallback(
    async (type: SuggestionType) => {
      try {
        const suggestions = await suggestionService.getSuggestionsByType(type);
        return suggestions;
      } catch (err: any) {
        throw err;
      }
    },
    []
  );

  const acceptSuggestion = useCallback(
    async (suggestionId: string) => {
      try {
        await suggestionService.acceptSuggestion(suggestionId);
        dispatch(acceptAction(suggestionId));
      } catch (err: any) {
        throw err;
      }
    },
    [dispatch]
  );

  const completeSuggestion = useCallback(
    async (suggestionId: string) => {
      try {
        await suggestionService.markComplete(suggestionId);
        dispatch(completeAction(suggestionId));
      } catch (err: any) {
        throw err;
      }
    },
    [dispatch]
  );

  const skipSuggestion = useCallback(
    async (suggestionId: string) => {
      try {
        await suggestionService.skipSuggestion(suggestionId);
        dispatch(skipAction());
      } catch (err: any) {
        throw err;
      }
    },
    [dispatch]
  );

  return {
    current,
    history,
    accepted,
    completed,
    loading,
    fetchDailySuggestion,
    fetchSuggestionsByType,
    acceptSuggestion,
    completeSuggestion,
    skipSuggestion,
  };
};
