'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, setUser, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to dashboard if already authenticated as admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter administrator credentials.', true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.user.role === 'admin') {
          showToast('Authentication successful. Redirecting...', false);
          setUser(data.user);
          router.push('/admin/dashboard');
        } else {
          // If logged in user is a customer, clear token and block them!
          await fetch('/api/auth/logout', { method: 'POST' });
          showToast('Access denied. Administrator privileges required.', true);
        }
      } else {
        showToast(data.error || 'Invalid administrator credentials.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('A network error occurred. Please try again.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    const el = document.getElementById('admin-password') as HTMLInputElement;
    if (el) {
      el.type = el.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', width: '100%', height: '100vh', margin: 0, overflow: 'hidden' }}>
      {/* LEFT HALF: Decorative image for admin */}
      <div className="auth-image" style={{ flex: 1, backgroundImage: "url('/images/animation2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.5), rgba(46,74,61,0.8))', zIndex: 1 }}></div>
        <div className="auth-image-text" style={{ position: 'absolute', bottom: '10%', left: '10%', color: 'white', zIndex: 2, maxWidth: '80%' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Store Management</h1>
          <p style={{ fontSize: '1.2rem', fontWeight: 300, opacity: 0.9 }}>Access the Royal Furniture secure administrative console.</p>
        </div>
      </div>

      {/* RIGHT HALF: Admin Login Form */}
      <div className="auth-form-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'var(--bg-primary)', position: 'relative' }}>
        <Link href="/" className="back-home" style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <i className="bx bx-home-alt"></i> Public Site
        </Link>

        <div className="form-container" style={{ width: '100%', maxWidth: '400px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="bx bx-shield-quarter" style={{ color: '#2E4A3D' }}></i> Admin Portal
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Enter your credentials to manage the store.</p>

          <form onSubmit={handleAdminLoginSubmit}>
            <div className="rf-input-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="admin-username" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                Username / Email
              </label>
              <input 
                type="text" 
                id="admin-username" 
                placeholder="admin@royalfurniture.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 15px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            <div className="rf-input-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <label htmlFor="admin-password" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                Secure Password
              </label>
              <input 
                type="password" 
                id="admin-password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 15px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
              />
              <i 
                className="bx bx-hide password-toggle" 
                style={{ position: 'absolute', right: '15px', top: '40px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.2rem' }}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '14px', background: '#2E4A3D', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s' }}
            >
              {isSubmitting ? (
                <span><i className="bx bx-loader-alt bx-spin" style={{ marginRight: '6px' }}></i> Securing Session...</span>
              ) : (
                <span>Secure Login</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
