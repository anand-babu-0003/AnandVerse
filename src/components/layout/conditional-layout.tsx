"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if the current path is an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  
  // For admin routes, don't show navbar and footer
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // For all other routes, show the normal layout with navbar and footer
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
