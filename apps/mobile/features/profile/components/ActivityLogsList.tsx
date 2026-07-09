import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { userApi } from '@/api/services/user.api';
import { useApi } from '@/hooks/useApi';
import { ActivityLogCard, type ActivityLog } from './ActivityLogCard';
import { Ionicons } from '@expo/vector-icons';

export function ActivityLogsList() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const { authClient } = useApi();
  
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = useCallback(async (pageIndex: number) => {
    try {
      setIsLoading(true);
      const limit = 10;
      const offset = pageIndex * limit;
      const response = await userApi.getUserLogs(authClient, limit, offset);
      
      const newLogs = response.data?.data || [];
      if (newLogs.length < limit) {
        setHasMore(false);
      }
      
      if (pageIndex === 0) {
        setLogs(newLogs);
      } else {
        setLogs((prev) => [...prev, ...newLogs]);
      }
    } catch (e) {
      console.error('Failed to fetch activity logs', e);
    } finally {
      setIsLoading(false);
    }
  }, [authClient]);

  useEffect(() => {
    fetchLogs(0);
  }, [fetchLogs]);

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLogs(nextPage);
    }
  }, [isLoading, hasMore, page, fetchLogs]);

  if (logs.length === 0 && !isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: c.background }}>
        <Ionicons name="time-outline" size={48} color={c.muted} style={{ marginBottom: 16 }} />
        <Text style={{ color: c.text }} className="text-lg font-bold text-center">No Activity Yet</Text>
        <Text style={{ color: c.muted }} className="text-sm text-center mt-2">Your activity logs will appear here once you make changes to your profile.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityLogCard log={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color={c.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
}
