'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/Button';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Decorative glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(var(--color-accent-rgb), 0.15)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'rgba(var(--color-accent-rgb), 0.08)' }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'var(--gradient-bg-2)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]"
        >
          <span style={{ color: 'var(--color-text-primary)' }}>Welcome to</span>
          <br />
          <span className="gradient-text">Yakistore</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl mx-auto text-lg sm:text-xl leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Discover a curated collection of premium products with an immersive
          shopping experience like no other.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/products">
            <Button size="lg">
              Explore Products
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Create Account
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex items-center justify-center gap-8 sm:gap-16 pt-12"
        >
          {[
            { value: '10K+', label: 'Products' },
            { value: '50K+', label: 'Customers' },
            { value: '99%', label: 'Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div
                className="text-xs sm:text-sm mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
