import { MemoryFeeling } from '@/constants/Enums';

export interface Memory {
  id: string;
  mediaUri: string;
  mediaType: 'image' | 'video';
  title: string;
  description: string;
  date: string;
  location: string;
  feeling: MemoryFeeling | null;
  isPrivate: boolean;
  createdAt: string;
}

export type NewMemoryPayload = {
  mediaUri: string;
  mediaType: 'image' | 'video';
  title: string;
  description: string;
  date: string;
  location: string;
  feeling: MemoryFeeling | null;
  isPrivate: boolean;
};

export type UpdateMemoryPayload = Partial<NewMemoryPayload>;

export type MoodOption = {
  value: MemoryFeeling;
  labelKey: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
};
