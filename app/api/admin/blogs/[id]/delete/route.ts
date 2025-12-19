import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/middleware';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    await query('DELETE FROM blogs WHERE id = $1', [id]);
    return NextResponse.redirect(new URL('/admin/blogs', request.url));
  } catch (error: any) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

