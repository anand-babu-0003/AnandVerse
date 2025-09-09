"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFormSecurity, useUrlSecurity } from '@/hooks/use-security';
import { logSecurityEvent } from '@/lib/security';

interface SecurityContextType {
  isSecure: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  sanitizeInput: (input: string) => string;
  validateUrl: (url: string) => boolean;
  sanitizeUrl: (url: string) => string;
  sanitizeFormData: (data: Record<string, any>) => Record<string, any>;
  validateFormData: (data: Record<string, any>) => string[];
  reportSecurityEvent: (event: string, details?: Record<string, any>) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function useSecurityContext() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}

interface SecurityProviderProps {
  children: React.ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [isSecure, setIsSecure] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('high');
  
  // Use security hooks (without console monitoring to prevent circular dependency)
  const { sanitizeFormData, validateFormData } = useFormSecurity();
  const { validateUrl, sanitizeUrl } = useUrlSecurity();
  
  // Simple input sanitization without console monitoring
  const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .slice(0, 10000);
  };

  // Report security events
  const reportSecurityEvent = (event: string, details?: Record<string, any>) => {
    logSecurityEvent(event, details);
  };

  // Security assessment
  useEffect(() => {
    const assessSecurity = () => {
      let score = 100;
      
      // Check for HTTPS
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        score -= 20;
      }
      
      // Check for secure headers (basic client-side check)
      if (!document.referrerPolicy) {
        score -= 10;
      }
      
      // Check for CSP
      const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!metaCSP) {
        score -= 15;
      }
      
      // Determine security level
      if (score >= 90) {
        setSecurityLevel('high');
      } else if (score >= 70) {
        setSecurityLevel('medium');
      } else {
        setSecurityLevel('low');
      }
      
      setIsSecure(score >= 70);
      
      // Log security assessment
      reportSecurityEvent('SECURITY_ASSESSMENT', {
        score,
        level: securityLevel,
        protocol: location.protocol,
        hostname: location.hostname,
      });
    };

    assessSecurity();
  }, [securityLevel, reportSecurityEvent]);

  // Monitor for security violations
  useEffect(() => {
    const handleSecurityViolation = (event: SecurityPolicyViolationEvent) => {
      reportSecurityEvent('CSP_VIOLATION', {
        violatedDirective: event.violatedDirective,
        blockedURI: event.blockedURI,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
      });
    };

    document.addEventListener('securitypolicyviolation', handleSecurityViolation);
    
    return () => {
      document.removeEventListener('securitypolicyviolation', handleSecurityViolation);
    };
  }, [reportSecurityEvent]);

  // Monitor for unhandled errors (potential security issues)
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Check if error might be security-related
      const securityKeywords = ['xss', 'injection', 'csrf', 'cors', 'csp'];
      const isSecurityRelated = securityKeywords.some(keyword => 
        event.message?.toLowerCase().includes(keyword)
      );
      
      if (isSecurityRelated) {
        reportSecurityEvent('POTENTIAL_SECURITY_ERROR', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      }
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [reportSecurityEvent]);

  const contextValue: SecurityContextType = {
    isSecure,
    securityLevel,
    sanitizeInput,
    validateUrl,
    sanitizeUrl,
    sanitizeFormData,
    validateFormData,
    reportSecurityEvent,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
}

// Security indicator component
export function SecurityIndicator() {
  const { isSecure, securityLevel } = useSecurityContext();
  
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isSecure 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          Security: {securityLevel.toUpperCase()}
        </div>
      </div>
    );
  }
  
  return null;
}
