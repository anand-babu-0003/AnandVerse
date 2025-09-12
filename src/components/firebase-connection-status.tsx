"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  getConnectionStatus, 
  isFirebaseConnected, 
  isOfflineMode,
  getFirestoreWithRetry 
} from '@/lib/firebaseConfig';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Activity
} from 'lucide-react';

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export default function FirebaseConnectionStatus({ 
  showDetails = false, 
  className = "" 
}: ConnectionStatusProps) {
  const [status, setStatus] = useState(getConnectionStatus());
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getConnectionStatus());
    };

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);
    updateStatus(); // Initial update

    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await getFirestoreWithRetry();
      setStatus(getConnectionStatus());
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const getStatusIcon = () => {
    if (isFirebaseConnected()) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    } else if (isOfflineMode()) {
      return <WifiOff className="h-3 w-3 text-orange-500" />;
    } else if (status.isConnecting) {
      return <Activity className="h-3 w-3 text-blue-500 animate-pulse" />;
    } else {
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (isFirebaseConnected()) {
      return 'Connected';
    } else if (isOfflineMode()) {
      return 'Offline Mode';
    } else if (status.isConnecting) {
      return 'Connecting...';
    } else {
      return 'Disconnected';
    }
  };

  const getStatusVariant = () => {
    if (isFirebaseConnected()) {
      return 'default' as const;
    } else if (isOfflineMode()) {
      return 'secondary' as const;
    } else {
      return 'destructive' as const;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge variant={getStatusVariant()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
        
        {!isFirebaseConnected() && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Retry'}
          </Button>
        )}
      </div>

      {showDetails && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Retry Count: {status.retryCount}</div>
          {status.lastError && (
            <div>Last Error: {status.lastError}</div>
          )}
          {isOfflineMode() && (
            <div className="text-orange-600">
              Working in offline mode. Data will sync when connection is restored.
            </div>
          )}
        </div>
      )}

      {status.lastError && !isFirebaseConnected() && (
        <Alert variant="destructive" className="text-xs">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription>
            Connection error: {status.lastError}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
