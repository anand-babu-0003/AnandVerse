"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageViewAction } from '@/actions/admin/analyticsActions';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view when pathname changes
    const trackPageView = async () => {
      try {
        // Get basic device and browser info
        const userAgent = navigator.userAgent;
        const device = /Mobile|Android|iPhone|iPad/.test(userAgent) 
          ? (/iPad/.test(userAgent) ? 'tablet' : 'mobile')
          : 'desktop';
        
        // Get referrer
        const referrer = document.referrer || '';
        
        // Track the page view
        await trackPageViewAction(
          pathname,
          referrer,
          userAgent,
          undefined, // country - would need IP geolocation service
          device
        );
      } catch (error) {
        // Silently fail - analytics shouldn't break the app
        console.warn('Analytics tracking failed:', error);
      }
    };

    // Track page view
    trackPageView();

    // Track session start (simplified)
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);

  }, [pathname]);

  // This component doesn't render anything
  return null;
}

// Hook for manual analytics tracking
export function useAnalytics() {
  const trackEvent = async (eventName: string, properties?: Record<string, any>) => {
    try {
      // You can extend this to track custom events
      console.log('Analytics Event:', eventName, properties);
    } catch (error) {
      console.warn('Analytics event tracking failed:', error);
    }
  };

  const trackContactFormSubmission = async () => {
    await trackEvent('contact_form_submitted');
  };

  const trackPortfolioView = async (projectSlug: string) => {
    await trackEvent('portfolio_viewed', { project: projectSlug });
  };

  const trackBlogPostView = async (postSlug: string) => {
    await trackEvent('blog_post_viewed', { post: postSlug });
  };

  return {
    trackEvent,
    trackContactFormSubmission,
    trackPortfolioView,
    trackBlogPostView,
  };
}
