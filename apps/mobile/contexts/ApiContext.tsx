import React, { createContext, useContext, useMemo } from 'react';
import axios, { AxiosInstance } from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { useSession } from './SessionContext';

interface ApiContextType {
  client: AxiosInstance;
  authClient: AxiosInstance;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();

  const apiConfig = useMemo(() => ({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  }), []);

  const client = useMemo(() => {
    const instance = axios.create(apiConfig);
    instance.interceptors.request.use(async (config) => {
      const state = await NetInfo.fetch();
      if (state.isConnected === false) {
        return Promise.reject(new Error('No internet connection. Please check your network and try again.'));
      }
      return config;
    });
    return instance;
  }, [apiConfig]);

  const authClient = useMemo(() => {
    const instance = axios.create(apiConfig);
    
    // Check internet connectivity first
    instance.interceptors.request.use(async (config) => {
      const state = await NetInfo.fetch();
      if (state.isConnected === false) {
        return Promise.reject(new Error('No internet connection. Please check your network and try again.'));
      }
      return config;
    });

    instance.interceptors.request.use((config) => {
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    });
    return instance;
  }, [apiConfig, session]);

  return (
    <ApiContext.Provider value={{ client, authClient }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiClient() {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApiClient must be used within ApiProvider');
  return context;
}
