import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionTask, NewActionPayload } from '../types/action.types';


const ACTIONS_STORAGE_KEY = '@app_actions';

// Predefined mock suggestions
const PREDEFINED_SUGGESTIONS: Omit<ActionTask, 'id' | 'createdAt' | 'isCompleted'>[] = [
  { title: 'Leave a sweet sticky note', category: 'words', isCustom: false },
  { title: 'Buy their favorite snack', category: 'gift', isCustom: false },
  { title: 'Give a 10-minute massage', category: 'service', isCustom: false },
  { title: 'Plan a surprise date night', category: 'time', isCustom: false },
  { title: 'Cook their favorite meal', category: 'service', isCustom: false },
  { title: 'Send an unexpected compliment text', category: 'words', isCustom: false },
];

export const actionService = {
  async getActions(): Promise<ActionTask[]> {
    try {
      const data = await AsyncStorage.getItem(ACTIONS_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as ActionTask[];
    } catch (error) {
      console.error('Error fetching actions from storage:', error);
      return [];
    }
  },

  async saveActions(actions: ActionTask[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));
    } catch (error) {
      console.error('Error saving actions to storage:', error);
      throw error;
    }
  },

  async addCustomAction(payload: Omit<NewActionPayload, 'isCustom'>): Promise<ActionTask> {
    const actions = await this.getActions();
    const newAction: ActionTask = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      ...payload,
      isCustom: true,
      isCompleted: true, // Custom actions are immediately completed by definition
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    await this.saveActions([newAction, ...actions]);
    return newAction;
  },

  async markAsCompleted(id: string): Promise<ActionTask | null> {
    const actions = await this.getActions();
    const index = actions.findIndex((a) => a.id === id);
    if (index === -1) return null;

    actions[index].isCompleted = true;
    actions[index].completedAt = new Date().toISOString();
    await this.saveActions(actions);
    return actions[index];
  },

  async refreshSuggestions(): Promise<ActionTask[]> {
    const actions = await this.getActions();
    
    // Keep completed tasks (both custom and suggested)
    const completedTasks = actions.filter((a) => a.isCompleted);
    
    // Generate new uncompleted suggestions (up to 4)
    // In a real app, this would hit the backend
    const shuffled = [...PREDEFINED_SUGGESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    const newSuggestions: ActionTask[] = selected.map((s) => ({
      ...s,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    }));

    const finalActions = [...completedTasks, ...newSuggestions];
    await this.saveActions(finalActions);
    return finalActions;
  },
  
  async clearAllActions(): Promise<void> {
    await AsyncStorage.removeItem(ACTIONS_STORAGE_KEY);
  }
};
