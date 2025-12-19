import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Clock, TrendingUp, Home, Building } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const result = await query('SELECT * FROM workouts WHERE slug = $1 AND is_active = true', [params.slug]);
  
  if (result.rows.length === 0) {
    return {
      title: 'Workout Not Found',
    };
  }

  const workout = result.rows[0];
  return {
    title: workout.title,
    description: workout.description,
  };
}

export default async function WorkoutPage({ params }: { params: { slug: string } }) {
  const result = await query('SELECT * FROM workouts WHERE slug = $1 AND is_active = true', [params.slug]);

  if (result.rows.length === 0) {
    notFound();
  }

  const workout = result.rows[0];

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {workout.image_url ? (
              <div className="h-64 md:h-96 bg-gradient-to-br from-blue-400 to-blue-600"></div>
            ) : (
              <div className="h-64 md:h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <TrendingUp className="h-24 w-24 text-white opacity-80" />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    difficultyColors[workout.difficulty as keyof typeof difficultyColors]
                  }`}
                >
                  {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                </span>
                <div className="flex items-center text-gray-600">
                  {workout.workout_type === 'home' ? (
                    <Home className="h-5 w-5 mr-2" />
                  ) : (
                    <Building className="h-5 w-5 mr-2" />
                  )}
                  <span className="text-sm capitalize">{workout.workout_type} Workout</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="text-sm">{workout.duration}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {workout.title}
              </h1>

              {workout.description && (
                <p className="text-xl text-gray-600 mb-8">{workout.description}</p>
              )}

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: workout.content }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

