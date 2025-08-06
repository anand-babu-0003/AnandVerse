
// This file is intentionally left blank.
// A middleware file must exist and export a default function to satisfy Next.js,
// but no middleware logic is currently required for this application.
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // No-op
}

export const config = {
  matcher: '/admin/:path*',
};
