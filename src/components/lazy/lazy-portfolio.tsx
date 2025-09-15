"use client";

import dynamic from 'next/dynamic';

// Lazy load portfolio components
export const LazyInteractiveCard = dynamic(
  () => import('@/components/portfolio/interactive-card').then(mod => ({ default: mod.InteractiveCard })),
  { 
    ssr: true,
    loading: () => (
      <div className="bg-card rounded-lg shadow-sm border p-4 animate-pulse">
        <div className="aspect-[4/3] bg-muted rounded mb-4"></div>
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-3 bg-muted rounded w-3/4"></div>
      </div>
    )
  }
);

export const LazyProfessionalShowcase = dynamic(
  () => import('@/components/portfolio/professional-showcase').then(mod => ({ default: mod.ProfessionalShowcase })),
  { 
    ssr: true,
    loading: () => (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-muted rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
            <div className="aspect-[16/9] bg-muted rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
);

export const LazyPortfolioGrid = dynamic(
  () => import('@/components/portfolio/portfolio-grid').then(mod => ({ default: mod.PortfolioGrid })),
  { 
    ssr: true,
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg shadow-sm border animate-pulse">
            <div className="aspect-[4/3] bg-muted rounded-t-lg"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
);

