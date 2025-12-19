'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, X } from 'lucide-react';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface BlogEditorProps {
  blog?: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    meta_title: string;
    meta_description: string;
    is_published: boolean;
  };
}

export default function BlogEditor({ blog }: BlogEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [category, setCategory] = useState(blog?.category || '');
  const [tags, setTags] = useState(blog?.tags?.join(', ') || '');
  const [metaTitle, setMetaTitle] = useState(blog?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(blog?.meta_description || '');
  const [isPublished, setIsPublished] = useState(blog?.is_published || false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

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
      const response = await fetch(blog ? `/api/admin/blogs/${blog.id}` : '/api/admin/blogs', {
        method: blog ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          category,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          meta_title: metaTitle,
          meta_description: metaDescription,
          is_published: isPublished,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save blog post');
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
            placeholder="Blog post title"
          />
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
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Short description for preview"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Nutrition, Fitness"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="health, nutrition, fitness"
            />
          </div>
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
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
            Publish immediately
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

