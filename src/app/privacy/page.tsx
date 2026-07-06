'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', padding: '8rem 2rem 5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600, display: 'block', textAlign: 'center' }}>Data Protection</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '2rem', textAlign: 'center' }}>Privacy Policy</h1>
          
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              At Royal Furniture, we are committed to safeguarding the privacy and security of our clients. This Privacy Policy details how we collect, process, and protect your information when utilizing our website or booking private showroom consultations.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We collect information you explicitly provide during showroom bookings, newsletter subscriptions, or catalog checkouts. This includes your name, delivery address, phone number, and preferences gathered during designer consultations.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Information</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Your data is processed strictly to fulfill custom orders, schedule white-glove deliveries, coordinate design consultations, and send customized collection catalogs. We never sell your personal information to third parties.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We implement industry-grade encryption protocols (including SSL/TLS connections and securely signed JWT cookies) to secure data transmissions and prevent unauthorized access to your account and billing history.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Client Rights</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              You retain complete rights to access, amend, or delete your personal customer account data. To request data deletion or ask questions regarding our privacy practices, please contact our concierge team.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
