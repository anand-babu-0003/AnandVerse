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
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        // Largest Contentful Paint
        const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
        // First Input Delay
        const fid = performance.getEntriesByType('first-input')[0];
        // Cumulative Layout Shift
        const cls = performance.getEntriesByType('layout-shift')[0];

        const metrics = {
          // Navigation timing
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          loadComplete: navigation.loadEventEnd - navigation.navigationStart,
          
          // Core Web Vitals
          fcp: fcp ? fcp.startTime : null,
          lcp: lcp ? lcp.startTime : null,
          fid: fid ? fid.processingStart - fid.startTime : null,
          cls: cls ? cls.value : null,
          
          // Additional metrics
          ttf: navigation.responseEnd - navigation.requestStart, // Time to First Byte
          domInteractive: navigation.domInteractive - navigation.navigationStart,
          
          // Resource timing
          totalResources: performance.getEntriesByType('resource').length,
          
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        };

        // Log performance metrics (you can send these to analytics)
        console.log('Performance Metrics:', metrics);
        
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
        
        if (issues.length > 0) {
          console.warn('Performance Issues Detected:', issues);
        }
      }
    };

    // Measure performance after page load
    const measureAfterLoad = () => {
      setTimeout(measurePerformance, 1000); // Wait 1 second after load
    };

    if (document.readyState === 'complete') {
      measureAfterLoad();
    } else {
      window.addEventListener('load', measureAfterLoad);
    }

    // Monitor for layout shifts
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Layout shift observation not supported
    }

    // Monitor for largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP observation not supported
    }

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
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
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
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
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`${name} failed after ${(end - start).toFixed(2)}ms:`, error);
    throw error;
  }
}

