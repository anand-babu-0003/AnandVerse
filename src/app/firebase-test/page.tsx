"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  testFirebaseConnection, 
  testFirestoreCollections, 
  runComprehensiveTest,
  logConnectionDetails 
} from '@/lib/firebaseConnectionTest';
import { 
  diagnoseFirebaseConnection, 
  testFirebaseOperations, 
  generateDiagnosticReport 
} from '@/lib/firebaseConnectionDiagnostic';
import { firebaseConfig } from '@/lib/firebaseConfig';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface TestResult {
  isConnected: boolean;
  error?: string;
  details: {
    configValid: boolean;
    firestoreAvailable: boolean;
    networkReachable: boolean;
    timestamp: string;
  };
}

interface CollectionResult {
  [key: string]: boolean;
}

export default function FirebaseTestPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [collectionResults, setCollectionResults] = useState<CollectionResult>({});
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTest = async () => {
    setLoading(true);
    setLogs([]);
    addLog('Starting Firebase connection test...');
    
    try {
      // Run comprehensive test
      await runComprehensiveTest();
      
      // Get connection result
      const connectionResult = await testFirebaseConnection();
      setTestResult(connectionResult);
      
      if (connectionResult.isConnected) {
        addLog('Connection successful, testing collections...');
        const collections = await testFirestoreCollections();
        setCollectionResults(collections);
        addLog('Collection tests completed');
      } else {
        addLog(`Connection failed: ${connectionResult.error}`);
      }
    } catch (error: any) {
      addLog(`Test error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "Connected" : "Disconnected"}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Firebase Connection Test</h1>
        <p className="text-muted-foreground">
          Diagnose Firebase connection issues and verify configuration
        </p>
      </div>

      {/* Test Button */}
      <div className="flex justify-center">
        <Button 
          onClick={runTest} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? 'Testing...' : 'Run Connection Test'}
        </Button>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Configuration Status
          </CardTitle>
          <CardDescription>
            Current Firebase configuration values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Key</span>
              {getStatusIcon(!!firebaseConfig.apiKey)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auth Domain</span>
              {getStatusIcon(!!firebaseConfig.authDomain)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Project ID</span>
              {getStatusIcon(!!firebaseConfig.projectId)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">App ID</span>
              {getStatusIcon(!!firebaseConfig.appId)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage Bucket</span>
              {getStatusIcon(!!firebaseConfig.storageBucket)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Messaging Sender ID</span>
              {getStatusIcon(!!firebaseConfig.messagingSenderId)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Test Results */}
      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(testResult.isConnected)}
              Connection Test Results
            </CardTitle>
            <CardDescription>
              {testResult.isConnected ? 'Firebase is connected successfully' : 'Firebase connection failed'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Status</span>
              {getStatusBadge(testResult.isConnected)}
            </div>
            
            {testResult.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{testResult.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Config Valid</span>
                {getStatusIcon(testResult.details.configValid)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Firestore Available</span>
                {getStatusIcon(testResult.details.firestoreAvailable)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Reachable</span>
                {getStatusIcon(testResult.details.networkReachable)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collection Test Results */}
      {Object.keys(collectionResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Collection Access Test</CardTitle>
            <CardDescription>
              Testing access to Firestore collections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(collectionResults).map(([collection, accessible]) => (
                <div key={collection} className="flex items-center justify-between">
                  <span className="text-sm font-mono">{collection}</span>
                  {getStatusIcon(accessible)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Logs */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Logs</CardTitle>
            <CardDescription>
              Detailed test execution logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono text-muted-foreground">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            If the connection test fails, please:
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>Check your internet connection</li>
            <li>Verify your Firebase project is active</li>
            <li>Ensure all environment variables are set correctly</li>
            <li>Check Firestore rules allow read access</li>
            <li>Verify your Firebase project has Firestore enabled</li>
          </ul>
          <p className="text-sm mt-4">
            For detailed setup instructions, see the <code>FIREBASE_SETUP_GUIDE.md</code> file.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
