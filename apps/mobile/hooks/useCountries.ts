import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import type { Country } from '@/types/common.types';
import { commonApi } from '@/api/services/common.api';

export function useCountries() {
  const { client } = useApi();

  return useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const data = await commonApi.getCountries(client);
      if (data && data.success) {
        return data.data.map((item) => ({
          code: item.isoCode,
          name: item.name,
          dialCode: item.dialCode,
          flag: item.flagUrl,
        }));
      }
      return [];
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
    gcTime: 24 * 60 * 60 * 1000,
  });
}
