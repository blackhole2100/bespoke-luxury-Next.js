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
    quote: '"Amazing quality and great craftsmanship! The sofa I purchased exceeded my expectations in every way. Highly recommended."',
    name: 'Rahul Sharma',
    location: 'Mumbai',
    avatar: '/images/pic-1.png',
  },
  {
    stars: '★★★★★',
    quote: '"The furniture is stylish, comfortable, and exquisitely made. Customer service was excellent and delivery was right on time."',
    name: 'Sarah Johnson',
    location: 'Delhi',
    avatar: '/images/pic-2.png',
  },
  {
    stars: '★★★★½',
    quote: '"Best purchase ever! The wooden chair is elegant, sturdy, and absolutely beautiful. Will definitely be ordering again."',
    name: 'Amit Verma',
    location: 'Bangalore',
    avatar: '/images/pic-3.png',
  },
  {
    stars: '★★★★★',
    quote: '"Royal Furniture transformed my living room entirely. The attention to detail in each piece is simply unmatched."',
    name: 'Priya Nair',
    location: 'Ahmedabad',
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

      <div className="reviews-track-wrapper" style={{ overflow: 'hidden', position: 'relative' }}>
        <div 
          className="reviews-track" 
          style={{ 
            display: 'flex', 
            transform: `translateX(-${current * 100}%)`, 
            transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' 
          }}
        >
          {REVIEWS.map((review, idx) => (
            <div 
              className="review-card" 
              key={idx}
              style={{ minWidth: '100%', flexShrink: 0, boxSizing: 'border-box' }}
            >
              <div className="review-stars" style={{ color: 'var(--accent)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                {review.stars}
              </div>
              <blockquote style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontStyle: 'italic', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '1.5rem', borderLeft: 'none', paddingLeft: 0 }}>
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
        
        {/* Navigation buttons */}
        <button className="review-nav prev" onClick={handlePrev} style={{ zIndex: 10 }}>
          <i className="bx bx-chevron-left"></i>
        </button>
        <button className="review-nav next" onClick={handleNext} style={{ zIndex: 10 }}>
          <i className="bx bx-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};
