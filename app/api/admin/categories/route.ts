import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await query('SELECT * FROM categories ORDER BY name');
    return NextResponse.json({ success: true, categories: result.rows });
  } catch (error: any) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

