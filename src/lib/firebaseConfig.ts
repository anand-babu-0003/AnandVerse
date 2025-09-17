
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore, connectFirestoreEmulator, enableNetwork, disableNetwork, terminate, clearIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAMgwhy9fM30pdkgrkGJxlOyfBE9Pm5sMc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "anandverse.firebaseapp.com",
  databaseURL: "https://anandverse-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "anandverse",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "anandverse.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "197492755998",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:197492755998:web:0e908708f96acebd7d280f",
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-3075EF3LJY",
};

let app: any;
let firestoreInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

const IS_SERVER = typeof window === 'undefined';
const logPrefix = IS_SERVER ? "[SERVER FirebaseConfig]" : "[CLIENT FirebaseConfig]";

// Connection state management
let connectionState = {
  isConnected: false,
  isConnecting: false,
  retryCount: 0,
  lastError: null as string | null,
  offlineMode: false
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2
};

const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

// Debug logging for environment variables
console.log(`${logPrefix} Firebase config values:`, {
  apiKey: firebaseConfig.apiKey ? 'SET' : 'MISSING',
  authDomain: firebaseConfig.authDomain ? 'SET' : 'MISSING',
  projectId: firebaseConfig.projectId ? 'SET' : 'MISSING',
  storageBucket: firebaseConfig.storageBucket ? 'SET' : 'MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'SET' : 'MISSING',
  appId: firebaseConfig.appId ? 'SET' : 'MISSING',
  measurementId: firebaseConfig.measurementId ? 'SET' : 'MISSING',
});

// Safe Firebase reinitialization function
async function safeReinitializeFirebase(): Promise<void> {
  try {
    console.log(`${logPrefix} Attempting safe Firebase reinitialization...`);
    
    // Terminate existing Firestore instance if it exists
    if (firestoreInstance) {
      try {
        await terminate(firestoreInstance);
        console.log(`${logPrefix} Terminated existing Firestore instance`);
      } catch (error) {
        console.warn(`${logPrefix} Error terminating Firestore instance:`, error);
      }
      firestoreInstance = null;
    }
    
    // Reset storage instance
    storageInstance = null;
    
    // Reset connection state
    connectionState = {
      isConnected: false,
      isConnecting: false,
      retryCount: 0,
      lastError: null,
      offlineMode: false
    };
    
    console.log(`${logPrefix} Firebase reinitialized successfully`);
  } catch (error) {
    console.error(`${logPrefix} Error during Firebase reinitialization:`, error);
    throw error;
  }
}

