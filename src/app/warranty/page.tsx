'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function WarrantyPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', padding: '8rem 2rem 5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600, display: 'block', textAlign: 'center' }}>Artisanal Guarantee</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '2rem', textAlign: 'center' }}>Warranty Policy</h1>
          
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              We stand behind the quality, structure, and integrity of each piece crafted in our workshops. Every Royal Furniture item is built using traditional joinery and premium raw materials to ensure it lasts for generations.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Lifetime Structural Frame Warranty</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We provide a <strong>Lifetime Warranty</strong> on solid timber frames, joints, springs, and metal suspensions. If a structural component fail under normal residential use as a result of a defect in materials or workmanship, we will repair or replace it free of charge.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Cushioning & Upholstery Cover</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We offer a <strong>3-Year Limited Warranty</strong> on high-density foam cushions, down-fills, and premium upholstery fabrics (including linen and bouclé) against stitching splits or excessive sagging. Aniline leather hides, due to their organic nature, naturally stretch and exhibit minor wrinkles over time; this is not considered a defect.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Exclusions & Limitations</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              This warranty is valid only for the original purchaser in residential settings. It does not cover damage resulting from:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Direct exposure to sunlight, humidity fluctuations, or heating vents causing timber shifts.</li>
              <li>Improper cleaning, pet claws, chemical stains, or abrasive wear.</li>
              <li>Commercial use or post-purchase modifications.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
