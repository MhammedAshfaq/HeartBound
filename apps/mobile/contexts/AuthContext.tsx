import React, { createContext, useContext, useCallback } from 'react';
import { NativeModules } from 'react-native';
import { useSession, type Session } from './SessionContext';
import { useApi } from '@/hooks/useApi';
import { SEED_INSIGHTS } from '@/features/profile/data/insights';
import { userApi, type UpdateUserPayload } from '@/api/services/user.api';

let GoogleSignin: any = null;
try {
  const isNativeModuleAvailable = 
    !!NativeModules.RNGoogleSignin || 
    !!(global as any).__turboModuleProxy?.('RNGoogleSignin');

  if (isNativeModuleAvailable) {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_OAUTH_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_IOS_OAUTH_CLIENT_ID,
    });
  } else {
    console.info('[AUTH] Google Sign-In native module is not registered. Native sign-in will not be available in Expo Go (requires a custom native build).');
  }
} catch (e) {
  console.info('[AUTH] Google Sign-In could not be loaded dynamically:', e);
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Session['user'];
  sendOTP: (phone: string, isoCode?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'apple' | 'facebook', token?: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string, isoCode: string) => Promise<void>;
  updateProfile: (profile: UpdateUserPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, setSession, signOut, isLoading } = useSession();
  const { client, authClient } = useApi();

  const sendOTP = useCallback(async (phone: string, isoCode?: string) => {
    await client.post('/v1/auth/otp/send', { phone, isoCode });
  }, [client]);

  const login = useCallback(async (_email: string, _password: string) => {
    // Keep a simple mock login fallback for development if needed
    await setSession({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { id: '1', email: _email, name: 'User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', insights: SEED_INSIGHTS },
    });
  }, [setSession]);

  const loginWithOAuth = useCallback(async (provider: 'google' | 'apple' | 'facebook', token?: string) => {
    let resolvedToken = token;
    console.log("---OAUTH START DETAILS", provider ," token --- " + token)
    if (provider === 'google' && !resolvedToken) {
      console.log("GOOGLE PROVIDER CALLING .......")
      console.log("---- GoogleSignin ---"+ GoogleSignin)
      if (!GoogleSignin) {
        throw new Error('Google Sign-In native module not registered. Please run the app in a custom native build.');
      }

      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      if (response && response.type === 'success') {
        resolvedToken = response.data?.idToken || undefined;
      } else if (response && 'idToken' in response) {
        resolvedToken = (response as any).idToken || undefined;
      } else if (response && 'data' in response && response.data) {
        resolvedToken = (response as any).data?.idToken || undefined;
      }

      if (!resolvedToken) {
        throw new Error('Google Sign-In was not completed or did not return an ID token');
      }
    }

    // Fallback for other mock providers
    if (!resolvedToken) {
      resolvedToken = `${provider}-mock-token`;
    }

    const response = await client.post('/v1/auth/oauth', { provider, token: resolvedToken });
    const { accessToken, refreshToken, user } = response.data.data;
    await setSession({
      accessToken,
      refreshToken,
      user: {
        ...user,
        insights: SEED_INSIGHTS,
      },
    });
  }, [client, setSession]);

  const verifyOTP = useCallback(async (phone: string, otp: string, isoCode: string) => {
    const response = await client.post('/v1/auth/otp/verify', {
      phone,
      code: otp,
      isoCode,
    });
    const { accessToken, refreshToken, user } = response.data.data;
    await setSession({
      accessToken,
      refreshToken,
      user: {
        ...user,
        insights: SEED_INSIGHTS,
      },
    });
  }, [client, setSession]);

  const updateProfile = useCallback(async (profile: UpdateUserPayload) => {
    if (!session?.user?.id) {
      throw new Error('No active session');
    }

    const result = await userApi.updateUser(authClient, session.user.id, profile);
    const updatedUser = result.data?.user ?? {};

    await setSession({
      ...session,
      user: {
        ...session.user,
        ...(updatedUser as Partial<Session['user']>),
        insights: SEED_INSIGHTS,
      },
    });
  }, [session, authClient, setSession]);

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session?.accessToken,
        isLoading,
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
