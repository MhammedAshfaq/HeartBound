import React, { createContext, useContext, useCallback } from 'react';
import { useSession, type Session } from './SessionContext';
import { SEED_INSIGHTS } from '@/features/profile/data/insights';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Session['user'];
  sendOTP: (phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'apple' | 'facebook', token: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  updateProfile: (profile: {
    name: string;
    dateOfBirth: string;
    gender?: string;
    nickname?: string;
    relationshipStatus?: string;
    partnerId?: string;
    partnerName?: string;
    anniversaryDate?: string;
    partnerDob?: string;
    partnerEmail?: string;
    partnerCode?: string;
    avatar?: string;
    email?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, setSession, signOut } = useSession();

  const sendOTP = useCallback(async (_phone: string) => {
    // MVP: No backend
  }, []);

  const login = useCallback(async (_email: string, _password: string) => {
    // MVP: No backend - mock login
    await setSession({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { id: '1', email: _email, name: 'User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', insights: SEED_INSIGHTS },
    });
  }, [setSession]);

  const loginWithOAuth = useCallback(async (provider: 'google' | 'apple' | 'facebook', _token: string) => {
    // MVP: No backend - mock OAuth
    await setSession({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { id: '1', email: `${provider}@example.com`, name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', insights: SEED_INSIGHTS },
    });
  }, [setSession]);

  const verifyOTP = useCallback(async (_phone: string, _otp: string) => {
    // MVP: No backend - mock OTP verification
    await setSession({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { id: '1', email: `${_phone}@example.com`, name: 'User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', insights: SEED_INSIGHTS },
    });
  }, [setSession]);

  const updateProfile = useCallback(async (profile: {
    name: string;
    dateOfBirth: string;
    gender?: string;
    nickname?: string;
    relationshipStatus?: string;
    partnerId?: string;
    partnerName?: string;
    anniversaryDate?: string;
    partnerDob?: string;
    partnerEmail?: string;
    partnerCode?: string;
    avatar?: string;
    email?: string;
  }) => {
    if (!session?.user) {
      throw new Error('No active session');
    }

    await setSession({
      ...session,
      user: {
        ...session.user,
        email: profile.email ?? session.user.email,
        name: profile.name,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        nickname: profile.nickname,
        relationshipStatus: profile.relationshipStatus,
        partnerId: profile.partnerId,
        partnerName: profile.partnerName,
        anniversaryDate: profile.anniversaryDate,
        partnerDob: profile.partnerDob,
        partnerEmail: profile.partnerEmail,
        partnerCode: profile.partnerCode,
        avatar: profile.avatar ?? session.user.avatar,
      },
    });
  }, [session, setSession]);

  const logout = useCallback(async () => {
    // MVP: No backend
    await signOut();
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session?.accessToken,
        user: session?.user ?? null,
        sendOTP,
        login,
        loginWithOAuth,
        verifyOTP,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
