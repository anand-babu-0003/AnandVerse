// Performance optimization utilities

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Preload critical resources
export function preloadResource(href: string, as: string, crossorigin?: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  
  document.head.appendChild(link);
}

// Preconnect to external domains
export function preconnectDomain(href: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  
  document.head.appendChild(link);
}

// Optimize images by adding loading="lazy"
export function addLazyLoading() {
  if (typeof document === 'undefined') return;
  
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img) => {
    (img as HTMLImageElement).loading = 'lazy';
  });
}

// Remove unused CSS (basic implementation)
export function removeUnusedCSS() {
  if (typeof document === 'undefined') return;
  
  // This is a basic implementation
  // In production, you'd use tools like PurgeCSS
  const styleSheets = document.querySelectorAll('style, link[rel="stylesheet"]');
  styleSheets.forEach((sheet) => {
    // Check if stylesheet is actually used
    // This is simplified - real implementation would be more complex
    if (sheet instanceof HTMLStyleElement) {
      // Basic check for unused styles
      const textContent = sheet.textContent || '';
      if (textContent.length > 0) {
        // Keep the stylesheet
        return;
      }
    }
  });
}

// Performance budget checker
export interface PerformanceBudget {
  maxBundleSize: number; // in KB
  maxImageSize: number; // in KB
  maxCssSize: number; // in KB
  maxJsSize: number; // in KB
}

export function checkPerformanceBudget(budget: PerformanceBudget): boolean {
  if (typeof window === 'undefined') return true;
  
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  let totalSize = 0;
  let imageSize = 0;
  let cssSize = 0;
  let jsSize = 0;
  
  resources.forEach((resource) => {
    const size = resource.transferSize || 0;
    totalSize += size;
    
    if (resource.name.includes('.css')) {
      cssSize += size;
    } else if (resource.name.includes('.js')) {
      jsSize += size;
    } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
      imageSize += size;
    }
  });
  
  const budgetChecks = {
    bundle: totalSize / 1024 <= budget.maxBundleSize,
    images: imageSize / 1024 <= budget.maxImageSize,
    css: cssSize / 1024 <= budget.maxCssSize,
    js: jsSize / 1024 <= budget.maxJsSize,
  };
  
  const allPassed = Object.values(budgetChecks).every(Boolean);
  
  if (!allPassed) {
    console.warn('Performance budget exceeded:', {
      budget,
      actual: {
        bundle: totalSize / 1024,
        images: imageSize / 1024,
        css: cssSize / 1024,
        js: jsSize / 1024,
      },
      checks: budgetChecks,
    });
  }
  
  return allPassed;
}

// Default performance budget
export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  maxBundleSize: 500, // 500KB
  maxImageSize: 1000, // 1MB
  maxCssSize: 100, // 100KB
  maxJsSize: 300, // 300KB
};

