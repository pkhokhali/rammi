'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Home, Settings } from 'lucide-react';

interface AdminNavbarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
              Admin Panel
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                Dashboard
              </Link>
              <Link href="/admin/blogs" className="text-gray-700 hover:text-primary-600 transition">
                Blogs
              </Link>
              <Link href="/admin/workouts" className="text-gray-700 hover:text-primary-600 transition">
                Workouts
              </Link>
              <Link href="/admin/diet" className="text-gray-700 hover:text-primary-600 transition">
                Diet Content
              </Link>
              <Link href="/admin/media" className="text-gray-700 hover:text-primary-600 transition">
                Media
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden md:block">{user.name}</span>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <Home size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

