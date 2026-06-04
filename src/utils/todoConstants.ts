import { TodoCategory, TodoPriority } from '../types';

export const TODO_CATEGORY_META: Record<
  TodoCategory,
  { label: string; emoji: string }
> = {
  [TodoCategory.Connection]: { label: 'Connection', emoji: '💞' },
  [TodoCategory.Date]: { label: 'Date', emoji: '🌹' },
  [TodoCategory.Gift]: { label: 'Gift', emoji: '🎁' },
  [TodoCategory.Communication]: { label: 'Talk', emoji: '💬' },
  [TodoCategory.Other]: { label: 'Other', emoji: '✨' },
};

export const TODO_PRIORITY_META: Record<
  TodoPriority,
  { label: string; colorKey: 'success' | 'warning' | 'error' }
> = {
  [TodoPriority.LOW]: { label: 'Low', colorKey: 'success' },
  [TodoPriority.MEDIUM]: { label: 'Medium', colorKey: 'warning' },
  [TodoPriority.HIGH]: { label: 'High', colorKey: 'error' },
};

export const TODO_FILTERS = [
  { id: 'all' as const, label: 'All' },
  { id: 'active' as const, label: 'Active' },
  { id: 'completed' as const, label: 'Done' },
];
