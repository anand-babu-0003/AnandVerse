import { initializeApp, getApps, getApp, cert, type App, type ServiceAccount } from 'firebase-admin/app';
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

  const serviceAccountJsonBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;

  if (!serviceAccountJsonBase64) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 environment variable is not set. ' +
      'Please base64 encode your service account JSON file and set it in your .env file.'
    );
  }

  try {
    const decodedJson = Buffer.from(serviceAccountJsonBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedJson) as ServiceAccount;

    adminApp = initializeApp({
      credential: cert(serviceAccount),
    }, appName);

    return adminApp;

  } catch (error: any) {
    console.error("Failed to parse or use the service account JSON:", error.message);
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