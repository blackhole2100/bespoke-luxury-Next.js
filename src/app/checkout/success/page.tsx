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
      <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '9rem 2rem 6rem' }}>
        <div style={{ position: 'relative', width: '70px', height: '70px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo1.png" alt="Loading" className="loading-logo-pulse" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes logoPulse {
            0% { opacity: 0.4; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.4; transform: scale(0.95); }
          }
          .loading-logo-pulse {
            animation: logoPulse 1.8s infinite ease-in-out;
          }
        `}} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>Synchronizing invoice & commission details...</p>
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
          .invoice-header {
            padding: 1.25rem 1.5rem !important;
            background: white !important;
            color: black !important;
          }
          .invoice-details {
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
          .invoice-summary {
            padding: 1rem 1.5rem !important;
          }
          .invoice-guarantee {
            padding: 1.25rem 1.5rem !important;
          }
        }
        .step-circle {
          width: 34px; height: 34px;
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
          background: var(--border-strong);
          color: var(--text-secondary);
        }
      `}</style>

      {/* Luxury Brand Greeting Banner */}
      <div className="no-print success-banner" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-strong)', padding: '9rem 1.5rem 3.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '2.5px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', display: 'inline-block', marginBottom: '0.75rem', padding: '4px 14px', background: 'var(--accent-bg)', borderRadius: '100px', border: '1px solid rgba(184, 150, 110, 0.25)' }}>
            Commission Registered Successfully
          </span>
          
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.2' }}>
            Thank you for your patronage, <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{order?.shippingAddress?.fullName ? order.shippingAddress.fullName.split(' ')[0] : 'Valued Client'}</em>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            We have logged your custom order specs. Our master craftsmen will prepare your selections in our SoHo workshop.
          </p>

          {/* Visual Order Progress Tracker */}
          {(() => {
            const orderStatus = order?.status || 'Pending';
            const isFabrication = ['processing', 'shipped', 'delivered'].includes(orderStatus.toLowerCase());
            const isInspection = ['shipped', 'delivered'].includes(orderStatus.toLowerCase());
            const isDelivery = ['delivered'].includes(orderStatus.toLowerCase());

            const step2Active = orderStatus.toLowerCase() === 'processing';
            const step3Active = orderStatus.toLowerCase() === 'shipped';
            const step4Active = orderStatus.toLowerCase() === 'delivered';

            const connectorWidth = isDelivery ? '80%' : (isInspection ? '53%' : (isFabrication ? '26%' : '0%'));

            return (
              <div className="stepper-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '580px', margin: '0 auto', position: 'relative', padding: '0 1rem' }}>
                {/* Horizontal Connector Line */}
                <div className="connector-line" style={{ position: 'absolute', top: '17px', left: '10%', right: '10%', height: '2px', background: 'var(--border-strong)', zIndex: 1 }} />
                <div className="connector-line" style={{ 
                  position: 'absolute', 
                  top: '17px', 
                  left: '10%', 
                  width: connectorWidth, 
                  height: '2px', 
                  background: 'var(--accent)', 
                  zIndex: 2,
                  transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)' 
                }} />

                {/* Step 1: Confirmed */}
                <div className="step-circle-col" style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="step-circle active"><i className="bx bx-check"></i></div>
                  <span className="step-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>Confirmed</span>
                </div>
 
                {/* Step 2: Fabrication */}
                <div className="step-circle-col" style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={isFabrication || step2Active ? 'step-circle active' : 'step-circle pending'} style={{ fontSize: '0.8rem' }}>
                    {isInspection ? <i className="bx bx-check"></i> : '2'}
                  </div>
                  <span className="step-label" style={{ fontSize: '0.75rem', fontWeight: isFabrication || step2Active ? 700 : 600, textTransform: 'uppercase', color: isFabrication || step2Active ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '0.05em' }}>Fabrication</span>
                </div>
 
                {/* Step 3: Inspection */}
                <div className="step-circle-col" style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={isInspection || step3Active ? 'step-circle active' : 'step-circle pending'} style={{ fontSize: '0.8rem' }}>
                    {isDelivery ? <i className="bx bx-check"></i> : '3'}
                  </div>
                  <span className="step-label" style={{ fontSize: '0.75rem', fontWeight: isInspection || step3Active ? 700 : 600, textTransform: 'uppercase', color: isInspection || step3Active ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '0.05em' }}>Inspection</span>
                </div>
 
                {/* Step 4: Delivery */}
                <div className="step-circle-col" style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className={isDelivery || step4Active ? 'step-circle active' : 'step-circle pending'} style={{ fontSize: '0.8rem' }}>
                    {isDelivery ? <i className="bx bx-check"></i> : '4'}
                  </div>
                  <span className="step-label" style={{ fontSize: '0.75rem', fontWeight: isDelivery || step4Active ? 700 : 600, textTransform: 'uppercase', color: isDelivery || step4Active ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '0.05em' }}>Delivery</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Invoice Document Wrapper */}
      <div className="invoice-container" style={{ maxWidth: '880px', margin: '3rem auto', padding: '0 1.25rem 7rem' }}>
        <div className="invoice-wrapper" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(28, 25, 23, 0.08)',
        }}>
          {/* Invoice Header - Premium Dark Contrast Strip */}
          <div className="invoice-header" style={{ background: '#1C1917', color: '#FAF9F7', padding: '2.5rem 3rem', borderBottom: '1px solid #332F2B', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo1.png" alt="Elegant Furniture Hub" style={{ height: '36px', width: 'auto' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '1.5px', fontWeight: 700, color: '#FAF9F7' }}>ELEGANT</span>
                  <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#D4B896', fontWeight: 700 }}>Furniture Hub</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#D4B896', margin: '4px 0', fontWeight: 600 }}>452 West Broadway, SoHo, NY 10012</p>
              <p style={{ fontSize: '0.82rem', color: '#D4B896', margin: '4px 0', fontWeight: 600 }}>+1 (212) 555-8934 · concierge@royalfurniture.com</p>
            </div>
            
            <div className="invoice-header-right" style={{ textAlign: 'right' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 400, color: '#FAF9F7', margin: 0, letterSpacing: '1px' }}>INVOICE</h2>
              <p style={{ color: '#E5C49F', fontWeight: 700, fontSize: '0.95rem', margin: '4px 0' }}>#{invoiceNumber}</p>
              <p style={{ color: '#D4B896', fontSize: '0.82rem', margin: '2px 0', fontWeight: 600 }}>Issued: {orderDate}</p>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '100px',
                background: 'rgba(212, 184, 150, 0.2)',
                color: '#F3E5D8',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '6px',
                border: '1px solid #D4B896'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4B896' }}></span>
                {order?.status || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Billing & Shipping Columns */}
          {order?.shippingAddress && (
            <div className="invoice-details" style={{ padding: '2.25rem 3rem', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bx bx-user" style={{ fontSize: '0.9rem' }}></i>
                  Customer Details
                </h4>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '1rem' }}>{order.shippingAddress.fullName}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '3px 0', fontWeight: 500 }}>{order.shippingAddress.email}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '3px 0', fontWeight: 500 }}>{order.shippingAddress.phone}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bx bx-map-pin" style={{ fontSize: '0.9rem' }}></i>
                  White-Glove Shipping Destination
                </h4>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 4px' }}>{order.shippingAddress.addressLine}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '3px 0', fontWeight: 500 }}>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '4px 0 0', fontStyle: 'italic', fontWeight: 500 }}>Method: Handcrafted Carrier Delivery</p>
              </div>
            </div>
          )}

          {/* Itemized Table - Desktop View */}
          <div className="invoice-table-wrapper desktop-table-only" style={{ padding: '0 3rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-strong)' }}>
                  <th style={{ padding: '14px 8px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', textAlign: 'left' }}>Item Description</th>
                  <th style={{ padding: '14px 8px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '14px 8px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', textAlign: 'right' }}>Unit Value</th>
                  <th style={{ padding: '14px 8px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', textAlign: 'right' }}>Total</th>
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
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-primary)', flexShrink: 0 }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
                      />
                      <div>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.96rem', display: 'block', fontWeight: 600 }}>{item.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Handcrafted Premium Series</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-primary)', fontWeight: 700, textAlign: 'center', fontSize: '0.92rem' }}>{item.quantity}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-secondary)', textAlign: 'right', fontSize: '0.92rem', fontWeight: 500 }}>{formatPrice(item.price)}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-primary)', fontWeight: 700, textAlign: 'right', fontSize: '0.95rem' }}>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Itemized List - Mobile View (Renders on <=640px to prevent table squeezing) */}
          <div className="invoice-mobile-items mobile-items-only" style={{ display: 'none', padding: '1.25rem 1.25rem 0' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Purchased Items
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(order?.items || []).map((item, idx) => (
                <div key={idx} style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-strong)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', flexShrink: 0 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</h5>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Qty: <strong>{item.quantity}</strong> · {formatPrice(item.price)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="invoice-summary" style={{ padding: '2rem 3rem 2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px', background: 'var(--bg-primary)', padding: '1.25rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border-strong)' }}>
              {[
                { label: 'Subtotal', value: formatPrice(order?.totalAmount || 0) },
                { label: 'White Glove Transit', value: 'Complimentary' },
                { label: 'Insurance & Packing', value: 'Included' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', alignItems: 'center' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent)' }}>{formatPrice(order?.totalAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Quality Guarantee Details */}
          <div className="invoice-guarantee" style={{ background: 'var(--bg-primary)', padding: '2rem 3rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Artisanal Guarantee & Support
            </h5>
            <p style={{ margin: 0 }}>
              Thank you for choosing Elegant Furniture Hub. Each piece is crafted using structural timber framing and carries our Lifetime Structural Guarantee. 
              Our white-glove coordination team will reach out directly to schedule custom assembly appointments within 24 to 48 hours. 
              For questions or custom specifications, contact the atelier concierge at <strong style={{ color: 'var(--text-primary)' }}>concierge@royalfurniture.com</strong> or call <strong style={{ color: 'var(--text-primary)' }}>+1 (212) 555-8934</strong>.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="no-print invoice-actions" style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrint}
            className="btn-primary-solid"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 30px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.82rem', boxShadow: '0 4px 14px rgba(184, 150, 110, 0.3)', transition: 'all 0.3s ease' }}
          >
            <i className="bx bx-printer" style={{ fontSize: '1.1rem' }}></i> Print / Save PDF Invoice
          </button>
          <Link 
            href="/product" 
            className="btn-secondary-outline" 
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 30px', textDecoration: 'none', border: '1.5px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.82rem', background: 'var(--bg-secondary)', transition: 'all 0.3s ease' }}
          >
            <i className="bx bx-left-arrow-alt" style={{ fontSize: '1.1rem' }}></i> Return to Shop Catalog
          </Link>
        </div>
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 640px) {
          .success-banner {
            padding: 7.5rem 1rem 3rem !important;
          }
          .invoice-container {
            margin: 1.5rem auto !important;
            padding: 0 0.75rem 7rem !important;
          }
          .invoice-header {
            padding: 1.5rem 1.25rem !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .invoice-header-right {
            text-align: left !important;
          }
          .invoice-details {
            padding: 1.5rem 1.25rem !important;
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .desktop-table-only {
            display: none !important;
          }
          .mobile-items-only {
            display: block !important;
          }
          .invoice-summary {
            padding: 1.25rem 1.25rem 1.75rem !important;
            justify-content: stretch !important;
          }
          .invoice-summary > div {
            width: 100% !important;
          }
          .invoice-guarantee {
            padding: 1.25rem 1.25rem !important;
          }
          .invoice-actions {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          .invoice-actions button, .invoice-actions a {
            width: 100% !important;
          }
          .step-circle {
            width: 28px !important;
            height: 28px !important;
            font-size: 0.75rem !important;
          }
          .step-label {
            font-size: 0.64rem !important;
          }
          .connector-line {
            top: 14px !important;
          }
        }
      `}} />
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '9rem 2rem 6rem' }}>
          <div style={{ position: 'relative', width: '70px', height: '70px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo1.png" alt="Loading" className="loading-logo-pulse" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes logoPulse {
              0% { opacity: 0.4; transform: scale(0.95); }
              50% { opacity: 1; transform: scale(1.05); }
              100% { opacity: 0.4; transform: scale(0.95); }
            }
            .loading-logo-pulse {
              animation: logoPulse 1.8s infinite ease-in-out;
            }
          `}} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>Synchronizing invoice...</p>
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
