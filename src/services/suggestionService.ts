import apiService from './api';
import { Suggestion, SuggestionType, DayType, MoodType } from '../types';

interface SuggestionInput {
  userBehavior: any;
  mood: MoodType;
  dayType: DayType;
}

class SuggestionService {
  async getDailySuggestion(input: SuggestionInput): Promise<Suggestion> {
    return apiService.post<Suggestion>('/suggestions/daily', input);
  }
  
  async getSuggestionsByType(type: SuggestionType): Promise<Suggestion[]> {
    return apiService.get<Suggestion[]>(`/suggestions?type=${type}`);
  }
  
  async acceptSuggestion(suggestionId: string): Promise<{ success: boolean }> {
    return apiService.post(`/suggestions/${suggestionId}/accept`);
  }
  
  async skipSuggestion(suggestionId: string): Promise<{ success: boolean }> {
    return apiService.post(`/suggestions/${suggestionId}/skip`);
  }
  
  async markComplete(suggestionId: string): Promise<{ success: boolean }> {
    return apiService.post(`/suggestions/${suggestionId}/complete`);
  }
  
  async getSuggestionHistory(): Promise<Suggestion[]> {
    return apiService.get<Suggestion[]>('/suggestions/history');
  }
}

export const suggestionService = new SuggestionService();
export default suggestionService;
