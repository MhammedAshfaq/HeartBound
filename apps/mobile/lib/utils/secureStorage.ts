import * as SecureStore from 'expo-secure-store';
import { logError } from './logError';

export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    logError(error, 'SecureStore.set');
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    logError(error, 'SecureStore.get');
    return null;
  }
}

export async function removeSecureItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    logError(error, 'SecureStore.delete');
  }
}
