/**
 * Firebase Logger Configuration
 * Suppress unnecessary connection warnings in development
 */

// Suppress Firebase connection warnings in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Override console.error to filter out Firebase connection warnings
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Filter out Firebase connection warnings
    if (
      message.includes('Could not reach Cloud Firestore backend') ||
      message.includes('Connection failed') ||
      message.includes('The operation could not be completed') ||
      message.includes('operate in offline mode')
    ) {
      // Only log these in verbose mode
      if (process.env.NEXT_PUBLIC_VERBOSE_FIREBASE_LOGS === 'true') {
        originalError(...args);
      }
      return;
    }
    
    // Log all other errors normally
    originalError(...args);
  };

  // Override console.warn to filter out Firebase warnings
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Filter out Firebase connection warnings
    if (
      message.includes('Firestore') && 
      (message.includes('connection') || message.includes('offline'))
    ) {
      // Only log these in verbose mode
      if (process.env.NEXT_PUBLIC_VERBOSE_FIREBASE_LOGS === 'true') {
        originalWarn(...args);
      }
      return;
    }
    
    // Log all other warnings normally
    originalWarn(...args);
  };
}

// Export a function to enable verbose logging
export function enableVerboseFirebaseLogging() {
  if (typeof window !== 'undefined') {
    (window as any).__FIREBASE_VERBOSE_LOGS__ = true;
  }
}

// Export a function to disable verbose logging
export function disableVerboseFirebaseLogging() {
  if (typeof window !== 'undefined') {
    (window as any).__FIREBASE_VERBOSE_LOGS__ = false;
  }
}
