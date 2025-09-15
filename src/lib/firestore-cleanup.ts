/**
 * Firestore listener cleanup utilities to prevent 400 errors
 */

import { firestore } from './firebaseConfig';
import { onSnapshot, Unsubscribe } from 'firebase/firestore';

// Track active listeners for cleanup
const activeListeners = new Set<Unsubscribe>();

/**
 * Enhanced onSnapshot wrapper with automatic cleanup
 */
export function createManagedListener<T>(
  docRef: any,
  callback: (data: T | null) => void,
  errorCallback?: (error: Error) => void
): Unsubscribe {
  if (!firestore) {
    console.warn('Firestore not initialized, using fallback');
    callback(null);
    return () => {};
  }

  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      try {
        if (docSnap.exists()) {
          callback(docSnap.data() as T);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error processing snapshot:', error);
        errorCallback?.(error as Error);
      }
    },
    (error) => {
      console.error('Firestore listener error:', error);
      
      // Handle specific error types
      if (error.code === 'permission-denied') {
        console.warn('Permission denied, using fallback data');
        callback(null);
      } else if (error.code === 'unavailable') {
        console.warn('Firestore unavailable, retrying in 5 seconds');
        setTimeout(() => {
          // Retry the listener
          createManagedListener(docRef, callback, errorCallback);
        }, 5000);
      } else {
        errorCallback?.(error);
      }
    }
  );

  // Track the listener for cleanup
  activeListeners.add(unsubscribe);

  // Return enhanced unsubscribe function
  return () => {
    try {
      unsubscribe();
      activeListeners.delete(unsubscribe);
    } catch (error) {
      console.warn('Error unsubscribing listener:', error);
    }
  };
}

/**
 * Cleanup all active listeners
 */
export function cleanupAllListeners(): void {
  console.log(`Cleaning up ${activeListeners.size} active Firestore listeners`);
  
  activeListeners.forEach((unsubscribe) => {
    try {
      unsubscribe();
    } catch (error) {
      console.warn('Error during listener cleanup:', error);
    }
  });
  
  activeListeners.clear();
}

/**
 * Get count of active listeners
 */
export function getActiveListenerCount(): number {
  return activeListeners.size;
}

/**
 * Enhanced error handling for Firestore operations
 */
export function handleFirestoreError(error: any, operation: string): void {
  console.error(`Firestore ${operation} error:`, error);
  
  if (error.code === 'permission-denied') {
    console.warn(`Permission denied for ${operation}`);
  } else if (error.code === 'unavailable') {
    console.warn(`Firestore unavailable for ${operation}`);
  } else if (error.code === 'deadline-exceeded') {
    console.warn(`Timeout for ${operation}`);
  } else {
    console.error(`Unexpected error in ${operation}:`, error.message);
  }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupAllListeners);
  window.addEventListener('unload', cleanupAllListeners);
}
