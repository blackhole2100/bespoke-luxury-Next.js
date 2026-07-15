'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="policy-main">
        <div className="policy-card">
          <span className="policy-label">Data Protection</span>
          <h1 className="policy-heading">Privacy Policy</h1>
          
          <div className="policy-content">
            <p>
              At Royal Furniture, we are committed to safeguarding the privacy and security of our clients. This Privacy Policy details how we collect, process, and protect your information when utilizing our website or booking private showroom consultations.
            </p>

            <h3 className="policy-subheading">1. Information We Collect</h3>
            <p>
              We collect information you explicitly provide during showroom bookings, newsletter subscriptions, or catalog checkouts. This includes your name, delivery address, phone number, and preferences gathered during designer consultations.
            </p>

            <h3 className="policy-subheading">2. Use of Information</h3>
            <p>
              Your data is processed strictly to fulfill custom orders, schedule white-glove deliveries, coordinate design consultations, and send customized collection catalogs. We never sell your personal information to third parties.
            </p>

            <h3 className="policy-subheading">3. Data Security</h3>
            <p>
              We implement industry-grade encryption protocols (including SSL/TLS connections and securely signed JWT cookies) to secure data transmissions and prevent unauthorized access to your account and billing history.
            </p>

            <h3 className="policy-subheading">4. Client Rights</h3>
            <p>
              You retain complete rights to access, amend, or delete your personal customer account data. To request data deletion or ask questions regarding our privacy practices, please contact our concierge team.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
