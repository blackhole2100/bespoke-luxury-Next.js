'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    zipCode: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { formatPrice } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/orders?orderId=${orderId}`);
        const data = await res.json();
        if (data.success && data.order) setOrder(data.order);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2.5rem', color: 'var(--accent)' }}></i>
      </div>
    );
  }

  const invoiceNumber = orderId
    ? `RF-${orderId.slice(-8).toUpperCase()}`
    : `RF-${Date.now().toString(36).toUpperCase()}`;

  const orderDate = order
    ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <style>{`
        @media print {
          .no-print, .site-header, .site-footer, header, footer, #scroll-progress, .announcement-bar { display: none !important; }
          .invoice-wrapper { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important; 
            padding: 0 !important;
            max-width: 100% !important;
          }
          body { 
            background: white !important; 
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 11px !important;
          }
          /* Tighten spacing for compact single-page print */
          .invoice-wrapper > div:first-child {
            padding: 1.25rem 1.5rem !important;
          }
          .invoice-wrapper > div:nth-child(2) {
            padding: 1.25rem 1.5rem !important;
            gap: 1.5rem !important;
          }
          table {
            margin-top: 0.5rem !important;
          }
          th, td {
            padding: 6px 8px !important;
          }
          td img {
            width: 36px !important;
            height: 36px !important;
          }
          .invoice-wrapper > div:nth-child(4) {
            padding: 1rem 1.5rem !important;
          }
          .invoice-wrapper > div:last-child {
            padding: 1.25rem 1.5rem !important;
          }
        }
        .step-circle {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }
        .step-circle.active {
          background: var(--accent);
          color: white;
          box-shadow: 0 0 0 4px var(--accent-bg);
        }
        .step-circle.pending {
          background: var(--border);
          color: var(--text-muted);
        }
      `}</style>

      {/* Luxury Brand Greeting Banner */}
      <div className="no-print" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', display: 'block', marginBottom: '0.75rem' }}>
            Order Completed Successfully
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: '1.2' }}>
            Thank you for your patronage, <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{order?.shippingAddress?.fullName.split(' ')[0]}</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            We have registered your commission. Our master craftsmen will begin preparing your handcrafted selections in our SoHo workshop.
          </p>

          {/* Visual Order Progress Tracker */}
          {(() => {
            const currentStatus = order?.status || 'Pending';
            const statusMap: Record<string, number> = {
              'Pending': 1,
              'Confirmed': 1,
              'Processing': 2,
              'Fabrication': 2,
              'Shipped': 3,
              'Inspection': 3,
              'Delivered': 4,
              'Delivery': 4
            };
            const activeStep = statusMap[currentStatus] || 1;
            const getProgressWidth = () => {
              if (activeStep >= 4) return '80%';
              if (activeStep === 3) return '53.3%';
              if (activeStep === 2) return '26.6%';
              return '0%';
            };

            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '560px', margin: '0 auto', position: 'relative', padding: '0 1rem' }}>
                {/* Horizontal Connector Line */}
                <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', background: 'var(--border)', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: '16px', left: '10%', width: getProgressWidth(), height: '2px', background: 'var(--accent)', zIndex: 2, transition: 'width 0.4s ease' }} />

                {/* Step 1 */}
                <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={`step-circle ${activeStep >= 1 ? 'active' : 'pending'}`}>
                    {activeStep > 1 ? <i className="bx bx-check"></i> : '1'}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: activeStep >= 1 ? 700 : 600, textTransform: 'uppercase', color: activeStep >= 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>Confirmed</span>
                </div>

                {/* Step 2 */}
                <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={`step-circle ${activeStep >= 2 ? 'active' : 'pending'}`}>
                    {activeStep > 2 ? <i className="bx bx-check"></i> : '2'}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: activeStep >= 2 ? 700 : 600, textTransform: 'uppercase', color: activeStep >= 2 ? 'var(--text-primary)' : 'var(--text-muted)' }}>Fabrication</span>
                </div>

                {/* Step 3 */}
                <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={`step-circle ${activeStep >= 3 ? 'active' : 'pending'}`}>
                    {activeStep > 3 ? <i className="bx bx-check"></i> : '3'}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: activeStep >= 3 ? 700 : 600, textTransform: 'uppercase', color: activeStep >= 3 ? 'var(--text-primary)' : 'var(--text-muted)' }}>Inspection</span>
                </div>

                {/* Step 4 */}
                <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={`step-circle ${activeStep >= 4 ? 'active' : 'pending'}`}>
                    {activeStep > 4 ? <i className="bx bx-check"></i> : '4'}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: activeStep >= 4 ? 700 : 600, textTransform: 'uppercase', color: activeStep >= 4 ? 'var(--text-primary)' : 'var(--text-muted)' }}>Delivery</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Invoice Document Wrapper */}
      <div style={{ maxWidth: '860px', margin: '3rem auto', padding: '0 1.5rem 5rem' }}>
        <div className="invoice-wrapper" style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg, 0 12px 40px rgba(0,0,0,0.06))',
        }}>
          {/* Invoice Header */}
          <div style={{ background: 'var(--bg-secondary)', padding: '3rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="Royal Furniture" style={{ height: '40px', marginBottom: '12px' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0', fontWeight: 500 }}>452 West Broadway, SoHo, NY 10012</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0' }}>+1 (212) 555-8934 · concierge@royalfurniture.com</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 300, color: 'var(--text-primary)', margin: 0, letterSpacing: '1px' }}>INVOICE</h2>
              <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem', margin: '6px 0 4px' }}>#{invoiceNumber}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0' }}>Issued: {orderDate}</p>
              <span style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: '100px',
                background: 'rgba(184,150,110,0.12)',
                color: 'var(--accent)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '8px',
                border: '1px solid rgba(184,150,110,0.2)'
              }}>
                {order?.status || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Billing & Shipping Columns */}
          {order?.shippingAddress && (
            <div style={{ padding: '2.5rem 3rem', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                  Customer Details
                </h4>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px', fontSize: '0.95rem' }}>{order.shippingAddress.fullName}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '3px 0' }}>{order.shippingAddress.email}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '3px 0' }}>{order.shippingAddress.phone}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                  White-Glove Shipping Destination
                </h4>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', margin: '0 0 6px' }}>{order.shippingAddress.addressLine}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '3px 0' }}>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0', fontStyle: 'italic' }}>Method: Handcrafted Carrier Delivery</p>
              </div>
            </div>
          )}

          {/* Itemized Table */}
          <div style={{ padding: '0 3rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '2.5px solid var(--border)' }}>
                  <th style={{ padding: '12px 8px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left' }}>Item Description</th>
                  <th style={{ padding: '12px 8px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '12px 8px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Unit Value</th>
                  <th style={{ padding: '12px 8px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order?.items || []).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
                    <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
                      />
                      <div>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem', display: 'block', fontWeight: 600 }}>{item.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Handcrafted Premium Series</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-secondary)', textAlign: 'right', fontSize: '0.9rem' }}>{formatPrice(item.price)}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-primary)', fontWeight: 700, textAlign: 'right', fontSize: '0.9rem' }}>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div style={{ padding: '2rem 3rem 3rem', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px' }}>
              {[
                { label: 'Subtotal', value: formatPrice(order?.totalAmount || 0) },
                { label: 'White Glove Transit', value: 'Complimentary' },
                { label: 'Insurance & Packing', value: 'Included' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent)' }}>{formatPrice(order?.totalAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Quality Guarantee Details */}
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem 3rem', borderTop: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <h5 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Artisanal Guarantee & Support
            </h5>
            <p style={{ margin: 0 }}>
              Thank you for choosing Royal Furniture. Each piece is crafted using structural timber framing and carries our Lifetime Structural Guarantee. 
              Our white-glove coordination team will reach out directly to schedule custom assembly appointments within 24 to 48 hours. 
              For questions or custom specifications, contact the atelier concierge at <strong>concierge@royalfurniture.com</strong> or call <strong>+1 (212) 555-8934</strong>.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrint}
            className="btn-primary-solid"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', boxShadow: 'var(--shadow-sm)' }}
          >
            <i className="bx bx-printer" style={{ fontSize: '1.1rem' }}></i> Print / Save PDF
          </button>
          <Link 
            href="/product" 
            className="btn-secondary-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', textDecoration: 'none', border: '1.5px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', background: 'transparent', transition: 'all 0.3s' }}
          >
            <i className="bx bx-left-arrow-alt" style={{ fontSize: '1.1rem' }}></i> Return to Shop
          </Link>
        </div>
      </div>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2.5rem', color: 'var(--accent)' }}></i>
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
