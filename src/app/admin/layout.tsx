
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

    if (!loggedInStatus && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (loggedInStatus && pathname === '/admin/login') {
      router.replace('/admin/dashboard');
    } else if (loggedInStatus && pathname === '/admin') {
      router.replace('/admin/dashboard');
    }
  }, [pathname, router]);

  // For the login page, just render the children directly without the authenticated layout
  if (pathname === '/admin/login') {
    return <>{children}<Toaster /></>;
  }
  
  // Show a full-screen loader while checking auth status or redirecting
  if (isClientSideLoggedIn === null || isClientSideLoggedIn === false) {
    return <FullScreenLoader />;
  }

  // Once authenticated, render the children without navbar and footer
  // The admin panel has its own layout with sidebar navigation
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Toaster />
    </div>
  );
}
