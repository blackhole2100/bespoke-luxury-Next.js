'use client';

import React from 'react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';

interface ProductCardProps {
  product: Product;
}

const RATING_MAP: Record<number, string> = {
  1: '★☆☆☆☆',
  2: '★★☆☆☆',
  3: '★★★☆☆',
  4: '★★★★☆',
  5: '★★★★★',
};

const getStars = (product: Product) => {
  const avg = product.ratings?.average || 5;
  const rounded = Math.round(avg);
  return RATING_MAP[rounded] || '★★★★★';
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist, formatPrice } = useApp();

  const originalPriceVal = product.originalPrice || 0;
  const savings = originalPriceVal > product.price
    ? Math.round((1 - product.price / originalPriceVal) * 100)
    : 0;

  const inWishlist = wishlist.some((w) => w.productId === product._id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <article className="product-card visible">
      <div className="product-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
        />
        {product.badge === 'sale' && savings > 0 && (
          <span className="product-badge badge-sale">−{savings}%</span>
        )}
        {product.badge === 'new' && (
          <span className="product-badge badge-new">New</span>
        )}
        <div className="product-quick-actions">
          <button className="quick-action-btn quick-add-cart" onClick={handleAddToCartClick}>
            <i className="bx bx-cart-add"></i> Add to Cart
          </button>
          <button
            className={`quick-action-btn quick-wishlist ${inWishlist ? 'wishlisted' : ''}`}
            onClick={handleWishlistClick}
            aria-label="Toggle wishlist"
          >
            <i className={`bx ${inWishlist ? 'bxs-heart' : 'bx-heart'}`}></i>
          </button>
        </div>
      </div>
      <div className="product-card-body">
        <div className="product-card-category">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </div>
        <div className="product-rating">
          <span className="stars">{getStars(product)}</span>
          <span className="rating-count">({product.ratings?.count || 80})</span>
        </div>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-pricing">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
              <span className="price-savings">{savings}% off</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
