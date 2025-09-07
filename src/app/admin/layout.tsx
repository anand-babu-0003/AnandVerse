
"use client";

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import FullScreenLoader from '@/components/shared/FullScreenLoader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClientSideLoggedIn, setIsClientSideLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let loggedInStatus = false;
    try {
      loggedInStatus = localStorage.getItem('isAdminLoggedIn') === 'true';
    } catch (e) {
      // In case localStorage is not available (e.g., SSR, secure browser settings)
      console.warn("Could not access localStorage for auth check.");
    }
    setIsClientSideLoggedIn(loggedInStatus);

    // Only handle login redirect, let server-side redirect handle /admin -> /admin/dashboard
    if (!loggedInStatus && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (loggedInStatus && pathname === '/admin/login') {
      router.replace('/admin/dashboard');
    }
  }, [pathname, router]);

  // Always render the same structure to maintain consistent hook calls
  return (
    <div className="min-h-screen bg-background">
      {/* For the login page and admin redirect page, just render the children directly */}
      {pathname === '/admin/login' || pathname === '/admin' ? (
        <>{children}</>
      ) : (
        <>
          {/* Show a full-screen loader while checking auth status or redirecting */}
          {isClientSideLoggedIn === null || isClientSideLoggedIn === false ? (
            <FullScreenLoader />
          ) : (
            /* Once authenticated, render the children - the admin panel has its own layout with sidebar navigation */
            children
          )}
        </>
      )}
      <Toaster />
    </div>
  );
}
