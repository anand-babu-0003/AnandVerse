"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageViewAction } from '@/actions/admin/analyticsActions';
import { trackPageView, trackEvent } from './google-analytics';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const trackingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (trackingTimeout.current) {
      clearTimeout(trackingTimeout.current);
    }

    // Debounce page view tracking to prevent excessive requests
    trackingTimeout.current = setTimeout(async () => {
      // Only track if pathname actually changed
      if (lastTrackedPath.current === pathname) {
        return;
      }

      try {
        // Get basic device and browser info
        const userAgent = navigator.userAgent;
        const device = /Mobile|Android|iPhone|iPad/.test(userAgent) 
          ? (/iPad/.test(userAgent) ? 'tablet' : 'mobile')
          : 'desktop';
        
        // Get referrer
        const referrer = document.referrer || '';
        
        // Track the page view in your custom analytics (only once per page)
        await trackPageViewAction(
          pathname,
          referrer,
          userAgent,
          undefined, // country - would need IP geolocation service
          device
        );

        // Track the page view in Google Analytics
        trackPageView(window.location.href);

        // Mark this path as tracked
        lastTrackedPath.current = pathname;
      } catch (error) {
        // Silently fail - analytics shouldn't break the app
        console.warn('Analytics tracking failed:', error);
      }
    }, 500); // 500ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (trackingTimeout.current) {
        clearTimeout(trackingTimeout.current);
      }
    };
  }, [pathname]);

  // Initialize session ID only once
  useEffect(() => {
    const existingSessionId = sessionStorage.getItem('analytics_session_id');
    if (!existingSessionId) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
  }, []);

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
    // Also track in Google Analytics
    trackEvent('contact_form_submitted', 'engagement', 'contact_form');
  };

  const trackPortfolioView = async (projectSlug: string) => {
    await trackEvent('portfolio_viewed', { project: projectSlug });
    // Also track in Google Analytics
    trackEvent('portfolio_viewed', 'engagement', projectSlug);
  };

  const trackBlogPostView = async (postSlug: string) => {
    await trackEvent('blog_post_viewed', { post: postSlug });
    // Also track in Google Analytics
    trackEvent('blog_post_viewed', 'engagement', postSlug);
  };

  return {
    trackEvent,
    trackContactFormSubmission,
    trackPortfolioView,
    trackBlogPostView,
  };
}
