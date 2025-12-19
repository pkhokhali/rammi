import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import AdminNavbar from '@/components/AdminNavbar';
import DietEditor from '@/components/DietEditor';

export default async function EditDiet({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const user = verifyToken(token);
  if (!user) {
    redirect('/admin/login');
  }

  let dietContent = null;
  try {
    const result = await query('SELECT * FROM diet_content WHERE id = $1', [parseInt(params.id)]);
    if (result.rows.length > 0) {
      dietContent = result.rows[0];
    } else {
      redirect('/admin/diet');
    }
  } catch (error) {
    console.error('Database error:', error);
    redirect('/admin/diet');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Diet Content</h1>
        <DietEditor dietContent={dietContent} />
      </div>
    </div>
  );
}

