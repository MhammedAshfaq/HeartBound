import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from '@/lib/utils/logError';
import { Memory, NewMemoryPayload } from '@/features/memories/types/memory.types';

const STORAGE_KEY = 'memories';

export async function loadMemories(): Promise<Memory[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logError(error, 'memoryService.load');
    return [];
  }
}

export async function saveMemory(payload: NewMemoryPayload): Promise<Memory[]> {
  const existing = await loadMemories();
  const memory: Memory = {
    ...payload,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const updated = [memory, ...existing];
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    logError(error, 'memoryService.save');
  }
  return updated;
}

export async function updateMemory(id: string, updates: Partial<NewMemoryPayload>): Promise<Memory[]> {
  const existing = await loadMemories();
  const updated = existing.map((m) =>
    m.id === id ? { ...m, ...updates } : m
  );
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    logError(error, 'memoryService.update');
  }
  return updated;
}

export async function deleteMemory(id: string): Promise<Memory[]> {
  const existing = await loadMemories();
  const updated = existing.filter((m) => m.id !== id);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    logError(error, 'memoryService.delete');
  }
  return updated;
}

export function createMemoryId(): string {
  return Date.now().toString();
}
