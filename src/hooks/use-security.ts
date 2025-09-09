"use client";

import { useEffect, useCallback } from 'react';
import { logSecurityEvent } from '@/lib/security';

// Simplified security hook without console monitoring to prevent circular dependency
export function useSecurity() {
  // Simple input sanitization
  const sanitizeInput = useCallback((input: string): string => {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .slice(0, 10000);
  }, []);

  // Detect if running in iframe (potential clickjacking)
  const detectIframe = useCallback(() => {
    if (window.self !== window.top) {
      // Prevent iframe embedding
      if (window.top) {
        window.top.location = window.location;
      }
    }
  }, []);

  // Initialize basic security measures
  useEffect(() => {
    detectIframe();
  }, [detectIframe]);

  return {
    sanitizeInput,
    detectIframe,
  };
}

// Hook for form security
export function useFormSecurity() {
  const sanitizeFormData = useCallback((data: Record<string, any>) => {
    const sanitized: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sanitized[key] = value
          .trim()
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .slice(0, 10000);
      } else {
        sanitized[key] = value;
      }
    });
    
    return sanitized;
  }, []);

  const validateFormData = useCallback((data: Record<string, any>) => {
    const errors: string[] = [];
    
    // Check for suspicious patterns
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const suspiciousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /data:text\/html/i,
          /vbscript:/i,
        ];
        
        if (suspiciousPatterns.some(pattern => pattern.test(value))) {
          errors.push(`Suspicious content detected in ${key}`);
        }
      }
    });
    
    return errors;
  }, []);

  return {
    sanitizeFormData,
    validateFormData,
  };
}

// Hook for URL security
export function useUrlSecurity() {
  const validateUrl = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
      
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return false;
      }
      
      // Check for suspicious domains or patterns
      const suspiciousPatterns = [
        /\.\.\//,
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
      ];
      
      return !suspiciousPatterns.some(pattern => pattern.test(url));
    } catch {
      return false;
    }
  }, []);

  const sanitizeUrl = useCallback((url: string): string => {
    try {
      const urlObj = new URL(url);
      
      // Remove potentially dangerous parameters
      const dangerousParams = ['javascript', 'data', 'vbscript'];
      dangerousParams.forEach(param => {
        urlObj.searchParams.delete(param);
      });
      
      return urlObj.toString();
    } catch {
      return '';
    }
  }, []);

  return {
    validateUrl,
    sanitizeUrl,
  };
}
