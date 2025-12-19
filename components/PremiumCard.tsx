'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  glass?: boolean;
}

export default function PremiumCard({
  children,
  className = '',
  delay = 0,
  hover = true,
  glass = false,
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { y: -8, transition: { duration: 0.3 } } : undefined}
      className={`${glass ? 'card-glass' : 'card-premium'} ${className}`}
    >
      {children}
    </motion.div>
  );
}

