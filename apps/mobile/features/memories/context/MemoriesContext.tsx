import { createContext, useCallback, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { Memory, NewMemoryPayload } from '@/features/memories/types/memory.types';
import * as memoryService from '@/features/memories/utils/memoryService';
import { SEED_MEMORIES } from '@/features/memories/data/seed';

interface MemoriesContextValue {
  memories: Memory[];
  loading: boolean;
  addMemory: (payload: NewMemoryPayload) => Promise<void>;
  updateMemory: (id: string, updates: Partial<NewMemoryPayload>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const MemoriesContext = createContext<MemoriesContextValue>({
  memories: [],
  loading: true,
  addMemory: async () => {},
  updateMemory: async () => {},
  deleteMemory: async () => {},
  refresh: async () => {},
});

export function MemoriesProvider({ children }: { children: ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const data = await memoryService.loadMemories();
      if (mountedRef.current) {
        setMemories(data.length > 0 ? data : SEED_MEMORIES);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();
    return () => {
      mountedRef.current = false;
    };
  }, [refresh]);

  const addMemory = useCallback(async (payload: NewMemoryPayload) => {
    const updated = await memoryService.saveMemory(payload);
    setMemories(updated);
  }, []);

  const updateMemory = useCallback(async (id: string, updates: Partial<NewMemoryPayload>) => {
    const updated = await memoryService.updateMemory(id, updates);
    setMemories(updated);
  }, []);

  const deleteMemory = useCallback(async (id: string) => {
    const updated = await memoryService.deleteMemory(id);
    setMemories(updated);
  }, []);

  return (
    <MemoriesContext.Provider value={{ memories, loading, addMemory, updateMemory, deleteMemory, refresh }}>
      {children}
    </MemoriesContext.Provider>
  );
}
