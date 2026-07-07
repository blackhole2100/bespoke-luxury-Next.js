'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { Currency } from '@/context/AppContext';
import { CartSidebar } from './CartSidebar';
import { WishlistModal } from './WishlistModal';

export const Header: React.FC = () => {
  const { 
    user, 
    logout, 
    cart, 
    wishlist, 
    theme, 
    toggleTheme,
    currency,
    setCurrency,
  } = useApp();
  
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  
  // Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [startAtCheckout, setStartAtCheckout] = useState(false);

  // Checkout URL Param handler to open cart sidebar automatically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout') === 'true') {
        setIsCartOpen(true);
        setStartAtCheckout(true);
        // Clean URL params so it doesn't trigger repeatedly
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  // Monitor Scroll for Sticky Header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
        setIsAnnouncementVisible(false);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamically synchronize the announcement height layout space on the html element
  useEffect(() => {
    const root = document.documentElement;
    if (isAnnouncementVisible) {
      // 40px is the standard height of the announcement bar
      root.style.setProperty('--announcement-h', '40px');
    } else {
      root.style.setProperty('--announcement-h', '0px');
    }
  }, [isAnnouncementVisible]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/product?search=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Helper to resolve anchor links depending on whether we are on the homepage
  const getNavLink = (anchor: string) => {
    if (pathname === '/') {
      return anchor;
    }
    return `/${anchor}`;
  };

  return (
    <>
      {/* ===================== SCROLL PROGRESS BAR ===================== */}
      <div id="scroll-progress" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', zIndex: 9999 }}>
        <div 
          id="scroll-bar" 
          style={{ 
            height: '100%', 
            backgroundColor: 'var(--accent)', 
            width: '0%', 
            transition: 'width 0.1s ease' 
          }}
        ></div>
      </div>

      {/* ===================== TOP ANNOUNCEMENT BANNER ===================== */}
      {isAnnouncementVisible && (
        <div className="announcement-bar" id="announcement-bar">
          <p>🎉 Limited Time: <strong>Free Delivery</strong> on all orders above ₹50,000 &nbsp;|&nbsp; Use code <strong>ROYAL2025</strong></p>
          <button 
            className="close-announcement" 
            onClick={() => setIsAnnouncementVisible(false)}
            aria-label="Close announcement"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}

      {/* ===================== HEADER ===================== */}
      <header 
        className={`site-header ${isScrolled ? 'scrolled' : ''}`} 
        id="site-header"
        style={{ top: isAnnouncementVisible ? 'var(--announcement-height, 40px)' : '0px' }}
      >
        <div className="header-inner">
          <div className="header-logo">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/logo1.png" 
                alt="Royal Furniture" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const sibling = (e.target as HTMLElement).nextElementSibling;
                  if (sibling) (sibling as HTMLElement).style.display = 'block';
                }}
              />
              <span className="logo-text-fallback" style={{ display: 'none' }}>ROYAL</span>
            </Link>
          </div>

          <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} id="header-nav">
            {/* Header section of the mobile nav */}
            <div className="mobile-menu-header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '3px', fontWeight: 600, color: 'var(--accent)' }}>ELEGANT</span>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Furniture Hub</span>
              </div>
              <button 
                className="mobile-menu-close" 
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  fontSize: '1.8rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none'
                }}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            
            {/* Main Links */}
            <ul>
              <li>
                <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={handleNavClick}>
                  <i className="bx bx-home mobile-nav-icon"></i>
                  Home
                </Link>
              </li>
              <li>
                <Link href={getNavLink('#about')} className="nav-link" onClick={handleNavClick}>
                  <i className="bx bx-book-open mobile-nav-icon"></i>
                  Story
                </Link>
              </li>
              <li>
                <Link href={getNavLink('#product')} className="nav-link" onClick={handleNavClick}>
                  <i className="bx bx-grid-alt mobile-nav-icon"></i>
                  Collection
                </Link>
              </li>
              <li>
                <Link href={getNavLink('#gallery')} className="nav-link" onClick={handleNavClick}>
                  <i className="bx bx-image mobile-nav-icon"></i>
                  Gallery
                </Link>
              </li>
              <li>
                <Link href={getNavLink('#reviews')} className="nav-link" onClick={handleNavClick}>
                  <i className="bx bx-message-square-detail mobile-nav-icon"></i>
                  Reviews
                </Link>
              </li>
              <li>
                <Link href={getNavLink('#contact')} className="nav-link" onClick={handleNavClick}>
                  <i className="bx bx-envelope mobile-nav-icon"></i>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/product" className={`nav-link nav-cta ${pathname === '/product' ? 'active' : ''}`} onClick={handleNavClick}>
                  <i className="bx bx-shopping-bag mobile-nav-icon" style={{ color: 'white' }}></i>
                  Shop All
                </Link>
              </li>
              
              {/* User Account / Profile Section in Mobile Drawer */}
              <li className="mobile-only-action" style={{ borderTop: '1px solid var(--border)', marginTop: '1.25rem', paddingTop: '1.25rem', listStyle: 'none' }}>
                {user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 8px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, textAlign: 'left' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      <Link 
                        href="/orders" 
                        style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', textAlign: 'center', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                        onClick={handleNavClick}
                      >
                        <i className="bx bx-receipt"></i> Orders
                      </Link>
                      <button 
                        onClick={async () => {
                          setIsMobileMenuOpen(false);
                          await logout();
                        }}
                        style={{ flex: 1, padding: '8px 12px', background: 'rgba(220, 53, 69, 0.08)', border: '1px solid rgba(220, 53, 69, 0.15)', color: '#dc3545', textAlign: 'center', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer' }}
                      >
                        <i className="bx bx-log-out"></i> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '0 8px 8px' }}>
                    <Link 
                      href="/signup" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', background: 'var(--accent)', color: 'white', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
                      onClick={handleNavClick}
                    >
                      <i className="bx bx-user" style={{ fontSize: '1rem' }}></i>
                      Login / Register
                    </Link>
                  </div>
                )}
              </li>

              {/* Currency & Theme Toggles inside mobile menu */}
              <li className="mobile-only-action" style={{ borderTop: '1px solid var(--border)', marginTop: '0.75rem', paddingTop: '1.25rem', listStyle: 'none' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                  {/* Currency Switcher */}
                  <div className="currency-switcher-mobile-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flex: 1 }}>
                    <select
                      id="currency-select-mobile"
                      value={currency}
                      onChange={(e) => {
                        setCurrency(e.target.value as Currency);
                        setIsMobileMenuOpen(false);
                      }}
                      aria-label="Select currency mobile"
                      style={{
                        width: '100%',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        padding: '8px 32px 8px 16px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        outline: 'none',
                      }}
                    >
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                      <option value="GBP">£ GBP</option>
                    </select>
                    <i className="bx bx-chevron-down" style={{ position: 'absolute', right: '12px', pointerEvents: 'none', fontSize: '1rem', color: 'var(--text-muted)' }}></i>
                  </div>
                  
                  {/* Theme Toggle */}
                  <button 
                    className="icon-btn theme-toggle-mobile" 
                    onClick={() => {
                      toggleTheme();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                    aria-label="Toggle theme mobile"
                  >
                    <i className={`bx ${theme === 'dark' ? 'bx-sun' : 'bx-moon'}`} style={{ fontSize: '1.2rem' }}></i>
                  </button>
                </div>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            {/* Search */}
            <div className="search-wrapper">
              <button 
                className="icon-btn" 
                id="search-toggle" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <i className="bx bx-search"></i>
              </button>
              <div className={`search-dropdown ${isSearchOpen ? 'open' : ''}`} id="search-dropdown">
                <form onSubmit={handleSearchSubmit}>
                  <input 
                    type="text" 
                    id="search-input" 
                    placeholder="Search products..." 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    autoComplete="off"
                  />
                  <button type="submit" style={{ display: 'none' }}></button>
                </form>
                <i className="bx bx-search search-icon-inside"></i>
              </div>
            </div>

            {/* Wishlist */}
            <button 
              className="icon-btn" 
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
            >
              <i className="bx bx-heart"></i>
              <span className="badge-dot" id="wishlist-count">{wishlist.length}</span>
            </button>

            {/* Currency Switcher */}
            <div className="currency-switcher desktop-only-action" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label="Select currency"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '4px 28px 4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  outline: 'none',
                }}
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="GBP">£ GBP</option>
              </select>
              <i className="bx bx-chevron-down" style={{ position: 'absolute', right: '8px', pointerEvents: 'none', fontSize: '0.9rem', color: 'var(--text-muted)' }}></i>
            </div>

            {/* Theme Toggle */}
            <button 
              className="icon-btn desktop-only-action" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <i className={`bx ${theme === 'dark' ? 'bx-sun' : 'bx-moon'}`}></i>
            </button>

            {/* Cart */}
            <button 
              className="icon-btn cart-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
            >
              <i className="bx bx-shopping-bag"></i>
              <span className="badge-dot" id="cart-count">{cart.length}</span>
            </button>

            {/* Account dropdown */}
            <div className="account-dropdown-container" style={{ position: 'relative', display: 'inline-block' }}>
              {user ? (
                <div className="user-logged-in-menu" style={{ display: 'flex', alignItems: 'center' }}>
                  <button 
                    className="icon-btn"
                    style={{ fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <i className="bx bx-user-circle" style={{ fontSize: '1.1rem' , marginLeft: '5px'}}></i>
                    <span style={{ maxWidth: '80px', overflow : 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                  <ul 
                    className="dropdown-menu" 
                    id="user-menu"
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      right: 0, 
                      zIndex: 1000, 
                      display: isUserMenuOpen ? 'block' : 'none', 
                      float: 'left', 
                      minWidth: '150px', 
                      padding: '10px', 
                      margin: '10px 0 0', 
                      fontSize: '0.85rem', 
                      color: 'var(--text-primary)', 
                      textAlign: 'left', 
                      listStyle: 'none', 
                      backgroundColor: 'var(--bg-primary)', 
                      backgroundClip: 'padding-box', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px', 
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Admin links removed. Access admin panel directly from https://admin.elegant-furniture-hub.vercel.app/ */}
                    <li style={{ marginBottom: '8px' }}>
                      <Link 
                        href="/orders" 
                        style={{ color: 'var(--text-primary)', display: 'block', padding: '4px 10px', textDecoration: 'none', fontWeight: 600 }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="bx bx-receipt" style={{ marginRight: '6px' }}></i> My Orders
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                        }}
                        style={{ background: 'none', border: 'none', color: '#dc3545', display: 'block', width: '100%', textAlign: 'left', padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <i className="bx bx-log-out" style={{ marginRight: '6px' }}></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link href="/signup" className="icon-btn" aria-label="Account">
                  <i className="bx bx-user"></i>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="icon-btn mobile-menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <i className="bx bx-menu"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Nav Overlay */}
      <div 
        className={`nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Cart Sidebar Drawer */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => {
          setIsCartOpen(false);
          setStartAtCheckout(false);
        }} 
        startAtCheckout={startAtCheckout}
      />

      {/* Wishlist Drawer */}
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* Scroll to Progress implementation effect helper */}
      <ScrollProgressUpdater />
    </>
  );
};

// Internal mini-component to keep layout side-effect free and handle progress bar updates on scroll
const ScrollProgressUpdater: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const bar = document.getElementById('scroll-bar');
      if (!bar) return;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) {
        bar.style.width = (window.scrollY / docH * 100) + '%';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
};
