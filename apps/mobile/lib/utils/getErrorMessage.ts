import axios from 'axios';

/**
 * Extracts a user-friendly error message from an Axios error or standard Error object.
 * Handles NestJS HttpException Filter structured responses as well as offline/server-down states.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // 1. Check if the server responded with an error payload
    const responseData = error.response?.data;
    if (responseData) {
      const apiError = responseData.error;
      if (apiError) {
        if (typeof apiError.message === 'object' && apiError.message !== null) {
          // Standard NestJS HTTP response object: { message: "...", error: "...", statusCode: 404 }
          return apiError.message.message || 'An unexpected error occurred';
        }
        if (typeof apiError.message === 'string') {
          return apiError.message;
        }
      }
      
      // Fallback for general server response message key
      if (typeof responseData.message === 'string') {
        return responseData.message;
      }
    }
    
    // 2. Check if the server was not running, request failed, or there is a network error
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.request || !error.response) {
      return 'No internet connection. Please check your network and try again.';
    }
  }
  
  return error instanceof Error ? error.message : 'An unexpected error occurred';
}
