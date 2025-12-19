import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Dumbbell, Clock, TrendingUp, Home, Building, ArrowRight } from 'lucide-react';
import { AnimatedCard, AnimatedSection, AnimatedRotating } from '@/components/AnimatedCards';

export const metadata = {
  title: 'Fitness & Workouts - HealthFit',
  description: 'Comprehensive workout plans for all fitness levels. Home and gym workouts for beginners to advanced.',
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export default async function FitnessPage() {
  let workouts: any[] = [];

  try {
    const result = await query(`
      SELECT * FROM workouts 
      WHERE is_active = true 
      ORDER BY 
        CASE difficulty 
          WHEN 'beginner' THEN 1 
          WHEN 'intermediate' THEN 2 
          WHEN 'advanced' THEN 3 
        END,
        title
    `);
    workouts = result.rows;
  } catch (error) {
    console.error('Database error:', error);
  }

  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const key = `${workout.difficulty}-${workout.workout_type}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(workout);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-green-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Fitness & Workouts</h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Transform your body with our comprehensive workout plans
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {workouts.length > 0 ? (
          <div className="space-y-12">
            {/* Beginner Workouts */}
            {workouts.filter(w => w.difficulty === 'beginner').length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                  Beginner Workouts
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {workouts
                    .filter(w => w.difficulty === 'beginner')
                    .map((workout, index) => (
                      <AnimatedCard key={workout.id} delay={index * 0.1}>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover-lift group">
                          {workout.image_url ? (
                            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
                          ) : (
                            <div className="h-48 bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                              <AnimatedRotating>
                                <Dumbbell className="h-20 w-20 text-white opacity-90" />
                              </AnimatedRotating>
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${difficultyColors[workout.difficulty as keyof typeof difficultyColors]}`}>
                                {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                              </span>
                              <div className="flex items-center text-gray-600">
                                {workout.workout_type === 'home' ? (
                                  <Home className="h-5 w-5 mr-1" />
                                ) : (
                                  <Building className="h-5 w-5 mr-1" />
                                )}
                                <span className="text-sm capitalize font-medium">{workout.workout_type}</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">{workout.title}</h3>
                            {workout.description && (
                              <p className="text-gray-600 mb-4 leading-relaxed">{workout.description}</p>
                            )}
                            <div className="flex items-center text-gray-600 mb-4">
                              <Clock className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">{workout.duration}</span>
                            </div>
                            <Link
                              href={`/fitness/${workout.slug}`}
                              className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center group-hover:translate-x-2 transition-transform"
                            >
                              View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </AnimatedCard>
                    ))}
                </div>
              </div>
            )}

            {/* Intermediate Workouts */}
            {workouts.filter(w => w.difficulty === 'intermediate').length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-yellow-600" />
                  Intermediate Workouts
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {workouts
                    .filter(w => w.difficulty === 'intermediate')
                    .map((workout) => (
                      <div key={workout.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                        <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                          <Dumbbell className="h-16 w-16 text-white opacity-80" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[workout.difficulty as keyof typeof difficultyColors]}`}>
                              {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                            </span>
                            <div className="flex items-center text-gray-600">
                              {workout.workout_type === 'home' ? (
                                <Home className="h-5 w-5 mr-1" />
                              ) : (
                                <Building className="h-5 w-5 mr-1" />
                              )}
                              <span className="text-sm capitalize">{workout.workout_type}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{workout.title}</h3>
                          {workout.description && (
                            <p className="text-gray-600 mb-4">{workout.description}</p>
                          )}
                          <div className="flex items-center text-gray-600 mb-4">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">{workout.duration}</span>
                          </div>
                          <Link
                            href={`/fitness/${workout.slug}`}
                            className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Advanced Workouts */}
            {workouts.filter(w => w.difficulty === 'advanced').length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-red-600" />
                  Advanced Workouts
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {workouts
                    .filter(w => w.difficulty === 'advanced')
                    .map((workout) => (
                      <div key={workout.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                        <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                          <Dumbbell className="h-16 w-16 text-white opacity-80" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[workout.difficulty as keyof typeof difficultyColors]}`}>
                              {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                            </span>
                            <div className="flex items-center text-gray-600">
                              {workout.workout_type === 'home' ? (
                                <Home className="h-5 w-5 mr-1" />
                              ) : (
                                <Building className="h-5 w-5 mr-1" />
                              )}
                              <span className="text-sm capitalize">{workout.workout_type}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{workout.title}</h3>
                          {workout.description && (
                            <p className="text-gray-600 mb-4">{workout.description}</p>
                          )}
                          <div className="flex items-center text-gray-600 mb-4">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">{workout.duration}</span>
                          </div>
                          <Link
                            href={`/fitness/${workout.slug}`}
                            className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No workouts available yet. Check back soon!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

