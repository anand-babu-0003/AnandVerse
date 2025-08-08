import type React from 'react';

// This layout is intentionally minimal. It applies to the entire /admin route,
// but the shared sidebar/header layout is applied within the (authenticated) route group.
// This allows the /admin/login page to have its own separate layout without the admin panel UI.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