// Enhanced connection retry logic
async function connectWithRetry<T>(
  connectFunction: () => Promise<T>,
  operationName: string
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      connectionState.isConnecting = true;
      const result = await connectFunction();
      connectionState.isConnected = true;
      connectionState.isConnecting = false;
      connectionState.lastError = null;
      connectionState.retryCount = 0;
      connectionState.offlineMode = false;
      return result;
    } catch (error: any) {
      lastError = error;
      connectionState.lastError = error.message;
      connectionState.retryCount = attempt;
      
      // If it's an assertion error, try to reinitialize Firebase
      if (error.message && error.message.includes('INTERNAL ASSERTION FAILED')) {
        console.log(`${logPrefix} Detected assertion error, attempting Firebase reinitialization...`);
        try {
          await safeReinitializeFirebase();
          // Continue with retry after reinitialization
        } catch (reinitError) {
          console.error(`${logPrefix} Firebase reinitialization failed:`, reinitError);
        }
      }
      
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1);
        console.warn(`${logPrefix} ${operationName} failed (attempt ${attempt}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  connectionState.isConnected = false;
  connectionState.isConnecting = false;
  connectionState.offlineMode = true;
  
  console.error(`${logPrefix} ${operationName} failed after ${RETRY_CONFIG.maxRetries} attempts. Switching to offline mode.`);
  throw new Error(`${operationName} failed after ${RETRY_CONFIG.maxRetries} attempts. Last error: ${lastError?.message}`);
}

// Initialize Firebase with enhanced error handling
async function initializeFirebase(): Promise<void> {
  if (missingKeys.length > 0) {
    const errorMsg = `FIREBASE CRITICAL ERROR: Missing Firebase config values for keys: ${missingKeys.join(', ')}. Ensure all NEXT_PUBLIC_FIREBASE_... environment variables are correctly set.`;
    console.error(`${logPrefix} ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    // Initialize Firebase app
    if (!getApps().length) {
      app = await connectWithRetry(async () => {
        console.log(`${logPrefix} Initializing Firebase app...`);
        return initializeApp(firebaseConfig);
      }, 'Firebase App Initialization');
    } else {
      app = getApp();
    }

    // Initialize Firestore with connection monitoring
    if (app) {
      firestoreInstance = await connectWithRetry(async () => {
        console.log(`${logPrefix} Initializing Firestore...`);
        const firestore = getFirestore(app as any);
        
        // Set up connection monitoring
        if (!IS_SERVER) {
          // Monitor connection state
          const monitorConnection = () => {
            if (firestore) {
              enableNetwork(firestore).then(() => {
                if (connectionState.offlineMode) {
                  console.log(`${logPrefix} Firebase connection restored`);
                  connectionState.offlineMode = false;
                  connectionState.isConnected = true;
                }
              }).catch((error) => {
                if (!connectionState.offlineMode) {
                  console.warn(`${logPrefix} Firebase connection lost, switching to offline mode`);
                  connectionState.offlineMode = true;
                  connectionState.isConnected = false;
                }
              });
            }
          };

          // Check connection every 30 seconds
          setInterval(monitorConnection, 30000);
          monitorConnection();
        }
        
        return firestore;
      }, 'Firestore Initialization');
      
      // Initialize Firebase Storage
      storageInstance = await connectWithRetry(async () => {
        console.log(`${logPrefix} Initializing Firebase Storage...`);
        console.log(`${logPrefix} Storage bucket:`, firebaseConfig.storageBucket);
        const storage = getStorage(app as any, firebaseConfig.storageBucket);
        console.log(`${logPrefix} Storage initialized with bucket:`, firebaseConfig.storageBucket);
        return storage;
      }, 'Firebase Storage Initialization');
    }

    console.log(`${logPrefix} Firebase initialized successfully`);
  } catch (error: any) {
    console.error(`${logPrefix} Firebase initialization failed:`, error.message);
    connectionState.offlineMode = true;
    connectionState.isConnected = false;
  }
}

// Initialize Firebase on module load
// Global error handler for Firebase assertion errors
if (!IS_SERVER) {
  const originalError = window.console.error;
  window.console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('INTERNAL ASSERTION FAILED')) {
      console.warn(`${logPrefix} Caught assertion error, attempting recovery...`);
      safeReinitializeFirebase().catch(error => {
        console.error(`${logPrefix} Recovery failed:`, error);
      });
    }
    originalError.apply(console, args);
  };
}

if (!IS_SERVER) {
  initializeFirebase().catch(error => {
    console.error(`${logPrefix} Failed to initialize Firebase:`, error);
  });
} else {
  // Server-side initialization
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      firestoreInstance = getFirestore(app);
      storageInstance = getStorage(app, firebaseConfig.storageBucket);
      console.log(`${logPrefix} Server-side storage bucket:`, firebaseConfig.storageBucket);
    } catch (error) {
      console.error(`${logPrefix} Server-side Firebase initialization failed:`, error);
    }
  } else {
    app = getApp();
    firestoreInstance = getFirestore(app);
    storageInstance = getStorage(app, firebaseConfig.storageBucket);
    console.log(`${logPrefix} Server-side storage bucket:`, firebaseConfig.storageBucket);
  }
}

// Connection status utilities
export function getConnectionStatus() {
  return { ...connectionState };
}

export function isFirebaseConnected(): boolean {
  return connectionState.isConnected && !connectionState.offlineMode;
}

export function isOfflineMode(): boolean {
  return connectionState.offlineMode;
}

// Enhanced Firestore getter with retry logic
export async function getFirestoreWithRetry(): Promise<Firestore | null> {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    await initializeFirebase();
    return firestoreInstance;
  } catch (error) {
    console.error(`${logPrefix} Failed to get Firestore instance:`, error);
    return null;
  }
}

// Manual Firebase recovery function
export async function recoverFromAssertionError(): Promise<void> {
  console.log(`${logPrefix} Manual recovery triggered...`);
  try {
    await safeReinitializeFirebase();
    await initializeFirebase();
    console.log(`${logPrefix} Manual recovery completed successfully`);
  } catch (error) {
    console.error(`${logPrefix} Manual recovery failed:`, error);
    throw error;
  }
}

export { firestoreInstance as firestore, storageInstance as storage, firebaseConfig, app as firebaseApp };
