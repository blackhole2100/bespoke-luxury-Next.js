'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="policy-main">
        <div className="policy-card">
          <span className="policy-label">Support Services</span>
          <h1 className="policy-heading">Returns & Exchanges</h1>
          
          <div className="policy-content">
            <p>
              We take immense pride in the craftsmanship of our furniture. However, if your selected piece does not fully meet your expectations, we are committed to making it right through our streamlined return policy.
            </p>

            <h3 className="policy-subheading">1. 30-Day Return Guarantee</h3>
            <p>
              Standard catalog items can be returned within <strong>30 days of delivery</strong> for a refund. To be eligible for a return, the furniture piece must be:
            </p>
            <ul>
              <li>In its original, unused structural condition.</li>
              <li>Free of scratch marks, stains, or cosmetic damages.</li>
              <li>Accompanied by the original bill of sale and purchase records.</li>
            </ul>

            <h3 className="policy-subheading">2. Return Collection & Fees</h3>
            <p>
              To return a heavy furniture piece, please contact our support concierge. We will arrange a professional collection crew to inspect and pick up the item from your home. Please note that return shipping costs (amounting to ₹5,000 for sofas and sectionals, and ₹2,000 for accent chairs) will be deducted from your final refund amount.
            </p>

            <h3 className="policy-subheading">3. Non-Returnable Items</h3>
            <p>
              Please note that custom-made commissions, bespoke fabric selections, or items marked as &quot;Final Sale&quot; are built specifically to your order dimensions and are not eligible for standard returns or exchanges unless structural defects are present upon arrival.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
