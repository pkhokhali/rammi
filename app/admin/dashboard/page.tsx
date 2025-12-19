import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';
import { FileText, Dumbbell, Apple, Image, LogOut, Settings } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const user = verifyToken(token);
  if (!user) {
    redirect('/admin/login');
  }

  // Get stats
  let stats = {
    blogs: 0,
    workouts: 0,
    dietContent: 0,
    media: 0,
  };

  try {
    const [blogsResult, workoutsResult, dietResult, mediaResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM blogs'),
      query('SELECT COUNT(*) as count FROM workouts'),
      query('SELECT COUNT(*) as count FROM diet_content'),
      query('SELECT COUNT(*) as count FROM media'),
    ]);

    stats = {
      blogs: parseInt(blogsResult.rows[0]?.count || '0'),
      workouts: parseInt(workoutsResult.rows[0]?.count || '0'),
      dietContent: parseInt(dietResult.rows[0]?.count || '0'),
      media: parseInt(mediaResult.rows[0]?.count || '0'),
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Blog Articles</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.blogs}</p>
              </div>
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <Link href="/admin/blogs" className="text-blue-600 text-sm font-medium mt-4 inline-block">
              Manage →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Workouts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.workouts}</p>
              </div>
              <Dumbbell className="h-12 w-12 text-green-600" />
            </div>
            <Link href="/admin/workouts" className="text-green-600 text-sm font-medium mt-4 inline-block">
              Manage →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Diet Content</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.dietContent}</p>
              </div>
              <Apple className="h-12 w-12 text-orange-600" />
            </div>
            <Link href="/admin/diet" className="text-orange-600 text-sm font-medium mt-4 inline-block">
              Manage →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Media Files</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.media}</p>
              </div>
              <Image className="h-12 w-12 text-purple-600" />
            </div>
            <Link href="/admin/media" className="text-purple-600 text-sm font-medium mt-4 inline-block">
              Manage →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/blogs/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <FileText className="h-6 w-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">New Blog Post</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new health article</p>
            </Link>
            <Link
              href="/admin/workouts/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <Dumbbell className="h-6 w-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">New Workout</h3>
              <p className="text-sm text-gray-600 mt-1">Add a new workout plan</p>
            </Link>
            <Link
              href="/admin/diet/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <Apple className="h-6 w-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">New Diet Content</h3>
              <p className="text-sm text-gray-600 mt-1">Add nutrition content</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

