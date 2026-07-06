'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', padding: '8rem 2rem 5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600, display: 'block', textAlign: 'center' }}>Legal Agreement</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '2rem', textAlign: 'center' }}>Terms of Service</h1>
          
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Welcome to Royal Furniture. These Terms of Service govern your use of our website, showrooms, design consultations, and purchasing services. By accessing or using our services, you agree to be bound by these terms.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Ordering & Customization</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              All purchases made through our platform are subject to product availability. For bespoke or customized furniture configurations, client approvals on specification blueprints are required prior to workshop fabrication. Once fabrication commences, modifications or cancellations are not permitted.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. White-Glove Delivery</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Due to the luxury scale and premium joinery of our furniture, deliveries are executed exclusively via our internal White-Glove courier service. Clients are responsible for ensuring that all structural entrances, staircases, and hallways accommodate the dimensions of the ordered pieces.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Limitation of Liability</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Royal Furniture shall not be liable for any indirect, incidental, or consequential damages resulting from structural changes or environmental wear on timber, aniline leathers, or organic fabrics in client properties.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Amendments</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We reserve the right to amend these Terms of Service at any time. Your continued use of the website or design consultation services after modifications are published constitutes complete acceptance of the updated terms.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
