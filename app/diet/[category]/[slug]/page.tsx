import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Apple } from 'lucide-react';

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const result = await query(
    `SELECT dc.*, c.name as category_name 
     FROM diet_content dc 
     LEFT JOIN categories c ON dc.category_id = c.id 
     WHERE dc.slug = $1 AND dc.is_active = true`,
    [params.slug]
  );
  
  if (result.rows.length === 0) {
    return {
      title: 'Content Not Found',
    };
  }

  const content = result.rows[0];
  return {
    title: content.meta_title || content.title,
    description: content.meta_description,
  };
}

export default async function DietContentPage({ params }: { params: { category: string; slug: string } }) {
  const result = await query(
    `SELECT dc.*, c.name as category_name, c.slug as category_slug 
     FROM diet_content dc 
     LEFT JOIN categories c ON dc.category_id = c.id 
     WHERE dc.slug = $1 AND dc.is_active = true`,
    [params.slug]
  );

  if (result.rows.length === 0) {
    notFound();
  }

  const content = result.rows[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {content.image_url ? (
              <div className="h-64 md:h-96 bg-gradient-to-br from-primary-400 to-primary-600"></div>
            ) : (
              <div className="h-64 md:h-96 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Apple className="h-24 w-24 text-white opacity-80" />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              {content.category_name && (
                <div className="mb-6">
                  <span className="text-primary-600 font-medium">{content.category_name}</span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                {content.title}
              </h1>

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

