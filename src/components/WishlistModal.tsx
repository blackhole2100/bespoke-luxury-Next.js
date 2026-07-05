'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart, formatPrice } = useApp();

  if (!isOpen) return null;

  const handleMoveToCart = (item: { productId: string; name: string; price: number; image: string }) => {
    const product: Product = {
      _id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      category: '',
      description: '',
    };
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <div
      className="modal show fade"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rf-modal" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
          <div className="modal-header rf-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', padding: '1.25rem 1.5rem' }}>
            <h5 className="modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: 0 }}>
              My Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </h5>
            <button
              type="button"
              className="btn-close icon-btn"
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              aria-label="Close wishlist"
            >
              <i className="bx bx-x"></i>
            </button>
          </div>
          <div className="modal-body" style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
            {wishlist.length === 0 ? (
              <div className="cart-empty" style={{ textAlign: 'center', padding: '2rem 0' }}>
                <i className="bx bx-heart" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'block' }}></i>
                <p style={{ color: 'var(--text-secondary)' }}>Your wishlist is empty</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {wishlist.map((item) => (
                  <div
                    className="cart-item"
                    key={item.productId}
                    style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--border)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="cart-item-img"
                      src={item.image}
                      alt={item.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
                    />
                    <div className="cart-item-info" style={{ flex: 1 }}>
                      <div className="cart-item-name" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                      <div className="cart-item-price" style={{ color: 'var(--accent)', fontWeight: 500, fontSize: '0.9rem', marginTop: '4px' }}>
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        className="btn-primary-solid"
                        style={{ padding: '8px 14px', fontSize: '0.72rem', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                        onClick={() => handleMoveToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="icon-btn"
                        style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                        onClick={() => toggleWishlist({ _id: item.productId, name: item.name, price: item.price, image: item.image, category: '', description: '' })}
                        aria-label="Remove item"
                      >
                        <i className="bx bx-trash" style={{ fontSize: '1.2rem' }}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
