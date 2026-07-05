'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Product, Order, User } from '@/types';




export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, logout, showToast, formatPrice } = useApp();
  
  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users' | 'consultations'>('dashboard');

  // Stats State
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    recentOrders: [] as Order[],
  });

  // Table Data States
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbOrders, setDbOrders] = useState<Order[]>([]);
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // New Product Modal Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pCategory, setPCategory] = useState('sofa');
  const [pImage, setPImage] = useState('/images/p1.png');
  const [pDesc, setPDesc] = useState('');
  const [pBadge, setPBadge] = useState('');
  const [pStock, setPStock] = useState('20');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // 1. Guard route: redirect to login if not admin
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/admin/login');
      }
    }
  }, [user, loading, router]);

  // 2. Fetch Dashboard Analytics and Tables
  const fetchDashboardData = async () => {
    setIsDataLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch products list
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProductsList(prodData.products);
      }

      // Fetch orders list
      const orderRes = await fetch('/api/admin/orders');
      const orderData = await orderRes.json();
      if (orderData.success) {
        setOrdersList(orderData.orders);
      }

      // Fetch users list
      const userRes = await fetch('/api/admin/users');
      const userData = await userRes.json();
      if (userData.success) {
        setUsersList(userData.users);
      }

      // Fetch bookings list
      const bookingRes = await fetch('/api/bookings');
      const bookingData = await bookingRes.json();
      if (bookingData.success) {
        setDbBookings(bookingData.bookings);
      }

    } catch (err) {
      console.error('Failed to load dashboard parameters:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Helper set functions
  const setProductsList = (list: Product[]) => setDbProducts(list);
  const setOrdersList = (list: Order[]) => setDbOrders(list);
  const setUsersList = (list: User[]) => setDbUsers(list);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  // 3. Product CRUD Handlers
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPrice || !pImage || !pDesc) {
      showToast('Please fill in all product specifications.', true);
      return;
    }

    setIsSubmittingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pName,
          price: parseFloat(pPrice),
          category: pCategory,
          image: pImage,
          description: pDesc,
          badge: pBadge || null,
          stock: parseInt(pStock),
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Product created successfully!', false);
        setIsAddModalOpen(false);
        // Clear inputs
        setPName('');
        setPPrice('');
        setPCategory('sofa');
        setPImage('/images/p1.png');
        setPDesc('');
        setPBadge('');
        setPStock('20');
        // Refresh grids
        fetchDashboardData();
      } else {
        showToast(data.error || 'Failed to add product.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('A network error occurred.', true);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Product deleted.', false);
        fetchDashboardData();
      } else {
        showToast(data.error || 'Failed to delete product.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to connect to delete endpoint.', true);
    }
  };

  // 4. Order Status Update Handlers
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status set to "${status}"`, false);
        fetchDashboardData();
      } else {
        showToast(data.error || 'Failed to modify order status.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('A network error occurred during updates.', true);
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
        <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2.5rem', marginBottom: '10px' }}></i>
        <span>Authenticating administrative session...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      {/* Dynamic admin styling override injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-sidebar {
          width: 250px;
          background-color: #1a1a1a;
          color: #fff;
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          padding-top: 2rem;
          z-index: 1000;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }
        .admin-sidebar-brand {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 2rem;
          color: var(--accent);
          letter-spacing: 2px;
        }
        .admin-nav-link {
          color: rgba(255,255,255,0.7);
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .admin-nav-link:hover, .admin-nav-link.active {
          color: #fff;
          background-color: rgba(255,255,255,0.1);
          border-left: 4px solid var(--accent);
        }
        .admin-main-content {
          margin-left: 250px;
          padding: 30px;
          flex: 1;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .admin-stat-card {
          background: var(--bg-primary);
          padding: 20px;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 20px;
          border-left: 4px solid var(--accent);
        }
        .admin-stat-icon {
          width: 50px; height: 50px;
          background: rgba(200, 169, 126, 0.1);
          color: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center; justify-content: center;
          font-size: 1.5rem;
        }
        .admin-content-section {
          background: var(--bg-primary);
          padding: 25px;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 30px;
        }
        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center; justify-content: center;
          z-index: 2000;
        }
        .admin-modal-body {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          padding: 25px;
          box-shadow: var(--shadow-md);
        }
        .form-control, .form-select {
          background: var(--bg-secondary) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
        }
      `}} />

      {/* Admin Sidebar navigation */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-brand">
          Royal<br /><span style={{ fontSize: '1rem', color: 'white' }}>Admin</span>
        </div>
        
        <div className={`admin-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <i className="bx bx-grid-alt"></i> Dashboard
        </div>
        <div className={`admin-nav-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          <i className="bx bx-box"></i> Products
        </div>
        <div className={`admin-nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <i className="bx bx-receipt"></i> Orders
        </div>
        <div className={`admin-nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <i className="bx bx-group"></i> Users
        </div>
        <div className={`admin-nav-link ${activeTab === 'consultations' ? 'active' : ''}`} onClick={() => setActiveTab('consultations')}>
          <i className="bx bx-calendar-check"></i> Consultations
        </div>
        
        <div className="admin-nav-link" style={{ marginTop: 'auto', position: 'absolute', bottom: '20px', width: '100%' }} onClick={logout}>
          <i className="bx bx-log-out"></i> Logout
        </div>
      </div>

      {/* Main Admin dashboard panel */}
      <div className="admin-main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '2rem' }}>
            {activeTab === 'dashboard' && 'Overview'}
            {activeTab === 'products' && 'Product Management'}
            {activeTab === 'orders' && 'Order History'}
            {activeTab === 'users' && 'User Base'}
            {activeTab === 'consultations' && 'Design Consultations'}
          </h2>
          <div>
            <span className="badge bg-success" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Admin Secure Session</span>
          </div>
        </div>

        {isDataLoading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
            <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2.5rem', marginBottom: '10px' }}></i>
            <p>Syncing dashboard files...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW SECTION */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon"><i className="bx bx-rupee"></i></div>
                    <div className="stat-details">
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Revenue</h4>
                      <h2 style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: 600 }}>{formatPrice(stats.totalRevenue)}</h2>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon"><i className="bx bx-box"></i></div>
                    <div className="stat-details">
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Products</h4>
                      <h2 style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: 600 }}>{stats.totalProducts}</h2>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon"><i className="bx bx-user"></i></div>
                    <div className="stat-details">
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Registered Users</h4>
                      <h2 style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: 600 }}>{stats.totalUsers}</h2>
                    </div>
                  </div>
                </div>

                <div className="admin-content-section">
                  <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>Recent Order Logs</h4>
                  {stats.recentOrders.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No client transactions placed yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover" style={{ color: 'var(--text-primary)' }}>
                        <thead>
                          <tr style={{ color: 'var(--text-secondary)', borderBottom: '2px solid var(--border)' }}>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Billing Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentOrders.map((order) => (
                            <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td><code style={{ fontSize: '0.8rem' }}>{order._id}</code></td>
                              <td>{typeof order.user === 'object' ? order.user?.name : 'Guest User'}</td>
                              <td>{formatPrice(order.totalAmount)}</td>
                              <td>
                                <span className={`badge ${
                                  order.status === 'Delivered' ? 'bg-success' : 
                                  order.status === 'Shipped' ? 'bg-info' : 
                                  order.status === 'Processing' ? 'bg-warning' : 'bg-secondary'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>{new Date(order.createdAt!).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PRODUCT MANAGEMENT SECTION */}
            {activeTab === 'products' && (
              <div className="admin-content-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                  <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>Product Inventory</h4>
                  <button className="btn-custom" onClick={() => setIsAddModalOpen(true)} style={{ padding: '8px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                    <i className="bx bx-plus" style={{ marginRight: '6px' }}></i> Add Product
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover" style={{ color: 'var(--text-primary)' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbProducts.map((prod) => (
                        <tr key={prod._id} style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
                          <td>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prod.image} className="product-img-thumb" alt={prod.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} onError={(e) => { (e.target as HTMLImageElement).src = '/images/p1.png'; }} />
                          </td>
                          <td><strong>{prod.name}</strong></td>
                          <td><span className="badge" style={{ background: 'var(--accent)', padding: '5px 10px' }}>{prod.category}</span></td>
                          <td>
                            <span style={{ fontWeight: 600, color: (prod.stock ?? 0) <= 3 ? '#dc3545' : 'inherit' }}>
                              {prod.stock ?? 20}
                            </span>
                          </td>
                          <td>{formatPrice(prod.price)}</td>
                          <td>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteProduct(prod._id!)} aria-label="Delete product">
                              <i className="bx bx-trash" style={{ fontSize: '1.1rem' }}></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS SECTION */}
            {activeTab === 'orders' && (
              <div className="admin-content-section">
                <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                  Manage Customer Orders
                </h4>
                {dbOrders.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No checkout logs located in system.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover" style={{ color: 'var(--text-primary)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total Billing</th>
                          <th>Address</th>
                          <th>Shipment Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbOrders.map((order) => (
                          <tr key={order._id} style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
                            <td><code style={{ fontSize: '0.8rem' }}>{order._id}</code></td>
                            <td>
                              <strong>{typeof order.user === 'object' ? order.user?.name : 'Guest'}</strong>
                              <br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{typeof order.user === 'object' ? order.user?.email : ''}</span>
                            </td>
                            <td>
                              <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '0.85rem' }}>
                                {order.items.map((item, idx) => (
                                  <li key={idx}>{item.name} (x{item.quantity})</li>
                                ))}
                              </ul>
                            </td>
                            <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                            <td style={{ fontSize: '0.85rem' }}>
                              {order.shippingAddress.addressLine}, {order.shippingAddress.city} - {order.shippingAddress.zipCode}
                              <br /><span style={{ color: 'var(--text-secondary)' }}>Phone: {order.shippingAddress.phone}</span>
                            </td>
                            <td>
                              <select 
                                className="form-select form-select-sm"
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order._id!, e.target.value)}
                                style={{ width: '130px', fontSize: '0.85rem' }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* USERS LIST SECTION */}
            {activeTab === 'users' && (
              <div className="admin-content-section">
                <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                  Registered Store Users
                </h4>
                <div className="table-responsive">
                  <table className="table table-hover" style={{ color: 'var(--text-primary)' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                        <th>Name</th>
                        <th>Email Address</th>
                        <th>User Role</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbUsers.map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`} style={{ padding: '4px 8px' }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {new Date(u.createdAt!).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONSULTATIONS SECTION */}
            {activeTab === 'consultations' && (
              <div className="admin-content-section">
                <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                  Scheduled Design Consultations
                </h4>
                {dbBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                    <i className="bx bx-calendar" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                    <p>No consultation bookings received yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover" style={{ color: 'var(--text-primary)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                          <th>Client</th>
                          <th>Email</th>
                          <th>Service</th>
                          <th>Date &amp; Time</th>
                          <th>Notes</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbBookings.map((b) => (
                          <tr key={b._id} style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
                            <td><strong>{b.name}</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.phone}</span></td>
                            <td style={{ fontSize: '0.85rem' }}>{b.email}</td>
                            <td>
                              <span className="badge" style={{ background: 'var(--accent)', padding: '4px 10px', textTransform: 'capitalize' }}>
                                {b.service?.replace('-', ' ')}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>
                              {b.date} &nbsp;·&nbsp; {b.time}
                            </td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '180px' }}>
                              {b.notes || '—'}
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={b.status}
                                onChange={async (e) => {
                                  const res = await fetch(`/api/bookings/${b._id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: e.target.value }),
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    showToast(`Booking status updated to "${e.target.value}"`);
                                    setDbBookings((prev) => prev.map((item) =>
                                      item._id === b._id ? { ...item, status: e.target.value } : item
                                    ));
                                  } else {
                                    showToast('Failed to update booking status.', true);
                                  }
                                }}
                                style={{ width: '130px', fontSize: '0.85rem' }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ===================== ADD PRODUCT MODAL ===================== */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: 0 }}>Add New Product</h5>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddProductSubmit}>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Product Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={pName} 
                  onChange={(e) => setPName(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Price (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={pPrice} 
                    onChange={(e) => setPPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Stock Qty</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={pStock} 
                    onChange={(e) => setPStock(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
                  <select 
                    className="form-select" 
                    value={pCategory} 
                    onChange={(e) => setPCategory(e.target.value)}
                  >
                    <option value="sofa">Sofas</option>
                    <option value="chair">Chairs</option>
                    <option value="decor">Decor</option>
                    <option value="beds">Beds</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Badge</label>
                  <select 
                    className="form-select" 
                    value={pBadge} 
                    onChange={(e) => setPBadge(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Image Path / URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={pImage} 
                  onChange={(e) => setPImage(e.target.value)} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Product Description</label>
                <textarea 
                  className="form-control" 
                  rows={3} 
                  value={pDesc} 
                  onChange={(e) => setPDesc(e.target.value)} 
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '15px', marginTop: '15px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-custom" disabled={isSubmittingProduct} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  {isSubmittingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
