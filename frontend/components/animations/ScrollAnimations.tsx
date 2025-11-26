'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

// Single unified section animation
export const AnimatedSection = ({ 
  children,
  className = '',
  id
}: { 
  children: ReactNode
  className?: string
  id?: string
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-50px", amount: 0.05 }}
    transition={{ 
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 0.5]
    }}
    className={className}
  >
    {children}
  </motion.section>
)