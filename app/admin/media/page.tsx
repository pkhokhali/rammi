import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';

export default async function AdminMedia() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-2">Upload and manage images</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">Image upload functionality</p>
            <p className="text-sm text-gray-500">
              To implement: Use a file upload service or Next.js API route with multer/sharp for image processing.
              Store file paths in the media table and serve from /public/uploads or a CDN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

