import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { feelingsApi, CreateFeelingPayload } from '../api/services/feelings.api';
import { useToast } from './useToast';

export function useTodayFeeling() {
  const { authClient } = useApi();

  return useQuery({
    queryKey: ['feelings', 'today'],
    queryFn: async () => {
      const response = await feelingsApi.getTodayFeeling(authClient);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSubmitFeeling() {
  const { authClient } = useApi();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (payload: CreateFeelingPayload) => {
      const response = await feelingsApi.submitFeeling(authClient, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['feelings', 'today'], data);
      toast.success({ title: 'Feeling submitted successfully!' });
    },
    onError: (error) => {
      toast.error({ title: 'Failed to submit feeling. Please try again.' });
    },
  });
}
