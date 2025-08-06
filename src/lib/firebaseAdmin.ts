
import * as admin from 'firebase-admin';
import type { App as AdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuthSdk, type Auth as AdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestoreSdk, type Firestore as AdminFirestore } from 'firebase-admin/firestore';

let adminApp: AdminApp | undefined;

function initializeAdminApp(): AdminApp {
  if (adminApp) {
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
    const serviceAccountJson = Buffer.from(serviceAccountJsonBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    if (admin.apps.length > 0) {
      adminApp = admin.app();
    } else {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    return adminApp;
  } catch (error: any) {
    throw new Error(`Failed to initialize Firebase Admin SDK: "${error.message}"`);
  }
}

export function getAdminAuth(): AdminAuth {
    const app = initializeAdminApp();
    return getAdminAuthSdk(app);
}

export function getAdminFirestore(): AdminFirestore {
  const app = initializeAdminApp();
  return getAdminFirestoreSdk(app);
}
