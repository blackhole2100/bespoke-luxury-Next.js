'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function WarrantyPage() {
  return (
    <>
      <Header />
      <main className="policy-main">
        <div className="policy-card">
          <span className="policy-label">Artisanal Guarantee</span>
          <h1 className="policy-heading">Warranty Policy</h1>
          
          <div className="policy-content">
            <p>
              We stand behind the quality, structure, and integrity of each piece crafted in our workshops. Every Royal Furniture item is built using traditional joinery and premium raw materials to ensure it lasts for generations.
            </p>

            <h3 className="policy-subheading">1. Lifetime Structural Frame Warranty</h3>
            <p>
              We provide a <strong>Lifetime Warranty</strong> on solid timber frames, joints, springs, and metal suspensions. If a structural component fail under normal residential use as a result of a defect in materials or workmanship, we will repair or replace it free of charge.
            </p>

            <h3 className="policy-subheading">2. Cushioning & Upholstery Cover</h3>
            <p>
              We offer a <strong>3-Year Limited Warranty</strong> on high-density foam cushions, down-fills, and premium upholstery fabrics (including linen and bouclé) against stitching splits or excessive sagging. Aniline leather hides, due to their organic nature, naturally stretch and exhibit minor wrinkles over time; this is not considered a defect.
            </p>

            <h3 className="policy-subheading">3. Exclusions & Limitations</h3>
            <p>
              This warranty is valid only for the original purchaser in residential settings. It does not cover damage resulting from:
            </p>
            <ul>
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
