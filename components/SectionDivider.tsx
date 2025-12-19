'use client';

import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'diagonal' | 'gradient';
  className?: string;
  color?: string;
}

export default function SectionDivider({
  variant = 'wave',
  className = '',
  color = 'white',
}: SectionDividerProps) {
  if (variant === 'wave') {
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20 md:h-32"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill={color}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'curve') {
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            d="M0 100C300 100 600 0 900 0C1200 0 1440 100 1440 100V100H0Z"
            fill={color}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'diagonal') {
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            d="M0 0L1440 100H0V0Z"
            fill={color}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={`relative w-full h-px ${className}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent"
        />
      </div>
    );
  }

  return null;
}

