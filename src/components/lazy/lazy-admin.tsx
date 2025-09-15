"use client";

import dynamic from 'next/dynamic';

// Lazy load heavy admin components
export const LazyComprehensiveDashboard = dynamic(
  () => import('@/components/admin/comprehensive-dashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export const LazyComprehensiveAnalyticsDashboard = dynamic(
  () => import('@/components/admin/comprehensive-analytics-dashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export const LazyComprehensiveBlogManagement = dynamic(
  () => import('@/components/admin/comprehensive-blog-management'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export const LazyComprehensiveMessagesManagement = dynamic(
  () => import('@/components/admin/comprehensive-messages-management'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export const LazyComprehensivePortfolioManagement = dynamic(
  () => import('@/components/admin/comprehensive-portfolio-management'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export const LazyFirestoreDashboard = dynamic(
  () => import('@/components/admin/firestore-dashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

