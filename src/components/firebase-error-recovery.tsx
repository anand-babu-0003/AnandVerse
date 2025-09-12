"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { recoverFromAssertionError } from '@/lib/firebaseConfig';

interface FirebaseErrorRecoveryProps {
  showDetails?: boolean;
}

export default function FirebaseErrorRecovery({ showDetails = false }: FirebaseErrorRecoveryProps) {
  const [isRecovering, setIsRecovering] = useState(false);
  const [lastRecoveryAttempt, setLastRecoveryAttempt] = useState<Date | null>(null);

  const handleRecovery = async () => {
    setIsRecovering(true);
    try {
      await recoverFromAssertionError();
      setLastRecoveryAttempt(new Date());
    } catch (error) {
      console.error('Recovery failed:', error);
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Firebase Connection Issue Detected</p>
            {showDetails && (
              <p className="text-sm mt-1">
                If you're experiencing Firebase assertion errors, try the recovery option below.
              </p>
            )}
            {lastRecoveryAttempt && (
              <p className="text-xs mt-1 text-orange-600">
                Last recovery attempt: {lastRecoveryAttempt.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRecovery}
            disabled={isRecovering}
            className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            {isRecovering ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            {isRecovering ? 'Recovering...' : 'Recover'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
