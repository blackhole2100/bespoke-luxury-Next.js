'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export const Footer: React.FC = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate newsletter subscription
    showToast('🎉 Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/logo.png" 
              alt="Royal Furniture" 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                const sibling = (e.target as HTMLElement).nextElementSibling;
                if (sibling) (sibling as HTMLElement).style.display = 'block';
              }}
            />
            <span className="logo-text-fallback" style={{ display: 'none' }}>ROYAL FURNITURE</span>
          </Link>
          <p>Creating extraordinary living spaces through the art of exceptional furniture. Where every piece is a masterpiece.</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><i className="fa-brands fa-pinterest-p"></i></a>
          </div>
        </div>

        <div className="footer-nav-group">
          <h5>Explore</h5>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#about">Our Story</Link></li>
            <li><Link href="/#product">Collection</Link></li>
            <li><Link href="/product">Shop All</Link></li>
            <li><Link href="/#gallery">Gallery</Link></li>
          </ul>
        </div>

        <div className="footer-nav-group">
          <h5>Support</h5>
          <ul>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/shipping">Shipping Policy</Link></li>
            <li><Link href="/returns">Return & Exchange</Link></li>
            <li><Link href="/warranty">Warranty</Link></li>
            <li><Link href="/#contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-nav-group">
          <h5>Newsletter</h5>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Get exclusive offers and design inspiration delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe"><i className="bx bx-send"></i></button>
          </form>
          <div className="payment-badges" style={{ marginTop: '1rem', display: 'flex', gap: '8px', fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            <i className="fa-brands fa-cc-visa"></i>
            <i className="fa-brands fa-cc-mastercard"></i>
            <i className="fa-brands fa-cc-paypal"></i>
            <i className="fa-brands fa-google-pay"></i>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Royal Furniture Co. All Rights Reserved.</p>
        <div className="footer-legal">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="#">Sitemap</a>
          <Link href="/admin/login" className="admin-link" style={{ opacity: 0.5 }}>Admin</Link>
        </div>
      </div>
    </footer>
  );
};
