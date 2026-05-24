import apiService from './api';
import { User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface PhoneCredentials {
  phone: string;
}

interface OTPVerification {
  phone: string;
  otp: string;
}

interface AuthResponse {
  user: User;
  token: string;
  isNewUser: boolean;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  }
  
  async sendOTP(credentials: PhoneCredentials): Promise<{ success: boolean }> {
    return apiService.post<{ success: boolean }>('/auth/send-otp', credentials);
  }
  
  async verifyOTP(verification: OTPVerification): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/verify-otp', verification);
  }
  
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/google', { idToken });
  }
  
  async loginWithApple(identityToken: string): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/apple', { identityToken });
  }
  
  async loginWithFacebook(accessToken: string): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/facebook', { accessToken });
  }
  
  async logout(): Promise<void> {
    return apiService.post('/auth/logout');
  }
  
  async refreshToken(): Promise<{ token: string }> {
    return apiService.post<{ token: string }>('/auth/refresh-token');
  }
  
  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  }
}

export const authService = new AuthService();
export default authService;
