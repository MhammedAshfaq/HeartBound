import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: string;
    nickname?: string;
    relationshipStatus?: string;
    partnerId?: string;
    partnerName?: string;
    anniversaryDate?: string;
    partnerDob?: string;
    partnerCode?: string;
  } | null;
}

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const STORAGE_KEY = process.env.SECURE_STORE_KEY || 'user_session';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        if (stored) {
          setSessionState(JSON.parse(stored));
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
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(newSession));
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
    }
  }, []);

  const signOut = useCallback(async () => {
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
