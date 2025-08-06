
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  // If trying to access an admin page (and not the login page itself) without a session
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If trying to access the login page while already having a session
  if (pathname === '/admin/login' && sessionCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  return NextResponse.next();
}
