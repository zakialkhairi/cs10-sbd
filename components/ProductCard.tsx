'use client';

import { motion } from 'framer-motion';
import type { Product } from '@/lib/api';
import { formatRupiah } from '@/lib/format';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  index,
  onAddToCart,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        rotateX: 2,
        rotateY: -2,
        transition: { duration: 0.3 },
      }}
      className="group glass overflow-hidden flex flex-col"
      style={{ perspective: 800 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square" style={{ background: 'var(--color-surface)' }}>
        <div
          className="absolute inset-0 z-10 opacity-40"
          style={{
            background: 'linear-gradient(to top, var(--color-bg), transparent, transparent)',
          }}
        />
        <img
          src={product.image || `/images/${product.name.toLowerCase().replace(/\s+/g, '-')}.png`}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            // Optionally set to a default placeholder or hide
            const parent = e.currentTarget.parentElement;
            if (parent) {
              e.currentTarget.style.display = 'none';
              const svg = document.createElement('div');
              svg.className = 'w-full h-full flex items-center justify-center';
              svg.innerHTML = `<svg class="w-16 h-16" style="color: var(--color-text-muted); opacity: 0.3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
              parent.appendChild(svg);
            }
          }}
        />

        {/* Category badge */}
        {product.category && (
          <span
            className="absolute top-3 left-3 z-20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg backdrop-blur-md"
            style={{
              background: 'rgba(var(--color-accent-rgb), 0.15)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(var(--color-accent-rgb), 0.2)',
            }}
          >
            {product.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3
            className="text-base font-semibold leading-tight line-clamp-2 transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {product.name}
          </h3>
          {product.description && (
            <p
              className="mt-1.5 text-xs line-clamp-2 leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {product.description}
            </p>
          )}
          {product.stock !== undefined && (
            <p className="mt-2 text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
              Sisa Stok: {product.stock}
            </p>
          )}
        </div>

        <div
          className="flex items-center justify-between gap-3 pt-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <span className="text-lg font-bold gradient-text">
            {formatRupiah(Number(product.price) || 0)}
          </span>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(var(--color-accent-rgb), 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart?.(product)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer"
            style={{
              background: 'rgba(var(--color-accent-rgb), 0.1)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(var(--color-accent-rgb), 0.2)',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
