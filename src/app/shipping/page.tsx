'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="policy-main">
        <div className="policy-card">
          <span className="policy-label">Shipping Policy</span>
          <h1 className="policy-heading">White-Glove Delivery</h1>
          
          <div className="policy-content">
            <p>
              At Royal Furniture, we believe that the delivery of your artisanal pieces should be handled with the exact same level of care and precision that went into crafting them. Therefore, we exclusively utilize our signature <strong>White-Glove Delivery Service</strong> for all large furniture items.
            </p>

            <h3 className="policy-subheading">1. Delivery Process</h3>
            <p>
              Once your piece is ready at our workshop, our logistics partner will contact you to schedule a convenient 3-hour delivery window. Our professional delivery crew will:
            </p>
            <ul>
              <li>Carry the wrapped items into your building, upstairs (where elevator access permits), and into your room of choice.</li>
              <li>Unpack and carefully inspect each item in your presence.</li>
              <li>Provide complete assembly, joinery alignment, and leg positioning.</li>
              <li>Remove and clean all cardboard, plastic wrap, and shipping debris from your home.</li>
            </ul>

            <h3 className="policy-subheading">2. Pricing & Delivery Fees</h3>
            <p>
              We provide complimentary White-Glove Shipping across the country for all orders exceeding <strong>₹50,000</strong>. For orders below this threshold, a flat delivery fee of <strong>₹2,500</strong> is calculated at checkout to cover transit insurance and professional assembly crew costs.
            </p>

            <h3 className="policy-subheading">3. Inspection & Receipts</h3>
            <p>
              We require you or an authorized representative to be present at the time of delivery to inspect the furniture and sign the delivery receipt. In the highly unlikely event that transit damages are detected, please note them on the delivery receipt and contact our support concierge immediately at concierge@royalfurniture.com to organize a replacement.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
