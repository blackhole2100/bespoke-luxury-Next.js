'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Currency } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQty, clearCart, user, showToast, formatPrice } = useApp();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checkout Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Autofill form if user is logged in
  React.useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user, isCheckingOut]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please register or sign in to complete checkout.', true);
      return;
    }

    if (!fullName || !phone || !email || !addressLine || !city || !zipCode) {
      showToast('Please fill in all checkout fields.', true);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shippingAddress: { fullName, phone, email, addressLine, city, zipCode },
        }),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        setIsCheckingOut(false);
        onClose();
        // Redirect to the branded invoice / order-success page
        router.push(`/checkout/success?orderId=${data.orderId || data.order?._id || ''}`);
      } else {
        showToast(data.error || 'Checkout failed.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('A network error occurred. Please try again.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sidebar Overlay */}
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>

      {/* Cart Sidebar panel */}
      <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-sidebar-header">
          <h3>{isCheckingOut ? 'Checkout Details' : 'Your Cart'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart">
            <i className="bx bx-x"></i>
          </button>
        </div>

        <div className="cart-sidebar-body" style={{ overflowY: 'auto' }}>
          {!isCheckingOut ? (
            cart.length === 0 ? (
              <div className="cart-empty">
                <i className="bx bx-shopping-bag"></i>
                <p>Your cart is empty</p>
                <button className="btn-primary-solid" style={{ marginTop: '1rem' }} onClick={onClose}>
                  Browse Collection
                </button>
              </div>
            ) : (
              <div className="cart-items-wrapper">
                {cart.map((item) => (
                  <div className="cart-item" key={item.productId}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="cart-item-img"
                      src={item.image}
                      alt={item.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">{formatPrice(item.price)}</div>
                      <div className="cart-qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <button
                          className="icon-btn-qty"
                          onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                          style={{ border: '1px solid var(--border)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.quantity}</span>
                        <button
                          className="icon-btn-qty"
                          onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                          style={{ border: '1px solid var(--border)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.productId)} aria-label="Remove item">
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="checkout-sidebar-form" style={{ padding: '0.5rem' }}>
              <div className="rf-input-group">
                <label>Recipient Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />
              </div>
              <div className="rf-input-group">
                <label>Contact Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" required />
              </div>
              <div className="rf-input-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
              </div>
              <div className="rf-input-group">
                <label>Street Address</label>
                <input type="text" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Apt 4B, Luxury Towers" required />
              </div>
              <div className="rf-input-group">
                <label>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" required />
              </div>
              <div className="rf-input-group">
                <label>Zip/Postal Code</label>
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="400001" required />
              </div>

              {!user && (
                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.25rem', textAlign: 'center', margin: '15px 0' }}>
                  <i className="bx bx-lock-alt" style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '8px', display: 'block' }}></i>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 6px 0' }}>
                    Sign In Required
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: '0 0 1.25rem 0', lineHeight: '1.4' }}>
                    Please login or create an account to proceed with your order checkout.
                  </p>
                  <button 
                    type="button"
                    className="btn-primary-solid" 
                    onClick={() => {
                      onClose();
                      router.push('/signup');
                    }}
                    style={{ fontSize: '0.75rem', padding: '8px 18px', textTransform: 'uppercase', width: '100%' }}
                  >
                    Login or Register
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary-outline" style={{ flex: 1 }} onClick={() => setIsCheckingOut(false)}>
                  Back
                </button>
                <button type="submit" className="btn-primary-solid" style={{ flex: 1.5 }} disabled={isSubmitting || !user || cart.length === 0}>
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Footer */}
        {!isCheckingOut && cart.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span className="cart-total-price">{formatPrice(subtotal)}</span>
            </div>
            <p className="cart-tax-note">Taxes &amp; delivery calculated at checkout</p>
            <button
              className="btn-primary-solid"
              style={{ width: '100%', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}
              onClick={() => setIsCheckingOut(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
