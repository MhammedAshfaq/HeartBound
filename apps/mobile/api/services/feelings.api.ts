import { AxiosInstance } from 'axios';
import { API_ENDPOINTS } from '../endpoints';

export interface Feeling {
  id: string;
  userId: string;
  emoji: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeelingApiResponse {
  success: boolean;
  data: Feeling | null;
}

export interface CreateFeelingPayload {
  emoji: string;
  note?: string;
}

export const feelingsApi = {
  getTodayFeeling: async (client: AxiosInstance): Promise<FeelingApiResponse> => {
    const response = await client.get<FeelingApiResponse>(API_ENDPOINTS.FEELINGS.TODAY);
    return response.data;
  },

  submitFeeling: async (client: AxiosInstance, payload: CreateFeelingPayload): Promise<FeelingApiResponse> => {
    const response = await client.post<FeelingApiResponse>(API_ENDPOINTS.FEELINGS.BASE, payload);
    return response.data;
  },
};
