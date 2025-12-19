import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { AnimatedCard, AnimatedSection, AnimatedScaling } from '@/components/AnimatedCards';

export const metadata = {
  title: 'Health Blog - HealthFit',
  description: 'Expert health, diet, and fitness articles and guides.',
};

export default async function BlogPage() {
  let blogs: any[] = [];

  try {
    const result = await query(`
      SELECT * FROM blogs 
      WHERE is_published = true 
      ORDER BY published_at DESC, created_at DESC
      LIMIT 20
    `);
    blogs = result.rows;
  } catch (error) {
    console.error('Database error:', error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Health Blog</h1>
            <p className="text-xl md:text-2xl text-purple-100">
              Expert insights on health, diet, and fitness
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <AnimatedCard key={blog.id} delay={index * 0.1}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group hover-lift block"
                >
                  {blog.featured_image ? (
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                      <AnimatedScaling className="text-white text-6xl font-bold opacity-80">
                        H
                      </AnimatedScaling>
                    </div>
                  )}
                  <div className="p-6">
                    {blog.category && (
                      <span className="text-sm text-primary-600 font-semibold">{blog.category}</span>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 mt-3 mb-3 group-hover:text-primary-600 transition line-clamp-2">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {blog.published_at && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(new Date(blog.published_at), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      <span className="text-primary-600 font-semibold group-hover:underline inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Read more <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span key={idx} className="text-xs bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 px-3 py-1 rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

