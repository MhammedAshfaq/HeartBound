import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Memory } from '@/features/memories/types/memory.types';
import { MemoryCard } from '@/features/memories/components/MemoryCard';

interface MemoryGridProps {
  memories: Memory[];
  onMemoryPress?: (memory: Memory) => void;
}

export function MemoryGrid({ memories, onMemoryPress }: MemoryGridProps) {
  const renderItem = useCallback(
    ({ item }: { item: Memory }) => (
      <MemoryCard memory={item} onPress={onMemoryPress} />
    ),
    [onMemoryPress]
  );

  return (
    <FlatList
      data={memories}
      numColumns={2}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 12, gap: 12 }}
      columnWrapperStyle={{ gap: 12 }}
      renderItem={renderItem}
    />
  );
}
