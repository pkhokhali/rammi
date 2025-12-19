'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: 'Transform Your Health Journey',
    subtitle: 'Discover personalized health, diet, and fitness solutions',
    bgGradient: 'from-primary-500 via-primary-600 to-accent-600',
    ctaText: 'Start Your Journey',
    ctaLink: '/diet',
  },
  {
    id: 2,
    title: 'Expert Nutrition Guidance',
    subtitle: 'Evidence-based dietary plans tailored to your goals',
    bgGradient: 'from-accent-500 via-accent-600 to-teal-600',
    ctaText: 'Explore Nutrition',
    ctaLink: '/diet',
  },
  {
    id: 3,
    title: 'Fitness Programs for Everyone',
    subtitle: 'From beginner to advanced, home or gym workouts',
    bgGradient: 'from-teal-500 via-primary-600 to-accent-600',
    ctaText: 'View Workouts',
    ctaLink: '/fitness',
  },
];

// Floating health icons
const floatingIcons = [
  { icon: '💚', delay: 0 },
  { icon: '🏃', delay: 0.5 },
  { icon: '🥗', delay: 1 },
  { icon: '💪', delay: 1.5 },
  { icon: '🧘', delay: 2 },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden mt-16">
      {/* Floating Icons Background */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {floatingIcons.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-4xl md:text-6xl"
            style={{
              left: `${15 + idx * 20}%`,
              top: `${20 + idx * 15}%`,
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentIndex].bgGradient}`}
        >
          {/* Layered gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>

          <div className="relative h-full flex items-center justify-center z-20">
            <div className="text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30"
              >
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm text-white font-medium">AI-Powered Health Assistant</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight"
              >
                {slides[currentIndex].title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl lg:text-3xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed"
              >
                {slides[currentIndex].subtitle}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={slides[currentIndex].ctaLink}
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all btn-premium shadow-lg"
                  >
                    {slides[currentIndex].ctaText}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/30"
                  >
                    <Sparkles className="h-5 w-5" />
                    Ask AI Assistant
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 glass-strong text-white p-3 rounded-full transition z-30 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 glass-strong text-white p-3 rounded-full transition z-30 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20 md:h-32"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
