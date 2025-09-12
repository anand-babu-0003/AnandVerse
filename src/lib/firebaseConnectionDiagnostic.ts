/**
 * Firebase Connection Diagnostic Utility
 * Comprehensive testing and diagnosis of Firebase connection issues
 */

import { getConnectionStatus, performHealthCheck, isFirebaseConnected } from './firebaseConfigEnhanced';

export interface DiagnosticResult {
  overallStatus: 'healthy' | 'warning' | 'error';
  issues: string[];
  recommendations: string[];
  details: {
    network: {
      isOnline: boolean;
      canReachFirebase: boolean;
    };
    configuration: {
      isValid: boolean;
      missingKeys: string[];
    };
    connection: {
      isConnected: boolean;
      isConnecting: boolean;
      retryCount: number;
      lastError: string | null;
    };
    services: {
      firestore: boolean;
      auth: boolean;
    };
  };
}

/**
 * Perform comprehensive Firebase connection diagnosis
 */
export async function diagnoseFirebaseConnection(): Promise<DiagnosticResult> {
  const result: DiagnosticResult = {
    overallStatus: 'healthy',
    issues: [],
    recommendations: [],
    details: {
      network: {
        isOnline: false,
        canReachFirebase: false,
      },
      configuration: {
        isValid: false,
        missingKeys: [],
      },
      connection: {
        isConnected: false,
        isConnecting: false,
        retryCount: 0,
        lastError: null,
      },
      services: {
        firestore: false,
        auth: false,
      },
    },
  };

  try {
    // 1. Check network connectivity
    result.details.network.isOnline = navigator.onLine;
    if (!result.details.network.isOnline) {
      result.issues.push('No internet connection detected');
      result.recommendations.push('Check your internet connection and try again');
    }

    // 2. Test Firebase connectivity
    try {
      const response = await fetch('https://firestore.googleapis.com', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      result.details.network.canReachFirebase = true;
    } catch (error) {
      result.details.network.canReachFirebase = false;
      result.issues.push('Cannot reach Firebase servers');
      result.recommendations.push('Check your network connection and firewall settings');
    }

    // 3. Check configuration
    const connectionStatus = getConnectionStatus();
    result.details.configuration.isValid = connectionStatus.validation.isValid;
    result.details.configuration.missingKeys = connectionStatus.validation.missingKeys;
    
    if (!result.details.configuration.isValid) {
      result.issues.push(`Missing Firebase configuration: ${connectionStatus.validation.missingKeys.join(', ')}`);
      result.recommendations.push('Set all required NEXT_PUBLIC_FIREBASE_* environment variables');
    }

    // 4. Check connection status
    result.details.connection.isConnected = connectionStatus.isConnected;
    result.details.connection.isConnecting = connectionStatus.isConnecting;
    result.details.connection.retryCount = connectionStatus.retryCount;
    result.details.connection.lastError = connectionStatus.lastError;

    if (connectionStatus.lastError) {
      result.issues.push(`Connection error: ${connectionStatus.lastError}`);
    }

    // 5. Perform health check
    const healthCheck = await performHealthCheck();
    result.details.services.firestore = healthCheck.details.firestoreAvailable;
    result.details.services.auth = healthCheck.details.authAvailable;

    if (!healthCheck.details.firestoreAvailable) {
      result.issues.push('Firestore service is not available');
      result.recommendations.push('Check Firestore configuration and enable it in Firebase Console');
    }

    if (!healthCheck.details.authAvailable) {
      result.issues.push('Auth service is not available');
      result.recommendations.push('Check Auth configuration in Firebase Console');
    }

    // 6. Determine overall status
    if (result.issues.length === 0) {
      result.overallStatus = 'healthy';
    } else if (result.issues.some(issue => 
      issue.includes('Missing Firebase configuration') || 
      issue.includes('Cannot reach Firebase servers')
    )) {
      result.overallStatus = 'error';
    } else {
      result.overallStatus = 'warning';
    }

    // 7. Add specific recommendations based on issues
    if (result.details.configuration.missingKeys.length > 0) {
      result.recommendations.push('Create .env.local file with Firebase configuration');
      result.recommendations.push('Restart development server after updating environment variables');
    }

    if (result.details.connection.retryCount > 0) {
      result.recommendations.push('Firebase connection is retrying - wait a moment and refresh');
    }

    if (!result.details.network.canReachFirebase) {
      result.recommendations.push('Check if Firebase services are down at https://status.firebase.google.com/');
    }

  } catch (error: any) {
    result.overallStatus = 'error';
    result.issues.push(`Diagnostic error: ${error.message}`);
    result.recommendations.push('Check browser console for detailed error messages');
  }

  return result;
}

/**
 * Test specific Firebase operations
 */
export async function testFirebaseOperations(): Promise<{
  firestore: { canRead: boolean; canWrite: boolean; error?: string };
  auth: { canInitialize: boolean; error?: string };
}> {
  const results = {
    firestore: { canRead: false, canWrite: false },
    auth: { canInitialize: false },
  };

  try {
    // Test Firestore
    const { getFirestoreInstance } = await import('./firebaseConfigEnhanced');
    const firestore = await getFirestoreInstance();
    
    if (firestore) {
      try {
        // Test read operation
        const testCollection = firestore.collection('_test_read');
        await testCollection.limit(1).get();
        results.firestore.canRead = true;
      } catch (error: any) {
        results.firestore.error = error.message;
      }

      try {
        // Test write operation (this will fail due to security rules, but we can test the connection)
        const testCollection = firestore.collection('_test_write');
        await testCollection.add({ test: true });
        results.firestore.canWrite = true;
      } catch (error: any) {
        // Write might fail due to security rules, which is expected
        if (!error.message.includes('permission') && !error.message.includes('security')) {
          results.firestore.error = error.message;
        }
      }
    }
  } catch (error: any) {
    results.firestore.error = error.message;
  }

  try {
    // Test Auth
    const { getAuthInstance } = await import('./firebaseConfigEnhanced');
    const auth = await getAuthInstance();
    results.auth.canInitialize = auth !== null;
  } catch (error: any) {
    results.auth.error = error.message;
  }

  return results;
}

/**
 * Generate a detailed diagnostic report
 */
export async function generateDiagnosticReport(): Promise<string> {
  const diagnosis = await diagnoseFirebaseConnection();
  const operations = await testFirebaseOperations();

  let report = `# Firebase Connection Diagnostic Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  
  report += `## Overall Status: ${diagnosis.overallStatus.toUpperCase()}\n\n`;
  
  if (diagnosis.issues.length > 0) {
    report += `## Issues Found:\n`;
    diagnosis.issues.forEach((issue, index) => {
      report += `${index + 1}. ${issue}\n`;
    });
    report += `\n`;
  }

  if (diagnosis.recommendations.length > 0) {
    report += `## Recommendations:\n`;
    diagnosis.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    report += `\n`;
  }

  report += `## Technical Details:\n\n`;
  report += `### Network:\n`;
  report += `- Online: ${diagnosis.details.network.isOnline ? 'Yes' : 'No'}\n`;
  report += `- Can reach Firebase: ${diagnosis.details.network.canReachFirebase ? 'Yes' : 'No'}\n\n`;

  report += `### Configuration:\n`;
  report += `- Valid: ${diagnosis.details.configuration.isValid ? 'Yes' : 'No'}\n`;
  if (diagnosis.details.configuration.missingKeys.length > 0) {
    report += `- Missing keys: ${diagnosis.details.configuration.missingKeys.join(', ')}\n`;
  }
  report += `\n`;

  report += `### Connection:\n`;
  report += `- Connected: ${diagnosis.details.connection.isConnected ? 'Yes' : 'No'}\n`;
  report += `- Connecting: ${diagnosis.details.connection.isConnecting ? 'Yes' : 'No'}\n`;
  report += `- Retry count: ${diagnosis.details.connection.retryCount}\n`;
  if (diagnosis.details.connection.lastError) {
    report += `- Last error: ${diagnosis.details.connection.lastError}\n`;
  }
  report += `\n`;

  report += `### Services:\n`;
  report += `- Firestore: ${diagnosis.details.services.firestore ? 'Available' : 'Not available'}\n`;
  report += `- Auth: ${diagnosis.details.services.auth ? 'Available' : 'Not available'}\n\n`;

  report += `### Operations Test:\n`;
  report += `- Firestore read: ${operations.firestore.canRead ? 'Success' : 'Failed'}\n`;
  report += `- Firestore write: ${operations.firestore.canWrite ? 'Success' : 'Failed'}\n`;
  report += `- Auth initialize: ${operations.auth.canInitialize ? 'Success' : 'Failed'}\n\n`;

  if (operations.firestore.error) {
    report += `**Firestore Error:** ${operations.firestore.error}\n\n`;
  }
  if (operations.auth.error) {
    report += `**Auth Error:** ${operations.auth.error}\n\n`;
  }

  return report;
}
