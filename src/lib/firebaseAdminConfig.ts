
import 'dotenv/config';
import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { headers } from 'next/headers';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminFirestore: Firestore | null = null;

function initializeFirebaseAdmin() {
  if (getApps().find(app => app.name === 'admin')) {
      adminApp = getApp('admin');
  } else {
    const serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };

    const requiredConfigKeys = ['projectId', 'clientEmail', 'privateKey'];
    const missingAdminKeys = requiredConfigKeys.filter(key => !serviceAccount[key as keyof typeof serviceAccount]);
    
    if (missingAdminKeys.length > 0) {
      console.error(
        `FIREBASE ADMIN CRITICAL ERROR: Cannot initialize. Missing env vars: ${missingAdminKeys.join(', ')}`
      );
      return; 
    }
    
    try {
       adminApp = initializeApp({
          credential: cert(serviceAccount),
       }, 'admin');
    } catch (error) {
       console.error("FIREBASE ADMIN CRITICAL ERROR: Failed to initialize Firebase Admin app:", error);
       return;
    }
  }

  adminAuth = getAuth(adminApp);
  adminFirestore = getFirestore(adminApp);
}

// Call initialization once
initializeFirebaseAdmin();

/**
 * Verifies the user's Firebase Authentication token from the request headers.
 * This should be called at the beginning of any server action that requires authentication.
 * @returns {Promise<{uid: string}>} The decoded user token containing the UID.
 * @throws {Error} If the user is not authenticated or the token is invalid.
 */
export async function getAuthenticatedUser() {
    if (!adminAuth) {
        throw new Error("Firebase Admin Auth is not initialized. Cannot authenticate user.");
    }
    const authorization = headers().get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1];
        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            console.error('Error verifying Firebase ID token:', error);
            throw new Error('User token is invalid or expired. Please log in again.');
        }
    }
    throw new Error('User is not authenticated. Authorization header is missing or invalid.');
}

export { adminApp, adminAuth, adminFirestore, FieldValue, Timestamp };
