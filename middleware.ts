import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth-edge';

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Protect admin routes (except login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      const token = request.cookies.get('auth_token')?.value;

      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      try {
        // Use Edge-compatible token verification
        // Note: This is a basic check. Full verification happens in page components
        const user = verifyTokenEdge(token);
        if (!user) {
          const response = NextResponse.redirect(new URL('/admin/login', request.url));
          response.cookies.delete('auth_token');
          return response;
        }
      } catch (tokenError) {
        // If token verification fails, redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    }

    return NextResponse.next();
  } catch (error: any) {
    // If middleware fails completely, log and allow request through
    // Pages will handle authentication properly
    console.error('Middleware error:', error?.message || error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

