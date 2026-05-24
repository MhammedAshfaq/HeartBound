import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  setCredentials,
  logout as logoutAction,
  setLoading,
  setError,
  clearError,
  updateUser,
  setOnboardingComplete,
} from '@store/slices/authSlice';
import { Gender, User } from '../types';
import { persistor } from '@store/index';
import { resetQuiz } from '@store/slices/quizSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, token, loading, error, onboardingComplete } = useAppSelector(
    (state) => state.auth
  );

  const SEED_OTP = '987654';

  const loginWithOTP = useCallback(
    async (phone: string, otp: string) => {
      try {
        dispatch(setLoading(true));

        if (otp !== SEED_OTP) {
          throw new Error('Invalid OTP');
        }

        const mockUser: User = {
          id: 'mock-user-id',
          phone,
          name: '',
          age: 0,
          gender: Gender.OTHER,
        };

        const mockToken = 'seed-auth-token';

        dispatch(setCredentials({ user: mockUser, token: mockToken }));
        dispatch(setLoading(false));
        return { user: mockUser, token: mockToken, isNewUser: true };
      } catch (err: any) {
        dispatch(setError(err.message || 'OTP verification failed'));
        throw err;
      }
    },
    [dispatch]
  );

  const sendOTP = useCallback(
    async (phone: string) => {
      try {
        dispatch(setLoading(true));
        await new Promise(resolve => setTimeout(resolve, 300));
        dispatch(setLoading(false));
        return { success: true };
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to send OTP'));
        throw err;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    dispatch(logoutAction());
    dispatch(resetQuiz());
    await persistor.purge();
  }, [dispatch]);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      try {
        dispatch(updateUser(updates));
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to update profile'));
        throw err;
      }
    },
    [dispatch]
  );

  const completeOnboarding = useCallback(() => {
    dispatch(setOnboardingComplete(true));
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    onboardingComplete,
    loginWithOTP,
    sendOTP,
    logout,
    updateProfile,
    completeOnboarding,
    clearAuthError,
  };
};
