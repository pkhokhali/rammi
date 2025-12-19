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
    const { title, content, excerpt, category, tags, meta_title, meta_description, is_published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existing = await query('SELECT id FROM blogs WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A blog post with this title already exists' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO blogs (title, slug, content, excerpt, category, tags, meta_title, meta_description, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title,
        slug,
        content,
        excerpt || null,
        category || null,
        tags || [],
        meta_title || null,
        meta_description || null,
        is_published || false,
        is_published ? new Date() : null,
      ]
    );

    return NextResponse.json({ success: true, blog: result.rows[0] });
  } catch (error: any) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

