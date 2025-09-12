import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';

// Enhanced Firebase configuration with better error handling
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Connection retry configuration
const CONNECTION_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  backoffMultiplier: 2,
};

// Connection state tracking
let connectionState = {
  isConnected: false,
  isConnecting: false,
  lastError: null as string | null,
  retryCount: 0,
};

const IS_SERVER = typeof window === 'undefined';
const logPrefix = IS_SERVER ? "[SERVER FirebaseConfig]" : "[CLIENT FirebaseConfig]";

// Validate Firebase configuration
function validateFirebaseConfig(): { isValid: boolean; missingKeys: string[] } {
  const requiredKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
}

// Enhanced connection retry logic
async function connectWithRetry<T>(
  connectFunction: () => Promise<T>,
  operationName: string
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= CONNECTION_RETRY_CONFIG.maxRetries; attempt++) {
    try {
      console.log(`${logPrefix} ${operationName} attempt ${attempt}/${CONNECTION_RETRY_CONFIG.maxRetries}`);
      const result = await connectFunction();
      
      if (attempt > 1) {
        console.log(`${logPrefix} ${operationName} succeeded on attempt ${attempt}`);
      }
      
      connectionState.isConnected = true;
      connectionState.isConnecting = false;
      connectionState.lastError = null;
      connectionState.retryCount = 0;
      
      return result;
    } catch (error: any) {
      lastError = error;
      connectionState.lastError = error.message;
      connectionState.retryCount = attempt;
      
      console.warn(`${logPrefix} ${operationName} failed on attempt ${attempt}:`, error.message);
      
      if (attempt < CONNECTION_RETRY_CONFIG.maxRetries) {
        const delay = CONNECTION_RETRY_CONFIG.retryDelay * Math.pow(CONNECTION_RETRY_CONFIG.backoffMultiplier, attempt - 1);
        console.log(`${logPrefix} Retrying ${operationName} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  connectionState.isConnected = false;
  connectionState.isConnecting = false;
  
  throw new Error(`${operationName} failed after ${CONNECTION_RETRY_CONFIG.maxRetries} attempts. Last error: ${lastError?.message}`);
}

// Initialize Firebase app with retry logic
let app: any;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

async function initializeFirebaseApp(): Promise<any> {
  const validation = validateFirebaseConfig();
  
  if (!validation.isValid) {
    const errorMsg = `FIREBASE CRITICAL ERROR: Missing Firebase config values for keys: ${validation.missingKeys.join(', ')}. Ensure all NEXT_PUBLIC_FIREBASE_... environment variables are correctly set.`;
    console.error(`${logPrefix} ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (getApps().length === 0) {
    return connectWithRetry(async () => {
      console.log(`${logPrefix} Initializing Firebase app...`);
      const firebaseApp = initializeApp(firebaseConfig);
      console.log(`${logPrefix} Firebase app initialized successfully`);
      return firebaseApp;
    }, 'Firebase App Initialization');
  } else {
    console.log(`${logPrefix} Using existing Firebase app`);
    return getApp();
  }
}

// Initialize Firestore with retry logic
async function initializeFirestore(): Promise<Firestore> {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const firebaseApp = await initializeFirebaseApp();
  
  return connectWithRetry(async () => {
    console.log(`${logPrefix} Initializing Firestore...`);
    const firestore = getFirestore(firebaseApp);
    
    // Test connection with a simple operation
    if (!IS_SERVER) {
      // Only test connection on client side
      try {
        // This will fail if Firestore is not accessible
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Firestore connection timeout'));
          }, 5000);
          
          // Simple test query
          const testCollection = firestore.collection('_test_connection');
          testCollection.limit(1).get().then(() => {
            clearTimeout(timeout);
            resolve(true);
          }).catch(reject);
        });
      } catch (error) {
        console.warn(`${logPrefix} Firestore connection test failed:`, error);
        // Don't throw here, let the actual usage handle the error
      }
    }
    
    console.log(`${logPrefix} Firestore initialized successfully`);
    return firestore;
  }, 'Firestore Initialization');
}

// Initialize Auth with retry logic
async function initializeAuth(): Promise<Auth> {
  if (authInstance) {
    return authInstance;
  }

  const firebaseApp = await initializeFirebaseApp();
  
  return connectWithRetry(async () => {
    console.log(`${logPrefix} Initializing Auth...`);
    const auth = getAuth(firebaseApp);
    console.log(`${logPrefix} Auth initialized successfully`);
    return auth;
  }, 'Auth Initialization');
}

// Public API with lazy initialization
export async function getFirestoreInstance(): Promise<Firestore | null> {
  try {
    if (connectionState.isConnecting) {
      console.log(`${logPrefix} Firestore connection already in progress, waiting...`);
      // Wait for existing connection attempt
      let attempts = 0;
      while (connectionState.isConnecting && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
    }
    
    if (firestoreInstance) {
      return firestoreInstance;
    }
    
    connectionState.isConnecting = true;
    firestoreInstance = await initializeFirestore();
    return firestoreInstance;
  } catch (error: any) {
    console.error(`${logPrefix} Failed to get Firestore instance:`, error.message);
    connectionState.isConnected = false;
    connectionState.isConnecting = false;
    return null;
  }
}

export async function getAuthInstance(): Promise<Auth | null> {
  try {
    if (authInstance) {
      return authInstance;
    }
    
    authInstance = await initializeAuth();
    return authInstance;
  } catch (error: any) {
    console.error(`${logPrefix} Failed to get Auth instance:`, error.message);
    return null;
  }
}

// Connection status utilities
export function getConnectionStatus() {
  return {
    ...connectionState,
    config: firebaseConfig,
    validation: validateFirebaseConfig()
  };
}

export function isFirebaseConnected(): boolean {
  return connectionState.isConnected && firestoreInstance !== null;
}

// Health check function
export async function performHealthCheck(): Promise<{
  isHealthy: boolean;
  details: {
    appInitialized: boolean;
    firestoreAvailable: boolean;
    authAvailable: boolean;
    configValid: boolean;
    lastError: string | null;
  };
}> {
  try {
    const validation = validateFirebaseConfig();
    const firestore = await getFirestoreInstance();
    const auth = await getAuthInstance();
    
    return {
      isHealthy: validation.isValid && firestore !== null && auth !== null,
      details: {
        appInitialized: true,
        firestoreAvailable: firestore !== null,
        authAvailable: auth !== null,
        configValid: validation.isValid,
        lastError: connectionState.lastError
      }
    };
  } catch (error: any) {
    return {
      isHealthy: false,
      details: {
        appInitialized: false,
        firestoreAvailable: false,
        authAvailable: false,
        configValid: false,
        lastError: error.message
      }
    };
  }
}

// Reset connection state (useful for testing)
export function resetConnectionState() {
  connectionState = {
    isConnected: false,
    isConnecting: false,
    lastError: null,
    retryCount: 0,
  };
  firestoreInstance = null;
  authInstance = null;
}

// Export configuration and instances
export { firebaseConfig, app, firestoreInstance as firestore, authInstance as auth };
