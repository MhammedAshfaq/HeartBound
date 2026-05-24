import apiService from './api';
import { MoodType, MoodEntry, MoodTrend } from '../types';

class MoodService {
  async logMood(mood: MoodType, note?: string): Promise<MoodEntry> {
    return apiService.post<MoodEntry>('/mood', { mood, note });
  }
  
  async getMoodHistory(days?: number): Promise<MoodEntry[]> {
    const query = days ? `?days=${days}` : '';
    return apiService.get<MoodEntry[]>(`/mood/history${query}`);
  }
  
  async getMoodTrends(period: 'week' | 'month' | 'year'): Promise<MoodTrend[]> {
    return apiService.get<MoodTrend[]>(`/mood/trends?period=${period}`);
  }
  
  async getCurrentMood(): Promise<MoodEntry | null> {
    return apiService.get<MoodEntry | null>('/mood/current');
  }
}

export const moodService = new MoodService();
export default moodService;
