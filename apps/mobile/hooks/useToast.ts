interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
}

let burntToast: ((options: Record<string, unknown>) => void) | null = null;
let dismissAllToasts: (() => void) | null = null;

try {
  const burnt = require('burnt');
  burntToast = burnt.toast;
  dismissAllToasts = burnt.dismissAll;
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
        duration: options.duration ?? 3,
      }),
    error: (options: ToastOptions) =>
      callToast({
        title: options.title,
        message: options.message,
        duration: options.duration ?? 5,
        preset: 'error',
      }),
    success: (options: ToastOptions) =>
      callToast({
        title: options.title,
        message: options.message,
        duration: options.duration ?? 3,
        preset: 'done',
      }),
    dismiss: () => {
      if (dismissAllToasts) {
        try {
          dismissAllToasts();
        } catch (e) {
          console.warn('Failed to dismiss active toasts:', e);
        }
      }
    },
  };
}
