import { AxiosInstance } from 'axios';
import { API_ENDPOINTS } from '../endpoints';

export interface UpdateUserPayload {
  email?: string | null;
  name?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  relationshipStatus?: string | null;
  partnerId?: string | null;
  partnerName?: string | null;
  anniversaryDate?: string | null;
  partnerDob?: string | null;
  partnerEmail?: string | null;
  partnerCode?: string | null;
  avatar?: string | null;
  profileCompleter?: boolean;
}

export interface UpdateUserResponse {
  data: {
    user: Record<string, unknown>;
  };
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
};
