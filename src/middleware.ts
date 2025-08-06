
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';

export function middleware(request: NextRequest) {
  const cookie = cookies().get(SESSION_COOKIE_NAME);

  if (!cookie && request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (cookie && request.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
