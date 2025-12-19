'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedIconProps {
  children: ReactNode;
  animation?: 'float' | 'rotate' | 'scale';
  duration?: number;
  className?: string;
}

export default function AnimatedIcon({ 
  children, 
  animation = 'float',
  duration = 4,
  className = ''
}: AnimatedIconProps) {
  const animations = {
    float: {
      y: [0, -20, 0],
      transition: { duration, repeat: Infinity, ease: 'easeInOut' },
    },
    rotate: {
      rotate: [0, 360],
      transition: { duration: 20, repeat: Infinity, ease: 'linear' },
    },
    scale: {
      scale: [1, 1.1, 1],
      transition: { duration, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div className={className} animate={animations[animation]}>
      {children}
    </motion.div>
  );
}
