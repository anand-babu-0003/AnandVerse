import type React from 'react';

// This root layout for the /admin section is now very simple.
// It just passes children through.
// The actual admin panel layout with sidebars is in /(authenticated)/layout.tsx
// The login page has its own layout in /login/layout.tsx
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
