import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string | Date, pattern = 'MMM dd, yyyy'): string {
  return format(new Date(date), pattern);
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncate(str: string, length = 100): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '...';
}
