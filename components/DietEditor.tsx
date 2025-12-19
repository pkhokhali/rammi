'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, X } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface DietEditorProps {
  dietContent?: {
    id: number;
    category_id: number;
    title: string;
    content: string;
    meta_title: string;
    meta_description: string;
    is_active: boolean;
  };
}

export default function DietEditor({ dietContent }: DietEditorProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState(dietContent?.title || '');
  const [content, setContent] = useState(dietContent?.content || '');
  const [categoryId, setCategoryId] = useState(dietContent?.category_id?.toString() || '');
  const [metaTitle, setMetaTitle] = useState(dietContent?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(dietContent?.meta_description || '');
  const [isActive, setIsActive] = useState(dietContent?.is_active ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const response = await fetch(
        dietContent ? `/api/admin/diet/${dietContent.id}` : '/api/admin/diet',
        {
          method: dietContent ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            category_id: categoryId ? parseInt(categoryId) : null,
            meta_title: metaTitle,
            meta_description: metaDescription,
            is_active: isActive,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        router.push('/admin/diet');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save diet content');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Diet content title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillModules}
            theme="snow"
            className="bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title (SEO)
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="SEO title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description (SEO)
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="SEO description"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition inline-flex items-center"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}

