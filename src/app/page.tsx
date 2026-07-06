'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSlider } from '@/components/HeroSlider';
import { ReviewsCarousel } from '@/components/ReviewsCarousel';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';

// Countdown Sub-Component
const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Standardize a deadline 24h in the future
    let deadline = localStorage.getItem('rf_deadline');
    if (!deadline) {
      deadline = (Date.now() + 24 * 60 * 60 * 1000).toString();
      localStorage.setItem('rf_deadline', deadline);
    }

    const interval = setInterval(() => {
      const diff = Math.max(0, parseInt(deadline!) - Date.now());
      if (diff === 0) {
        clearInterval(interval);
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="promo-countdown" id="countdown" style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '2rem 0' }}>
      <div className="countdown-unit">
        <span id="cd-hours">{String(timeLeft.hours).padStart(2, '0')}</span>
        <small>Hours</small>
      </div>
      <div className="countdown-sep">:</div>
      <div className="countdown-unit">
        <span id="cd-mins">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <small>Mins</small>
      </div>
      <div className="countdown-sep">:</div>
      <div className="countdown-unit">
        <span id="cd-secs">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <small>Secs</small>
      </div>
    </div>
  );
};

// Custom Hook to animate count values on viewport entry
function useAnimatedCount(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          let start = 0;
          const end = target;
          const totalFrames = Math.round(duration / 16);
          let frame = 0;
          
          const tick = () => {
            frame++;
            const progress = frame / totalFrames;
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            start = Math.floor(easeOutCubic * end);
            setCount(start);
            
            if (frame < totalFrames) {
              requestAnimationFrame(tick);
            } else {
              setCount(end);
            }
          };
          
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [target, duration]);

  return { count, elementRef };
}

