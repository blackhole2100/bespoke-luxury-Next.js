export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id?: string;
  id?: number; // for back-compat with legacy code
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  description: string;
  isNew?: boolean;
  badge?: 'new' | 'sale' | null;
  stock?: number;
  ratings?: {
    average: number;
    count: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
}

export interface Order {
  _id?: string;
  user: string | { _id: string; name: string; email: string };
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    addressLine: string;
    city: string;
    zipCode: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
