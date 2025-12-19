import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminWorkouts() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const user = verifyToken(token);
  if (!user) {
    redirect('/admin/login');
  }

  let workouts: any[] = [];

  try {
    const result = await query('SELECT * FROM workouts ORDER BY created_at DESC');
    workouts = result.rows;
  } catch (error) {
    console.error('Database error:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
            <p className="text-gray-600 mt-2">Manage workout plans</p>
          </div>
          <Link
            href="/admin/workouts/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Workout
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workouts.map((workout) => (
                <tr key={workout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{workout.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                      {workout.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {workout.workout_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workout.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/workouts/${workout.id}/edit`}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <form action={`/api/admin/workouts/${workout.id}/delete`} method="POST" className="inline">
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          onClick={(e) => {
                            if (!confirm('Are you sure you want to delete this workout?')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {workouts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No workouts yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