export default function Home() {
  const { showToast } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sofa' | 'chair' | 'sale'>('all');
  const [dbLoading, setDbLoading] = useState(true);

  // Stats Counters
  const craftStat = useAnimatedCount(15);
  const clientsStat = useAnimatedCount(12000);
  const designsStat = useAnimatedCount(250);
  const awardsStat = useAnimatedCount(18);

  // Contact Form Fields
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cSubject, setCSubject] = useState('');
  const [cMessage, setCMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Consultation Booking Form Fields
  const [bName, setBName] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bService, setBService] = useState('in-store');
  const [bDate, setBDate] = useState('');
  const [bTime, setBTime] = useState('10:00');
  const [bNotes, setBNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Fetch initial products catalog
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load home products:', err);
      } finally {
        setDbLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cEmail || !cMessage) {
      showToast('Please fill in name, email, and message.', true);
      return;
    }

    setSendingMessage(true);
    setTimeout(() => {
      showToast(`Thank you, ${cName}! Your message was sent successfully. 🎉`);
      setCName('');
      setCPhone('');
      setCEmail('');
      setCSubject('');
      setCMessage('');
      setSendingMessage(false);
    }, 1500);
  };

  // Filter dynamic products locally for fast tab changes
  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sale') return p.badge === 'sale';
    return p.category.toLowerCase() === activeFilter;
  }).slice(0, 6); // Limit home display to signature pieces

  return (
    <>
      <Header />
      
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. TRUST BADGES */}
      <section className="trust-section reveal visible">
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-truck-fast"></i></div>
            <div className="trust-text">
              <h4>Free Delivery</h4>
              <p>On orders over ₹50,000</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-headset"></i></div>
            <div className="trust-text">
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-rotate-left"></i></div>
            <div className="trust-text">
              <h4>30-Day Returns</h4>
              <p>Hassle-free policy</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <div className="trust-text">
              <h4>Secure Checkout</h4>
              <p>100% protected payments</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><i className="fa-solid fa-leaf"></i></div>
            <div className="trust-text">
              <h4>Eco-Friendly</h4>
              <p>Sustainable materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="about-section reveal visible" id="about">
        <div className="about-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/about-img.png" alt="About Royal Furniture" className="about-img-main" />
          <div className="about-stat-card" ref={craftStat.elementRef as React.RefObject<HTMLDivElement>}>
            <div className="stat-number">{craftStat.count}</div>
            <div className="stat-label">Years of Craft</div>
          </div>
        </div>
        <div className="about-content" ref={clientsStat.elementRef as React.RefObject<HTMLDivElement>}>
          <span className="section-label">Our Heritage</span>
          <h2 className="section-heading">A Legacy of <em>Uncompromising</em> Quality</h2>
          <p>Founded in 2010 by <strong>Arthur Rousseau & Vivienne Rousseau</strong>, Royal Furniture began as a boutique design workshop in SOHO, New York City, with a singular vision — to create beautiful, high-quality furniture that marries traditional European joinery with luxury modern minimalism.</p>
          <p>Every piece we create is a testament to our commitment: sourcing only certified sustainable timbers, employing master artisans with generations of expertise, and ensuring that each custom piece exceeds our exacting standards of structural elegance.</p>

          <div className="about-stats">
            <div className="mini-stat">
              <span className="mini-stat-num">{clientsStat.count.toLocaleString('en-IN')}</span><span>+</span>
              <span className="mini-stat-label">Happy Clients</span>
            </div>
            <div className="mini-stat" ref={designsStat.elementRef as React.RefObject<HTMLDivElement>}>
              <span className="mini-stat-num">{designsStat.count}</span><span>+</span>
              <span className="mini-stat-label">Unique Designs</span>
            </div>
            <div className="mini-stat" ref={awardsStat.elementRef as React.RefObject<HTMLDivElement>}>
              <span className="mini-stat-num">{awardsStat.count}</span><span>+</span>
              <span className="mini-stat-label">Design Awards</span>
            </div>
          </div>

          <Link href="/product" className="btn-primary-solid">Explore Collection</Link>
        </div>
      </section>

      {/* 4. CURATED COLLECTION SECTION */}
      <section className="product-section" id="product">
        <div className="section-header reveal visible">
          <span className="section-label">Curated Picks</span>
          <h2 className="section-heading">Our Signature <em>Collection</em></h2>
          <p className="section-subtext">Individually crafted. Endlessly admired. Built to last generations.</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs reveal visible">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Pieces
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'sofa' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sofa')}
          >
            Sofas
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'chair' ? 'active' : ''}`}
            onClick={() => setActiveFilter('chair')}
          >
            Chairs
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'sale' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sale')}
          >
            On Sale
          </button>
        </div>

        <div className="product-grid" id="product-grid">
          {dbLoading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
              <p>Fetching collection from database...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
              No products found.
            </p>
          ) : (
            filteredProducts.map((prod) => (
              <ProductCard product={prod} key={prod._id} />
            ))
          )}
        </div>

        <div className="section-cta reveal visible">
          <Link href="/product" className="btn-primary-solid">
            View Full Collection <i className="bx bx-arrow-back bx-rotate-180"></i>
          </Link>
        </div>
      </section>

      {/* 5. PROMOTION COUNTDOWN */}
      <section className="promo-banner" id="sale-section">
        <div className="promo-content reveal visible">
          <span className="promo-tag">Limited Time Offer</span>
          <h2>Up to <em>50% Off</em> <br />This Week Only</h2>
          <p>Our biggest sale of the year. Don&apos;t let these deals slip away.</p>
          
          <CountdownTimer />
          
          <Link href="/product" className="btn-primary-solid">Shop Sale Items</Link>
        </div>
      </section>

      {/* 6. DESIGN GALLERY MASONRY */}
      <section className="gallery-section reveal visible" id="gallery">
        <div className="section-header">
          <span className="section-label">Spaces We&apos;ve Transformed</span>
          <h2 className="section-heading">Design <em>Gallery</em></h2>
        </div>
        <div className="gallery-masonry">
          <div className="gallery-item tall reveal visible">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/g1.png" alt="Gallery 1" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }} />
            <div className="gallery-item-overlay"><span>Explore →</span></div>
          </div>
          <div className="gallery-item reveal visible" style={{ animationDelay: '0.1s' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/g2.png" alt="Gallery 2" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/images/p2.png'; }} />
            <div className="gallery-item-overlay"><span>Explore →</span></div>
          </div>
          <div className="gallery-item reveal visible" style={{ animationDelay: '0.2s' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/g3.png" alt="Gallery 3" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/images/p3.png'; }} />
            <div className="gallery-item-overlay"><span>Explore →</span></div>
          </div>
          <div className="gallery-item tall reveal visible" style={{ animationDelay: '0.15s' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/animation2.jpg" alt="Gallery 4" loading="lazy" />
            <div className="gallery-item-overlay"><span>Explore →</span></div>
          </div>
          <div className="gallery-item reveal visible" style={{ animationDelay: '0.25s' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/animation4.jpg" alt="Gallery 5" loading="lazy" />
            <div className="gallery-item-overlay"><span>Explore →</span></div>
          </div>
        </div>
      </section>

      {/* 7. CLIENT STORIES */}
      <ReviewsCarousel />

      {/* 7.5 BOOK A CONSULTATION */}
      <section style={{ background: 'var(--bg-secondary)', padding: '6rem 2rem' }} id="consultation">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          {/* Left info panel */}
          <div>
            <span className="section-label">Private Appointment</span>
            <h2 className="section-heading" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>Book a Design <em>Consultation</em></h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>
              Our expert design consultants offer tailored sessions to help you craft the perfect living space.
              Choose between an <strong>In-Store Showcase</strong>, a <strong>Virtual Design Session</strong>, or an exclusive <strong>Home Visit</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: 'bx-store', title: 'In-Store Showcase', desc: 'Explore our SoHo showroom with a dedicated design consultant.' },
                { icon: 'bx-video', title: 'Virtual Session', desc: 'A 45-minute HD video consultation — available globally.' },
                { icon: 'bx-home-circle', title: 'Home Visit', desc: 'Our consultants come to you anywhere in the tri-state area.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--accent-bg, rgba(184,150,110,0.12))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`bx ${icon}`} style={{ color: 'var(--accent)', fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{title}</strong>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0', lineHeight: '1.5' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right booking form */}
          <div style={{ background: 'var(--bg-primary)', borderRadius: '16px', padding: '2.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md, 0 8px 40px rgba(0,0,0,0.08))' }}>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.8rem', color: '#16a34a' }}>
                  <i className="bx bx-check"></i>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  Your consultation request has been received. Our team will confirm within 24 hours via email.
                </p>
                <button onClick={() => { setBookingSuccess(false); setBName(''); setBEmail(''); setBPhone(''); setBNotes(''); }} className="btn-primary-solid" style={{ marginTop: '1.5rem' }}>
                  Book Another
                </button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!bName || !bEmail || !bPhone || !bDate) {
                  showToast('Please fill in all required fields.', true);
                  return;
                }
                setSubmittingBooking(true);
                try {
                  const res = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: bName, email: bEmail, phone: bPhone, service: bService, date: bDate, time: bTime, notes: bNotes }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    setBookingSuccess(true);
                  } else {
                    showToast(data.error || 'Booking failed. Please try again.', true);
                  }
                } catch {
                  showToast('A network error occurred.', true);
                } finally {
                  setSubmittingBooking(false);
                }
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="rf-input-group">
                    <label htmlFor="b-name">Full Name *</label>
                    <input id="b-name" type="text" value={bName} onChange={(e) => setBName(e.target.value)} placeholder="Eleanor Voss" required />
                  </div>
                  <div className="rf-input-group">
                    <label htmlFor="b-phone">Phone *</label>
                    <input id="b-phone" type="tel" value={bPhone} onChange={(e) => setBPhone(e.target.value)} placeholder="+1 212 000 0000" required />
                  </div>
                </div>
                <div className="rf-input-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="b-email">Email Address *</label>
                  <input id="b-email" type="email" value={bEmail} onChange={(e) => setBEmail(e.target.value)} placeholder="eleanor@example.com" required />
                </div>
                <div className="rf-input-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="b-service">Session Type</label>
                  <select id="b-service" value={bService} onChange={(e) => setBService(e.target.value)}>
                    <option value="in-store">In-Store Showcase</option>
                    <option value="virtual">Virtual Design Session</option>
                    <option value="home-visit">Home Visit</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="rf-input-group">
                    <label htmlFor="b-date">Preferred Date *</label>
                    <input id="b-date" type="date" value={bDate} onChange={(e) => setBDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="rf-input-group">
                    <label htmlFor="b-time">Preferred Time</label>
                    <select id="b-time" value={bTime} onChange={(e) => setBTime(e.target.value)}>
                      {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="rf-input-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="b-notes">Additional Notes</label>
                  <textarea id="b-notes" rows={3} value={bNotes} onChange={(e) => setBNotes(e.target.value)} placeholder="Tell us about your space, style preferences, or specific pieces you have in mind..."></textarea>
                </div>
                <button type="submit" className="btn-primary-solid" style={{ width: '100%' }} disabled={submittingBooking}>
                  {submittingBooking ? (
                    <span><i className="bx bx-loader-alt bx-spin" style={{ marginRight: '6px' }}></i>Scheduling...</span>
                  ) : (
                    <span>Request Consultation <i className="bx bx-calendar-plus" style={{ marginLeft: '6px' }}></i></span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 8. CONTACT FORM */}
      <section className="contact-section reveal visible" id="contact">
        <div className="contact-info">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-heading">Let&apos;s Talk <em>Furniture</em></h2>
          <p>Have a question or a custom request? Our design consultants are here to help you create the perfect space.</p>

          <div className="contact-details">
            <a href="tel:+12125558934" className="contact-detail-item">
              <div className="contact-detail-icon"><i className="fa-solid fa-phone"></i></div>
              <div>
                <span className="detail-label">Phone</span>
                <span className="detail-value">+1 (212) 555-8934</span>
              </div>
            </a>
            <a href="mailto:concierge@royalfurniture.com" className="contact-detail-item">
              <div className="contact-detail-icon"><i className="fa-solid fa-envelope"></i></div>
              <div>
                <span className="detail-label">Email</span>
                <span className="detail-value">concierge@royalfurniture.com</span>
              </div>
            </a>
            <div className="contact-detail-item">
              <div className="contact-detail-icon"><i className="fa-solid fa-location-dot"></i></div>
              <div>
                <span className="detail-label">Design Studio</span>
                <span className="detail-value">452 West Broadway, SOHO, NY 10012</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form onSubmit={handleContactSubmit} noValidate>
            <div className="form-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div className="rf-input-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="c-name">Full Name</label>
                <input 
                  type="text" 
                  id="c-name" 
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="John Doe" 
                  required 
                />
              </div>
              <div className="rf-input-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="c-phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="c-phone" 
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                  placeholder="+91 98765 43210" 
                />
              </div>
            </div>
            <div className="rf-input-group">
              <label htmlFor="c-email">Email Address</label>
              <input 
                type="email" 
                id="c-email" 
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
                placeholder="john@example.com" 
                required 
              />
            </div>
            <div className="rf-input-group">
              <label htmlFor="c-subject">Subject</label>
              <select 
                id="c-subject"
                value={cSubject}
                onChange={(e) => setCSubject(e.target.value)}
              >
                <option value="">Select a topic...</option>
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="Custom Order">Custom Order</option>
                <option value="Delivery & Returns">Delivery & Returns</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="rf-input-group">
              <label htmlFor="c-message">Message</label>
              <textarea 
                id="c-message" 
                rows={5} 
                value={cMessage}
                onChange={(e) => setCMessage(e.target.value)}
                placeholder="Tell us about your dream space..."
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn-primary-solid" 
              style={{ width: '100%' }}
              disabled={sendingMessage}
            >
              {sendingMessage ? (
                <span><i className="bx bx-loader-alt bx-spin" style={{ marginRight: '6px' }}></i> Sending...</span>
              ) : (
                <span>Send Message <i className="bx bx-send" style={{ marginLeft: '6px' }}></i></span>
              )}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
