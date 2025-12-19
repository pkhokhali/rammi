import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/middleware';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, category_id, meta_title, meta_description, is_active } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await query('SELECT id FROM diet_content WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Content with this title already exists' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO diet_content (category_id, title, slug, content, meta_title, meta_description, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        category_id || null,
        title,
        slug,
        content,
        meta_title || null,
        meta_description || null,
        is_active ?? true,
      ]
    );

    return NextResponse.json({ success: true, dietContent: result.rows[0] });
  } catch (error: any) {
    console.error('Create diet content error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

