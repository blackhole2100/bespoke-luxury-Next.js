'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { Order } from '@/types';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading, formatPrice } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    // Check authentication once loading completes
    if (!authLoading) {
      if (!user) {
        setOrdersLoading(false);
        return;
      }
      
      const fetchUserOrders = async () => {
        try {
          const res = await fetch('/api/orders');
          const data = await res.json();
          if (data.success && data.orders) {
            setOrders(data.orders);
          } else {
            console.error('Failed to load orders:', data.error);
          }
        } catch (err) {
          console.error('Network error loading orders:', err);
        } finally {
          setOrdersLoading(false);
        }
      };

      fetchUserOrders();
    }
  }, [user, authLoading]);

  // Loading state
  if (authLoading || (ordersLoading && user)) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '70px', height: '70px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo1.png" alt="Loading" className="loading-logo-pulse" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
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
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Accessing purchase archives...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not Logged In State
  if (!user) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem 5rem' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '3rem 2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo1.png" alt="Access Restructured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', border: '2px solid var(--bg-primary)' }}>
                <i className="bx bx-lock-alt"></i>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Access Restructured</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Please sign in to your Elegant Furniture Hub account to access order tracking, invoices, and purchase history.
            </p>
            <Link 
              href="/signup" 
              style={{ display: 'inline-block', width: '100%', padding: '12px', background: 'var(--accent)', color: 'white', fontWeight: 600, borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', textAlign: 'center', transition: 'all 0.3s ease' }}
            >
              Sign In / Create Account
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="orders-container" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)', padding: '8rem 2rem 5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Header Banner */}
          <div className="orders-header" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
            <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              Client Console
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 300, color: 'var(--text-primary)', margin: 0 }}>
              Order History
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
              Track custom fabrication milestones, review specifications, and print purchase receipts.
            </p>
          </div>

          {/* Orders Content */}
          {orders.length === 0 ? (
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '5rem 3rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo1.png" alt="No Purchases" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.6 }} />
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', border: '2px solid var(--bg-primary)' }}>
                  <i className="bx bx-receipt"></i>
                </div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Purchase History</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
                Your order queue is currently empty. Explore our bespoke catalog to commission your first custom configuration.
              </p>
              <Link 
                href="/product" 
                style={{ display: 'inline-block', padding: '12px 30px', background: 'var(--accent)', color: 'white', fontWeight: 600, borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {orders.map((order) => {
                const dateString = new Date(order.createdAt!).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                
                const status = order.status || 'Pending';
                
                // Color mapping for statuses
                let statusBadgeStyle = { background: 'rgba(120, 113, 108, 0.1)', color: 'var(--text-secondary)', border: '1px solid rgba(120, 113, 108, 0.2)' };
                if (status === 'Processing') {
                  statusBadgeStyle = { background: 'rgba(184, 150, 110, 0.12)', color: 'var(--accent)', border: '1px solid rgba(184, 150, 110, 0.25)' };
                } else if (status === 'Shipped') {
                  statusBadgeStyle = { background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.25)' };
                } else if (status === 'Delivered') {
                  statusBadgeStyle = { background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)' };
                }

                return (
                  <div 
                    key={order._id}
                    className="order-card-container"
                    style={{ 
                      background: 'var(--bg-primary)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease'
                    }}
                  >
                    
                    {/* Card Top Information Bar */}
                    <div className="order-card-header" style={{ background: 'var(--bg-tertiary)', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div className="order-header-info-cols" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Date Placed</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dateString}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Total Invoiced</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent)' }}>{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Order Reference</span>
                          <code style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            #{order._id?.slice(-8).toUpperCase()}
                          </code>
                        </div>
                      </div>
                      <div>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '6px 14px',
                          borderRadius: '100px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          ...statusBadgeStyle
                        }}>
                          {status}
                        </span>
                      </div>
                    </div>

                    {/* Card Body - Items List */}
                    <div className="order-card-body" style={{ padding: '2rem' }}>
                      <div className="order-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="order-item-row"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '1.5rem',
                              borderBottom: idx < order.items.length - 1 ? '1px solid var(--border)' : 'none',
                              paddingBottom: idx < order.items.length - 1 ? '1.5rem' : 0
                            }}
                          >
                            <div style={{ width: '70px', height: '70px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', overflow: 'hidden', flexShrink: 0 }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {item.name}
                              </h4>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Quantity: {item.quantity} · {formatPrice(item.price)} each
                              </span>
                            </div>
                            <div style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Row */}
                      <div className="order-card-actions" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                        <Link 
                          href={`/checkout/success?orderId=${order._id}`}
                          className="track-invoice-btn"
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            padding: '10px 20px', 
                            border: '1px solid var(--accent)', 
                            color: 'var(--accent)', 
                            fontWeight: 600, 
                            borderRadius: '8px', 
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <i className="bx bx-navigation" style={{ fontSize: '1rem' }}></i>
                          Track & View Invoice
                        </Link>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
      <Footer />
      
      {/* Dynamic hover styles injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .order-card-container {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease !important;
        }
        .order-card-container:hover {
          transform: translateY(-4px) !important;
          box-shadow: var(--shadow-md) !important;
        }
        .track-invoice-btn {
          transition: all 0.3s ease !important;
        }
        .track-invoice-btn:hover {
          background-color: var(--accent) !important;
          color: white !important;
        }
      `}} />
    </>
  );
}
