import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const user = verifyToken(token);
    if (!user) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

