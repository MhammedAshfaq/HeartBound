import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  setCurrentMood,
  addMoodEntry,
  setMoodHistory,
  setMoodTrends,
} from '@store/slices/moodSlice';
import { moodService } from '@services/moodService';
import { MoodType } from '../types';

export const useMood = () => {
  const dispatch = useAppDispatch();
  const { current, history, trends } = useAppSelector((state) => state.mood);

  const logMood = useCallback(
    async (mood: MoodType, note?: string) => {
      try {
        const entry = await moodService.logMood(mood, note);
        dispatch(addMoodEntry(entry));
        dispatch(setCurrentMood(mood));
        return entry;
      } catch (err: any) {
        throw err;
      }
    },
    [dispatch]
  );

  const fetchMoodHistory = useCallback(
    async (days?: number) => {
      try {
        const history = await moodService.getMoodHistory(days);
        dispatch(setMoodHistory(history));
        return history;
      } catch (err: any) {
        throw err;
      }
    },
    [dispatch]
  );

  const fetchMoodTrends = useCallback(
    async (period: 'week' | 'month' | 'year') => {
      try {
        const trends = await moodService.getMoodTrends(period);
        dispatch(setMoodTrends(trends));
        return trends;
      } catch (err: any) {
        throw err;
      }
    },
    [dispatch]
  );

  return {
    current,
    history,
    trends,
    logMood,
    fetchMoodHistory,
    fetchMoodTrends,
  };
};
