import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import type { ProfileStats } from '@/features/profile/types/profile.types';

const PLACEHOLDER_STATS: ProfileStats = { completed: 0, total: 0, streak: 0 };

export function useProfile() {
  const { user } = useAuth();
  const { authClient } = useApi();

  const { data: stats, isLoading } = useQuery<ProfileStats>({
    queryKey: ['profile', 'stats'],
    queryFn: async () => {
      const response = await authClient.get('/v1/profile/stats');
      return response.data;
    },
    placeholderData: PLACEHOLDER_STATS,
    enabled: !!user,
  });

  return {
    user,
    stats: stats ?? PLACEHOLDER_STATS,
    isLoading,
  };
}
