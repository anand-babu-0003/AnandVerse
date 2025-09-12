/**
 * Firebase Connection Test Utility
 * Use this to diagnose Firebase connection issues
 */

import { firestore, firebaseConfig } from './firebaseConfig';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';

export interface ConnectionTestResult {
  isConnected: boolean;
  error?: string;
  details: {
    configValid: boolean;
    firestoreAvailable: boolean;
    networkReachable: boolean;
    timestamp: string;
  };
}

/**
 * Test Firebase connection and configuration
 */
export async function testFirebaseConnection(): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    isConnected: false,
    details: {
      configValid: false,
      firestoreAvailable: false,
      networkReachable: false,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    // Test 1: Check if Firebase config is valid
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
    
    if (missingKeys.length > 0) {
      result.error = `Missing Firebase config keys: ${missingKeys.join(', ')}`;
      result.details.configValid = false;
      return result;
    }
    
    result.details.configValid = true;

    // Test 2: Check if Firestore instance is available
    if (!firestore) {
      result.error = 'Firestore instance is not available';
      result.details.firestoreAvailable = false;
      return result;
    }
    
    result.details.firestoreAvailable = true;

    // Test 3: Test network connectivity with a simple query
    try {
      // Try to read from a test collection (this will fail if network is down)
      const testCollection = collection(firestore, 'test');
      const testQuery = query(testCollection, limit(1));
      await getDocs(testQuery);
      
      result.details.networkReachable = true;
      result.isConnected = true;
    } catch (networkError: any) {
      result.details.networkReachable = false;
      result.error = `Network error: ${networkError.message}`;
    }

  } catch (error: any) {
    result.error = `Connection test failed: ${error.message}`;
  }

  return result;
}

/**
 * Test specific Firestore collections
 */
export async function testFirestoreCollections(): Promise<{
  [key: string]: boolean;
}> {
  const collections = [
    'blogPosts',
    'portfolioItems', 
    'skills',
    'aboutMe',
    'contactMessages',
    'announcements',
    'siteSettings'
  ];

  const results: { [key: string]: boolean } = {};

  for (const collectionName of collections) {
    try {
      const collectionRef = collection(firestore, collectionName);
      const testQuery = query(collectionRef, limit(1));
      await getDocs(testQuery);
      results[collectionName] = true;
    } catch (error) {
      results[collectionName] = false;
    }
  }

  return results;
}

/**
 * Log detailed connection information
 */
export function logConnectionDetails(): void {
  console.group('🔍 Firebase Connection Diagnostics');
  
  console.log('📋 Configuration Status:');
  console.log('  - API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing');
  console.log('  - Auth Domain:', firebaseConfig.authDomain ? '✅ Set' : '❌ Missing');
  console.log('  - Project ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing');
  console.log('  - App ID:', firebaseConfig.appId ? '✅ Set' : '❌ Missing');
  console.log('  - Storage Bucket:', firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing');
  console.log('  - Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing');
  
  console.log('🔧 Firestore Status:');
  console.log('  - Instance Available:', firestore ? '✅ Yes' : '❌ No');
  
  console.log('🌐 Environment:');
  console.log('  - Is Server:', typeof window === 'undefined' ? '✅ Yes' : '❌ No');
  console.log('  - Node Environment:', process.env.NODE_ENV || 'Not set');
  
  console.groupEnd();
}

/**
 * Run comprehensive connection test
 */
export async function runComprehensiveTest(): Promise<void> {
  console.log('🚀 Starting comprehensive Firebase connection test...');
  
  // Log basic details
  logConnectionDetails();
  
  // Test connection
  const connectionResult = await testFirebaseConnection();
  
  console.group('📊 Connection Test Results');
  console.log('Connected:', connectionResult.isConnected ? '✅ Yes' : '❌ No');
  if (connectionResult.error) {
    console.error('Error:', connectionResult.error);
  }
  console.log('Details:', connectionResult.details);
  console.groupEnd();
  
  // Test collections if connected
  if (connectionResult.isConnected) {
    console.log('🔍 Testing Firestore collections...');
    const collectionResults = await testFirestoreCollections();
    
    console.group('📚 Collection Access Results');
    Object.entries(collectionResults).forEach(([collection, accessible]) => {
      console.log(`${collection}:`, accessible ? '✅ Accessible' : '❌ Not accessible');
    });
    console.groupEnd();
  }
  
  console.log('✅ Comprehensive test completed');
}
