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

interface Review {
  _id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const RATING_MAP: Record<number, string> = {
  1: '★☆☆☆☆',
  2: '★★☆☆☆',
  3: '★★★☆☆',
  4: '★★★★☆',
  5: '★★★★★',
};

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const { addToCart, toggleWishlist, wishlist, showToast, user, formatPrice } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Fetch product data and related items
  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);

          const categoryRes = await fetch(`/api/products?category=${data.product.category}`);
          const categoryData = await categoryRes.json();
          if (categoryData.success && categoryData.products) {
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

  // Fetch reviews for this product
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch(`/api/products/${id}/reviews`);
        const data = await res.json();
        if (data.success) setReviews(data.reviews || []);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };
    if (id) loadReviews();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to leave a review.', true);
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please write a comment before submitting.', true);
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user.name,
          userEmail: user.email,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => [...prev, data.review]);
        setReviewComment('');
        setReviewRating(5);
        showToast('Thank you for your review!');
        // Update local product rating
        if (product && data.ratings) {
          setProduct((p) => p ? { ...p, ratings: data.ratings } : p);
        }
      } else {
        showToast(data.error || 'Failed to submit review.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('A network error occurred.', true);
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
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
                ({product.ratings?.count || reviews.length} Customer Reviews)
              </span>
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    {formatPrice(product.originalPrice)}
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
                  onClick={() => addToCart(product, quantity)}
                  style={{ flex: 1.5, height: '48px', textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                  Add To Cart
                </button>

                {/* Add to Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    width: '48px', height: '48px', borderRadius: '8px',
                    border: '1.5px solid var(--border)',
                    background: isWishlisted ? 'var(--accent)' : 'var(--bg-primary)',
                    color: isWishlisted ? '#fff' : 'var(--text-primary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.4rem', transition: 'all 0.3s'
                  }}
                  aria-label="Wishlist"
                >
                  <i className={`bx ${isWishlisted ? 'bxs-heart' : 'bx-heart'}`}></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========== REVIEWS SECTION =========== */}
        <section style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Customer <em>Reviews</em>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
            {reviews.length > 0
              ? `${reviews.length} verified purchase${reviews.length === 1 ? '' : 's'}`
              : 'Be the first to share your experience.'}
          </p>

          {/* Review Feed */}
          {reviews.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              {reviews.map((review) => (
                <div
                  key={review._id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{review.userName}</strong>
                      <span style={{ color: 'var(--accent)', marginLeft: '12px', fontSize: '0.9rem' }}>
                        {RATING_MAP[review.rating] || '★★★★★'}
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Write a Review Form */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Write a Review
            </h3>
            {!user && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link> to leave a verified review.
              </p>
            )}
            <form onSubmit={handleSubmitReview}>
              {/* Star Rating Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Your Rating
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                        fontSize: '1.8rem',
                        color: star <= (hoveredStar || reviewRating) ? 'var(--accent)' : 'var(--border)',
                        transition: 'color 0.15s',
                      }}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="rf-input-group" style={{ marginBottom: '1.25rem' }}>
                <label>Your Review</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about your experience — quality, craftsmanship, delivery..."
                  disabled={!user}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary-solid"
                disabled={isSubmittingReview || !user}
                style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </section>

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
