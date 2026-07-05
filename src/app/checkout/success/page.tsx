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
          .no-print { display: none !important; }
          .invoice-wrapper { box-shadow: none !important; border: none !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Success Banner */}
      <div className="no-print" style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '2rem' }}>
            <i className="bx bx-check-circle"></i>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.75rem' }}>
            Order Confirmed
          </h1>
          <p style={{ opacity: 0.85, fontSize: '1rem' }}>
            Your order has been placed successfully. A confirmation email has been sent to{' '}
            <strong>{order?.shippingAddress?.email || 'your email'}</strong>.
          </p>
        </div>
      </div>

      {/* Invoice Document */}
      <div style={{ maxWidth: '860px', margin: '3rem auto', padding: '0 1.5rem 5rem' }}>
        <div className="invoice-wrapper" style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
        }}>
          {/* Invoice Header */}
          <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem 3rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo1.png" alt="Royal Furniture" style={{ height: '36px', marginBottom: '8px' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0' }}>SoHo, New York City, NY 10013</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0' }}>+1 (212) 965-0001 · hello@royalfurniture.com</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 300, color: 'var(--text-primary)', margin: 0 }}>INVOICE</h2>
              <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', margin: '4px 0' }}>#{invoiceNumber}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0' }}>Date: {orderDate}</p>
              <span style={{
                display: 'inline-block',
                padding: '3px 12px',
                borderRadius: '20px',
                background: '#dcfce7',
                color: '#16a34a',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '6px'
              }}>
                {order?.status || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Billing & Shipping */}
          {order?.shippingAddress && (
            <div style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Bill To
                </h4>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{order.shippingAddress.fullName}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '2px 0' }}>{order.shippingAddress.email}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '2px 0' }}>{order.shippingAddress.phone}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Ship To
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '2px 0' }}>{order.shippingAddress.addressLine}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '2px 0' }}>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div style={{ padding: '0 3rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Item', 'Qty', 'Unit Price', 'Total'].map((h) => (
                    <th key={h} style={{ padding: '12px 8px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: h === 'Item' ? 'left' : 'right' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(order?.items || []).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '14px 8px', color: 'var(--text-secondary)', textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ padding: '14px 8px', color: 'var(--text-secondary)', textAlign: 'right' }}>{formatPrice(item.price)}</td>
                    <td style={{ padding: '14px 8px', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ padding: '1.5rem 3rem 2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '260px' }}>
              {[
                { label: 'Subtotal', value: formatPrice(order?.totalAmount || 0) },
                { label: 'White Glove Delivery', value: 'Complimentary' },
                { label: 'Tax (included)', value: '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>{formatPrice(order?.totalAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem 3rem', borderTop: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Thank you for choosing Royal Furniture. Our team will contact you within 24–48 hours to schedule your white-glove delivery appointment.
            For queries, email us at <strong>hello@royalfurniture.com</strong> or call <strong>+1 (212) 965-0001</strong>.
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrint}
            className="btn-primary-solid"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="bx bx-printer"></i> Print Invoice
          </button>
          <Link href="/product" className="btn-secondary-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', textDecoration: 'none' }}>
            <i className="bx bx-store"></i> Continue Shopping
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
