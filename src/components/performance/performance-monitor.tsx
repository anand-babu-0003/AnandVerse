"use client";

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in browser and if performance API is available
    if (typeof window === 'undefined' || !window.performance) return;

    const measurePerformance = () => {
      // Core Web Vitals
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        // First Contentful Paint
        const fcpEntries = performance.getEntriesByName('first-contentful-paint');
        const fcp: PerformanceEntry | null = fcpEntries.length > 0 ? fcpEntries[0] : null;
        
        // Use modern Performance Observer API
        let lcp: PerformanceEntry | null = null;
        let fid: PerformanceEntry | null = null;
        let cls: PerformanceEntry | null = null;

        // Use Performance Observer for modern metrics
        if ('PerformanceObserver' in window) {
          try {
            // LCP Observer
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              lcp = entries[entries.length - 1];
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // FID Observer
            const fidObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              fid = entries[0];
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // CLS Observer
            const clsObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              cls = entries[0];
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
          } catch (e) {
            // Silently handle unsupported APIs
          }
        }

        const metrics = {
          // Navigation timing
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          loadComplete: navigation.loadEventEnd - navigation.fetchStart,
          
          // Core Web Vitals
          fcp: fcp ? fcp.startTime : null,
          lcp: lcp ? (lcp as any).startTime : null,
          fid: fid ? (fid as any).processingStart - (fid as any).startTime : null,
          cls: cls ? (cls as any).value : null,
          
          // Additional metrics
          ttf: navigation.responseEnd - navigation.requestStart, // Time to First Byte
          domInteractive: navigation.domInteractive - navigation.fetchStart,
          
          // Resource timing
          totalResources: performance.getEntriesByType('resource').length,
          
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        };

        // Only log performance metrics in development if there are critical issues
        if (process.env.NODE_ENV === 'development') {
          const hasCriticalIssues = (metrics.fcp && metrics.fcp > 3000) || 
                                   (metrics.lcp && metrics.lcp > 5000) || 
                                   (metrics.fid && metrics.fid > 200) || 
                                   (metrics.cls && metrics.cls > 0.25);
          
          if (hasCriticalIssues) {
            console.warn('Critical Performance Issues:', {
              fcp: metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A',
              lcp: metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A',
              fid: metrics.fid ? `${metrics.fid.toFixed(0)}ms` : 'N/A',
              cls: metrics.cls ? metrics.cls.toFixed(3) : 'N/A'
            });
          }
        }
        
        // Send to Google Analytics if available
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'performance_metrics', {
            event_category: 'Performance',
            custom_map: {
              fcp: metrics.fcp,
              lcp: metrics.lcp,
              fid: metrics.fid,
              cls: metrics.cls,
            }
          });
        }

        // Check for performance issues
        const issues: string[] = [];
        
        if (metrics.fcp && metrics.fcp > 1800) {
          issues.push(`FCP is slow: ${metrics.fcp.toFixed(0)}ms (should be < 1800ms)`);
        }
        
        if (metrics.lcp && metrics.lcp > 2500) {
          issues.push(`LCP is slow: ${metrics.lcp.toFixed(0)}ms (should be < 2500ms)`);
        }
        
        if (metrics.fid && metrics.fid > 100) {
          issues.push(`FID is slow: ${metrics.fid.toFixed(0)}ms (should be < 100ms)`);
        }
        
        if (metrics.cls && metrics.cls > 0.1) {
          issues.push(`CLS is poor: ${metrics.cls.toFixed(3)} (should be < 0.1)`);
        }
        
        // Only log performance issues if they are critical (much higher thresholds)
        if (issues.length > 0 && process.env.NODE_ENV === 'development') {
          const criticalIssues = issues.filter(issue => 
            issue.includes('FCP is slow') && parseFloat(issue.match(/\d+/)?.[0] || '0') > 15000 || // Much higher threshold
            issue.includes('LCP is slow') && parseFloat(issue.match(/\d+/)?.[0] || '0') > 30000 || // Much higher threshold  
            issue.includes('FID is slow') && parseFloat(issue.match(/\d+/)?.[0] || '0') > 1000 || // Much higher threshold
            issue.includes('CLS is poor') && parseFloat(issue.match(/[\d.]+/)?.[0] || '0') > 1.0 // Much higher threshold
          );
          
          if (criticalIssues.length > 0) {
            console.warn('Critical Performance Issues:', criticalIssues);
          }
        }
      }
    };

    // Measure performance after page load (only once)
    const measureAfterLoad = () => {
      setTimeout(measurePerformance, 5000); // Wait 5 seconds after load to reduce noise
    };

    if (document.readyState === 'complete') {
      measureAfterLoad();
    } else {
      window.addEventListener('load', measureAfterLoad);
    }

    // Monitor for layout shifts using modern Performance Observer
    let clsValue = 0;
    let lcpValue = null;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        } else if (entry.entryType === 'largest-contentful-paint') {
          lcpValue = entry.startTime;
          // Only log LCP in development if it's critically slow (and reasonable)
          if (process.env.NODE_ENV === 'development' && lcpValue > 10000 && lcpValue < 60000) {
            console.warn('Critical LCP:', lcpValue.toFixed(0) + 'ms');
          }
        }
      }
    });

    try {
      // Use modern Performance Observer API
      if ('PerformanceObserver' in window) {
        observer.observe({ type: 'layout-shift', buffered: true });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      }
    } catch (e) {
      // Performance Observer not supported or specific types not available
      console.warn('Performance Observer not fully supported:', e);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

// Performance utilities
export function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      // Only log in development and if it takes longer than 100ms
      if (process.env.NODE_ENV === 'development' && (end - start) > 100) {
        console.log(`${name} took ${(end - start).toFixed(2)}ms`);
      }
      resolve(result);
    } catch (error) {
      const end = performance.now();
      console.error(`${name} failed after ${(end - start).toFixed(2)}ms:`, error);
      reject(error);
    }
  });
}

export function measureSync<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    const result = fn();
    const end = performance.now();
    // Only log in development and if it takes longer than 50ms
    if (process.env.NODE_ENV === 'development' && (end - start) > 50) {
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    }
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`${name} failed after ${(end - start).toFixed(2)}ms:`, error);
    throw error;
  }
}

