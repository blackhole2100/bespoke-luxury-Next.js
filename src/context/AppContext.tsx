'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Product, CartItem, WishlistItem } from '@/types';

export type Currency = 'INR' | 'USD' | 'GBP';

const CONVERSION_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.012,   // 1 INR ≈ 0.012 USD
  GBP: 0.0095,  // 1 INR ≈ 0.0095 GBP
};
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  GBP: '£',
};

interface ToastState {
  show: boolean;
  message: string;
  isError: boolean;
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  cart: CartItem[];
  wishlist: WishlistItem[];
  theme: 'light' | 'dark';
  toast: ToastState;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInINR: number) => string;
  showToast: (message: string, isError?: boolean) => void;
  hideToast: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartQty: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  toggleTheme: () => void;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', isError: false });
  const [currency, setCurrencyState] = useState<Currency>('INR');

  // Currency helpers
  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('rf_currency', c);
  };

  const formatPrice = useCallback((priceInINR: number): string => {
    const converted = priceInINR * CONVERSION_RATES[currency];
    const symbol = CURRENCY_SYMBOLS[currency];
    if (currency === 'INR') {
      return symbol + converted.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }
    return symbol + converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }, [currency]);

  // 1. Toast Notification Helpers
  const showToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Auto-hide toast after 3.5 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => hideToast(), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // 2. Load Initial Data from Client Storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('rf_theme') as 'light' | 'dark' | null;
    const savedCart = localStorage.getItem('rf_cart');
    const savedWishlist = localStorage.getItem('rf_wishlist');
    const savedCurrency = localStorage.getItem('rf_currency') as Currency | null;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    if (savedCurrency && ['INR', 'USD', 'GBP'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }

    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error('Cart parse error', e); }
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { console.error('Wishlist parse error', e); }
    }

    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. User Authentication Sync
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.success && data.user ? data.user : null);
    } catch (error) {
      console.error('Failed to fetch auth session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 4. Cart Operation Handlers
  const addToCart = (product: Product, quantity = 1) => {
    if (!product._id) return;
    const prodId = product._id;

    setCart((prevCart) => {
      const existingItemIdx = prevCart.findIndex((item) => item.productId === prodId);
      let updatedCart: CartItem[];

      if (existingItemIdx > -1) {
        updatedCart = prevCart.map((item, idx) =>
          idx === existingItemIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updatedCart = [
          ...prevCart,
          { productId: prodId, name: product.name, price: product.price, image: product.image, quantity },
        ];
      }

      localStorage.setItem('rf_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });

    showToast(`"${product.name}" added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.productId !== productId);
      localStorage.setItem('rf_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('rf_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('rf_cart');
  };

  // 5. Wishlist Operation Handlers
  const toggleWishlist = (product: Product) => {
    if (!product._id) return;
    const prodId = product._id;

    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.productId === prodId);
      let updatedWishlist: WishlistItem[];

      if (exists) {
        updatedWishlist = prevWishlist.filter((item) => item.productId !== prodId);
        showToast(`Removed "${product.name}" from wishlist.`);
      } else {
        updatedWishlist = [
          ...prevWishlist,
          { productId: prodId, name: product.name, price: product.price, image: product.image },
        ];
        showToast(`Added "${product.name}" to wishlist. ♥`);
      }

      localStorage.setItem('rf_wishlist', JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  // 6. Theme and User Actions
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('rf_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const logout = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUser(null);
        showToast('Logged out successfully.');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Logout error:', e);
      showToast('Logout request failed.', true);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser,
        cart, wishlist,
        theme, toast,
        currency, setCurrency, formatPrice,
        showToast, hideToast,
        addToCart, removeFromCart, clearCart, updateCartQty,
        toggleWishlist, toggleTheme,
        logout, checkAuth, loading,
      }}
    >
      {children}
      
      {/* Global Toast Notifications Banner */}
      <div className="toast-wrapper">
        <div className={`rf-toast ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : ''}`}>
          <i className={`bx ${toast.isError ? 'bx-error-circle' : 'bx-check-circle'} toast-icon`}></i>
          <span>{toast.message}</span>
          <button 
            onClick={hideToast} 
            className="icon-btn" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            aria-label="Close notification"
          >
            <i className="bx bx-x" style={{ fontSize: '1.2rem' }}></i>
          </button>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
