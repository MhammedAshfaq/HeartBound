import { AxiosInstance } from 'axios';
import { API_ENDPOINTS } from '../endpoints';
import { CountriesApiResponse } from '@/types/common.types';

export const commonApi = {
  getCountries: async (client: AxiosInstance): Promise<CountriesApiResponse> => {
    const response = await client.get<CountriesApiResponse>(API_ENDPOINTS.COUNTRIES);
    return response.data;
  },
};
