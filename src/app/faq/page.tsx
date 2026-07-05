'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I place an order for a custom furniture piece?',
    answer: 'For custom finishes, dimensions, or textile selections, you can reach out directly via our contact form or contact our design concierge at concierge@royalfurniture.com. Our consultants will guide you through wood selection, fabric choices, and outline custom fabrication lead times.'
  },
  {
    question: 'What is White-Glove Delivery and what does it cost?',
    answer: 'White-Glove Delivery is our premium shipping service for luxury furniture. Our trained delivery crew will bring the piece into your room of choice, assemble it, position it according to your guidance, and clear all packaging materials. This service is complimentary on orders above ₹50,000. For orders under ₹50,000, a flat fee of ₹2,500 is applied at checkout.'
  },
  {
    question: 'How long will it take to receive my order?',
    answer: 'In-stock catalog pieces are typically processed within 2–3 business days and delivered within 5–7 business days depending on location. Custom and bespoke commissions are crafted from scratch in our workshops and require 6–10 weeks for completion, packaging, and white-glove transport.'
  },
  {
    question: 'Where is your furniture manufactured?',
    answer: 'All Royal Furniture pieces are designed in our Soho, New York studio and crafted by master artisans in our certified wood workshops using traditional European joinery techniques, sustainably harvested timbers, and top-tier finishes.'
  },
  {
    question: 'How should I care for my aniline leather or bouclé items?',
    answer: 'Aniline leather should be dusted regularly with a dry cloth and treated with premium leather conditioner twice a year to preserve its natural patina. Bouclé and linen fabrics should be vacuumed with a soft brush attachment. Spillages should be blotted immediately with a clean, dry, lint-free cloth without rubbing.'
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', padding: '8rem 2rem 5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600 }}>Support Concierge</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>Frequently Asked Questions</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>Find answers to common inquiries about our craftsmanship, delivery options, and customized bespoke furniture services.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = activeIndex === idx;
              return (
                <div 
                  key={idx} 
                  style={{ 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    transition: 'all 0.3s ease'
                  }}
                >
                  <button 
                    onClick={() => toggleFAQ(idx)}
                    style={{ 
                      width: '100%', 
                      padding: '20px', 
                      background: 'none', 
                      border: 'none', 
                      textAlign: 'left', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: isOpen ? 'var(--accent)' : 'var(--text-primary)', transition: 'color 0.3s' }}>
                      {faq.question}
                    </span>
                    <i 
                      className={`bx bx-chevron-down`} 
                      style={{ 
                        fontSize: '1.5rem', 
                        color: 'var(--text-secondary)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }}
                    ></i>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
