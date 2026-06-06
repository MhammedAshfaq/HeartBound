import { Mood } from '@/constants/Enums';

export interface MemoryItem {
  id: string;
  mediaUri: string;
  title: string;
  date: string;
  mood: string;
  isFavorite: boolean;
}

export interface Achievement {
  id: string;
  emoji: string;
  label: string;
  earned: boolean;
}

export interface ProfileStats {
  completed: number;
  total: number;
  streak: number;
}

export interface MoodEntry {
  mood: Mood;
  date: string;
}

export enum ActionCategory {
  Communication = 'communication',
  QualityTime = 'quality_time',
  Surprise = 'surprise',
  Adventure = 'adventure',
  Growth = 'growth',
}

export const ACTION_CATEGORY_META: Record<ActionCategory, { emoji: string; label: string }> = {
  [ActionCategory.Communication]: { emoji: '💬', label: 'Communication' },
  [ActionCategory.QualityTime]: { emoji: '❤️', label: 'Quality Time' },
  [ActionCategory.Surprise]: { emoji: '🎉', label: 'Surprise' },
  [ActionCategory.Adventure]: { emoji: '🏔️', label: 'Adventure' },
  [ActionCategory.Growth]: { emoji: '🌱', label: 'Growth' },
};

export type ActionItem = {
  category: ActionCategory;
};

export const MOCK_MEMORIES: MemoryItem[] = [
  { id: '1', mediaUri: '', title: 'Beach Sunset', date: '2025-12-15', mood: 'romantic', isFavorite: true },
  { id: '2', mediaUri: '', title: 'Cooking Together', date: '2026-01-10', mood: 'happy', isFavorite: true },
  { id: '3', mediaUri: '', title: 'Weekend Hike', date: '2026-02-20', mood: 'excited', isFavorite: true },
  { id: '4', mediaUri: '', title: 'Movie Night', date: '2026-03-05', mood: 'happy', isFavorite: false },
  { id: '5', mediaUri: '', title: 'Coffee Date', date: '2026-03-18', mood: 'romantic', isFavorite: true },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: '1', emoji: '🔥', label: '7-Day Streak', earned: true },
  { id: '2', emoji: '💪', label: 'Chat Champ', earned: true },
  { id: '3', emoji: '💝', label: 'Heart Maker', earned: true },
  { id: '4', emoji: '🌙', label: 'Date Master', earned: false },
  { id: '5', emoji: '🎉', label: 'Surprise Guru', earned: false },
  { id: '6', emoji: '💎', label: 'Diamond Bond', earned: false },
];

export const MOCK_MOOD_HISTORY: MoodEntry[] = [
  { mood: Mood.Happy, date: '2026-04-01' },
  { mood: Mood.Excited, date: '2026-04-02' },
  { mood: Mood.Happy, date: '2026-04-03' },
  { mood: Mood.Neutral, date: '2026-04-04' },
  { mood: Mood.Happy, date: '2026-04-05' },
];

export const MOCK_ACTIONS: ActionItem[] = [
  { category: ActionCategory.Communication },
  { category: ActionCategory.Communication },
  { category: ActionCategory.QualityTime },
  { category: ActionCategory.Surprise },
  { category: ActionCategory.Communication },
];
