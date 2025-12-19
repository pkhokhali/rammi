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
    const { title, description, content, duration, difficulty, workout_type } = body;

    if (!title || !content || !duration || !difficulty || !workout_type) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await query('SELECT id FROM workouts WHERE slug = $1 AND id != $2', [slug, id]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A workout with this title already exists' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE workouts 
       SET title = $1, slug = $2, description = $3, content = $4, duration = $5, 
           difficulty = $6, workout_type = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, slug, description || null, content, duration, difficulty, workout_type, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, workout: result.rows[0] });
  } catch (error: any) {
    console.error('Update workout error:', error);
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
    await query('DELETE FROM workouts WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete workout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

