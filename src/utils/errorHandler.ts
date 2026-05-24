import { AppError, ErrorType } from '../types';

export const handleError = (error: any): AppError => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';
    
    if (status === 401) {
      return {
        type: ErrorType.AUTH,
        message: 'Authentication failed. Please login again.',
        code: status,
      };
    }
    
    if (status >= 500) {
      return {
        type: ErrorType.API,
        message: 'Server error. Please try again later.',
        code: status,
      };
    }
    
    return {
      type: ErrorType.API,
      message,
      code: status,
    };
  }
  
  if (error.request) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network error. Please check your connection.',
    };
  }
  
  if (error.message) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
    };
  }
  
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
  };
};

export const getErrorMessage = (error: AppError): string => {
  return error.message;
};

export const isNetworkError = (error: AppError): boolean => {
  return error.type === ErrorType.NETWORK;
};

export const isAuthError = (error: AppError): boolean => {
  return error.type === ErrorType.AUTH;
};
