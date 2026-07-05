'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Slide {
  label: string;
  title: React.ReactNode;
  subtitle: string;
  bgImage: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
}

const SLIDES: Slide[] = [
  {
    label: 'New Collection 2025',
    title: <>Where <em>Luxury</em><br />Meets Living</>,
    subtitle: 'Handcrafted furniture designed for the discerning home.',
    bgImage: '/images/animation1.jpg',
    primaryBtnText: 'Explore Collection',
    primaryBtnLink: '#product',
    secondaryBtnText: 'Our Story',
    secondaryBtnLink: '#about',
  },
  {
    label: 'Exclusive Designs',
    title: <>Crafted for<br /><em>Timeless</em> Style</>,
    subtitle: 'Each piece tells a story of artisanal mastery.',
    bgImage: '/images/animation2.jpg',
    primaryBtnText: 'Shop Now',
    primaryBtnLink: '#product',
    secondaryBtnText: 'View All',
    secondaryBtnLink: '/product',
  },
  {
    label: 'Up to 50% Off',
    title: <>Seasonal<br /><em>Grand Sale</em></>,
    subtitle: 'Limited time deals on our most coveted pieces.',
    bgImage: '/images/animation4.jpg',
    primaryBtnText: 'Grab the Deal',
    primaryBtnLink: '#sale-section',
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay Effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section className="hero" id="home">
      <div className="hero-slider">
        {SLIDES.map((slide, idx) => (
          <div 
            className={`hero-slide ${idx === current ? 'active' : ''}`} 
            key={idx}
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <span className="hero-label">{slide.label}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-actions">
                <Link href={slide.primaryBtnLink} className="btn-primary-solid">
                  {slide.primaryBtnText}
                </Link>
                {slide.secondaryBtnText && slide.secondaryBtnLink && (
                  <Link href={slide.secondaryBtnLink} className="btn-ghost">
                    {slide.secondaryBtnText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <button className="hero-nav prev" onClick={handlePrev} aria-label="Previous slide">
        <i className="bx bx-chevron-left"></i>
      </button>
      <button className="hero-nav next" onClick={handleNext} aria-label="Next slide">
        <i className="bx bx-chevron-right"></i>
      </button>

      {/* Slide Indicators */}
      <div className="hero-indicators">
        {SLIDES.map((_, idx) => (
          <button 
            key={idx}
            className={`indicator ${idx === current ? 'active' : ''}`} 
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>

      {/* Scroll cue */}
      <div className="scroll-cue">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};
