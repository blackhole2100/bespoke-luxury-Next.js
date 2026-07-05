'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', padding: '8rem 2rem 5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600, display: 'block', textAlign: 'center' }}>Shipping Policy</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '2rem', textAlign: 'center' }}>White-Glove Delivery</h1>
          
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              At Royal Furniture, we believe that the delivery of your artisanal pieces should be handled with the exact same level of care and precision that went into crafting them. Therefore, we exclusively utilize our signature <strong>White-Glove Delivery Service</strong> for all large furniture items.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Delivery Process</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Once your piece is ready at our workshop, our logistics partner will contact you to schedule a convenient 3-hour delivery window. Our professional delivery crew will:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Carry the wrapped items into your building, upstairs (where elevator access permits), and into your room of choice.</li>
              <li>Unpack and carefully inspect each item in your presence.</li>
              <li>Provide complete assembly, joinery alignment, and leg positioning.</li>
              <li>Remove and clean all cardboard, plastic wrap, and shipping debris from your home.</li>
            </ul>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Pricing & Delivery Fees</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We provide complimentary White-Glove Shipping across the country for all orders exceeding <strong>₹50,000</strong>. For orders below this threshold, a flat delivery fee of <strong>₹2,500</strong> is calculated at checkout to cover transit insurance and professional assembly crew costs.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Inspection & Receipts</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We require you or an authorized representative to be present at the time of delivery to inspect the furniture and sign the delivery receipt. In the highly unlikely event that transit damages are detected, please note them on the delivery receipt and contact our support concierge immediately at concierge@royalfurniture.com to organize a replacement.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
