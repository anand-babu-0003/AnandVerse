
import type React from 'react';

// This layout ensures the login page does not inherit the main admin sidebar and header.
// It simply renders its children directly, creating a dedicated page.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
