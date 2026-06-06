import { getSecureItem, setSecureItem } from '@/lib/utils/secureStorage';
import { Memory, NewMemoryPayload } from '@/features/memories/types/memory.types';

const STORAGE_KEY = 'memories';

export async function loadMemories(): Promise<Memory[]> {
  const data = await getSecureItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveMemory(payload: NewMemoryPayload): Promise<Memory[]> {
  const existing = await loadMemories();
  const memory: Memory = {
    ...payload,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const updated = [memory, ...existing];
  await setSecureItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function updateMemory(id: string, updates: Partial<NewMemoryPayload>): Promise<Memory[]> {
  const existing = await loadMemories();
  const updated = existing.map((m) =>
    m.id === id ? { ...m, ...updates } : m
  );
  await setSecureItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteMemory(id: string): Promise<Memory[]> {
  const existing = await loadMemories();
  const updated = existing.filter((m) => m.id !== id);
  await setSecureItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function createMemoryId(): string {
  return Date.now().toString();
}
