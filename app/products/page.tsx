'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { createProduct, getProducts, type Product } from '@/lib/api';
import { useToast } from '@/components/Toast';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import CartDrawer from '@/components/CartDrawer';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function ProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setError('Failed to load products. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();

    const price = Number(productPrice);
    if (!productName.trim() || !Number.isFinite(price) || price <= 0) {
      setFormError('Isi nama produk dan harga yang valid.');
      return;
    }

    setSavingProduct(true);
    setFormError(null);

    try {
      const product = await createProduct({
        name: productName.trim(),
        price,
        image: productImage.trim(),
      });

      setProducts((prev) => [product, ...prev]);
      setProductName('');
      setProductPrice('');
      setProductImage('');
      showToast('Produk berhasil ditambahkan.', 'success');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message ||
        'Produk gagal ditambahkan.';
      setFormError(message);
      showToast(message, 'error');
    } finally {
      setSavingProduct(false);
    }
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

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        onSubmit={handleCreateProduct}
        className="glass p-5 sm:p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <Input
              label="Nama Produk"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            />
            <Input
              label="Harga"
              type="number"
              min="1"
              step="1"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
            />
            <Input
              label="URL Gambar"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
          </div>
          <Button type="submit" loading={savingProduct} className="lg:self-stretch">
            Tambah Produk
          </Button>
        </div>
        {formError && (
          <p className="mt-3 text-sm font-medium" style={{ color: '#ef4444' }}>
            {formError}
          </p>
        )}
      </motion.form>

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
