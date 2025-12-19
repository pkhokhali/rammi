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

    const existing = await query('SELECT id FROM workouts WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A workout with this title already exists' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO workouts (title, slug, description, content, duration, difficulty, workout_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, slug, description || null, content, duration, difficulty, workout_type]
    );

    return NextResponse.json({ success: true, workout: result.rows[0] });
  } catch (error: any) {
    console.error('Create workout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

