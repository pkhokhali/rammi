import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please set DATABASE_URL environment variable.' },
        { status: 503 }
      );
    }

    let user;
    try {
      user = await authenticateUser(email, password);
    } catch (dbError: any) {
      console.error('Database error during login:', dbError);
      return NextResponse.json(
        { error: 'Database connection error. Please check your database configuration.' },
        { status: 503 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

