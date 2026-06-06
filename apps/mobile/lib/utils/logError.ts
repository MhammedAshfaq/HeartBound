export function logError(error: unknown, context?: string): void {
  if (__DEV__) {
    const prefix = context ? `[${context}]` : '';
    console.error(`${prefix}`, error);
  }
}
