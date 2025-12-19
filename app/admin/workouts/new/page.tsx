import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import WorkoutEditor from '@/components/WorkoutEditor';

export default async function NewWorkout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const user = verifyToken(token);
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Workout</h1>
        <WorkoutEditor />
      </div>
    </div>
  );
}

