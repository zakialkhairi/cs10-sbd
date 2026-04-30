'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const errs: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser(name, email, password);
      showToast('Account created! Please sign in.', 'success');
      setTimeout(() => router.push('/login'), 800);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message ||
        (err as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
        (err instanceof Error ? err.message : '') ||
        'Registration failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-[120px] pointer-events-none" style={{ background: 'var(--gradient-bg-2)' }} />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(var(--color-accent-rgb), 0.1)' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 mx-auto rounded-2xl gradient-btn flex items-center justify-center mb-4"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Join Yakistore</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Create your account and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} error={errors.name}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
            <Button type="submit" fullWidth loading={loading}>Create Account</Button>
          </form>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
