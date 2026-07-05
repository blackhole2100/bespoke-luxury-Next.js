'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Review {
  stars: string;
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

const REVIEWS: Review[] = [
  {
    stars: '★★★★★',
    quote: '"The craftsmanship on the Seraphina modular sectional is exceptional. The linen blend is durable and fits the geometric lines of our penthouse build perfectly."',
    name: 'Marcus Vance',
    location: 'Lead Architect, Soho NY',
    avatar: '/images/pic-1.png',
  },
  {
    stars: '★★★★★',
    quote: '"We specified the Aurelia curved bouclé sofa for a residence in Kensington. The curvilinear layout and density of the down-fill are of unparalleled calibre."',
    name: 'Elena Rostova',
    location: 'Interior Designer, London',
    avatar: '/images/pic-2.png',
  },
  {
    stars: '★★★★★',
    quote: '"Royal Furniture\'s attention to matching timber grain lines in their Toscana entryway cabinet is remarkable. The walnut finish has a beautiful, rich depth."',
    name: 'Devendra Singhania',
    location: 'Luxury Developer, Mumbai',
    avatar: '/images/pic-3.png',
  },
  {
    stars: '★★★★★',
    quote: '"The Saffron velvet occassional lounge chair is the visual anchor of our studio lounge. Sturdy, ergonomic, and aesthetically outstanding. Exceptional customer care."',
    name: 'Amara Jenkins',
    location: 'Visual Director, Los Angeles',
    avatar: '/images/pic-1.png',
  },
];

export const ReviewsCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % REVIEWS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  }, []);

  // Auto scroll reviews every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section className="reviews-section reveal visible" id="reviews">
      <div className="section-header">
        <span className="section-label">Client Stories</span>
        <h2 className="section-heading">What Our Clients <em>Say</em></h2>
      </div>

      <div className="reviews-carousel-container" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 60px' }}>
        <div className="reviews-track-wrapper" style={{ overflow: 'hidden' }}>
          <div 
            className="reviews-track" 
            style={{ 
              display: 'flex', 
              transform: `translateX(-${current * 100}%)`, 
              transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              gap: 0
            }}
          >
            {REVIEWS.map((review, idx) => (
              <div 
                className="review-card" 
                key={idx}
                style={{ width: '100%', minWidth: '100%', flexShrink: 0, boxSizing: 'border-box' }}
              >
                <div className="review-stars" style={{ color: 'var(--accent)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                  {review.stars}
                </div>
                <blockquote style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontStyle: 'italic', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '1.5rem', borderLeft: 'none', paddingLeft: 0, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {review.quote}
                </blockquote>
                <div className="reviewer" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=C8A97E&color=fff`;
                    }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600 }}>{review.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{review.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button className="review-nav prev" onClick={handlePrev} style={{ zIndex: 10, position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <i className="bx bx-chevron-left"></i>
        </button>
        <button className="review-nav next" onClick={handleNext} style={{ zIndex: 10, position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <i className="bx bx-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};
