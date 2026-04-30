'use client';

import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          className: 'gradient-btn shadow-lg font-semibold',
          hoverShadow: '0 0 30px rgba(var(--color-accent-rgb), 0.35)',
        };
      case 'secondary':
        return {
          className: 'font-semibold',
          hoverShadow: '0 0 20px rgba(var(--color-accent-rgb), 0.15)',
        };
      case 'ghost':
        return {
          className: 'font-semibold',
          hoverShadow: 'none',
        };
      default:
        return { className: '', hoverShadow: 'none' };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <motion.button
      type={type}
      whileHover={
        disabled || loading
          ? {}
          : { scale: 1.03, boxShadow: variantStyle.hoverShadow }
      }
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center gap-2
        rounded-2xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${sizeClasses[size]}
        ${variantStyle.className}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        ...(variant === 'secondary'
          ? {
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
            }
          : {}),
        ...(variant === 'ghost'
          ? {
              background: 'transparent',
              color: 'var(--color-text-secondary)',
            }
          : {}),
      }}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
