'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import RopeToggle from './RopeToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'shadow-lg'
          : ''
        }`}
      style={{
        background: scrolled ? 'var(--navbar-bg-scrolled)' : 'var(--navbar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid var(--navbar-border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden" style={{ boxShadow: '0 0 12px rgba(var(--color-accent-rgb), 0.3)' }}>
              <Image
                src="/images/yakistore.png"
                alt="Yakistore Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span
              className="text-xl font-bold tracking-tight gradient-text"
              style={{ textShadow: '0 0 20px rgba(var(--color-accent-rgb), 0.15)' }}
            >
              Yakistore
            </span>
          </Link>

          {/* Desktop Links — Centered */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-300"
                style={{
                  color: pathname === link.href ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (pathname !== link.href) {
                    (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== link.href) {
                    (e.target as HTMLElement).style.color = 'var(--color-text-secondary)';
                  }
                }}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      zIndex: -1,
                      background: 'rgba(var(--color-accent-rgb), 0.08)',
                      border: '1px solid rgba(var(--color-accent-rgb), 0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side: Rope Toggle + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Rope Toggle (desktop) */}
            <div className="hidden md:block">
              <RopeToggle />
            </div>

            {/* Mobile Theme + Menu */}
            <div className="md:hidden flex items-center gap-2">
              <RopeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
                style={{ background: mobileOpen ? 'var(--color-surface-hover)' : 'transparent' }}
                aria-label="Toggle menu"
              >
                <div className="w-5 flex flex-col gap-1.5">
                  <motion.span
                    animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    className="block h-0.5 w-full rounded-full"
                    style={{ background: 'var(--color-text-secondary)' }}
                  />
                  <motion.span
                    animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="block h-0.5 w-full rounded-full"
                    style={{ background: 'var(--color-text-secondary)' }}
                  />
                  <motion.span
                    animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    className="block h-0.5 w-full rounded-full"
                    style={{ background: 'var(--color-text-secondary)' }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'var(--navbar-bg-scrolled)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--navbar-border)',
            }}
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                    style={{
                      color: pathname === link.href ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      background: pathname === link.href ? 'rgba(var(--color-accent-rgb), 0.08)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
