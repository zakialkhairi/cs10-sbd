'use client';

import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = Boolean(props.value) || Boolean(props.defaultValue);

    return (
      <div className="relative w-full">
        {/* Glow ring behind input */}
        <motion.div
          animate={{
            boxShadow: focused
              ? error
                ? '0 0 20px rgba(239, 68, 68, 0.25), 0 0 60px rgba(239, 68, 68, 0.08)'
                : '0 0 20px rgba(var(--color-accent-rgb), 0.25), 0 0 60px rgba(var(--color-accent-rgb), 0.08)'
              : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
        />

        <div className="relative">
          {icon && (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full rounded-2xl
              px-4 py-3.5 text-sm placeholder-transparent
              transition-all duration-300
              focus:outline-none
              peer
              ${icon ? 'pl-11' : 'pl-4'}
              ${className}
            `}
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              border: error
                ? '1px solid rgba(239, 68, 68, 0.5)'
                : focused
                ? '1px solid rgba(var(--color-accent-rgb), 0.5)'
                : '1px solid var(--color-border)',
            }}
            placeholder={label}
            {...props}
          />

          {/* Floating label */}
          <motion.label
            initial={false}
            animate={{
              y: focused || hasValue ? -26 : 0,
              scale: focused || hasValue ? 0.85 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute top-3.5 origin-left pointer-events-none text-sm font-medium peer-placeholder-shown:top-3.5"
            style={{
              left: icon ? '2.75rem' : '1rem',
              color: focused
                ? error
                  ? '#ef4444'
                  : 'var(--color-accent)'
                : 'var(--color-text-muted)',
            }}
          >
            {label}
          </motion.label>
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs font-medium pl-1"
            style={{ color: '#ef4444' }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
