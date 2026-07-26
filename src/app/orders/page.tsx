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
        <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9rem 1.5rem 6rem' }}>
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600 }}>Accessing client purchase archives...</p>
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
        <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9rem 1.25rem 6rem' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-strong)', borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo1.png" alt="Access Restructured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', border: '2px solid var(--bg-secondary)' }}>
                <i className="bx bx-lock-alt"></i>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Client Console Authentication</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Please sign in to your Elegant Furniture Hub account to access order tracking, white-glove delivery milestones, and invoices.
            </p>
            <Link 
              href="/signup" 
              style={{ display: 'inline-block', width: '100%', padding: '14px', background: 'var(--accent)', color: 'white', fontWeight: 700, borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.82rem', textAlign: 'center', boxShadow: '0 4px 14px rgba(184, 150, 110, 0.3)', transition: 'all 0.3s ease' }}
            >
              Sign In / Create Account
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalCommissionsValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <>
      <Header />
      <main className="orders-page-main" style={{ minHeight: '85vh', backgroundColor: 'var(--bg-primary)', padding: '9rem 1.5rem 7rem' }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
          
          {/* Header Banner */}
          <div className="orders-header-banner" style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-strong)', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <span className="section-badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.6rem', padding: '4px 14px', background: 'var(--accent-bg)', borderRadius: '100px', border: '1px solid rgba(184, 150, 110, 0.25)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}></span>
                  Client Console
                </span>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 0.5rem', lineHeight: '1.15' }}>
                  Order History & Invoices
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: 0, maxWidth: '620px', lineHeight: '1.6' }}>
                  Track custom fabrication milestones, review specifications, and download white-glove purchase receipts.
                </p>
              </div>

              {/* Order summary stats bar */}
              {orders.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '10px 18px', borderRadius: '12px', border: '1px solid var(--border-strong)', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', display: 'block', fontWeight: 700 }}>Commissions</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{orders.length}</span>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '10px 18px', borderRadius: '12px', border: '1px solid var(--border-strong)', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', display: 'block', fontWeight: 700 }}>Total Portfolio</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)' }}>{formatPrice(totalCommissionsValue)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Orders Content */}
          {orders.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-strong)', borderRadius: '20px', padding: '5rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ position: 'relative', width: '84px', height: '84px', margin: '0 auto 1.5rem' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo1.png" alt="No Purchases" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.7 }} />
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', border: '2px solid var(--bg-secondary)' }}>
                  <i className="bx bx-receipt"></i>
                </div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>No Purchase Archives</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
                Your order queue is currently empty. Explore our bespoke catalog to commission your first custom furniture piece.
              </p>
              <Link 
                href="/product" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 30px', background: 'var(--accent)', color: 'white', fontWeight: 700, borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.82rem', boxShadow: '0 4px 14px rgba(184, 150, 110, 0.35)' }}
              >
                <i className="bx bx-store-alt" style={{ fontSize: '1.1rem' }}></i> Browse Furniture Catalog
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
              {orders.map((order) => {
                const dateString = new Date(order.createdAt!).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
                
                const status = order.status || 'Pending';
                
                // High contrast status styling
                let statusBadgeStyle = { background: 'rgba(251, 191, 36, 0.18)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.4)', dotColor: '#FBBF24' };
                if (status === 'Processing') {
                  statusBadgeStyle = { background: 'rgba(212, 184, 150, 0.22)', color: '#F3E5D8', border: '1px solid #D4B896', dotColor: '#D4B896' };
                } else if (status === 'Shipped') {
                  statusBadgeStyle = { background: 'rgba(59, 130, 246, 0.25)', color: '#93C5FD', border: '1px solid #60A5FA', dotColor: '#60A5FA' };
                } else if (status === 'Delivered') {
                  statusBadgeStyle = { background: 'rgba(16, 185, 129, 0.25)', color: '#A7F3D0', border: '1px solid #34D399', dotColor: '#34D399' };
                }

                return (
                  <div 
                    key={order._id}
                    className="order-card-container"
                    style={{ 
                      background: 'var(--bg-secondary)', 
                      border: '1px solid var(--border-strong)', 
                      borderRadius: '20px', 
                      overflow: 'hidden', 
                      boxShadow: '0 10px 30px rgba(28, 25, 23, 0.07)',
                      transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease'
                    }}
                  >
                    
                    {/* Card Top Information Bar - Premium Dark Contrast Strip */}
                    <div className="order-card-header" style={{ background: '#1C1917', color: '#FAF9F7', padding: '1.25rem 1.75rem', borderBottom: '1px solid #332F2B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div className="order-header-info-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem', flex: 1, minWidth: 0 }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#D4B896', display: 'block', marginBottom: '3px', fontWeight: 700 }}>Date Placed</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FAF9F7' }}>{dateString}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#D4B896', display: 'block', marginBottom: '3px', fontWeight: 700 }}>Total Invoiced</span>
                          <span style={{ fontSize: '0.98rem', fontWeight: 700, color: '#E5C49F' }}>{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#D4B896', display: 'block', marginBottom: '3px', fontWeight: 700 }}>Order Reference</span>
                          <code style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', background: 'rgba(255,255,255,0.12)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)' }}>
                            #{order._id?.slice(-8).toUpperCase()}
                          </code>
                        </div>
                      </div>

                      <div className="order-status-badge-wrapper">
                        <span style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '100px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          background: statusBadgeStyle.background,
                          color: statusBadgeStyle.color,
                          border: statusBadgeStyle.border
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusBadgeStyle.dotColor }}></span>
                          {status}
                        </span>
                      </div>
                    </div>

                    {/* Card Body - Items List */}
                    <div className="order-card-body" style={{ padding: '1.75rem' }}>
                      <div className="order-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="order-item-row"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '1.25rem',
                              borderBottom: idx < order.items.length - 1 ? '1px solid var(--border)' : 'none',
                              paddingBottom: idx < order.items.length - 1 ? '1.25rem' : 0
                            }}
                          >
                            <div className="order-item-thumb" style={{ width: '72px', height: '72px', borderRadius: '10px', border: '1px solid var(--border-strong)', background: 'var(--bg-primary)', overflow: 'hidden', flexShrink: 0 }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }}
                              />
                            </div>
                            
                            <div className="order-item-details" style={{ flex: 1, minWidth: 0 }}>
                              <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.3' }}>
                                {item.name}
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                                <span>Quantity: <strong style={{ color: 'var(--text-primary)' }}>{item.quantity}</strong></span>
                                <span>·</span>
                                <span>{formatPrice(item.price)} each</span>
                              </div>
                            </div>

                            <div className="order-item-total" style={{ textAlign: 'right', flexShrink: 0 }}>
                              <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Row Total</span>
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Row */}
                      <div className="order-card-actions" style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                        <Link 
                          href={`/checkout/success?orderId=${order._id}`}
                          className="track-invoice-btn"
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            padding: '12px 26px', 
                            background: 'var(--accent)', 
                            color: '#FFFFFF', 
                            fontWeight: 700, 
                            borderRadius: '10px', 
                            fontSize: '0.82rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            boxShadow: '0 4px 14px rgba(184, 150, 110, 0.3)',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <i className="bx bx-file" style={{ fontSize: '1.1rem' }}></i>
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
      
      {/* Dynamic responsive & hover styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .order-card-container:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 16px 36px rgba(28, 25, 23, 0.12) !important;
        }
        .track-invoice-btn:hover {
          background: var(--accent-dark) !important;
          box-shadow: 0 6px 18px rgba(184, 150, 110, 0.45) !important;
        }
        @media (max-width: 640px) {
          .orders-page-main {
            padding: 8.5rem 1rem 7rem !important;
          }
          .order-card-header {
            padding: 1.25rem 1.25rem !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .order-header-info-cols {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
            width: 100% !important;
          }
          .order-status-badge-wrapper {
            margin-top: 0.25rem !important;
          }
          .order-card-body {
            padding: 1.25rem 1rem !important;
          }
          .order-item-row {
            align-items: flex-start !important;
          }
          .order-item-thumb {
            width: 58px !important;
            height: 58px !important;
          }
          .order-item-total {
            text-align: left !important;
            margin-top: 4px !important;
          }
          .track-invoice-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}} />
    </>
  );
}
