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

    const existing = await query('SELECT id FROM diet_content WHERE slug = $1 AND id != $2', [slug, id]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Content with this title already exists' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE diet_content 
       SET category_id = $1, title = $2, slug = $3, content = $4, meta_title = $5, 
           meta_description = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        category_id || null,
        title,
        slug,
        content,
        meta_title || null,
        meta_description || null,
        is_active ?? true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Diet content not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, dietContent: result.rows[0] });
  } catch (error: any) {
    console.error('Update diet content error:', error);
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
    await query('DELETE FROM diet_content WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete diet content error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

