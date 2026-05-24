import { formatDistance, format, differenceInDays } from 'date-fns';
import { MoodType, AppError, ErrorType } from '../types';
import { MOOD_EMOJIS } from './constants';

export const formatDate = (date: Date, formatStr = 'MMM dd, yyyy'): string => {
  return format(date, formatStr);
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistance(date, new Date(), { addSuffix: true });
};

export const daysUntilAnniversary = (anniversary: Date): number => {
  const now = new Date();
  const nextAnniversary = new Date(
    now.getFullYear(),
    anniversary.getMonth(),
    anniversary.getDate()
  );
  
  if (nextAnniversary < now) {
    nextAnniversary.setFullYear(now.getFullYear() + 1);
  }
  
  return differenceInDays(nextAnniversary, now);
};

export const getMoodEmoji = (mood: MoodType): string => {
  return MOOD_EMOJIS[mood] || '😐';
};

export const calculateStreak = (dates: Date[]): number => {
  if (dates.length === 0) return 0;
  
  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = differenceInDays(sortedDates[i], sortedDates[i + 1]);
    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }
  
  return streak;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
