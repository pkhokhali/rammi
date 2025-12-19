import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  const user = verifyToken(token);
  return user;
}

export function requireAuth(request: NextRequest): { user: any } | null {
  const user = authMiddleware(request);
  
  if (!user) {
    return null;
  }

  return { user };
}

export function requireRole(request: NextRequest, allowedRoles: string[]): { user: any } | null {
  const user = authMiddleware(request);
  
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return { user };
}

