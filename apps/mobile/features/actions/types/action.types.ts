export type ActionCategory = 'gift' | 'service' | 'words' | 'time' | 'custom';

export interface ActionTask {
  id: string;
  title: string;
  description?: string;
  category: ActionCategory;
  isCompleted: boolean;
  isCustom: boolean;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export interface NewActionPayload {
  title: string;
  description?: string;
  category: ActionCategory;
  isCustom: boolean;
}
