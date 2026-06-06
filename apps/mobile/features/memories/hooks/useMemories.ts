import { useContext } from 'react';
import { MemoriesContext } from '@/features/memories/context/MemoriesContext';

export function useMemories() {
  const context = useContext(MemoriesContext);
  if (!context) {
    throw new Error('useMemories must be used within a MemoriesProvider');
  }
  return context;
}
