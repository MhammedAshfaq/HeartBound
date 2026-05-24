import apiService from './api';
import { User } from '../types';
import { generateInviteCode } from '../utils/helpers';

class PartnerService {
  async generateInviteCode(): Promise<string> {
    const code = generateInviteCode();
    await apiService.post('/partners/invite', { code });
    return code;
  }
  
  async sendInvite(userId: string): Promise<{ success: boolean }> {
    return apiService.post('/partners/invite', { userId });
  }
  
  async acceptInvite(code: string): Promise<{ success: boolean; partner: User }> {
    return apiService.post('/partners/accept', { code });
  }
  
  async getPartner(): Promise<User | null> {
    return apiService.get<User | null>('/partners/current');
  }
  
  async enableSync(): Promise<{ success: boolean }> {
    return apiService.post('/partners/sync/enable');
  }
  
  async disableSync(): Promise<{ success: boolean }> {
    return apiService.post('/partners/sync/disable');
  }
  
  async getSyncStatus(): Promise<{ syncEnabled: boolean; sharedInsights: boolean }> {
    return apiService.get('/partners/sync/status');
  }
  
  async removePartner(): Promise<{ success: boolean }> {
    return apiService.delete('/partners');
  }
}

export const partnerService = new PartnerService();
export default partnerService;
