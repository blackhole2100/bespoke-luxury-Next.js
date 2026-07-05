'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const RATING_MAP: Record<number, string> = {
  1: '★☆☆☆☆',
  2: '★★☆☆☆',
  3: '★★★☆☆',
  4: '★★★★☆',
  5: '★★★★★',
};

const formatINR = (amount: number) => {
  return '₹' + amount.toLocaleString('en-IN');
};

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const { addToCart, toggleWishlist, wishlist, showToast } = useApp();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch product data and related items
  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      try {
        // Fetch current product
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (data.success && data.product) {
          setProduct(data.product);
          
          // Fetch related products (same category)
          const categoryRes = await fetch(`/api/products?category=${data.product.category}`);
          const categoryData = await categoryRes.json();
          if (categoryData.success && categoryData.products) {
            // Exclude current product from recommendations
            const filtered = categoryData.products.filter(
              (p: Product) => p._id !== data.product._id
            );
            setRelated(filtered.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductDetails();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2.5rem', marginBottom: '12px' }}></i>
          <span>Retrieving item details...</span>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <i className="bx bx-error-circle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
          <h2>Product Not Found</h2>
          <p style={{ marginTop: '8px' }}>The item you are looking for does not exist or has been removed.</p>
          <Link href="/product" className="btn-primary-solid" style={{ marginTop: '1.5rem' }}>Back to Shop</Link>
        </div>
        <Footer />
      </>
    );
  }

  const isWishlisted = wishlist.some((w) => w.productId === product._id);
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const originalPriceVal = product.originalPrice || 0;
  const savings = originalPriceVal > product.price 
    ? Math.round((1 - product.price / originalPriceVal) * 100) 
    : 0;

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 6rem' }}>
        {/* Back Link */}
        <Link href="/product" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <i className="bx bx-arrow-back"></i> Back to Collection
        </Link>

        {/* Product Grid Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left Media Column */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/p1.png';
              }}
            />
            {product.badge === 'sale' && savings > 0 && (
              <span className="product-badge badge-sale" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.85rem' }}>
                −{savings}%
              </span>
            )}
            {product.badge === 'new' && (
              <span className="product-badge badge-new" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.85rem' }}>
                New
              </span>
            )}
          </div>

          {/* Right Product Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--accent)' }}>
              {product.category}
            </span>
            
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 300, lineHeight: '1.2', color: 'var(--text-primary)' }}>
              {product.name}
            </h1>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--accent)' }}>
                {RATING_MAP[Math.round(product.ratings?.average || 5)] || '★★★★★'}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                ({product.ratings?.count || 80} Customer Reviews)
              </span>
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formatINR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    {formatINR(product.originalPrice)}
                  </span>
                  <span style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
                    ({savings}% Off)
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
              {product.description}
            </p>

            {/* Stock Levels */}
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Availability:{' '}
              {isOutOfStock ? (
                <strong style={{ color: '#dc3545' }}>Out of Stock</strong>
              ) : (
                <strong style={{ color: '#059669' }}>In Stock ({product.stock} items left)</strong>
              )}
            </div>

            {/* Actions Panel */}
            {!isOutOfStock && (
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '1rem' }}>
                {/* Qty Selector */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--bg-primary)' }}>
                  <button 
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: '40px', height: '44px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    -
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity((q) => Math.min(product.stock || 20, q + 1))}
                    style={{ width: '40px', height: '44px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button 
                  className="btn-primary-solid" 
                  onClick={() => {
                    addToCart(product, quantity);
                  }}
                  style={{ flex: 1.5, height: '48px', textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                  Add To Cart
                </button>

                {/* Add to Wishlist */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '8px', 
                    border: '1.5px solid var(--border)', 
                    background: isWishlisted ? 'var(--accent)' : 'var(--bg-primary)', 
                    color: isWishlisted ? '#fff' : 'var(--text-primary)', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    transition: 'all 0.3s'
                  }}
                  aria-label="Wishlist"
                >
                  <i className={`bx ${isWishlisted ? 'bxs-heart' : 'bx-heart'}`}></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Related Products Recommendations */}
        {related.length > 0 && (
          <section style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 300, marginBottom: '2.5rem', color: 'var(--text-primary)' }}>
              Related <em>Masterpieces</em>
            </h2>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard product={item} key={item._id} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
