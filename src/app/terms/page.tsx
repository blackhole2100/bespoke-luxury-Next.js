'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="policy-main">
        <div className="policy-card">
          <span className="policy-label">Legal Agreement</span>
          <h1 className="policy-heading">Terms of Service</h1>
          
          <div className="policy-content">
            <p>
              Welcome to Royal Furniture. These Terms of Service govern your use of our website, showrooms, design consultations, and purchasing services. By accessing or using our services, you agree to be bound by these terms.
            </p>

            <h3 className="policy-subheading">1. Ordering & Customization</h3>
            <p>
              All purchases made through our platform are subject to product availability. For bespoke or customized furniture configurations, client approvals on specification blueprints are required prior to workshop fabrication. Once fabrication commences, modifications or cancellations are not permitted.
            </p>

            <h3 className="policy-subheading">2. White-Glove Delivery</h3>
            <p>
              Due to the luxury scale and premium joinery of our furniture, deliveries are executed exclusively via our internal White-Glove courier service. Clients are responsible for ensuring that all structural entrances, staircases, and hallways accommodate the dimensions of the ordered pieces.
            </p>

            <h3 className="policy-subheading">3. Limitation of Liability</h3>
            <p>
              Royal Furniture shall not be liable for any indirect, incidental, or consequential damages resulting from structural changes or environmental wear on timber, aniline leathers, or organic fabrics in client properties.
            </p>

            <h3 className="policy-subheading">4. Amendments</h3>
            <p>
              We reserve the right to amend these Terms of Service at any time. Your continued use of the website or design consultation services after modifications are published constitutes complete acceptance of the updated terms.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
