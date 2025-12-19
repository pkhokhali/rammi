'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedHeadingProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedHeading({ children, className = '', delay = 0 }: AnimatedHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

