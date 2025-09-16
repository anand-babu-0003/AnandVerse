"use client";

import dynamic from 'next/dynamic';

// Lazy load analytics components to reduce initial bundle size
export const LazyAnalyticsTracker = dynamic(
  () => import('@/components/analytics/analytics-tracker').then(mod => ({ default: mod.AnalyticsTracker })),
  { 
    ssr: false,
    loading: () => null
  }
);

// LazyGoogleAnalytics removed - now using direct head script implementation

export const LazyGoogleAdSense = dynamic(
  () => import('@/components/analytics/google-adsense').then(mod => ({ default: mod.GoogleAdSense })),
  { 
    ssr: false,
    loading: () => null
  }
);

export const LazyPerformanceMonitor = dynamic(
  () => import('@/components/performance/performance-monitor').then(mod => ({ default: mod.PerformanceMonitor })),
  { 
    ssr: false,
    loading: () => null
  }
);
