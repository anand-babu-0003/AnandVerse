
import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { headers } from 'next/headers';
import 'dotenv/config';

let adminApp: App | null = null;

function initializeAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  const appName = 'firebase-admin-app-my-portfolio';
  const existingApp = getApps().find(app => app.name === appName);
  if (existingApp) {
    adminApp = existingApp;
    return adminApp;
  }

  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };

  const requiredConfigKeys = ['projectId', 'clientEmail', 'privateKey'];
  const missingAdminKeys = requiredConfigKeys.filter(key => !serviceAccount[key as keyof typeof serviceAccount]);

  if (missingAdminKeys.length > 0 || !serviceAccount.privateKey) {
    throw new Error(`FIREBASE ADMIN CRITICAL ERROR: Missing env vars for Admin SDK: ${missingAdminKeys.join(', ')}`);
  }

  try {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    }, appName);
    return adminApp;
  } catch (error: any) {
    throw new Error(`Failed to initialize Firebase Admin SDK: "${error.message}"`);
  }
}

export function getAdminAuth(): Auth {
    const app = initializeAdminApp();
    return getAuth(app);
}

export function getAdminFirestore(): Firestore {
  const app = initializeAdminApp();
  return getFirestore(app);
}


export async function getAuthenticatedUser() {
    const adminAuth = getAdminAuth();
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
