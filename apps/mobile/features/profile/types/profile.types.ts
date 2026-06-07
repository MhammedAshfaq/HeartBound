import { Mood } from '@/constants/Enums';
import type { Session } from '@/contexts/SessionContext';

export interface ProfileData {
  user: Session['user'];
  stats: ProfileStats;
}

export interface PartnerBasic {
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  anniversary: string;
}

export interface ProfileBasicInfo {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  country: string;
  dateOfBirth: string;
  relationshipStatus: string;
  partner: PartnerBasic | null;
}

export const DUMMY_PROFILE: ProfileBasicInfo = {
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  phone: '+1 (555) 123-4567',
  email: 'john.doe@example.com',
  country: 'United States',
  dateOfBirth: '1990-01-15',
  relationshipStatus: 'Married',
  partner: {
    name: 'Jane Doe',
    dateOfBirth: '1992-05-20',
    phone: '+1 (555) 987-6543',
    email: 'jane.doe@example.com',
    anniversary: 'June 15, 2020',
  },
};

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
