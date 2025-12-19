import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import PremiumCard from '@/components/PremiumCard';
import SectionDivider from '@/components/SectionDivider';
import AnimatedHeading from '@/components/AnimatedHeading';
import AnimatedIcon from '@/components/AnimatedIcon';
import Link from 'next/link';
import { ArrowRight, Heart, Apple, Dumbbell, Brain, CheckCircle, Sparkles } from 'lucide-react';
import { AnimatedCard, AnimatedSlideIn, AnimatedListItem } from '@/components/AnimatedCards';

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <HeroCarousel />

      {/* Healthy Living Overview */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-accent-50/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedHeading className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              Healthy Living Overview
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Living a healthy lifestyle is about making choices that benefit your physical, mental, and emotional well-being. 
              Our comprehensive approach combines nutrition, exercise, and wellness practices to help you achieve your health goals.
            </p>
          </AnimatedHeading>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <PremiumCard delay={0.1}>
              <div className="p-8 md:p-10">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="h-8 w-8 text-primary-600" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Holistic Wellness</h3>
                <p className="text-gray-600 leading-relaxed">
                  A balanced approach to health that considers all aspects of your well-being, from physical fitness to mental clarity.
                </p>
              </div>
            </PremiumCard>
            
            <PremiumCard delay={0.2}>
              <div className="p-8 md:p-10">
                <div className="bg-gradient-to-br from-accent-100 to-accent-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Apple className="h-8 w-8 text-accent-600" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Evidence-Based</h3>
                <p className="text-gray-600 leading-relaxed">
                  All our recommendations are backed by scientific research and proven methods for sustainable health improvement.
                </p>
              </div>
            </PremiumCard>
            
            <PremiumCard delay={0.3}>
              <div className="p-8 md:p-10">
                <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <CheckCircle className="h-8 w-8 text-teal-600" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Personalized Plans</h3>
                <p className="text-gray-600 leading-relaxed">
                  Customized guidance that adapts to your unique needs, goals, and lifestyle preferences.
                </p>
              </div>
            </PremiumCard>
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" color="#f9fafb" />

      {/* Diet & Nutrition Tips */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-primary-50/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <AnimatedSlideIn direction="left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
                Diet & Nutrition Tips
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                Proper nutrition is the foundation of good health. We provide evidence-based dietary guidance tailored to your specific needs, 
                whether you're looking to lose weight, gain muscle, or manage a health condition.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Balanced macronutrient intake for optimal energy',
                  'Meal planning strategies for sustainable habits',
                  'Specialized diets for health conditions',
                  'Nutrition timing and portion control',
                ].map((item, idx) => (
                  <AnimatedListItem key={idx} index={idx} direction="left" className="flex items-start group">
                    <CheckCircle className="h-6 w-6 text-primary-600 mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </AnimatedListItem>
                ))}
              </ul>
              <Link
                href="/diet"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold btn-premium shadow-lg shadow-primary-500/30"
              >
                Explore Nutrition Plans
                <ArrowRight className="h-5 w-5" />
              </Link>
            </AnimatedSlideIn>
            
            <AnimatedSlideIn direction="right" className="relative">
              <PremiumCard glass className="p-0 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary-400 via-primary-500 to-accent-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                  <AnimatedIcon animation="float">
                    <Apple className="h-32 w-32 text-white opacity-90" />
                  </AnimatedIcon>
                </div>
              </PremiumCard>
            </AnimatedSlideIn>
          </div>
        </div>
      </section>

      <SectionDivider variant="curve" color="white" />

      {/* Fitness & Exercise Guidance */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-50/30 to-primary-50/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <AnimatedSlideIn direction="left" className="relative order-2 md:order-1">
              <PremiumCard glass className="p-0 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-accent-400 via-accent-500 to-primary-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                  <AnimatedIcon animation="rotate">
                    <Dumbbell className="h-32 w-32 text-white opacity-90" />
                  </AnimatedIcon>
                </div>
              </PremiumCard>
            </AnimatedSlideIn>
            
            <AnimatedSlideIn direction="right" className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
                Fitness & Exercise Guidance
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                Regular physical activity is essential for maintaining good health. Our fitness programs are designed for all fitness levels, 
                from beginners to advanced athletes, with both home and gym workout options.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Progressive workout plans for all levels',
                  'Home and gym workout variations',
                  'Form guidance and injury prevention',
                  'Recovery and rest day strategies',
                ].map((item, idx) => (
                  <AnimatedListItem key={idx} index={idx} direction="right" className="flex items-start group">
                    <CheckCircle className="h-6 w-6 text-accent-600 mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </AnimatedListItem>
                ))}
              </ul>
              <Link
                href="/fitness"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-600 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold btn-premium shadow-lg shadow-accent-500/30"
              >
                View Workout Plans
                <ArrowRight className="h-5 w-5" />
              </Link>
            </AnimatedSlideIn>
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" color="#f9fafb" />

      {/* AI Health Assistant */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedHeading>
            <AnimatedIcon animation="float" duration={3}>
              <div className="inline-block mb-8">
                <div className="glass-strong p-6 rounded-2xl inline-block border border-white/20">
                  <Sparkles className="h-20 w-20 mx-auto text-white" />
                </div>
              </div>
            </AnimatedIcon>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AI Health Assistant
            </h2>
            <p className="text-lg md:text-xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Get instant, personalized health, diet, and fitness advice from our AI-powered assistant. 
              Ask questions about nutrition, exercise, weight management, and healthy lifestyle habits.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-10 py-5 rounded-xl font-bold btn-premium shadow-2xl hover:scale-105 transition-transform"
            >
              <Sparkles className="h-5 w-5" />
              Try AI Assistant
              <ArrowRight className="h-5 w-5" />
            </Link>
          </AnimatedHeading>
        </div>
      </section>

      <Footer />
    </div>
  );
}
