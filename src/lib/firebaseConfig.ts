
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app;
let firestoreInstance: Firestore | null = null;
let authInstance;

const IS_SERVER = typeof window === 'undefined';
const logPrefix = IS_SERVER ? "[SERVER FirebaseConfig]" : "[CLIENT FirebaseConfig]";

const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(
    `${logPrefix} FIREBASE CRITICAL ERROR: Missing Firebase config values for keys: ${missingKeys.join(', ')}. Ensure all NEXT_PUBLIC_FIREBASE_... environment variables are correctly set. Firebase services will be UNUSABLE.`
  );
} else {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error(`${logPrefix} FIREBASE CRITICAL ERROR: Failed to initialize Firebase app:`, error);
      app = undefined;
    }
  } else {
    app = getApp();
  }

  if (app) {
    try {
      firestoreInstance = getFirestore(app);
      authInstance = getAuth(app);
    } catch (error) {
      console.error(`${logPrefix} FIREBASE CRITICAL ERROR: Failed to get Firestore or Auth instance:`, error);
      firestoreInstance = null;
      authInstance = null;
    }
  } else {
     console.warn(`${logPrefix} Firebase app object is undefined after initialization attempt. Firebase services cannot be initialized.`);
     firestoreInstance = null;
     authInstance = null;
  }
}

if (!firestoreInstance || !authInstance) {
    console.error(`${logPrefix} Firebase & its services ARE NOT CONFIGURED or available. App functionality will be severely limited.`);
}

export { firestoreInstance as firestore, firebaseConfig, app as firebaseApp, authInstance as auth };
