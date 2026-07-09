import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { SEED_INSIGHTS } from '@/features/profile/data/insights';
import { queryClient } from '@/components/QueryClientWithToken';

export interface InsightItem {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
    phone?: string | null;
    country?: string | null;
    avatar?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    nickname?: string | null;
    relationshipStatus?: string | null;
    partnerId?: string | null;
    partnerName?: string | null;
    anniversaryDate?: string | null;
    partnerDob?: string | null;
    partnerEmail?: string | null;
    partnerCode?: string | null;
    profileCompleter?: boolean;
    insights?: InsightItem[];
  } | null;
}

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'session_accessToken';
const REFRESH_TOKEN_KEY = 'session_refreshToken';
const USER_KEY = 'session_user';

/**
 * Strips the `insights` field before persisting to SecureStore.
 * `insights` is static seed data (~2.5 KB) that pushes the stored value
 * over SecureStore's 2048-byte limit. It is always re-attached from the
 * in-memory constant on read, so nothing is lost.
 */
function stripInsights(
  user: NonNullable<Session['user']>,
): Omit<NonNullable<Session['user']>, 'insights'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { insights: _omit, ...rest } = user;
  return rest;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        const userStr = await SecureStore.getItemAsync(USER_KEY);
        if (accessToken && refreshToken) {
          const storedUser = userStr ? JSON.parse(userStr) : null;
          // Re-attach insights from constant — never persisted to SecureStore
          const user = storedUser ? { ...storedUser, insights: SEED_INSIGHTS } : null;
          setSessionState({ accessToken, refreshToken, user });
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setSession = useCallback(async (newSession: Session | null) => {
    setSessionState(newSession);
    if (newSession) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newSession.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newSession.refreshToken);
      if (newSession.user) {
        // Strip insights before storing — keeps payload well under the 2048-byte limit
        const userToStore = stripInsights(newSession.user);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userToStore));
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      queryClient.clear();
    } catch (e) {
      console.warn('[AUTH] Failed to clear query client cache:', e);
    }
    await setSession(null);
  }, [setSession]);

  return (
    <SessionContext.Provider value={{ session, isLoading, setSession, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
}
