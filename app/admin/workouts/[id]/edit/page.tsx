import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import AdminNavbar from '@/components/AdminNavbar';
import WorkoutEditor from '@/components/WorkoutEditor';

export default async function EditWorkout({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const user = verifyToken(token);
  if (!user) {
    redirect('/admin/login');
  }

  let workout = null;
  try {
    const result = await query('SELECT * FROM workouts WHERE id = $1', [parseInt(params.id)]);
    if (result.rows.length > 0) {
      workout = result.rows[0];
    } else {
      redirect('/admin/workouts');
    }
  } catch (error) {
    console.error('Database error:', error);
    redirect('/admin/workouts');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Workout</h1>
        <WorkoutEditor workout={workout} />
      </div>
    </div>
  );
}

