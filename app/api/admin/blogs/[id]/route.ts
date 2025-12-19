import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/middleware';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
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

    // Check if slug exists for another blog
    const existing = await query('SELECT id FROM blogs WHERE slug = $1 AND id != $2', [slug, id]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A blog post with this title already exists' },
        { status: 400 }
      );
    }

    // Get current blog to check if publishing status changed
    const current = await query('SELECT is_published FROM blogs WHERE id = $1', [id]);
    const wasPublished = current.rows[0]?.is_published;
    const publishedAt = !wasPublished && is_published ? new Date() : null;

    const result = await query(
      `UPDATE blogs 
       SET title = $1, slug = $2, content = $3, excerpt = $4, category = $5, tags = $6, 
           meta_title = $7, meta_description = $8, is_published = $9, 
           published_at = COALESCE($10, published_at), updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
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
        publishedAt,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog: result.rows[0] });
  } catch (error: any) {
    console.error('Update blog error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

