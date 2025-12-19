'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/diet', label: 'Diet & Nutrition' },
    { href: '/fitness', label: 'Fitness & Workouts' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-strong shadow-premium py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 p-2.5 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" fill="currentColor" />
              </div>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold gradient-text"
            >
              HealthFit
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium group"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  {item.label}
                </motion.span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </Link>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/chat"
                className="ml-4 relative inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2.5 rounded-xl font-semibold btn-premium shadow-lg shadow-primary-500/30"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Assistant</span>
              </Link>
            </motion.div>
            <Link
              href="/admin"
              className="ml-2 text-gray-500 hover:text-gray-700 transition text-sm px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ delay: 0.1 }}
              className="glass-strong border-t border-gray-200/50 backdrop-blur-xl"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all font-medium"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <Link
                    href="/chat"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold btn-premium shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Assistant
                    </span>
                  </Link>
                </motion.div>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-500 text-sm text-center"
                >
                  Admin
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
