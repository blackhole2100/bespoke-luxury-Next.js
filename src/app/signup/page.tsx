'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function AuthPage() {
  const router = useRouter();
  const { user, setUser, showToast } = useApp();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ pct: 0, color: 'transparent', text: 'Enter a password' });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Autofill if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rf_rem_email');
    if (rememberedEmail) {
      setLoginEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Password Strength Calculation helper
  const calculatePasswordStrength = (val: string) => {
    if (!val) {
      setPasswordStrength({ pct: 0, color: 'transparent', text: 'Enter a password' });
      return;
    }
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[@$!%*#?&]/.test(val)) score++;

    const levels = [
      { pct: 0,   color: 'transparent', text: 'Enter a password' },
      { pct: 20,  color: '#DC2626',      text: 'Very weak' },
      { pct: 40,  color: '#F59E0B',      text: 'Weak' },
      { pct: 60,  color: '#F59E0B',      text: 'Fair' },
      { pct: 80,  color: '#10B981',      text: 'Strong' },
      { pct: 100, color: '#059669',      text: 'Very strong' },
    ];
    setPasswordStrength(levels[score]);
  };

  const togglePasswordVisibility = (inputId: string) => {
    const el = document.getElementById(inputId) as HTMLInputElement;
    if (el) {
      el.type = el.type === 'password' ? 'text' : 'password';
    }
  };

  // Sign In submit handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please fill in all credentials.', true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Welcome back, ${data.user.name}! 🎉`, false);
        setUser(data.user);
        
        if (rememberMe) {
          localStorage.setItem('rf_rem_email', loginEmail);
        } else {
          localStorage.removeItem('rf_rem_email');
        }

        router.push('/');
      } else {
        showToast(data.error || 'Authentication failed.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('A network error occurred. Please try again.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Up submit handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      showToast('Please fill in all fields.', true);
      return;
    }

    if (!agreeTerms) {
      showToast('You must agree to the Terms of Service.', true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Registration successful! Logging you in...', false);
        setUser(data.user);
        router.push('/');
      } else {
        showToast(data.error || 'Registration failed.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('A network error occurred. Please try again.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout" style={{ display: 'flex', width: '100%', minHeight: '100vh', padding: 0 }}>
      
      {/* LEFT PANEL: Luxury Brand Card Banner */}
      <div className="auth-panel-image">
        <div className="auth-image-logo">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo1.png" alt="Royal Furniture" style={{ height: '36px', filter: 'brightness(0) invert(1)' }} />
          </Link>
        </div>
        <div className="auth-image-content">
          <span className="tagline">Welcome to Royal Furniture</span>
          <h2>Design Your<br /><em>Dream Space</em></h2>
          <p>Join thousands of homeowners who trust Royal Furniture to craft spaces that reflect their finest taste.</p>
          
          <div className="auth-testimonial">
            <blockquote>&quot;Royal Furniture transformed my living room. The quality is simply extraordinary.&quot;</blockquote>
            <div className="auth-testimonial-author">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/pic-2.png" 
                alt="Sarah Johnson" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=B8966E&color=fff';
                }}
              />
              <div>
                <strong>Sarah Johnson</strong>
                <span>Verified Customer, Delhi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="auth-panel-form">
        <div className="auth-form-header">
          <Link href="/" className="auth-back-link">
            <i className="bx bx-arrow-back"></i> Back to Home
          </Link>
          <div style={{ visibility: 'hidden' }}>Theme Placeholder</div>
        </div>

        <div className="auth-form-title">
          <h1>{activeTab === 'login' ? 'Welcome Back' : 'Get Started'}</h1>
          <p>{activeTab === 'login' ? 'Sign in to access your dashboard and cart.' : 'Create an account to track orders and save wishlists.'}</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form active">
            <div className="rf-input-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  id="login-email" 
                  placeholder="john@example.com" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="rf-input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  id="login-password" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                />
                <i 
                  className="bx bx-hide pw-toggle" 
                  style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                  onClick={() => togglePasswordVisibility('login-password')}
                ></i>
              </div>
            </div>

            <div className="form-options">
              <label className="check-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="form-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-auth" disabled={isSubmitting}>
              {isSubmitting ? (
                <span><i className="bx bx-loader-alt bx-spin" style={{ marginRight: '6px' }}></i> Logging In...</span>
              ) : (
                <span><i className="bx bx-log-in" style={{ marginRight: '6px' }}></i> Sign In</span>
              )}
            </button>

            <div className="auth-divider">or continue with</div>

            <div className="social-auth">
              <button type="button" className="btn-social" onClick={() => showToast('Social authentication coming soon!')}>
                <i className="bx bxl-google" style={{ color: '#EA4335' }}></i> Google
              </button>
              <button type="button" className="btn-social" onClick={() => showToast('Social authentication coming soon!')}>
                <i className="bx bxl-facebook-square" style={{ color: '#1877F2' }}></i> Facebook
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <span className="form-link" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('signup')}>
                Create one
              </span>
            </p>
          </form>
        ) : (
          // SIGNUP FORM
          <form onSubmit={handleSignUpSubmit} className="auth-form active">
            <div className="rf-input-group">
              <label htmlFor="signup-name">Full Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="signup-name" 
                  placeholder="John Doe" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="rf-input-group">
              <label htmlFor="signup-email">Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  id="signup-email" 
                  placeholder="john@example.com" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="rf-input-group">
              <label htmlFor="signup-password">Password</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  id="signup-password" 
                  placeholder="Min. 8 characters" 
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    calculatePasswordStrength(e.target.value);
                  }}
                  required 
                />
                <i 
                  className="bx bx-hide pw-toggle" 
                  style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                  onClick={() => togglePasswordVisibility('signup-password')}
                ></i>
              </div>
              <div className="password-strength" style={{ marginTop: '8px' }}>
                <div className="strength-bar" style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div 
                    className="strength-fill" 
                    style={{ width: `${passwordStrength.pct}%`, backgroundColor: passwordStrength.color, height: '100%', transition: 'all 0.3s' }}
                  ></div>
                </div>
                <span className="strength-label" style={{ fontSize: '0.72rem', color: passwordStrength.color, display: 'block', marginTop: '4px' }}>
                  {passwordStrength.text}
                </span>
              </div>
            </div>

            <div className="rf-input-group">
              <label className="check-label" style={{ textTransform: 'none', letterSpacing: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span style={{ fontSize: '0.84rem' }}>
                  I agree to the <a href="#" className="form-link">Terms of Service</a> and{' '}
                  <a href="#" className="form-link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-auth" style={{ marginTop: '0.5rem' }} disabled={isSubmitting}>
              {isSubmitting ? (
                <span><i className="bx bx-loader-alt bx-spin" style={{ marginRight: '6px' }}></i> Processing...</span>
              ) : (
                <span><i className="bx bx-user-plus" style={{ marginRight: '6px' }}></i> Create Account</span>
              )}
            </button>

            <div className="auth-divider">or continue with</div>

            <div className="social-auth">
              <button type="button" className="btn-social" onClick={() => showToast('Social authentication coming soon!')}>
                <i className="bx bxl-google" style={{ color: '#EA4335' }}></i> Google
              </button>
              <button type="button" className="btn-social" onClick={() => showToast('Social authentication coming soon!')}>
                <i className="bx bxl-facebook-square" style={{ color: '#1877F2' }}></i> Facebook
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <span className="form-link" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('login')}>
                Sign in
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
