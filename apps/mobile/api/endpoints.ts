export const API_ENDPOINTS = {
  COUNTRIES: '/v1/countries',
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    SEND_OTP: '/v1/auth/send-otp',
    VERIFY_OTP: '/v1/auth/verify-otp',
  },
  USERS: {
    UPDATE: (userId: string) => `/v1/users/${userId}`,
  },
  PROFILE: {
    STATS: '/v1/profile/stats',
  },
  FEELINGS: {
    BASE: '/v1/feelings',
    TODAY: '/v1/feelings/today',
  },
} as const;
