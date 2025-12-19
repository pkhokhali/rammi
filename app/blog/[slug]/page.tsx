import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, Tag } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const result = await query('SELECT * FROM blogs WHERE slug = $1 AND is_published = true', [params.slug]);
  
  if (result.rows.length === 0) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const blog = result.rows[0];
  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const result = await query('SELECT * FROM blogs WHERE slug = $1 AND is_published = true', [params.slug]);

  if (result.rows.length === 0) {
    notFound();
  }

  const blog = result.rows[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <article className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {blog.featured_image && (
              <div className="h-64 md:h-96 bg-gradient-to-br from-purple-400 to-purple-600"></div>
            )}
            
            <div className="p-8 md:p-12">
              <div className="mb-6">
                {blog.category && (
                  <span className="text-primary-600 font-medium">{blog.category}</span>
                )}
                {blog.published_at && (
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(blog.published_at), 'MMMM d, yyyy')}
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-xl text-gray-600 mb-8">{blog.excerpt}</p>
              )}

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag className="h-5 w-5 text-gray-400" />
                    {blog.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

