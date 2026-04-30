'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getProducts, type Product } from '@/lib/api';
import { useToast } from '@/components/Toast';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import CartDrawer from '@/components/CartDrawer';

export default function ProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleRemoveFromCart = (id: string | number) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Our Products
          </h1>
          <p
            className="mt-2 text-sm sm:text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Discover our curated collection of premium items
          </p>
        </motion.div>

        {/* Cart button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-medium transition-colors cursor-pointer self-start sm:self-auto"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Cart
          {cart.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full gradient-btn text-[10px] font-bold flex items-center justify-center"
            >
              {cart.length}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Content */}
      {loading ? (
        <Loader count={8} />
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-6"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(var(--color-accent-rgb), 0.1)' }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: 'var(--color-accent)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Something went wrong
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {error}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchProducts}
            className="px-6 py-2.5 rounded-2xl gradient-btn text-sm font-semibold cursor-pointer"
          >
            Try Again
          </motion.button>
        </motion.div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-6"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--color-surface)' }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: 'var(--color-text-muted)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              No products yet
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Check back later for amazing products!
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onRemove={handleRemoveFromCart}
      />
    </div>
  );
}
