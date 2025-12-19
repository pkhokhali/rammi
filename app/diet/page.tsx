import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Apple, ArrowRight } from 'lucide-react';
import { AnimatedCard, AnimatedSection } from '@/components/AnimatedCards';
import AnimatedIcon from '@/components/AnimatedIcon';

export const metadata = {
  title: 'Diet & Nutrition - HealthFit',
  description: 'Expert nutrition guidance for weight loss, weight gain, diabetes, heart health, and muscle building.',
};

export default async function DietPage() {
  let categories: any[] = [];
  let dietContent: any[] = [];

  try {
    const categoriesResult = await query('SELECT * FROM categories ORDER BY name');
    categories = categoriesResult.rows;

    const contentResult = await query(`
      SELECT dc.*, c.name as category_name, c.slug as category_slug 
      FROM diet_content dc 
      LEFT JOIN categories c ON dc.category_id = c.id 
      WHERE dc.is_active = true 
      ORDER BY c.name, dc.title
    `);
    dietContent = contentResult.rows;
  } catch (error) {
    console.error('Database error:', error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Diet & Nutrition</h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Expert guidance for your nutritional needs
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nutrition Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <AnimatedCard key={category.id} delay={index * 0.1}>
                <Link
                  href={`/diet/${category.slug}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 group hover-lift block"
                >
                  <div className="flex items-center mb-6">
                    <AnimatedIcon className="bg-gradient-to-br from-primary-100 to-primary-200 p-4 rounded-xl mr-4">
                      <Apple className="h-10 w-10 text-primary-600" fill="currentColor" />
                    </AnimatedIcon>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                      {category.name}
                    </h3>
                  </div>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">{category.description}</p>
                  )}
                  <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Learn more <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Diet Content */}
        {dietContent.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Content</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {dietContent.map((content) => (
                <div key={content.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {content.image_url && (
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600"></div>
                  )}
                  <div className="p-6">
                    <span className="text-sm text-primary-600 font-medium">{content.category_name}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3">{content.title}</h3>
                    <div 
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: content.content.substring(0, 150) + '...' }}
                    />
                    <Link
                      href={`/diet/${content.category_slug}/${content.slug}`}
                      className="inline-flex items-center text-primary-600 font-medium mt-4"
                    >
                      Read more <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No categories available yet. Check back soon!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

