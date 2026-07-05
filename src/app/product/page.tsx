'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

// Main Catalog inner component which accesses search params
const CatalogContent: React.FC = () => {
  const searchParams = useSearchParams();
  const querySearch = searchParams.get('search') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchVal, setSearchVal] = useState(querySearch);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sofa' | 'chair' | 'sale'>('all');
  const [loading, setLoading] = useState(true);

  // Sync search input state if query parameter changes
  useEffect(() => {
    setSearchVal(querySearch);
  }, [querySearch]);

  // Fetch products list on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching catalog products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filter products client-side based on search inputs and category filters
  const filteredProducts = products.filter((p) => {
    // 1. Text Search matching name or category
    const matchesText = p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchVal.toLowerCase());
    
    if (!matchesText) return false;

    // 2. Category Tab filters
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sale') return p.badge === 'sale';
    return p.category.toLowerCase() === activeFilter;
  });

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero reveal visible" style={{ textAlign: 'center', padding: '5rem 2rem 3rem' }}>
        <span className="section-label" style={{ display: 'block', marginBottom: '8px' }}>Handcrafted Excellence</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 300 }}>
          Our Full <em>Collection</em>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Explore every piece in our curated catalogue of luxury furniture
        </p>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem 6rem' }}>
        
        {/* Search Input Bar */}
        <div className="product-search-bar reveal visible" style={{ position: 'relative', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          <input 
            type="text" 
            placeholder="Search by name or type..." 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '14px 20px 14px 50px', 
              fontSize: '1rem', 
              borderRadius: '30px', 
              border: '1.5px solid var(--border)', 
              background: 'var(--bg-secondary)', 
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'all 0.3s'
            }}
          />
          <i className="bx bx-search" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem', color: 'var(--text-muted)' }}></i>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs reveal visible" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '3rem' }}>
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Pieces
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'sofa' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sofa')}
          >
            Sofas
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'chair' ? 'active' : ''}`}
            onClick={() => setActiveFilter('chair')}
          >
            Chairs
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'sale' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sale')}
          >
            On Sale
          </button>
        </div>

        {/* Product Grid */}
        <div className="product-grid" id="product-page-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
              <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2.5rem', marginBottom: '12px' }}></i>
              <p>Syncing product catalogue...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
              <i className="bx bx-search" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
              <p>No pieces found matching your criteria. Try searching for &quot;sofa&quot; or &quot;chair&quot;.</p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <ProductCard product={prod} key={prod._id} />
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2.5rem', marginRight: '10px' }}></i>
          <span>Loading catalog...</span>
        </div>
      }>
        <CatalogContent />
      </Suspense>
      <Footer />
    </>
  );
}
