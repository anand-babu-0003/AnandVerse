
"use client"; 

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebaseConfig';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/toaster';
import FullScreenLoader from '@/components/shared/FullScreenLoader'; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('isAdminLoggedIn', 'true'); // Keep for session continuity
        if (pathname === '/admin/login') {
          router.replace('/admin/dashboard');
        }
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdminLoggedIn');
        if (pathname !== '/admin/login') {
          router.replace('/admin/login');
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [pathname, router, auth]);


  if (isAuthenticated === null) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
      // While redirecting, show a loader to prevent flicker
      return <FullScreenLoader />;
  }
  
  if (pathname === '/admin/login') {
    return <>{children}<Toaster /></>;
  }

  return (
    <div className="flex h-screen bg-muted/10">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
