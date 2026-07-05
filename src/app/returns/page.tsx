'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', padding: '8rem 2rem 5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600, display: 'block', textAlign: 'center' }}>Support Services</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '2rem', textAlign: 'center' }}>Returns & Exchanges</h1>
          
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              We take immense pride in the craftsmanship of our furniture. However, if your selected piece does not fully meet your expectations, we are committed to making it right through our streamlined return policy.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. 30-Day Return Guarantee</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Standard catalog items can be returned within <strong>30 days of delivery</strong> for a refund. To be eligible for a return, the furniture piece must be:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>In its original, unused structural condition.</li>
              <li>Free of scratch marks, stains, or cosmetic damages.</li>
              <li>Accompanied by the original bill of sale and purchase records.</li>
            </ul>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Return Collection & Fees</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              To return a heavy furniture piece, please contact our support concierge. We will arrange a professional collection crew to inspect and pick up the item from your home. Please note that return shipping costs (amounting to ₹5,000 for sofas and sectionals, and ₹2,000 for accent chairs) will be deducted from your final refund amount.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Non-Returnable Items</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Please note that custom-made commissions, bespoke fabric selections, or items marked as &quot;Final Sale&quot; are built specifically to your order dimensions and are not eligible for standard returns or exchanges unless structural defects are present upon arrival.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
