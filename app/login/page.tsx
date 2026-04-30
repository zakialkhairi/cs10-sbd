'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => router.push('/products'), 600);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message ||
        (err as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
        (err instanceof Error ? err.message : '') ||
        'Login failed. Please check your credentials.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(var(--color-accent-rgb), 0.12)' }} />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full blur-[120px] pointer-events-none" style={{ background: 'var(--gradient-bg-2)' }} />

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Welcome Back</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Sign in to your Yakistore account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
            <Button type="submit" fullWidth loading={loading}>Sign In</Button>
          </form>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
