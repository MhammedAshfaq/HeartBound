import { AxiosInstance } from 'axios';
import { API_ENDPOINTS } from '../endpoints';

export interface UpdateUserPayload {
  email?: string | null;
  name?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  relationshipStatus?: string | null;
  partnerName?: string | null;
  anniversaryDate?: string | null;
  partnerDob?: string | null;
  appCode?: string | null;
  partnerCode?: string | null;
  avatar?: string | null;
  theme?: string | null;
  isNotificationsEnabled?: boolean | null;
  profileCompleter?: boolean;
}

export interface UpdateUserResponse {
  data: Record<string, unknown>;
}

export const userApi = {
  updateUser: async (
    authClient: AxiosInstance,
    userId: string,
    payload: UpdateUserPayload,
  ): Promise<UpdateUserResponse> => {
    const response = await authClient.patch<UpdateUserResponse>(
      API_ENDPOINTS.USERS.UPDATE(userId),
      payload,
    );
    return response.data;
  },

  getUserLogs: async (
    authClient: AxiosInstance,
    limit: number = 10,
    offset: number = 0
  ) => {
    const response = await authClient.get(`/v1/users/me/logs?limit=${limit}&offset=${offset}`);
    return response.data;
  }
};
