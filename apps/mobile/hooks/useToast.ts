interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
}

let burntToast: ((options: Record<string, unknown>) => void) | null = null;

try {
  burntToast = require('burnt').toast;
} catch {
}

function callToast(options: Record<string, unknown>) {
  if (burntToast) {
    burntToast(options);
  }
}

export function useToast() {
  return {
    show: (options: ToastOptions) =>
      callToast({
        title: options.title,
        message: options.message,
        duration: options.duration ?? 3000,
      }),
    error: (options: ToastOptions) =>
      callToast({
        title: options.title,
        message: options.message,
        duration: options.duration ?? 4000,
        preset: 'error',
      }),
    success: (options: ToastOptions) =>
      callToast({
        title: options.title,
        message: options.message,
        duration: options.duration ?? 3000,
        preset: 'done',
      }),
  };
}
