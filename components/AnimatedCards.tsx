'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function AnimatedCard({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedSlideIn({ children, direction = 'left', className = '' }: { children: ReactNode; direction?: 'left' | 'right'; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({ children, index = 0, direction = 'left', className = '' }: { children: ReactNode; index?: number; direction?: 'left' | 'right'; className?: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.li>
  );
}

export function AnimatedFloating({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedRotating({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedScaling({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

